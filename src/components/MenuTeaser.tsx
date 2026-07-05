import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { Language, MenuItem } from '../types';
import { TRANSLATIONS, MENU_ITEMS } from '../data';

interface MenuTeaserProps {
  currentLang: Language;
  onNavigate: (tab: string) => void;
  onAddToOrder: (item: MenuItem) => void;
  addedItemIds: string[];
}

export default function MenuTeaser({
  currentLang,
  onNavigate,
  onAddToOrder,
  addedItemIds
}: MenuTeaserProps) {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Curate 3 flagships for the teaser grid: Saffron Latte, Cold Brew, Lavender Cake
  const signatures = MENU_ITEMS.filter(item => 
    item.id === "m-1" || item.id === "m-5" || item.id === "m-8"
  );

  return (
    <section className="py-24 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] relative overflow-hidden bg-grain border-t border-gold/10">
      <div className="bg-pattern" />
      {/* Absolute gold decorative rings */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full border border-gold/5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-gold/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-4">
          <div className="text-center md:text-left rtl:md:text-right max-w-xl">
            <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
              {currentLang === 'en' ? "HANDCRAFTED DELICACIES" : "مختارات فاخرة للحواس"}
            </span>
            <h2 className={`text-3xl sm:text-5xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
              {t('titleMenuTeaser')}
            </h2>
            <p className="text-cream/80 text-sm sm:text-base">
              {t('subtitleMenuTeaser')}
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="px-6 py-3.5 bg-transparent border border-gold/40 hover:border-gold text-gold hover:bg-gold/10 font-bold uppercase tracking-widest text-xs rounded-lg transition-luxury cursor-pointer shrink-0"
          >
            {t('btnViewFullMenu')}
          </button>
        </div>

        {/* 3D-Tilt Ceramic Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signatures.map((item, idx) => {
            const isAdded = addedItemIds.includes(item.id);
            
            // Alternating ceramic irregular border shapes for artistic unglazed look
            const cardShape = idx % 2 === 0 ? 'ceramic-card' : 'ceramic-card-alt';

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between bg-wine/30 border border-gold/10 hover:border-gold/30 rounded-2xl p-6 glass-card shadow-xl hover:shadow-2xl transition-luxury overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Micro badge indicator */}
                {idx === 0 && (
                  <span className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 flex items-center gap-1 bg-gold text-espresso text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                    <Sparkles className="w-2.5 h-2.5 animate-spin-slow" />
                    <span>{currentLang === 'en' ? "BESTSELLER" : "الأكثر طلباً"}</span>
                  </span>
                )}

                <div>
                  {/* Styled Ceramic product photography */}
                  <div className="w-full aspect-square overflow-hidden mb-6 relative group shadow-inner">
                    <div className={`w-full h-full ${cardShape} overflow-hidden transition-transform duration-700 group-hover:scale-105`}>
                      <img
                        src={item.image}
                        alt={item.name[currentLang]}
                        className="w-full h-full object-cover saturate-[1.1] contrast-[1.05]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-dark-red/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Pricing and Category Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-gold">
                      {item.category === 'hot' ? (currentLang === 'en' ? "Hot Brew" : "كوب دافئ") : (currentLang === 'en' ? "Dessert Craft" : "حلوى فاخرة")}
                    </span>
                    <span className="text-sm font-serif font-bold text-gold">
                      {item.price.toFixed(3)} OMR
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold transition-luxury mb-2">
                    {item.name[currentLang]}
                  </h3>

                  {/* Poetic bilingual voice descriptor */}
                  <p className="text-cream/90 text-xs leading-relaxed mb-6 font-posterama-regular">
                    "{item.poeticDesc?.[currentLang] || item.description[currentLang]}"
                  </p>
                </div>

                {/* Card Interaction Row */}
                <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-4">
                  <span className="text-[10px] text-cream/50 font-mono">
                    {currentLang === 'en' ? "Stoneware Ceramic Cup Served" : "يقدم في أكواب سيراميك يدوية"}
                  </span>

                  <button
                    onClick={() => onAddToOrder(item)}
                    className={`flex items-center justify-center p-2 rounded-full cursor-pointer transition-luxury ${
                      isAdded 
                        ? 'bg-gold text-espresso border border-gold scale-110 shadow-glow' 
                        : 'bg-wine/60 border border-gold/20 hover:border-gold text-gold hover:text-espresso hover:bg-gold'
                    }`}
                    title={isAdded ? "Added to your cup" : "Add to order"}
                  >
                    {isAdded ? (
                      <Check className="w-4 h-4 animate-scale-up" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
