import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ToolsGrid } from './components/ToolsGrid';
import { ServiceWorkspace } from './components/ServiceWorkspace';
import { TranslationHistory } from './components/TranslationHistory';
import { WorkflowSection } from './components/WorkflowSection';
import { PricingSection } from './components/PricingSection';
import { SecuritySection } from './components/SecuritySection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { PaymentModal } from './components/PaymentModal';
import { I18nProvider, useI18n } from './context/I18nContext';
import { ThemeProvider } from './context/ThemeContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { api } from './services/api';
import { Language, TranslationHistoryItem } from './types';
import { TOOLS, ToolDefinition } from './data/tools';

const STORAGE_KEY_HISTORY = 'doclove_translation_history';

function AppContent() {
  const { t } = useI18n();
  const { isPaymentModalOpen, closePaymentModal, paymentModalGateway, paymentModalReason } = useSubscription();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);

  // Historique des 5 dernières opérations/traductions
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY) || localStorage.getItem('docutrad_translation_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 5);
      }
    } catch {}
    return [];
  });

  // Charger les langues au démarrage
  useEffect(() => {
    api.getLanguages().then(setLanguages).catch(() => {});
  }, []);

  // Synchronisation avec l'ancre d'URL (Hash Routing pour chaque service)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?(tool\/)?/, '');
      if (hash) {
        const match = TOOLS.find((t) => t.id === hash);
        if (match) {
          setSelectedToolId(match.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setSelectedToolId(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    window.location.hash = `/tool/${toolId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedToolId(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordHistory = (item: TranslationHistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
  };

  const currentTool: ToolDefinition | undefined = TOOLS.find((t) => t.id === selectedToolId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-red-500 selection:text-white transition-colors duration-200">
      
      {/* En-tête docLove Style avec dropdowns et sélecteur de langue */}
      <Header
        onSelectTool={handleSelectTool}
        onGoHome={handleGoHome}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(!isHistoryDrawerOpen)}
        historyCount={history.length}
      />

      {/* Contenu principal : soit la page dédiée d'un outil, soit la grille d'accueil */}
      <main className="flex-1">
        {currentTool ? (
          /* PAGE DÉDIÉE DU SERVICE SÉLECTIONNÉ */
          <ServiceWorkspace
            tool={currentTool}
            languages={languages}
            onBack={handleGoHome}
            onRecordHistory={handleRecordHistory}
          />
        ) : (
          /* PAGE D'ACCUEIL : TOUS LES OUTILS PDF (Style docLove) */
          <>
            {/* Hero Section sans photos */}
            <HeroSection onSelectTool={handleSelectTool} />

            {/* Grille de tous les services avec recherche et filtres de catégories */}
            <ToolsGrid onSelectTool={handleSelectTool} />

            {/* Section Comment ça fonctionne */}
            <WorkflowSection />

            {/* Section Tarifs et passerelles Sénégal */}
            <PricingSection />

            {/* Section Sécurité & Confidentialité */}
            <SecuritySection />

            {/* Section FAQ */}
            <FaqSection />
          </>
        )}

        {/* Section Historique récent des documents traités */}
        <div id="historique-section" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <TranslationHistory
            history={history}
            onClearHistory={handleClearHistory}
          />
        </div>
      </main>

      {/* Pied de page professionnel */}
      <Footer />

      {/* Panneau des Paramètres & Sélecteur de Langue d'interface */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        availableDocumentLanguages={languages}
      />

      {/* Modal de Paiement & Abonnement docLove Pro (Wave, Orange Money, Free, CB) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        initialGateway={paymentModalGateway}
        reason={paymentModalReason}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SubscriptionProvider>
        <I18nProvider>
          <AppContent />
        </I18nProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}
