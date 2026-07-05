import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, Check, Loader, AlertCircle } from 'lucide-react';
import { Language, MenuItem } from '../types';
import { TRANSLATIONS, MENU_ITEMS } from '../data';
import { supabase } from '../lib/supabase';


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
  const [signatures, setSignatures] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  useEffect(() => {
    async function fetchTeaserProducts() {
      try {
        setLoading(true);
        setError(null);

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        const isPlaceholder = !supabaseUrl || supabaseUrl.includes('your_supabase_project_url_here');

        if (isPlaceholder) {
          console.warn('Supabase not configured. Falling back to local MENU_ITEMS signatures.');
          const fallback = MENU_ITEMS.filter(item => ["m-1", "m-5", "m-8"].includes(item.id));
          setSignatures(fallback);
          return;
        }

        const { data, error: fetchErr } = await supabase
          .from('products')
          .select('*')
          .in('id', ['m-1', 'm-5', 'm-8'])
          .eq('in_stock', true);

        if (fetchErr) {
          throw fetchErr;
        }

        if (data && data.length > 0) {
          const mapped: MenuItem[] = data.map((item: any) => ({
            id: item.id,
            name: {
              en: item.name_en || '',
              ar: item.name_ar || ''
            },
            description: {
              en: item.description_en || '',
              ar: item.description_ar || ''
            },
            poeticDesc: {
              en: item.description_en || '',
              ar: item.description_ar || ''
            },
            price: Number(item.price),
            category: item.category,
            image: item.image_url || '',
            dietary: item.id === 'm-1' ? ['gluten-free'] : (item.id === 'm-6' ? ['vegan', 'gluten-free'] : [])
          }));
          setSignatures(mapped);
        } else {
          console.warn('No signatures found in database. Falling back to local signatures.');
          const fallback = MENU_ITEMS.filter(item => ["m-1", "m-5", "m-8"].includes(item.id));
          setSignatures(fallback);
        }
      } catch (err: any) {
        console.error('Error fetching teaser products, falling back to local signatures:', err);
        const fallback = MENU_ITEMS.filter(item => ["m-1", "m-5", "m-8"].includes(item.id));
        setSignatures(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchTeaserProducts();
  }, [currentLang]);

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

        {/* Loading/Error/Grid */}
        {loading ? (
          <div className="py-12 bg-wine/10 border border-gold/10 rounded-2xl flex flex-col items-center justify-center space-y-3">
            <Loader className="w-8 h-8 text-gold animate-spin" />
            <p className="text-cream/60 font-mono text-xs">
              {currentLang === 'en' ? "Brewing ritual signatures..." : "جاري تحضير رشفات مميزة..."}
            </p>
          </div>
        ) : error ? (
          <div className="py-12 bg-wine/20 border border-red-500/15 rounded-2xl flex flex-col items-center justify-center space-y-2 px-4 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
            <p className="text-white font-serif font-bold text-sm">{error}</p>
            <p className="text-cream/50 text-[10px] font-mono">
              {currentLang === 'en' ? "Please check .env.local connection." : "يرجى التحقق من إعدادات الاتصال بالخادم."}
            </p>
          </div>
        ) : signatures.length === 0 ? (
          <div className="py-12 bg-wine/10 border border-gold/10 rounded-2xl text-center">
            <p className="text-cream/50 font-mono text-xs">
              {currentLang === 'en' ? "No featured products active at this hour." : "لا توجد منتجات مميزة نشطة حالياً."}
            </p>
          </div>
        ) : (
          /* 3D-Tilt Ceramic Product Cards Grid */
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
        )}

      </div>
    </section>
  );
}
