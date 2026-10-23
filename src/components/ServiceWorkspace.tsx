import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Trash2,
  Plus,
  RotateCw,
  Stamp,
  Scissors,
  Minimize2,
  PenTool,
  CopyPlus,
  Languages,
  Sparkles,
  Crop,
  FileUp,
  Image,
  Eraser,
} from 'lucide-react';
import { ToolDefinition } from '../data/tools';
import { Language } from '../types';
import { api } from '../services/api';
import { useI18n } from '../context/I18nContext';
import { useSubscription } from '../context/SubscriptionContext';

interface ServiceWorkspaceProps {
  tool: ToolDefinition;
  languages: Language[];
  onBack: () => void;
  onRecordHistory?: (item: any) => void;
}

export const ServiceWorkspace: React.FC<ServiceWorkspaceProps> = ({
  tool,
  languages,
  onBack,
  onRecordHistory,
}) => {
  const { t, defaultTargetLang } = useI18n();
  const { subscription, openPaymentModal, recordPagesUsed } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fichiers sélectionnés
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<{ pages: number } | null>(null);

  // Options spécifiques par outil
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>(defaultTargetLang || 'fr');
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [pageRanges, setPageRanges] = useState<string>('all');
  const [pagesToDelete, setPagesToDelete] = useState<string>('');
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIEL');
  const [signatureName, setSignatureName] = useState<string>('Signé numériquement');
  const [signatureMode, setSignatureMode] = useState<'text' | 'draw'>('text');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [compressLevel, setCompressLevel] = useState<string>('medium');
  const [cropMargin, setCropMargin] = useState<number>(20);

  // États d'exécution
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    downloadUrl: string;
    outputFilename: string;
    details?: string;
    outputSize?: number;
  } | null>(null);

  // Canvas signature
  useEffect(() => {
    if (signatureMode === 'draw' && signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const isDark = document.documentElement.classList.contains('dark');
        ctx.strokeStyle = isDark ? '#f8fafc' : '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [signatureMode]);

  const clearCanvas = () => {
    if (signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.strokeStyle = isDark ? '#f8fafc' : '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (tool.multiple) {
        setSelectedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
      } else {
        setSelectedFiles([e.dataTransfer.files[0]]);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (tool.multiple) {
        setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      } else {
        setSelectedFiles([e.target.files[0]]);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleExecute = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("Veuillez sélectionner au moins un fichier pour continuer.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setResult(null);
    setQuotaExceeded(null);

    try {
      if (tool.id === 'translate') {
        // Flux Traduction IA dans 25 langues avec préservation de mise en page
        const file = selectedFiles[0];
        const uploaded = await api.uploadDocument(file, subscription.isSubscribed);

        if (uploaded.is_scanned) {
          throw new Error("Ce document PDF est scanné (images pures). Utilisez l'outil OCR de PDF pour extraire le texte avant traduction.");
        }

        if (uploaded.page_count > 25 && !subscription.isSubscribed) {
          setQuotaExceeded({ pages: uploaded.page_count });
          throw new Error(`Ce document comporte ${uploaded.page_count} pages (le plafond gratuit est de 25 pages). Activez docLove Pro à 8 € / mois (~5 250 FCFA) pour traduire ce document.`);
        }

        const translated = await api.translateDocument({
          file_id: uploaded.file_id,
          source_lang: sourceLang,
          target_lang: targetLang,
          is_subscribed: subscription.isSubscribed,
          is_premium: subscription.isSubscribed,
        });

        if (subscription.isSubscribed) {
          recordPagesUsed(translated.page_count || uploaded.page_count || 1);
        }

        const targetLangName = languages.find((l) => l.code === targetLang)?.name || targetLang;

        setResult({
          downloadUrl: translated.download_url,
          outputFilename: translated.output_filename,
          details: `Document traduit en ${targetLangName} · ${translated.page_count} page(s) · ${translated.total_words_translated} mots préservés avec mise en page intacte.`,
        });

        if (onRecordHistory) {
          onRecordHistory({
            id: translated.translated_file_id,
            originalFilename: uploaded.original_filename,
            outputFilename: translated.output_filename,
            sourceLang: translated.source_lang,
            targetLang: translated.target_lang,
            pageCount: translated.page_count,
            wordCount: translated.total_words_translated,
            downloadUrl: translated.download_url,
            timestamp: Date.now(),
            format: uploaded.format,
          });
        }
      } else {
        // Autres outils documentaires (merge, split, rotate, compress, conversions, etc.)
        let fileIds: string[] = [];
        if (selectedFiles.length > 1 || tool.multiple) {
          const uploadedMulti = await api.uploadMulti(selectedFiles);
          fileIds = uploadedMulti.map((u) => u.file_id);
        } else {
          const uploadedOne = await api.uploadDocument(selectedFiles[0]);
          fileIds = [uploadedOne.file_id];
        }

        const action = tool.actionEndpoint || tool.id;
        const sigValue = signatureMode === 'draw' ? 'Signature manuscrite certifiée' : signatureName;

        const res = await api.executeTool({
          tool: action,
          file_ids: fileIds,
          file_id: fileIds[0],
          angle: rotationAngle,
          ranges: pageRanges,
          pages: pagesToDelete,
          text: watermarkText,
          signature: sigValue,
          level: compressLevel,
        });

        setResult({
          downloadUrl: res.download_url,
          outputFilename: res.output_filename,
          details: res.metrics?.message || `Opération '${tool.name}' terminée avec succès (${selectedFiles.length} fichier(s) traité(s)).`,
        });

        if (onRecordHistory) {
          onRecordHistory({
            id: res.output_filename,
            originalFilename: selectedFiles[0].name,
            outputFilename: res.output_filename,
            sourceLang: '-',
            targetLang: tool.name,
            pageCount: selectedFiles.length,
            wordCount: 0,
            downloadUrl: res.download_url,
            timestamp: Date.now(),
            format: tool.id,
          });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Une erreur est survenue lors du traitement du document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 animate-in fade-in duration-150">
      
      {/* Navigation fil d'Ariane & En-tête outil */}
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tous les outils PDF</span>
        </button>

        <div className="flex items-start sm:items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${tool.bgColor} dark:bg-slate-800 ${tool.color} flex items-center justify-center border ${tool.borderColor} dark:border-slate-700 shadow-xs shrink-0`}>
            {tool.id === 'translate' ? (
              <Languages className="w-7 h-7" />
            ) : tool.id === 'merge' ? (
              <CopyPlus className="w-7 h-7" />
            ) : tool.id === 'split' ? (
              <Scissors className="w-7 h-7" />
            ) : tool.id === 'compress' || tool.id === 'compress_image' ? (
              <Minimize2 className="w-7 h-7" />
            ) : tool.id === 'rotate' ? (
              <RotateCw className="w-7 h-7" />
            ) : tool.id === 'watermark' ? (
              <Stamp className="w-7 h-7" />
            ) : tool.id === 'sign_pdf' ? (
              <PenTool className="w-7 h-7" />
            ) : tool.id === 'crop_pdf' ? (
              <Crop className="w-7 h-7" />
            ) : (
              <FileText className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tool.name}
              </h1>
              {tool.badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-transparent dark:border-red-900/50">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {tool.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Résultat obtenu */}
      {result ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100">
                Opération réalisée avec succès !
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {result.details}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={result.downloadUrl}
              download={result.outputFilename}
              className="w-full sm:w-auto flex-1 py-4 px-6 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 active:bg-red-800 text-white flex items-center justify-center gap-2 transition-colors shadow-sm text-center cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Télécharger le document traité ({result.outputFilename})</span>
            </a>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto py-4 px-5 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Traiter un autre document</span>
            </button>
          </div>
        </div>
      ) : (
        /* Zone de travail / Dépôt de fichier */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
          
          {/* Options spécifiques selon l'outil */}

          {/* 1. Traduction IA (25 langues) */}
          {tool.id === 'translate' && (
            <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                <Sparkles className="w-4 h-4" />
                <span>Configuration de la traduction neuronale</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Langue source du document
                  </label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer font-medium"
                  >
                    <option value="auto">Détection automatique (25 langues)</option>
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Langue cible (25 langues disponibles)
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer font-medium"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                La mise en page, les styles de titres, les tableaux et les runs gras/italiques de votre PDF ou Word seront conservés à l’identique.
              </p>
            </div>
          )}

          {/* 2. Rotation PDF */}
          {tool.id === 'rotate' && (
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Angle de rotation
              </label>
              <div className="flex items-center gap-3">
                {[
                  { angle: 90, label: '90° Droite (Horaire)' },
                  { angle: 180, label: '180° Inversé' },
                  { angle: 270, label: '90° Gauche (Anti-horaire)' },
                ].map((item) => (
                  <button
                    key={item.angle}
                    type="button"
                    onClick={() => setRotationAngle(item.angle)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      rotationAngle === item.angle
                        ? 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 ring-1 ring-red-600 dark:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Diviser / Scinder PDF */}
          {tool.id === 'split' && (
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Plages de pages à extraire
              </label>
              <input
                type="text"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder="Ex: 1-3, 4-5 ou 'all' pour séparer chaque page"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tapez 'all' pour extraire chaque page séparément dans un fichier ZIP, ou spécifiez des intervalles (ex: 1-2, 3-5).
              </p>
            </div>
          )}

          {/* 4. Supprimer des pages */}
          {tool.id === 'delete_pages' && (
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Numéros des pages à supprimer
              </label>
              <input
                type="text"
                value={pagesToDelete}
                onChange={(e) => setPagesToDelete(e.target.value)}
                placeholder="Ex: 2, 4, 7"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Séparez les numéros de pages par des virgules (ex: 1, 3, 5).
              </p>
            </div>
          )}

          {/* 5. Ajouter un filigrane */}
          {tool.id === 'watermark' && (
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Texte du filigrane
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Ex: CONFIDENTIEL, PROJET, COPIE INTERNE"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          )}

          {/* 6. Signer un PDF */}
          {tool.id === 'sign_pdf' && (
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Signature électronique
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('text')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      signatureMode === 'text' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Texte certifié
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('draw')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      signatureMode === 'draw' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Dessiner
                  </button>
                </div>
              </div>

              {signatureMode === 'text' ? (
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Ex: Jean Dupont, Direction Générale"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              ) : (
                <div className="space-y-2">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 relative">
                    <canvas
                      ref={signatureCanvasRef}
                      width={600}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-28 cursor-crosshair bg-white dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="absolute top-2 right-2 px-2.5 py-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eraser className="w-3 h-3" />
                      <span>Effacer</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dessinez votre signature dans le cadre ci-dessus.</p>
                </div>
              )}
            </div>
          )}

          {/* 7. Compression PDF / Image */}
          {(tool.id === 'compress' || tool.id === 'compress_image') && (
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Niveau de compression
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'low', label: 'Faible', desc: 'Qualité maximale' },
                  { id: 'medium', label: 'Recommandé', desc: 'Idéal email & web' },
                  { id: 'high', label: 'Forte', desc: 'Poids le plus léger' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCompressLevel(lvl.id)}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      compressLevel === lvl.id
                        ? 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-200 ring-1 ring-red-600 dark:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 8. Recadrer / Rogner un PDF */}
          {tool.id === 'crop_pdf' && (
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Marge de rognage (points)
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={cropMargin}
                onChange={(e) => setCropMargin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Rogner les bordures blanches et marges superflues.</p>
            </div>
          )}

          {/* Zone de glisser-déposer iLovePDF authentique */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
              dragActive
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30'
                : selectedFiles.length > 0
                ? 'border-red-300 dark:border-red-800/80 bg-red-50/20 dark:bg-red-950/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={tool.accept}
              multiple={tool.multiple}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform ${
                selectedFiles.length > 0 ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {tool.multiple
                      ? 'Sélectionner les fichiers'
                      : 'Sélectionner le document'}
                  </span>
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  ou déposez vos fichiers ici
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Formats supportés : {tool.accept} · Jusqu'à 30 Mo
                </p>
              </div>
            </div>
          </div>

          {/* Liste des fichiers sélectionnés */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <span>Fichiers prêts ({selectedFiles.length})</span>
                {tool.multiple && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter d’autres fichiers</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-850">
                {selectedFiles.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 text-xs sm:text-sm">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{f.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tabular-nums shrink-0">
                        ({(f.size / (1024 * 1024) > 1 ? `${(f.size / (1024 * 1024)).toFixed(2)} Mo` : `${(f.size / 1024).toFixed(1)} Ko`)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Supprimer ce fichier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bannière de dépassement de quota (Abonnement docLove Pro) */}
          {quotaExceeded && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Document volumineux : {quotaExceeded.pages} pages (Limite gratuite : 25 pages)</span>
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-300 leading-relaxed">
                Pour traduire des documents volumineux sans interruption, débloquez <strong>docLove Pro</strong> pour seulement <strong>8 € / mois (~5 250 FCFA)</strong> avec 2 000 pages incluses par mois !
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openPaymentModal('wave', `Document de ${quotaExceeded.pages} pages à traduire immédiatement.`)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span>Payer 5 250 F avec Wave</span>
                </button>
                <button
                  type="button"
                  onClick={() => openPaymentModal('orange', `Document de ${quotaExceeded.pages} pages à traduire immédiatement.`)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span>Payer 5 250 F avec Orange Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => openPaymentModal('card', `Document de ${quotaExceeded.pages} pages à traduire immédiatement.`)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span>Payer 8 € par Carte Bancaire</span>
                </button>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {errorMessage && !quotaExceeded && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bouton d'action principal docLove */}
          <div>
            <button
              onClick={handleExecute}
              disabled={selectedFiles.length === 0 || isProcessing}
              className={`w-full py-4.5 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 transition-all shadow-md ${
                selectedFiles.length === 0 || isProcessing
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <span>
                  {tool.id === 'translate'
                    ? `Traduire le document en ${languages.find((l) => l.code === targetLang)?.name || targetLang}`
                    : tool.id === 'merge'
                    ? 'Fusionner les PDF'
                    : tool.id === 'split'
                    ? 'Diviser le PDF'
                    : tool.id === 'compress'
                    ? 'Compresser le PDF'
                    : `Exécuter : ${tool.name}`}
                </span>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
