"""
DocuTrad AI - Service de Traitement et Reconstruction PDF
Utilise PyMuPDF pour l'extraction textuelle page par page, la détection des
PDF scannés (absence de texte), la préservation de la structure et la reconstruction
du PDF traduit.
"""
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional
import pymupdf as fitz

from .translation_service import TranslationService
from .file_validation import FileValidationService, ValidationError
from ..config import FREE_TIER_MAX_PAGES

class PDFService:
    def __init__(self, translation_service: Optional[TranslationService] = None):
        self.translator = translation_service or TranslationService()

    def inspect_pdf(self, file_path: Path) -> Dict[str, Any]:
        """
        Analyse le PDF sans le modifier :
        - Nombre réel de pages
        - Présence de texte sélectionnable vs document scanné
        - Langue détectée
        - Métadonnées
        """
        doc = fitz.open(file_path)
        page_count = len(doc)
        total_chars = 0
        total_images = 0
        sample_text_chunks = []

        for page in doc:
            text = page.get_text("text").strip()
            total_chars += len(text)
            if text and len(sample_text_chunks) < 5:
                sample_text_chunks.append(text[:200])
            total_images += len(page.get_images())

        doc.close()

        is_scanned = (total_chars < 20 and total_images > 0) or (total_chars == 0 and page_count > 0)
        sample_str = " ".join(sample_text_chunks)
        detected_lang = self.translator.detect_language(sample_str) if not is_scanned else "unknown"

        return {
            "page_count": page_count,
            "total_chars": total_chars,
            "total_images": total_images,
            "is_scanned": is_scanned,
            "detected_lang": detected_lang,
            "requires_ocr": is_scanned,
            "ocr_notice": "Document scanné détecté : aucun texte sélectionnable trouvé. Un module OCR sera requis pour ce type de document." if is_scanned else None
        }

    def process_and_translate_pdf(
        self,
        input_path: Path,
        output_path: Path,
        source_lang: str,
        target_lang: str,
        is_premium: bool = False
    ) -> Dict[str, Any]:
        """
        Lit le PDF d'origine, traduit les blocs de texte et reconstruit un PDF traduit propre.
        """
        inspection = self.inspect_pdf(input_path)
        page_count = inspection["page_count"]

        # 1. Vérification du plafond des 19 pages
        is_allowed, limit_msg = FileValidationService.check_page_limits(page_count, is_premium)
        if not is_allowed:
            raise ValidationError(limit_msg)

        # 2. Vérification PDF scanné
        if inspection["is_scanned"]:
            raise ValidationError(
                "Ce document est un PDF scanné ne contenant aucun texte sélectionnable. "
                "L'extraction directe est impossible sans OCR. Veuillez utiliser un PDF textuel ou un fichier Word DOCX."
            )

        # 3. Traitement page par page
        src_doc = fitz.open(input_path)
        out_doc = fitz.open()  # Nouveau document PDF pour la sortie

        translated_blocks_count = 0
        total_words_translated = 0

        effective_source = source_lang
        if source_lang == "auto":
            effective_source = inspection["detected_lang"]

        for page_idx in range(len(src_doc)):
            page = src_doc[page_idx]
            rect = page.rect
            out_page = out_doc.new_page(width=rect.width, height=rect.height)

            # Extraction par blocs structurés : (x0, y0, x1, y1, text, block_no, block_type)
            # block_type == 0 pour texte, 1 pour image
            blocks = page.get_text("blocks")

            y_cursor = 50.0  # Marge supérieure de base

            for b in blocks:
                if b[6] == 0:  # Bloc de texte
                    raw_text = b[4].strip()
                    if not raw_text:
                        continue

                    # Séparer les lignes et traduire
                    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
                    full_para = " ".join(lines)
                    
                    translated_para = self.translator.translate_chunk(
                        full_para,
                        effective_source,
                        target_lang
                    )

                    translated_blocks_count += 1
                    total_words_translated += len(translated_para.split())

                    # Détection heuristique d'un titre (court, souvent en haut ou en majuscules)
                    is_title = len(full_para) < 60 and (b[1] < 120 or full_para.isupper())
                    font_size = 14 if is_title else 10
                    font_name = "helv"

                    # Insertion du texte dans la nouvelle page
                    # Définir le rectangle d'insertion en préservant la position originale
                    x0 = max(40.0, float(b[0]))
                    y0 = max(40.0, float(b[1]))
                    x1 = min(rect.width - 40.0, max(x0 + 100.0, float(b[2])))
                    y1 = min(rect.height - 40.0, max(y0 + 30.0, float(b[3])))

                    text_rect = fitz.Rect(x0, y0, x1, y1)

                    # Utiliser insert_textbox de PyMuPDF pour un rendu propre avec retour à la ligne automatique
                    rc = out_page.insert_textbox(
                        text_rect,
                        translated_para,
                        fontsize=font_size,
                        fontname=font_name,
                        color=(0.1, 0.1, 0.1)
                    )

                    # Si le texte déborde du cadre d'origine, insérer avec une taille légèrement adaptée
                    if rc < 0:
                        out_page.insert_textbox(
                            fitz.Rect(x0, y0, rect.width - 40, rect.height - 40),
                            translated_para,
                            fontsize=max(8, font_size - 2),
                            fontname=font_name,
                            color=(0.1, 0.1, 0.1)
                        )

        # 4. Sauvegarde du fichier résultant
        output_path.parent.mkdir(parents=True, exist_ok=True)
        out_doc.save(output_path)
        out_doc.close()
        src_doc.close()

        # 5. Vérifier que le fichier résultant n'est pas vide
        if not output_path.exists() or output_path.stat().st_size == 0:
            raise RuntimeError("La génération du document PDF traduit a échoué (fichier de sortie vide).")

        return {
            "success": True,
            "page_count": page_count,
            "translated_blocks": translated_blocks_count,
            "total_words_translated": total_words_translated,
            "source_lang": effective_source,
            "target_lang": target_lang,
            "output_size_bytes": output_path.stat().st_size,
            "output_filename": output_path.name
        }
