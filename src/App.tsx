import React, { useState, useEffect } from 'react';
import { Language, MenuItem, CartItem } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Storytelling from './components/Storytelling';
import Ambience from './components/Ambience';
import MenuTeaser from './components/MenuTeaser';
import Locations from './components/Locations';
import Footer from './components/Footer';
import MenuPage from './components/MenuPage';
import AboutPage from './components/AboutPage';
import SpacePage from './components/SpacePage';
import GiftingPage from './components/GiftingPage';
import ContactPage from './components/ContactPage';
import ReservationPage from './components/ReservationPage';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './lib/supabase';
import { TRANSLATIONS } from './data';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>(() => {
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    if (
      cleanPath === '/admin' || 
      window.location.hash === '#/admin' || 
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true')
    ) {
      return 'admin';
    }
    return 'home';
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync URL changes for back-office admin
  useEffect(() => {
    const handleUrlChange = () => {
      const cleanPath = window.location.pathname.replace(/\/$/, '');
      if (
        cleanPath === '/admin' || 
        window.location.hash === '#/admin' || 
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      ) {
        setActiveTab('admin');
      } else {
        if (cleanPath === '' || cleanPath === '/') {
          setActiveTab('home');
        }
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Programmatically update browser address bar when activeTab changes
  useEffect(() => {
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    if (activeTab === 'admin' && cleanPath !== '/admin') {
      window.history.pushState({}, '', '/admin');
    }
  }, [activeTab]);

  // Fetch dynamic hours from Supabase settings table if configured
  useEffect(() => {
    async function fetchLiveHours() {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        const isPlaceholder = !supabaseUrl || supabaseUrl.includes('your_supabase_project_url_here');
        if (isPlaceholder) return;

        const { data, error } = await supabase.from('settings').select('*');
        if (data && !error) {
          data.forEach((row: any) => {
            if (row.key === 'hoursWeekdays') {
              TRANSLATIONS.hoursWeekdays = {
                en: row.value_en || TRANSLATIONS.hoursWeekdays.en,
                ar: row.value_ar || TRANSLATIONS.hoursWeekdays.ar
              };
            }
            if (row.key === 'hoursWeekend') {
              TRANSLATIONS.hoursWeekend = {
                en: row.value_en || TRANSLATIONS.hoursWeekend.en,
                ar: row.value_ar || TRANSLATIONS.hoursWeekend.ar
              };
            }
          });
        }
      } catch (err) {
        console.warn('Error fetching dynamic timings, using fallback:', err);
      }
    }
    fetchLiveHours();
  }, []);

  // Sync RTL / HTML attributes when language changes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Set custom body font based on active language
    const body = document.body;
    if (currentLang === 'ar') {
      body.style.fontFamily = '"Noto Kufi Arabic", "Cairo", sans-serif';
    } else {
      body.style.fontFamily = '"Inter", sans-serif';
    }
  }, [currentLang]);

  // Scroll to top on page/tab navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Handle adding items to order list
  const handleAddToOrder = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.item.id === item.id);
      if (existing) {
        return prevItems.map((i) => 
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { item, quantity: 1 }];
    });
    // Trigger tiny premium sidebar opening to show feedback
    setIsCartOpen(true);
  };

  // Update item quantity inside drawer
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems.map((i) => {
        if (i.item.id === itemId) {
          const newQty = i.quantity + delta;
          return { ...i, quantity: newQty < 1 ? 1 : newQty };
        }
        return i;
      });
    });
  };

  // Remove individual item
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.item.id !== itemId));
  };

  // Clear cart complete
  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartTotalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  if (activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-[#1c0505]">
        <AdminDashboard 
          currentLang={currentLang} 
          onBackToSite={() => {
            const cleanPath = window.location.pathname.replace(/\/$/, '');
            if (cleanPath === '/admin') {
              window.history.replaceState({}, '', '/');
            } else if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
              window.location.hash = '';
            } else if (window.location.search.includes('admin=true')) {
              window.history.replaceState({}, '', '/');
            }
            setActiveTab('home');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-cream bg-gradient-to-b from-[#7A1F1F] to-[#4A1010] flex flex-col justify-between selection:bg-gold selection:text-espresso font-sans relative overflow-hidden">
      <div className="bg-pattern" />
      
      {/* 1. Global Sticky Glass-morphic Navbar */}
      <Navbar 
        currentLang={currentLang} 
        setLang={setCurrentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Main content switch-router */}
      <main className="flex-grow">
        <div className={activeTab === 'home' ? 'block animate-fade-in' : 'hidden'}>
          <Hero 
            currentLang={currentLang} 
            onNavigate={setActiveTab} 
          />
          <Storytelling 
            currentLang={currentLang} 
          />
          <MenuTeaser 
            currentLang={currentLang} 
            onNavigate={setActiveTab} 
            onAddToOrder={handleAddToOrder}
            addedItemIds={cartItems.map(c => c.item.id)}
          />
          <Ambience 
            currentLang={currentLang} 
          />
          <Locations 
            currentLang={currentLang} 
          />
        </div>

        <div className={activeTab === 'menu' ? 'block animate-fade-in' : 'hidden'}>
          <MenuPage 
            currentLang={currentLang}
            onAddToOrder={handleAddToOrder}
            addedItemIds={cartItems.map(c => c.item.id)}
          />
        </div>

        <div className={activeTab === 'about' ? 'block animate-fade-in' : 'hidden'}>
          <AboutPage 
            currentLang={currentLang}
          />
        </div>

        <div className={activeTab === 'space' ? 'block animate-fade-in' : 'hidden'}>
          <SpacePage 
            currentLang={currentLang}
          />
        </div>

        <div className={activeTab === 'gifting' ? 'block animate-fade-in' : 'hidden'}>
          <GiftingPage 
            currentLang={currentLang}
            onAddToCart={handleAddToOrder}
          />
        </div>

        <div className={activeTab === 'contact' ? 'block animate-fade-in' : 'hidden'}>
          <ContactPage 
            currentLang={currentLang}
          />
        </div>

        <div className={activeTab === 'reservations' ? 'block animate-fade-in' : 'hidden'}>
          <ReservationPage 
            currentLang={currentLang}
          />
        </div>
      </main>

      {/* 3. Global Premium Footer */}
      <Footer 
        currentLang={currentLang} 
        onNavigate={setActiveTab}
      />

      {/* 4. Slide-in checkout cart Drawer overlay */}
      <CartDrawer 
        currentLang={currentLang}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
