import React from 'react';
import { Menu, X, ShoppingBag, Globe } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({
  currentLang,
  setLang,
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const navItems = [
    { id: 'home', label: t('navHome') },
    { id: 'menu', label: t('navMenu') },
    { id: 'about', label: t('navStory') },
    { id: 'space', label: t('navSpace') },
    { id: 'reservations', label: t('navReservations') },
    { id: 'gifting', label: t('navGifting') },
    { id: 'contact', label: t('navContact') }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo / Wordmark */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex flex-col items-start cursor-pointer group"
          >
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold tracking-wider text-white group-hover:text-gold transition-luxury">
                CΛFÉ 93°
              </span>
              <span className="text-gold font-arabic-display text-sm font-bold tracking-widest opacity-90">
                كافيه ٩٣°
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-cream/70 group-hover:text-gold/90 transition-luxury">
              {t('tagline')}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-sm font-medium tracking-wide transition-luxury rounded-md hover:text-gold relative ${
                  activeTab === item.id 
                    ? 'text-gold font-semibold' 
                    : 'text-ivory/80'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Nav Actions (Lang, Cart, CTA) */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ivory/95 border border-gold/20 hover:border-gold/80 hover:bg-wine/40 rounded-full transition-luxury cursor-pointer"
              title={currentLang === 'en' ? 'تحويل للعربية' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-ivory hover:text-gold bg-wine/30 hover:bg-wine/70 border border-gold/10 hover:border-gold/40 rounded-full transition-luxury cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta border border-gold/40 text-[10px] font-bold text-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now Call to Action */}
            <button
              onClick={() => handleNavClick('menu')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#1A1210] bg-gold hover:bg-gold/90 active:scale-95 border border-gold rounded-md transition-luxury shadow-lg cursor-pointer"
            >
              {t('btnOrderNow')}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ivory hover:text-gold rounded-md cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Slide Down */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-t border-gold/10 px-4 pt-4 pb-6 space-y-2 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-luxury ${
                activeTab === item.id
                  ? 'bg-wine/60 text-gold font-semibold border-l-2 border-gold'
                  : 'text-ivory/90 hover:bg-wine/30 hover:text-gold'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full text-center px-4 py-3 text-sm font-bold uppercase tracking-widest text-[#1A1210] bg-gold hover:bg-gold/90 rounded-md transition-luxury mt-4 cursor-pointer"
          >
            {t('btnOrderNow')}
          </button>
        </div>
      )}
    </nav>
  );
}
