"""
DocuTrad AI - Point d'entrée principal Python (CLI & API Engine)
Fournit des commandes scriptables pour inspecter ou traduire des documents.
"""
import sys
import json
import argparse
from pathlib import Path

from .services.file_validation import FileValidationService, ValidationError
from .services.pdf_service import PDFService
from .services.docx_service import DOCXService
from .services.translation_service import TranslationService
from .services.pricing_service import PricingService
from .services.pdf_tools_service import PDFToolsService
from .config import UPLOAD_DIR, OUTPUT_DIR

def run_inspect(file_path_str: str, is_subscribed: bool = False) -> dict:
    file_path = Path(file_path_str)
    if not file_path.exists():
        return {"error": f"Fichier introuvable : {file_path_str}"}

    ext = file_path.suffix.lower()
    if ext == ".pdf":
        pdf_service = PDFService()
        res = pdf_service.inspect_pdf(file_path)
    elif ext == ".docx":
        docx_service = DOCXService()
        res = docx_service.inspect_docx(file_path)
    else:
        return {"error": f"Extension non prise en charge : {ext}"}

    # Calculer le devis tarifaire / abonnement docLove
    quote = PricingService.calculate_quote(res["page_count"], is_subscribed=is_subscribed)
    res["quote"] = quote
    return res

def run_translate(
    input_path_str: str,
    output_path_str: str,
    source_lang: str,
    target_lang: str,
    is_premium: bool = False
) -> dict:
    input_path = Path(input_path_str)
    output_path = Path(output_path_str)

    if not input_path.exists():
        return {"error": f"Fichier source introuvable : {input_path_str}"}

    ext = input_path.suffix.lower()
    if ext == ".pdf":
        pdf_service = PDFService()
        return pdf_service.process_and_translate_pdf(
            input_path, output_path, source_lang, target_lang, is_premium
        )
    elif ext == ".docx":
        docx_service = DOCXService()
        return docx_service.process_and_translate_docx(
            input_path, output_path, source_lang, target_lang, is_premium
        )
    else:
        return {"error": f"Extension non prise en charge : {ext}"}

def main():
    parser = argparse.ArgumentParser(description="DocuTrad AI CLI Engine")
    parser.add_argument("--action", required=True)
    parser.add_argument("--input", type=str, help="Chemin du fichier source")
    parser.add_argument("--inputs", type=str, help="Liste de chemins séparés par des virgules")
    parser.add_argument("--output", type=str, help="Chemin du fichier cible")
    parser.add_argument("--output-dir", type=str, help="Dossier de sortie")
    parser.add_argument("--source", type=str, default="auto", help="Code langue source")
    parser.add_argument("--target", type=str, default="fr", help="Code langue cible")
    parser.add_argument("--premium", action="store_true", help="Débloquer le mode premium")
    parser.add_argument("--subscribed", action="store_true", help="Utilisateur avec abonnement actif")
    parser.add_argument("--angle", type=int, default=90, help="Angle de rotation")
    parser.add_argument("--pages", type=str, default="", help="Pages cibles (ex: 1,3,5)")
    parser.add_argument("--ranges", type=str, default="all", help="Plages de découpage")
    parser.add_argument("--text", type=str, default="CONFIDENTIEL", help="Texte du filigrane")
    parser.add_argument("--signature", type=str, default="Signé numériquement", help="Nom du signataire")
    parser.add_argument("--level", type=str, default="medium", help="Niveau de compression")

    args = parser.parse_args()

    try:
        if args.action == "languages":
            langs = TranslationService.get_supported_languages()
            print(json.dumps({"languages": langs}, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "inspect":
            if not args.input:
                print(json.dumps({"error": "Paramètre --input requis pour inspect"}, ensure_ascii=False))
                sys.exit(1)
            result = run_inspect(args.input, is_subscribed=(args.subscribed or args.premium))
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(0 if "error" not in result else 1)

        elif args.action == "translate":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis pour translate"}, ensure_ascii=False))
                sys.exit(1)
            result = run_translate(
                args.input, args.output, args.source, args.target, args.premium
            )
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(0 if "error" not in result else 1)

        elif args.action == "merge":
            if not args.inputs or not args.output:
                print(json.dumps({"error": "Paramètres --inputs et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            paths = [Path(p.strip()) for p in args.inputs.split(",") if p.strip()]
            res = PDFToolsService.merge_pdfs(paths, Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "split":
            if not args.input or not args.output_dir:
                print(json.dumps({"error": "Paramètres --input et --output-dir requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.split_pdf(Path(args.input), Path(args.output_dir), args.ranges)
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "rotate":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            pages_list = [int(p.strip()) for p in args.pages.split(",") if p.strip().isdigit()] if args.pages else None
            res = PDFToolsService.rotate_pdf(Path(args.input), Path(args.output), args.angle, pages_list)
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "compress":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.compress_pdf(Path(args.input), Path(args.output), args.level)
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "delete_pages":
            if not args.input or not args.output or not args.pages:
                print(json.dumps({"error": "Paramètres --input, --output et --pages requis"}, ensure_ascii=False))
                sys.exit(1)
            del_pages = [int(p.strip()) for p in args.pages.split(",") if p.strip().isdigit()]
            res = PDFToolsService.delete_pages(Path(args.input), Path(args.output), del_pages)
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "watermark":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.add_watermark(Path(args.input), Path(args.output), args.text)
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "sign":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.sign_pdf(Path(args.input), Path(args.output), args.signature)
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "pdf_to_word":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.pdf_to_word(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "word_to_pdf":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.word_to_pdf(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "pdf_to_images":
            if not args.input or not args.output_dir:
                print(json.dumps({"error": "Paramètres --input et --output-dir requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.pdf_to_images(Path(args.input), Path(args.output_dir))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "images_to_pdf":
            if not args.inputs or not args.output:
                print(json.dumps({"error": "Paramètres --inputs et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            paths = [Path(p.strip()) for p in args.inputs.split(",") if p.strip()]
            res = PDFToolsService.images_to_pdf(paths, Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "pdf_to_txt":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.pdf_to_txt(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "crop":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.crop_pdf(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "compress_image":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.compress_image(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "add_image":
            if not args.input or not args.output or not args.inputs:
                print(json.dumps({"error": "Paramètres requis manquants"}, ensure_ascii=False))
                sys.exit(1)
            img_path = Path(args.inputs.split(",")[0].strip())
            res = PDFToolsService.add_image_to_pdf(Path(args.input), img_path, Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "pdf_to_excel":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.pdf_to_excel(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "pdf_to_pptx":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.pdf_to_pptx(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "pdf_to_html":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.pdf_to_html(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action == "pdf_to_svg":
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.pdf_to_svg(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action in ("convert_image", "png_to_jpg", "heic_to_jpg", "image_to_jpg"):
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.convert_image(Path(args.input), Path(args.output), "JPEG")
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        elif args.action in ("mp4_to_mp3", "video_to_gif"):
            if not args.input or not args.output:
                print(json.dumps({"error": "Paramètres --input et --output requis"}, ensure_ascii=False))
                sys.exit(1)
            res = PDFToolsService.extract_audio_from_video(Path(args.input), Path(args.output))
            print(json.dumps(res, ensure_ascii=False))
            sys.exit(0)

        else:
            print(json.dumps({"error": f"Action inconnue : {args.action}"}, ensure_ascii=False))
            sys.exit(1)

    except ValidationError as ve:
        print(json.dumps({"error": str(ve), "type": "validation_error"}, ensure_ascii=False))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e), "type": "internal_error"}, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
