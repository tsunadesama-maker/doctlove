import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  ChevronDown,
  History,
  Settings,
  Languages,
  CopyPlus,
  Scissors,
  Minimize2,
  PenTool,
  Image,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { TOOLS } from '../data/tools';

interface HeaderProps {
  onSelectTool: (toolId: string) => void;
  onGoHome: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTool,
  onGoHome,
  onOpenSettings,
  onOpenHistory,
  historyCount,
}) => {
  const { t, uiLang, setUiLang, uiLanguages } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { subscription, openPaymentModal } = useSubscription();
  const [convertMenuOpen, setConvertMenuOpen] = useState(false);
  const [allToolsMenuOpen, setAllToolsMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const convertRef = useRef<HTMLDivElement>(null);
  const allToolsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Fermer les menus en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (convertRef.current && !convertRef.current.contains(e.target as Node)) {
        setConvertMenuOpen(false);
      }
      if (allToolsRef.current && !allToolsRef.current.contains(e.target as Node)) {
        setAllToolsMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = uiLanguages.find((l) => l.code === uiLang) || uiLanguages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Logo iLovePDF Style */}
        <div className="flex items-center gap-6">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-sm group-hover:bg-red-700 transition-colors">
              dL
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                doc<span className="text-red-600">Love</span>
              </span>
            </div>
          </button>

          {/* Navigation principale grand écran (Format iLovePDF) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            
            <button
              onClick={() => onSelectTool('merge')}
              className="px-3 py-2 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              Fusionner PDF
            </button>

            <button
              onClick={() => onSelectTool('split')}
              className="px-3 py-2 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              Diviser PDF
            </button>

            <button
              onClick={() => onSelectTool('compress')}
              className="px-3 py-2 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              Compresser PDF
            </button>

            {/* Menu Convertir PDF */}
            <div ref={convertRef} className="relative">
              <button
                onClick={() => {
                  setConvertMenuOpen(!convertMenuOpen);
                  setAllToolsMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  convertMenuOpen 
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40' 
                    : 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30'
                }`}
              >
                <span>Convertir PDF</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {convertMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-1.5 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Convertir depuis un PDF
                  </div>
                  {[
                    { id: 'pdf_to_word', name: 'PDF en Word' },
                    { id: 'pdf_to_pptx', name: 'PDF en PPTX' },
                    { id: 'pdf_to_excel', name: 'PDF en Excel' },
                    { id: 'pdf_to_jpg', name: 'PDF en JPG' },
                    { id: 'pdf_to_txt', name: 'PDF en TXT' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTool(item.id);
                        setConvertMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-between cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 hover:opacity-100" />
                    </button>
                  ))}

                  <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

                  <div className="px-4 py-1.5 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Convertir en PDF
                  </div>
                  {[
                    { id: 'word_to_pdf', name: 'Word en PDF' },
                    { id: 'pptx_to_pdf', name: 'PowerPoint en PDF' },
                    { id: 'excel_to_pdf', name: 'Excel en PDF' },
                    { id: 'image_to_pdf', name: 'Image en PDF (JPG/PNG)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTool(item.id);
                        setConvertMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-between cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Tous les Outils PDF */}
            <div ref={allToolsRef} className="relative">
              <button
                onClick={() => {
                  setAllToolsMenuOpen(!allToolsMenuOpen);
                  setConvertMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  allToolsMenuOpen 
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40' 
                    : 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30'
                }`}
              >
                <span>Tous les outils PDF</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {allToolsMenuOpen && (
                <div className="absolute left-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in duration-150 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Catalogue complet ({TOOLS.length} services)</span>
                    <button
                      onClick={() => { onGoHome(); setAllToolsMenuOpen(false); }}
                      className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Voir la grille
                    </button>
                  </div>

                  <div className="space-y-1">
                    {[
                      { id: 'edit_pdf', name: 'Modifier / Éditer PDF' },
                      { id: 'sign_pdf', name: 'Signer un PDF' },
                      { id: 'watermark', name: 'Ajouter un filigrane' },
                      { id: 'crop_pdf', name: 'Recadrer / Rogner PDF' },
                      { id: 'rotate', name: 'Rotation PDF' },
                      { id: 'delete_pages', name: 'Supprimer des pages' },
                      { id: 'ocr', name: 'OCR de PDF' },
                      { id: 'compress_image', name: 'Compresser une image' },
                      { id: 'image_to_jpg', name: 'Image en JPG' },
                      { id: 'mp4_to_mp3', name: 'MP4 en MP3' },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onSelectTool(tool.id);
                          setAllToolsMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>{tool.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tarifs & Paiement */}
            <a
              href="#tarifs"
              className="px-3 py-2 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              Tarifs
            </a>

            {/* Traduction universelle (Toutes langues) */}
            <button
              onClick={() => onSelectTool('translate')}
              className="px-3.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200/60 dark:border-red-900/40"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Traduction (Toutes langues)</span>
            </button>

          </nav>
        </div>

        {/* Côté Droit : Abonnement Pro, Bascule Thème, Historique, Sélecteur de Langue, Paramètres */}
        <div className="flex items-center gap-2">
          
          {/* Badge / Bouton Abonnement Pro */}
          {subscription.isSubscribed ? (
            <button
              onClick={() => openPaymentModal('wave')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
              title="Gérer mon abonnement docLove Pro"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>docLove Pro</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                ({subscription.pagesUsed}/2000 p.)
              </span>
            </button>
          ) : (
            <button
              onClick={() => openPaymentModal('wave')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-extrabold shadow-2xs transition-colors cursor-pointer"
              title="Passer à docLove Pro (8 € / mois - Wave, OM, CB)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro (8 €)</span>
            </button>
          )}

          {/* Bouton Rapide Dark Mode / Light Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
            aria-label="Basculer le mode sombre"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Bouton Historique avec badge */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Historique des documents traités"
          >
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Historique</span>
            {historyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Sélecteur de Langue d'interface */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
              title="Changer la langue de l'interface"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline">{currentLangObj.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Langue de l'interface
                </div>
                {uiLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setUiLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                      uiLang === l.code
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Paramètres */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Paramètres"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
