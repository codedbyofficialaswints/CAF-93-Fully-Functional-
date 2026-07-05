import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, ChevronRight, CheckCircle, Car, Coffee, MapPin } from 'lucide-react';
import { Language, CartItem } from '../types';
import { TRANSLATIONS } from '../data';

interface CartDrawerProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  currentLang,
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [pickupMethod, setPickupMethod] = useState<'lounge' | 'drivethru'>('lounge');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'thawani'>('card');
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  if (!isOpen) return null;

  // Calculatings
  const subtotal = cartItems.reduce((acc, current) => acc + (current.item.price * current.quantity), 0);
  const localTax = subtotal * 0.05; // 5% municipal and luxury hospitality fee
  const grandTotal = subtotal + localTax;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsPaying(true);

    // Simulate luxury processing
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      onClearCart();
    }, 2500);
  };

  const closeAndReset = () => {
    onClose();
    // Reset checkout states after drawer completely closes
    setTimeout(() => {
      setPaymentSuccess(false);
      setCheckoutName('');
      setCheckoutPhone('');
      setPickupMethod('lounge');
      setPaymentMethod('card');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Dark Blur Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-filter backdrop-blur-sm transition-opacity"
        onClick={closeAndReset}
      />

      <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-dark-red bg-lattice bg-grain border-l rtl:border-l-0 rtl:border-r border-gold/15 shadow-2xl flex flex-col justify-between relative z-10">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-lg font-bold text-white">{t('cartTitle')}</h2>
            </div>
            
            <button 
              onClick={closeAndReset}
              className="p-2 text-cream/70 hover:text-gold rounded-full transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <AnimatePresence mode="wait">
              {paymentSuccess ? (
                
                /* PAYMENT SUCCESS STATE ANIMATION WITH COFFEE POURING INDICATOR */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-6"
                >
                  
                  {/* Animated espresso pouring cup icon */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    {/* Concentric rings pulsing */}
                    <span className="absolute inset-0 bg-gold/10 rounded-full animate-ping" />
                    
                    {/* Micro unglazed cup drawing pouring */}
                    <div className="w-16 h-16 bg-[#EDE1CB] border border-[#C9A15A] ceramic-card flex items-center justify-center text-wine relative z-10 shadow-lg">
                      <Coffee className="w-8 h-8 text-wine animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-gold">
                      {t('checkoutSuccess')}
                    </h3>
                    <p className="text-xs text-cream/70 leading-relaxed max-w-sm mx-auto">
                      {t('checkoutSuccessSub')}
                    </p>
                  </div>

                  {/* Order credentials */}
                  <div className="bg-[#1A1210] border border-gold/20 p-4 rounded-xl text-xs space-y-2 text-left rtl:text-right">
                    <div className="flex justify-between border-b border-gold/5 pb-1">
                      <span className="text-cream/50">Order ID:</span>
                      <span className="text-white font-mono font-bold">#93-0248</span>
                    </div>
                    <div className="flex justify-between border-b border-gold/5 pb-1">
                      <span className="text-cream/50">Pickup Channel:</span>
                      <span className="text-gold">
                        {pickupMethod === 'lounge' ? "Flagship Lounge" : "Drive-thru lane"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cream/50">Preparation Time:</span>
                      <span className="text-white font-mono">~ 4-6 mins</span>
                    </div>
                  </div>

                  <button
                    onClick={closeAndReset}
                    className="w-full py-3 bg-gold hover:bg-gold/90 text-espresso font-bold text-xs uppercase tracking-widest rounded-lg transition-luxury shadow cursor-pointer"
                  >
                    {currentLang === 'en' ? "Back to Sanctuary" : "العودة للموقع"}
                  </button>

                </motion.div>

              ) : cartItems.length === 0 ? (
                
                /* EMPTY STATE */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-wine/40 rounded-full flex items-center justify-center mx-auto text-gold/40 border border-gold/10">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-cream/60 font-mono text-sm">
                    {t('cartEmpty')}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gold/30 hover:border-gold text-gold rounded-md text-xs uppercase font-bold tracking-widest transition-luxury cursor-pointer"
                  >
                    {currentLang === 'en' ? "Discover Signatures" : "تصفح المشروبات الفاخرة"}
                  </button>
                </motion.div>

              ) : (

                /* CART ITEMS LISTING */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  
                  {/* Item Rows */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {cartItems.map(({ item, quantity }) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-3 bg-wine/30 border border-gold/10 rounded-xl"
                      >
                        {/* Miniature product thumb */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#EDE1CB] flex items-center justify-center text-[#1A1210] font-bold">
                          <img 
                            src={item.image} 
                            alt={item.name[currentLang]} 
                            className="w-full h-full object-cover saturate-[1.1]"
                          />
                        </div>

                        {/* Title & price detail */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-bold text-white truncate">
                            {item.name[currentLang]}
                          </h4>
                          <span className="text-[10px] font-mono text-gold">
                            {item.price.toFixed(3)} OMR
                          </span>
                        </div>

                        {/* Stepper adjustments */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-gold hover:text-white bg-wine/60 border border-gold/10 hover:border-gold/30 rounded cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          
                          <span className="text-xs font-bold text-white w-4 text-center">
                            {quantity}
                          </span>

                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-gold hover:text-white bg-wine/60 border border-gold/10 hover:border-gold/30 rounded cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-cream/40 hover:text-rose-400 cursor-pointer ml-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form for Customer details */}
                  <form onSubmit={handleCheckout} className="space-y-4 border-t border-gold/10 pt-4">
                    
                    {/* Segmented Pickup selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-gold uppercase block">{t('deliveryType')}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPickupMethod('lounge')}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-luxury flex items-center justify-center gap-1.5 cursor-pointer ${
                            pickupMethod === 'lounge'
                              ? 'bg-gold border-gold text-[#1A1210] shadow'
                              : 'border-gold/10 text-cream/80 bg-wine/20 hover:border-gold/30'
                          }`}
                        >
                          <Coffee className="w-3.5 h-3.5" />
                          <span>{t('pickupLounge')}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setPickupMethod('drivethru')}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-luxury flex items-center justify-center gap-1.5 cursor-pointer ${
                            pickupMethod === 'drivethru'
                              ? 'bg-gold border-gold text-[#1A1210] shadow'
                              : 'border-gold/10 text-cream/80 bg-wine/20 hover:border-gold/30'
                          }`}
                        >
                          <Car className="w-3.5 h-3.5" />
                          <span>{t('pickupDrivethru')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Customer Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gold uppercase block">Your Name</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gold uppercase block">WhatsApp No.</label>
                        <input
                          type="text"
                          required
                          placeholder="+968 9xxx xxxx"
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-dark-red/80 border border-gold/15 focus:border-gold outline-none rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Segmented Payment selection */}
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-mono text-gold uppercase block">{t('paymentTitle')}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-luxury flex items-center justify-center gap-1.5 cursor-pointer ${
                            paymentMethod === 'card'
                              ? 'bg-gold border-gold text-[#1A1210] shadow'
                              : 'border-gold/10 text-cream/80 bg-wine/20 hover:border-gold/30'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{t('paymentMada')}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('thawani')}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-luxury flex items-center justify-center gap-1.5 cursor-pointer ${
                            paymentMethod === 'thawani'
                              ? 'bg-gold border-gold text-[#1A1210] shadow'
                              : 'border-gold/10 text-cream/80 bg-wine/20 hover:border-gold/30'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5 animate-pulse" />
                          <span>{t('paymentThawani')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Pricing Sum Box */}
                    <div className="bg-[#1A1210] border border-gold/15 p-4 rounded-xl space-y-2 mt-4">
                      <div className="flex justify-between text-xs text-cream/70">
                        <span>{t('cartSubtotal')}</span>
                        <span className="font-mono">{subtotal.toFixed(3)} OMR</span>
                      </div>
                      <div className="flex justify-between text-xs text-cream/70">
                        <span>{t('cartTax')}</span>
                        <span className="font-mono">{localTax.toFixed(3)} OMR</span>
                      </div>
                      <div className="flex justify-between text-sm text-gold font-bold border-t border-gold/10 pt-2">
                        <span>{t('cartTotal')}</span>
                        <span className="font-mono">{grandTotal.toFixed(3)} OMR</span>
                      </div>
                    </div>

                    {/* Confirm & Pay trigger */}
                    <button
                      type="submit"
                      disabled={isPaying}
                      className="w-full py-4 bg-gold hover:bg-gold/90 disabled:bg-gold/50 text-espresso font-bold uppercase tracking-wider text-sm rounded-lg flex items-center justify-center gap-2 transition-luxury shadow-lg cursor-pointer mt-4"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {isPaying 
                          ? (currentLang === 'en' ? "Simulating Gateways..." : "الاتصال بالبوابة...") 
                          : t('btnPayNow')}
                      </span>
                    </button>

                  </form>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>

    </div>
  );
}
