import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Check, Plus, Coffee, Sparkles, Filter } from 'lucide-react';
import { Language, MenuItem } from '../types';
import { TRANSLATIONS, MENU_ITEMS } from '../data';

interface MenuPageProps {
  currentLang: Language;
  onAddToOrder: (item: MenuItem) => void;
  addedItemIds: string[];
}

export default function MenuPage({
  currentLang,
  onAddToOrder,
  addedItemIds
}: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'hot' | 'cold' | 'desserts' | 'gifting'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Available categories
  const categories = [
    { id: 'all', label: currentLang === 'en' ? 'All Rituals' : 'كل القائمة' },
    { id: 'hot', label: currentLang === 'en' ? 'Hot Coffee' : 'مشروبات دافئة' },
    { id: 'cold', label: currentLang === 'en' ? 'Cold Drinks' : 'مشروبات باردة' },
    { id: 'desserts', label: currentLang === 'en' ? 'Desserts 93°' : 'حلويات ٩٣°' },
    { id: 'gifting', label: currentLang === 'en' ? 'Gifting' : 'الإهداء الفاخر' }
  ];

  // Filter items
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    const matchesSearch = 
      item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.ar.includes(searchQuery) ||
      item.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.ar.includes(searchQuery);

    const matchesDietary = !dietaryFilter || item.dietary?.includes(dietaryFilter);

    return matchesCategory && matchesSearch && matchesDietary;
  });

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] bg-grain min-h-screen relative overflow-hidden">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "OUR HANDCRAFTED ELIXIRS" : "قائمة رشفات السعادة"}
          </span>
          <h1 className={`text-4xl sm:text-6xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {currentLang === 'en' ? "The Menu Ritual" : "طقوس قائمة كافيه ٩٣"}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base">
            {currentLang === 'en' 
              ? "Every hot drip, cold infusion, and luxury cake is meticulously balanced at exactly 93° standard parameters to secure your absolute focus."
              : "كل قطرة إسبريسو حارة، واستخلاص بارد، وحلوى فاخرة صُممت بمعايير علمية دقيقة تضمن صفاء ذهنك وشحذ حواسك."}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        {/* Filter and Search sticky-feel Control Row */}
        <div className="bg-wine/40 border border-gold/15 p-4 sm:p-6 rounded-2xl glass-card mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium tracking-wide rounded-lg whitespace-nowrap transition-luxury cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gold text-espresso font-bold shadow-md'
                    : 'text-cream/80 hover:text-white hover:bg-wine/50 border border-gold/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input & Dietary filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
              <input
                type="text"
                placeholder={currentLang === 'en' ? "Search elixirs..." : "ابحث عن مشروب أو حلوى..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
              />
            </div>

            {/* Dietary filter pill */}
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setDietaryFilter(dietaryFilter ? null : 'gluten-free')}
                className={`px-3 py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg border transition-luxury cursor-pointer flex items-center gap-1.5 ${
                  dietaryFilter === 'gluten-free'
                    ? 'bg-gold border-gold text-espresso'
                    : 'border-gold/15 text-gold hover:bg-wine/30'
                }`}
              >
                <Filter className="w-3 h-3" />
                <span>{currentLang === 'en' ? "Gluten Free" : "خالٍ من الجلوتين"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Menu Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-wine/10 border border-gold/10 rounded-2xl"
            >
              <Coffee className="w-12 h-12 text-gold/40 mx-auto mb-4 animate-bounce" />
              <p className="text-cream/60 font-mono text-sm">
                {currentLang === 'en' ? "No matching elixirs found in the list." : "لم نجد مشروبات أو حلويات مطابقة في القائمة."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item, idx) => {
                const isAdded = addedItemIds.includes(item.id);
                const cardShape = idx % 2 === 0 ? 'ceramic-card' : 'ceramic-card-alt';

                return (
                  <motion.div
                    layout
                    key={item.id}
                    className="group relative bg-wine/30 border border-gold/10 hover:border-gold/30 rounded-2xl p-6 glass-card shadow-lg hover:shadow-2xl flex flex-col justify-between transition-luxury overflow-hidden"
                  >
                    <div>
                      {/* Product image container styled ceramic */}
                      <div className="w-full aspect-square overflow-hidden mb-6 relative group shadow-inner">
                        <div className={`w-full h-full ${cardShape} overflow-hidden transition-transform duration-700 group-hover:scale-105`}>
                          <img
                            src={item.image}
                            alt={item.name[currentLang]}
                            className="w-full h-full object-cover saturate-[1.1] contrast-[1.05]"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-dark-red/15 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                        
                        {/* Dietary tag overlay */}
                        {item.dietary && item.dietary.length > 0 && (
                          <div className="absolute bottom-4 left-4 flex gap-1 z-10">
                            {item.dietary.map(diet => (
                              <span key={diet} className="bg-espresso/90 border border-gold/40 text-gold text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {diet}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Title & Price Row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-serif font-black text-white group-hover:text-gold transition-luxury">
                          {item.name[currentLang]}
                        </h3>
                        <span className="text-sm font-mono font-bold text-gold shrink-0">
                          {item.price.toFixed(3)} OMR
                        </span>
                      </div>

                      {/* poetics */}
                      <p className="text-cream/90 text-xs mb-4 font-posterama-regular">
                        "{item.poeticDesc?.[currentLang] || item.description[currentLang]}"
                      </p>

                      {/* Literal details */}
                      <p className="text-cream/60 text-xs leading-relaxed mb-6">
                        {item.description[currentLang]}
                      </p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-4">
                      <span className="text-[9px] uppercase font-mono text-gold/60 tracking-wider">
                        {item.category === 'hot' 
                          ? (currentLang === 'en' ? "HOT CERAMIC RITUAL" : "طقس دافئ سيراميكي") 
                          : item.category === 'cold' 
                          ? (currentLang === 'en' ? "ICED FOCUS CRYSTAL" : "استخلاص مصفى بارد") 
                          : (currentLang === 'en' ? "ARTISANAL DESIGNS" : "فن وتشكيل")}
                      </span>

                      <button
                        onClick={() => onAddToOrder(item)}
                        className={`flex items-center justify-center p-2 rounded-full cursor-pointer transition-luxury ${
                          isAdded 
                            ? 'bg-gold text-espresso border border-gold scale-110 shadow-glow' 
                            : 'bg-wine/60 border border-gold/20 hover:border-gold text-gold hover:text-espresso hover:bg-gold'
                        }`}
                        title={isAdded ? "Added to order" : "Add to order"}
                      >
                        {isAdded ? (
                          <Check className="w-4.5 h-4.5 animate-scale-up" />
                        ) : (
                          <Plus className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
