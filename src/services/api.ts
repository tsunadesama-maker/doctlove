import { DocumentInspection, Language, TranslationResponse, SubscriptionState } from '../types';

export const api = {
  async getLanguages(): Promise<Language[]> {
    try {
      const res = await fetch('/api/languages');
      if (!res.ok) throw new Error('Impossible de charger les langues');
      const data = await res.json();
      return data.languages || [];
    } catch {
      return [
        { code: 'fr', name: 'Français' },
        { code: 'en', name: 'Anglais' },
        { code: 'es', name: 'Espagnol' },
        { code: 'de', name: 'Allemand' },
        { code: 'it', name: 'Italien' },
        { code: 'pt', name: 'Portugais' },
        { code: 'ar', name: 'Arabe', rtl: true },
        { code: 'zh', name: 'Chinois (simplifié)' },
        { code: 'wo', name: 'Wolof' },
        { code: 'sw', name: 'Swahili' },
        { code: 'ru', name: 'Russe' },
        { code: 'ja', name: 'Japonais' },
      ];
    }
  },

  async getPricing(): Promise<any> {
    try {
      const res = await fetch('/api/pricing');
      if (!res.ok) throw new Error('Impossible de charger les tarifs');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getSubscription(): Promise<SubscriptionState> {
    try {
      const res = await fetch('/api/subscription');
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      return {
        isSubscribed: data.is_subscribed || false,
        planName: data.plan_name || 'docLove Pro',
        priceEur: data.price_eur || 8.0,
        priceXof: data.price_xof || 5250,
        pagesUsed: data.pages_used || 0,
        maxPages: data.max_pages || 2000,
        renewalDate: data.renewal_date || 'Dans 30 jours',
      };
    } catch {
      // Stockage local si hors réseau
      const local = localStorage.getItem('doclove_subscription');
      if (local) {
        try { return JSON.parse(local); } catch {}
      }
      return {
        isSubscribed: false,
        planName: 'docLove Pro',
        priceEur: 8.0,
        priceXof: 5250,
        pagesUsed: 0,
        maxPages: 2000,
        renewalDate: 'Dans 30 jours',
      };
    }
  },

  async subscribe(gateway: string = 'card'): Promise<SubscriptionState> {
    try {
      const res = await fetch('/api/subscription/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway }),
      });
      const data = await res.json();
      const state: SubscriptionState = {
        isSubscribed: true,
        planName: data.subscription?.plan_name || 'docLove Pro',
        priceEur: 8.0,
        priceXof: 5250,
        pagesUsed: data.subscription?.pages_used || 0,
        maxPages: 2000,
        renewalDate: data.subscription?.renewal_date || 'Dans 30 jours',
        gateway,
      };
      localStorage.setItem('doclove_subscription', JSON.stringify(state));
      return state;
    } catch {
      const state: SubscriptionState = {
        isSubscribed: true,
        planName: 'docLove Pro',
        priceEur: 8.0,
        priceXof: 5250,
        pagesUsed: 0,
        maxPages: 2000,
        renewalDate: 'Dans 30 jours',
        gateway,
      };
      localStorage.setItem('doclove_subscription', JSON.stringify(state));
      return state;
    }
  },

  async cancelSubscription(): Promise<void> {
    try {
      await fetch('/api/subscription/cancel', { method: 'POST' });
    } catch {}
    localStorage.removeItem('doclove_subscription');
  },

  async uploadDocument(file: File, isSubscribed: boolean = false): Promise<DocumentInspection> {
    const formData = new FormData();
    formData.append('document', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'x-user-subscribed': isSubscribed ? 'true' : 'false',
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors du téléversement du document');
    }
    return data;
  },

  async translateDocument(params: {
    file_id: string;
    source_lang: string;
    target_lang: string;
    is_premium?: boolean;
    is_subscribed?: boolean;
  }): Promise<TranslationResponse> {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subscribed': (params.is_subscribed || params.is_premium) ? 'true' : 'false',
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la traduction du document');
    }
    return data;
  },

  async uploadMulti(files: File[]): Promise<{ file_id: string; original_filename: string; file_size_bytes: number; format: string }[]> {
    const formData = new FormData();
    files.forEach((f) => formData.append('documents', f));

    const res = await fetch('/api/tools/upload-multi', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors du téléversement multiple');
    }
    return data.files || [];
  },

  async executeTool(params: {
    tool: string;
    file_ids?: string[];
    file_id?: string;
    angle?: number;
    pages?: string;
    ranges?: string;
    text?: string;
    signature?: string;
    level?: string;
  }): Promise<{
    success: boolean;
    tool: string;
    output_filename: string;
    download_url: string;
    metrics?: any;
    error?: string;
  }> {
    const res = await fetch('/api/tools/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors du traitement du document');
    }
    return data;
  },
};
