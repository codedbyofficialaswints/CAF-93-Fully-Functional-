import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ShieldCheck, Award, Zap, Flame } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, STORYTELLING_STEPS } from '../data';

interface StorytellingProps {
  currentLang: Language;
}

export default function Storytelling({ currentLang }: StorytellingProps) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const currentStep = STORYTELLING_STEPS[activeStepIdx];

  const handleNext = () => {
    setActiveStepIdx((prev) => (prev + 1) % STORYTELLING_STEPS.length);
  };

  const handlePrev = () => {
    setActiveStepIdx((prev) => (prev - 1 + STORYTELLING_STEPS.length) % STORYTELLING_STEPS.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] relative overflow-hidden bg-grain border-t border-gold/10">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "THE RITUAL" : "الطقوس المقدسة"}
          </span>
          <h2 className={`text-3xl sm:text-5xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {t('titleStorytelling')}
          </h2>
          <p className="text-cream/80 text-base sm:text-lg">
            {t('subtitleStorytelling')}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        {/* Dynamic Storyboard Card */}
        <div className="bg-wine/40 border border-gold/15 rounded-2xl overflow-hidden glass-card shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left pane: Active Step Image Visual with overlays */}
            <div className="lg:col-span-5 h-[300px] sm:h-[400px] lg:h-auto relative overflow-hidden group">
              {/* Image Transition */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentStep.id}
                  src={currentStep.media}
                  alt={currentStep.title[currentLang]}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </AnimatePresence>
              
              {/* Vignette & color overlays to blend with brand colors */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-red via-transparent to-black/30 mix-blend-multiply" />
              <div className="absolute inset-0 bg-wine/20 mix-blend-color" />

              {/* Float Step Number */}
              <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6 bg-gold text-[#1A1210] font-serif font-black w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg border border-gold/30">
                0{activeStepIdx + 1}
              </div>

              {/* Micro Science Fact callout bubble inside the image frame */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#1A1210]/95 border border-gold/30 p-4 rounded-lg glass-card">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-0.5">
                      {currentLang === 'en' ? "COGNITIVE/EXTRACTION FACT" : "حقيقة علمية / استخلاص"}
                    </span>
                    <p className="text-xs text-cream/90 font-mono leading-relaxed">
                      {currentStep.fact[currentLang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right pane: Text Description & Controls */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
              
              {/* Stepper Progress Bar */}
              <div className="flex items-center gap-2 mb-8">
                {STORYTELLING_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepIdx(idx)}
                    className="flex-1 h-1.5 rounded-full transition-luxury relative overflow-hidden cursor-pointer"
                    style={{
                      backgroundColor: idx <= activeStepIdx ? 'rgba(201, 161, 90, 0.4)' : 'rgba(201, 161, 90, 0.1)'
                    }}
                  >
                    {idx === activeStepIdx && (
                      <motion.div 
                        layoutId="activeBar"
                        className="absolute inset-0 bg-gold"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Step Copy */}
              <div className="min-h-[180px]">
                <span className="text-gold font-mono text-xs uppercase tracking-widest block mb-1">
                  {currentStep.subtitle[currentLang]}
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-6">
                  {currentStep.title[currentLang]}
                </h3>
                <p className="text-cream/90 text-sm sm:text-base leading-relaxed">
                  {currentStep.description[currentLang]}
                </p>
              </div>

              {/* Navigation Arrows Row */}
              <div className="flex items-center justify-between border-t border-gold/10 pt-8 mt-8">
                {/* Step indicators */}
                <div className="text-cream/60 text-xs font-mono">
                  <span>{currentLang === 'en' ? "STEP" : "الخطوة"}</span>{' '}
                  <span className="text-gold font-bold">0{activeStepIdx + 1}</span>{' '}
                  <span>/ 0{STORYTELLING_STEPS.length}</span>
                </div>

                {/* Arrow actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="p-3 bg-wine/80 hover:bg-gold border border-gold/20 hover:border-gold hover:text-espresso rounded-full transition-luxury cursor-pointer"
                    aria-label="Previous step"
                  >
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-3 bg-gold hover:bg-gold/90 border border-gold text-espresso rounded-full transition-luxury cursor-pointer"
                    aria-label="Next step"
                  >
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Craft Core Showcase Mini Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-wine/20 border border-gold/10 rounded-xl flex items-start gap-4">
            <Flame className="w-8 h-8 text-gold flex-shrink-0" />
            <div>
              <h4 className="font-serif text-lg font-bold text-white mb-1">
                {currentLang === 'en' ? "Constant 93°C Heat" : "حرارة استخلاص ٩٣° ثابتة"}
              </h4>
              <p className="text-xs text-cream/75 leading-relaxed">
                {currentLang === 'en' 
                  ? "Maintained by calibrated dual boilers for exact consistency." 
                  : "تضمنها غلايات مزدوجة معالجة تمنع ذبذبة الحرارة."}
              </p>
            </div>
          </div>

          <div className="p-6 bg-wine/20 border border-gold/10 rounded-xl flex items-start gap-4">
            <Award className="w-8 h-8 text-gold flex-shrink-0" />
            <div>
              <h4 className="font-serif text-lg font-bold text-white mb-1">
                {currentLang === 'en' ? "Premium Micro-Lots" : "محاصيل حصرية فاخرة"}
              </h4>
              <p className="text-xs text-cream/75 leading-relaxed">
                {currentLang === 'en' 
                  ? "Sourced directly, guaranteeing high farmers compensation." 
                  : "تُستورد مباشرة لضمان أعلى عوائد للمزارعين الكادحين."}
              </p>
            </div>
          </div>

          <div className="p-6 bg-wine/20 border border-gold/10 rounded-xl flex items-start gap-4">
            <Zap className="w-8 h-8 text-gold flex-shrink-0" />
            <div>
              <h4 className="font-serif text-lg font-bold text-white mb-1">
                {currentLang === 'en' ? "Double Filtering" : "تصفية مائية نقية"}
              </h4>
              <p className="text-xs text-cream/75 leading-relaxed">
                {currentLang === 'en' 
                  ? "Our water passes through 5 stages of carbon & mineral balancing." 
                  : "يمر ماؤنا عبر ٥ مراحل لتعديل المعادن والفلترة الكربونية."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
