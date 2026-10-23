import React from 'react';
import { useI18n } from '../context/I18nContext';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                dL
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                doc<span className="text-red-600 dark:text-red-500">Love</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              La plateforme tout-en-un de gestion documentaire, conversion universelle et traduction professionnelle dans toutes les langues avec préservation de mise en page.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400">Wave</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400">Orange Money</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">Free Money</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Visa / Mastercard</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <a href="#/tool/merge" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Fusionner PDF</a>
            <a href="#/tool/split" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Diviser PDF</a>
            <a href="#/tool/compress" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Compresser PDF</a>
            <a href="#/tool/pdf_to_word" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">PDF en Word</a>
            <a href="#/tool/translate" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Traduction (25 langues)</a>
            <a href="#tarifs" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Tarifs & Forfaits</a>
            <a href="#fonctionnement" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Fonctionnement</a>
            <a href="#securite" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Sécurité</a>
            <a href="#faq" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">FAQ</a>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} docLove. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>Confidentialité absolue (Zéro rétention sous 30 min)</span>
            <span>·</span>
            <span>Conditions générales de vente & d'utilisation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
