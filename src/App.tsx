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
import ReservationsPage from './components/ReservationsPage';
import CartDrawer from './components/CartDrawer';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
        {activeTab === 'home' && (
          <div className="animate-fade-in">
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
        )}

        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <MenuPage 
              currentLang={currentLang}
              onAddToOrder={handleAddToOrder}
              addedItemIds={cartItems.map(c => c.item.id)}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <AboutPage 
              currentLang={currentLang}
            />
          </div>
        )}

        {activeTab === 'space' && (
          <div className="animate-fade-in">
            <SpacePage 
              currentLang={currentLang}
            />
          </div>
        )}

        {activeTab === 'gifting' && (
          <div className="animate-fade-in">
            <GiftingPage 
              currentLang={currentLang}
              onAddToCart={handleAddToOrder}
            />
          </div>
        )}

        {activeTab === 'reserve' && (
          <div className="animate-fade-in">
            <ReservationsPage
              currentLang={currentLang}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="animate-fade-in">
            <ContactPage 
              currentLang={currentLang}
            />
          </div>
        )}
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
}            <Ambience 
              currentLang={currentLang} 
            />
            <Locations 
              currentLang={currentLang} 
            />
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <MenuPage 
              currentLang={currentLang}
              onAddToOrder={handleAddToOrder}
              addedItemIds={cartItems.map(c => c.item.id)}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <AboutPage 
              currentLang={currentLang}
            />
          </div>
        )}

        {activeTab === 'space' && (
          <div className="animate-fade-in">
            <SpacePage 
              currentLang={currentLang}
            />
          </div>
        )}

        {activeTab === 'gifting' && (
          <div className="animate-fade-in">
            <GiftingPage 
              currentLang={currentLang}
              onAddToCart={handleAddToOrder}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="animate-fade-in">
            <ContactPage 
              currentLang={currentLang}
            />
          </div>
        )}
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
