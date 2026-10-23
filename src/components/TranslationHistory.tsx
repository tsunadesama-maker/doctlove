import React from 'react';
import { History, Download, Trash2, FileText, Clock } from 'lucide-react';
import { TranslationHistoryItem } from '../types';
import { useI18n } from '../context/I18nContext';

interface TranslationHistoryProps {
  history: TranslationHistoryItem[];
  onClearHistory: () => void;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const { t } = useI18n();

  const formatRelativeTime = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);

    if (diffMin < 1) {
      return "À l'instant";
    }
    if (diffMin < 60) {
      return `Il y a ${diffMin} min`;
    }
    return `Il y a ${diffHours} h`;
  };

  const handleClear = () => {
    if (window.confirm("Effacer tout l'historique de vos documents récents ?")) {
      onClearHistory();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-4 transition-colors">
      {/* En-tête de la section */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
              Documents récents ({history.length}/5)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              Retrouvez et retéléchargez vos 5 derniers documents traités (stockés localement sur votre navigateur).
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
            title="Vider l'historique"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vider l'historique</span>
          </button>
        )}
      </div>

      {/* Liste des éléments ou état vide */}
      {history.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            Aucun document récent dans l'historique
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
            Vos documents traités (fusions, découpages, conversions, traductions) apparaîtront ici pour un retéléchargement rapide.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {history.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-850/60 rounded-xl px-2.5 -mx-2.5 transition-colors"
            >
              {/* Informations document */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                    {item.originalFilename}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.sourceLang} → {item.targetLang}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span>{item.format.toUpperCase()}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span>{item.pageCount} page(s)</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span>{formatRelativeTime(item.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Action de retéléchargement */}
              <div className="shrink-0 flex items-center sm:self-center">
                <a
                  href={item.downloadUrl}
                  download={item.outputFilename}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
