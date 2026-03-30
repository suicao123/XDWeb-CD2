/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  // 1. Khai báo state để quản lý tab đang được chọn
  const [activeTab, setActiveTab] = useState('dashboard');

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
            <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white rounded-xl py-3 px-4 font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
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
                <input className="w-full pl-12 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-sm outline-none" placeholder="Search orders, products, or customers..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-8">
              <button className="p-2 text-slate-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">apps</span>
              </button>
              <button className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant text-on-surface text-sm font-semibold rounded-full transition-all active:scale-95">
                Quick Action
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

          {/* Background Elements for Visual Depth */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        </main>
      </div>
    </>
  );
}