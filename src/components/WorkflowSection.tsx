import React from 'react';
import { Layers, ShieldCheck, Cpu, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const WorkflowSection: React.FC = () => {
  const { t } = useI18n();

  const steps = [
    {
      num: '01',
      icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
      title: "Ingestion & Contrôle d'intégrité",
      desc: "Validation stricte des signatures binaires (magic bytes %PDF, PK), contrôle antivirus, calcul de structure et sécurisation en mémoire isolée.",
    },
    {
      num: '02',
      icon: <Layers className="w-5 h-5 text-red-600" />,
      title: "Segmentation structurée & Masquage",
      desc: "Découpage en blocs sémantiques sans coupure de phrases. Les entités sensibles (dates, montants, emails, URLs) sont protégées avec rigueur.",
    },
    {
      num: '03',
      icon: <Cpu className="w-5 h-5 text-red-600" />,
      title: "Traitement ou Traduction dans 25 langues",
      desc: "Exécution neuronale haute précision avec prise en compte du contexte. L'ordre et l'orientation des sections d'origine sont scrupuleusement conservés.",
    },
    {
      num: '04',
      icon: <RefreshCw className="w-5 h-5 text-red-600" />,
      title: "Reconstruction géométrique fidèle",
      desc: "Pour les PDF, replacement vectoriel des polices et dimensions. Pour Word DOCX, préservation des titres, tableaux, gras et italiques.",
    },
  ];

  return (
    <section id="fonctionnement" className="py-14 sm:py-18 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
            Architecture & Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Comment fonctionne le traitement de documents ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Un processus en 4 étapes garantissant fidélité visuelle, rapidité d'exécution et confidentialité absolue.
          </p>
        </div>

        {/* 4 étapes en grille propre vectorielle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-red-200 dark:hover:border-red-900/50 hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center border border-red-100 dark:border-red-900/30">
                  {s.icon}
                </div>
                <span className="text-xs font-extrabold font-mono text-slate-400 dark:text-slate-500">
                  {s.num}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                {s.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bannière de réassurance qualité */}
        <div className="mt-10 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Zero Retention & Isolation Totale</p>
              <p className="text-slate-500 dark:text-slate-400">Les documents traités sont automatiquement effacés sous 30 minutes de nos disques sécurisés.</p>
            </div>
          </div>
          <div className="shrink-0 font-semibold text-slate-700 dark:text-slate-300">
            Conforme RGPD & Chiffrement TLS
          </div>
        </div>

      </div>
    </section>
  );
};
