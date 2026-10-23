import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, UILanguageCode, UI_LANGUAGES, UILanguageOption } from '../i18n/translations';

type TranslationKey = keyof typeof translations.fr;

interface I18nContextType {
  uiLang: UILanguageCode;
  setUiLang: (lang: UILanguageCode) => void;
  t: (key: TranslationKey) => string;
  uiLanguages: UILanguageOption[];
  defaultTargetLang: string;
  setDefaultTargetLang: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY_UI_LANG = 'docutrad_ui_lang';
const STORAGE_KEY_DEFAULT_TARGET = 'docutrad_default_target';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiLang, setUiLangState] = useState<UILanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UI_LANG);
      if (saved && (saved === 'fr' || saved === 'en' || saved === 'es' || saved === 'de')) {
        return saved;
      }
    } catch {}
    return 'fr';
  });

  const [defaultTargetLang, setDefaultTargetLangState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEFAULT_TARGET);
      if (saved) return saved;
    } catch {}
    return 'fr';
  });

  const setUiLang = (lang: UILanguageCode) => {
    setUiLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_UI_LANG, lang);
      document.documentElement.lang = lang;
    } catch {}
  };

  const setDefaultTargetLang = (lang: string) => {
    setDefaultTargetLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_DEFAULT_TARGET, lang);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  const t = (key: TranslationKey): string => {
    const currentDict = translations[uiLang] || translations.fr;
    return currentDict[key] || translations.fr[key] || key;
  };

  return (
    <I18nContext.Provider
      value={{
        uiLang,
        setUiLang,
        t,
        uiLanguages: UI_LANGUAGES,
        defaultTargetLang,
        setDefaultTargetLang,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};
