import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, LogOut, Coffee, Calendar, MessageSquare, Briefcase, Settings, 
  Plus, Edit2, Trash2, Check, X, AlertCircle, Loader, Eye, ChevronDown, RefreshCw, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';
import { TRANSLATIONS, MENU_ITEMS } from '../data';

interface AdminDashboardProps {
  currentLang: 'en' | 'ar';
  onBackToSite: () => void;
}

export default function AdminDashboard({ currentLang, onBackToSite }: AdminDashboardProps) {
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active admin section
  const [activeTab, setActiveTab] = useState<'products' | 'reservations' | 'contacts' | 'corporate' | 'hours'>('products');

  // Core collections data state
  const [products, setProducts] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [corporate, setCorporate] = useState<any[]>([]);
  
  // Hours settings state
  const [hoursData, setHoursData] = useState({
    hoursWeekdaysEn: 'Weekdays: 6:00 AM – 12:00 AM',
    hoursWeekdaysAr: 'أيام الأسبوع: ٦:٠٠ صباحاً – ١٢:٠٠ منتصف الليل',
    hoursWeekendEn: 'Weekends: 7:00 AM – 1:00 AM',
    hoursWeekendAr: 'الويكند: ٧:٠٠ صباحاً – ١:٠٠ بعد منتصف الليل'
  });

  // Action states
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Product CRUD Modal/Form state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null); // null means adding a new product
  const [productForm, setProductForm] = useState({
    id: '',
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: 2.500,
    category: 'hot',
    image_url: '',
    in_stock: true
  });

  // Check and listen for session auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data for the active admin tab
  useEffect(() => {
    if (!session) return;
    
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'reservations') {
      fetchReservations();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'corporate') {
      fetchCorporateInquiries();
    } else if (activeTab === 'hours') {
      fetchHoursSettings();
    }
  }, [session, activeTab]);

  // Auth: Log in handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) throw error;
      setSession(data.session);
    } catch (err: any) {
      console.warn('Authentication error:', err);
      setAuthError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth: Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // 1. PRODUCTS MANAGEMENT
  const fetchProducts = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.warn('Error fetching products:', err);
      setActionError(`Could not fetch products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (productId: string, currentStock: boolean) => {
    setActionError(null);
    try {
      // Optimistic update
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, in_stock: !currentStock } : p));
      
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !currentStock })
        .eq('id', productId);
      
      if (error) throw error;
      showSuccess('Stock status updated successfully.');
    } catch (err: any) {
      console.warn('Error toggling stock:', err);
      setActionError(`Failed to update stock: ${err.message}`);
      // Revert optimistic update
      fetchProducts();
    }
  };

  const handleOpenProductForm = (product: any | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        id: product.id,
        name_en: product.name_en || '',
        name_ar: product.name_ar || '',
        description_en: product.description_en || '',
        description_ar: product.description_ar || '',
        price: Number(product.price),
        category: product.category || 'hot',
        image_url: product.image_url || '',
        in_stock: product.in_stock !== false
      });
    } else {
      setEditingProduct(null);
      // Generate a unique sequential-looking code
      const nextId = 'm-' + (products.length + 10);
      setProductForm({
        id: nextId,
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        price: 2.500,
        category: 'hot',
        image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
        in_stock: true
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setLoading(true);

    try {
      if (editingProduct) {
        // UPDATE
        const { error } = await supabase
          .from('products')
          .update({
            name_en: productForm.name_en,
            name_ar: productForm.name_ar,
            description_en: productForm.description_en,
            description_ar: productForm.description_ar,
            price: Number(productForm.price),
            category: productForm.category,
            image_url: productForm.image_url,
            in_stock: productForm.in_stock
          })
          .eq('id', productForm.id);

        if (error) throw error;
        showSuccess('Product updated successfully.');
      } else {
        // INSERT
        const { error } = await supabase
          .from('products')
          .insert([{
            id: productForm.id,
            name_en: productForm.name_en,
            name_ar: productForm.name_ar,
            description_en: productForm.description_en,
            description_ar: productForm.description_ar,
            price: Number(productForm.price),
            category: productForm.category,
            image_url: productForm.image_url,
            in_stock: productForm.in_stock
          }]);

        if (error) throw error;
        showSuccess('New product added successfully.');
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.warn('Error saving product:', err);
      setActionError(`Failed to save product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const confirmDelete = window.confirm(`Are you absolutely sure you want to delete "${productName}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    setActionError(null);
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      showSuccess(`"${productName}" has been deleted.`);
      fetchProducts();
    } catch (err: any) {
      console.warn('Error deleting product:', err);
      setActionError(`Failed to delete product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  // 2. RESERVATIONS MANAGEMENT
  const fetchReservations = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: false })
        .order('reservation_time', { ascending: false });
      if (error) throw error;
      setReservations(data || []);
    } catch (err: any) {
      console.warn('Error fetching reservations:', err);
      setActionError(`Could not fetch reservations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReservationStatus = async (id: string, newStatus: string) => {
    setActionError(null);
    try {
      // Optimistic update
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      showSuccess(`Reservation status updated to ${newStatus}.`);
    } catch (err: any) {
      console.warn('Error updating reservation status:', err);
      setActionError(`Failed to change status: ${err.message}`);
      fetchReservations();
    }
  };


  // 3. CONTACT MESSAGES
  const fetchContacts = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('id', { ascending: false }); // Usually has created_at or id serial
      if (error) throw error;
      setContacts(data || []);
    } catch (err: any) {
      console.warn('Error fetching contacts:', err);
      setActionError(`Could not fetch contact messages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  // 4. CORPORATE INQUIRIES
  const fetchCorporateInquiries = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const { data, error } = await supabase
        .from('corporate_inquiries')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setCorporate(data || []);
    } catch (err: any) {
      console.warn('Error fetching corporate inquiries:', err);
      setActionError(`Could not fetch corporate inquiries: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  // 5. SETTINGS: HOURS MANAGEMENT
  const fetchHoursSettings = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) {
        // Table settings might not exist yet; we'll handle gracefully
        throw error;
      }

      if (data && data.length > 0) {
        const hWeekdays = data.find((r: any) => r.key === 'hoursWeekdays');
        const hWeekend = data.find((r: any) => r.key === 'hoursWeekend');

        setHoursData({
          hoursWeekdaysEn: hWeekdays?.value_en || hoursData.hoursWeekdaysEn,
          hoursWeekdaysAr: hWeekdays?.value_ar || hoursData.hoursWeekdaysAr,
          hoursWeekendEn: hWeekend?.value_en || hoursData.hoursWeekendEn,
          hoursWeekendAr: hWeekend?.value_ar || hoursData.hoursWeekendAr,
        });
      }
    } catch (err: any) {
      console.warn('Error fetching settings (settings table might need creation):', err);
      // We will keep defaults and explain how to create the table
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setLoading(true);

    try {
      // We will perform upserts on the 'settings' table
      const upsertBatch = [
        { key: 'hoursWeekdays', value_en: hoursData.hoursWeekdaysEn, value_ar: hoursData.hoursWeekdaysAr },
        { key: 'hoursWeekend', value_en: hoursData.hoursWeekendEn, value_ar: hoursData.hoursWeekendAr }
      ];

      const { error } = await supabase
        .from('settings')
        .upsert(upsertBatch, { onConflict: 'key' });

      if (error) throw error;
      showSuccess('Operating hours updated successfully. Changes are now live on the customer site.');
      
      // Update local memory translations immediately for instant preview
      TRANSLATIONS.hoursWeekdays = { en: hoursData.hoursWeekdaysEn, ar: hoursData.hoursWeekdaysAr };
      TRANSLATIONS.hoursWeekend = { en: hoursData.hoursWeekendEn, ar: hoursData.hoursWeekendAr };

    } catch (err: any) {
      console.warn('Error saving hours to settings table:', err);
      setActionError(
        `Failed to save operating hours. Please make sure you created the 'settings' table as described in the help section below. Error: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper: Toast / temporary success feedback
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-espresso text-cream flex flex-col items-center justify-center gap-4">
        <Loader className="w-8 h-8 animate-spin text-gold" />
        <span className="text-sm font-mono tracking-widest text-gold/80">AUTHENTICATING SECURE PANEL...</span>
      </div>
    );
  }

  // --- RENDERING IF NOT LOGGED IN ---
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A1010] to-[#200404] text-cream flex items-center justify-center p-4">
        <div className="bg-[#2a0808]/80 border border-gold/25 backdrop-blur-xl rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-wine to-gold" />
          
          <div className="text-center mb-8">
            <span className="font-serif italic text-gold text-sm tracking-widest block mb-1">CAFÉ 93°</span>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-cream flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-gold" />
              <span>Back-Office</span>
            </h1>
            <p className="text-xs text-cream/60 mt-1">Authorized personnel and café management only</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gold mb-1.5 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                <input 
                  type="email" 
                  required
                  placeholder="manager@cafe93.com"
                  className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gold mb-1.5 font-bold">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-gold hover:bg-gold/90 disabled:bg-gold/50 text-espresso font-bold uppercase tracking-widest text-xs rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {authLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gold/10 flex justify-between items-center text-[11px] text-cream/40">
            <span>Secure TLS 1.3 Encryption</span>
            <button 
              onClick={onBackToSite}
              className="text-gold hover:underline cursor-pointer"
            >
              ← Back to Sanctuary Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING AUTHENTICATED ADMIN PANEL ---
  return (
    <div className="min-h-screen bg-[#1c0505] text-cream flex flex-col font-sans">
      
      {/* Admin Top Header Bar */}
      <header className="bg-[#2e0909] border-b border-gold/20 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gold text-espresso p-2 rounded-lg font-serif font-black text-xs tracking-wider">93°</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider uppercase text-cream">Owner Workstation</h1>
              <span className="bg-gold/10 text-gold border border-gold/20 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full">Secure Session</span>
            </div>
            <p className="text-[11px] text-cream/60">Manage menu items, operating schedules, and guest inquiries</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToSite}
            className="px-4 py-1.5 bg-espresso/50 border border-gold/10 rounded-lg hover:bg-espresso hover:border-gold/30 text-xs text-cream/80 hover:text-gold transition-all cursor-pointer"
          >
            ← View Website
          </button>
          <div className="h-6 w-px bg-gold/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cream/50 max-w-[120px] truncate hidden md:block">{session.user.email}</span>
            <button 
              onClick={handleSignOut}
              className="p-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 rounded-lg text-red-300 hover:text-red-100 transition-all cursor-pointer flex items-center gap-1 text-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-grow flex flex-col lg:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-[#230606] lg:border-r border-gold/10 p-4 space-y-1 shrink-0">
          <div className="text-[10px] uppercase font-bold tracking-widest text-gold/50 px-3 mb-3">Sections</div>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer text-sm ${
              activeTab === 'products' 
                ? 'bg-gold text-espresso font-bold shadow' 
                : 'text-cream/70 hover:bg-gold/10 hover:text-gold'
            }`}
          >
            <Coffee className="w-4 h-4 shrink-0" />
            <span>Products & Coffee Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer text-sm ${
              activeTab === 'reservations' 
                ? 'bg-gold text-espresso font-bold shadow' 
                : 'text-cream/70 hover:bg-gold/10 hover:text-gold'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Reservations Book</span>
            {reservations.length > 0 && (
              <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'reservations' ? 'bg-espresso text-gold' : 'bg-gold/20 text-gold'}`}>
                {reservations.filter(r => r.status === 'pending').length} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer text-sm ${
              activeTab === 'contacts' 
                ? 'bg-gold text-espresso font-bold shadow' 
                : 'text-cream/70 hover:bg-gold/10 hover:text-gold'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Concierge Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('corporate')}
            className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer text-sm ${
              activeTab === 'corporate' 
                ? 'bg-gold text-espresso font-bold shadow' 
                : 'text-cream/70 hover:bg-gold/10 hover:text-gold'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Corporate Events</span>
          </button>

          <button
            onClick={() => setActiveTab('hours')}
            className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer text-sm ${
              activeTab === 'hours' 
                ? 'bg-gold text-espresso font-bold shadow' 
                : 'text-cream/70 hover:bg-gold/10 hover:text-gold'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>Operating Hours Form</span>
          </button>
        </aside>

        {/* Content Workspace */}
        <main className="flex-grow p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Status Message center */}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-xs animate-fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {actionError && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Database Error</p>
                <p className="opacity-90">{actionError}</p>
              </div>
            </div>
          )}

          {/* TAB 1: PRODUCTS / COFFEE MENU */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-wide uppercase text-gold">Café Coffee & Desserts Menu</h2>
                  <p className="text-xs text-cream/60">Add, edit, or configure live product catalogs and immediate stock statuses.</p>
                </div>
                <button
                  onClick={() => handleOpenProductForm(null)}
                  className="px-4 py-2.5 bg-gold hover:bg-gold/90 text-espresso font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col justify-center items-center gap-3">
                  <Loader className="w-6 h-6 animate-spin text-gold" />
                  <span className="text-xs font-mono text-cream/50">RETRIEVING LIVE CATALOGUE...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center border border-gold/10 rounded-2xl bg-espresso/20">
                  <Coffee className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <h3 className="font-bold text-cream mb-1">No products found</h3>
                  <p className="text-xs text-cream/50 max-w-sm mx-auto">The database table is either empty or needs to be populated with the menu items schema.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gold/10 rounded-xl bg-espresso/20 shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#2a0808] border-b border-gold/10 text-gold uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-4 px-4">Item ID</th>
                        <th className="py-4 px-4">Visual</th>
                        <th className="py-4 px-4">Name (English / Arabic)</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Price (OMR)</th>
                        <th className="py-4 px-4 text-center">In Stock Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-gold/80">{p.id}</td>
                          <td className="py-4 px-4">
                            {p.image_url ? (
                              <img 
                                src={p.image_url} 
                                alt={p.name_en} 
                                className="w-10 h-10 object-cover rounded-lg border border-gold/10"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-espresso border border-gold/10 rounded-lg flex items-center justify-center text-[10px] text-cream/40">No photo</div>
                            )}
                          </td>
                          <td className="py-4 px-4 space-y-1">
                            <div className="font-bold text-cream text-sm">{p.name_en}</div>
                            <div className="text-gold/70 font-sans tracking-wide text-xs text-right ltr:text-left rtl:text-right" dir="rtl">{p.name_ar}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold/10 text-gold border border-gold/10">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-sm text-cream">{Number(p.price).toFixed(3)} OMR</td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleStock(p.id, p.in_stock)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                                p.in_stock 
                                  ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 hover:bg-emerald-500/20' 
                                  : 'bg-rose-500/10 border-rose-500/35 text-rose-400 hover:bg-rose-500/20'
                              }`}
                            >
                              {p.in_stock ? '● In Stock' : '○ Out of Stock'}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenProductForm(p)}
                              className="p-2 bg-gold/10 hover:bg-gold text-gold hover:text-espresso rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name_en)}
                              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RESERVATIONS BOOK */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-wide uppercase text-gold">Dining Reservations Log</h2>
                  <p className="text-xs text-cream/60">Verify real-time guest booking details and update table reservation state.</p>
                </div>
                <button
                  onClick={fetchReservations}
                  className="px-3.5 py-1.5 bg-espresso/50 border border-gold/10 hover:border-gold hover:bg-gold hover:text-espresso rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Book</span>
                </button>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col justify-center items-center gap-3">
                  <Loader className="w-6 h-6 animate-spin text-gold" />
                  <span className="text-xs font-mono text-cream/50">LOADING RESERVATION LEDGER...</span>
                </div>
              ) : reservations.length === 0 ? (
                <div className="py-16 text-center border border-gold/10 rounded-2xl bg-espresso/20">
                  <Calendar className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <h3 className="font-bold text-cream mb-1">No reservations booked</h3>
                  <p className="text-xs text-cream/50 max-w-sm mx-auto">Reservations submitted by guests on your website will appear here instantly.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gold/10 rounded-xl bg-espresso/20 shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#2a0808] border-b border-gold/10 text-gold uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-4 px-4">Guest Name</th>
                        <th className="py-4 px-4">Phone Number</th>
                        <th className="py-4 px-4">Date / Time</th>
                        <th className="py-4 px-4">Party Size</th>
                        <th className="py-4 px-4">Notes</th>
                        <th className="py-4 px-4 text-center">Status state</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {reservations.map((r) => (
                        <tr key={r.id} className="hover:bg-gold/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-cream text-sm">{r.customer_name}</div>
                          </td>
                          <td className="py-4 px-4 font-mono text-cream/80">{r.phone}</td>
                          <td className="py-4 px-4 font-mono text-cream">
                            <div>{r.reservation_date}</div>
                            <div className="text-[10px] text-gold/80">{r.reservation_time}</div>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-gold text-sm">{r.party_size} {r.party_size === 1 ? 'Guest' : 'Guests'}</td>
                          <td className="py-4 px-4 text-cream/75 max-w-xs truncate" title={r.notes || 'None'}>
                            {r.notes || <span className="text-cream/30 font-sans">No remarks</span>}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <select
                              value={r.status || 'pending'}
                              onChange={(e) => handleUpdateReservationStatus(r.id, e.target.value)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-gold border cursor-pointer transition-all ${
                                r.status === 'confirmed' 
                                  ? 'bg-emerald-950 border-emerald-500/45 text-emerald-400' 
                                  : r.status === 'cancelled'
                                    ? 'bg-rose-950 border-rose-500/45 text-rose-400'
                                    : 'bg-amber-950 border-amber-500/45 text-amber-400'
                              }`}
                            >
                              <option value="pending" className="bg-[#2a0808] text-amber-400 font-bold">Pending Approval</option>
                              <option value="confirmed" className="bg-[#2a0808] text-emerald-400 font-bold">Confirmed</option>
                              <option value="cancelled" className="bg-[#2a0808] text-rose-400 font-bold">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONCIERGE CONTACT MESSAGES */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-wide uppercase text-gold">Concierge Contacts Log</h2>
                <p className="text-xs text-cream/60">Read-only system list of messages submitted by guests via the contact form.</p>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col justify-center items-center gap-3">
                  <Loader className="w-6 h-6 animate-spin text-gold" />
                  <span className="text-xs font-mono text-cream/50">FETCHING VISITOR COMMUNICATIONS...</span>
                </div>
              ) : contacts.length === 0 ? (
                <div className="py-16 text-center border border-gold/10 rounded-2xl bg-espresso/20">
                  <MessageSquare className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <h3 className="font-bold text-cream mb-1">No messages recorded</h3>
                  <p className="text-xs text-cream/50 max-w-sm mx-auto">Guest inquiries and comments from the contact portal will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((msg) => (
                    <div 
                      key={msg.id} 
                      className="p-5 border border-gold/15 bg-espresso/20 hover:border-gold/30 rounded-xl space-y-3 transition-all relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-cream">{msg.name}</h3>
                            <span className="text-[10px] font-mono bg-gold/10 border border-gold/20 text-gold px-2 py-0.5 rounded-full">{msg.email}</span>
                          </div>
                          <p className="text-xs text-gold/80 font-bold uppercase tracking-widest mt-1">Subject: {msg.subject || 'None'}</p>
                        </div>
                        <span className="text-[10px] font-mono text-cream/40 self-end sm:self-start">Message ID: #{msg.id}</span>
                      </div>
                      
                      <div className="bg-[#220707]/60 border border-gold/5 p-4 rounded-lg text-xs leading-relaxed text-cream/85">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CORPORATE EVENTS */}
          {activeTab === 'corporate' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-wide uppercase text-gold">Corporate & Group Events Ledgers</h2>
                <p className="text-xs text-cream/60">Review bespoke corporate gatherings, luxury group inquiries, and bulk reservation proposals.</p>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col justify-center items-center gap-3">
                  <Loader className="w-6 h-6 animate-spin text-gold" />
                  <span className="text-xs font-mono text-cream/50">DOWNLOADING BESPOKE EVENT RESERVATIONS...</span>
                </div>
              ) : corporate.length === 0 ? (
                <div className="py-16 text-center border border-gold/10 rounded-2xl bg-espresso/20">
                  <Briefcase className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <h3 className="font-bold text-cream mb-1">No corporate inquiries</h3>
                  <p className="text-xs text-cream/50 max-w-sm mx-auto">Bespoke luxury events or team gathering inquiries will be listed here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {corporate.map((c) => (
                    <div 
                      key={c.id} 
                      className="p-6 border border-gold/15 bg-espresso/20 hover:border-gold/30 rounded-xl space-y-4 transition-all relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-gold/10 pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-cream">{c.name}</h3>
                            {c.company_name && (
                              <span className="bg-gold text-espresso font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                                {c.company_name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-cream/60 mt-1">
                            <span>Email: <span className="font-mono text-cream/80">{c.email}</span></span>
                            <span>Phone: <span className="font-mono text-cream/80">{c.phone}</span></span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-cream/40">Inquiry ID: #{c.id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-cream bg-[#250808]/40 border border-gold/5 p-3 rounded-lg">
                        <div>
                          <span className="text-[10px] text-gold uppercase tracking-wider block font-bold mb-0.5">Event Class</span>
                          <span className="text-cream/90">{c.event_type}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gold uppercase tracking-wider block font-bold mb-0.5">Planned Date</span>
                          <span className="text-cream/90">{c.event_date || 'TBD'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gold uppercase tracking-wider block font-bold mb-0.5">Guest Count</span>
                          <span className="text-cream/90 font-bold">{c.guests_count} Guests</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-gold uppercase tracking-widest font-bold block">Guest Coordinator Remarks</span>
                        <div className="bg-[#1e0404]/60 p-4 rounded-lg text-xs leading-relaxed text-cream/85">
                          {c.notes || <span className="text-cream/30 italic">No notes provided.</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HOURS SETTINGS */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-wide uppercase text-gold">Café Timings Configuration</h2>
                <p className="text-xs text-cream/60">Update the weekly operating schedules dynamically for both English and Arabic. Changes display live on the footer and maps panel.</p>
              </div>

              <div className="bg-espresso/20 border border-gold/15 rounded-2xl p-6 space-y-6">
                <form onSubmit={handleSaveHours} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weekdays English */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-widest text-gold font-bold">Weekdays Hours (English)</label>
                      <input 
                        type="text"
                        required
                        className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2.5 px-3 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-mono"
                        value={hoursData.hoursWeekdaysEn}
                        onChange={(e) => setHoursData({ ...hoursData, hoursWeekdaysEn: e.target.value })}
                        placeholder="Weekdays: 6:00 AM – 12:00 AM"
                      />
                    </div>

                    {/* Weekdays Arabic */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-widest text-gold font-bold text-right">أوقات العمل أيام الأسبوع (عربي)</label>
                      <input 
                        type="text"
                        required
                        dir="rtl"
                        className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2.5 px-3 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-sans"
                        value={hoursData.hoursWeekdaysAr}
                        onChange={(e) => setHoursData({ ...hoursData, hoursWeekdaysAr: e.target.value })}
                        placeholder="أيام الأسبوع: ٦:٠٠ صباحاً – ١٢:٠٠ منتصف الليل"
                      />
                    </div>

                    {/* Weekends English */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-widest text-gold font-bold">Weekends Hours (English)</label>
                      <input 
                        type="text"
                        required
                        className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2.5 px-3 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-mono"
                        value={hoursData.hoursWeekendEn}
                        onChange={(e) => setHoursData({ ...hoursData, hoursWeekendEn: e.target.value })}
                        placeholder="Weekends: 7:00 AM – 1:00 AM"
                      />
                    </div>

                    {/* Weekends Arabic */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-widest text-gold font-bold text-right">أوقات العمل الويكند (عربي)</label>
                      <input 
                        type="text"
                        required
                        dir="rtl"
                        className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2.5 px-3 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-sans"
                        value={hoursData.hoursWeekendAr}
                        onChange={(e) => setHoursData({ ...hoursData, hoursWeekendAr: e.target.value })}
                        placeholder="الويكند: ٧:٠٠ صباحاً – ١:٠٠ بعد منتصف الليل"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gold hover:bg-gold/90 disabled:bg-gold/50 text-espresso font-bold uppercase tracking-widest text-xs rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Publish New Timings</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Database instructions box */}
                <div className="bg-[#290707] border border-gold/10 p-5 rounded-xl space-y-3 text-xs leading-relaxed text-cream/70">
                  <h4 className="font-bold text-gold uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gold" />
                    <span>Supabase Administration Guide</span>
                  </h4>
                  <p>
                    By clicking <strong>"Publish New Timings"</strong>, the workstation automatically updates records in the <code>settings</code> table inside your Supabase project. If you haven't created the table yet, use the SQL instructions below in your Supabase SQL editor.
                  </p>
                  <p>
                    The client-facing landing page (e.g., location section and reservation form footer) instantly subscribes to and loads these values, replacing the default hardcoded times without requiring a developer update.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- CRUD PRODUCT EDIT/ADD MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#2d0909] border border-gold/25 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 text-cream/50 hover:text-gold p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gold uppercase tracking-wider">
                {editingProduct ? `Edit Product Details (${productForm.id})` : 'Introduce New Handcrafted Product'}
              </h3>
              <p className="text-xs text-cream/60">Configure bilingual translations, price in OMR, category routing, and imagery.</p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              {/* Product ID (Readonly on edit, insertable on create) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">Unique Code / ID</label>
                  <input 
                    type="text" 
                    required
                    disabled={editingProduct !== null}
                    className="w-full bg-espresso/60 border border-gold/20 disabled:bg-espresso/20 disabled:text-cream/50 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold font-mono"
                    value={productForm.id}
                    onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                    placeholder="e.g. m-13"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">Price (OMR)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    min="0"
                    required
                    className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold font-mono"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="2.500"
                  />
                </div>
              </div>

              {/* Product Category & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">Menu Category</label>
                  <select 
                    className="w-full bg-[#1e0404] border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold font-bold"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="hot">Hot Drinks</option>
                    <option value="cold">Cold Drinks</option>
                    <option value="desserts">Boutique Desserts</option>
                    <option value="gifting">Artisanal Gifting</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">In Stock Available</label>
                  <select 
                    className="w-full bg-[#1e0404] border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold font-bold"
                    value={productForm.in_stock ? 'true' : 'false'}
                    onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.value === 'true' })}
                  >
                    <option value="true">Yes, list immediately</option>
                    <option value="false">No, out of stock</option>
                  </select>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">Product Name (English)</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold"
                    value={productForm.name_en}
                    onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                    placeholder="e.g. Pistachio Matcha Latte"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold text-right">اسم المنتج (عربي)</label>
                  <input 
                    type="text" 
                    required
                    dir="rtl"
                    className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold"
                    value={productForm.name_ar}
                    onChange={(e) => setProductForm({ ...productForm, name_ar: e.target.value })}
                    placeholder="مثال: بستاشيو ماتشا لاتيه"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">Description (English)</label>
                  <textarea 
                    rows={2}
                    className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold"
                    value={productForm.description_en}
                    onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
                    placeholder="Describe flavour, ingredients, or infusion methods."
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold text-right">الوصف (عربي)</label>
                  <textarea 
                    rows={2}
                    dir="rtl"
                    className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold"
                    value={productForm.description_ar}
                    onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                    placeholder="اكتب تفاصيل النكهة أو المكونات أو طريقة التحضير."
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">Unsplash or CDN Image URL</label>
                <input 
                  type="url" 
                  className="w-full bg-espresso/60 border border-gold/20 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-gold font-mono"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-3 border-t border-gold/10 flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-espresso/80 hover:bg-espresso border border-gold/10 text-cream/75 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gold hover:bg-gold/90 text-espresso font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {loading ? (
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
