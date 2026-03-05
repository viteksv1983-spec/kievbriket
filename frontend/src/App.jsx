import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import React, { Suspense } from 'react';

// Layouts (always needed)
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Critical path (Home is the landing page)
import Home from './components/Home';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
import NotFound from './components/NotFound';
// Critical SEO and Public Pages — statically imported to support SSR/SSG without Suspense fallback mismatch
import Catalog from './components/Catalog';
import ProductPage from './components/ProductPage';
import Delivery from './components/Delivery';
import Contacts from './components/Contacts';
import About from './components/About';
import DynamicPage from './components/DynamicPage';

// Non-critical pages — lazy-loaded to reduce initial bundle size
const Login = React.lazy(() => import('./components/Login'));
const Register = React.lazy(() => import('./components/Register'));
const Cart = React.lazy(() => import('./components/Cart'));

// Admin (lazy — never needed on public pages)
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const Orders = React.lazy(() => import('./components/admin/Orders'));
const Products = React.lazy(() => import('./components/admin/Products'));
const ProductEdit = React.lazy(() => import('./components/admin/ProductEdit'));
const PageEditor = React.lazy(() => import('./components/admin/PageEditor'));
const CategoryManager = React.lazy(() => import('./components/admin/CategoryManager'));
const SEOPages = React.lazy(() => import('./components/admin/SEOPages'));
const TelegramSettings = React.lazy(() => import('./components/admin/TelegramSettings'));
const SiteSettingsPage = React.lazy(() => import('./components/admin/SiteSettingsPage'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <GoogleAnalytics />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#A0153E] border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalog/:categorySlug" element={<Catalog />} />
              <Route path="/catalog/:categorySlug/:productSlug" element={<ProductPage />} />

              {/* System Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dostavka" element={<Delivery />} />
              <Route path="/kontakty" element={<Contacts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/pro-nas" element={<About />} />
              <Route path="/page/:slug" element={<DynamicPage />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="orders" replace />} />
                <Route path="orders" element={<Orders />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductEdit />} />
                <Route path="products/edit/:id" element={<ProductEdit />} />
                <Route path="seo" element={<PageEditor />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="telegram" element={<TelegramSettings />} />
                <Route path="settings" element={<SiteSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
