import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { SubscriptionState } from '../types';

export interface Invoice {
  id: string;
  date: string;
  planName: string;
  amountEur: number;
  amountXof: number;
  gateway: string;
  status: 'Payée' | 'Actif';
  phoneNumber?: string;
  cardNumber?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionState;
  isPaymentModalOpen: boolean;
  paymentModalGateway: string;
  paymentModalReason: string | null;
  openPaymentModal: (gateway?: string, reason?: string) => void;
  closePaymentModal: () => void;
  subscribe: (gateway: string, details: { phoneNumber?: string; cardNumber?: string; cardName?: string }) => Promise<boolean>;
  cancelSubscription: () => Promise<void>;
  recordPagesUsed: (count: number) => void;
  invoices: Invoice[];
  downloadInvoice: (invoice: Invoice) => void;
}

const STORAGE_KEY_SUB = 'doclove_subscription';
const STORAGE_KEY_INVOICES = 'doclove_invoices';

const defaultSubscription: SubscriptionState = {
  isSubscribed: false,
  planName: 'Offre Gratuite docLove',
  priceEur: 8.0,
  priceXof: 5250,
  pagesUsed: 0,
  maxPages: 25,
  renewalDate: 'Sans engagement',
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return defaultSubscription;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalGateway, setPaymentModalGateway] = useState('wave');
  const [paymentModalReason, setPaymentModalReason] = useState<string | null>(null);

  // Synchronisation avec l'API au démarrage
  useEffect(() => {
    api.getSubscription()
      .then((data) => {
        if (data.isSubscribed) {
          setSubscription(data);
          try {
            localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const openPaymentModal = (gateway: string = 'wave', reason: string | null = null) => {
    setPaymentModalGateway(gateway);
    setPaymentModalReason(reason);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentModalReason(null);
  };

  const subscribe = async (
    gateway: string,
    details: { phoneNumber?: string; cardNumber?: string; cardName?: string }
  ): Promise<boolean> => {
    try {
      const renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const updatedSub: SubscriptionState = {
        isSubscribed: true,
        planName: 'docLove Pro Mensuel',
        priceEur: 8.0,
        priceXof: 5250,
        pagesUsed: subscription.pagesUsed,
        maxPages: 2000,
        renewalDate: `Renouvellement le ${renewalDate}`,
        gateway,
      };

      // Appel backend
      await api.subscribe(gateway);

      // Création facture officielle
      const newInvoice: Invoice = {
        id: `DL-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        planName: 'docLove Pro Mensuel (2 000 pages)',
        amountEur: 8.0,
        amountXof: 5250,
        gateway: gateway === 'wave' ? 'Wave Sénégal' : gateway === 'orange' ? 'Orange Money' : gateway === 'free' ? 'Free Money' : 'Carte Bancaire (Visa/Mastercard)',
        status: 'Payée',
        phoneNumber: details.phoneNumber,
        cardNumber: details.cardNumber ? `**** **** **** ${details.cardNumber.slice(-4)}` : undefined,
      };

      const updatedInvoices = [newInvoice, ...invoices];
      setInvoices(updatedInvoices);
      setSubscription(updatedSub);

      try {
        localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(updatedSub));
        localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(updatedInvoices));
      } catch {}

      setIsPaymentModalOpen(false);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const cancelSubscription = async () => {
    try {
      await api.cancelSubscription();
    } catch {}

    const revertedSub: SubscriptionState = {
      isSubscribed: false,
      planName: 'Offre Gratuite docLove',
      priceEur: 8.0,
      priceXof: 5250,
      pagesUsed: 0,
      maxPages: 25,
      renewalDate: 'Sans engagement',
    };

    setSubscription(revertedSub);
    try {
      localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(revertedSub));
    } catch {}
  };

  const recordPagesUsed = (count: number) => {
    setSubscription((prev) => {
      const updated = {
        ...prev,
        pagesUsed: prev.pagesUsed + count,
      };
      try {
        localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const downloadInvoice = (inv: Invoice) => {
    // Génère un reçu HTML stylisé imprimable/téléchargeable
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture docLove - ${inv.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 700px; margin: auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
          .brand { font-size: 26px; font-weight: 900; color: #0f172a; }
          .brand span { color: #dc2626; }
          .badge { background: #dcfce7; color: #15803d; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; }
          .details { margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px; line-height: 1.6; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
          .table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 1px solid #cbd5e1; }
          .table td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; }
          .total-box { margin-top: 30px; text-align: right; }
          .total-price { font-size: 24px; font-weight: 800; color: #dc2626; }
          .footer { margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">doc<span>Love</span></div>
          <div class="badge">REÇU DE PAIEMENT VALIDE</div>
        </div>
        <div class="details">
          <div>
            <strong>Émetteur :</strong><br>
            docLove Cloud Services Inc.<br>
            Plateforme Documentaire & Traduction<br>
            contact@doclove.app
          </div>
          <div>
            <strong>Facture N° :</strong> ${inv.id}<br>
            <strong>Date :</strong> ${inv.date}<br>
            <strong>Mode de règlement :</strong> ${inv.gateway}<br>
            ${inv.phoneNumber ? `<strong>Téléphone :</strong> ${inv.phoneNumber}<br>` : ''}
            ${inv.cardNumber ? `<strong>Carte :</strong> ${inv.cardNumber}<br>` : ''}
            <strong>Statut :</strong> Payée intégralement
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Désignation du service</th>
              <th>Période</th>
              <th>Pages allouées</th>
              <th style="text-align: right;">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${inv.planName}</strong><br><small style="color: #64748b;">Traduction dans toutes les langues & Préservation mise en page</small></td>
              <td>1 mois</td>
              <td>2 000 pages</td>
              <td style="text-align: right;"><strong>8,00 €</strong><br><small style="color: #64748b;">(5 250 FCFA)</small></td>
            </tr>
          </tbody>
        </table>
        <div class="total-box">
          <div style="font-size: 12px; color: #64748b;">Total réglé TTC :</div>
          <div class="total-price">8,00 € <span style="font-size: 15px; color: #475569;">/ 5 250 FCFA</span></div>
          <div style="font-size: 11px; color: #10b981; margin-top: 4px;">✓ Transaction confirmée et garantie par ${inv.gateway}</div>
        </div>
        <div class="footer">
          Merci pour votre confiance envers docLove. Document conservé pour comptabilité. Résiliation possible à tout instant.
        </div>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture-docLove-${inv.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isPaymentModalOpen,
        paymentModalGateway,
        paymentModalReason,
        openPaymentModal,
        closePaymentModal,
        subscribe,
        cancelSubscription,
        recordPagesUsed,
        invoices,
        downloadInvoice,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
