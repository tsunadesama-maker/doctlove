import React from 'react';
import { ShieldCheck, FileCheck2, Languages, Sparkles, Zap } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface HeroSectionProps {
  onSelectTool?: (toolId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTool }) => {
  const { t } = useI18n();

  return (
    <section className="pt-10 pb-8 sm:pt-14 sm:pb-12 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
        
        {/* Badge catégorie sobre */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span>Plateforme complète de gestion, conversion & traduction documentaire</span>
        </div>

        {/* Titre principal inspiré d'iLovePDF */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]" style={{ textWrap: 'balance' }}>
          Tous les outils pour gérer vos PDF & documents en un seul endroit
        </h1>

        {/* Sous-titre clair */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Chaque outil dont vous avez besoin pour travailler avec les PDF : fusionnez, divisez, compressez, convertissez, éditez, signez et traduisez dans 25 langues avec préservation intégrale de mise en page.
        </p>

        {/* Micro-preuves de conformité (anti-pill, typographie aérée avec séparateurs) */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4 text-red-600 dark:text-red-400" />
            Traitement local ultra-rapide
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Languages className="w-4 h-4 text-red-600 dark:text-red-400" />
            Traduction IA dans 25 langues
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <FileCheck2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            Préservation fidèle de mise en page
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            100 % Confidentiel & Sécurisé
          </span>
        </div>

      </div>
    </section>
  );
};
