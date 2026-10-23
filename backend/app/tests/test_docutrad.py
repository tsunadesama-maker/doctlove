"""
Tests unitaires et d'intégration automatisés pour DocuTrad AI.
Vérifie la conformité avec l'ensemble des critères d'acceptation du cahier des charges.
"""
import pytest
import os
import tempfile
from pathlib import Path
import pymupdf as fitz
from docx import Document
from docx.shared import Pt, RGBColor

from backend.app.services.file_validation import FileValidationService, ValidationError
from backend.app.services.translation_service import TranslationService
from backend.app.services.pdf_service import PDFService
from backend.app.services.docx_service import DOCXService
from backend.app.services.pricing_service import PricingService
from backend.app.config import FREE_TIER_MAX_PAGES, MAX_FILE_SIZE_BYTES

# -------------------------------------------------------------
# Fixtures utilitaires
# -------------------------------------------------------------

@pytest.fixture
def sample_pdf_path(tmp_path):
    """Crée un PDF textuel valide de 3 pages avec titres et paragraphes."""
    pdf_path = tmp_path / "valid_test.pdf"
    doc = fitz.open()
    for i in range(3):
        page = doc.new_page(width=595, height=842)
        page.insert_text((50, 70), f"Section {i+1}: Project Overview and Invoice", fontsize=16)
        page.insert_text((50, 120), f"This document contains important specifications for client agreement dated 09/10/2026.", fontsize=11)
        page.insert_text((50, 160), f"Total amount due is 1,250.50 EUR for user account services.", fontsize=11)
    doc.save(pdf_path)
    doc.close()
    return pdf_path

@pytest.fixture
def scanned_pdf_path(tmp_path):
    """Crée un PDF scanné simulé (contenant une image mais 0 texte sélectionnable)."""
    pdf_path = tmp_path / "scanned_test.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    # Créer un pixmap vide simulant une page numérisée
    pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 100, 100), 1)
    pix.clear_with(255)
    page.insert_image(fitz.Rect(50, 50, 400, 600), pixmap=pix)
    doc.save(pdf_path)
    doc.close()
    return pdf_path

@pytest.fixture
def long_pdf_path(tmp_path):
    """Crée un PDF de 28 pages pour tester le dépassement du plafond gratuit (25 pages)."""
    pdf_path = tmp_path / "long_28_pages.pdf"
    doc = fitz.open()
    for i in range(28):
        page = doc.new_page(width=595, height=842)
        page.insert_text((50, 100), f"Page {i+1} content with textual information.", fontsize=12)
    doc.save(pdf_path)
    doc.close()
    return pdf_path

@pytest.fixture
def sample_docx_path(tmp_path):
    """Crée un fichier Word DOCX avec styles variés (gras, italique), en-tête et tableau."""
    docx_path = tmp_path / "sample_test.docx"
    doc = Document()
    
    # Paragraphe avec styles runs
    p = doc.add_paragraph()
    r1 = p.add_run("Invoice and Contract. ")
    r1.bold = True
    r2 = p.add_run("Confidential agreement for user. ")
    r2.italic = True

    # Tableau avec cellules
    table = doc.add_table(rows=2, cols=2)
    table.cell(0, 0).text = "Description"
    table.cell(0, 1).text = "Amount"
    table.cell(1, 0).text = "Service project"
    table.cell(1, 1).text = "500 EUR"

    doc.save(docx_path)
    return docx_path

# -------------------------------------------------------------
# Tests de Validation & Sécurité
# -------------------------------------------------------------

def test_file_validation_valid_pdf(sample_pdf_path):
    """Vérifie la validation d'un PDF réel conforme."""
    content = sample_pdf_path.read_bytes()
    is_valid, fmt, err = FileValidationService.validate_file_bytes(content, sample_pdf_path.name)
    assert is_valid is True
    assert fmt == "pdf"
    assert err == ""

def test_file_validation_valid_docx(sample_docx_path):
    """Vérifie la validation d'un DOCX réel conforme."""
    content = sample_docx_path.read_bytes()
    is_valid, fmt, err = FileValidationService.validate_file_bytes(content, sample_docx_path.name)
    assert is_valid is True
    assert fmt == "docx"
    assert err == ""

def test_file_validation_reject_unauthorized_extension():
    """Vérifie le rejet strict des extensions non autorisées (.exe, .sh, etc.)."""
    fake_content = b"echo 'hack'"
    is_valid, fmt, err = FileValidationService.validate_file_bytes(fake_content, "malicious.sh")
    assert is_valid is False
    assert "non supporté" in err

def test_file_validation_reject_oversized():
    """Vérifie le rejet d'un fichier dépassant la limite serveur."""
    huge_bytes = b"0" * (MAX_FILE_SIZE_BYTES + 1024)
    is_valid, fmt, err = FileValidationService.validate_file_bytes(huge_bytes, "huge.pdf")
    assert is_valid is False
    assert "dépasse la taille maximale" in err

