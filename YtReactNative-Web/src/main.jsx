import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  Bell,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  EyeOff,
  Home,
  Layers,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  TrendingDown,
  User,
  X,
} from 'lucide-react';
import './styles.css';

// Initial Store Items from Mobile App (HomeScreen.jsx)
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Wheat',
    stock: 5,
    unit: 'kg',
    category: 'Grains & Cereals',
    storageBin: 'Bin A-1',
    image:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    description: 'test',
  },
  {
    id: 2,
    name: 'Bread',
    stock: 35,
    unit: 'kg',
    category: 'Bakery',
    storageBin: 'Bin B-3',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description:
      'Fresh sandwich bread loaves, delivered daily from the bakery.',
  },
  {
    id: 3,
    name: 'Rice',
    stock: 15,
    unit: 'kg',
    category: 'Grains & Cereals',
    storageBin: 'Bin A-2',
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Clean medium white rice bags kept in dry storage.',
  },
  {
    id: 4,
    name: 'Basmati Rice',
    stock: 25,
    unit: 'kg',
    category: 'Grains & Cereals',
    storageBin: 'Bin A-4',
    image:
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80',
    description:
      'Long grain aromatic basmati rice for biryani and special meals.',
  },
  {
    id: 5,
    name: 'Pulse',
    stock: 50,
    unit: 'kg',
    category: 'Pulses & Lentils',
    storageBin: 'Bin C-1',
    image:
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    description: 'Yellow lentils (dal) clean and packed for kitchen daily use.',
  },
  {
    id: 6,
    name: 'Corn',
    stock: 19,
    unit: 'kg',
    category: 'Grains & Cereals',
    storageBin: 'Bin A-5',
    image:
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    description:
      'Clean dried yellow corn grains, ready for food prep and snacks.',
  },
];

const CATEGORIES = [
  'All',
  'Low Stock',
  'Grains & Cereals',
  'Bakery',
  'Pulses & Lentils',
  'General Grocery',
];

const STORE_BANNER_URL =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80';

// Fallback photo helper
function getFallbackImage(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('wheat'))
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80';
  if (n.includes('bread'))
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
  if (n.includes('basmati'))
    return 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80';
  if (n.includes('rice'))
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
  if (n.includes('pulse') || n.includes('dal'))
    return 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80';
  if (n.includes('corn'))
    return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
}

