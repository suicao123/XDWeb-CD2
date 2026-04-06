/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  // 1. Khai báo state để quản lý tab đang được chọn
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    revenue_trend: [],
    sales_by_category: [],
    recent_orders: [],
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
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
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryFormMode, setCategoryFormMode] = useState('create');
  const [categoryFormError, setCategoryFormError] = useState('');
  const [categoryFormSubmitting, setCategoryFormSubmitting] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: null,
    name: '',
    description: '',
  });
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
  const DASHBOARD_API = '/dashboard';
  const ORDER_API = '/order';
  const PRODUCT_API = import.meta.env.VITE_API_PRODUCT;
  const CATEGORY_API = '/category';
  const USER_API = '/users';

  // 2. Định nghĩa danh sách menu bên trái
  const sidebarMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'products', label: 'Products', icon: 'inventory_2' },
    { id: 'orders', label: 'Orders', icon: 'shopping_cart' },
    { id: 'customers', label: 'Customers', icon: 'group' },
    { id: 'category', label: 'Category', icon: 'warehouse' },
  ];

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price ?? 0);
  const formatDate = (value) => {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('vi-VN');
  };

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

  const getEmptyCategoryForm = () => ({
    id: null,
    name: '',
    description: '',
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

  const openNewCategoryForm = () => {
    setCategoryFormMode('create');
    setCategoryFormError('');
    setCategoryFormData(getEmptyCategoryForm());
    setCategoryFormOpen(true);
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

  const openEditCategoryForm = (category) => {
    setCategoryFormMode('edit');
    setCategoryFormError('');
    setCategoryFormData({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
    });
    setCategoryFormOpen(true);
  };

  const closeProductForm = () => {
    if (productFormSubmitting) {
      return;
    }

    setProductFormOpen(false);
    setProductFormError('');
    setProductFormData(getEmptyProductForm());
  };

  const closeCategoryForm = () => {
    if (categoryFormSubmitting) {
      return;
    }

    setCategoryFormOpen(false);
    setCategoryFormError('');
    setCategoryFormData(getEmptyCategoryForm());
  };

  const handleProductFormChange = (event) => {
    const { name, value } = event.target;

    setProductFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCategoryFormChange = (event) => {
    const { name, value } = event.target;

    setCategoryFormData((current) => ({
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

  const filteredOrders = orders.filter((order) => {
    const keyword = orderSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      String(order.id),
      order.user_name,
      order.user_email,
      order.payment_method,
      order.address,
      order.status === 1 ? 'paid' : 'pending',
      ...(Array.isArray(order.products) ? order.products.map((product) => product.product_name) : []),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });

  const filteredCategories = categories.filter((category) => {
    const keyword = categorySearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      category.name,
      category.description,
      String(category.id),
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword));
  });

  const loadDashboard = async () => {
    try {
      setDashboardLoading(true);
      setDashboardError('');

      const response = await fetch(`${BASE_URL_API}${DASHBOARD_API}`);

      if (!response.ok) {
        throw new Error(`Khong tai duoc dashboard (${response.status})`);
      }

      const data = await response.json();
      setDashboardData({
        summary: data?.summary || null,
        revenue_trend: Array.isArray(data?.revenue_trend) ? data.revenue_trend : [],
        sales_by_category: Array.isArray(data?.sales_by_category) ? data.sales_by_category : [],
        recent_orders: Array.isArray(data?.recent_orders) ? data.recent_orders : [],
      });
      setDashboardLoaded(true);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setDashboardError(error.message || 'Khong the tai dashboard');
    } finally {
      setDashboardLoading(false);
    }
  };

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

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');

      const response = await fetch(`${BASE_URL_API}${ORDER_API}`);

      if (!response.ok) {
        throw new Error(`Khong tai duoc danh sach don hang (${response.status})`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setOrdersLoaded(true);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrdersError(error.message || 'Khong the tai don hang');
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError('');

      const response = await fetch(`${BASE_URL_API}${CATEGORY_API}`);

      if (!response.ok) {
        throw new Error(`Khong tai duoc categories (${response.status})`);
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
      setCategoriesLoaded(true);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategoriesError(error.message || 'Khong the tai category');
    } finally {
      setCategoriesLoading(false);
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

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    setCategoryFormError('');

    const payload = {
      name: categoryFormData.name.trim(),
      description: categoryFormData.description.trim(),
    };

    if (!payload.name) {
      setCategoryFormError('Vui long nhap ten category.');
      return;
    }

    try {
      setCategoryFormSubmitting(true);

      const isEditing = categoryFormMode === 'edit' && categoryFormData.id;
      const response = await fetch(
        isEditing ? `${BASE_URL_API}${CATEGORY_API}/${categoryFormData.id}` : `${BASE_URL_API}${CATEGORY_API}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, 'Khong the luu category'));
      }

      const savedCategory = await response.json();

      setCategories((current) => {
        if (isEditing) {
          return current.map((category) => category.id === savedCategory.id ? savedCategory : category);
        }

        return [...current, savedCategory].sort((a, b) => a.id - b.id);
      });

      setProducts((current) => current.map((product) => {
        if (product.category_id !== savedCategory.id) {
          return product;
        }

        return {
          ...product,
          category: {
            ...(product.category || {}),
            ...savedCategory,
          },
        };
      }));

      setCategoriesLoaded(true);
      setCategoryFormOpen(false);
      setCategoryFormData(getEmptyCategoryForm());
    } catch (error) {
      console.error('Error saving category:', error);
      setCategoryFormError(error.message || 'Khong the luu category');
    } finally {
      setCategoryFormSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(`Ban co chac muon xoa category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL_API}${CATEGORY_API}/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, 'Khong the xoa category'));
      }

      setCategories((current) => current.filter((item) => item.id !== category.id));
    } catch (error) {
      console.error('Error deleting category:', error);
      window.alert(error.message || 'Khong the xoa category');
    }
  };

  const summary = dashboardData.summary || {
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    total_customers: 0,
    new_customers_this_month: 0,
    paid_orders: 0,
    pending_orders: 0,
    low_stock_products: 0,
    out_of_stock_products: 0,
  };

  const revenueTrend = dashboardData.revenue_trend;
  const salesByCategory = dashboardData.sales_by_category;
  const recentOrders = dashboardData.recent_orders;
  const maxRevenue = revenueTrend.reduce((max, item) => Math.max(max, Number(item.revenue || 0)), 0);
  const topCategory = salesByCategory[0] || null;
  const ordersRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const paidOrdersCount = filteredOrders.filter((order) => Number(order.status) === 1).length;
  const pendingOrdersCount = filteredOrders.filter((order) => Number(order.status) === 0).length;

  const getOrderStatusMeta = (status) => {
    if (Number(status) === 1) {
      return {
        label: 'Paid',
        className: 'bg-emerald-50 text-emerald-700',
      };
    }

    return {
      label: 'Pending',
      className: 'bg-amber-50 text-amber-700',
    };
  };

  useEffect(() => {
    if (activeTab !== 'dashboard' || dashboardLoaded) {
      return;
    }

    loadDashboard();
  }, [activeTab, dashboardLoaded, BASE_URL_API, DASHBOARD_API]);

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
    if (activeTab !== 'orders' || ordersLoaded) {
      return;
    }

    loadOrders();
  }, [activeTab, ordersLoaded, BASE_URL_API, ORDER_API]);

  useEffect(() => {
    if ((activeTab !== 'products' && activeTab !== 'category') || categoriesLoaded) {
      return;
    }

    loadCategories();
  }, [activeTab, categoriesLoaded, BASE_URL_API, CATEGORY_API]);

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

  const dashboardContent = (
    <div className="space-y-12">
      <section className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-[3.5rem] font-extrabold tracking-tight text-on-surface leading-tight mb-2">Admin Dashboard</h2>
            <p className="text-on-surface-variant text-lg font-medium">So lieu tong hop dang duoc lay truc tiep tu database.</p>
          </div>
          <button
            onClick={() => {
              setDashboardLoaded(false);
              loadDashboard();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-5 py-3 text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors self-start"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh Dashboard
          </button>
        </div>
      </section>

      {dashboardLoading ? (
        <div className="p-14 text-center text-slate-500 bg-surface-container-lowest rounded-[1.75rem] shadow-sm">
          <div className="inline-block h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
          <p className="mt-5 font-medium">Dang dong bo dashboard tu database...</p>
        </div>
      ) : dashboardError ? (
        <div className="p-14 text-center bg-surface-container-lowest rounded-[1.75rem] shadow-sm">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <p className="mt-4 text-lg font-bold text-slate-800">Khong the tai dashboard</p>
          <p className="mt-2 text-slate-500">{dashboardError}</p>
          <button
            onClick={() => {
              setDashboardLoaded(false);
              loadDashboard();
            }}
            className="mt-6 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Thu lai
          </button>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">{summary.paid_orders} paid</span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{formatPrice(summary.total_revenue)}d</h3>
            </div>

            <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">{summary.pending_orders} pending</span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{summary.total_orders}</h3>
            </div>

            <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-full">+{summary.new_customers_this_month} this month</span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Total Customers</p>
              <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{summary.total_customers}</h3>
            </div>

            <div className="p-8 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,88,188,0.04)] relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">{summary.out_of_stock_products} out</span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Total Products</p>
              <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{summary.total_products}</h3>
            </div>
          </section>

          <section className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-on-surface">Revenue by Month</h4>
                  <p className="text-on-surface-variant text-sm">Doanh thu 7 thang gan nhat tu bang orders.</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="px-4 py-2 bg-surface-container-low text-slate-600 font-bold rounded-full">Orders: {summary.total_orders}</span>
                  <span className="px-4 py-2 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20">Revenue: {formatPrice(summary.total_revenue)}d</span>
                </div>
              </div>
              {revenueTrend.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-slate-400 font-medium">
                  Chua co du lieu doanh thu.
                </div>
              ) : (
                <div className="relative h-[300px] w-full mt-4 flex items-end gap-3">
                  {revenueTrend.map((item) => {
                    const revenue = Number(item.revenue || 0);
                    const height = maxRevenue > 0 ? Math.max(12, Math.round((revenue / maxRevenue) * 100)) : 12;

                    return (
                      <div key={item.month} className="flex-1 flex flex-col justify-end items-center group h-full">
                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-primary to-primary-container transition-all shadow-lg shadow-primary/10 flex items-start justify-center pt-3" style={{ height: `${height}%` }}>
                          <span className="text-[10px] font-bold text-white/90 hidden xl:block">{formatPrice(revenue)}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-3">{item.label}</span>
                        <span className="text-[10px] text-slate-400">{item.orders} orders</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm flex flex-col">
              <h4 className="text-xl font-bold tracking-tight text-on-surface mb-2">Sales by Category</h4>
              <p className="text-sm text-on-surface-variant">Tong doanh thu theo category tu order details.</p>
              <div className="flex-1 flex items-center justify-center relative py-8">
                <div className="w-48 h-48 rounded-full border-[16px] border-primary/15 flex items-center justify-center relative">
                  <div className="absolute inset-3 rounded-full border-[14px] border-primary border-r-primary/20 border-b-primary/20"></div>
                  <div className="text-center z-10 bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-sm">
                    <p className="text-3xl font-extrabold text-on-surface">{topCategory ? `${topCategory.share}%` : '0%'}</p>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{topCategory?.name || 'No data'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 space-y-3">
                {salesByCategory.length === 0 ? (
                  <p className="text-sm text-slate-400">Chua co doanh thu theo category.</p>
                ) : (
                  salesByCategory.map((category, index) => (
                    <div key={category.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-indigo-300' : 'bg-slate-300'}`}></div>
                        <span className="text-sm font-medium text-on-surface-variant">{category.name}</span>
                      </div>
                      <span className="text-sm font-bold">{formatPrice(category.revenue)}d</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-on-surface">Recent Orders</h4>
                  <p className="text-sm text-on-surface-variant">5 don hang moi nhat trong database.</p>
                </div>
              </div>
              {recentOrders.length === 0 ? (
                <div className="py-10 text-center text-slate-400 font-medium">Chua co don hang nao.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-[0.2em]">
                      <tr>
                        <th className="px-4 py-4 text-left">Order</th>
                        <th className="px-4 py-4 text-left">Customer</th>
                        <th className="px-4 py-4 text-left">Total</th>
                        <th className="px-4 py-4 text-left">Payment</th>
                        <th className="px-4 py-4 text-left">Status</th>
                        <th className="px-4 py-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-t border-slate-200/60">
                          <td className="px-4 py-4 font-semibold text-slate-800">#{order.id}</td>
                          <td className="px-4 py-4 text-slate-700">{order.user_name}</td>
                          <td className="px-4 py-4 font-bold text-slate-900">{formatPrice(order.total)}d</td>
                          <td className="px-4 py-4 text-slate-700 uppercase">{order.payment_method || 'N/A'}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${order.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {order.status === 1 ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-700">{formatDate(order.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm">
              <h4 className="text-xl font-bold tracking-tight text-on-surface mb-6">Inventory Snapshot</h4>
              <div className="space-y-4">
                <div className="rounded-3xl bg-blue-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Low Stock</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{summary.low_stock_products}</p>
                  <p className="mt-2 text-sm text-slate-600">San pham con tu 1 den 5.</p>
                </div>
                <div className="rounded-3xl bg-red-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Out of Stock</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{summary.out_of_stock_products}</p>
                  <p className="mt-2 text-sm text-slate-600">San pham het hang trong database.</p>
                </div>
                <div className="rounded-3xl bg-emerald-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">Categories With Sales</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{salesByCategory.filter((item) => Number(item.revenue) > 0).length}</p>
                  <p className="mt-2 text-sm text-slate-600">Category da phat sinh doanh thu.</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );

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
                      : activeTab === 'orders'
                        ? 'Search orders by id, customer, product, payment...'
                      : activeTab === 'category'
                        ? 'Search categories by name, id, or description...'
                      : activeTab === 'customers'
                        ? 'Search users by name, username, email, or id...'
                        : 'Search orders, products, or customers...'
                  }
                  type="text"
                  value={
                    activeTab === 'products'
                      ? productSearch
                      : activeTab === 'orders'
                        ? orderSearch
                      : activeTab === 'category'
                        ? categorySearch
                        : activeTab === 'customers'
                          ? userSearch
                          : ''
                  }
                  onChange={(e) => {
                    if (activeTab === 'products') {
                      setProductSearch(e.target.value);
                    }

                    if (activeTab === 'orders') {
                      setOrderSearch(e.target.value);
                    }

                    if (activeTab === 'category') {
                      setCategorySearch(e.target.value);
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
            {activeTab === 'dashboard' ? dashboardContent : activeTab === 'dashboard-legacy' ? (
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
            ) : activeTab === 'orders' ? (
              <div className="space-y-8">
                <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Commerce</p>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Order Management</h2>
                    <p className="text-on-surface-variant mt-2">Danh sach don hang dang duoc lay truc tiep tu database.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-full lg:min-w-[420px]">
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Orders</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{orders.length}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Paid Orders</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{paidOrdersCount}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Filtered Revenue</p>
                      <p className="text-lg font-bold tracking-tight text-on-surface mt-3">{formatPrice(ordersRevenue)}d</p>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Pending</p>
                    <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-3">{pendingOrdersCount}</p>
                    <p className="text-sm text-on-surface-variant mt-2">Don hang chua thanh toan.</p>
                  </div>
                  <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Customers</p>
                    <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-3">{new Set(filteredOrders.map((order) => order.user_id)).size}</p>
                    <p className="text-sm text-on-surface-variant mt-2">So khach hang trong ket qua hien tai.</p>
                  </div>
                  <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Items Sold</p>
                    <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-3">{filteredOrders.reduce((sum, order) => sum + Number(order.items_count || 0), 0)}</p>
                    <p className="text-sm text-on-surface-variant mt-2">Tong so san pham trong cac don dang hien.</p>
                  </div>
                </section>

                <section className="bg-surface-container-lowest rounded-[1.75rem] shadow-sm overflow-hidden border border-slate-200/60">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b border-slate-200/60">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-on-surface">Live Order Table</h3>
                    </div>
                    <button
                      onClick={() => {
                        setOrdersLoaded(false);
                        loadOrders();
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">refresh</span>
                      Refresh Orders
                    </button>
                  </div>

                  {ordersLoading ? (
                    <div className="p-10 text-center text-slate-500">
                      <div className="inline-block h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
                      <p className="mt-4 font-medium">Dang tai danh sach don hang...</p>
                    </div>
                  ) : ordersError ? (
                    <div className="p-10 text-center">
                      <span className="material-symbols-outlined text-5xl text-red-400">error</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong the tai don hang</p>
                      <p className="mt-2 text-slate-500">{ordersError}</p>
                      <button
                        onClick={() => {
                          setOrdersLoaded(false);
                          loadOrders();
                        }}
                        className="mt-6 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Thu lai
                      </button>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                      <span className="material-symbols-outlined text-5xl text-slate-300">shopping_cart_off</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong co don hang phu hop</p>
                      <p className="mt-2">Thu doi tu khoa tim kiem hoac kiem tra lai du lieu backend.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-[0.2em]">
                          <tr>
                            <th className="px-6 py-4 text-left">Order</th>
                            <th className="px-6 py-4 text-left">Customer</th>
                            <th className="px-6 py-4 text-left">Items</th>
                            <th className="px-6 py-4 text-left">Total</th>
                            <th className="px-6 py-4 text-left">Payment</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => {
                            const statusMeta = getOrderStatusMeta(order.status);

                            return (
                              <tr key={order.id} className="border-t border-slate-200/60 hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="min-w-[220px]">
                                    <p className="font-bold text-slate-900">#{order.id}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2 max-w-md">{order.address || 'Chua co dia chi'}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="min-w-[220px]">
                                    <p className="font-bold text-slate-900">{order.user_name || 'Guest'}</p>
                                    <p className="text-xs text-slate-500">{order.user_email || '-'}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="min-w-[220px]">
                                    <p className="font-semibold text-slate-800">{order.items_count || 0} items</p>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                      {Array.isArray(order.products) && order.products.length > 0
                                        ? order.products.map((product) => `${product.product_name} x${product.quantity}`).join(', ')
                                        : 'Khong co san pham'}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(order.total)}d</td>
                                <td className="px-6 py-4 text-slate-700 uppercase">{order.payment_method || 'N/A'}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusMeta.className}`}>
                                    {statusMeta.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-700">{formatDate(order.created_at)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            ) : activeTab === 'category' ? (
              <div className="space-y-8">
                <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Catalog</p>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Category Management</h2>
                    <p className="text-on-surface-variant mt-2">Quan ly nhom san pham de admin co the them, sua va xoa category.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-full lg:min-w-[420px]">
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Categories</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{categories.length}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Visible Results</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{filteredCategories.length}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Empty Categories</p>
                      <p className="text-3xl font-extrabold tracking-tight text-on-surface mt-2">{categories.filter((category) => Number(category.products_count ?? 0) === 0).length}</p>
                    </div>
                  </div>
                  <button
                    onClick={openNewCategoryForm}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-5 py-3 text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">create_new_folder</span>
                    New Category
                  </button>
                </section>

                <section className="bg-surface-container-lowest rounded-[1.75rem] shadow-sm overflow-hidden border border-slate-200/60">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b border-slate-200/60">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-on-surface">Category Table</h3>
                    </div>
                    <button
                      onClick={() => {
                        setCategoriesLoaded(false);
                        loadCategories();
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">refresh</span>
                      Refresh Categories
                    </button>
                  </div>

                  {categoriesLoading ? (
                    <div className="p-10 text-center text-slate-500">
                      <div className="inline-block h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
                      <p className="mt-4 font-medium">Dang tai danh sach category...</p>
                    </div>
                  ) : categoriesError ? (
                    <div className="p-10 text-center">
                      <span className="material-symbols-outlined text-5xl text-red-400">error</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong the tai category</p>
                      <p className="mt-2 text-slate-500">{categoriesError}</p>
                      <button
                        onClick={() => {
                          setCategoriesLoaded(false);
                          loadCategories();
                        }}
                        className="mt-6 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Thu lai
                      </button>
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                      <span className="material-symbols-outlined text-5xl text-slate-300">folder_off</span>
                      <p className="mt-4 text-lg font-bold text-slate-800">Khong co category phu hop</p>
                      <p className="mt-2">Thu doi tu khoa tim kiem hoac tao category moi.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-[0.2em]">
                          <tr>
                            <th className="px-6 py-4 text-left">Category</th>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Description</th>
                            <th className="px-6 py-4 text-left">Products</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCategories.map((category) => (
                            <tr key={category.id} className="border-t border-slate-200/60 hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4 min-w-[220px]">
                                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined">category</span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{category.name}</p>
                                    <p className="text-xs text-slate-500">Updated {category.updated_at ? new Date(category.updated_at).toLocaleDateString('vi-VN') : '-'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-700">#{category.id}</td>
                              <td className="px-6 py-4 text-slate-700 max-w-md">{category.description || 'Chua co mo ta'}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${Number(category.products_count ?? 0) > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {category.products_count ?? 0} products
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openEditCategoryForm(category)}
                                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(category)}
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

          {categoryFormOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
              <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">
                      {categoryFormMode === 'edit' ? 'Update Category' : 'Create Category'}
                    </p>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-2">
                      {categoryFormMode === 'edit' ? 'Edit category information' : 'Add a new category'}
                    </h3>
                  </div>
                  <button
                    onClick={closeCategoryForm}
                    className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleCategorySubmit} className="px-8 py-6 space-y-6">
                  <label className="block">
                    <span className="block text-sm font-bold text-slate-700 mb-2">Category Name</span>
                    <input
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryFormChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="iPhone"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm font-bold text-slate-700 mb-2">Description</span>
                    <textarea
                      name="description"
                      value={categoryFormData.description}
                      onChange={handleCategoryFormChange}
                      rows="5"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Mo ta category de admin quan ly de hon"
                    />
                  </label>

                  {categoryFormError && (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {categoryFormError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeCategoryForm}
                      className="px-5 py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={categoryFormSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      <span className="material-symbols-outlined text-base">
                        {categoryFormMode === 'edit' ? 'save' : 'add_circle'}
                      </span>
                      {categoryFormSubmitting ? 'Saving...' : categoryFormMode === 'edit' ? 'Save Changes' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