def test_page_limit_free_tier(long_pdf_path):
    """Vérifie le blocage des documents dépassant 25 pages sur l'offre gratuite."""
    page_count = FileValidationService.count_pdf_pages(long_pdf_path)
    assert page_count == 28
    
    # Doit être refusé en mode gratuit
    is_allowed, msg = FileValidationService.check_page_limits(page_count, is_premium_unlocked=False)
    assert is_allowed is False
    assert "dépasse la limite de l'offre gratuite" in msg

    # Doit être autorisé en mode abonnement / premium débloqué
    is_allowed_premium, _ = FileValidationService.check_page_limits(page_count, is_premium_unlocked=True)
    assert is_allowed_premium is True

def test_scanned_pdf_detection(scanned_pdf_path):
    """Vérifie la détection d'un document scanné ne contenant aucun texte sélectionnable."""
    pdf_service = PDFService()
    inspection = pdf_service.inspect_pdf(scanned_pdf_path)
    assert inspection["is_scanned"] is True
    assert inspection["requires_ocr"] is True
    assert "OCR" in inspection["ocr_notice"]

# -------------------------------------------------------------
# Tests du Moteur de Traduction (TranslationService)
# -------------------------------------------------------------

def test_translation_short_text():
    """Vérifie la traduction d'un texte court avec préservation du sens."""
    service = TranslationService()
    translated = service.translate_chunk("Invoice and contract agreement", "en", "fr")
    assert "facture" in translated.lower()
    assert "contrat" in translated.lower()

def test_translation_entity_preservation():
    """Vérifie que les dates, montants et nombres ne sont pas déformés."""
    service = TranslationService()
    text = "Report on 09/10/2026 with total amount 1,250.50 EUR for client."
    translated = service.translate_chunk(text, "en", "fr")
    # Les entités doivent rester intactes
    assert "09/10/2026" in translated
    assert "1,250.50" in translated

def test_translation_paragraph_order_preservation():
    """Vérifie que l'ordre des paragraphes est strictement préservé."""
    service = TranslationService()
    paras = [
        "1. Introduction to the system.",
        "2. Overview of client specifications.",
        "3. Conclusion and terms and conditions."
    ]
    translated = service.translate_document_paragraphs(paras, "en", "fr")
    assert len(translated) == 3
    assert translated[0].startswith("1.")
    assert translated[1].startswith("2.")
    assert translated[2].startswith("3.")

def test_unsupported_language_handling():
    """Vérifie la levée d'erreur contrôlée pour une langue non supportée."""
    service = TranslationService()
    with pytest.raises(ValueError, match="non prise en charge"):
        service.translate_document_paragraphs(["Hello"], "en", "klingon")

# -------------------------------------------------------------
# Tests de Traitement Documentaire Réel
# -------------------------------------------------------------

def test_pdf_translation_produces_non_empty_file(sample_pdf_path, tmp_path):
    """Vérifie qu'un PDF traduit valide et non vide est réellement produit."""
    pdf_service = PDFService()
    output_pdf = tmp_path / "translated_output.pdf"
    
    result = pdf_service.process_and_translate_pdf(
        sample_pdf_path,
        output_pdf,
        source_lang="en",
        target_lang="fr",
        is_premium=False
    )

    assert result["success"] is True
    assert output_pdf.exists()
    assert output_pdf.stat().st_size > 0
    assert result["page_count"] == 3
    assert result["translated_blocks"] > 0

    # Vérifier que le PDF de sortie est lisible par PyMuPDF
    doc_out = fitz.open(output_pdf)
    assert len(doc_out) == 3
    first_page_text = doc_out[0].get_text()
    assert len(first_page_text) > 0
    doc_out.close()

def test_docx_translation_and_style_preservation(sample_docx_path, tmp_path):
    """Vérifie la traduction DOCX et la préservation des runs (gras, italique) et tableaux."""
    docx_service = DOCXService()
    output_docx = tmp_path / "translated_output.docx"

    result = docx_service.process_and_translate_docx(
        sample_docx_path,
        output_docx,
        source_lang="en",
        target_lang="fr",
        is_premium=False
    )

    assert result["success"] is True
    assert output_docx.exists()
    assert output_docx.stat().st_size > 0

    # Recharger le document Word et vérifier la conservation des runs
    doc = Document(output_docx)
    first_p = doc.paragraphs[0]
    # Le premier run doit être en gras
    assert first_p.runs[0].bold is True
    # Le second run doit être en italique
    assert first_p.runs[1].italic is True
    # Vérifier le tableau
    assert len(doc.tables) == 1
    assert "Description" in doc.tables[0].cell(0, 0).text or "description" in doc.tables[0].cell(0, 0).text.lower()

# -------------------------------------------------------------
# Tests de Tarification
# -------------------------------------------------------------

def test_pricing_quotes():
    """Vérifie les règles tarifaires docLove (0 € <= 25 pages, abonnement 8 € si > 25 pages)."""
    free_quote = PricingService.calculate_quote(5)
    assert free_quote["tier"] == "free"
    assert free_quote["price_eur"] == 0.0

    limit_quote = PricingService.calculate_quote(25)
    assert limit_quote["tier"] == "free"
    assert limit_quote["price_eur"] == 0.0

    sub_quote = PricingService.calculate_quote(30)
    assert sub_quote["tier"] == "subscription"
    assert sub_quote["price_eur"] == 8.0
    assert sub_quote["max_pages_allowed"] == 2000
    assert sub_quote["price_xof"] >= 5000
