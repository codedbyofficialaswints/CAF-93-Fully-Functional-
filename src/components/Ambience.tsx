import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Sparkles, Brain, Lightbulb, Users, Leaf, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, SCIENCE_CARDS } from '../data';

interface AmbienceProps {
  currentLang: Language;
}

export default function Ambience({ currentLang }: AmbienceProps) {
  const [selectedSpot, setSelectedSpot] = useState<string>('spot-1');

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Highlights hotspots inside the interior space layout
  const hotspots = [
    {
      id: 'spot-1',
      title: { en: "Warm Lighting (2700K)", ar: "الإضاءة الدافئة (٢٧٠٠ك)" },
      description: {
        en: "Meticulously placed pendant lighting styled to release tension, lower stress hormones (cortisol), and mimic late afternoon golden sunshine.",
        ar: "مصابيح متدلية منتقاة بعناية لتبديد التوتر، وتقليل هرمونات القلق المفرطة، ومحاكاة دفء شمس العصاري الذهبية ببركاء."
      },
      icon: Lightbulb,
      science: {
        en: "Triggers early stages of natural GABA release, calming brainwaves for deeper conversations.",
        ar: "يساعد في تحفيز الاستجابة المريحة للدماغ، مهدئاً النشاط الكهربائي لتعزيز الهدوء الحسي."
      },
      x: '70%',
      y: '30%',
      image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'spot-2',
      title: { en: "Cane-back Walnut Armchairs", ar: "كراسي الخيزران والجوز" },
      description: {
        en: "Mid-century modern chairs built with natural tactile cane web. The wood adds tactile grounding, connecting you to Omani warmth.",
        ar: "كراسي بتصميم معاصر من منتصف القرن مصنوعة من قش الخيزران الطبيعي وخشب الجوز الصلب للتواصل مع الطبيعة الحية."
      },
      icon: Users,
      science: {
        en: "Ergonomically designed seat curves increase blood circulation, allowing you to focus productively for hours.",
        ar: "تساعد زوايا الجلوس المدروسة في تحسين التدفق الدموي للظهر والرقبة، مما يبقي إنتاجيتك نشطة لساعات طويلة."
      },
      x: '35%',
      y: '65%',
      image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'spot-3',
      title: { en: "Biophilic Nature Connection", ar: "الاندماج الطبيعي (الشجرة)" },
      description: {
        en: "Our central olive tree provides a beautiful green connection to nature right inside the lounge, acting as a mental palate cleanser.",
        ar: "شجرة الزيتون الوارفة في قلب الصالة توفر لمسة خضراء دافئة للاندماج الطبيعي، وتعمل كمطهر ذهني مهدئ للعين."
      },
      icon: Leaf,
      science: {
        en: "Studies show viewing real plants lowers sympathetic nervous system activity and decreases stress levels by 15%.",
        ar: "تؤكد الدراسات أن مشاهدة النباتات الحية تقلل نشاط الجهاز العصبي الودي وتخفض معدلات الإجهاد بنسبة ١٥٪."
      },
      x: '55%',
      y: '50%',
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'spot-4',
      title: { en: "Focused Work Zones", ar: "مناطق الإنتاجية والعمل" },
      description: {
        en: "Equipped with power points, ultra-fast fiber WiFi, and optimal desk spacing that keeps your creative thoughts flowing cleanly.",
        ar: "مجهزة بمقابس طاقة كافية، وشبكة إنترنت ألياف فائقة السرعة، وتباعد مثالي بين الطاولات للحفاظ على خصوصية فكرتك."
      },
      icon: Brain,
      science: {
        en: "Carefully calibrated background hum (70dB) promotes abstract thinking compared to fully silent or loud rooms.",
        ar: "الهمس الخلفي المعتدل للصالة (٧٠ ديسيبل) يحفز التفكير الإبداعي والتجريدي مقارنة بالصمت المطبق أو الضجيج."
      },
      x: '20%',
      y: '45%',
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const currentSpot = hotspots.find(h => h.id === selectedSpot) || hotspots[0];
  const CurrentIcon = currentSpot.icon;

  return (
    <section className="py-24 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] relative overflow-hidden bg-grain border-t border-gold/10">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "THE RITUAL SANCTUARY" : "بيئة مخصصة للتركيز"}
          </span>
          <h2 className={`text-3xl sm:text-5xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {t('titleScience')}
          </h2>
          <p className="text-cream/80 text-base sm:text-lg">
            {t('subtitleScience')}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Interactive Map / Spatial Walkthrough Visual */}
          <div className="lg:col-span-7 bg-[#1A1210]/60 border border-gold/15 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden h-[400px] sm:h-[500px]">
            {/* Visual background symbolizing our boutique lounge space floorplan or abstract perspective layout */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-25 group filter saturate-[0.8] contrast-[1.1]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-dark-red/90 via-wine/60 to-dark-red/90 mix-blend-multiply" />
            
            {/* Helpful legend */}
            <div className="relative z-10 bg-[#1A1210]/90 border border-gold/20 px-4 py-2.5 rounded-lg self-start text-xs text-cream flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>
                {currentLang === 'en' 
                  ? "Interactive Lounge Map: Click hotspots to step inside" 
                  : "مخطط الصالة التفاعلي: اضغط على النقاط للاستكشاف"}
              </span>
            </div>

            {/* Hotspots Interactive Stage Overlay */}
            <div className="absolute inset-0 flex justify-center items-center z-15">
              <div className="relative w-full h-full">
                
                {hotspots.map((spot) => {
                  const isActive = spot.id === selectedSpot;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot.id)}
                      className="absolute group/spot focus:outline-none cursor-pointer"
                      style={{ left: spot.x, top: spot.y }}
                    >
                      {/* Interactive pulsing concentric circles */}
                      <span className={`absolute -inset-4 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gold/30 animate-ping' 
                          : 'bg-gold/10 group-hover/spot:bg-gold/20'
                      }`} />
                      
                      <div className={`relative w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-luxury shadow-lg ${
                        isActive 
                          ? 'bg-gold border-gold text-[#1A1210] scale-110' 
                          : 'bg-wine border-gold/40 text-gold group-hover/spot:bg-gold group-hover/spot:text-espresso'
                      }`}>
                        <spot.icon className="w-4 h-4" />
                      </div>

                      {/* Micro tooltip above hotspot */}
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-[#1A1210] text-gold border border-gold/30 text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover/spot:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                        {spot.title[currentLang]}
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Floating location label indicating Barka Flagship */}
            <div className="relative z-10 bg-[#1A1210]/80 border border-gold/10 px-3 py-1 rounded text-[10px] font-mono text-gold self-end">
              {currentLang === 'en' ? "BARKA FLAGSHIP LOUNGE FLOORPLAN" : "مخطط صالة كافيه ٩٣ بركاء الرئيسة"}
            </div>

          </div>

          {/* Right Block: Hotspot science details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSpot}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-[#EDE1CB] text-[#1A1210] p-8 sm:p-10 rounded-2xl flex flex-col justify-between h-full border border-gold/30 shadow-2xl relative"
              >
                
                {/* Visual ceramic tile background element */}
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 opacity-10">
                  <CurrentIcon className="w-24 h-24 text-dark-red" />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-dark-red rounded-xl text-gold shadow-md">
                      <CurrentIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-wine font-bold uppercase tracking-widest block">
                        {currentLang === 'en' ? "WORKSPACE NEUROSCIENCE" : "العلم خلف المساحات"}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-espresso">
                        {currentSpot.title[currentLang]}
                      </h3>
                    </div>
                  </div>

                  {/* Poetic description */}
                  <p className="text-sm text-espresso/90 leading-relaxed mb-6 font-medium">
                    {currentSpot.description[currentLang]}
                  </p>

                  {/* Scientific Fact box */}
                  <div className="bg-wine/10 border-l-4 border-gold p-4 rounded-r-lg mb-8">
                    <span className="text-[10px] font-bold text-wine uppercase tracking-wider block mb-1">
                      {currentLang === 'en' ? "RESEARCH BACKED EFFECT" : "الأثر العلمي المعتمد"}
                    </span>
                    <p className="text-xs text-[#1A1210] leading-relaxed font-mono">
                      {currentSpot.science[currentLang]}
                    </p>
                  </div>
                </div>

                {/* Micro photography preview matching this zone */}
                <div className="w-full h-32 rounded-xl overflow-hidden relative group">
                  <img 
                    src={currentSpot.image} 
                    alt={currentSpot.title[currentLang]} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-dark-red/20 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1210] to-transparent" />
                  <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                    {currentLang === 'en' ? "On-Site Photography Preview" : "صورة ملتقطة حقيقية للمساحة"}
                  </span>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
