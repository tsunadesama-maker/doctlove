import React, { useState, useRef, useEffect } from 'react';
import { Upload, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { useI18n } from '../context/I18nContext';

interface DocumentUploadProps {
  languages: Language[];
  onUploadAndTranslate: (file: File, sourceLang: string, targetLang: string) => void;
  isUploading: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  languages,
  onUploadAndTranslate,
  isUploading,
}) => {
  const { t, defaultTargetLang } = useI18n();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>(defaultTargetLang || 'fr');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultTargetLang) {
      setTargetLang(defaultTargetLang);
    }
  }, [defaultTargetLang]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setValidationError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setValidationError(t('upload_err_format'));
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setValidationError(t('upload_err_size'));
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError(t('upload_err_required'));
      return;
    }
    onUploadAndTranslate(selectedFile, sourceLang, targetLang);
  };

  // Création d'un document de démonstration pour test immédiat
  const handleLoadDemoFile = (type: 'pdf' | 'docx') => {
    if (type === 'pdf') {
      const pdfRaw = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 135 >> stream
BT
/F1 16 Tf
50 780 Td
(Invoice and Client Agreement) Tj
/F1 12 Tf
0 -30 Td
(Total amount: 1,250.50 EUR dated 09/10/2026 for user service.) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000431 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
510
%%EOF`;
      const blob = new Blob([pdfRaw], { type: 'application/pdf' });
      const demoFile = new File([blob], 'demo_contrat_facture.pdf', { type: 'application/pdf' });
      validateAndSetFile(demoFile);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* En-tête de configuration des langues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t('upload_source_lang')}
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="auto">{t('upload_auto_detect')}</option>
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t('upload_target_lang')}
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zone de glisser-déposer */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50'
              : selectedFile
              ? 'border-indigo-400 bg-indigo-50/20'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selectedFile ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {selectedFile ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 font-mono tabular-nums">
                  {(selectedFile.size / 1024).toFixed(1)} Ko · Format {selectedFile.name.split('.').pop()?.toUpperCase()}
                </p>
                <p className="text-xs text-indigo-600 font-medium pt-1">
                  {t('upload_file_change')}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {t('upload_dropzone_title')} <span className="text-indigo-600 hover:underline">{t('upload_dropzone_browse')}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {t('upload_dropzone_hint')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message d'erreur de validation si applicable */}
        {validationError && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Raccourci de démonstration */}
        {!selectedFile && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {t('upload_demo_hint')}
            </span>
            <button
              type="button"
              onClick={() => handleLoadDemoFile('pdf')}
              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline cursor-pointer"
            >
              {t('upload_demo_btn')}
            </button>
          </div>
        )}

        {/* Bouton d'action principal */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className={`w-full py-3.5 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              !selectedFile || isUploading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white cursor-pointer'
            }`}
          >
            <span>{t('upload_submit_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rappel des conditions sans frais */}
        <div className="text-center text-xs text-slate-400">
          {t('upload_free_notice')}
        </div>

      </form>
    </div>
  );
};
