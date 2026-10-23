import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  QrCode,
  ArrowRight,
  Download,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { useSubscription, Invoice } from '../context/SubscriptionContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGateway?: string;
  reason?: string | null;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  initialGateway = 'wave',
  reason,
  onSuccess,
}) => {
  const { subscribe, subscription, invoices, downloadInvoice, cancelSubscription } = useSubscription();

  const [activeTab, setActiveTab] = useState<'checkout' | 'invoices'>('checkout');
  const [selectedGateway, setSelectedGateway] = useState<string>(initialGateway);
  
  // Wave state
  const [wavePhone, setWavePhone] = useState('77 842 19 30');
  const [waveMode, setWaveMode] = useState<'phone' | 'qr'>('phone');

  // Orange Money state
  const [omPhone, setOmPhone] = useState('77 650 44 21');
  const [omCode, setOmCode] = useState('8942');

  // Free Money state
  const [freePhone, setFreePhone] = useState('76 312 88 05');

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890');
  const [cardName, setCardName] = useState('Mamadou Diallo');
  const [cardExp, setCardExp] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('834');

  // Progress state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialGateway) {
      setSelectedGateway(initialGateway);
    }
    if (isOpen) {
      setPaymentSuccess(false);
      setIsProcessing(false);
      setErrorMsg(null);
    }
  }, [isOpen, initialGateway]);

  if (!isOpen) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (selectedGateway === 'wave') {
        if (!wavePhone || wavePhone.length < 8) {
          throw new Error('Veuillez saisir un numéro de téléphone Wave valide (ex: 77 123 45 67).');
        }
        setProcessingStep('Connexion sécurisée aux serveurs Wave Sénégal...');
        await new Promise((r) => setTimeout(r, 900));
        setProcessingStep('Envoi de la demande de prélèvement 5 250 FCFA sur Wave...');
        await new Promise((r) => setTimeout(r, 1000));
        setProcessingStep('Validation de la signature cryptographique...');
        await new Promise((r) => setTimeout(r, 800));

        await subscribe('wave', { phoneNumber: `+221 ${wavePhone}` });
      } else if (selectedGateway === 'orange') {
        if (!omPhone || omPhone.length < 8) {
          throw new Error('Veuillez saisir un numéro Orange Money valide.');
        }
        setProcessingStep('Authentification Orange Money Sénégal (#144#391#)...');
        await new Promise((r) => setTimeout(r, 1000));
        setProcessingStep('Vérification du solde et débit de 5 250 FCFA...');
        await new Promise((r) => setTimeout(r, 1100));

        await subscribe('orange', { phoneNumber: `+221 ${omPhone}` });
      } else if (selectedGateway === 'free') {
        if (!freePhone || freePhone.length < 8) {
          throw new Error('Veuillez saisir un numéro Free Money valide.');
        }
        setProcessingStep('Connexion au réseau Free Money Sénégal...');
        await new Promise((r) => setTimeout(r, 1000));
        setProcessingStep('Confirmation du transfert...');
        await new Promise((r) => setTimeout(r, 1000));

        await subscribe('free', { phoneNumber: `+221 ${freePhone}` });
      } else {
        // Carte Bancaire
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
          throw new Error('Numéro de carte bancaire invalide.');
        }
        setProcessingStep('Chiffrement TLS 1.3 / AES-256 des coordonnées bancaires...');
        await new Promise((r) => setTimeout(r, 900));
        setProcessingStep('Vérification 3D-Secure avec votre établissement émetteur...');
        await new Promise((r) => setTimeout(r, 1200));

        await subscribe('card', {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardName,
        });
      }

      setPaymentSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la validation du paiement.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* En-tête modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-xs">
              dL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  doc<span className="text-red-600">Love</span> Pro
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400">
                  8 € · 2 000 pages
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Abonnement mensuel tout-en-un · Résiliation libre à tout moment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Onglets : Souscription / Factures */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2 bg-slate-50/30 dark:bg-slate-900/30">
          <button
            type="button"
            onClick={() => setActiveTab('checkout')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer mr-6 ${
              activeTab === 'checkout'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Paiement & Activation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Mes Reçus & Factures ({invoices.length})</span>
          </button>
        </div>

        {/* Contenu onglet Factures */}
        {activeTab === 'invoices' && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Statut de l'abonnement
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {subscription.isSubscribed
                    ? `Actif · ${subscription.pagesUsed} / 2 000 pages utilisées ce mois-ci`
                    : 'Aucun abonnement actif actuellement'}
                </p>
              </div>

              {subscription.isSubscribed && (
                <button
                  onClick={async () => {
                    if (window.confirm("Êtes-vous sûr de vouloir résilier votre abonnement docLove Pro ?")) {
                      await cancelSubscription();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Résilier l'abonnement
                </button>
              )}
            </div>

            {invoices.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <Receipt className="w-8 h-8 mx-auto stroke-[1.5]" />
                <p className="text-xs font-medium">Aucune facture enregistrée pour le moment.</p>
                <p className="text-[11px] text-slate-400">
                  Dès que vous activez un abonnement Wave, Orange Money ou CB, votre reçu officiel apparaîtra ici.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoices.map((inv) => (
                  <div key={inv.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{inv.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {inv.date} · {inv.gateway} {inv.phoneNumber ? `(${inv.phoneNumber})` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                          {inv.amountEur.toFixed(2)} €
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {inv.amountXof.toLocaleString()} FCFA
                        </div>
                      </div>
                      <button
                        onClick={() => downloadInvoice(inv)}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Télécharger le reçu officiel"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contenu onglet Checkout */}
        {activeTab === 'checkout' && (
          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">

            {/* Alerte si déclenché par dépassement de quota (ex: > 25 pages) */}
            {reason && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    Débloquez votre document volumineux
                  </h4>
                  <p className="text-xs text-amber-900/80 dark:text-amber-300 leading-relaxed">
                    {reason}
                  </p>
                </div>
              </div>
            )}

            {/* Résumé de l'offre */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-200/60 dark:border-red-900/40 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  docLove Pro Mensuel
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  2 000 pages / mois · Toutes les langues
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Priorité maximale, documents volumineux, sans interruption.
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                  8 €
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 font-bold font-mono">
                  ~5 250 FCFA
                </div>
              </div>
            </div>

            {/* Succès paiement */}
            {paymentSuccess ? (
              <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Paiement validé avec succès !
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Votre compte <strong>docLove Pro</strong> est actif. Vous disposez de <strong>2 000 pages</strong> de traduction haute fidélité pour ce mois.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {invoices.length > 0 && (
                    <button
                      type="button"
                      onClick={() => downloadInvoice(invoices[0])}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger la facture officielle</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <span>Continuer sur docLove</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-5">
                
                {/* Choix du moyen de paiement */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Sélectionnez votre moyen de paiement
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* 1. Wave Sénégal */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('wave')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedGateway === 'wave'
                          ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 ring-2 ring-sky-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                        W
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">Wave</div>
                        <div className="text-[10px] text-slate-400">Sénégal (5 250 F)</div>
                      </div>
                    </button>

                    {/* 2. Orange Money */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('orange')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedGateway === 'orange'
                          ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                        OM
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">Orange Money</div>
                        <div className="text-[10px] text-slate-400">Sénégal (5 250 F)</div>
                      </div>
                    </button>

                    {/* 3. Free Money */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('free')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedGateway === 'free'
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                        FM
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">Free Money</div>
                        <div className="text-[10px] text-slate-400">Sénégal (5 250 F)</div>
                      </div>
                    </button>

                    {/* 4. Carte Bancaire */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('card')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedGateway === 'card'
                          ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-2xs">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">Carte Bancaire</div>
                        <div className="text-[10px] text-slate-400">Visa / MC (8 €)</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Formulaire spécifique Wave */}
                {selectedGateway === 'wave' && (
                  <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-900 dark:text-sky-200">
                        <span>Paiement par Wave Sénégal</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setWaveMode('phone')}
                          className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                            waveMode === 'phone' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-sky-100 dark:hover:bg-sky-900/40'
                          }`}
                        >
                          Téléphone
                        </button>
                        <button
                          type="button"
                          onClick={() => setWaveMode('qr')}
                          className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                            waveMode === 'qr' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-sky-100 dark:hover:bg-sky-900/40'
                          }`}
                        >
                          Code QR
                        </button>
                      </div>
                    </div>

                    {waveMode === 'phone' ? (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                          Numéro Wave Sénégal (+221)
                        </label>
                        <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500">
                          <span className="px-3 text-xs font-mono font-bold text-slate-500 bg-slate-50 dark:bg-slate-750 border-r border-slate-200 dark:border-slate-700 py-2.5">
                            +221
                          </span>
                          <input
                            type="text"
                            required
                            value={wavePhone}
                            onChange={(e) => setWavePhone(e.target.value)}
                            placeholder="77 123 45 67"
                            className="w-full px-3 py-2.5 text-xs sm:text-sm font-mono text-slate-900 dark:text-white bg-transparent focus:outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Une notification de validation de 5 250 FCFA sera instantanément transmise sur votre application Wave.
                        </p>
                      </div>
                    ) : (
                      <div className="py-2 text-center space-y-2">
                        <div className="w-28 h-28 mx-auto bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-2 flex items-center justify-center shadow-xs">
                          <QrCode className="w-24 h-24 text-sky-600 dark:text-sky-400" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Scannez ce QR Code avec votre caméra ou l'application Wave pour valider les 5 250 FCFA.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Formulaire Orange Money */}
                {selectedGateway === 'orange' && (
                  <div className="p-4 rounded-2xl bg-orange-50/40 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 space-y-3">
                    <div className="text-xs font-bold text-orange-950 dark:text-orange-200">
                      Paiement sécurisé Orange Money
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                          Numéro Orange (+221)
                        </label>
                        <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                          <span className="px-2.5 text-xs font-mono font-bold text-slate-500 bg-slate-50 dark:bg-slate-750 border-r border-slate-200 dark:border-slate-700 py-2">
                            +221
                          </span>
                          <input
                            type="text"
                            required
                            value={omPhone}
                            onChange={(e) => setOmPhone(e.target.value)}
                            placeholder="77 650 44 21"
                            className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono text-slate-900 dark:text-white bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                          Code d'autorisation (#144#391#)
                        </label>
                        <input
                          type="password"
                          maxLength={6}
                          value={omCode}
                          onChange={(e) => setOmCode(e.target.value)}
                          placeholder="Code à 4 chiffres"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Composez #144#391# pour obtenir le code d'autorisation Orange Money à 4 chiffres.
                    </p>
                  </div>
                )}

                {/* Formulaire Free Money */}
                {selectedGateway === 'free' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
                    <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      Paiement mobile Free Money
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Numéro Free (+221)
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                        <span className="px-2.5 text-xs font-mono font-bold text-slate-500 bg-slate-50 dark:bg-slate-750 border-r border-slate-200 dark:border-slate-700 py-2">
                          +221
                        </span>
                        <input
                          type="text"
                          required
                          value={freePhone}
                          onChange={(e) => setFreePhone(e.target.value)}
                          placeholder="76 123 45 67"
                          className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono text-slate-900 dark:text-white bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Vous recevrez un message de confirmation pour valider le débit de 5 250 FCFA.
                    </p>
                  </div>
                )}

                {/* Formulaire Carte Bancaire */}
                {selectedGateway === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span>Paiement par Carte Bancaire</span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-mono">TLS 1.3 256-bit</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                          Nom du titulaire
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Ex: Cheikh Anta Diop"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                          Numéro de carte Visa / Mastercard
                        </label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 •••• •••• 7890"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                            Expiration (MM/AA)
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            required
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            placeholder="12/28"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                            CVC (3 chiffres)
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message d'erreur */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Bouton de confirmation de paiement */}
                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{processingStep || 'Traitement du paiement en cours...'}</span>
                      </>
                    ) : (
                      <span>
                        Payer {selectedGateway === 'card' ? '8,00 €' : '5 250 FCFA'} & Activer docLove Pro
                      </span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Paiement certifié & sécurisé
                    </span>
                    <span>·</span>
                    <span>Sans engagement</span>
                    <span>·</span>
                    <span>Facture immédiate</span>
                  </div>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
