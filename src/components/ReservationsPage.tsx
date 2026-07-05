import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  Users,
  Sofa,
  Laptop,
  TreePine,
  PartyPopper,
  CheckCircle,
  Clock,
  Phone,
  User,
  CalendarPlus,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface ReservationsPageProps {
  currentLang: Language;
}

type SeatingPref = 'lounge' | 'workspace' | 'outdoor';
type Occasion = 'none' | 'birthday' | 'meeting' | 'anniversary';

// Generates 30-min slots between opening and closing hours.
// A handful are deterministically marked "full" to simulate real availability
// without needing a backend yet (this will be replaced by live Supabase data).
function buildTimeSlots(dateStr: string): { time: string; full: boolean }[] {
  const slots: { time: string; full: boolean }[] = [];
  const start = 8; // 8:00
  const end = 22; // 22:00 last slot
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed += dateStr.charCodeAt(i);

  for (let hour = start; hour <= end; hour++) {
    for (const minute of [0, 30]) {
      if (hour === end && minute === 30) continue;
      const label = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      const idx = hour * 2 + minute / 30;
      const full = (seed + idx) % 7 === 0; // pseudo-random but stable per date
      slots.push({ time: label, full });
    }
  }
  return slots;
}

export default function ReservationsPage({ currentLang }: ReservationsPageProps) {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [seating, setSeating] = useState<SeatingPref>('lounge');
  const [occasion, setOccasion] = useState<Occasion>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refCode, setRefCode] = useState('');

  const slots = useMemo(() => buildTimeSlots(date), [date]);

  const seatingOptions: { id: SeatingPref; icon: React.ElementType; label: string }[] = [
    { id: 'lounge', icon: Sofa, label: t('seatLounge') },
    { id: 'workspace', icon: Laptop, label: t('seatWorkspace') },
    { id: 'outdoor', icon: TreePine, label: t('seatOutdoor') },
  ];

  const occasionOptions: { id: Occasion; label: string }[] = [
    { id: 'none', label: t('occasionNone') },
    { id: 'birthday', label: t('occasionBirthday') },
    { id: 'meeting', label: t('occasionMeeting') },
    { id: 'anniversary', label: t('occasionAnniversary') },
  ];

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedTime(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;
    setIsSubmitting(true);

    // Simulated network delay — will become a real Supabase insert.
    setTimeout(() => {
      const code = `93-RES-${Math.floor(1000 + Math.random() * 9000)}`;
      setRefCode(code);
      setIsSubmitting(false);
      setConfirmed(true);
    }, 1800);
  };

  const resetForm = () => {
    setConfirmed(false);
    setSelectedTime(null);
    setPartySize(2);
    setSeating('lounge');
    setOccasion('none');
    setName('');
    setPhone('');
    setNotes('');
    setDate(today);
  };

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] bg-grain min-h-screen relative overflow-hidden">
      <div className="bg-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-posterama-regular text-lg tracking-widest block mb-2">
            {currentLang === 'en' ? 'RESERVE YOUR TABLE' : 'احجز طاولتك'}
          </span>
          <h1
            className={`text-4xl sm:text-6xl font-normal text-white mb-4 ${
              currentLang === 'ar' ? 'arabic' : 'font-display'
            }`}
          >
            {t('reservationsTitle')}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base">{t('reservationsSubtitle')}</p>
          <div className="w-24 h-0.5 bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left: Form Desk */}
          <div className="lg:col-span-7 bg-wine/30 border border-gold/15 p-6 sm:p-10 rounded-3xl glass-card">
            <div className="flex items-center gap-2.5 text-gold border-b border-gold/10 pb-4 mb-6">
              <CalendarDays className="w-5 h-5" />
              <h2 className="font-serif font-bold text-lg text-white">
                {t('reservationsFormHeader')}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {confirmed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-6"
                >
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <span className="absolute inset-0 bg-gold/10 rounded-full animate-ping" />
                    <div className="w-16 h-16 bg-[#EDE1CB] border border-[#C9A15A] ceramic-card flex items-center justify-center text-wine relative z-10 shadow-lg">
                      <CheckCircle className="w-8 h-8 text-wine" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-gold">
                      {t('reservationSuccess')}
                    </h3>
                    <p className="text-xs text-cream/70 leading-relaxed max-w-sm mx-auto">
                      {t('reservationSuccessSub')}
                    </p>
                  </div>

                  <div className="bg-[#1A1210] border border-gold/20 p-4 rounded-xl text-xs space-y-2 text-left rtl:text-right max-w-sm mx-auto">
                    <div className="flex justify-between border-b border-gold/5 pb-1">
                      <span className="text-cream/50">
                        {currentLang === 'en' ? 'Reference:' : 'رقم الحجز:'}
                      </span>
                      <span className="text-white font-mono font-bold">#{refCode}</span>
                    </div>
                    <div className="flex justify-between border-b border-gold/5 pb-1">
                      <span className="text-cream/50">{currentLang === 'en' ? 'Date:' : 'التاريخ:'}</span>
                      <span className="text-gold">{date} — {selectedTime}</span>
                    </div>
                    <div className="flex justify-between border-b border-gold/5 pb-1">
                      <span className="text-cream/50">{currentLang === 'en' ? 'Party size:' : 'عدد الأشخاص:'}</span>
                      <span className="text-white font-mono">{partySize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cream/50">{currentLang === 'en' ? 'Seating:' : 'المقعد:'}</span>
                      <span className="text-white">
                        {seatingOptions.find((s) => s.id === seating)?.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                    <button
                      type="button"
                      className="flex-1 py-3 bg-wine/50 hover:bg-wine/70 border border-gold/20 text-cream font-bold text-xs uppercase tracking-widest rounded-lg transition-luxury flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      {currentLang === 'en' ? 'Add to Calendar' : 'إضافة للتقويم'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3 bg-gold hover:bg-gold/90 text-espresso font-bold text-xs uppercase tracking-widest rounded-lg transition-luxury cursor-pointer"
                    >
                      {currentLang === 'en' ? 'Book Another' : 'حجز جديد'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {t('formReserveDate')}
                    </label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                    />
                  </div>

                  {/* Time slot grid */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gold uppercase flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {t('formReserveTime')}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={slot.full}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`px-2 py-2 text-[11px] font-mono rounded-lg border transition-luxury cursor-pointer ${
                            slot.full
                              ? 'border-gold/5 text-cream/20 bg-wine/10 cursor-not-allowed line-through'
                              : selectedTime === slot.time
                              ? 'bg-gold border-gold text-[#1A1210] font-bold shadow'
                              : 'border-gold/10 text-cream/80 bg-wine/20 hover:border-gold/30'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                    {!selectedTime && (
                      <p className="text-[10px] text-cream/40 pt-1">
                        {currentLang === 'en'
                          ? 'Grayed-out slots are fully booked.'
                          : 'الأوقات الباهتة محجوزة بالكامل.'}
                      </p>
                    )}
                  </div>

                  {/* Party size */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> {t('formPartySize')}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                        className="w-9 h-9 flex items-center justify-center text-gold bg-wine/60 border border-gold/10 hover:border-gold/30 rounded-lg cursor-pointer font-bold"
                      >
                        −
                      </button>
                      <span className="text-white font-mono font-bold w-8 text-center">
                        {partySize}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPartySize((p) => Math.min(12, p + 1))}
                        className="w-9 h-9 flex items-center justify-center text-gold bg-wine/60 border border-gold/10 hover:border-gold/30 rounded-lg cursor-pointer font-bold"
                      >
                        +
                      </button>
                      <span className="text-[10px] text-cream/50">
                        {currentLang === 'en' ? 'guests' : 'ضيوف'}
                      </span>
                    </div>
                  </div>

                  {/* Seating preference */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {t('formSeating')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {seatingOptions.map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSeating(id)}
                          className={`px-2 py-3 text-[11px] font-bold rounded-lg border transition-luxury flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            seating === id
                              ? 'bg-gold border-gold text-[#1A1210] shadow'
                              : 'border-gold/10 text-cream/80 bg-wine/20 hover:border-gold/30'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occasion */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gold uppercase flex items-center gap-1.5">
                      <PartyPopper className="w-3 h-3" /> {t('formOccasion')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {occasionOptions.map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setOccasion(id)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-full border transition-luxury cursor-pointer ${
                            occasion === id
                              ? 'bg-gold border-gold text-[#1A1210]'
                              : 'border-gold/10 text-cream/80 bg-wine/20 hover:border-gold/30'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gold/10">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase flex items-center gap-1.5">
                        <User className="w-3 h-3" /> {currentLang === 'en' ? 'Your Name' : 'الاسم'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gold uppercase flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {currentLang === 'en' ? 'WhatsApp No.' : 'رقم الواتساب'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+968 9xxx xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gold uppercase block">
                      {currentLang === 'en' ? 'Special Requests (optional)' : 'طلبات خاصة (اختياري)'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2.5 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedTime || isSubmitting}
                    className="w-full py-4 bg-gold hover:bg-gold/90 disabled:bg-gold/40 disabled:cursor-not-allowed text-espresso font-bold uppercase tracking-wider text-sm rounded-lg flex items-center justify-center gap-2 transition-luxury shadow-lg cursor-pointer mt-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? currentLang === 'en'
                          ? 'Confirming...'
                          : 'جارٍ التأكيد...'
                        : t('btnConfirmReservation')}
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Info panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-wine/40 border border-gold/10 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-white text-base">
                {currentLang === 'en' ? 'Reservation Policy' : 'سياسة الحجز'}
              </h3>
              <ul className="space-y-3 text-sm text-cream/80">
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>
                    {currentLang === 'en'
                      ? 'Tables are held for 15 minutes past your reserved time.'
                      : 'يتم الاحتفاظ بالطاولة لمدة ١٥ دقيقة بعد الموعد المحجوز.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>
                    {currentLang === 'en'
                      ? 'For parties of 8+, please call ahead for the best setup.'
                      : 'للمجموعات ٨ أشخاص فأكثر، يرجى التواصل معنا مسبقاً.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Laptop className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>
                    {currentLang === 'en'
                      ? 'Workspace-corner tables include power out? 'Workspace-corner tables include power outlets and fiber WiFi.'
