import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageSquare, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';
import { supabase } from '../lib/supabase';

interface ReservationPageProps {
  currentLang: Language;
}

export default function ReservationPage({ currentLang }: ReservationPageProps) {
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    notes: ''
  });

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Predefined luxury hours for booking
  const availableTimes = [
    "06:00 AM", "08:00 AM", "10:00 AM", "12:00 PM",
    "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const isPlaceholder = !supabaseUrl || supabaseUrl.includes('your_supabase_project_url_here');

      if (isPlaceholder) {
        throw new Error('Supabase project URL is not configured in your environment.');
      }

      const { error: insertErr } = await supabase
        .from('reservations')
        .insert([{
          customer_name: formData.customer_name,
          phone: formData.phone,
          reservation_date: formData.reservation_date,
          reservation_time: formData.reservation_time,
          party_size: Number(formData.party_size),
          status: 'pending',
          notes: formData.notes
        }]);

      if (insertErr) {
        throw insertErr;
      }

      setFormSubmitted(true);
      setFormData({
        customer_name: '',
        phone: '',
        reservation_date: '',
        reservation_time: '',
        party_size: 2,
        notes: ''
      });
    } catch (err: any) {
      console.error('Error creating reservation:', err);
      setError(
        currentLang === 'en'
          ? `Could not submit reservation: ${err.message || 'Network error'}`
          : `فشل إرسال طلب الحجز: ${err.message || 'خطأ في الشبكة'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] bg-grain min-h-screen relative overflow-hidden">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? "EXCLUSIVE LOUNGE BOOKING" : "حجز صالة كافيه ٩٣ الفاخرة"}
          </span>
          <h1 className={`text-4xl sm:text-6xl font-normal text-white mb-4 ${currentLang === 'ar' ? 'arabic' : 'font-display'}`}>
            {currentLang === 'en' ? "Table Booking Ritual" : "طقوس حجز الطاولات"}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base">
            {currentLang === 'en' 
              ? "Secure a peaceful biophilic study zone desk, a cozy reading corner, or a large family social space equipped with power outlets and high-speed fiber."
              : "احجز طاولة عمل مجهزة بمخارج طاقة وإنترنت ألياف بصرية فائق السرعة، أو زاوية مهدئة بجانب شجرة الزيتون، واستعد لتجربة تركيز لا تُنسى."}
          </p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Frame: Form Desk */}
          <div className="lg:col-span-7 bg-wine/30 border border-gold/15 p-6 sm:p-10 rounded-3xl glass-card">
            <div className="flex items-center gap-2.5 text-gold border-b border-gold/10 pb-4 mb-6">
              <Calendar className="w-5 h-5" />
              <h2 className="font-serif font-bold text-lg text-white">
                {currentLang === 'en' ? "Reservation Details" : "تفاصيل طلب الحجز الفاخر"}
              </h2>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-gold text-[#1A1210] rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="font-serif font-bold text-white text-xl">
                  {currentLang === 'en' ? "Reservation Logged Successfully" : "تم تسجيل حجزك بنجاح"}
                </h3>
                <p className="text-xs text-cream/70 max-w-sm mx-auto leading-relaxed">
                  {currentLang === 'en' 
                    ? "Your table reservation has been saved in our registry. Our lobby team will welcome you at your scheduled hour."
                    : "لقد تم حفظ حجز الطاولة الخاص بكم في سجلاتنا بنجاح. فريق كافيه ٩٣ بانتظار ترحيبكم في الموعد المحدد."}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 px-4 py-2 bg-transparent border border-gold/40 hover:border-gold text-gold rounded-lg text-xs font-mono transition-luxury cursor-pointer"
                >
                  {currentLang === 'en' ? "Book Another Table" : "حجز طاولة أخرى"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {currentLang === 'en' ? "Your Name" : "الاسم بالكامل"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={currentLang === 'en' ? "Enter your name" : "مثال: أحمد الحارثي"}
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {currentLang === 'en' ? "WhatsApp / Phone" : "رقم الهاتف / الواتساب"}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+968 9393 9393"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {currentLang === 'en' ? "Date of Reservation" : "تاريخ الحجز"}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.reservation_date}
                      onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {currentLang === 'en' ? "Time Slot" : "توقيت الحجز الفاخر"}
                    </label>
                    <select
                      required
                      value={formData.reservation_time}
                      onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    >
                      <option value="" disabled>{currentLang === 'en' ? "Select Time" : "اختر توقيتاً"}</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {currentLang === 'en' ? "Guests count" : "عدد الأشخاص الحاضرين"}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="12"
                      value={formData.party_size}
                      onChange={(e) => setFormData({ ...formData, party_size: parseInt(e.target.value) || 2 })}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gold uppercase block">
                    {currentLang === 'en' ? "Special Requests (Optional)" : "ملاحظات أو طلبات خاصة (اختياري)"}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={currentLang === 'en' ? "e.g., Quiet study nook, central olive tree zone, birthday setups..." : "مثال: زاوية هادئة للمذاكرة، جلسة قرب شجرة الزيتون الرئيسية..."}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gold hover:bg-gold/90 disabled:bg-gold/50 text-espresso font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-2 transition-luxury shadow-lg cursor-pointer"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{currentLang === 'en' ? "Confirm Table Reservation" : "تأكيد حجز الطاولة الآن"}</span>
                </button>

              </form>
            )}
          </div>

          {/* Right Frame: Spatial Wisdom & Features */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-wine/40 border border-gold/10 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-white text-base">
                {currentLang === 'en' ? "Booking & Spatial Policies" : "سياسات حجز الجلسات الفاخرة"}
              </h3>
              
              <div className="space-y-4 text-xs leading-relaxed text-cream/80">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{currentLang === 'en' ? "15-Minute Grace Period" : "فترة سماح تبلغ ١٥ دقيقة"}</span>
                    <span>{currentLang === 'en' ? "We hold reserved tables for up to 15 minutes before re-allocating." : "نحتفظ بالطاولة المحجوزة لمدة ١٥ دقيقة من الموعد قبل إعادة إتاحتها."}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{currentLang === 'en' ? "Study & Focus Desks" : "مكاتب الدراسة والتركيز الفردية"}</span>
                    <span>{currentLang === 'en' ? "Equipped with power points, warm 2700K lighting, and custom noise comfort." : "طاولات متكاملة بمنافذ كهربائية، إضاءة مدروسة بطيف ٢٧٠٠ك، وعزل صوتي مريح."}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{currentLang === 'en' ? "Large Events" : "الفعاليات الكبيرة والمجموعات"}</span>
                    <span>{currentLang === 'en' ? "For parties larger than 12, please use our Catering Gifting desk for private lounge rental." : "للحجوزات التي تفوق ١٢ شخصاً، يرجى ملء طلب الفعاليات في صفحة الإهداء."}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro aesthetic card with Omani Hospitality theme */}
            <div className="border border-gold/15 rounded-2xl p-5 bg-gradient-to-br from-[#1A1210] to-[#4A1010] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl" />
              <h4 className="font-serif text-sm font-bold text-gold mb-1">
                {currentLang === 'en' ? "The 93° Hospitality Promise" : "وعد كرم الضيافة عند ٩٣°"}
              </h4>
              <p className="text-[11px] text-cream/70 leading-relaxed font-mono">
                {currentLang === 'en'
                  ? "Every table reservation includes a complimentary double shot of cold-brewed rose-water infusion to ground your conversational focus."
                  : "جميع الحجوزات تتلقى فنجان ترحيبي فاخر بماء ورد الجبل الأخضر كبادرة تقدير لتأصيل تركيزك وصفائك الحسي."}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
