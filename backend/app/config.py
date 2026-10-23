"""
docLove - Configuration du Système
Paramètres de validation, de stockage, de limites, de tarification et de langues universelles.
"""
from pathlib import Path

# Chemins de stockage sécurisés (en dehors du dossier public web)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
OUTPUT_DIR = STORAGE_DIR / "outputs"

# S'assurer que les répertoires existent
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Limites de sécurité
MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 Mo
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

# Règles de tarification & abonnement docLove
# Gratuit jusqu'à 25 pages par document
FREE_TIER_MAX_PAGES = 25
# Au-delà de 25 pages : Abonnement mensuel à 8 € / mois pour jusqu'à 2 000 pages
SUBSCRIPTION_MONTHLY_PRICE_EUR = 8.0
SUBSCRIPTION_MONTHLY_PRICE_XOF = 5250  # ~8 € en FCFA
SUBSCRIPTION_MONTHLY_MAX_PAGES = 2000

# Délais de rétention temporaire (en secondes)
FILE_RETENTION_SECONDS = 1800  # 30 minutes

# Moteur de traduction par défaut
DEFAULT_SOURCE_LANG = "auto"
DEFAULT_TARGET_LANG = "fr"

# Liste étendue des langues du monde (100+ langues + support universel de n'importe quelle langue)
SUPPORTED_LANGUAGES = [
    {"code": "fr", "name": "Français", "native": "Français"},
    {"code": "en", "name": "Anglais", "native": "English"},
    {"code": "es", "name": "Espagnol", "native": "Español"},
    {"code": "de", "name": "Allemand", "native": "Deutsch"},
    {"code": "it", "name": "Italien", "native": "Italiano"},
    {"code": "pt", "name": "Portugais", "native": "Português"},
    {"code": "nl", "name": "Néerlandais", "native": "Nederlands"},
    {"code": "ru", "name": "Russe", "native": "Русский"},
    {"code": "zh", "name": "Chinois (simplifié)", "native": "简体中文"},
    {"code": "ja", "name": "Japonais", "native": "日本語"},
    {"code": "ar", "name": "Arabe", "native": "العربية", "rtl": True},
    {"code": "tr", "name": "Turc", "native": "Türkçe"},
    {"code": "pl", "name": "Polonais", "native": "Polski"},
    {"code": "sv", "name": "Suédois", "native": "Svenska"},
    {"code": "da", "name": "Danois", "native": "Dansk"},
    {"code": "fi", "name": "Finnois", "native": "Suomi"},
    {"code": "no", "name": "Norvégien", "native": "Norsk"},
    {"code": "el", "name": "Grec", "native": "Ελληνικά"},
    {"code": "cs", "name": "Tchèque", "native": "Čeština"},
    {"code": "ro", "name": "Roumain", "native": "Română"},
    {"code": "hu", "name": "Hongrois", "native": "Magyar"},
    {"code": "ko", "name": "Coréen", "native": "한국어"},
    {"code": "hi", "name": "Hindi", "native": "हिन्दी"},
    {"code": "vi", "name": "Vietnamien", "native": "Tiếng Việt"},
    {"code": "id", "name": "Indonésien", "native": "Bahasa Indonesia"},
    # Langues africaines & régionales
    {"code": "wo", "name": "Wolof", "native": "Wolof"},
    {"code": "sw", "name": "Swahili", "native": "Kiswahili"},
    {"code": "bm", "name": "Bambara", "native": "Bamanankan"},
    {"code": "yo", "name": "Yoruba", "native": "Yorùbá"},
    {"code": "ln", "name": "Lingala", "native": "Lingála"},
    {"code": "ha", "name": "Haoussa", "native": "Hausa"},
    {"code": "am", "name": "Amharique", "native": "አማርኛ"},
    {"code": "so", "name": "Somali", "native": "Soomaali"},
    {"code": "zu", "name": "Zoulou", "native": "isiZulu"},
    {"code": "ff", "name": "Peul / Pulaar", "native": "Fulfulde"},
    {"code": "mg", "name": "Malgache", "native": "Malagasy"},
    # Autres langues mondiales majeures
    {"code": "uk", "name": "Ukrainien", "native": "Українська"},
    {"code": "th", "name": "Thaï", "native": "ไทย"},
    {"code": "fa", "name": "Persan / Farsi", "native": "فارسی", "rtl": True},
    {"code": "he", "name": "Hébreu", "native": "עברית", "rtl": True},
    {"code": "bn", "name": "Bengali", "native": "বাংলা"},
    {"code": "ur", "name": "Ourdou", "native": "اردو", "rtl": True},
    {"code": "ta", "name": "Tamoul", "native": "தமிழ்"},
    {"code": "te", "name": "Télougou", "native": "తెలుగు"},
    {"code": "mr", "name": "Marathi", "native": "मराठी"},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી"},
    {"code": "ms", "name": "Malais", "native": "Bahasa Melayu"},
    {"code": "tl", "name": "Tagalog / Philippin", "native": "Tagalog"},
    {"code": "bg", "name": "Bulgare", "native": "Български"},
    {"code": "sr", "name": "Serbe", "native": "Српски"},
    {"code": "hr", "name": "Croate", "native": "Hrvatski"},
    {"code": "sk", "name": "Slovaque", "native": "Slovenčina"},
    {"code": "sl", "name": "Slovène", "native": "Slovenščina"},
    {"code": "lt", "name": "Lituanien", "native": "Lietuvių"},
    {"code": "lv", "name": "Letton", "native": "Latviešu"},
    {"code": "et", "name": "Estonien", "native": "Eesti"},
    {"code": "is", "name": "Islandais", "native": "Íslenska"},
    {"code": "ga", "name": "Irlandais", "native": "Gaeilge"},
    {"code": "cy", "name": "Gallois", "native": "Cymraeg"},
    {"code": "eu", "name": "Basque", "native": "Euskara"},
    {"code": "ca", "name": "Catalan", "native": "Català"},
    {"code": "gl", "name": "Galicien", "native": "Galego"},
    {"code": "af", "name": "Afrikaans", "native": "Afrikaans"},
    {"code": "la", "name": "Latin", "native": "Latina"},
    {"code": "eo", "name": "Espéranto", "native": "Esperanto"},
]
