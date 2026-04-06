/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  // 1. Khai báo state để quản lý tab đang được chọn
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState('');
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productFormMode, setProductFormMode] = useState('create');
  const [productFormError, setProductFormError] = useState('');
  const [productFormSubmitting, setProductFormSubmitting] = useState(false);
  const [productFormData, setProductFormData] = useState({
    id: null,
    name: '',
    image: '',
    price: '',
    discount: '0',
    quantity: '0',
    description: '',
    detail: '',
    guarantee: '',
    status: '1',
    category_id: '',
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL_API = import.meta.env.VITE_API_BASE_URL_API;
  const PRODUCT_API = import.meta.env.VITE_API_PRODUCT;
  const CATEGORY_API = '/category';
  const USER_API = '/users';

  // 2. Định nghĩa danh sách menu bên trái
  const sidebarMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'products', label: 'Products', icon: 'inventory_2' },
    { id: 'orders', label: 'Orders', icon: 'shopping_cart' },
    { id: 'customers', label: 'Customers', icon: 'group' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'inventory', label: 'Inventory', icon: 'warehouse' },
    { id: 'staff', label: 'Staff', icon: 'badge' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price ?? 0);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/120x120?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const getEmptyProductForm = () => ({
    id: null,
    name: '',
    image: '',
    price: '',
    discount: '0',
    quantity: '0',
    description: '',
    detail: '',
    guarantee: '',
    status: '1',
    category_id: categories[0]?.id ? String(categories[0].id) : '',
  });

  const getApiErrorMessage = async (response, fallbackMessage) => {
    try {
      const data = await response.json();

      if (data?.message) {
        return data.message;
      }

      if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
      }
    } catch (error) {
      console.error('Unable to parse API error:', error);
    }

    return fallbackMessage;
  };

  const openNewProductForm = () => {
    setProductFormMode('create');
    setProductFormError('');
    setProductFormData(getEmptyProductForm());
    setProductFormOpen(true);
  };

  const openEditProductForm = (product) => {
    setProductFormMode('edit');
    setProductFormError('');
    setProductFormData({
      id: product.id,
      name: product.name || product.productname || '',
      image: product.image || '',
      price: String(product.price ?? ''),
      discount: String(product.discount ?? 0),
      quantity: String(product.quantity ?? 0),
      description: product.description || '',
      detail: product.detail || '',
      guarantee: product.guarantee || '',
      status: String(product.status ?? 1),
      category_id: String(product.category_id ?? categories[0]?.id ?? ''),
    });
    setProductFormOpen(true);
  };

  const closeProductForm = () => {
    if (productFormSubmitting) {
      return;
    }

    setProductFormOpen(false);
    setProductFormError('');
    setProductFormData(getEmptyProductForm());
  };

  const handleProductFormChange = (event) => {
    const { name, value } = event.target;

    setProductFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const filteredProducts = products.filter((product) => {
    const keyword = productSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      product.productname,
      product.name,
      product.description,
      product.category?.name,
      String(product.id),
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword));
  });

  const filteredUsers = users.filter((user) => {
    const keyword = userSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      user.name,
      user.username,
      user.email,
      user.first_name,
      user.last_name,
      String(user.id),
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword));
  });

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError('');

      const response = await fetch(`${BASE_URL_API}${PRODUCT_API}`);

      if (!response.ok) {
        throw new Error(`Khong tai duoc danh sach san pham (${response.status})`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setProductsLoaded(true);
    } catch (error) {
      console.error('Error loading admin products:', error);
      setProductsError(error.message || 'Khong the tai san pham');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError('');

      const response = await fetch(`${BASE_URL_API}${USER_API}`);

      if (!response.ok) {
        throw new Error(`Khong tai duoc danh sach nguoi dung (${response.status})`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      setUsersLoaded(true);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsersError(error.message || 'Khong the tai nguoi dung');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesError('');

      const response = await fetch(`${BASE_URL_API}${CATEGORY_API}`);

      if (!response.ok) {
        throw new Error(`Khong tai duoc categories (${response.status})`);
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategoriesError(error.message || 'Khong the tai category');
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setProductFormError('');

    const payload = {
      name: productFormData.name.trim(),
      image: productFormData.image.trim(),
      price: Number(productFormData.price),
      discount: Number(productFormData.discount || 0),
      quantity: Number(productFormData.quantity || 0),
      description: productFormData.description.trim(),
      detail: productFormData.detail.trim(),
      guarantee: productFormData.guarantee.trim(),
      status: Number(productFormData.status),
      category_id: Number(productFormData.category_id),
    };

    if (!payload.name || !payload.image || !productFormData.category_id) {
      setProductFormError('Vui long nhap ten, image va category.');
      return;
    }

    try {
      setProductFormSubmitting(true);

      const isEditing = productFormMode === 'edit' && productFormData.id;
      const response = await fetch(
        isEditing ? `${BASE_URL_API}${PRODUCT_API}/${productFormData.id}` : `${BASE_URL_API}${PRODUCT_API}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, 'Khong the luu san pham'));
      }

      const savedProduct = await response.json();

      setProducts((current) => {
        if (isEditing) {
          return current.map((product) => product.id === savedProduct.id ? savedProduct : product);
        }

        return [savedProduct, ...current];
      });

      setProductsLoaded(true);
      setProductFormOpen(false);
      setProductFormData(getEmptyProductForm());
    } catch (error) {
      console.error('Error saving product:', error);
      setProductFormError(error.message || 'Khong the luu san pham');
    } finally {
      setProductFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Ban co chac muon xoa "${product.productname || product.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL_API}${PRODUCT_API}/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, 'Khong the xoa san pham'));
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (error) {
      console.error('Error deleting product:', error);
      window.alert(error.message || 'Khong the xoa san pham');
    }
  };

  useEffect(() => {
    if (activeTab !== 'products' || productsLoaded) {
      return;
    }

    loadProducts();
  }, [activeTab, productsLoaded, BASE_URL_API, PRODUCT_API]);

  useEffect(() => {
    if (activeTab !== 'customers' || usersLoaded) {
      return;
    }

    loadUsers();
  }, [activeTab, usersLoaded, BASE_URL_API, USER_API]);

  useEffect(() => {
    if (activeTab !== 'products' || categories.length > 0) {
      return;
    }

    loadCategories();
  }, [activeTab, categories.length, BASE_URL_API, CATEGORY_API]);

  useEffect(() => {
    if (!productFormOpen || productFormData.category_id || categories.length === 0) {
      return;
    }

    setProductFormData((current) => ({
      ...current,
      category_id: String(categories[0].id),
    }));
  }, [productFormOpen, productFormData.category_id, categories]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);

    script.onload = () => {
      window.tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#0058bc',
              'primary-container': '#0070eb',
              surface: '#f9f9fb',
              'surface-container-lowest': '#ffffff',
              'surface-container-low': '#f3f3f5',
              'surface-container-high': '#e8e8ea',
              'surface-variant': '#e2e2e4',
              'on-surface': '#1a1c1d',
              'on-surface-variant': '#414755',
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            }
          }
        }
      };
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

          body {
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            margin: 0;
            padding: 0;
          }

          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `
      }} />

      <div className="bg-surface text-on-surface overflow-hidden h-screen w-full flex">
        {/* SideNavBar Component */}
        <aside className="h-screen border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,88,188,0.04)] flex flex-col p-4 w-64 z-50 shrink-0">
          <div className="mb-8 px-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tighter text-slate-900 dark:text-white leading-none">Store Admin</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Global Operations</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 font-sans antialiased tracking-tight text-sm font-medium">
            {/* Render động menu bên trái */}
            {sidebarMenu.map((item) => {
              const isActive = activeTab === item.id;
              
              return (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault(); // Ngăn trình duyệt nhảy trang
                    setActiveTab(item.id);
                  }}
                  className={isActive 
                    ? "flex items-center gap-3 px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20 rounded-xl transition-all duration-200 scale-95" 
                    : "flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl"
                  }
                >
                  <span 
                    className="material-symbols-outlined" 
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-slate-100/50">
            <button
              onClick={() => {
                setActiveTab('products');
                openNewProductForm();
              }}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-white rounded-xl py-3 px-4 font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Product
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-surface relative">
          {/* TopNavBar Component */}
          <header className="flex justify-between items-center px-8 h-16 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300 ease-in-out shrink-0">
            <div className="flex items-center flex-1 max-w-xl">
              <div className="relative w-full group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input
                  className="w-full pl-12 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-sm outline-none"
                  placeholder={
                    activeTab === 'products'
                      ? 'Search products by name, id, or description...'
                      : activeTab === 'customers'
                        ? 'Search users by name, username, email, or id...'
                        : 'Search orders, products, or customers...'
                  }
                  type="text"
                  value={activeTab === 'products' ? productSearch : activeTab === 'customers' ? userSearch : ''}
                  onChange={(e) => {
                    if (activeTab === 'products') {
                      setProductSearch(e.target.value);
                    }

                    if (activeTab === 'customers') {
                      setUserSearch(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-8">
              <button className="p-2 text-slate-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">apps</span>
              </button>
              <div className="h-8 w-px bg-slate-200/50 mx-2"></div>
              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-on-surface">Admin User Profile</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Senior Manager</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden transition-transform group-hover:scale-105 bg-slate-200">
                  <img alt="Admin" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                </div>
              </div>
            </div>
          </header>

          {/* Nội dung thay đổi dựa trên state activeTab */}
          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            {activeTab === 'dashboard' ? (
              // --- NỘI DUNG CỦA TAB DASHBOARD ---
              <div className="space-y-12">
                <section className="mb-8">
                  <h2 className="text-[3.5rem] font-extrabold tracking-tight text-on-surface leading-tight mb-2">Morning, Felix.</h2>
                  <p className="text-on-surface-variant text-lg font-medium">Your store performance is up 12% compared to last week.</p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* ... Các thẻ thống kê (revenue, orders...) ... */}
                  <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+14.2%</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">$128,430.00</h3>
                  </div>

                  <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+5.1%</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium mb-1">Total Orders</p>
                    <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">1,240</h3>
                  </div>

                  <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">-2.4%</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium mb-1">New Customers</p>
                    <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">384</h3>
                  </div>

                  <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8.7%</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium mb-1">Conversion Rate</p>
                    <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">3.42%</h3>
                  </div>
                </section>

                <section className="grid grid-cols-12 gap-8">
                  {/* Main Revenue Chart */}
                  <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h4 className="text-xl font-bold tracking-tight text-on-surface">Revenue Forecast</h4>
                        <p className="text-on-surface-variant text-sm">Monthly performance vs last year</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-surface-container-low text-xs font-bold rounded-full cursor-pointer hover:bg-surface-variant transition-colors">Weekly</button>
                        <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 cursor-pointer hover:bg-primary/90 transition-colors">Monthly</button>
                      </div>
                    </div>
                    <div className="relative h-[300px] w-full mt-4 flex items-end gap-1">
                      <div className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full bg-primary/10 rounded-t-lg h-[40%] group-hover:bg-primary/20 transition-all"></div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2">JAN</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full bg-primary/10 rounded-t-lg h-[60%] group-hover:bg-primary/20 transition-all"></div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2">FEB</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full bg-primary/10 rounded-t-lg h-[55%] group-hover:bg-primary/20 transition-all"></div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2">MAR</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full bg-primary/10 rounded-t-lg h-[80%] group-hover:bg-primary/20 transition-all shadow-lg shadow-primary/10"></div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2">APR</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full bg-primary/10 rounded-t-lg h-[70%] group-hover:bg-primary/20 transition-all"></div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2">MAY</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full bg-primary/10 rounded-t-lg h-[95%] group-hover:bg-primary/20 transition-all"></div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2 text-primary">JUN</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full bg-primary/10 rounded-t-lg h-[45%] group-hover:bg-primary/20 transition-all"></div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2">JUL</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm flex flex-col">
                    <h4 className="text-xl font-bold tracking-tight text-on-surface mb-8">Sales by Category</h4>
                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="w-48 h-48 rounded-full border-[16px] border-primary flex items-center justify-center relative">
                        <div className="absolute inset-0 border-[16px] border-indigo-300 rounded-full border-l-transparent border-b-transparent -rotate-45 -m-[16px]"></div>
                        <div className="text-center z-10 bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center">
                          <p className="text-3xl font-extrabold text-on-surface">64%</p>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">iPhone</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm font-medium text-on-surface-variant">iPhone</span>
                        </div>
                        <span className="text-sm font-bold">$82,190</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                          <span className="text-sm font-medium text-on-surface-variant">MacBook</span>
                        </div>
                        <span className="text-sm font-bold">$28,540</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                          <span className="text-sm font-medium text-on-surface-variant">iPad & Others</span>
                        </div>
                        <span className="text-sm font-bold">$17,700</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : activeTab === 'products' ? (
              <div className="space-y-8">
                <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Catalog</p>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Product Management</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-full lg:min-w-[420px]">
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Products</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{products.length}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Visible Results</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{filteredProducts.length}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Status</p>
                      <p className="text-lg font-bold tracking-tight text-on-surface mt-3">{productsLoading ? 'Loading...' : 'Synced'}</p>
                    </div>
                  </div>
                  <button
                    onClick={openNewProductForm}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-5 py-3 text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">add_box</span>
                    New Product
                  </button>
                </section>

                <section className="bg-surface-container-lowest rounded-[1.75rem] shadow-sm overflow-hidden border border-slate-200/60">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b border-slate-200/60">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-on-surface">Live Product Table</h3>
                    </div>
                    <button
                      onClick={() => {
                        setProductsLoaded(false);
                        loadProducts();
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">refresh</span>
                      Refresh Products
                    </button>
                  </div>

                  {productsLoading ? (
                    <div className="p-10 text-center text-slate-500">
                      <div className="inline-block h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
                      <p className="mt-4 font-medium">Dang tai danh sach san pham...</p>
                    </div>
                  ) : productsError ? (
                    <div className="p-10 text-center">
                      <span className="material-symbols-outlined text-5xl text-red-400">error</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong the tai san pham</p>
                      <p className="mt-2 text-slate-500">{productsError}</p>
                      <button
                        onClick={() => {
                          setProductsLoaded(false);
                          loadProducts();
                        }}
                        className="mt-6 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Thu lai
                      </button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                      <span className="material-symbols-outlined text-5xl text-slate-300">inventory_2</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong co san pham phu hop</p>
                      <p className="mt-2">Thu doi tu khoa tim kiem hoac kiem tra lai du lieu backend.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-[0.2em]">
                          <tr>
                            <th className="px-6 py-4 text-left">Product</th>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Price</th>
                            <th className="px-6 py-4 text-left">Stock</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Category</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-t border-slate-200/60 hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4 min-w-[280px]">
                                  <img
                                    src={getImageUrl(product.image)}
                                    alt={product.productname}
                                    className="w-16 h-16 rounded-2xl object-contain bg-slate-100 p-2"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://img.websosanh.vn/v2/users/root_product/images/dien-thoai-apple-iphone-se-2-2/u1t1vlssg5s0z.jpg';
                                    }}
                                  />
                                  <div>
                                    <p className="font-bold text-slate-900">{product.productname || product.name}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2 max-w-md">{product.description || 'Chua co mo ta'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-700">#{product.id}</td>
                              <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(product.price)}đ</td>
                              <td className="px-6 py-4 text-slate-700">{product.quantity ?? 0}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${product.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                  {product.status === 1 ? 'Active' : 'Hidden'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-700">{product.category?.name || product.category_id || '-'}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openEditProductForm(product)}
                                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product)}
                                    className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            ) : activeTab === 'customers' ? (
              <div className="space-y-8">
                <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">People</p>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">User Directory</h2>
                    <p className="text-on-surface-variant mt-2">Danh sach nguoi dung dang duoc lay truc tiep tu backend.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-full lg:min-w-[420px]">
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Users</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{users.length}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Active Users</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{users.filter((user) => user.is_active).length}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Visible Results</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{filteredUsers.length}</p>
                    </div>
                  </div>
                </section>

                <section className="bg-surface-container-lowest rounded-[1.75rem] shadow-sm overflow-hidden border border-slate-200/60">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b border-slate-200/60">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-on-surface">Live User Table</h3>
                    </div>
                    <button
                      onClick={() => {
                        setUsersLoaded(false);
                        loadUsers();
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">refresh</span>
                      Refresh Users
                    </button>
                  </div>

                  {usersLoading ? (
                    <div className="p-10 text-center text-slate-500">
                      <div className="inline-block h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
                    </div>
                  ) : usersError ? (
                    <div className="p-10 text-center">
                      <span className="material-symbols-outlined text-5xl text-red-400">error</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong the tai nguoi dung</p>
                      <p className="mt-2 text-slate-500">{usersError}</p>
                      <button
                        onClick={() => {
                          setUsersLoaded(false);
                          loadUsers();
                        }}
                        className="mt-6 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Thu lai
                      </button>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                      <span className="material-symbols-outlined text-5xl text-slate-300">group_off</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong co nguoi dung phu hop</p>
                      <p className="mt-2">Thu doi tu khoa tim kiem hoac kiem tra lai du lieu backend.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-[0.2em]">
                          <tr>
                            <th className="px-6 py-4 text-left">User</th>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Username</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t border-slate-200/60 hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4 min-w-[250px]">
                                  <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center font-extrabold text-sm shadow-sm">
                                    {(user.name || user.username || 'U').slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{user.name || user.username}</p>
                                    <p className="text-xs text-slate-500">
                                      {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'Chua co ten day du'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-700">#{user.id}</td>
                              <td className="px-6 py-4 text-slate-700">{user.username || '-'}</td>
                              <td className="px-6 py-4 text-slate-700">{user.email || '-'}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                  {user.is_superuser && (
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-amber-50 text-amber-700">Admin</span>
                                  )}
                                  {user.is_staff && (
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700">Staff</span>
                                  )}
                                  {!user.is_superuser && !user.is_staff && (
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600">Customer</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              // --- NỘI DUNG CÁC TAB CÒN LẠI (TRẠNG THÁI PLACEHOLDER) ---
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest/50 rounded-3xl border border-dashed border-slate-300">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                  {sidebarMenu.find(item => item.id === activeTab)?.icon}
                </span>
                <h2 className="text-2xl font-bold text-slate-800 capitalize mb-2">{activeTab} Management</h2>
                <p className="text-slate-500 max-w-md">This section is currently under construction. Data for {activeTab} will be available in the upcoming release.</p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>

          {productFormOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
              <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">
                      {productFormMode === 'edit' ? 'Update Product' : 'Create Product'}
                    </p>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-2">
                      {productFormMode === 'edit' ? 'Edit product information' : 'Add a new product'}
                    </h3>
                  </div>
                  <button
                    onClick={closeProductForm}
                    className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="px-8 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Product Name</span>
                      <input
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="iPhone 17 Pro 256GB"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Image Path</span>
                      <input
                        name="image"
                        value={productFormData.image}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="/products/example.png"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Price</span>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={productFormData.price}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Discount</span>
                      <input
                        name="discount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={productFormData.discount}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Quantity</span>
                      <input
                        name="quantity"
                        type="number"
                        min="0"
                        value={productFormData.quantity}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Status</span>
                      <select
                        name="status"
                        value={productFormData.status}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="1">Active</option>
                        <option value="0">Hidden</option>
                      </select>
                    </label>

                    <label className="block md:col-span-2">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Category</span>
                      <select
                        name="category_id"
                        value={productFormData.category_id}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name} (ID: {category.id})
                          </option>
                        ))}
                      </select>
                      {categoriesError && (
                        <p className="text-xs text-red-500 mt-2">{categoriesError}</p>
                      )}
                    </label>

                    <label className="block md:col-span-2">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Guarantee</span>
                      <input
                        name="guarantee"
                        value={productFormData.guarantee}
                        onChange={handleProductFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="12 thang"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Description</span>
                      <textarea
                        name="description"
                        value={productFormData.description}
                        onChange={handleProductFormChange}
                        rows="3"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Mo ta ngan ve san pham"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="block text-sm font-bold text-slate-700 mb-2">Detail</span>
                      <textarea
                        name="detail"
                        value={productFormData.detail}
                        onChange={handleProductFormChange}
                        rows="4"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Thong tin chi tiet hon"
                      />
                    </label>
                  </div>

                  {productFormError && (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {productFormError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeProductForm}
                      className="px-5 py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={productFormSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      <span className="material-symbols-outlined text-base">
                        {productFormMode === 'edit' ? 'save' : 'add_circle'}
                      </span>
                      {productFormSubmitting ? 'Saving...' : productFormMode === 'edit' ? 'Save Changes' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Background Elements for Visual Depth */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        </main>
      </div>
    </>
  );
}
