import React from 'react';
import { Check, X, Scale } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const ModelBenchmark: React.FC = () => {
  const { t } = useI18n();
  const models = [
    {
      name: "OPUS-MT (MarianMT)",
      developer: "Helsinki-NLP / Université d'Helsinki",
      license: "Apache 2.0 / CC-BY-4.0",
      commercial: true,
      ramRequired: "~300 à 600 Mo / paire",
      storage: "~300 Mo / modèle",
      languages: "1 000+ paires bilingues directes",
      cpuRun: "Très rapide sur CPU standard",
      status: "Sélectionné (Moteur recommandé)",
      note: "Parfait pour le déploiement local 0 € sans GPU. Aucune restriction commerciale."
    },
    {
      name: "Argos Translate",
      developer: "Open Source Community / LibreTranslate",
      license: "MIT License",
      commercial: true,
      ramRequired: "~400 Mo",
      storage: "~250 Mo / paquet",
      languages: "30+ langues majeures",
      cpuRun: "Optimisé CTranslate2 (CPU)",
      status: "Sélectionné (Intégration modulaire)",
      note: "Totalement autonome, installable via paquets .argosmodel, licence MIT très permissive."
    },
    {
      name: "MADLAD-400",
      developer: "Google Research",
      license: "Apache 2.0",
      commercial: true,
      ramRequired: "12 Go à 24 Go+",
      storage: "6 Go à 20 Go",
      languages: "400+ langues",
      cpuRun: "Inexécutable sur machine standard (OOM)",
      status: "Disqualifié pour le prototype local",
      note: "Licence commerciale valide mais empreinte mémoire disproportionnée par rapport aux 4 Go de RAM disponibles."
    },
    {
      name: "NLLB-200 (Meta)",
      developer: "Meta AI",
      license: "CC-BY-NC 4.0 (Non-Commercial)",
      commercial: false,
      ramRequired: "~2,5 Go (modèle 600M)",
      storage: "~2,4 Go",
      languages: "200 langues",
      cpuRun: "Modéré sur CPU",
      status: "Rejeté (Licence non commerciale)",
      note: "Interdit pour un produit commercial en raison de la clause Non-Commercial (NC) de la licence."
    }
  ];

  return (
    <section id="modeles" className="py-16 sm:py-20 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
            {t('models_kicker')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ textWrap: 'balance' }}>
            {t('models_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
            {t('models_subtitle')}
          </p>
        </div>

        {/* Tableau comparatif professionnel */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                <th className="py-3.5 px-4">Moteur</th>
                <th className="py-3.5 px-4">Licence</th>
                <th className="py-3.5 px-4 text-center">Usage commercial</th>
                <th className="py-3.5 px-4">Empreinte RAM</th>
                <th className="py-3.5 px-4">Langues</th>
                <th className="py-3.5 px-4">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {models.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    <div>{m.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">{m.developer}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {m.license}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {m.commercial ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Autorisé
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400 font-semibold text-xs">
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        Interdit (NC)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-400">
                    {m.ramRequired}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {m.languages}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs font-semibold ${
                      m.status.includes('Sélectionné')
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Synthèse du choix retenu */}
        <div className="mt-8 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Scale className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>Conclusion de l'ingénierie : Pourquoi OPUS-MT et Argos Translate ?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Pour garantir un <strong>coût de fonctionnement strictement égal à 0 €</strong>, ces deux architectures s'exécutent en mémoire vive sur un CPU standard sans nécessiter de serveur GPU coûteux (chacune consomme moins de 500 Mo de RAM). Leurs licences (Apache 2.0 et MIT) autorisent explicitement l'exploitation commerciale sans royalties, contrairement à NLLB-200 dont la clause CC-BY-NC interdirait toute monétisation.
          </p>
        </div>

      </div>
    </section>
  );
};
