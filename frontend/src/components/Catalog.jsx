import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useParams, Navigate } from 'react-router-dom';
import api from '../api';
import { ArrowRight, ChevronRight, Truck, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { getProductUrl, getImageUrl } from '../utils/urls';
import { useCategories } from '../context/CategoryContext';
import SEOHead from './SEOHead';
import { OrderFormModal } from './new-home/OrderFormModal';
import FirewoodCategoryPage from './FirewoodCategoryPage';
import BriquettesCategoryPage from './BriquettesCategoryPage';
import CoalCategoryPage from './CoalCategoryPage';
import NotFound from './NotFound';
import { useSSGData } from '../context/SSGDataContext.jsx';



// ─── Benefit lines per product name keyword ─────────────────────────────────
function getBenefitLine(name = '') {
    const n = name.toLowerCase();
    if (n.includes('дуб')) return 'Горять довго, висока тепловіддача';
    if (n.includes('граб')) return 'Рівне горіння, мінімум іскор';
    if (n.includes('сосна') || n.includes('береза')) return 'Легко розпалюється, добрий жар';
    if (n.includes('ruf') || n.includes('нестро') || n.includes('pini')) return 'Не димлять, тривале горіння';
    if (n.includes('антрацит')) return 'Максимальна тепловіддача, мало золи';
    return 'Якісна продукція з доставкою';
}

// Sorting helpers
function sortProducts(arr, mode) {
    const copy = [...arr];
    if (mode === 'price_asc') return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (mode === 'price_desc') return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return copy; // 'popular' = original API order
}

export default function Catalog({ predefinedCategory }) {
    const { categorySlug } = useParams();
    const [searchParams] = useSearchParams();
    const { categories, loading: categoriesLoading } = useCategories();

    const categoryQuery = searchParams.get('category');
    const activeCategorySlug = predefinedCategory || categorySlug || categoryQuery;

    const ssgData = useSSGData();
    // Pre-populate products from SSG data for server-side rendering
    const ssgProducts = useMemo(() => {
        if (!ssgData?.products) return [];
        const items = Array.isArray(ssgData.products) ? ssgData.products : (ssgData.products.items || []);
        // Filter by active category for category pages
        if (activeCategorySlug) {
            return items.filter(p => p.category === activeCategorySlug);
        }
        return items;
    }, [ssgData, activeCategorySlug]);

    const [products, setProducts] = useState(ssgProducts);
    const [loading, setLoading] = useState(true);
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [orderProduct, setOrderProduct] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Усі');
    const [sortMode, setSortMode] = useState('popular');

    // Legacy redirect
    const oldSlugMap = {
        'firewood': 'drova',
        'briquettes': 'brikety',
        'coal': 'vugillya'
    };


    const activeCategory = categories.find(c => c.slug === activeCategorySlug);


    const seo = useMemo(() => {
        if (!activeCategory) return {};
        const cat = activeCategory;
        const fallbackDesc = cat.seo_text
            ? cat.seo_text.replace(/<[^>]*>/g, '').substring(0, 160)
            : undefined;
        return {
            title: activeCategorySlug === 'drova'
                ? 'Купити дрова у Києві — дуб, граб, береза | доставка | КиївБрикет'
                : (cat.meta_title || `${cat.name} — купити з доставкою по Києву`),
            description: cat.meta_description || fallbackDesc,
            ogDescription: activeCategorySlug === 'drova'
                ? 'Купити дрова у Києві з доставкою за 24 години. Дуб, граб, береза, вільха. Чесний складометр. КиївБрикет.'
                : (cat.meta_description || fallbackDesc),
            h1: cat.seo_h1 || cat.name,
            ogImage: cat.og_image || cat.image_url,
            canonical: cat.canonical_url || undefined,
        };
    }, [activeCategory]);

    useEffect(() => {
        setLoading(true);
        setActiveFilter('Усі');
        window.scrollTo(0, 0);
        api.get('/products/', { params: { category: activeCategorySlug } })
            .then(response => {
                const data = response.data;
                const fetched = Array.isArray(data) ? data : (data.items || []);
                if (fetched.length > 0) setProducts(fetched);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [activeCategorySlug]);


    const handleOrder = useCallback((product = null) => {
        setOrderProduct(product);
        setIsOrderFormOpen(true);
    }, []);

    const pageTitle = activeCategory ? (seo.h1 || activeCategory.name) : 'Каталог';

    // Filter + sort
    const displayedProducts = useMemo(() => {
        let filtered = products;
        if (activeFilter !== 'Усі') {
            filtered = products.filter(p =>
                p.name?.toLowerCase().includes(activeFilter.toLowerCase())
            );
        }
        return sortProducts(filtered, sortMode);
    }, [products, activeFilter, sortMode]);

    if (oldSlugMap[activeCategorySlug]) {
        return <Navigate to={`/catalog/${oldSlugMap[activeCategorySlug]}`} replace />;
    }

    if (!activeCategory && !loading && !categoriesLoading) {
        return <NotFound />;
    }


    return (
        <div
            className="new-home-scope"
            style={{
                minHeight: '100vh',
                background: 'var(--c-bg)',
                color: 'var(--c-text)',
                fontFamily: 'var(--font-outfit)',
                paddingTop: '64px',
            }}
        >
            {activeCategory && (
                <SEOHead
                    title={seo.title}
                    description={seo.ogDescription || seo.description}
                    ogImage={seo.ogImage}
                    canonical={seo.canonical}
                    robots={seo.robots}
                />
            )}

            {/* ── PREMIUM CATEGORY PAGE (Dynamic for all categories) ── */}
            {activeCategorySlug === 'brikety' ? (
                <BriquettesCategoryPage
                    products={displayedProducts}
                    onOrderProduct={handleOrder}
                    activeCategory={activeCategory}
                />
            ) : activeCategorySlug === 'vugillya' ? (
                <CoalCategoryPage
                    products={displayedProducts}
                    onOrderProduct={handleOrder}
                    activeCategory={activeCategory}
                />
            ) : (
                <FirewoodCategoryPage
                    products={displayedProducts}
                    seo={seo}
                    onOrderProduct={handleOrder}
                    activeCategory={activeCategory}
                    activeCategorySlug={activeCategorySlug}
                />
            )}

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => { setIsOrderFormOpen(false); setOrderProduct(null); }}
                product={orderProduct}
            />
        </div >
    );
}
