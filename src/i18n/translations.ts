export type UILanguageCode = 'fr' | 'en' | 'es' | 'de';

export interface UILanguageOption {
  code: UILanguageCode;
  name: string;
  flag: string;
}

export const UI_LANGUAGES: UILanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const translations = {
  fr: {
    // Top Bar & Header
    nav_translation: "Traduction",
    nav_workflow: "Fonctionnement",
    nav_models: "Modèles & Licences",
    nav_pricing: "Tarifs",
    nav_security: "Sécurité",
    nav_faq: "FAQ",
    btn_translate_now: "Traduire un document",
    settings_title: "Paramètres",
    settings_subtitle: "Préférences d'affichage et configuration du service",
    settings_ui_lang_label: "Langue de l'interface",
    settings_ui_lang_desc: "Choisissez la langue dans laquelle s'affichent les menus et les explications.",
    settings_default_target_label: "Langue cible favorite",
    settings_default_target_desc: "Présélectionnée automatiquement lors du dépôt d'un nouveau document.",
    settings_theme_label: "Mode d'affichage",
    settings_theme_desc: "Basculez entre le thème clair et le mode sombre pour une expérience visuelle reposante.",
    settings_theme_light: "Mode Clair",
    settings_theme_dark: "Mode Sombre",
    settings_engine_status: "Moteur de traduction actif",
    settings_engine_desc: "Moteur local autonome (0 € par requête, 100% hors-ligne, conforme RGPD).",
    settings_close: "Fermer",

    // Hero
    hero_kicker: "Moteur de traduction documentaire local & éthique",
    hero_title: "Traduisez vos documents, simplement.",
    hero_subtitle: "Déposez votre PDF ou Word et récupérez une version traduite respectant scrupuleusement la structure originale : paragraphes, tableaux, listes et styles.",
    hero_proof_formats: "PDF textuels & Word DOCX",
    hero_proof_models: "Moteur IA haute fidélité",
    hero_proof_tier: "Plafond gratuit 25 pages",

    // Upload section
    upload_section_title: "Espace de Traduction Documentaire",
    upload_section_subtitle: "Déposez vos fichiers PDF ou Word pour initier le traitement local sécurisé.",
    upload_source_lang: "Langue source",
    upload_target_lang: "Langue cible",
    upload_auto_detect: "Détection automatique (recommandé)",
    upload_dropzone_title: "Glissez-déposez votre document ici, ou",
    upload_dropzone_browse: "parcourez vos fichiers",
    upload_dropzone_hint: "Formats acceptés : PDF textuel (.pdf) et Word (.docx) · Limite : 30 Mo",
    upload_file_change: "Cliquez pour changer de fichier",
    upload_demo_hint: "Pas de fichier sous la main ?",
    upload_demo_btn: "Charger un exemple de PDF (Facture & Contrat)",
    upload_submit_btn: "Traduire mon document",
    upload_free_notice: "Offre gratuite : traduction jusqu'à 25 pages sans aucun frais · Au-delà : docLove Pro 8 € / mois.",
    upload_err_format: "Format non pris en charge. Veuillez sélectionner un fichier PDF (.pdf) ou Word (.docx).",
    upload_err_size: "Le fichier dépasse la limite maximale de 30 Mo.",
    upload_err_required: "Veuillez sélectionner un document à traduire.",

    // Processing Status
    status_page_label: "page",
    status_pages_label: "pages",
    status_lang_pair: "Paire linguistique",
    status_scanned_alert_title: "Document scanné détecté",
    status_scanned_alert_desc: "Ce document ne contient pas de flux textuel sélectionnable (uniquement des images de pages). La future extension OCR sera requise pour traiter automatiquement ce document.",
    status_failure_title: "Échec du traitement",
    status_btn_retry: "Réessayer",
    status_btn_cancel: "Annuler et changer de fichier",
    status_current_step: "Étape de traitement en cours",
    status_active: "Traitement actif",
    status_step_1: "Validation binaire et calcul des pages",
    status_step_2: "Découpage par blocs et masquage des entités",
    status_step_3: "Traduction neuronale par blocs",
    status_step_4: "Reconstruction du document et vérification",
    status_abort: "Annuler le traitement",

    // Translation Result
    result_success_title: "Document traduit avec succès",
    result_success_desc: "Votre document a été traduit et reconstruit avec préservation des blocs, titres, tableaux et styles.",
    result_pages_processed: "Pages traitées",
    result_volume_translated: "Volume traduit",
    result_words: "mots",
    result_output_format: "Format de sortie",
    result_fidelity_notice_title: "Note de conformité géométrique :",
    result_fidelity_notice_desc: "La mise en page d'origine (tableaux, retours à la ligne, polices) a été reproduite le plus fidèlement possible. En cas de dilatation textuelle due à la langue cible (ex: le français est ~20% plus long que l'anglais), certains retours de ligne peuvent varier légèrement.",
    result_download_btn: "Télécharger le document traduit",
    result_restart_btn: "Traduire un autre document",
    result_storage_info: "Fichier stocké dans l'espace sécurisé temporaire",
    result_storage_exp: "Expiration automatique dans 30 min",

    // Workflow
    workflow_kicker: "Architecture & Pipeline",
    workflow_title: "Comment fonctionne docLove",
    workflow_subtitle: "Un pipeline documentaire conçu pour concilier rigueur de traduction, préservation de mise en page et sécurité des données.",

    // Model Benchmark
    models_kicker: "Audit Technique & Conformité Juridique",
    models_title: "Étude comparative des moteurs de traduction",
    models_subtitle: "Sélection rigoureuse pour respecter le budget initial de 0 €, la faisabilité sur CPU standard et l'éligibilité à une future exploitation commerciale.",

    // Pricing
    pricing_kicker: "Modèle Économique & Tarification",
    pricing_title: "Des tarifs simples et transparents",
    pricing_subtitle: "Découvrez le service gratuitement jusqu'à 25 pages par document. Au-delà, l'abonnement docLove Pro à 8 € / mois vous offre 2 000 pages.",

    // Security
    security_kicker: "Confidentialité & Cybersécurité",
    security_title: "Vos documents restent strictement confidentiels",
    security_subtitle: "Conçu dès le premier jour pour répondre aux impératifs des cabinets juridiques, entreprises et utilisateurs exigeants.",

    // FAQ
    faq_kicker: "Questions Fréquentes",
    faq_title: "Tout ce que vous devez savoir sur docLove",

    // Footer
    footer_tagline: "Plateforme indépendante de traduction documentaire préservant la structure, les tableaux et les styles.",
    footer_rights: "Tous droits réservés. Développé sous licence Open Source.",
    footer_privacy: "Politique de confidentialité (Zéro-rétention)",
    footer_terms: "Conditions générales d'utilisation",

    // Translation History
    history_title: "Historique des traductions",
    history_subtitle: "Vos 5 derniers documents traduits (conservés localement)",
    history_empty: "Aucun document traduit récemment",
    history_empty_hint: "Dès qu'une traduction est terminée, elle s'affiche ici pour un retéléchargement rapide.",
    history_redownload_btn: "Retélécharger",
    history_clear_btn: "Effacer l'historique",
    history_clear_confirm: "Voulez-vous vraiment effacer votre historique local ?",
    history_badge_recent: "Récents",
    history_time_just_now: "À l'instant",
    history_time_min_ago: "min",
    history_time_hours_ago: "h",
  },

  en: {
    // Top Bar & Header
    nav_translation: "Translation",
    nav_workflow: "How it Works",
    nav_models: "Models & Licenses",
    nav_pricing: "Pricing",
    nav_security: "Security",
    nav_faq: "FAQ",
    btn_translate_now: "Translate Document",
    settings_title: "Settings",
    settings_subtitle: "Interface preferences and service configuration",
    settings_ui_lang_label: "Interface Language",
    settings_ui_lang_desc: "Choose the language in which menus and instructions are displayed.",
    settings_default_target_label: "Favorite Target Language",
    settings_default_target_desc: "Automatically preselected when uploading a new document.",
    settings_theme_label: "Display Theme",
    settings_theme_desc: "Toggle between light theme and dark mode for a comfortable nocturnal reading experience.",
    settings_theme_light: "Light Mode",
    settings_theme_dark: "Dark Mode",
    settings_engine_status: "Active Translation Engine",
    settings_engine_desc: "Autonomous local engine ($0 per request, 100% offline, GDPR compliant).",
    settings_close: "Close",

    // Hero
    hero_kicker: "Local & Ethical Document Translation Engine",
    hero_title: "Translate your documents, seamlessly.",
    hero_subtitle: "Upload your PDF or Word document and get a translated version strictly preserving the original layout: paragraphs, tables, lists, and formatting.",
    hero_proof_formats: "Textual PDFs & Word DOCX",
    hero_proof_models: "Open-source models ($0 per request)",
    hero_proof_tier: "25-page free tier limit",

    // Upload section
    upload_section_title: "Document Translation Workspace",
    upload_section_subtitle: "Upload your PDF or Word files to initiate secure local processing.",
    upload_source_lang: "Source language",
    upload_target_lang: "Target language",
    upload_auto_detect: "Auto detection (recommended)",
    upload_dropzone_title: "Drag and drop your document here, or",
    upload_dropzone_browse: "browse your files",
    upload_dropzone_hint: "Accepted formats: Textual PDF (.pdf) and Word (.docx) · Limit: 30 MB",
    upload_file_change: "Click to select a different file",
    upload_demo_hint: "Don't have a file ready?",
    upload_demo_btn: "Load sample PDF (Invoice & Contract)",
    upload_submit_btn: "Translate my document",
    upload_free_notice: "Free plan: translation up to 25 pages with zero cost · Beyond: docLove Pro €8 / mo.",
    upload_err_format: "Unsupported format. Please select a PDF (.pdf) or Word (.docx) file.",
    upload_err_size: "File exceeds the 30 MB maximum limit.",
    upload_err_required: "Please select a document to translate.",

    // Processing Status
    status_page_label: "page",
    status_pages_label: "pages",
    status_lang_pair: "Language pair",
    status_scanned_alert_title: "Scanned document detected",
    status_scanned_alert_desc: "This document contains no selectable text stream (image scans only). An upcoming OCR module will be required to process this document automatically.",
    status_failure_title: "Processing failure",
    status_btn_retry: "Retry",
    status_btn_cancel: "Cancel and change file",
    status_current_step: "Current processing step",
    status_active: "Processing active",
    status_step_1: "Binary validation & page count audit",
    status_step_2: "Block segmentation & entity token masking",
    status_step_3: "Chunked neural translation",
    status_step_4: "Document reconstruction & verification",
    status_abort: "Abort processing",

    // Translation Result
    result_success_title: "Document successfully translated",
    result_success_desc: "Your document was translated and reconstructed while maintaining blocks, headings, tables, and styles.",
    result_pages_processed: "Processed pages",
    result_volume_translated: "Translated volume",
    result_words: "words",
    result_output_format: "Output format",
    result_fidelity_notice_title: "Layout fidelity notice:",
    result_fidelity_notice_desc: "The original layout (tables, line breaks, typography) has been mirrored as closely as possible. Due to natural language expansion (e.g., target language word lengths), minor line wrapping adjustments may occur.",
    result_download_btn: "Download translated document",
    result_restart_btn: "Translate another document",
    result_storage_info: "File stored in isolated temporary memory",
    result_storage_exp: "Automatic purge in 30 minutes",

    // Workflow
    workflow_kicker: "Architecture & Pipeline",
    workflow_title: "How docLove Works",
    workflow_subtitle: "A document pipeline designed to combine translation accuracy, layout preservation, and privacy.",

    // Model Benchmark
    models_kicker: "Technical Audit & Legal Compliance",
    models_title: "Comparative study of translation engines",
    models_subtitle: "Rigorous model selection guaranteeing $0 operational costs, standard CPU feasibility, and commercial readiness.",

    // Pricing
    pricing_kicker: "Business Model & Pricing",
    pricing_title: "Simple, transparent pricing",
    pricing_subtitle: "Discover the service for free up to 25 pages per document. Beyond that, docLove Pro at €8/mo unlocks 2,000 pages.",

    // Security
    security_kicker: "Privacy & Cybersecurity",
    security_title: "Your documents remain strictly confidential",
    security_subtitle: "Architected from day one for the confidentiality requirements of legal firms, enterprises, and discerning users.",

    // FAQ
    faq_kicker: "Frequently Asked Questions",
    faq_title: "Everything you need to know about docLove",

    // Footer
    footer_tagline: "Independent document translation platform preserving structure, tables, and formatting.",
    footer_rights: "All rights reserved. Built under Open Source principles.",
    footer_privacy: "Privacy policy (Zero-retention)",
    footer_terms: "Terms of service",

    // Translation History
    history_title: "Translation History",
    history_subtitle: "Your last 5 translated documents (stored locally)",
    history_empty: "No recent translated documents",
    history_empty_hint: "Once a translation completes, it will appear here for fast redownload.",
    history_redownload_btn: "Redownload",
    history_clear_btn: "Clear history",
    history_clear_confirm: "Are you sure you want to clear your local history?",
    history_badge_recent: "Recent",
    history_time_just_now: "Just now",
    history_time_min_ago: "min ago",
    history_time_hours_ago: "h ago",
  },

  es: {
    // Top Bar & Header
    nav_translation: "Traducción",
    nav_workflow: "Cómo funciona",
    nav_models: "Modelos y Licencias",
    nav_pricing: "Precios",
    nav_security: "Seguridad",
    nav_faq: "Preguntas frecuentes",
    btn_translate_now: "Traducir documento",
    settings_title: "Ajustes",
    settings_subtitle: "Preferencias de interfaz y configuración del servicio",
    settings_ui_lang_label: "Idioma de la interfaz",
    settings_ui_lang_desc: "Seleccione el idioma en el que se muestran los menús e instrucciones.",
    settings_default_target_label: "Idioma de destino preferido",
    settings_default_target_desc: "Preseleccionado automáticamente al subir un nuevo documento.",
    settings_theme_label: "Modo de visualización",
    settings_theme_desc: "Alterne entre el tema claro y el modo oscuro para una lectura nocturna más cómoda.",
    settings_theme_light: "Modo Claro",
    settings_theme_dark: "Modo Oscuro",
    settings_engine_status: "Motor de traducción activo",
    settings_engine_desc: "Motor local autónomo (0 € por solicitud, 100% offline, conforme a GDPR).",
    settings_close: "Cerrar",

    // Hero
    hero_kicker: "Motor local y ético de traducción documental",
    hero_title: "Traduzca sus documentos, fácilmente.",
    hero_subtitle: "Suba su archivo PDF o Word y reciba una versión traducida respetando con precisión el diseño original: párrafos, tablas, listas y estilos.",
    hero_proof_formats: "PDF textuales y Word DOCX",
    hero_proof_models: "Modelos de código abierto (0 € por solicitud)",
    hero_proof_tier: "Límite gratuito de 25 páginas",

    // Upload section
    upload_section_title: "Espacio de Traducción Documental",
    upload_section_subtitle: "Suba sus archivos PDF o Word para iniciar el procesamiento local seguro.",
    upload_source_lang: "Idioma de origen",
    upload_target_lang: "Idioma de destino",
    upload_auto_detect: "Detección automática (recomendado)",
    upload_dropzone_title: "Arrastre y suelte su documento aquí, o",
    upload_dropzone_browse: "explore sus archivos",
    upload_dropzone_hint: "Formatos admitidos: PDF textual (.pdf) y Word (.docx) · Límite: 25 MB",
    upload_file_change: "Haga clic para cambiar de archivo",
    upload_demo_hint: "¿No tiene un archivo listo?",
    upload_demo_btn: "Cargar PDF de ejemplo (Factura y Contrato)",
    upload_submit_btn: "Traducir mi documento",
    upload_free_notice: "Plan gratuito: traducción de hasta 25 páginas sin costo · Eliminación automática en 30 minutos.",
    upload_err_format: "Formato no compatible. Por favor elija un archivo PDF (.pdf) o Word (.docx).",
    upload_err_size: "El archivo supera el tamaño máximo permitido de 25 MB.",
    upload_err_required: "Por favor seleccione un documento para traducir.",

    // Processing Status
    status_page_label: "página",
    status_pages_label: "páginas",
    status_lang_pair: "Par de idiomas",
    status_scanned_alert_title: "Documento escaneado detectado",
    status_scanned_alert_desc: "Este documento no contiene texto seleccionable (solo imágenes de páginas). Se requerirá un módulo OCR para procesarlo automáticamente.",
    status_failure_title: "Error en el procesamiento",
    status_btn_retry: "Reintentar",
    status_btn_cancel: "Cancelar y cambiar de archivo",
    status_current_step: "Paso de procesamiento actual",
    status_active: "Procesamiento en curso",
    status_step_1: "Validación binaria y recuento de páginas",
    status_step_2: "Segmentación por bloques y enmascaramiento de entidades",
    status_step_3: "Traducción neuronal por bloques",
    status_step_4: "Reconstrucción del documento y verificación",
    status_abort: "Cancelar procesamiento",

    // Translation Result
    result_success_title: "Documento traducido con éxito",
    result_success_desc: "Su documento fue traducido y reconstruido conservando bloques, títulos, tablas y estilos.",
    result_pages_processed: "Páginas procesadas",
    result_volume_translated: "Volumen traducido",
    result_words: "palabras",
    result_output_format: "Formato de salida",
    result_fidelity_notice_title: "Nota sobre la fidelidad del diseño:",
    result_fidelity_notice_desc: "El diseño original se ha reproducido lo más fielmente posible. En caso de expansión del texto, pueden ocurrir leves ajustes de salto de línea.",
    result_download_btn: "Descargar documento traducido",
    result_restart_btn: "Traducir otro documento",
    result_storage_info: "Archivo almacenado en bóveda temporal segura",
    result_storage_exp: "Eliminación automática en 30 minutos",

    // Workflow
    workflow_kicker: "Arquitectura y Pipeline",
    workflow_title: "Cómo funciona docLove",
    workflow_subtitle: "Un pipeline documental diseñado para conciliar precisión, diseño y privacidad.",

    // Model Benchmark
    models_kicker: "Auditoría Técnica y Cumplimiento Legal",
    models_title: "Estudio comparativo de motores de traducción",
    models_subtitle: "Selección rigurosa para garantizar costo cero, viabilidad en CPU estándar y aptitud comercial.",

    // Pricing
    pricing_kicker: "Modelo Económico y Precios",
    pricing_title: "Precios sencillos y transparentes",
    pricing_subtitle: "Descubra el servicio gratis hasta 25 páginas por documento. Más allá, docLove Pro a 8 €/mes desbloquea 2 000 páginas.",

    // Security
    security_kicker: "Privacidad y Ciberseguridad",
    security_title: "Sus documentos se mantienen estrictamente confidenciales",
    security_subtitle: "Diseñado para los requisitos de despachos jurídicos, empresas y usuarios exigentes.",

    // FAQ
    faq_kicker: "Preguntas Frecuentes",
    faq_title: "Todo lo que necesita saber sobre docLove",

    // Footer
    footer_tagline: "Plataforma independiente de traducción documental que preserva estructura y tablas.",
    footer_rights: "Todos los derechos reservados. Desarrollado con software libre.",
    footer_privacy: "Política de privacidad (Cero-retención)",
    footer_terms: "Términos y condiciones",

    // Translation History
    history_title: "Historial de traducciones",
    history_subtitle: "Sus últimos 5 documentos traducidos (guardados localmente)",
    history_empty: "No hay documentos traducidos recientemente",
    history_empty_hint: "Una vez completada una traducción, aparecerá aquí para descargarla de nuevo rápidamente.",
    history_redownload_btn: "Volver a descargar",
    history_clear_btn: "Borrar historial",
    history_clear_confirm: "¿Está seguro de que desea borrar su historial local?",
    history_badge_recent: "Recientes",
    history_time_just_now: "Ahora mismo",
    history_time_min_ago: "min",
    history_time_hours_ago: "h",
  },

  de: {
    // Top Bar & Header
    nav_translation: "Übersetzung",
    nav_workflow: "Funktionsweise",
    nav_models: "Modelle & Lizenzen",
    nav_pricing: "Preise",
    nav_security: "Sicherheit",
    nav_faq: "FAQ",
    btn_translate_now: "Dokument übersetzen",
    settings_title: "Einstellungen",
    settings_subtitle: "Oberflächeneinstellungen und Konfiguration",
    settings_ui_lang_label: "Sprache der Benutzeroberfläche",
    settings_ui_lang_desc: "Wählen Sie die Sprache für Menüs und Hinweistexte.",
    settings_default_target_label: "Bevorzugte Zielsprache",
    settings_default_target_desc: "Wird beim Hochladen eines neuen Dokuments automatisch vorausgewählt.",
    settings_theme_label: "Anzeigemodus",
    settings_theme_desc: "Wechseln Sie zwischen hellem Design und Dunkelmodus für eine augenschonende Ansicht.",
    settings_theme_light: "Heller Modus",
    settings_theme_dark: "Dunkelmodus",
    settings_engine_status: "Aktive Übersetzungs-Engine",
    settings_engine_desc: "Autonome lokale Engine (0 € pro Anfrage, 100% offline, DSGVO-konform).",
    settings_close: "Schließen",

    // Hero
    hero_kicker: "Lokale & Ethische Dokumentenübersetzungs-Engine",
    hero_title: "Übersetzen Sie Dokumente, einfach.",
    hero_subtitle: "Laden Sie PDF oder Word hoch und erhalten Sie eine übersetzte Version unter genauer Wahrung des Layouts: Absätze, Tabellen, Listen und Stile.",
    hero_proof_formats: "Text-PDFs & Word DOCX",
    hero_proof_models: "Open-Source-Modelle (0 € pro Anfrage)",
    hero_proof_tier: "Kostenlose Grenze bis 25 Seiten",

    // Upload section
    upload_section_title: "Dokumenten-Übersetzungsbereich",
    upload_section_subtitle: "Laden Sie PDF- oder Word-Dateien für eine sichere lokale Verarbeitung hoch.",
    upload_source_lang: "Ausgangssprache",
    upload_target_lang: "Zielsprache",
    upload_auto_detect: "Automatische Erkennung (empfohlen)",
    upload_dropzone_title: "Dokument hier ablegen oder",
    upload_dropzone_browse: "Dateien durchsuchen",
    upload_dropzone_hint: "Unterstützte Formate: Text-PDF (.pdf) & Word (.docx) · Limit: 25 MB",
    upload_file_change: "Klicken, um andere Datei auszuwählen",
    upload_demo_hint: "Keine Datei zur Hand?",
    upload_demo_btn: "Beispiel-PDF laden (Rechnung & Vertrag)",
    upload_submit_btn: "Mein Dokument übersetzen",
    upload_free_notice: "Kostenloses Angebot: Übersetzung bis zu 25 Seiten ohne Gebühren · Automatische Löschung nach 30 Min.",
    upload_err_format: "Nicht unterstütztes Format. Bitte wählen Sie eine PDF- oder Word-Datei (.docx).",
    upload_err_size: "Die Datei überschreitet das Limit von 25 MB.",
    upload_err_required: "Bitte wählen Sie ein Dokument zur Übersetzung aus.",

    // Processing Status
    status_page_label: "Seite",
    status_pages_label: "Seiten",
    status_lang_pair: "Sprachpaar",
    status_scanned_alert_title: "Gescannte Datei erkannt",
    status_scanned_alert_desc: "Dieses Dokument enthält keinen markierbaren Text (nur Bildscans). Für eine automatische Verarbeitung wird ein OCR-Modul benötigt.",
    status_failure_title: "Verarbeitungsfehler",
    status_btn_retry: "Wiederholen",
    status_btn_cancel: "Abbrechen und Datei ändern",
    status_current_step: "Aktueller Verarbeitungsschritt",
    status_active: "Verarbeitung aktiv",
    status_step_1: "Binärprüfung & Seitenzahl-Prüfung",
    status_step_2: "Block-Segmentierung & Maskierung sensibler Entitäten",
    status_step_3: "Neuronale Übersetzung nach Blöcken",
    status_step_4: "Dokument-Rekonstruktion & Verifikation",
    status_abort: "Verarbeitung abbrechen",

    // Translation Result
    result_success_title: "Dokument erfolgreich übersetzt",
    result_success_desc: "Ihr Dokument wurde übersetzt und unter Beibehaltung von Blöcken, Überschriften und Tabellen rekonstruiert.",
    result_pages_processed: "Verarbeitete Seiten",
    result_volume_translated: "Übersetztes Volumen",
    result_words: "Wörter",
    result_output_format: "Ausgabeformat",
    result_fidelity_notice_title: "Hinweis zur Layout-Treue:",
    result_fidelity_notice_desc: "Das ursprüngliche Layout wurde so exakt wie möglich nachgebildet. Durch unterschiedliche Wortlängen in verschiedenen Sprachen können minimale Zeilenumbrüche variieren.",
    result_download_btn: "Übersetztes Dokument herunterladen",
    result_restart_btn: "Ein weiteres Dokument übersetzen",
    result_storage_info: "In isoliertem temporärem Speicher abgelegt",
    result_storage_exp: "Automatische Löschung in 30 Minuten",

    // Workflow
    workflow_kicker: "Architektur & Pipeline",
    workflow_title: "Wie docLove funktioniert",
    workflow_subtitle: "Eine Dokumenten-Pipeline für Genauigkeit, Layout-Treue und Datenschutz.",

    // Model Benchmark
    models_kicker: "Technische Prüfung & Rechtliche Konformität",
    models_title: "Vergleich der Übersetzungs-Engines",
    models_subtitle: "Auswahl zur Wahrung von 0 € Kosten, Standard-CPU-Laufzeit und kommerzieller Eignung.",

    // Pricing
    pricing_kicker: "Wirtschaftsmodell & Preise",
    pricing_title: "Einfache und transparente Preise",
    pricing_subtitle: "Kostenlos bis zu 25 Seiten pro Dokument. Darüber hinaus docLove Pro für 8 €/Monat mit 2.000 Seiten.",

    // Security
    security_kicker: "Datenschutz & Cybersicherheit",
    security_title: "Ihre Dokumente bleiben absolut vertraulich",
    security_subtitle: "Entwickelt für die Anforderungen von Kanzleien, Unternehmen und anspruchsvollen Nutzern.",

    // FAQ
    faq_kicker: "Häufig gestellte Fragen",
    faq_title: "Alles, was Sie über docLove wissen müssen",

    // Footer
    footer_tagline: "Unabhängige Übersetzungsplattform mit Strukturerhalt.",
    footer_rights: "Alle Rechte vorbehalten. Entwickelt auf Open-Source-Basis.",
    footer_privacy: "Datenschutz (Null-Speicherung)",
    footer_terms: "Nutzungsbedingungen",

    // Translation History
    history_title: "Übersetzungsverlauf",
    history_subtitle: "Ihre letzten 5 übersetzten Dokumente (lokal gespeichert)",
    history_empty: "Keine kürzlich übersetzten Dokumente",
    history_empty_hint: "Sobald eine Übersetzung abgeschlossen ist, erscheint sie hier für einen schnellen erneuten Download.",
    history_redownload_btn: "Erneut herunterladen",
    history_clear_btn: "Verlauf leeren",
    history_clear_confirm: "Möchten Sie Ihren lokalen Verlauf wirklich leeren?",
    history_badge_recent: "Letzte",
    history_time_just_now: "Gerade eben",
    history_time_min_ago: "Min.",
    history_time_hours_ago: "Std.",
  },
};
