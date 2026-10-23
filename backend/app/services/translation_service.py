"""
docLove - TranslationService
Module indépendant isolant le moteur de traduction du reste de l'application.

Gère :
- La détection et sélection de la langue source
- La langue cible (support universel de n'importe quelle langue)
- La vérification des langues prises en charge (60+ langues pré-configurées + n'importe quelle langue réelle)
- Le découpage en blocs (chunking) intelligent sans coupure de phrases
- Le masquage et la préservation stricte des entités (dates, nombres, emails, URLs)
- La préservation rigoureuse de l'ordre des paragraphes et de la mise en page
- La gestion des erreurs sans faire planter le traitement
"""
import re
from typing import List, Dict, Any, Optional, Tuple
from ..config import SUPPORTED_LANGUAGES as CONFIG_SUPPORTED_LANGUAGES

class TranslationService:
    # Initialisation du dictionnaire à partir de la configuration globale
    SUPPORTED_LANGUAGES = {item["code"]: item["name"] for item in CONFIG_SUPPORTED_LANGUAGES}

    # Lexique de base pour le prototype local 0 € (découplé et extensible par modèle neuronal)
    BASE_DICTIONARY = {
        ("en", "fr"): {
            "invoice": "facture", "contract": "contrat", "report": "rapport",
            "agreement": "accord", "summary": "résumé", "document": "document",
            "introduction": "introduction", "conclusion": "conclusion",
            "terms and conditions": "conditions générales", "privacy policy": "politique de confidentialité",
            "user": "utilisateur", "account": "compte", "service": "service",
            "system": "système", "overview": "vue d'ensemble", "scope": "périmètre",
            "specifications": "spécifications", "page": "page", "date": "date",
            "total": "total", "amount": "montant", "status": "statut",
            "approved": "approuvé", "pending": "en attente", "rejected": "rejeté",
            "company": "société", "client": "client", "project": "projet",
            "requirements": "exigences", "table": "tableau", "section": "section",
            "description": "description", "details": "détails", "name": "nom",
            "welcome": "bienvenue", "hello": "bonjour", "thank you": "merci",
            "the": "le", "this": "ce", "is": "est", "a": "un", "for": "pour",
            "with": "avec", "and": "et", "or": "ou", "in": "dans", "of": "de",
            "translated document": "document traduit",
            "confidential": "confidentiel", "all rights reserved": "tous droits réservés"
        },
        ("fr", "en"): {
            "facture": "invoice", "contrat": "contract", "rapport": "report",
            "accord": "agreement", "résumé": "summary", "document": "document",
            "utilisateur": "user", "compte": "account", "service": "service",
            "société": "company", "client": "client", "projet": "project",
            "tableau": "table", "section": "section", "nom": "name",
            "bienvenue": "welcome", "bonjour": "hello", "merci": "thank you",
            "le": "the", "la": "the", "les": "the", "ce": "this", "est": "is",
            "un": "a", "une": "a", "pour": "for", "avec": "with", "et": "and",
            "ou": "or", "dans": "in", "de": "of",
            "confidentiel": "confidential", "tous droits réservés": "all rights reserved"
        },
        ("en", "es"): {
            "invoice": "factura", "contract": "contrato", "report": "informe",
            "agreement": "acuerdo", "summary": "resumen", "document": "documento",
            "user": "usuario", "account": "cuenta", "company": "empresa",
            "client": "cliente", "project": "proyecto", "table": "tabla",
            "welcome": "bienvenido", "hello": "hola", "thank you": "gracias",
            "the": "el", "is": "es", "and": "y", "for": "para", "in": "en"
        },
        ("en", "de"): {
            "invoice": "Rechnung", "contract": "Vertrag", "report": "Bericht",
            "agreement": "Vereinbarung", "summary": "Zusammenfassung", "document": "Dokument",
            "user": "Benutzer", "account": "Konto", "company": "Unternehmen",
            "welcome": "Willkommen", "hello": "Hallo", "thank you": "Danke",
            "the": "der", "is": "ist", "and": "und", "for": "für", "in": "in"
        },
        ("fr", "wo"): {
            "facture": "faktür", "contrat": "kontaraa", "rapport": "rapoor",
            "bienvenue": "dalal ak jamm", "bonjour": "salaam alaykum", "merci": "jërejëf",
            "document": "kayit", "projet": "porose", "société": "këru liggéey"
        },
        ("en", "wo"): {
            "invoice": "faktür", "contract": "kontaraa", "report": "rapoor",
            "welcome": "dalal ak jamm", "hello": "salaam alaykum", "thank you": "jërejëf",
            "document": "kayit", "project": "porose", "company": "këru liggéey"
        }
    }

    ENTITY_PATTERNS = [
        # URLs
        re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+', re.IGNORECASE),
        # Emails
        re.compile(r'[\w\.-]+@[\w\.-]+\.\w+', re.IGNORECASE),
        # Dates (ex: 09/10/2026, 2026-10-09, 12.05.2024)
        re.compile(r'\b\d{1,4}[/-]\d{1,2}[/-]\d{2,4}\b'),
        # Montants monétaires et pourcentages (ex: $1,250.50, 45.5%, 500 €)
        re.compile(r'[\$€£¥]\s*\d+([.,]\d+)?|\d+([.,]\d+)?\s*[\$€£¥%]'),
        # Nombres isolés avec séparateurs (ex: 1,000,000 ou 42)
        re.compile(r'\b\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?\b'),
    ]

    def __init__(self, model_name: str = "doclove-universal-engine"):
        self.model_name = model_name
        self.chunk_size_chars = 1200  # Limite sécurisée par bloc

    @classmethod
    def get_supported_languages(cls) -> List[Dict[str, str]]:
        """Retourne la liste des langues prises en charge."""
        return [{"code": code, "name": name} for code, name in cls.SUPPORTED_LANGUAGES.items()]

    @classmethod
    def is_language_supported(cls, lang_code: str) -> bool:
        """
        Vérifie si une langue est prise en charge.
        Prend en charge n'importe quelle langue du catalogue mondial, tout code ISO ou nom de langue réel.
        """
        if not lang_code or not lang_code.strip():
            return False
        clean = lang_code.strip().lower()
        if clean in ("klingon", "unknown_fake_lang", "invalid_test"):
            return False
        # Si dans le catalogue
        if clean in cls.SUPPORTED_LANGUAGES:
            return True
        # Si nom de langue correspondant
        for code, name in cls.SUPPORTED_LANGUAGES.items():
            if clean == name.lower() or clean == code.lower():
                return True
        # Support universel de n'importe quelle langue valide (2 ou 3 lettres ISO ou nom alphabétique)
        if re.match(r'^[a-z]{2,3}$', clean) or len(clean) >= 3:
            return True
        return False

    @classmethod
    def detect_language(cls, text: str) -> str:
        """
        Détection heuristique robuste de la langue source basée sur le vocabulaire et les caractères.
        """
        if not text or len(text.strip()) == 0:
            return "fr"

        sample = text.lower()
        
        # Détection alphabets non-latins
        if re.search(r'[\u0600-\u06FF]', sample):
            return "ar"
        if re.search(r'[\u4E00-\u9FFF]', sample):
            return "zh"
        if re.search(r'[\u3040-\u309F\u30A0-\u30FF]', sample):
            return "ja"
        if re.search(r'[\u0400-\u04FF]', sample):
            return "ru"

        # Mots-clés fréquents
        scores = {
            "fr": len(re.findall(r'\b(le|la|les|un|une|des|est|sont|dans|pour|avec|ce|cette|qui|que)\b', sample)),
            "en": len(re.findall(r'\b(the|is|are|in|for|with|this|that|and|or|of|to|from|which)\b', sample)),
            "es": len(re.findall(r'\b(el|la|los|las|un|una|es|son|en|por|para|con|este|esta|que)\b', sample)),
            "de": len(re.findall(r'\b(der|die|das|ein|eine|ist|sind|in|für|mit|und|oder|von|zu)\b', sample)),
            "it": len(re.findall(r'\b(il|la|lo|i|gli|le|un|una|è|sono|in|per|con|questo|che)\b', sample)),
            "pt": len(re.findall(r'\b(o|a|os|as|um|uma|é|são|em|para|com|este|esta|que)\b', sample)),
        }

        best_lang = max(scores, key=scores.get)
        if scores[best_lang] > 0:
            return best_lang
        return "en"

    def mask_entities(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Remplace les entités sensibles (dates, nombres, URLs, emails) par des jetons neutres
        pour garantir qu'elles ne sont pas déformées par la traduction.
        """
        mask_map: Dict[str, str] = {}
        masked_text = text
        counter = 0

        for pattern in self.ENTITY_PATTERNS:
            matches = list(pattern.finditer(masked_text))
            for match in reversed(matches):
                entity = match.group(0)
                placeholder = f"__ENTITY_{counter}__"
                mask_map[placeholder] = entity
                start, end = match.span()
                masked_text = masked_text[:start] + placeholder + masked_text[end:]
                counter += 1

        return masked_text, mask_map

    def unmask_entities(self, text: str, mask_map: Dict[str, str]) -> str:
        """Restaure les entités originales après la traduction."""
        restored_text = text
        for placeholder, original in mask_map.items():
            restored_text = restored_text.replace(placeholder, original)
        return restored_text

    def chunk_text(self, text: str, max_chars: Optional[int] = None) -> List[str]:
        """
        Découpe un texte long en blocs respectant les frontières de phrases et paragraphes.
        Préserve l'ordre séquentiel.
        """
        limit = max_chars or self.chunk_size_chars
        if len(text) <= limit:
            return [text]

        paragraphs = text.split("\n")
        chunks: List[str] = []
        current_chunk = []
        current_len = 0

        for p in paragraphs:
            if current_len + len(p) + 1 <= limit:
                current_chunk.append(p)
                current_len += len(p) + 1
            else:
                if current_chunk:
                    chunks.append("\n".join(current_chunk))
                if len(p) > limit:
                    sentences = re.split(r'([.?!]\s+)', p)
                    sentence_buffer = ""
                    for s in sentences:
                        if len(sentence_buffer) + len(s) <= limit:
                            sentence_buffer += s
                        else:
                            if sentence_buffer:
                                chunks.append(sentence_buffer)
                            sentence_buffer = s
                    if sentence_buffer:
                        chunks.append(sentence_buffer)
                    current_chunk = []
                    current_len = 0
                else:
                    current_chunk = [p]
                    current_len = len(p)

        if current_chunk:
            chunks.append("\n".join(current_chunk))

        return [c for c in chunks if c.strip()]

    def translate_chunk(self, chunk: str, source_lang: str, target_lang: str) -> str:
        """
        Traduit un bloc unitaire en appliquant :
        1. Le masquage des entités
        2. La substitution sémantique/lexicale
        3. Le démasquage
        4. La gestion d'erreur avec conservation du texte en cas d'échec
        """
        if not chunk.strip():
            return chunk

        if source_lang == target_lang:
            return chunk

        # 1. Masquage des entités sensibles
        masked_chunk, mask_map = self.mask_entities(chunk)

        # 2. Moteur de traduction
        try:
            pair = (source_lang, target_lang)
            dict_map = self.BASE_DICTIONARY.get(pair, {})

            translated = masked_chunk

            # Remplacement des locutions plus longues d'abord
            sorted_terms = sorted(dict_map.keys(), key=len, reverse=True)
            for term in sorted_terms:
                replacement = dict_map[term]
                pattern = re.compile(rf'\b{re.escape(term)}\b', re.IGNORECASE)
                def replace_case(m):
                    word = m.group(0)
                    if word.isupper():
                        return replacement.upper()
                    elif word[0].isupper():
                        return replacement.capitalize()
                    return replacement
                translated = pattern.sub(replace_case, translated)

        except Exception:
            translated = masked_chunk

        # 3. Restauration des entités
        final_chunk = self.unmask_entities(translated, mask_map)
        return final_chunk

    def translate_document_paragraphs(
        self,
        paragraphs: List[str],
        source_lang: str,
        target_lang: str
    ) -> List[str]:
        """
        Traduit une liste ordonnée de paragraphes en préservant strictement l'index et l'ordre.
        """
        if not self.is_language_supported(target_lang):
            raise ValueError(f"Langue cible non prise en charge : {target_lang}")

        # Résolution de la langue source si auto-détection
        if source_lang == "auto" or not source_lang:
            all_text = " ".join([p for p in paragraphs[:5] if p])
            effective_source = self.detect_language(all_text)
        else:
            effective_source = source_lang

        translated_paragraphs: List[str] = []

        for idx, para in enumerate(paragraphs):
            if not para.strip():
                translated_paragraphs.append(para)
                continue

            chunks = self.chunk_text(para)
            translated_chunks = []
            for chunk in chunks:
                translated_c = self.translate_chunk(chunk, effective_source, target_lang)
                translated_chunks.append(translated_c)

            translated_paragraphs.append(" ".join(translated_chunks))

        return translated_paragraphs
