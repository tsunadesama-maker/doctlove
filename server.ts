import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Répertoires de stockage sécurisés (hors racine publique)
const STORAGE_DIR = path.resolve(__dirname, 'storage');
const UPLOADS_DIR = path.join(STORAGE_DIR, 'uploads');
const OUTPUTS_DIR = path.join(STORAGE_DIR, 'outputs');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(OUTPUTS_DIR, { recursive: true });

// Configuration Multer avec stockage disque sécurisé et limite de 25 Mo
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_UPLOAD_EXTS = new Set([
  '.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.txt',
  '.xlsx', '.xls', '.pptx', '.ppt', '.html', '.svg', '.epub',
  '.dxf', '.dwg', '.heic', '.eps', '.mp4', '.gif', '.mp3', '.csv'
]);

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_UPLOAD_EXTS.has(ext) || ext === '') {
      cb(null, true);
    } else {
      cb(new Error(`Format '${ext}' non autorisé. Veuillez sélectionner un fichier valide.`));
    }
  },
});

// Nettoyage automatique des fichiers expirés (> 30 minutes)
function cleanExpiredFiles() {
  const maxAgeMs = 30 * 60 * 1000;
  const now = Date.now();

  [UPLOADS_DIR, OUTPUTS_DIR].forEach((dir) => {
    fs.readdir(dir, (err, files) => {
      if (err) return;
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (statErr, stats) => {
          if (!statErr && now - stats.mtimeMs > maxAgeMs) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  });
}
setInterval(cleanExpiredFiles, 10 * 60 * 1000); // Exécuté toutes les 10 minutes

// -------------------------------------------------------------
// ROUTES D'API
// -------------------------------------------------------------

function parsePythonJson(stdout: string): any {
  const jsonStart = stdout.indexOf('{');
  if (jsonStart === -1) {
    throw new Error('Sortie JSON introuvable');
  }
  const cleanJson = stdout.slice(jsonStart).trim();
  return JSON.parse(cleanJson);
}

// État d'abonnement en mémoire (docLove Pro)
let userSubscription = {
  is_subscribed: false,
  pages_used: 0,
  max_pages: 2000,
  price_eur: 8.0,
  price_xof: 5250,
  plan_name: "docLove Pro Mensuel",
  renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

// Gestion de l'Abonnement docLove Pro
app.get('/api/subscription', (_req: Request, res: Response) => {
  res.json(userSubscription);
});

app.post('/api/subscription/subscribe', (req: Request, res: Response) => {
  const { gateway = 'card' } = req.body;
  userSubscription.is_subscribed = true;
  userSubscription.renewal_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  res.json({
    success: true,
    message: "Abonnement docLove Pro activé avec succès ! Vous pouvez traduire jusqu'à 2 000 pages par mois.",
    subscription: userSubscription,
    gateway
  });
});

app.post('/api/subscription/cancel', (_req: Request, res: Response) => {
  userSubscription.is_subscribed = false;
  res.json({
    success: true,
    message: "Abonnement désactivé.",
    subscription: userSubscription
  });
});

// Liste des langues supportées
app.get('/api/languages', async (_req: Request, res: Response) => {
  try {
    const { stdout } = await execFileAsync('python3', [
      '-m', 'backend.app.main',
      '--action', 'languages',
    ], { env: { ...process.env, PYTHONPATH: '.' } });

    const data = parsePythonJson(stdout);
    res.json(data);
  } catch (error: any) {
    // Fallback riche si le processus python est temporairement indisponible
    res.json({
      languages: [
        { code: "fr", name: "Français" }, { code: "en", name: "Anglais" },
        { code: "es", name: "Espagnol" }, { code: "de", name: "Allemand" },
        { code: "it", name: "Italien" }, { code: "pt", name: "Portugais" },
        { code: "ar", name: "Arabe" }, { code: "zh", name: "Chinois" },
        { code: "ja", name: "Japonais" }, { code: "ru", name: "Russe" },
        { code: "wo", name: "Wolof" }, { code: "sw", name: "Swahili" },
        { code: "bm", name: "Bambara" }, { code: "yo", name: "Yoruba" },
        { code: "ln", name: "Lingala" }, { code: "nl", name: "Néerlandais" },
        { code: "tr", name: "Turc" }, { code: "pl", name: "Polonais" },
        { code: "ko", name: "Coréen" }, { code: "hi", name: "Hindi" },
        { code: "vi", name: "Vietnamien" }, { code: "id", name: "Indonésien" },
        { code: "uk", name: "Ukrainien" }, { code: "th", name: "Thaï" },
        { code: "fa", name: "Persan" }, { code: "he", name: "Hébreu" },
      ]
    });
  }
});

// Informations tarifaires et abonnement docLove
app.get('/api/pricing', (_req: Request, res: Response) => {
  res.json({
    tiers: [
      {
        id: "free",
        name: "Offre Gratuite docLove",
        max_pages: 25,
        price_eur: 0,
        price_xof: 0,
        period: "gratuit à vie",
        features: [
          "Jusqu'à 25 pages gratuites par document",
          "Traduction dans n'importe quelle langue",
          "Tous les outils PDF (fusion, split, compression...)",
          "Préservation fidèle de la mise en page",
          "100 % confidentiel (zéro rétention sous 30 min)",
          "Téléchargement immédiat"
        ],
        highlight: false,
        badge: "Sans inscription"
      },
      {
        id: "subscription",
        name: "Abonnement Mensuel docLove Pro",
        max_pages: 2000,
        price_eur: 8.0,
        price_xof: 5250,
        period: "/ mois",
        features: [
          "Documents de plus de 25 pages débloqués",
          "Jusqu'à 2 000 pages traduites par mois",
          "Traduction dans n'importe quelle langue du monde",
          "Formats PDF et Word DOCX volumineux",
          "Traitement haute priorité sans file d'attente",
          "Règlement par Wave, Orange Money ou CB",
          "Sans engagement, résiliable à tout moment"
        ],
        highlight: true,
        badge: "8 € / mois · 2 000 pages"
      }
    ],
    senegal_gateways: [
      { id: "wave_sn", name: "Wave Sénégal", currency: "XOF", icon: "wave", desc: "Paiement 8 € (~5 250 FCFA/mois)" },
      { id: "orange_money_sn", name: "Orange Money Sénégal", currency: "XOF", icon: "orange", desc: "Prélèvement mobile sécurisé OM" },
      { id: "bank_card", name: "Carte Bancaire (Visa/Mastercard)", currency: "EUR", icon: "card", desc: "Paiement international 8 €/mois" }
    ]
  });
});

// Téléversement et inspection de document
app.post('/api/upload', upload.single('document'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "Aucun fichier n'a été fourni." });
    return;
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const fileSize = req.file.size;
  const ext = path.extname(originalName).toLowerCase().replace('.', '');
  const isClientSubscribed = userSubscription.is_subscribed || req.headers['x-user-subscribed'] === 'true';

  try {
    // Vérification des magic bytes
    const buffer = fs.readFileSync(filePath, { flag: 'r' });
    if (ext === 'pdf' && !buffer.subarray(0, 4).toString().startsWith('%PDF')) {
      fs.unlinkSync(filePath);
      res.status(400).json({ error: "Fichier PDF corrompu ou invalide (en-tête binaire non conforme)." });
      return;
    }
    if (ext === 'docx' && !buffer.subarray(0, 4).toString().startsWith('PK')) {
      fs.unlinkSync(filePath);
      res.status(400).json({ error: "Fichier DOCX corrompu ou invalide (signature ZIP absente)." });
      return;
    }

    // Inspection du document via le moteur Python
    const inspectArgs = [
      '-m', 'backend.app.main',
      '--action', 'inspect',
      '--input', filePath,
    ];
    if (isClientSubscribed) {
      inspectArgs.push('--subscribed');
    }

    const { stdout } = await execFileAsync('python3', inspectArgs, {
      env: { ...process.env, PYTHONPATH: '.' }
    });

    const inspectData = parsePythonJson(stdout);

    if (inspectData.error) {
      fs.unlinkSync(filePath);
      res.status(400).json({ error: inspectData.error });
      return;
    }

    res.json({
      file_id: path.basename(filePath),
      original_filename: originalName,
      file_size_bytes: fileSize,
      format: ext,
      page_count: inspectData.page_count,
      detected_lang: inspectData.detected_lang,
      is_scanned: inspectData.is_scanned,
      requires_ocr: inspectData.requires_ocr,
      ocr_notice: inspectData.ocr_notice,
      quote: inspectData.quote
    });
  } catch (err: any) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (err.stdout) {
      try {
        const errorJson = parsePythonJson(err.stdout);
        if (errorJson.error) {
          res.status(400).json({ error: errorJson.error });
          return;
        }
      } catch {}
    }
    res.status(500).json({
      error: "Erreur lors de l'analyse du document. Veuillez vous assurer que le fichier n'est pas corrompu."
    });
  }
});

// Traduction du document
app.post('/api/translate', async (req: Request, res: Response): Promise<void> => {
  const { file_id, source_lang = 'auto', target_lang = 'fr', is_premium = false } = req.body;

  if (!file_id) {
    res.status(400).json({ error: "Identifiant de document manquant." });
    return;
  }

  // Prévention stricte des attaques de chemin
  const safeFileId = path.basename(file_id);
  const inputPath = path.join(UPLOADS_DIR, safeFileId);

  if (!fs.existsSync(inputPath)) {
    res.status(404).json({ error: "Le document est introuvable ou a expiré." });
    return;
  }

  const ext = path.extname(safeFileId);
  const outputFileName = `translated-${safeFileId}`;
  const outputPath = path.join(OUTPUTS_DIR, outputFileName);

  const isSubscribedOrPremium = is_premium || userSubscription.is_subscribed || req.headers['x-user-subscribed'] === 'true';

  const pyArgs = [
    '-m', 'backend.app.main',
    '--action', 'translate',
    '--input', inputPath,
    '--output', outputPath,
    '--source', source_lang,
    '--target', target_lang,
  ];

  if (isSubscribedOrPremium) {
    pyArgs.push('--premium');
  }

  try {
    const { stdout } = await execFileAsync('python3', pyArgs, {
      env: { ...process.env, PYTHONPATH: '.' }
    });

    const result = parsePythonJson(stdout);

    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }

    if (userSubscription.is_subscribed) {
      userSubscription.pages_used = Math.min(2000, userSubscription.pages_used + (result.page_count || 1));
    }

    res.json({
      success: true,
      translated_file_id: outputFileName,
      output_filename: `doclove-${target_lang}-${safeFileId}`,
      page_count: result.page_count,
      translated_units: result.translated_blocks || result.translated_paragraphs || 0,
      total_words_translated: result.total_words_translated || 0,
      source_lang: result.source_lang,
      target_lang: result.target_lang,
      download_url: `/api/download/${outputFileName}`
    });
  } catch (err: any) {
    if (err.stdout) {
      try {
        const errorJson = parsePythonJson(err.stdout);
        if (errorJson.error) {
          res.status(400).json({ error: errorJson.error });
          return;
        }
      } catch {}
    }
    res.status(500).json({
      error: "Erreur lors de la traduction du document. Le moteur a rencontré une anomalie inattendue."
    });
  }
});

