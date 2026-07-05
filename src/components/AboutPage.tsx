import React from 'react';
import { Award, Compass, Heart, Landmark, CheckCircle, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface AboutPageProps {
  currentLang: Language;
}

export default function AboutPage({ currentLang }: AboutPageProps) {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] bg-grain min-h-screen relative overflow-hidden">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "OUR BRAND DNA" : "قصتنا وأصالتنا"}
          </span>
          <h1 className={`text-4xl sm:text-6xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {t('storyTitle')}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base">
            {t('storySubtitle')}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        {/* Origin / Founding Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/30 rounded-full text-gold text-xs font-mono">
              <Landmark className="w-4.5 h-4.5" />
              <span>ESTABLISHED 2020 — BARKA, SULTANATE OF OMAN</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
              {currentLang === 'en' ? "Pioneering Connoisseur Hospitality" : "الريادة في صب التفاصيل"}
            </h2>

            <p className="text-cream/90 text-sm sm:text-base leading-relaxed">
              {TRANSLATIONS.storyFoundingText[currentLang]}
            </p>

            <p className="text-cream/70 text-xs sm:text-sm leading-relaxed">
              {currentLang === 'en' 
                ? "At CAFÉ 93°, we believe coffee is more than caffeine—it is a cognitive ritual and an elixir of mood. Our interior lounge replicates the warmth of traditional Omani majlis, scaled with mid-century modern cane-back walnut design, creating a sanctuary where creatives and professionals can work with ultimate mental clarity."
                : "في كافيه ٩٣، نؤمن بأن فنجان القهوة هو أكثر من مجرد منبه—إنه طقس ذهني مصفى وإكسير متكامل للمزاج. تعكس صالتنا دفء المجالس العمانية التقليدية بأسلوب معاصر مجهز بكراسي من قش الخيزران وخشب الجوز المصمم لتهدئة الذهن وزيادة الإنتاجية."}
            </p>
          </div>

          <div className="lg:col-span-5 h-[350px] sm:h-[450px] relative rounded-2xl overflow-hidden group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" 
              alt="Barista brewing latte art, CAFÉ93 stoneware cup" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-dark-red/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-wine/15 mix-blend-color" />
            <div className="absolute bottom-6 left-6 right-6 bg-dark-red/90 border border-gold/20 p-4 rounded-lg">
              <span className="text-[10px] text-gold font-mono uppercase tracking-widest block mb-1">
                {currentLang === 'en' ? "EST. 2020 LANDMARK" : "شعار الجودة الفاخر"}
              </span>
              <p className="text-xs text-cream/90">
                {currentLang === 'en' 
                  ? "Barka's first drive-thru and artisan sanctuary, designed for your focus."
                  : "أول درايف ثرو وملاذ حرفي في ولاية بركاء، مُهندّس لصفاء ذهنك."}
              </p>
            </div>
          </div>
        </div>

        {/* Brand Mockup & Identity Section */}
        <div className="mt-24 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-b border-gold/10 py-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/30 rounded-full text-gold text-xs font-mono">
              <span>{currentLang === 'en' ? "BRAND IDENTITY MOCKUP" : "نموذج الهوية البصرية الفاخرة"}</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-normal text-white ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
              {currentLang === 'en' ? "The Crafted Identity" : "طقوس الهوية البصرية"}
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
              {currentLang === 'en'
                ? "Every touchpoint at CAFÉ 93° is meticulously designed. From our handcrafted ceramic cups with organic stoneware clay dipped in premium wine-red glazes, to our minimalist business cards and signature menus. We embrace the warmth of traditional Omani hospitality, framed by modern, high-precision geometry."
                : "تم تصميم كل نقطة تواصل في كافيه ٩٣ بعناية فائقة. بدءاً من أكواب السيراميك المصنوعة يدوياً والمصقولة باللون الأحمر الدافئ، وصولاً إلى بطاقات العمل الفاخرة وقائمتنا الجلدية الأنيقة. نجسد كرم الضيافة العمانية التقليدية في إطار هندسي حديث عالي الدقة."}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="border border-gold/10 p-3 bg-wine/20 rounded-lg">
                <span className="block font-mono text-gold text-sm font-semibold">#4B2E1D</span>
                <span className="text-[10px] text-cream/60">{currentLang === 'en' ? "Rich Espresso" : "إسبريسو غني"}</span>
              </div>
              <div className="border border-gold/10 p-3 bg-wine/20 rounded-lg">
                <span className="block font-mono text-gold text-sm font-semibold">#D2691E</span>
                <span className="text-[10px] text-cream/60">{currentLang === 'en' ? "Terracotta" : "تيراكوتا دافئة"}</span>
              </div>
              <div className="border border-gold/10 p-3 bg-wine/20 rounded-lg">
                <span className="block font-mono text-gold text-sm font-semibold">#FDF5E6</span>
                <span className="text-[10px] text-cream/60">{currentLang === 'en' ? "Warm Ivory" : "عاجي دافئ"}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden group shadow-2xl border border-gold/20">
            <img 
              src="/src/assets/images/branding_mockup_1783203298263.jpg" 
              alt="Café 93 Brand Identity Mockup" 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-red/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Sourcing / Coffee Quality Split Grid (Flipped) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5 h-[350px] sm:h-[450px] relative rounded-2xl overflow-hidden group shadow-2xl order-last lg:order-first">
            <img 
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800" 
              alt="Artisanal raw coffee beans sourcing" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-dark-red/25 mix-blend-multiply" />
            <div className="absolute bottom-6 left-6 right-6 bg-dark-red/90 border border-gold/20 p-4 rounded-lg">
              <span className="text-[10px] text-gold font-mono uppercase tracking-widest block mb-1">
                {currentLang === 'en' ? "ALTITUDE GROWN" : "حبات مرتفعات كولومبيا"}
              </span>
              <p className="text-xs text-cream/90">
                {currentLang === 'en' 
                  ? "Strictly high-altitude beans that naturally yield high antioxidant qualities."
                  : "حبوب مرتفعات خاضعة لاختبارات الصلابة وتحتوي على مضادات أكسدة طبيعية."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/30 rounded-full text-gold text-xs font-mono">
              <Compass className="w-4.5 h-4.5 animate-spin-slow" />
              <span>THE 93° COFFEE BEAN STANDARD</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
              {t('storySourcingTitle')}
            </h2>

            <p className="text-cream/90 text-sm sm:text-base leading-relaxed">
              {TRANSLATIONS.storySourcingText[currentLang]}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-wine/30 border border-gold/10 rounded-lg">
                <h4 className="font-serif font-bold text-white text-sm mb-1">
                  {currentLang === 'en' ? "100% Traceability" : "تتبع كامل للمحاصيل"}
                </h4>
                <p className="text-xs text-cream/70 leading-relaxed">
                  {currentLang === 'en' 
                    ? "We trace every single bag of coffee to its single-farm owner."
                    : "نتتبع كل كيس بن مستورد لنضمن عائدات عادلة ومباشرة للمزارع."}
                </p>
              </div>

              <div className="p-4 bg-wine/30 border border-gold/10 rounded-lg">
                <h4 className="font-serif font-bold text-white text-sm mb-1">
                  {currentLang === 'en' ? "Sensory Roast Curves" : "منحنى حمص حسي"}
                </h4>
                <p className="text-xs text-cream/70 leading-relaxed">
                  {currentLang === 'en' 
                    ? "Carefully adjusted profile to limit bitterness while maximizing sweetness."
                    : "منحنى دقيق ومبرمج بعناية يحد من مرارة الحبة مع إبراز سكرياتها."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hospitality & Dedication Values Row */}
        <div className="bg-[#EDE1CB] text-[#1A1210] p-8 sm:p-12 rounded-3xl border border-gold/40 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-wine font-mono text-xs uppercase tracking-widest block mb-1">
              {currentLang === 'en' ? "COFFEE AS A LIFESTYLE" : "القهوة كأسلوب حياة كوني"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-dark-red">
              {currentLang === 'en' ? "The Elixir Philosophy" : "فلسفة إكسير السعادة"}
            </h3>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-dark-red text-gold rounded-full flex items-center justify-center mx-auto shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-espresso text-lg">
                {currentLang === 'en' ? "Uncompromising Quality" : "جودة لا تقبل المساومة"}
              </h4>
              <p className="text-xs text-[#1A1210]/80 leading-relaxed">
                {currentLang === 'en' 
                  ? "We reject 90% of bean micro-lots offered, taking only absolute world-class quality."
                  : "نرفض ٩٠٪ من الدفعات المقترحة علينا، لنستحوذ فقط على نخب النخبة عالمياً."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-dark-red text-gold rounded-full flex items-center justify-center mx-auto shadow-md">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-serif font-bold text-espresso text-lg">
                {currentLang === 'en' ? "Genuine Omani Hospitality" : "كرم ضيافة عماني دافئ"}
              </h4>
              <p className="text-xs text-[#1A1210]/80 leading-relaxed">
                {currentLang === 'en' 
                  ? "Our baristas greet you like family, whether inside our cozy lounge or at our speedy drive-thru window."
                  : "يرحب بك باريستاتنا كعائلتنا، سواءً اخترت جلستنا الدافئة أو ممر الدرايف ثرو السريع."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-dark-red text-gold rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-espresso text-lg">
                {currentLang === 'en' ? "Scientific Precision" : "دقة برمجية وعلمية"}
              </h4>
              <p className="text-xs text-[#1A1210]/80 leading-relaxed">
                {currentLang === 'en' 
                  ? "Every parameter—from 2700K lighting, biophilic indoor planting, to 93°C heat—is scientifically verified."
                  : "كل تفصيل في كافيه ٩٣—من طيف الإضاءة الدافئة، الشجر الطبيعي، إلى حرارة الماء—أثبته العلم."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
