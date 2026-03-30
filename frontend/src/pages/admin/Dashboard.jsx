/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Dashboard() {
  return (
    <>
      {/* Khối Style gộp chung cấu hình Tailwind v4, Fonts và Icons */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
          @import "tailwindcss";

          @theme {
            --color-primary: #0058bc;
            --color-primary-container: #0070eb;
            --color-surface: #f9f9fb;
            --color-surface-container-lowest: #ffffff;
            --color-surface-container-low: #f3f3f5;
            --color-surface-container-high: #e8e8ea;
            --color-surface-variant: #e2e2e4;
            --color-on-surface: #1a1c1d;
            --color-on-surface-variant: #414755;
            --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
          }

          body {
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
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
            <a className="flex items-center gap-3 px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20 rounded-xl transition-all duration-200 scale-95 active:scale-90" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span>Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl" href="#">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Products</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl" href="#">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>Orders</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl" href="#">
              <span className="material-symbols-outlined">group</span>
              <span>Customers</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl" href="#">
              <span className="material-symbols-outlined">analytics</span>
              <span>Analytics</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl" href="#">
              <span className="material-symbols-outlined">warehouse</span>
              <span>Inventory</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl" href="#">
              <span className="material-symbols-outlined">badge</span>
              <span>Staff</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-xl" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </a>
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
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden transition-transform group-hover:scale-105">
                  <img alt="Admin User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNjCaGuZXXkERuP6J9yuPEF0InTCm62s9OS-X8oNNAPJxzTr_czqUu9U-GDfQLKVdQRSZAHyMx-gGEQh90SKKzyo46e4YNctTGFkoQ6M66PwLQjbwgL8KlPVvRqvy4psMDqOvVivRgKpqDbAMz6JQ7fg1u0Mrmi72JIgBhui7jdtfW_B6dV_WgnUAdpLbCtPuwTDivKxzYFzXPZDYxfOzmHCjDNUA4zSi9C_RN_LNWszg06LEJnePASjE5C1B1Jdkl8w8noG8_V4w" />
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-12 relative z-10">
            {/* Welcome Section */}
            <section className="mb-8">
              <h2 className="text-[3.5rem] font-extrabold tracking-tight text-on-surface leading-tight mb-2">Morning, Felix.</h2>
              <p className="text-on-surface-variant text-lg font-medium">Your store performance is up 12% compared to last week.</p>
            </section>

            {/* Overview Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Analytics Bento Grid */}
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

            {/* Orders and Product Performance */}
            <section className="grid grid-cols-12 gap-8">
              {/* Recent Orders Table */}
              <div className="col-span-12 xl:col-span-8 bg-surface-container-lowest rounded-[1.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50">
                  <h4 className="text-xl font-bold tracking-tight text-on-surface">Recent Orders</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low/50">
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Product</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 flex-shrink-0">
                              <img alt="iPhone 15 Pro" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd8YplQTQRYcvohwqqwRzUFsJGVzraq-siAy_7bGlOrOZ_URNoOfvB-TOLUfyRSCSmsa4sUwfZj1moI9r5vCY507CkvMcw27aiVnrXTyJp_jbGQboVAsVuE2qhdAku6MhmU6MF18Pus9PzKpoGSGzpyFKSEwtEKT8VRVGgG6B71ugKWId0egz4qqkdZrouMAT-jbSny7ZiD3BeiMuyqPzPa-z2hJpLPVAwCoVAZbmz-0Oa6YXQrpUc0K-YTGVJoGpJfRIKanOW6AA" />
                            </div>
                            <span className="text-sm font-bold text-on-surface">iPhone 15 Pro Max</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">Sarah Connor</span>
                            <span className="text-[11px] text-slate-400">sarah.c@gmail.com</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">Oct 12, 2023</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Delivered</span>
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-on-surface">$1,199.00</td>
                      </tr>
                      <tr className="bg-surface-container-low/20 hover:bg-surface-container-low transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 flex-shrink-0">
                              <img alt="MacBook Air" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqYixt1St1FNLmRuFSKx_uBwGAiBo-Wa4z1d-asrRDOgs44f3ocAPOfh0QoT4wtrptfIS4ScGmXaVnScsXPhvBdznZ_d0XU2xXWwgCNS2vnjOJQELRzUlHpRlhmsyOdDRWWFggX0Orr8IEI98a1BEzb7_Sork0rALz_XHm9vDMuZX6-Ei0-LRK3NPJV0W8dg-A79QlCORTvQRHQirPuQgccAd3D2WGB-IWy_Yev-pIHPr7uMSkqYp2V7U-nPEFB9lowUcaPn89-LE" />
                            </div>
                            <span className="text-sm font-bold text-on-surface">MacBook Pro 14" M3</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">John Smith</span>
                            <span className="text-[11px] text-slate-400">j.smith@corp.com</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">Oct 11, 2023</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Pending</span>
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-on-surface">$1,999.00</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 flex-shrink-0">
                              <img alt="AirPods Max" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaKNCBYmQU5_F8uvEm789JNyOxy3wjDG4JRsF0QIPumh1OBbhKkKXJvoFIB5SH-EnVoCId87f7T-IKeFuDNzpvZCRWevBq_ekCWIIXZnxsJnTrB2ms2t-CKkhCAh0otYPhn4b3gWqWv1IT9Sc514056YcjomHxaB3Z5ViIgS_hh2a8FSS9FW-qjI04gnF3i1Dd2juyuPps1YOFvNGicM-zIWfx0SIpbmwMr_7TLJ5iUsjXSsBFV8Ljje4WYfDZcE7xI1VlmVpSLRE" />
                            </div>
                            <span className="text-sm font-bold text-on-surface">AirPods Max</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">Emily Blunt</span>
                            <span className="text-[11px] text-slate-400">e.blunt@me.com</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">Oct 11, 2023</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Delivered</span>
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-on-surface">$549.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="col-span-12 xl:col-span-4 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xl font-bold tracking-tight text-on-surface">Product Performance</h4>
                  <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 group-hover:bg-primary/5 transition-colors">
                      <img alt="iPhone" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Ffk_qL_KIeEMqJEfSfKibga8E6p6C1sw4km0-C7whXgj1aAnhZDUFqV8ctRwFH4OH5a04Hni5x28krdg9pBXewMfi3x-GpRHsqWV3u7f61eL3KIJjApR8HbLOY9FOP6fnhdd2DWBQFAD6F3hpVY0e2pKxKufV3-2VdMkYLBvhjUt8wMfoCyhYJdnCqdydWl9nYGI0melhT6etYyy14ZyBZeyUXm5zcL0FmAaKWgcn2lDK-Gzm5u7gT2IQnsmvcCUR1NjTwFzVjw" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-on-surface">iPhone 15 Pro</p>
                        <span className="text-xs font-bold text-primary">#1</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[85%]"></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">1,420 units sold this month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 group-hover:bg-primary/5 transition-colors">
                      <img alt="MacBook" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDszoTYXkd-oHlDGzzlAtOXpEWo85-Cl1k7FuTkJQl-M4_qwEGNjGT4FULb0dPpIItuPeIq4gJVti1ifq_jCILWkmAdwqKrADEZRKNv-h_tUlopQA3ZztYVIYLUr2U77EYKcZT1AXuE9w89MiOhYK0lD9peOtQOcnU0X3NY9eG2oEmJlpqZEkBIJErgAh8XRe3COAXMXfeg9CvnzAjc8oQ-vykJ5KKjvTUzfgbNDJ_ES5quEfX7n-CoE1tztewFeKeNzvzDkuAK8nU" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-on-surface">MacBook Pro 14"</p>
                        <span className="text-xs font-bold text-slate-400">#2</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[62%] opacity-80"></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">890 units sold this month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 group-hover:bg-primary/5 transition-colors">
                      <img alt="iPad" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1tYl4k0Ol9VGwpyHDN54Kn7VdD99hNuK5ZPxg6ybjbvvjJH3LhcnhPflYYzXoMfWp4w8WLhuKVlMXdePklFV6TNSiQddv6AyIo2SE8OHJpdopNOBlEXjZvrYimUByc6Fi9Pd1TLfHXm2EdNA6SWVBgZ-UQPcEPSGa-33EnesJrYBdqlG93zkdZ77PThzNXp5M0aGK7G-DVsIXh0Y1nb5WxXfFVP0oeTym7FFl2fBOqaelR_tXcVS6Ajaq0X_ml-aJG25SV_-tTNc" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-on-surface">iPad Pro 12.9"</p>
                        <span className="text-xs font-bold text-slate-400">#3</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[45%] opacity-60"></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">450 units sold this month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 group-hover:bg-primary/5 transition-colors">
                      <img alt="Watch" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEhWCwwaFp8GYbttTibeQEqbydUrPNS7EZXZHhUQZdXueF2_a5g_w4uSH4cMlPTBj78WkeVljMY0RU61QH2qpu0l0aRMFu6_lA34a70J-G08mRLFeDINc_t5GILYOIOgkHLrQ5-6fH9iOCDnl33KOtGuPKoRJEWfigSGkmS1ljc0UOgkaINCEFO4VWucfGweA2CuNTSZ7aPwwQMfOEN3Hmq_QWEX6DVy-SnM0QHjegohucNSX-LaH5vovaJQ-fd8xlIYC3ZiSZ4-Y" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-on-surface">Apple Watch Ultra 2</p>
                        <span className="text-xs font-bold text-slate-400">#4</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[38%] opacity-40"></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">320 units sold this month</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-8 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer">View Full Inventory</button>
              </div>
            </section>
          </div>

          {/* Background Elements for Visual Depth */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        </main>
      </div>
    </>
  );
}