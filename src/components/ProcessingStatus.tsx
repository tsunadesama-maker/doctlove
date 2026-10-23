import React from 'react';
import { Loader2, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DocumentInspection } from '../types';
import { useI18n } from '../context/I18nContext';

interface ProcessingStatusProps {
  inspection: DocumentInspection;
  targetLangName: string;
  sourceLangName: string;
  step: 'validating' | 'extracting' | 'translating' | 'reconstructing';
  error: string | null;
  onRetry: () => void;
  onCancel: () => void;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  inspection,
  targetLangName,
  sourceLangName,
  step,
  error,
  onRetry,
  onCancel,
}) => {
  const { t } = useI18n();

  const steps = [
    { id: 'validating', label: t('status_step_1') },
    { id: 'extracting', label: t('status_step_2') },
    { id: 'translating', label: t('status_step_3') },
    { id: 'reconstructing', label: t('status_step_4') },
  ];

  const getCurrentStepIndex = () => {
    switch (step) {
      case 'validating': return 0;
      case 'extracting': return 1;
      case 'translating': return 2;
      case 'reconstructing': return 3;
      default: return 0;
    }
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* En-tête de traitement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {inspection.original_filename}
            </h3>
            {/* Métadonnées sans pills, avec séparateurs typographiques */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 font-mono tabular-nums">
              <span>{(inspection.file_size_bytes / 1024).toFixed(1)} Ko</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{inspection.format.toUpperCase()}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{inspection.page_count} {inspection.page_count > 1 ? t('status_pages_label') : t('status_page_label')}</span>
            </div>
          </div>
        </div>

        {/* Indication des langues */}
        <div className="text-xs text-slate-600 sm:text-right">
          <div className="font-medium text-slate-400">{t('status_lang_pair')}</div>
          <div className="font-semibold text-slate-900 pt-0.5">
            {sourceLangName} → {targetLangName}
          </div>
        </div>
      </div>

      {/* Signalement PDF scanné / OCR si détecté */}
      {inspection.is_scanned && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t('status_scanned_alert_title')}</span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            {t('status_scanned_alert_desc')}
          </p>
        </div>
      )}

      {/* Message d'erreur en cas d'échec */}
      {error ? (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm space-y-3">
          <div className="font-semibold text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>{t('status_failure_title')}</span>
          </div>
          <p className="text-xs text-red-700 leading-relaxed font-sans">
            {error}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onRetry}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              {t('status_btn_retry')}
            </button>
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              {t('status_btn_cancel')}
            </button>
          </div>
        </div>
      ) : (
        /* Séquence d'étapes de progression réelle (sans faux pourcentage) */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{t('status_current_step')}</span>
            <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {t('status_active')}
            </span>
          </div>

          <div className="space-y-2.5">
            {steps.map((s, idx) => {
              const isDone = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950 font-medium'
                      : isDone
                      ? 'bg-slate-50 border-slate-200/80 text-slate-700'
                      : 'bg-white border-slate-100 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Animation indéterminée propre */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-1/3 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Bouton d'annulation sécurisée */}
      {!error && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onCancel}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {t('status_abort')}
          </button>
        </div>
      )}

    </div>
  );
};
