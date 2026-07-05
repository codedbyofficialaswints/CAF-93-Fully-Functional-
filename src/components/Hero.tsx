import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Play, Volume2, VolumeX, Coffee } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface HeroProps {
  currentLang: Language;
  onNavigate: (tab: string) => void;
}

export default function Hero({ currentLang, onNavigate }: HeroProps) {
  const [isPouring, setIsPouring] = useState(false);
  const [pourCompleted, setPourCompleted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Track mouse position for the 3D parallax tilt effect on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !tiltRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // Calculate normalized coords between -1 and 1
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      const rotX = y * -15; // Max 15 deg tilt
      const rotY = x * 15;
      
      tiltRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    };

    const handleMouseLeave = () => {
      if (!tiltRef.current) return;
      tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    const element = heroRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove, { passive: true });
      element.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handlePourTrigger = () => {
    if (isPouring) return;
    setIsPouring(true);
    setPourCompleted(false);

    // Play soft pouring water / coffee audio if unmuted
    if (!audioMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      setIsPouring(false);
      setPourCompleted(true);
    }, 3500);
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] overflow-hidden pt-20 flex items-center bg-grain"
    >
      <div className="bg-pattern" />
      {/* Soft ambient red & gold spots glowing in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-terracotta/20 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Hidden sound for pouring - soft pleasant coffee shop sounds */}
      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/1627/1627-84.wav" 
        preload="auto"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left / Right Content Pane: Text Storytelling */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left rtl:lg:text-right">
            
            {/* Top Premium Badge */}
            <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.3em] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
              <span>
                {currentLang === 'en' ? "Oman's Luxury Workspace" : "أول كافيه درايف ثرو فاخر ببركاء"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.1] mb-6">
              <span className="block font-display font-semibold text-white mb-2 tracking-wide">
                {currentLang === 'en' ? "CΛFÉ 93°" : "كافيه ٩٣°"}
              </span>
              <span className={`block ${currentLang === 'ar' ? 'arabic text-gold text-5xl sm:text-6xl' : 'font-posterama-regular text-gold'}`}>
                {t('heroTitle')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-cream/90 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              {t('heroSubtitle')}
            </p>

            {/* Dual Actions Button Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <button
                onClick={() => onNavigate('menu')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold/90 text-espresso font-bold rounded-lg shadow-xl hover:shadow-gold/20 active:scale-95 transition-luxury group cursor-pointer"
              >
                <span className="tracking-wide uppercase text-sm">{t('btnOrderNow')}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </button>
              
              <button
                onClick={handlePourTrigger}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-wine/60 hover:bg-wine border border-gold/30 hover:border-gold text-white font-medium rounded-lg transition-luxury gap-2 cursor-pointer"
              >
                <Coffee className={`w-4 h-4 text-gold ${isPouring ? 'animate-bounce' : ''}`} />
                <span className="text-sm">
                  {isPouring 
                    ? (currentLang === 'en' ? "Pouring Sweetness..." : "جاري سكب السعادة...") 
                    : (currentLang === 'en' ? "Pour the Espresso" : "اسكب إسبريسو ٩٣")}
                </span>
              </button>
            </div>

            {/* Ambient Sound Toggle & scientific focus cue */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-cream/60 text-xs">
              <button 
                onClick={() => setAudioMuted(!audioMuted)}
                className="p-2 bg-dark-red/50 hover:bg-wine border border-gold/10 hover:border-gold/30 rounded-full transition-luxury cursor-pointer"
                title={audioMuted ? "Unmute pour sound" : "Mute pour sound"}
              >
                {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-gold/60" /> : <Volume2 className="w-3.5 h-3.5 text-gold" />}
              </button>
              <span>
                {currentLang === 'en' 
                  ? "💡 Interactive: Experience our custom ceramic pour rituals"
                  : "💡 تفاعلي: عِش طقس صب القهوة السيراميكي الفريد"}
              </span>
            </div>

          </div>

          {/* Right/Left Interactive Cup Visualizer Panel */}
          <div className="lg:col-span-5 flex justify-center items-center h-[400px] md:h-[500px] relative">
            
            {/* Interactive container that tilts on hover */}
            <div 
              onClick={handlePourTrigger}
              className="relative w-80 h-80 md:w-96 md:h-96 flex justify-center items-center cursor-pointer group"
              style={{
                perspective: '1000px',
              }}
            >
              <div 
                ref={tiltRef}
                className="relative w-full h-full flex justify-center items-center transition-all duration-300 ease-out"
                style={{
                  transform: 'rotateX(0deg) rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                
                {/* 3D shadows & light glows behind the cup */}
                <div className="absolute bottom-6 w-48 h-10 bg-black/60 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute w-72 h-72 rounded-full bg-gold/5 blur-3xl group-hover:bg-gold/10 transition-colors" />

                {/* Steam particles rising from the cup */}
                <div className="absolute top-1/4 flex flex-col items-center gap-4 pointer-events-none">
                  <div className="flex gap-6">
                    <span className="w-1.5 h-8 bg-ivory/20 rounded-full blur-[2px] animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.2s' }} />
                    <span className="w-1 h-12 bg-ivory/25 rounded-full blur-[2px] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.8s' }} />
                    <span className="w-1.5 h-6 bg-ivory/15 rounded-full blur-[2px] animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1.2s' }} />
                  </div>
                </div>

                {/* Golden Drip/Filter floating above (The extraction origin) */}
                <div className="absolute -top-10 z-20 flex flex-col items-center">
                  <div className="w-14 h-4 bg-gradient-to-r from-gold/40 via-gold to-gold/40 border border-gold/70 rounded-full shadow-lg" />
                  <div className="w-8 h-8 bg-gradient-to-b from-gold via-[#A87B32] to-[#6E4E1C] clip-path-v-dripper border-r border-l border-gold/50 rounded-b-md" />
                </div>

                {/* Coffee Stream Pour Overlay */}
                <AnimatePresence>
                  {isPouring && (
                    <motion.div 
                      initial={{ scaleY: 0, originY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-[8px] bottom-[115px] w-2.5 bg-gradient-to-r from-terracotta via-dark-red to-espresso rounded-full z-15 shadow-glow"
                      style={{
                        boxShadow: '0 0 12px rgba(181, 80, 46, 0.6)'
                      }}
                    >
                      {/* Splashing sparks at the impact point inside cup */}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold animate-ping" />
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-terracotta" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* HIGH-FIDELITY CERAMIC CUP (Handmade raw stoneware dipped in wine-red glaze) */}
                <div className="absolute w-56 h-56 flex justify-center items-center select-none" style={{ transform: 'translateZ(40px)' }}>
                  
                  {/* Outer cup envelope */}
                  <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
                    <defs>
                      {/* Red glossy glaze gradient */}
                      <linearGradient id="wineGlaze" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#962A2A" />
                        <stop offset="40%" stopColor="#7A1F1F" />
                        <stop offset="100%" stopColor="#4A1010" />
                      </linearGradient>
                      {/* Raw unglazed stoneware clay gradient */}
                      <linearGradient id="rawClay" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E0D1B4" />
                        <stop offset="30%" stopColor="#EDE1CB" />
                        <stop offset="70%" stopColor="#EDE1CB" />
                        <stop offset="100%" stopColor="#D4C3A3" />
                      </linearGradient>
                      {/* Shadow gradient inside cup */}
                      <linearGradient id="innerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1A1210" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#7A1F1F" stopOpacity="0.2" />
                      </linearGradient>
                      {/* Rich Gold Foil lettering */}
                      <linearGradient id="goldGlint" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C9A15A" />
                        <stop offset="50%" stopColor="#F5E3C3" />
                        <stop offset="100%" stopColor="#A87B32" />
                      </linearGradient>
                    </defs>

                    {/* Cup Main Body Shape */}
                    {/* An asymmetric tapered shape mimicking organic pottery handcraft */}
                    <path 
                      d="M 35,45 
                         C 35,45 28,175 42,185 
                         C 55,195 145,195 158,185 
                         C 172,175 165,45 165,45
                         Z" 
                      fill="url(#rawClay)" 
                    />

                    {/* Glossy Red Glaze Top Dipped Rim (curves beautifully over the stoneware clay) */}
                    <path 
                      d="M 35,45 
                         C 35,45 32,105 45,115
                         C 58,125 142,125 155,115
                         C 168,105 165,45 165,45
                         C 165,45 150,55 100,55
                         C 50,55 35,45 35,45 
                         Z" 
                      fill="url(#wineGlaze)" 
                      className="transition-luxury"
                    />

                    {/* Golden "CAFÉ 93" Stamp Embossed in stoneware clay body */}
                    <text 
                      x="100" 
                      y="155" 
                      textAnchor="middle" 
                      fontFamily='"Posterama Semibold", "Posterama", "Outfit", sans-serif' 
                      fontWeight="600" 
                      fontSize="14" 
                      fill="#6B4226" 
                      letterSpacing="2"
                      opacity="0.85"
                    >
                      CΛFÉ 93°
                    </text>
                    <text 
                      x="100" 
                      y="172" 
                      textAnchor="middle" 
                      fontFamily="Cairo, Noto Kufi Arabic, sans-serif" 
                      fontWeight="bold" 
                      fontSize="9" 
                      fill="#6B4226" 
                      letterSpacing="1.5"
                      opacity="0.8"
                    >
                      إكسير السعادة
                    </text>

                    {/* Intricate thin gold-foil border accent */}
                    <path 
                      d="M 41,180 C 70,186 130,186 159,180" 
                      fill="none" 
                      stroke="url(#goldGlint)" 
                      strokeWidth="1.5" 
                      opacity="0.5" 
                    />

                    {/* Inner Rim Opening Ellipse */}
                    <ellipse cx="100" cy="45" rx="65" ry="15" fill="#1C0606" />

                    {/* Coffee Fluid Level inside opening ellipse */}
                    <ellipse 
                      cx="100" 
                      cy="46" 
                      rx="63" 
                      ry="13.5" 
                      fill={pourCompleted ? "#B5502E" : "#4A1010"} 
                      className="transition-all duration-1000"
                    />

                    {/* Golden Latte Art / Espresso Crema details (appears or brightens when poured) */}
                    <g opacity={pourCompleted ? 0.9 : 0.3} className="transition-opacity duration-1000">
                      {/* Heart-shaped crema swirl */}
                      <path 
                        d="M 100,41 
                           C 92,34 77,38 86,47 
                           C 93,54 100,51 100,51 
                           C 100,51 107,54 114,47 
                           C 123,38 108,34 100,41" 
                        fill="url(#goldGlint)" 
                      />
                      <ellipse cx="100" cy="46" rx="20" ry="4" fill="#C9A15A" opacity="0.3" />
                    </g>
                  </svg>
                </div>

                {/* Floating "Click Me" indicator */}
                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-dark-red/90 border border-gold/40 px-3 py-1 rounded-full animate-bounce shadow-md">
                    {pourCompleted 
                      ? (currentLang === 'en' ? "Full! Sip Again" : "مليء! اسكب مجدداً") 
                      : (currentLang === 'en' ? "Tap to Pour" : "انقر للسكب")}
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Decorative Wave/Pour transition boundary at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-red to-transparent pointer-events-none" />
    </div>
  );
}
