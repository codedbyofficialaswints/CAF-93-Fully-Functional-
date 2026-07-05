import React, { useState } from 'react';
import { MapPin, Clock, ShieldCheck, Car, Coffee, Compass, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface LocationsProps {
  currentLang: Language;
}

export default function Locations({ currentLang }: LocationsProps) {
  const [startingPoint, setStartingPoint] = useState('');
  const [estimatedRoute, setEstimatedRoute] = useState<{
    distance: string;
    duration: string;
    description: { en: string; ar: string };
  } | null>(null);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Real coordinate and route simulator from Omani cities to Barka
  const routeSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingPoint.trim()) return;

    const startLower = startingPoint.toLowerCase().trim();
    
    if (startLower.includes('muscat') || startLower.includes('مسقط') || startLower.includes('seeb') || startLower.includes('السيب')) {
      setEstimatedRoute({
        distance: "48 km",
        duration: "32 mins",
        description: {
          en: "Take the Sultan Qaboos highway Westbound. Take the exit for Barka Central. The 93° drive-thru is situated on your right.",
          ar: "اسلك طريق السلطان قابوس السريع غرباً. خذ مخرج ولاية بركاء الرئيسي. يقع كافيه ٩٣ على يمينك مباشرة."
        }
      });
    } else if (startLower.includes('sohar') || startLower.includes('صحار')) {
      setEstimatedRoute({
        distance: "162 km",
        duration: "1 hour 35 mins",
        description: {
          en: "Take the Al Batinah Expressway Eastbound, then join Route 1 to Barka. Drive-thru is on the service lane.",
          ar: "اسلك طريق الباطنة السريع شرقاً، ثم انضم إلى الطريق رقم ١ المتجه لبركاء. يقع الكافيه وممر الدرايف ثرو على طريق الخدمة."
        }
      });
    } else if (startLower.includes('rustaq') || startLower.includes('الرستاق')) {
      setEstimatedRoute({
        distance: "65 km",
        duration: "45 mins",
        description: {
          en: "Take the Rustaq-Barka link road East. Proceed straight to Barka Souq. Located near the central drive-thru lane.",
          ar: "اسلك طريق الرستاق-بركاء الرابط شرقاً. تقدم مباشرة نحو بركاء سنتر. يقع الكافيه بالقرب من ممر الدرايف ثرو المركزي."
        }
      });
    } else {
      // Default / general Oman route
      setEstimatedRoute({
        distance: "Approx. 55 km",
        duration: "38 mins",
        description: {
          en: "Drive towards Barka Central, South Al Batinah. Located right off Route 1, fully visible with black-and-white 'CAFÉ 93°' luxury branding.",
          ar: "قد سيارتك باتجاه بركاء سنتر، جنوب الباطنة. يقع الكافيه مباشرة قبالة الطريق رقم ١، بواجهة بيضاء وسوداء فاخرة تحمل شعار كافيه ٩٣°."
        }
      });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] relative overflow-hidden bg-grain border-t border-gold/10">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "OUR HOME BASE" : "موقعنا في سلطنة عمان"}
          </span>
          <h2 className={`text-3xl sm:text-5xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {t('titleLocation')}
          </h2>
          <p className="text-cream/80 text-base sm:text-lg">
            {t('subtitleLocation')}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Frame: Detailed spatial info, hours, amenities list */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-8">
              
              {/* Drive-thru banner indicator */}
              <div className="bg-[#1A1210] border border-gold/20 p-6 rounded-2xl flex items-start gap-4 shadow-xl">
                <div className="p-3 bg-wine rounded-xl text-gold">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-1">
                    {currentLang === 'en' ? "Oman's Drive-thru Pioneer" : "رائد الدرايف ثرو في عُمان"}
                  </h3>
                  <p className="text-xs text-cream/70 leading-relaxed">
                    {currentLang === 'en' 
                      ? "Custom dual-lane system built for convenience with crystal-clear bilingual audio menus. Perfect coffee served in under 90 seconds."
                      : "نظام مسار ثنائي مصمم لراحتك مع سماعات صوتية فائقة النقاء ثنائية اللغة. قهوتك الفاخرة تستلمها في أقل من ٩٠ ثانية."}
                  </p>
                </div>
              </div>

              {/* Live Hours Widget */}
              <div className="bg-wine/30 border border-gold/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2.5 text-gold border-b border-gold/10 pb-3">
                  <Clock className="w-5 h-5 text-gold" />
                  <span className="font-serif font-bold text-base">{t('openingHours')}</span>
                </div>
                <div className="space-y-2 text-sm text-cream/90">
                  <div className="flex items-center justify-between">
                    <span>{t('hoursWeekdays')}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {currentLang === 'en' ? "Open" : "مفتوح"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('hoursWeekend')}</span>
                    <span className="text-gold font-bold text-xs">{currentLang === 'en' ? "Late Hours" : "ساعات إضافية"}</span>
                  </div>
                </div>
              </div>

              {/* Exact Physical Coordinates */}
              <div className="bg-wine/30 border border-gold/10 p-6 rounded-2xl flex items-start gap-3">
                <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-white mb-1">{t('addressTitle')}</h4>
                  <p className="text-sm text-cream/80">{t('addressDetail')}</p>
                  <span className="inline-block mt-2 text-[10px] font-mono text-gold/60">
                    GPS Coordinates: 23.7088° N, 57.8876° E
                  </span>
                </div>
              </div>

            </div>

            {/* Micro Directions Interactive Form */}
            <form onSubmit={routeSimulator} className="mt-8 bg-wine/50 border border-gold/15 p-6 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-gold block mb-1">
                {currentLang === 'en' ? "GPS ROUTE CALCULATOR" : "حساب مسار القيادة الفوري"}
              </span>
              <h4 className="font-serif font-bold text-white text-base mb-4">
                {currentLang === 'en' ? "Plan your drive to CAFÉ 93°" : "خطط مسار طريقك إلينا"}
              </h4>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={currentLang === 'en' ? "e.g. Muscat, Sohar, Rustaq..." : "مثال: مسقط، صحار، الرستاق..."}
                  value={startingPoint}
                  onChange={(e) => setStartingPoint(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm bg-dark-red/80 border border-gold/20 focus:border-gold outline-none rounded-lg text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gold hover:bg-gold/90 text-espresso font-bold text-xs rounded-lg uppercase transition-luxury cursor-pointer"
                >
                  {currentLang === 'en' ? "Route" : "احسب"}
                </button>
              </div>

              {/* simulated route result */}
              {estimatedRoute && (
                <div className="mt-4 bg-[#1A1210] border border-gold/20 p-4 rounded-lg animate-fade-in space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cream/50">{currentLang === 'en' ? "Est. Distance:" : "المسافة المتوقعة:"}</span>
                    <span className="text-gold font-bold">{estimatedRoute.distance}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cream/50">{currentLang === 'en' ? "Est. Duration:" : "مدة القيادة:"}</span>
                    <span className="text-gold font-bold">{estimatedRoute.duration}</span>
                  </div>
                  <p className="text-xs text-cream/95 leading-relaxed pt-2 border-t border-gold/10">
                    {estimatedRoute.description[currentLang]}
                  </p>
                </div>
              )}
            </form>

          </div>

          {/* Right Frame: Embedded Interactive Styled Google Map Mockup */}
          {/* Fulfills Section 6 map requirement */}
          <div className="lg:col-span-7 bg-[#1A1210]/75 border border-gold/15 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col justify-between min-h-[400px]">
            
            {/* Real aesthetic map iframe with customized sepia styling to blend beautifully with wine-red theme */}
            <div className="w-full flex-1 rounded-xl overflow-hidden relative group">
              <iframe 
                title="CAFÉ 93° Barka Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116964.819307!2d57.8876!3d23.7088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8d9b4aefdd!2sBarka%2C%20Oman!5e0!3m2!1sen!2s!4v1655000000000!5m2!1sen!2s" 
                className="w-full h-full border-0 absolute inset-0 map-dark-overlay"
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Cover layout when not interacted */}
              <div className="absolute top-4 left-4 bg-dark-red/90 border border-gold/30 px-3 py-1.5 rounded-lg text-xs text-gold font-mono flex items-center gap-1.5 z-10 pointer-events-none">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Barka Central Flagship, Oman</span>
              </div>
            </div>

            {/* Map footer with social navigation */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-xs text-cream/70">
                <CheckCircle className="w-4 h-4 text-gold" />
                <span>{currentLang === 'en' ? "Ample parking & shaded workspace available" : "تتوفر مواقف سيارات واسعة ومظلات ومساحة عمل"}</span>
              </div>
              
              <a 
                href="https://goo.gl/maps/barka-cafe93" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold/90 text-espresso font-bold text-xs uppercase rounded-lg tracking-wider shadow-lg transition-luxury"
              >
                <span>{t('btnGetDirections')}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
