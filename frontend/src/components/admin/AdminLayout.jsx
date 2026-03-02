import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiShoppingBag,
  FiPackage,
  FiLayers,
  FiLogOut,
  FiHome,
  FiMenu,
  FiX,
  FiGrid,
  FiImage,
  FiMessageCircle,
  FiPlus,
} from "react-icons/fi";
import { Flame } from "lucide-react";
import { useCategories } from "../../context/CategoryContext";

export default function AdminLayout() {
  const { logout, token } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState({ orders: false });
  const [customPages, setCustomPages] = useState([]);

  const CORE_ROUTES = new Set(['/', '/delivery', '/contacts']);

  useEffect(() => {
    if (!token) return;
    api.get('/admin/pages', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (Array.isArray(res.data)) {
          setCustomPages(res.data.filter(p => !CORE_ROUTES.has(p.route_path)));
        }
      })
      .catch(() => { });
  }, [location.search, token]);

  const isActive = (path) => location.pathname === path;

  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get("category") || "all";
  const activeStatus = searchParams.get("status") || "all";

  const ORDER_STATUSES = [
    { id: "all", name: "Усі", icon: <FiGrid className="w-3.5 h-3.5" /> },
    { id: "pending", name: "Очікують", color: "bg-amber-400" },
    { id: "processing", name: "В роботі", color: "bg-blue-400" },
    { id: "completed", name: "Виконано", color: "bg-green-400" },
    { id: "cancelled", name: "Скасовано", color: "bg-gray-400" },
  ];

  const { categories } = useCategories();

  const MAIN_CATS = categories;

  const getEmoji = (slug) => {
    const emojis = {
      oak: "🌳",
      birch: "🌿",
      pine: "🌲",
      alder: "🔥",
      mixed: "🪵",
      brikety: "🧱",
    };
    return emojis[slug] || "✨";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.4)] flex-shrink-0">
            <Flame size={18} color="#fff" strokeWidth={2.2} />
          </span>
          <span className="font-black tracking-tight text-lg">
            <span className="text-gray-900">Київ</span>
            <span className="text-orange-500">Брикет</span>
            <span className="text-gray-400 font-medium ml-1.5 text-sm">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50 transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
      >
        <div className="p-6 border-b border-gray-100 hidden lg:flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.4)] flex-shrink-0">
            <Flame size={18} color="#fff" strokeWidth={2.2} />
          </span>
          <span className="font-black tracking-tight text-xl">
            <span className="text-gray-900">Київ</span>
            <span className="text-orange-500">Брикет</span>
            <span className="text-gray-400 font-medium ml-1.5 text-base">Admin</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-16 lg:mt-0">
          {/* Orders Parent Toggle */}
          <button
            onClick={() => setExpanded(p => ({ ...p, orders: !p.orders }))}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive("/admin/orders") || expanded.orders
              ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <div className="flex items-center gap-3">
              <FiShoppingBag className="w-5 h-5" />
              <span>Замовлення</span>
            </div>
            {expanded.orders ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            )}
          </button>

          {/* Order Status Sub-nav */}
          {(isActive("/admin/orders") || expanded.orders) && (
            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in">
              {ORDER_STATUSES.map((status) => (
                <Link
                  key={`order-${status.id}`}
                  to={`/admin/orders${status.id !== "all" ? `?status=${status.id}` : ""}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeStatus === status.id && isActive("/admin/orders")
                    ? "text-orange-500"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {status.icon ? (
                    status.icon
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full ${status.color}`}
                    ></span>
                  )}
                  <span>{status.name}</span>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/admin/products"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/products") ||
              location.pathname.startsWith("/admin/products/edit")
              ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <FiPackage className="w-5 h-5" />
            <span>Товари</span>
          </Link>

          {/* Main Categories Section */}
          {(isActive("/admin/products") ||
            location.pathname.startsWith("/admin/products/edit")) && (
              <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in">
                <Link
                  to="/admin/products"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeCategory === "all"
                    ? "text-orange-500"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <FiGrid className="w-3.5 h-3.5" />
                  <span>Усі товари</span>
                </Link>

                {MAIN_CATS.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/admin/products?category=${cat.slug}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeCategory === cat.slug
                      ? "text-orange-500"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <span>{getEmoji(cat.slug)}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}

          <Link
            to="/admin/categories"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/categories")
              ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <FiImage className="w-5 h-5" />
            <span>Категорії товарів</span>
          </Link>

          {/* Categories Sub-nav */}
          {isActive("/admin/categories") && (
            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in">
              {MAIN_CATS.map((cat) => (
                <Link
                  key={`edit-${cat.slug}`}
                  to={`/admin/categories?edit=${cat.slug}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get('edit') === cat.slug
                    ? "text-orange-500"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <span>{getEmoji(cat.slug)}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
              <Link
                to="/admin/categories?new=true"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-2 py-2 mt-1 pt-3 border-t border-gray-100 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get('new') === 'true'
                  ? "text-orange-500"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Додати категорію</span>
              </Link>
            </div>
          )}

          <Link
            to="/admin/seo"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/seo")
              ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <FiLayers className="w-5 h-5" />
            <span>Сторінки</span>
          </Link>

          {/* Page Sub-nav */}
          {isActive("/admin/seo") && (
            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in">
              {[
                { key: 'home', icon: '🏠', label: 'Головна', route: '/' },
                { key: 'delivery', icon: '🚚', label: 'Доставка', route: '/delivery' },
                { key: 'contacts', icon: '📞', label: 'Контакти', route: '/contacts' },
              ].map((p) => {
                const activePage = searchParams.get('page') || 'home';
                return (
                  <Link
                    key={p.key}
                    to={`/admin/seo?page=${p.key}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activePage === p.key && !searchParams.get('new') && !searchParams.get('custom')
                      ? "text-orange-500"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </Link>
                );
              })}
              {customPages.map((cp) => (
                <Link
                  key={`custom-${cp.route_path}`}
                  to={`/admin/seo?custom=${cp.route_path}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get('custom') === cp.route_path
                    ? "text-orange-500"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <span>📄</span>
                  <span>{cp.name}</span>
                </Link>
              ))}
              <Link
                to="/admin/seo?new=true"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get('new') === 'true'
                  ? "text-orange-500"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Додати сторінку</span>
              </Link>
            </div>
          )}

          <Link
            to="/admin/telegram"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/telegram")
              ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <FiMessageCircle className="w-5 h-5" />
            <span>Telegram</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-antreme-red mb-2 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            <span>На головну сайту</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Вийти</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
