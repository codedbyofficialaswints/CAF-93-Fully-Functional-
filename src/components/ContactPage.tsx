import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface ContactPageProps {
  currentLang: Language;
}

export default function ContactPage({ currentLang }: ContactPageProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const faqs = [
    {
      q: { en: "What exactly is the 93° Coffee Standard?", ar: "ما هو معيار قهوة ٩٣° بالتحديد؟" },
      a: {
        en: "Water boiled to exactly 93°C extracts coffee's essential oils and bright notes without scorching or burning the ground beans, creating a clean, crisp, tension-free elixir.",
        ar: "الماء المستخلص عند حرارة ٩٣° مئوية بالضبط يسحب النوتات العطرية والزيوت الطيارة من حبوب البن الحصرية دون حرقها، لتذوق رشفة صافية ومثالية."
      }
    },
    {
      q: { en: "How fast is your Barka Drive-Thru lane?", ar: "ما مدى سرعة ممر الدرايف ثرو ببركاء؟" },
      a: {
        en: "Our custom dual-lane drive-thru serves hot drip and cold brews in under 90 seconds. Specialty desserts like Lavender Cake are handed over carefully in protective thermal packs.",
        ar: "ممر الدرايف ثرو ثنائي المسار لدينا يقدم القهوة الحارة والمثلجة الفاخرة في أقل من ٩٠ ثانية. الحلويات الفاخرة تُغلف بعناية فائقة في عبوات مخصصة."
      }
    },
    {
      q: { en: "Do you have working plugs at every table?", ar: "هل تتوفر مقابس شحن كهربائية عند كل طاولة؟" },
      a: {
        en: "Yes! Every single lounge table is equipped with high-speed charging points and we offer complimentary gigabit fiber WiFi, making our space the premier workspace in Barka.",
        ar: "بالتأكيد! صُممت صالتنا كمساحة عمل راقية؛ فكل طاولة مجهزة بمقابس طاقة مدمجة وإنترنت ألياف بصرية مجاني وفائق السرعة."
      }
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] bg-grain min-h-screen relative overflow-hidden">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "COFFEE CONCIERGE" : "مكتب التواصل المباشر"}
          </span>
          <h1 className={`text-4xl sm:text-6xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {currentLang === 'en' ? "Contact Our Team" : "اتصل بنا الآن"}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base">
            {currentLang === 'en' 
              ? "Have a corporate inquiry, wedding catering request, or general feedback? Route your thoughts directly to our Barka HQ baristas."
              : "لديك رغبة في حجز فعاليات شركات، طلب ضيافة أعراس فخمة، أو ملاحظة؟ أرسل رغبتك وسنتواصل معك فوراً."}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Frame: Form Desk */}
          <div className="lg:col-span-7 bg-wine/30 border border-gold/15 p-6 sm:p-10 rounded-3xl glass-card">
            <div className="flex items-center gap-2.5 text-gold border-b border-gold/10 pb-4 mb-6">
              <MessageSquare className="w-5 h-5" />
              <h2 className="font-serif font-bold text-lg text-white">
                {currentLang === 'en' ? "Direct Feedback Desk" : "مراسلة الإدارة الفورية"}
              </h2>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-gold text-[#1A1210] rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-bold text-white text-xl">
                  {currentLang === 'en' ? "Message Transmitted Successfully" : "تم إرسال رسالتك بسلام"}
                </h3>
                <p className="text-xs text-cream/70 max-w-sm mx-auto leading-relaxed">
                  {currentLang === 'en' 
                    ? "Your message #93-FEEDBACK has been saved. Our concierge team will reply via your email or phone in under 24 hours."
                    : "لقد تم استلام رسالتك رقم ٩٣-ملاحظات بنجاح. سنرد عليك في غضون ٢٤ ساعة عمل كأقصى حد."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gold uppercase block">Subject / Topic</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gold uppercase block">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold hover:bg-gold/90 text-espresso font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-2 transition-luxury shadow-lg cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? "Transmit Message" : "أرسل الرسالة الآن"}</span>
                </button>

              </form>
            )}
          </div>

          {/* Right Frame: Quick details & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Channels */}
            <div className="bg-wine/40 border border-gold/10 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-white text-base">
                {currentLang === 'en' ? "Corporate Details" : "تفاصيل المقر الرئيسي"}
              </h3>
              
              <div className="space-y-3 text-sm text-cream/80">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">WhatsApp hotline</span>
                    <span>+968 9393 9393</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Direct Email</span>
                    <span>concierge@cafe93.om</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Flagship Address</span>
                    <span>{t('addressDetail')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro FAQ Accordion */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-white text-base px-1">
                {currentLang === 'en' ? "Frequently Asked Questions" : "الأسئلة الشائعة حول كافيه ٩٣"}
              </h3>

              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div 
                      key={idx}
                      className="bg-wine/20 border border-gold/10 rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full p-4 flex items-center justify-between text-left rtl:text-right text-sm font-serif font-bold text-white hover:text-gold cursor-pointer"
                      >
                        <span className="pr-3">{faq.q[currentLang]}</span>
                        <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-cream/70 leading-relaxed font-mono border-t border-gold/5 pt-2 animate-fade-in">
                          {faq.a[currentLang]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