function App() {
  // Theme state
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('yt_theme') !== 'light';
  });

  // App Navigation Pages: 'store' | 'search' | 'alerts' | 'profile' | 'settings'
  const [currentPage, setCurrentPage] = useState('store');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication: null (logged out) or user object
  const [user, setUser] = useState({
    name: 'Deepak Kumar',
    email: 'deepak.kumar2_mca23@gla.ac.in',
    role: 'Store Manager',
  });

  // Auth Screen Modal: null | 'login' | 'register' | 'forgot_email' | 'forgot_password' | 'forgot_success'
  const [authModal, setAuthModal] = useState(null);

  // Store Items List
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Sync theme to HTML root
  useEffect(() => {
    localStorage.setItem('yt_theme', dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  // Press Ctrl+K to jump to search bar
  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('topbar-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate simple numbers
  const lowStockItems = useMemo(
    () => products.filter(p => Number(p.stock) < 20),
    [products],
  );
  const totalStockKg = useMemo(
    () => products.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0),
    [products],
  );

  // Filter items based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.storageBin || '').toLowerCase().includes(q) ||
        String(item.id).includes(q);

      if (!matchesSearch) return false;

      if (activeCategory === 'Low Stock') {
        return Number(item.stock) < 20;
      }
      if (activeCategory !== 'All') {
        return item.category.toLowerCase() === activeCategory.toLowerCase();
      }
      return true;
    });
  }, [products, searchQuery, activeCategory]);

  // Save new item or edits
  const handleSaveItem = itemData => {
    if (editingItem) {
      setProducts(prev =>
        prev.map(p => (p.id === editingItem.id ? { ...p, ...itemData } : p)),
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...itemData,
        unit: 'kg',
        storageBin: itemData.storageBin || 'Bin A-1',
        image: itemData.image || getFallbackImage(itemData.name),
        description: itemData.description || 'Grocery stock item.',
      };
      setProducts(prev => [newItem, ...prev]);
    }
    setItemModalOpen(false);
    setEditingItem(null);
  };

  // Remove an item
  const handleDeleteItem = id => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Quick Restock button (+25 kg)
  const handleRestock = (id, amountKg = 25) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, stock: Number(p.stock) + amountKg } : p,
      ),
    );
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('store');
  };

  return (
    <div className={`app ${dark ? 'dark' : 'light'}`}>
      {/* ======================================================== */}
      {/* 1. TOP HEADER BAR                                        */}
      {/* ======================================================== */}
      <header className="topbar">
        <div className="brand-wrap">
          <button
            className="icon-btn mobile-only"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div
            className="brand"
            onClick={() => {
              setCurrentPage('store');
              setActiveCategory('All');
              setSearchQuery('');
            }}
          >
            <span className="brand-mark">
              <Package size={18} />
            </span>
            <div className="brand-text">
              <span className="brand-title">
                Yt<span>React</span>Native
              </span>
              <span className="brand-sub">Store &amp; Stock</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="searchbar">
          <Search size={18} />
          <input
            id="topbar-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, or bin..."
          />
          {searchQuery ? (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={15} />
            </button>
          ) : (
            <kbd>Ctrl K</kbd>
          )}
        </div>

        {/* Right buttons */}
        <div className="top-actions">
          <button
            className="icon-btn"
            onClick={() => setDark(v => !v)}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            className="icon-btn"
            onClick={() => {
              setCurrentPage('alerts');
              setActiveCategory('Low Stock');
            }}
            title={`${lowStockItems.length} items low on stock`}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {lowStockItems.length > 0 && <span className="notification-dot" />}
          </button>

          {user ? (
            <button
              className="profile-chip"
              onClick={() => setCurrentPage('profile')}
              title={`Logged in as ${user.name}`}
            >
              <div className="avatar-circle">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="profile-name">{user.name.split(' ')[0]}</span>
              <ChevronDown size={14} />
            </button>
          ) : (
            <button
              className="primary compact"
              onClick={() => setAuthModal('login')}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SIDEBAR + MAIN PAGE                                   */}
      {/* ======================================================== */}
      <div className="layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-scroll">
            <div className="nav-section">
              <p className="section-label">Main Menu</p>
              <button
                className={`nav-item ${
                  currentPage === 'store' && activeCategory !== 'Low Stock'
                    ? 'active'
                    : ''
                }`}
                onClick={() => {
                  setCurrentPage('store');
                  setActiveCategory('All');
                  setSidebarOpen(false);
                }}
              >
                <Package size={19} />
                <span>All Items</span>
                <span className="count-pill">{products.length}</span>
              </button>

              <button
                className={`nav-item ${
                  currentPage === 'search' ? 'active' : ''
                }`}
                onClick={() => {
                  setCurrentPage('search');
                  setSidebarOpen(false);
                  setTimeout(
                    () => document.getElementById('search-page-input')?.focus(),
                    100,
                  );
                }}
              >
                <Search size={19} />
                <span>Search Items</span>
              </button>

              <button
                className="nav-item action-add"
                onClick={() => {
                  setEditingItem(null);
                  setItemModalOpen(true);
                  setSidebarOpen(false);
                }}
              >
                <Plus size={19} />
                <span>Add New Item</span>
              </button>

              <button
                className={`nav-item ${
                  activeCategory === 'Low Stock' || currentPage === 'alerts'
                    ? 'active alert-highlight'
                    : ''
                }`}
                onClick={() => {
                  setCurrentPage('store');
                  setActiveCategory('Low Stock');
                  setSidebarOpen(false);
                }}
              >
                <AlertTriangle size={19} color="#D97706" />
                <span>Low on Stock</span>
                {lowStockItems.length > 0 && (
                  <span className="warning-count">{lowStockItems.length}</span>
                )}
              </button>
            </div>

            <div className="nav-section">
              <p className="section-label">Departments</p>
              {['Grains & Cereals', 'Bakery', 'Pulses & Lentils'].map(cat => (
                <button
                  key={cat}
                  className={`nav-item ${
                    activeCategory === cat ? 'active' : ''
                  }`}
                  onClick={() => {
                    setCurrentPage('store');
                    setActiveCategory(cat);
                    setSidebarOpen(false);
                  }}
                >
                  <Archive size={17} />
                  <span>{cat}</span>
                  <span className="count-pill">
                    {products.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="nav-section">
              <p className="section-label">Account</p>
              <button
                className={`nav-item ${
                  currentPage === 'profile' ? 'active' : ''
                }`}
                onClick={() => {
                  setCurrentPage('profile');
                  setSidebarOpen(false);
                }}
              >
                <User size={19} />
                <span>My Profile</span>
              </button>
              <button
                className={`nav-item ${
                  currentPage === 'settings' ? 'active' : ''
                }`}
                onClick={() => {
                  setCurrentPage('settings');
                  setSidebarOpen(false);
                }}
              >
                <Settings size={19} />
                <span>Settings</span>
              </button>
            </div>

            {/* Quick status card */}
            <div className="sidebar-card">
              <div className="sidebar-card-badge">
                <Box size={16} />
                <span>Synced with App</span>
              </div>
              <strong>Store Bin A-1</strong>
              <p>
                Connected to your <code>YtReactNative</code> mobile app. Changes
                show up here live.
              </p>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setItemModalOpen(true);
                }}
              >
                <Plus size={14} /> Add an Item
              </button>
            </div>

            <div className="sidebar-foot">
              <span>© 2026 YtReactNative Store</span>
              <small>Mobile &amp; Web Companion</small>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="backdrop mobile-only"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          />
        )}

        {/* Main Content Area */}
        <main className="content">
          {/* ==================================================== */}
          {/* VIEW A: STORE & ITEMS                                */}
          {/* ==================================================== */}
          {currentPage === 'store' && (
            <>
              {/* Clean Friendly Hero Banner */}
              <section className="hero">
                <div
                  className="hero-backdrop"
                  style={{ backgroundImage: `url(${STORE_BANNER_URL})` }}
                />
                <div className="hero-gradient" />
                <div className="hero-copy">
                  <div className="eyebrow">
                    <Sparkles size={13} />
                    <span>DAILY STORE &amp; STOCK</span>
                  </div>
                  <h1>
                    Simple. Fast. <span>Organized.</span>
                  </h1>
                  <p>
                    {lowStockItems.length > 0
                      ? `Heads up: You have ${lowStockItems.length} items running low on stock (under 20 kg).`
                      : 'Good news! All store items are nicely stocked today.'}
                  </p>
                  <div className="hero-actions">
                    <button
                      className="primary"
                      onClick={() => {
                        document
                          .getElementById('inventory-catalog')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span>View Items</span>
                      <ChevronRight size={17} />
                    </button>
                    <button
                      className="ghost"
                      onClick={() => {
                        setEditingItem(null);
                        setItemModalOpen(true);
                      }}
                    >
                      <Plus size={16} />
                      <span>Add New Item</span>
                    </button>
                  </div>
                </div>

                {/* Floating summary cards */}
                <div className="hero-art">
                  <div className="float-card top">
                    <span className="mini-icon warning">
                      <AlertTriangle size={15} />
                    </span>
                    <div>
                      <b>Low on Stock</b>
                      <small>{lowStockItems.length} items need restock</small>
                    </div>
                  </div>
                  <div className="hero-orb">
                    <span>{products.length}</span>
                    <small>ITEMS</small>
                  </div>
                  <div className="float-card bottom">
                    <span className="mini-icon success">
                      <CheckCircle2 size={15} />
                    </span>
                    <div>
                      <b>Total Stock</b>
                      <small>{totalStockKg} kg in store</small>
                    </div>
                  </div>
                </div>
              </section>

              {/* Numbers Bar */}
              <section className="metric-strip">
                <div className="metric-card">
                  <div className="metric-icon-wrap">
                    <Package size={22} color="#2563EB" />
                  </div>
                  <div className="metric-data">
                    <span className="metric-number">{products.length}</span>
                    <span className="metric-label">Total Items in Store</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap warning">
                    <TrendingDown size={22} color="#D97706" />
                  </div>
                  <div className="metric-data">
                    <span className="metric-number warning">
                      {lowStockItems.length}
                    </span>
                    <span className="metric-label">
                      Running Low (under 20 kg)
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap success">
                    <CheckCircle2 size={22} color="#16A34A" />
                  </div>
                  <div className="metric-data">
                    <span className="metric-number success">
                      {totalStockKg} kg
                    </span>
                    <span className="metric-label">Total Weight in Store</span>
                  </div>
                </div>
              </section>

              {/* Items Section */}
              <section id="inventory-catalog" className="section">
                <div className="section-head">
                  <div>
                    <p className="eyebrow muted">STORE CATALOG</p>
                    <h2>Our Items</h2>
                  </div>
                  <div className="section-head-actions">
                    <button
                      className="primary compact"
                      onClick={() => {
                        setEditingItem(null);
                        setItemModalOpen(true);
                      }}
                    >
                      <Plus size={16} />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="chips">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`chip ${
                        activeCategory === cat ? 'active' : ''
                      } ${
                        cat === 'Low Stock' && lowStockItems.length > 0
                          ? 'chip-alert'
                          : ''
                      }`}
                    >
                      {cat === 'Low Stock' && (
                        <AlertTriangle size={13} style={{ marginRight: 4 }} />
                      )}
                      <span>{cat}</span>
                      <span className="chip-badge">
                        {cat === 'All'
                          ? products.length
                          : cat === 'Low Stock'
                          ? lowStockItems.length
                          : products.filter(p => p.category === cat).length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="product-grid">
                    {filteredProducts.map(item => (
                      <ProductCard
                        key={item.id}
                        product={item}
                        onEdit={() => {
                          setEditingItem(item);
                          setItemModalOpen(true);
                        }}
                        onDelete={() => handleDeleteItem(item.id)}
                        onRestock={() => handleRestock(item.id, 25)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Package size={32} />
                    </div>
                    <h3>No items found</h3>
                    <p>
                      We could not find any items matching your search or
                      category. Try clearing your filters.
                    </p>
                    <button
                      className="primary compact"
                      onClick={() => {
                        setActiveCategory('All');
                        setSearchQuery('');
                      }}
                    >
                      Show All Items
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {/* ==================================================== */}
          {/* VIEW B: SEARCH                                       */}
          {/* ==================================================== */}
          {currentPage === 'search' && (
            <section className="section page-panel">
              <div className="page-head">
                <p className="eyebrow">FIND ITEMS</p>
                <h1 className="page-title">Search Store Items</h1>
                <p className="page-subtitle">
                  Find any item by its name, category, or storage bin.
                </p>
              </div>

              {/* Big search box */}
              <div className="page-search-wrap">
                <Search size={20} />
                <input
                  id="search-page-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Type an item name like Rice, Wheat, Bread..."
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Filter tags */}
              <div className="chips">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`chip ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="results-header-row">
                <h3>
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : `${activeCategory} Items`}
                </h3>
                <span className="results-count">
                  {filteredProducts.length} items found
                </span>
              </div>

              <div className="product-grid">
                {filteredProducts.map(item => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onEdit={() => {
                      setEditingItem(item);
                      setItemModalOpen(true);
                    }}
                    onDelete={() => handleDeleteItem(item.id)}
                    onRestock={() => handleRestock(item.id, 25)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* VIEW C: LOW STOCK ALERTS                             */}
          {/* ==================================================== */}
          {currentPage === 'alerts' && (
            <section className="section page-panel">
              <div className="page-head">
                <p className="eyebrow warning">NEEDS ATTENTION</p>
                <h1 className="page-title">Items Running Low</h1>
                <p className="page-subtitle">
                  These items have less than 20 kg in stock. You can quickly add
                  more below.
                </p>
              </div>

              {lowStockItems.length > 0 ? (
                <div className="alerts-table-card">
                  <table className="alerts-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Stock Left</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="table-product-row">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="table-thumb"
                              />
                              <div>
                                <strong>{item.name}</strong>
                                <small>SKU #{item.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="category-pill">
                              {item.category}
                            </span>
                          </td>
                          <td>
                            <span className="stock-warning-badge">
                              <AlertTriangle size={13} />
                              {item.stock} {item.unit}
                            </span>
                          </td>
                          <td>{item.storageBin || 'Bin A-1'}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="primary compact"
                                onClick={() => handleRestock(item.id, 25)}
                                title="Add 25 kg to stock"
                              >
                                <Plus size={14} /> Add 25 kg
                              </button>
                              <button
                                className="ghost-btn compact"
                                onClick={() => {
                                  setEditingItem(item);
                                  setItemModalOpen(true);
                                }}
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <CheckCircle2 size={40} color="#16A34A" />
                  <h3>Everything is well stocked!</h3>
                  <p>None of your items are running low right now.</p>
                </div>
              )}
            </section>
          )}

          {/* ==================================================== */}
          {/* VIEW D: PROFILE                                      */}
          {/* ==================================================== */}
          {currentPage === 'profile' && (
            <section className="section page-panel narrow">
              <div className="profile-cover">
                <div className="cover-noise" />
              </div>
              <div className="profile-main">
                <div className="big-avatar">
                  {user ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                  <p className="eyebrow">STORE MANAGER</p>
                  <h1 className="page-title">
                    {user ? user.name : 'Guest User'}
                  </h1>
                  <p className="page-subtitle">
                    {user ? user.email : 'Sign in to update and manage items'}
                  </p>
                </div>
                {user ? (
                  <button className="danger-btn compact" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                ) : (
                  <button
                    className="primary compact"
                    onClick={() => setAuthModal('login')}
                  >
                    <LogIn size={16} /> Sign In
                  </button>
                )}
              </div>

              <div className="stats">
                <div>
                  <strong>{products.length}</strong>
                  <span>Items in Store</span>
                </div>
                <div>
                  <strong className={lowStockItems.length > 0 ? 'warning' : ''}>
                    {lowStockItems.length}
                  </strong>
                  <span>Low Stock Warnings</span>
                </div>
                <div>
                  <strong>{totalStockKg} kg</strong>
                  <span>Total Stock Weight</span>
                </div>
              </div>

              <div className="account-details-card">
                <h3>Store Details</h3>
                <div className="detail-row">
                  <span className="detail-label">Your Role</span>
                  <span className="detail-val">
                    {user ? user.role : 'Guest'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Store Location</span>
                  <span className="detail-val">
                    Main Downtown Branch (Bin A)
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone App Sync</span>
                  <span className="detail-val success">
                    <CheckCircle2 size={14} /> Connected to Mobile App
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* VIEW E: SETTINGS                                     */}
          {/* ==================================================== */}
          {currentPage === 'settings' && (
            <section className="section page-panel narrow">
              <div className="page-head">
                <p className="eyebrow">PREFERENCES</p>
                <h1 className="page-title">App Settings</h1>
                <p className="page-subtitle">
                  Personalize your theme, stock limits, and account options.
                </p>
              </div>

              <div className="settings-list">
                <div className="setting-row">
                  <div>
                    <strong>Dark / Light Theme</strong>
                    <span>
                      Switch between easy-on-the-eyes dark mode and clean light
                      mode.
                    </span>
                  </div>
                  <button
                    className={`toggle ${dark ? 'on' : ''}`}
                    onClick={() => setDark(v => !v)}
                    aria-label="Toggle theme"
                  >
                    <span />
                  </button>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>Low Stock Warning Limit</strong>
                    <span>Show an alert when an item goes below 20 kg.</span>
                  </div>
                  <span className="setting-badge">20 kg</span>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>Login System</strong>
                    <span>
                      Uses your Firebase Auth setup from the mobile app.
                    </span>
                  </div>
                  <span className="setting-badge success">Firebase Ready</span>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. ADD / EDIT ITEM MODAL                                 */}
      {/* ======================================================== */}
      {itemModalOpen && (
        <ItemModal
          initialItem={editingItem}
          onClose={() => {
            setItemModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}

      {/* ======================================================== */}
      {/* 4. LOGIN / REGISTER / FORGOT PASSWORD MODAL              */}
      {/* ======================================================== */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onModeChange={setAuthModal}
          onClose={() => setAuthModal(null)}
          onLoginSuccess={loggedInUser => {
            setUser(loggedInUser);
            setAuthModal(null);
          }}
        />
      )}
    </div>
  );
}

// ==============================================================
// PRODUCT CARD COMPONENT
// ==============================================================
function ProductCard({ product, onEdit, onDelete, onRestock }) {
  const isLowStock = Number(product.stock) < 20;

  return (
    <article className={`product-card ${isLowStock ? 'card-low-stock' : ''}`}>
      <div className="thumb">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="sku-badge">#{product.id}</span>
        {isLowStock && (
          <div
            className="low-stock-pulse-badge"
            title="Low stock (under 20 kg)"
          >
            <span className="pulse-ping" />
            <span className="pulse-dot" />
            <span className="pulse-text">Low: {product.stock} kg</span>
          </div>
        )}
      </div>

      <div className="product-meta">
        <div className="meta-top">
          <span className="category-tag">{product.category}</span>
          <span className="storage-bin-tag">
            {product.storageBin || 'Bin A-1'}
          </span>
        </div>

        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">
          {product.description || 'Grocery stock item.'}
        </p>

        <div className="stock-info-row">
          <div className={`stock-pill ${isLowStock ? 'low' : 'healthy'}`}>
            {isLowStock ? (
              <AlertTriangle size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}
            <span>
              {isLowStock
                ? `Low Stock: ${product.stock} ${product.unit}`
                : `In Stock: ${product.stock} ${product.unit}`}
            </span>
          </div>
        </div>

        <div className="card-actions-row">
          <button
            className="action-btn-small restock"
            onClick={onRestock}
            title="Add +25 kg to stock"
          >
            <Plus size={13} /> Add 25 kg
          </button>
          <div className="action-right-group">
            <button
              className="action-btn-icon"
              onClick={onEdit}
              title="Edit Item"
            >
              <Edit2 size={14} />
            </button>
            <button
              className="action-btn-icon delete"
              onClick={onDelete}
              title="Remove Item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ==============================================================
// ADD / EDIT ITEM MODAL COMPONENT
// ==============================================================
function ItemModal({ initialItem, onClose, onSave }) {
  const isEdit = Boolean(initialItem);
  const [name, setName] = useState(initialItem?.name || '');
  const [stock, setStock] = useState(
    initialItem ? String(initialItem.stock) : '',
  );
  const [category, setCategory] = useState(
    initialItem?.category || 'Grains & Cereals',
  );
  const [storageBin, setStorageBin] = useState(
    initialItem?.storageBin || 'Bin A-1',
  );
  const [description, setDescription] = useState(
    initialItem?.description || '',
  );
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please type an item name');
      return;
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      setError('Please enter a valid stock amount in kg');
      return;
    }

    onSave({
      name: name.trim(),
      stock: Number(stock),
      category,
      storageBin: storageBin.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{isEdit ? 'EDIT' : 'NEW ITEM'}</p>
            <h2>{isEdit ? 'Edit Item Details' : 'Add New Item'}</h2>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error-alert">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-label">
            <span>Item Name</span>
            <input
              type="text"
              placeholder="e.g. Basmati Rice, Organic Wheat..."
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </label>

          <div className="form-row-two">
            <label className="form-label">
              <span>Quantity (in kg)</span>
              <input
                type="number"
                placeholder="e.g. 50"
                min="0"
                value={stock}
                onChange={e => {
                  setStock(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </label>

            <label className="form-label">
              <span>Location / Shelf Bin</span>
              <input
                type="text"
                placeholder="e.g. Bin A-1"
                value={storageBin}
                onChange={e => setStorageBin(e.target.value)}
              />
            </label>
          </div>

          <label className="form-label">
            <span>Category</span>
            <div className="category-select-chips">
              {[
                'Grains & Cereals',
                'Bakery',
                'Pulses & Lentils',
                'General Grocery',
              ].map(cat => (
                <button
                  type="button"
                  key={cat}
                  className={`cat-chip ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </label>

          <label className="form-label">
            <span>Short Note (Optional)</span>
            <textarea
              rows="2"
              placeholder="Add any helpful note about this item..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              {isEdit ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================================
// AUTHENTICATION MODAL (From Login.jsx & auth.js)
// ==============================================================
function AuthModal({ mode, onModeChange, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // 1. Submit Login
  const handleLoginSubmit = e => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: email.split('@')[0],
        email: email.trim(),
        role: 'Store Manager',
      });
    }, 500);
  };

  // 2. Submit Register
  const handleRegisterSubmit = e => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please fill in all details');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Verification email sent to ' + email + '! You can now log in.');
      onModeChange('login');
    }, 600);
  };

  // 3. Submit Forgot Password Step 1
  const handleForgotEmailSubmit = e => {
    e.preventDefault();
    setError('');
    if (!resetEmail.trim()) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onModeChange('forgot_password');
    }, 500);
  };

  // 4. Submit Reset Password Step 2
  const handleResetPasswordSubmit = e => {
    e.preventDefault();
    setError('');
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onModeChange('forgot_success');
    }, 500);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        {/* Left Side Panel */}
        <div className="auth-left">
          <div className="auth-left-top">
            <span className="brand-mark">
              <Package size={20} />
            </span>
            <strong>YtReactNative</strong>
          </div>

          <div className="auth-visual-copy">
            <span className="eyebrow">
              <ShieldCheck size={14} /> WELCOME
            </span>
            <h1>
              Store stock.
              <br />
              <span>Made simple.</span>
            </h1>
            <p>
              Log in to check what items are in your store, update quantities,
              and see what needs restocking.
            </p>

            <div className="auth-pills-row">
              <span>
                <CheckCircle2 size={14} color="#16A34A" /> Simple to use
              </span>
              <span>
                <CheckCircle2 size={14} color="#16A34A" /> Always in sync
              </span>
              <span>
                <CheckCircle2 size={14} color="#16A34A" /> Safe &amp; secure
              </span>
            </div>
          </div>

          <div className="auth-left-footer">
            <span>© 2026 YtReactNative Store</span>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-right">
          <button
            className="auth-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          {/* ==================================================== */}
          {/* LOGIN                                                */}
          {/* ==================================================== */}
          {mode === 'login' && (
            <div className="auth-box">
              <div className="auth-header">
                <span className="eyebrow muted">SIGN IN</span>
                <h2>Welcome back</h2>
                <p>Enter your email and password to open your store.</p>
              </div>

              {error && (
                <div className="auth-error-notice">
                  <AlertTriangle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <label className="auth-field">
                  <span>Email</span>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Password</span>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="peek-btn"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label="Show or hide password"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <div className="form-sub-row">
                  <label className="remember-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setResetEmail(email);
                      onModeChange('forgot_email');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="primary full"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Checking details...</span>
                  ) : (
                    <>
                      <span>Sign In to Store</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-switch-row">
                <span>Don't have an account?</span>
                <button
                  className="text-link highlight"
                  onClick={() => onModeChange('register')}
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* REGISTER                                             */}
          {/* ==================================================== */}
          {mode === 'register' && (
            <div className="auth-box">
              <div className="auth-header">
                <span className="eyebrow muted">SIGN UP</span>
                <h2>Create account</h2>
                <p>Create your store account in less than a minute.</p>
              </div>

              {error && (
                <div className="auth-error-notice">
                  <AlertTriangle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <label className="auth-field">
                  <span>Your Name</span>
                  <div className="input-with-icon">
                    <User size={16} />
                    <input
                      type="text"
                      placeholder="Deepak Kumar"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Email</span>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Password (at least 6 characters)</span>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="peek-btn"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="auth-field">
                  <span>Confirm Password</span>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  className="primary full"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Creating account...</span>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>

              <div className="auth-switch-row">
                <span>Already have an account?</span>
                <button
                  className="text-link highlight"
                  onClick={() => onModeChange('login')}
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* FORGOT PASSWORD STEP 1                               */}
          {/* ==================================================== */}
          {mode === 'forgot_email' && (
            <div className="auth-box">
              <div className="auth-header">
                <span className="eyebrow muted">HELP</span>
                <h2>Reset Password</h2>
                <p>Enter your email and we'll help you reset your password.</p>
              </div>

              {error && (
                <div className="auth-error-notice">
                  <AlertTriangle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleForgotEmailSubmit} className="auth-form">
                <label className="auth-field">
                  <span>Email</span>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  className="primary full"
                  disabled={loading}
                >
                  {loading ? <span>Checking...</span> : <span>Continue</span>}
                </button>
              </form>

              <div className="auth-switch-row">
                <button
                  className="text-link"
                  onClick={() => onModeChange('login')}
                >
                  <ArrowLeft size={14} style={{ marginRight: 4 }} /> Back to
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* FORGOT PASSWORD STEP 2                               */}
          {/* ==================================================== */}
          {mode === 'forgot_password' && (
            <div className="auth-box">
              <div className="auth-header">
                <span className="eyebrow muted">NEW PASSWORD</span>
                <h2>Set New Password</h2>
                <p>Choose a new password for {resetEmail || 'your account'}.</p>
              </div>

              {error && (
                <div className="auth-error-notice">
                  <AlertTriangle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPasswordSubmit} className="auth-form">
                <label className="auth-field">
                  <span>New Password (min 6 characters)</span>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="peek-btn"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="auth-field">
                  <span>Confirm New Password</span>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  className="primary full"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Saving...</span>
                  ) : (
                    <span>Save New Password</span>
                  )}
                </button>
              </form>

              <div className="auth-switch-row">
                <button
                  className="text-link"
                  onClick={() => onModeChange('login')}
                >
                  <ArrowLeft size={14} style={{ marginRight: 4 }} /> Back to
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* RESET SUCCESS                                        */}
          {/* ==================================================== */}
          {mode === 'forgot_success' && (
            <div className="auth-box text-center">
              <div className="success-icon-badge">
                <CheckCircle2 size={36} color="#16A34A" />
              </div>
              <h2>Password reset successfully</h2>
              <p className="success-subhead">
                Your password has been changed. You can now log in with your new
                password.
              </p>

              <div className="success-notice-box">
                <Mail size={16} color="#2563EB" />
                <span>
                  We sent a confirmation email to{' '}
                  <b>{resetEmail || 'your email'}</b>.
                </span>
              </div>

              <button
                className="primary full"
                onClick={() => {
                  setEmail(resetEmail);
                  onModeChange('login');
                }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
