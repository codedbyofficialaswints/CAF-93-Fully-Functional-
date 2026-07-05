import React, { useState } from 'react';
import { Instagram, Send, Sparkles, CheckCircle, MapPin, Clock, Phone } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface FooterProps {
  currentLang: Language;
  onNavigate: (tab: string) => void;
}

export default function Footer({ currentLang, onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer className="bg-dark-red text-cream border-t border-gold/10 relative overflow-hidden bg-lattice bg-grain">
      {/* Decorative lattice grids */}
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Top Segment: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-12 border-b border-gold/10 mb-12">
          
          {/* Brand Presentation */}
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left rtl:lg:text-right">
            <div 
              onClick={() => onNavigate('home')}
              className="inline-block cursor-pointer"
            >
              <span className="font-display text-3xl font-semibold text-white tracking-wider">
                CΛFÉ 93°
              </span>
              <span className="text-gold font-arabic-display text-xl font-bold ml-2 rtl:mr-2">كافيه ٩٣</span>
            </div>
            <p className="text-sm text-cream/75 max-w-sm mx-auto lg:mx-0 leading-relaxed font-posterama-regular">
              "{currentLang === 'en' ? "Sensory coffee rituals combined with a curated boutique workspace, designed to elevate focus, creativity, and calm." : "طقوس قهوة حسية ممزوجة بمساحة عمل راقية لتعزيز الإنتاجية والتركيز والاسترخاء."}"
            </p>
            {/* Social linkages */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href="https://instagram.com/cafe93.om" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-wine hover:bg-gold hover:text-[#1A1210] border border-gold/20 hover:border-gold rounded-full transition-luxury shadow"
                aria-label="Instagram Link"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/96893000000" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-wine hover:bg-gold hover:text-[#1A1210] border border-gold/20 hover:border-gold rounded-full transition-luxury shadow"
                aria-label="WhatsApp Link"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Luxury Newsletter / 93 Family */}
          <div className="lg:col-span-7 bg-[#1A1210]/60 border border-gold/15 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gold/5 blur-xl" />
            
            <div className="flex items-start gap-3.5 mb-6">
              <div className="p-2 bg-gold/15 text-gold rounded-lg mt-1">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-1">
                  {t('footerLoyaltyTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-cream/70 leading-relaxed">
                  {t('footerLoyaltySub')}
                </p>
              </div>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 text-gold font-bold text-sm bg-wine/30 border border-gold/20 p-4 rounded-lg animate-fade-in">
                <CheckCircle className="w-5 h-5" />
                <span>
                  {currentLang === 'en' 
                    ? "Welcome to the 93° Family! Check your inbox for Omani gold." 
                    : "أهلاً بك في عائلة ٩٣°! تفقد بريدك الإلكتروني للحصول على مفاجأتك."}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder={t('formEmailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-dark-red/80 border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none rounded-lg text-sm text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold hover:bg-gold/90 text-espresso font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-luxury cursor-pointer"
                >
                  <span>{t('btnSubscribe')}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Center Segment: Quick info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gold/10 text-sm">
          
          {/* Quick Contacts */}
          <div className="space-y-2">
            <span className="text-gold font-serif font-bold tracking-wider block uppercase text-xs">
              {currentLang === 'en' ? "HOTLINE CONTACTS" : "التواصل المباشر"}
            </span>
            <div className="space-y-1 text-cream/80">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold/60" />
                <span>+968 9393 9393 (Barka HQ)</span>
              </p>
              <p className="text-xs text-cream/50">
                {currentLang === 'en' ? "WhatsApp active 24/7 for catering" : "خدمة الرد السريع عبر الواتساب متوفرة دائماً"}
              </p>
            </div>
          </div>

          {/* Sourcing focus */}
          <div className="space-y-2">
            <span className="text-gold font-serif font-bold tracking-wider block uppercase text-xs">
              {currentLang === 'en' ? "THE BEAN STANDARD" : "معيار الجودة الحاسم"}
            </span>
            <p className="text-cream/80 leading-relaxed text-xs">
              {currentLang === 'en' 
                ? "All batches are sourced at micro-lot grade. High compensation paid directly to small farmers in Ethiopia & Colombia."
                : "نستورد جميع محاصيلنا من مزارع فردية حصرية وبكرم تعويض مالي مباشر يحفز المزارعين في إثيوبيا وكولومبيا."}
            </p>
          </div>

          {/* Quick links directory */}
          <div className="space-y-2">
            <span className="text-gold font-serif font-bold tracking-wider block uppercase text-xs">
              {currentLang === 'en' ? "EXPLORE THE RITUAL" : "خريطة الملاذ"}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => onNavigate('menu')} className="text-left rtl:text-right hover:text-gold transition-colors text-cream/70 cursor-pointer">
                {t('navMenu')}
              </button>
              <button onClick={() => onNavigate('about')} className="text-left rtl:text-right hover:text-gold transition-colors text-cream/70 cursor-pointer">
                {t('navStory')}
              </button>
              <button onClick={() => onNavigate('space')} className="text-left rtl:text-right hover:text-gold transition-colors text-cream/70 cursor-pointer">
                {t('navSpace')}
              </button>
              <button onClick={() => onNavigate('reservations')} className="text-left rtl:text-right hover:text-gold transition-colors text-cream/70 cursor-pointer">
                {t('navReservations')}
              </button>
              <button onClick={() => onNavigate('gifting')} className="text-left rtl:text-right hover:text-gold transition-colors text-cream/70 cursor-pointer">
                {t('navGifting')}
              </button>
              <button onClick={() => onNavigate('contact')} className="text-left rtl:text-right hover:text-gold transition-colors text-cream/70 cursor-pointer">
                {t('navContact')}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Segment: Copyright & local details */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-cream/50 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold/60" />
            <span>{t('addressDetail')}</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} {t('rights')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
