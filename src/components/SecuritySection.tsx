import React from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff, HardDrive, KeyRound } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const SecuritySection: React.FC = () => {
  const { t } = useI18n();

  const securityPoints = [
    {
      icon: <Lock className="w-5 h-5 text-red-600" />,
      title: "Stockage isolé hors racine publique",
      desc: "Les documents sont isolés dans des volumes inaccessibles depuis le web, avec des UUID cryptographiques à sens unique."
    },
    {
      icon: <Trash2 className="w-5 h-5 text-red-600" />,
      title: "Purge automatique sous 30 minutes",
      desc: "Tous les fichiers originaux et documents convertis sont définitivement purgés des disques après 30 minutes d'inactivité."
    },
    {
      icon: <EyeOff className="w-5 h-5 text-red-600" />,
      title: "Zéro journalisation du contenu (Zero-Log)",
      desc: "Le texte de vos documents n'est jamais écrit dans les journaux système ni utilisé pour réentraîner des modèles d'IA."
    },
    {
      icon: <HardDrive className="w-5 h-5 text-red-600" />,
      title: "Contrôle binaire strict (Magic Bytes)",
      desc: "Vérification automatisée de l'en-tête binaire réel (%PDF, PK) rejetant systématiquement tout script malveillant."
    }
  ];

  return (
    <section id="securite" className="py-14 sm:py-18 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
            Sécurité & Confidentialité
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Vos documents vous appartiennent à 100 %
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Traitement confidentiel avec isolation mémoire et suppression définitive programmée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {securityPoints.map((pt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-red-200 dark:hover:border-red-900/50 hover:bg-white dark:hover:bg-slate-850 transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center border border-red-100 dark:border-red-900/30">
                {pt.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                {pt.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Panneau de certification */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 border border-transparent dark:border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Chiffrement de bout en bout & Traitement Local</h4>
              <p className="text-xs text-slate-300 mt-0.5">Aucun transfert de données vers des tiers. Vos fichiers restent dans votre environnement sécurisé.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold bg-white/10 px-4 py-2 rounded-xl shrink-0">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>TLS 1.3 / AES-256 GCM</span>
          </div>
        </div>

      </div>
    </section>
  );
};
