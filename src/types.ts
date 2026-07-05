export type Language = 'en' | 'ar';

export interface MenuItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  poeticDesc?: {
    en: string;
    ar: string;
  };
  price: number; // in OMR (e.g. 2.500)
  category: 'hot' | 'cold' | 'desserts' | 'gifting';
  image: string;
  dietary?: string[]; // e.g. ['vegan', 'nut-free']
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CorporateInquiry {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  eventType: string;
  guestsCount: number;
  eventDate: string;
  notes: string;
}

export interface ReservationConfig {
  date: string; // ISO date, e.g. "2026-07-10"
  time: string; // e.g. "18:30"
  partySize: number;
  seating: 'lounge' | 'workspace' | 'outdoor';
  occasion: 'none' | 'birthday' | 'meeting' | 'anniversary';
  name: string;
  phone: string;
  notes?: string;
}

export interface GiftCardConfig {
  amount: number;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  design: 'classic' | 'heritage' | 'golden';
}

export interface TranslationSet {
  [key: string]: {
    en: string;
    ar: string;
  };
}
