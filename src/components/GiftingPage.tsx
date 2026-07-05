import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Send, CheckCircle, Mail, DollarSign, Award, Landmark, AlertCircle, Loader } from 'lucide-react';
import { Language, GiftCardConfig, CorporateInquiry } from '../types';
import { TRANSLATIONS } from '../data';
import { supabase } from '../lib/supabase';

interface GiftingPageProps {
  currentLang: Language;
  onAddToCart: (giftCardItem: any) => void;
}

export default function GiftingPage({ currentLang, onAddToCart }: GiftingPageProps) {
  // Gift card generator state
  const [cardConfig, setCardConfig] = useState<GiftCardConfig>({
    amount: 10.000,
    senderName: '',
    recipientName: '',
    recipientEmail: '',
    message: '',
    design: 'classic'
  });
  
  const [customAmount, setCustomAmount] = useState('');
  const [cardAddedToCart, setCardAddedToCart] = useState(false);

  // Corporate inquiry state
  const [inquiry, setInquiry] = useState<CorporateInquiry>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    eventType: 'coffee-cart',
    guestsCount: 50,
    eventDate: '',
    notes: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [corporateLoading, setCorporateLoading] = useState(false);
  const [corporateError, setCorporateError] = useState<string | null>(null);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const handleGiftCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a virtual menu item out of the gift card config to add to the cart drawer!
    const finalAmount = cardConfig.amount;
    const virtualItem = {
      id: `giftcard-${Date.now()}`,
      name: {
        en: `Digital Gift Card - ${cardConfig.recipientName}`,
        ar: `بطاقة إهداء رقمية - لـ ${cardConfig.recipientName}`
      },
      description: {
        en: `Value: ${finalAmount.toFixed(3)} OMR. Message: "${cardConfig.message || 'Enjoy happiness'}"`,
        ar: `القيمة: ${finalAmount.toFixed(3)} ريال. الرسالة: "${cardConfig.message || 'أتمنى لك السعادة'}"`
      },
      price: finalAmount,
      category: 'gifting' as const,
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600"
    };

    onAddToCart(virtualItem);
    setCardAddedToCart(true);

    setTimeout(() => {
      setCardAddedToCart(false);
      setCardConfig({
        amount: 10.000,
        senderName: '',
        recipientName: '',
        recipientEmail: '',
        message: '',
        design: 'classic'
      });
      setCustomAmount('');
    }, 3000);
  };

  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCorporateLoading(true);
    setCorporateError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const isPlaceholder = !supabaseUrl || supabaseUrl.includes('your_supabase_project_url_here');

      if (isPlaceholder) {
        throw new Error('Supabase project URL is not configured.');
      }

      const { error: insertErr } = await supabase
        .from('corporate_inquiries')
        .insert([{
          name: inquiry.name,
          company_name: inquiry.companyName,
          email: inquiry.email,
          phone: inquiry.phone,
          event_type: inquiry.eventType,
          guests_count: Number(inquiry.guestsCount),
          event_date: inquiry.eventDate,
          notes: inquiry.notes
        }]);

      if (insertErr) {
        throw insertErr;
      }

      setInquirySubmitted(true);
      setInquiry({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        eventType: 'coffee-cart',
        guestsCount: 50,
        eventDate: '',
        notes: ''
      });
      setTimeout(() => {
        setInquirySubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.warn('Error submitting corporate inquiry:', err);
      setCorporateError(
        currentLang === 'en'
          ? `Could not submit inquiry: ${err.message || 'Network error'}`
          : `فشل تقديم طلب الفعالية: ${err.message || 'خطأ في الشبكة'}`
      );
    } finally {
      setCorporateLoading(false);
    }
  };

  const handleAmountSelect = (val: number) => {
    setCardConfig({ ...cardConfig, amount: val });
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCustomAmount(e.target.value);
    if (!isNaN(val) && val > 0) {
      setCardConfig({ ...cardConfig, amount: val });
    }
  };

  // CSS templates for the 3D gift card preview
  const cardDesigns = {
    classic: {
      bg: "bg-gradient-to-br from-[#7A1F1F] via-[#4A1010] to-[#1A1210]",
      border: "border-gold/30",
      accent: "text-gold",
      stamp: "bg-gold/10 border-gold/40 text-gold",
      latticeOpacity: "opacity-10"
    },
    heritage: {
      bg: "bg-gradient-to-br from-[#B5502E] via-[#7A1F1F] to-[#4A1010]",
      border: "border-gold/40",
      accent: "text-gold",
      stamp: "bg-gold/25 border-gold/50 text-white",
      latticeOpacity: "opacity-20"
    },
    golden: {
      bg: "bg-gradient-to-br from-[#EDE1CB] via-[#FFF8EB] to-[#EDE1CB]",
      border: "border-[#C9A15A]",
      accent: "text-[#6B4226]",
      stamp: "bg-[#6B4226]/10 border-[#6B4226]/30 text-[#6B4226]",
      latticeOpacity: "opacity-5"
    }
  };

  const currentDesign = cardDesigns[cardConfig.design];

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] bg-grain min-h-screen relative overflow-hidden">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "PREMIUM SHARING" : "الإهداء والتقدير"}
          </span>
          <h1 className={`text-4xl sm:text-6xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {t('giftingTitle')}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base">
            {t('giftingSubtitle')}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        {/* 1. Digital Gift Card Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-24">
          
          {/* Card Customization Form (Left) */}
          <div className="lg:col-span-7 bg-wine/30 border border-gold/15 p-6 sm:p-10 rounded-3xl glass-card flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6 border-b border-gold/10 pb-4">
              <Gift className="w-6 h-6 text-gold" />
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-white">{t('giftCardHeader')}</h2>
                <p className="text-xs text-cream/70">{t('giftCardSubtitle')}</p>
              </div>
            </div>

            <form onSubmit={handleGiftCardSubmit} className="space-y-6">
              
              {/* Preset Amounts */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase tracking-wider block">{t('formAmount')}</label>
                <div className="flex flex-wrap gap-2">
                  {[5.000, 10.000, 20.000, 50.000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={`px-4 py-2 text-sm font-bold rounded-lg border transition-luxury cursor-pointer ${
                        cardConfig.amount === preset && !customAmount
                          ? 'bg-gold border-gold text-espresso shadow-md'
                          : 'border-gold/10 text-cream bg-wine/30 hover:border-gold/40'
                      }`}
                    >
                      {preset.toFixed(3)} OMR
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.1"
                    placeholder={currentLang === 'en' ? "Custom value..." : "مبلغ مخصص..."}
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-32 px-3 py-2 bg-dark-red/80 border border-gold/10 hover:border-gold/30 rounded-lg text-xs text-white placeholder-cream/40"
                  />
                </div>
              </div>

              {/* Names Input Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase block">{t('formRecipientName')}</label>
                  <input
                    type="text"
                    required
                    placeholder={currentLang === 'en' ? "e.g. Salim Al Omani" : "مثال: سالم العماني"}
                    value={cardConfig.recipientName}
                    onChange={(e) => setCardConfig({ ...cardConfig, recipientName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-sm text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase block">{t('formSenderName')}</label>
                  <input
                    type="text"
                    required
                    placeholder={currentLang === 'en' ? "e.g. Asad" : "مثال: أسعد"}
                    value={cardConfig.senderName}
                    onChange={(e) => setCardConfig({ ...cardConfig, senderName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              {/* Recipient Email */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase block">{t('formRecipientEmail')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                  <input
                    type="email"
                    required
                    placeholder="recipient@domain.om"
                    value={cardConfig.recipientEmail}
                    onChange={(e) => setCardConfig({ ...cardConfig, recipientEmail: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              {/* Bilingual Message */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase block">{t('formMessage')}</label>
                <textarea
                  rows={3}
                  placeholder={currentLang === 'en' ? "Write a warm greeting or focus wishes..." : "اكتب كلمات تهنئة دافئة أو أمنيات صادقة..."}
                  value={cardConfig.message}
                  onChange={(e) => setCardConfig({ ...cardConfig, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-sm text-white resize-none"
                />
              </div>

              {/* Design Selectors */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase tracking-wider block">{t('formDesign')}</label>
                <div className="flex gap-4">
                  {(['classic', 'heritage', 'golden'] as const).map((design) => (
                    <button
                      key={design}
                      type="button"
                      onClick={() => setCardConfig({ ...cardConfig, design })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border uppercase tracking-wider transition-luxury cursor-pointer ${
                        cardConfig.design === design
                          ? 'bg-gold border-gold text-espresso shadow-md'
                          : 'border-gold/10 text-cream/70 bg-wine/20 hover:border-gold/30'
                      }`}
                    >
                      {design}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to order action */}
              {cardAddedToCart ? (
                <div className="flex items-center gap-2 text-gold font-bold text-sm bg-wine/50 border border-gold/20 p-4 rounded-lg animate-fade-in mt-6">
                  <CheckCircle className="w-5 h-5" />
                  <span>{currentLang === 'en' ? "Gift Card loaded into your stoneware cup!" : "تم تحميل بطاقة الهدية في كوبك الفخاري!"}</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 bg-gold hover:bg-gold/90 text-espresso font-bold uppercase tracking-wider text-sm rounded-lg flex items-center justify-center gap-2 transition-luxury shadow-lg cursor-pointer mt-6"
                >
                  <Gift className="w-4 h-4" />
                  <span>{t('btnGenerateCard')}</span>
                </button>
              )}

            </form>
          </div>

          {/* Interactive Card Mockup Preview (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center">
            
            {/* 3D-Tilt Container */}
            <div 
              className="relative w-full max-w-[380px] aspect-[1.58/1] rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden border border-gold/15 transition-all duration-300 group"
              style={{
                boxShadow: '0 30px 60px rgba(0,0,0,0.7)'
              }}
            >
              {/* Dynamic Design background styled */}
              <div className={`absolute inset-0 ${currentDesign.bg} transition-colors duration-500 z-0`} />
              
              {/* Animated repeating Islamic lattice layer */}
              <div className={`absolute inset-0 bg-lattice ${currentDesign.latticeOpacity} transition-opacity z-0`} />
              
              {/* Noise grain */}
              <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none z-0" />

              {/* Card Header details */}
              <div className="relative z-10 flex items-center justify-between border-b border-gold/10 pb-3">
                <div className="flex flex-col">
                  <span className={`font-serif text-lg font-black tracking-tight ${currentDesign.accent}`}>
                    CAFÉ 93<sup className="text-xs font-normal">°</sup>
                  </span>
                  <span className="text-[7px] font-mono text-cream/50 uppercase tracking-widest leading-none">
                    {currentLang === 'en' ? "ELIXIR OF HAPPINESS" : "إكسير السعادة"}
                  </span>
                </div>

                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold font-serif text-[10px] ${currentDesign.stamp}`}>
                  93°
                </div>
              </div>

              {/* Greeting & Message Content */}
              <div className="relative z-10 py-2 space-y-1 text-center min-h-[60px] flex flex-col justify-center">
                {cardConfig.message ? (
                  <p className={`text-xs leading-relaxed font-posterama-regular max-h-[50px] overflow-hidden ${cardConfig.design === 'golden' ? 'text-[#1A1210]' : 'text-cream'}`}>
                    "{cardConfig.message}"
                  </p>
                ) : (
                  <p className="text-[10px] text-cream/40 font-mono">
                    {currentLang === 'en' ? "(Your custom message will display here)" : "(رسالتك الخاصة ستظهر في هذا المكان)"}
                  </p>
                )}
              </div>

              {/* Card Footer details */}
              <div className="relative z-10 flex items-end justify-between pt-3 border-t border-gold/10">
                <div className="flex flex-col text-left rtl:text-right">
                  <span className="text-[8px] font-mono text-cream/40 uppercase block leading-none">RECIPIENT</span>
                  <span className={`text-xs font-bold font-serif truncate max-w-[120px] ${cardConfig.design === 'golden' ? 'text-[#1A1210]' : 'text-white'}`}>
                    {cardConfig.recipientName || (currentLang === 'en' ? "BELOVED ONE" : "محبوبك")}
                  </span>
                  {cardConfig.senderName && (
                    <span className="text-[8px] text-cream/50 mt-1">
                      {currentLang === 'en' ? "From: " : "من: "}{cardConfig.senderName}
                    </span>
                  )}
                </div>

                <div className="text-right rtl:text-left flex flex-col items-end">
                  <span className="text-[8px] font-mono text-cream/40 uppercase block leading-none">CARD VALUE</span>
                  <span className={`text-lg font-serif font-black ${currentDesign.accent}`}>
                    {cardConfig.amount.toFixed(3)} OMR
                  </span>
                </div>
              </div>

            </div>

            {/* Instruction footnote */}
            <p className="text-xs text-cream/50 font-mono mt-4 text-center max-w-[280px]">
              {currentLang === 'en' 
                ? "💡 Move cursor over card or custom styles to test themes in real-time."
                : "💡 غيّر المظهر لتشاهد انسياب الألوان والتصاميم الراقية فوراً."}
            </p>

          </div>

        </div>

        {/* 2. Corporate Inquiry Section */}
        <div className="bg-[#1A1210] border border-gold/25 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Corporate Info details (Left) */}
            <div className="lg:w-50% space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-xs font-mono">
                <Award className="w-4 h-4 text-gold animate-bounce" />
                <span>93° CORPORATE & CATERING STANDARDS</span>
              </div>

              <h3 className="text-3xl font-serif font-bold text-white leading-tight">
                {t('corporateInquiryHeader')}
              </h3>
              
              <p className="text-xs sm:text-sm text-cream/70 leading-relaxed">
                {t('corporateSubtitle')}
              </p>

              <div className="space-y-4 pt-4 text-sm text-cream/80">
                <p className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-gold/25 rounded flex items-center justify-center font-bold text-[10px] text-gold mt-0.5">1</span>
                  <span>{currentLang === 'en' ? "Custom mobile coffee espresso bars for offices and weddings." : "عربات قهوة متحركة فاخرة للمكاتب والأعراس الفخمة ببركاء."}</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-gold/25 rounded flex items-center justify-center font-bold text-[10px] text-gold mt-0.5">2</span>
                  <span>{currentLang === 'en' ? "Bespoke corporate packages ofSnickers & Lavender signature cakes." : "مجموعات كيك السنيكرز واللافندر الفاخرة للتهاني والاحتفالات."}</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-gold/25 rounded flex items-center justify-center font-bold text-[10px] text-gold mt-0.5">3</span>
                  <span>{currentLang === 'en' ? "Certified world-class baristas with Omani authentic welcoming etiquette." : "باريستات محترفين مدربين على كرم الضيافة وبمظهر رسمي أنيق."}</span>
                </p>
              </div>
            </div>

            {/* Corporate Inquiry Form (Right) */}
            <div className="lg:w-50% w-full bg-wine/30 border border-gold/10 p-6 sm:p-8 rounded-2xl">
              {inquirySubmitted ? (
                <div className="text-center py-10 space-y-4 animate-scale-up">
                  <div className="w-16 h-16 bg-gold text-[#1A1210] rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-xl">
                    {currentLang === 'en' ? "Catering Inquiry Logged Successfully" : "تم استلام طلب الضيافة بنجاح"}
                  </h4>
                  <p className="text-xs text-cream/70 max-w-sm mx-auto leading-relaxed">
                    {currentLang === 'en' 
                      ? "Order reference #93-EVENT has been routed to our event director. We will contact you via WhatsApp in under 2 hours."
                      : "تم توجيه طلبك رقم ٩٣-فعاليات لمدير التنسيق بكافيه ٩٣. سنتواصل معك عبر الواتساب في أقل من ساعتين."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCorporateSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={inquiry.name}
                        onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase block">{t('formCompanyName')}</label>
                      <input
                        type="text"
                        value={inquiry.companyName}
                        onChange={(e) => setInquiry({ ...inquiry, companyName: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={inquiry.email}
                        onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase block">{t('formPhone')}</label>
                      <input
                        type="text"
                        required
                        placeholder="+968 9393 9393"
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase block">{t('formEventType')}</label>
                      <select
                        value={inquiry.eventType}
                        onChange={(e) => setInquiry({ ...inquiry, eventType: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      >
                        <option value="coffee-cart">{currentLang === 'en' ? "Coffee Cart Hire" : "عربة إسبريسو متنقلة"}</option>
                        <option value="private-hire">{currentLang === 'en' ? "Lounge Private Hire" : "حجز صالة خاصة ببركاء"}</option>
                        <option value="catering">{currentLang === 'en' ? "Bulk Pastry & Coffee" : "طلبيات كيك وحلويات ضخمة"}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase block">{t('formGuests')}</label>
                      <input
                        type="number"
                        required
                        min="10"
                        value={inquiry.guestsCount}
                        onChange={(e) => setInquiry({ ...inquiry, guestsCount: parseInt(e.target.value) || 10 })}
                        className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase block">{t('formDate')}</label>
                      <input
                        type="date"
                        required
                        value={inquiry.eventDate}
                        onChange={(e) => setInquiry({ ...inquiry, eventDate: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">{t('formNotes')}</label>
                    <textarea
                      rows={2}
                      value={inquiry.notes}
                      onChange={(e) => setInquiry({ ...inquiry, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white resize-none"
                    />
                  </div>

                  {corporateError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{corporateError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={corporateLoading}
                    className="w-full py-3 bg-wine border border-gold/30 hover:border-gold hover:bg-gold hover:text-espresso disabled:bg-wine/40 disabled:border-gold/10 font-bold uppercase tracking-wider text-xs rounded-lg transition-luxury shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    {corporateLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{t('btnSubmitInquiry')}</span>
                  </button>

                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
