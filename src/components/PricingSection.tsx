import React from 'react';
import { Check, Smartphone, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useSubscription } from '../context/SubscriptionContext';

export const PricingSection: React.FC = () => {
  const { t } = useI18n();
  const { subscription, openPaymentModal } = useSubscription();

  return (
    <section id="tarifs" className="py-14 sm:py-18 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
            Tarifs Transparents
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Des outils 100 % gratuits et un forfait Pro illimité
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Tous les outils de manipulation sont gratuits sans inscription. Abonnez-vous pour traduire vos documents volumineux.
          </p>
        </div>

        {/* Grille des 2 offres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Offre Gratuite */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-2xs flex flex-col justify-between space-y-6 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Offre Découverte & Gratuite
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                  100 % Gratuit
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">0 €</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ document</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tous les outils de conversion, fusion, découpage, signature et traduction jusqu'à 25 pages.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Tous les 30+ outils</strong> accessibles immédiatement</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Jusqu'à 25 pages</strong> par traduction sans frais</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Formats PDF, Word, Excel, PPTX, Images</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Suppression automatique sous 30 minutes</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#/tool/translate"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors flex items-center justify-center cursor-pointer"
              >
                Utiliser gratuitement
              </a>
            </div>
          </div>

          {/* Offre Premium */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-red-600 dark:border-red-500 p-7 shadow-sm flex flex-col justify-between space-y-6 relative transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                  Abonnement Mensuel docLove Pro
                </span>
                <span className="text-xs font-bold text-white bg-red-600 dark:bg-red-500 px-2.5 py-0.5 rounded-full">
                  Jusqu'à 2 000 pages
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">8 €</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">(~5 250 FCFA)</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ mois</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Dès que votre document dépasse 25 pages, souscrivez à l'abonnement mensuel pour traduire jusqu'à 2 000 pages en toute liberté.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span><strong>Au-delà de 25 pages</strong> (débloqué sans interruption)</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span><strong>Jusqu'à 2 000 pages</strong> par mois</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>Traduction de document en <strong>toutes les langues</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>Préservation fidèle de la mise en page d'origine</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>Règlement instantané : Wave Sénégal, Orange Money, Free ou CB</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              {subscription.isSubscribed ? (
                <button
                  type="button"
                  onClick={() => openPaymentModal('wave')}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Abonnement Actif ({subscription.pagesUsed}/2000 pages) · Gérer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openPaymentModal('wave')}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center"
                >
                  <span>Souscrire à docLove Pro (8 € / mois)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Moyens de paiement Sénégal interactifs */}
        <div className="mt-10 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-xs transition-colors">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Moyens de paiement acceptés pour docLove Pro (5 250 FCFA / 8 €) :
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Cliquez sur un moyen pour initier le paiement instantané sécurisé.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => openPaymentModal('wave')}
              className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Wave Sénégal</span>
            </button>

            <button
              onClick={() => openPaymentModal('orange')}
              className="px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 text-orange-700 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-800 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Orange Money</span>
            </button>

            <button
              onClick={() => openPaymentModal('card')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Carte Bancaire</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

