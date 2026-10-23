import React from 'react';
import { Download, CheckCircle2, RotateCcw, Info, ShieldCheck } from 'lucide-react';
import { TranslationResponse } from '../types';
import { useI18n } from '../context/I18nContext';

interface TranslationResultProps {
  result: TranslationResponse;
  originalFilename: string;
  onReset: () => void;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({
  result,
  originalFilename,
  onReset,
}) => {
  const { t } = useI18n();
  const isPdf = result.output_filename.endsWith('.pdf') || result.translated_file_id.endsWith('.pdf');
  const formatLabel = isPdf ? 'PDF' : 'Word DOCX';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Bannière de confirmation */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950">
        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-emerald-950">
            {t('result_success_title')}
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {t('result_success_desc')}
          </p>
        </div>
      </div>

      {/* Détails du document généré */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200/80">
        <div>
          <div className="text-xs text-slate-500 font-medium">{t('result_pages_processed')}</div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums pt-0.5">
            {result.page_count} {result.page_count > 1 ? t('status_pages_label') : t('status_page_label')}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 font-medium">{t('result_volume_translated')}</div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums pt-0.5">
            {result.total_words_translated} {t('result_words')}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 font-medium">{t('result_output_format')}</div>
          <div className="text-lg font-bold text-slate-900 pt-0.5">
            {formatLabel}
          </div>
        </div>
      </div>

      {/* Avertissement de transparence sur la mise en page (exigence : ne jamais prétendre à une fidélité parfaite si non assurée) */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900">{t('result_fidelity_notice_title')}</span>
          <p className="leading-relaxed">
            {t('result_fidelity_notice_desc')}
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <a
          href={result.download_url}
          download={result.output_filename}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer text-center"
        >
          <Download className="w-4 h-4" />
          <span>{t('result_download_btn')} ({formatLabel})</span>
        </a>

        <button
          onClick={onReset}
          className="w-full sm:w-auto py-3.5 px-5 rounded-lg font-semibold text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('result_restart_btn')}</span>
        </button>
      </div>

      {/* Note de confidentialité */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          {t('result_storage_info')}
        </span>
        <span>{t('result_storage_exp')}</span>
      </div>

    </div>
  );
};