// Téléversement multiple pour les outils (ex: Fusionner des PDF, Images en PDF)
app.post('/api/tools/upload-multi', upload.array('documents', 10), async (req: Request, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: "Aucun fichier fourni." });
    return;
  }

  const uploadedFiles = files.map((f) => ({
    file_id: path.basename(f.path),
    original_filename: f.originalname,
    file_size_bytes: f.size,
    format: path.extname(f.originalname).toLowerCase().replace('.', ''),
  }));

  res.json({ files: uploadedFiles });
});

// Exécution d'un outil de traitement documentaire
app.post('/api/tools/execute', async (req: Request, res: Response): Promise<void> => {
  const {
    tool,
    file_ids,
    file_id,
    angle = 90,
    pages = '',
    ranges = 'all',
    text = 'CONFIDENTIEL',
    signature = 'Signé numériquement',
    level = 'medium',
  } = req.body;

  if (!tool) {
    res.status(400).json({ error: "Outil non spécifié." });
    return;
  }

  const targetFileId = file_id || (file_ids && file_ids[0]);
  if (!targetFileId && tool !== 'merge' && tool !== 'images_to_pdf') {
    res.status(400).json({ error: "Fichier requis manquant." });
    return;
  }

  try {
    let pyArgs: string[] = ['-m', 'backend.app.main', '--action', tool];
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    let outputFilename = `output-${tool}-${uniqueId}.pdf`;
    let outputPath = path.join(OUTPUTS_DIR, outputFilename);

    if (tool === 'merge' || tool === 'images_to_pdf') {
      if (!file_ids || file_ids.length === 0) {
        res.status(400).json({ error: "Veuillez sélectionner au moins 2 fichiers." });
        return;
      }
      const fullPaths = (file_ids as string[]).map((f) => path.join(UPLOADS_DIR, path.basename(f)));
      pyArgs.push('--inputs', fullPaths.join(','));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'add_image') {
      const fullPaths = (file_ids as string[] || []).map((f) => path.join(UPLOADS_DIR, path.basename(f)));
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--inputs', fullPaths.join(','));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'split') {
      outputFilename = `split-${uniqueId}.zip`;
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output-dir', OUTPUTS_DIR);
      pyArgs.push('--ranges', ranges || 'all');
    } else if (tool === 'pdf_to_images' || tool === 'pdf_to_jpg' || tool === 'pdf_to_png') {
      outputFilename = `images-${uniqueId}.zip`;
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output-dir', OUTPUTS_DIR);
    } else if (tool === 'pdf_to_word' || tool === 'image_to_word' || tool === 'pdf_to_pptx') {
      outputFilename = `doc-${uniqueId}.docx`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'pdf_to_excel') {
      outputFilename = `data-${uniqueId}.csv`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'pdf_to_html') {
      outputFilename = `doc-${uniqueId}.html`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'pdf_to_svg') {
      outputFilename = `vector-${uniqueId}.svg`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'pdf_to_txt' || tool === 'ocr') {
      outputFilename = `extract-${uniqueId}.txt`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else if (['compress_image', 'convert_image', 'png_to_jpg', 'heic_to_jpg', 'image_to_jpg'].includes(tool)) {
      outputFilename = `image-${uniqueId}.jpg`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'mp4_to_mp3') {
      outputFilename = `audio-${uniqueId}.mp3`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else if (tool === 'video_to_gif') {
      outputFilename = `animation-${uniqueId}.gif`;
      outputPath = path.join(OUTPUTS_DIR, outputFilename);
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
    } else {
      // rotate, compress, delete_pages, watermark, sign, word_to_pdf, crop, etc.
      pyArgs.push('--input', path.join(UPLOADS_DIR, path.basename(targetFileId)));
      pyArgs.push('--output', outputPath);
      if (tool === 'rotate') pyArgs.push('--angle', String(angle), '--pages', String(pages));
      if (tool === 'compress') pyArgs.push('--level', String(level));
      if (tool === 'delete_pages') pyArgs.push('--pages', String(pages));
      if (tool === 'watermark') pyArgs.push('--text', String(text));
      if (tool === 'sign') pyArgs.push('--signature', String(signature));
    }

    const { stdout } = await execFileAsync('python3', pyArgs, {
      env: { ...process.env, PYTHONPATH: '.' },
    });

    const result = parsePythonJson(stdout);

    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }

    const finalFilename = result.output_filename || outputFilename;

    res.json({
      success: true,
      tool,
      output_filename: finalFilename,
      download_url: `/api/download/${finalFilename}`,
      metrics: result,
    });
  } catch (err: any) {
    if (err.stdout) {
      try {
        const errorJson = parsePythonJson(err.stdout);
        if (errorJson.error) {
          res.status(400).json({ error: errorJson.error });
          return;
        }
      } catch {}
    }
    res.status(500).json({
      error: "Erreur lors du traitement du document avec l'outil sélectionné."
    });
  }
});

// Téléchargement du document traité
app.get('/api/download/:fileId', (req: Request, res: Response): void => {
  const safeFileId = path.basename(req.params.fileId);
  const filePath = path.join(OUTPUTS_DIR, safeFileId);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Fichier introuvable ou supprimé pour des raisons de confidentialité." });
    return;
  }

  const ext = path.extname(safeFileId).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.pdf') {
    contentType = 'application/pdf';
  } else if (ext === '.docx') {
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (ext === '.zip') {
    contentType = 'application/zip';
  } else if (ext === '.csv') {
    contentType = 'text/csv';
  } else if (ext === '.txt') {
    contentType = 'text/plain; charset=utf-8';
  } else if (ext === '.html') {
    contentType = 'text/html; charset=utf-8';
  } else if (ext === '.svg') {
    contentType = 'image/svg+xml';
  } else if (ext === '.jpg' || ext === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (ext === '.png') {
    contentType = 'image/png';
  } else if (ext === '.mp3') {
    contentType = 'audio/mpeg';
  } else if (ext === '.gif') {
    contentType = 'image/gif';
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${safeFileId}"`);
  res.sendFile(filePath);
});

// Gestionnaire d'erreurs global (aucun affichage de trace interne)
app.use((err: any, _req: Request, res: Response, _next: any) => {
  const message = err.message || "Une erreur est survenue lors du traitement.";
  res.status(400).json({ error: message });
});

// -------------------------------------------------------------
// DÉMARRAGE DU SERVEUR ET INTÉGRATION VITE
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[docLove] Serveur démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
