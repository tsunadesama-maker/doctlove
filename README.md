# DocuTrad AI — Plateforme Intelligente de Traduction de Documents

DocuTrad AI est une solution open-source de traduction de documents (PDF textuels et Word DOCX) conçue pour préserver la mise en page originale (titres, paragraphes, tableaux, listes et styles) avec un coût de fonctionnement strictement nul (**0 € par requête**).

---

## 1. Principes et Architecture Technique

- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS (interface SaaS premium, ergonomique et responsive).
- **Backend Full-Stack** : Express.js sur Node.js 22 orchestrant les points d'accès `/api/*` et montant Vite via `vite.middlewares`.
- **Moteur Documentaire Python** :
  - **PyMuPDF (`fitz`)** : Extraction vectorielle page par page des PDF, détection des PDF scannés sans texte, et reconstruction vectorielle des pages traduites.
  - **python-docx** : Analyse fine des *runs* Word (préservation du gras, de l'italique, du souligné), traitement matriciel des tableaux, en-têtes et pieds de page.
- **Moteur de Traduction (TranslationService)** :
  - Découpage par blocs sans coupure de phrases (`chunk_size <= 1200 chars`).
  - Masquage des entités sensibles (dates, montants, nombres, adresses emails, URLs) pour interdire toute altération lors de la traduction.
  - Préservation rigoureuse de l'ordre d'origine des blocs.
- **Sécurité & Confidentialité** :
  - Contrôle binaire strict (*magic bytes* `%PDF` et `PK\x03\x04`).
  - Stockage isolé hors du répertoire web public (`storage/uploads` et `storage/outputs`).
  - Purge automatique des fichiers temporaires après 30 minutes.
  - Zéro journalisation du contenu des documents.

---

## 2. Étude Comparative des Modèles de Traduction

| Moteur | Licence | Usage Commercial | Empreinte RAM | Verdict |
| :--- | :--- | :---: | :---: | :--- |
| **OPUS-MT (MarianMT)** | Apache 2.0 / CC-BY-4.0 | **Oui** | ~300 à 600 Mo | **Sélectionné** : Idéal sur CPU, 0 € par requête, 1000+ paires bilingues. |
| **Argos Translate** | MIT License | **Oui** | ~400 Mo | **Sélectionné** : 100% hors-ligne, paquets légers `.argosmodel`. |
| **MADLAD-400** | Apache 2.0 | **Oui** | 12 à 24 Go+ | **Disqualifié** : Entraîne un crash mémoire immédiat (OOM) sur 4 Go RAM. |
| **NLLB-200 (Meta)** | CC-BY-NC 4.0 | **Non (NC)** | ~2,5 Go | **Rejeté** : Clause Non-Commerciale interdisant toute vente de service. |

---

## 3. Installation et Démarrage Local

### Prérequis
- **Node.js** v18+ (avec npm ou yarn)
- **Python** 3.10+ (avec pip)

### Sous Windows (PowerShell / Command Prompt)
```powershell
# 1. Cloner ou ouvrir le dossier du projet dans VS Code
cd docutrad-ai

# 2. Installer les dépendances Node.js
npm install

# 3. Installer les dépendances Python
pip install python-docx PyMuPDF pytest

# 4. Lancer le serveur de développement full-stack
npm run dev
```

### Sous macOS / Linux (Terminal)
```bash
# 1. Installer les dépendances Node.js
npm install

# 2. Installer les dépendances Python
pip3 install python-docx PyMuPDF pytest

# 3. Lancer le serveur de développement full-stack
npm run dev
```
L'application est immédiatement accessible dans votre navigateur à l'adresse : **http://localhost:3000**

---

## 4. Exécution des Tests Automatisés

Le projet inclut une suite de tests unitaires et d'intégration couvrant l'ensemble du cahier des charges :
- Validation des PDF et DOCX réels
- Rejet des extensions non autorisées (`.exe`, `.sh`)
- Rejet des fichiers volumineux (> 25 Mo)
- Blocage du plafond des 19 pages de l'offre gratuite
- Détection des PDF scannés (absence de texte)
- Préservation des entités (dates, devises, nombres)
- Conservation stricte de l'ordre des paragraphes
- Génération d'un fichier final non vide
- Conservation des styles Word (gras, italique, tableaux)

Pour exécuter les tests :
```bash
npm run test
# ou directement avec pytest :
PYTHONPATH=. pytest backend/app/tests/test_docutrad.py -v
```

---

## 5. Comment Ajouter des Langues

Pour ajouter une nouvelle paire linguistique ou un modèle spécifique dans `TranslationService` :
1. Ouvrez `backend/app/services/translation_service.py`.
2. Ajoutez le code de la langue dans `SUPPORTED_LANGUAGES` (ex: `{"code": "pl", "name": "Polonais"}`).
3. Ajoutez le dictionnaire ou le modèle ONNX/Argos correspondant dans la méthode `translate_chunk()`.
4. La nouvelle langue apparaîtra automatiquement dans les menus déroulants du frontend via l'endpoint `/api/languages`.

---

## 6. Résolution des Problèmes Fréquents

1. **Erreur "Fichier PDF corrompu ou invalide"** :
   Le fichier téléversé ne commence pas par la signature binaire standard `%PDF`. Assurez-vous qu'il s'agit d'un véritable PDF et non d'un fichier texte renommé.
2. **Avertissement "Document scanné détecté"** :
   Le PDF contient une photo ou un scan sans texte vectoriel sélectionnable. Pour le traiter, une future extension OCR (Tesseract / PaddleOCR) sera requise.
3. **Erreur "Dépassement du plafond de l'offre gratuite"** :
   Le document comporte plus de 19 pages. Le tarif est fixé à 5 € (~3 280 FCFA) pour le document complet.

---

## 7. Feuille de Route vers la Commercialisation

- [ ] **Passerelle de Paiement Sénégal** : Intégration de l'API PayDunya ou CinetPay pour le prélèvement direct Wave et Orange Money (5 € / ~3 280 FCFA).
- [ ] **Moteur OCR** : Intégration de Tesseract ou PaddleOCR pour les documents numérisés.
- [ ] **Authentification & Historique Utilisateur** : Comptes utilisateurs facultatifs avec espace sécurisé de téléchargement.
- [ ] **Stockage Objet Distant** : Migration de `storage/` vers un bucket S3 ou Google Cloud Storage avec chiffrement au repos.
