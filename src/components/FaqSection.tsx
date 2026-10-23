import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t } = useI18n();

  const faqs = [
    {
      q: "Comment fonctionne la traduction dans 25 langues avec préservation de mise en page ?",
      a: "Notre moteur extrait le texte par blocs géométriques et runs typographiques. Il masque temporairement les entités critiques (dates, nombres, emails) pour éviter toute corruption, traduit le texte dans la langue cible parmi les 25 langues supportées, puis reconstruit le document avec les polices, alignements, titres et tableaux intacts."
    },
    {
      q: "Que se passe-t-il si mon PDF est scanné ou numérisé ?",
      a: "Si votre document ne contient aucun texte vectoriel sélectionnable mais uniquement des images scannées, vous pouvez utiliser l'outil 'OCR de PDF' présent dans notre catalogue pour extraire le texte brut avant tout traitement ou traduction."
    },
    {
      q: "Quels formats de documents puis-je convertir ou traiter ?",
      a: "Vous pouvez convertir des PDF vers Word (.docx), Excel (.csv/.xlsx), PowerPoint (.pptx), images (JPG, PNG), TXT, HTML, SVG, EPUB, DXF. Et inversement, transformer des fichiers Word, PPTX, Excel, Images (JPG, PNG), HTML et DWG en PDF parfaits."
    },
    {
      q: "Mes documents sont-ils confidentiels et protégés ?",
      a: "Absolument. Vos documents sont traités dans un espace mémoire isolé et sont automatiquement détruits sous 30 minutes de nos serveurs. Aucune donnée n'est transmise à des tiers ni réutilisée pour entraîner des algorithmes."
    },
    {
      q: "Puis-je fusionner, diviser ou faire pivoter mes PDF gratuitement ?",
      a: "Oui, l'ensemble des outils de manipulation (Fusionner, Diviser, Rotation, Suppression de pages, Compresser, Signer, Filigrane, Recadrer) est 100 % gratuit et sans limitation abusive."
    },
    {
      q: "Comment fonctionne le paiement si mon document dépasse 25 pages (abonnement 8 € / mois) ?",
      a: "La traduction de document est 100 % gratuite jusqu'à 25 pages. Si votre document dépasse 25 pages, un abonnement mensuel avantageux à 8 € / mois (~5 250 FCFA) vous permet de traduire jusqu'à 2 000 pages par mois dans n'importe quelle langue. Vous pouvez régler par Wave Sénégal, Orange Money ou Carte Bancaire, résiliable à tout moment sans engagement."
    }
  ];

  return (
    <section id="faq" className="py-14 sm:py-18 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
            Questions Fréquentes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Foire Aux Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Tout ce que vous devez savoir sur la suite documentaire docLove et les abonnements.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full py-4.5 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-red-600 dark:text-red-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
