export interface Language {
  code: string;
  name: string;
  native?: string;
  rtl?: boolean;
}

export interface DocumentQuote {
  page_count: number;
  tier: 'free' | 'subscription' | 'subscription_active' | 'premium';
  tier_name: string;
  price_eur: number;
  price_xof: number;
  is_payable: boolean;
  max_pages_allowed: number;
  subscription_monthly_pages?: number;
  message: string;
}

export interface DocumentInspection {
  file_id: string;
  original_filename: string;
  file_size_bytes: number;
  format: 'pdf' | 'docx' | string;
  page_count: number;
  detected_lang: string;
  is_scanned: boolean;
  requires_ocr: boolean;
  ocr_notice?: string | null;
  quote: DocumentQuote;
}

export interface TranslationResponse {
  success: boolean;
  translated_file_id: string;
  output_filename: string;
  page_count: number;
  translated_units: number;
  total_words_translated: number;
  source_lang: string;
  target_lang: string;
  download_url: string;
  error?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  max_pages: number;
  price_eur: number;
  price_xof: number;
  period?: string;
  features: string[];
  highlight: boolean;
  badge?: string;
}

export interface SubscriptionState {
  isSubscribed: boolean;
  planName: string;
  priceEur: number;
  priceXof: number;
  pagesUsed: number;
  maxPages: number;
  renewalDate: string;
  gateway?: string;
}

export interface TranslationHistoryItem {
  id: string;
  originalFilename: string;
  outputFilename: string;
  sourceLang: string;
  targetLang: string;
  pageCount: number;
  wordCount: number;
  downloadUrl: string;
  timestamp: number;
  format: string;
}
