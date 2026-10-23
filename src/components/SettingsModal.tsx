import React, { useEffect } from 'react';
import { X, Globe2, Cpu, Check, Languages, Moon, Sun } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDocumentLanguages: Language[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  availableDocumentLanguages,
}) => {
  const { uiLang, setUiLang, t, uiLanguages, defaultTargetLang, setDefaultTargetLang } = useI18n();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* En-tête du panneau */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="settings-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('settings_title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('settings_subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t('settings_close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps des réglages */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
          
          {/* Section 0 : Mode Sombre (Dark Mode) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-red-500" />
                ) : (
                  <Sun className="w-4 h-4 text-red-600" />
                )}
                <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t('settings_theme_label')}
                </label>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? t('settings_theme_dark') : t('settings_theme_light')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings_theme_desc')}
            </p>

            {/* Boutons de bascule Clair / Sombre */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-red-600 bg-red-50/70 dark:bg-red-950/30 text-red-950 dark:text-red-300 font-bold shadow-xs ring-1 ring-red-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold">
                    {t('settings_theme_light')}
                  </div>
                </div>
                {theme === 'light' && (
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-red-600 bg-red-950/40 text-red-300 font-bold shadow-xs ring-1 ring-red-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-400 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold">
                    {t('settings_theme_dark')}
                  </div>
                </div>
                {theme === 'dark' && (
                  <Check className="w-4 h-4 text-red-500 shrink-0" />
                )}
              </button>
            </div>
          </div>
          
          {/* Section 1 : Sélecteur de Langue de l'interface */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-red-600" />
              <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t('settings_ui_lang_label')}
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings_ui_lang_desc')}
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {uiLanguages.map((lang) => {
                const isSelected = uiLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setUiLang(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-600 bg-red-50/60 dark:bg-red-950/30 text-red-950 dark:text-red-300 font-bold shadow-xs ring-1 ring-red-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base" role="img" aria-label={lang.name}>
                        {lang.flag}
                      </span>
                      <span className="text-xs sm:text-sm">{lang.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2 : Langue cible par défaut pour les documents */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-red-600" />
              <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t('settings_default_target_label')}
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings_default_target_desc')}
            </p>

            <select
              value={defaultTargetLang}
              onChange={(e) => setDefaultTargetLang(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
            >
              {availableDocumentLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section 3 : Information technique sur le moteur actif */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-750 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-red-600" />
              <span>{t('settings_engine_status')}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Moteur local autonome avec isolation mémoire, traitement haute performance et préservation géométrique intégrale.
            </p>
          </div>

        </div>

        {/* Pied du panneau */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            {t('settings_close')}
          </button>
        </div>

      </div>
    </div>
  );
};
