import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import api from '../api';
import { ArrowRight, ChevronRight, Truck, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { getProductUrl, getImageUrl } from '../utils/urls';
import { useCategories } from '../context/CategoryContext';
import SEOHead from './SEOHead';
import { OrderFormModal } from './new-home/OrderFormModal';

// ─── per-category SEO content ───────────────────────────────────────────────
const CATEGORY_SEO = {
    firewood: {
        trustItems: ['Дрова природної вологості', 'Доставка по Києву та області', 'Чесний складометр'],
        benefit: 'Колоті дрова твердих порід для опалення котлів, камінів та відкритого вогнища',
        seoH2: 'Купити дрова з доставкою у Києві',
        seoText: `
            <h3>Які дрова краще для опалення</h3>
            <p>Для постійного опалення будинку найкраще підходять дрова з твердих порід: дуб, граб та ясен. Вони горять значно довше і дають більше тепла порівняно з м'якими породами. Дубові дрова — класика для камінів і котлів тривалого горіння: щільна деревина повільно займається, але горить рівно і жарко.</p>
            <h3>Дрова для каміна та вуличних зон</h3>
            <p>Для каміна та вуличних мангалів рекомендуємо граб або вільху — породи, що майже не стріляють іскрами та горять стабільно. Соснові та берестові дрова ідеально підходять для швидкого розпалу та короткочасного обігріву — вони займаються легко та швидко.</p>
            <h3>Доставка дров по Києву та Київській області</h3>
            <p>Доставляємо дрова по всьому Києву та Київській області власним автопарком. Газель — до 6 складометрів, ЗІЛ або Камаз — до 15 складометрів. Стандартна доставка здійснюється наступного дня після оформлення замовлення. Оплата після отримання та перевірки об'єму — без передоплати.</p>
            <h3>Чому обирають нас</h3>
            <p>Ми продаємо дрова більше 10 років. Усі дрова щільно укладені в кузов складометрами — ви завжди отримаєте саме той обсяг, який замовили. Наша команда консультує з вибором породи та оптимального обсягу для вашого будинку або котельні.</p>
        `,
        filters: ['Усі', 'Дуб', 'Граб', 'Сосна', 'Береза'],
    },
    briquettes: {
        trustItems: ['RUF, Nestro, Pini Kay', 'Низька вологість < 10%', 'Висока калорійність'],
        benefit: 'Паливні брикети — компактна альтернатива дровам з вищою теплоємністю',
        seoH2: 'Купити паливні брикети з доставкою у Києві',
        seoText: `
            <h3>Чим брикети кращі за дрова</h3>
            <p>Паливні брикети мають значно нижчу вологість (до 8–10%) та вищу теплоємність, ніж звичайні дрова. Вони горять рівно і довго — один брикет горить у 2–3 рази довше за таке ж поліно. Ідеально підходять для котлів тривалого горіння, камінів та печей.</p>
            <h3>Типи паливних брикетів</h3>
            <p>RUF — класичний прямокутний брикет, зручний для зберігання та завантаження в котел. Nestro — циліндричні брикети з отвором, чудово підходять для камінів. Pini Kay — шестигранні брикети преміум-класу з найвищою теплоємністю для котлів та печей.</p>
            <h3>Доставка брикетів по Києву та Київській області</h3>
            <p>Брикети доставляємо в упаковках або навалом. Власний автопарк дозволяє здійснювати доставку в день замовлення або на наступний день по всьому Києву та прилеглих районах.</p>
        `,
        filters: ['Усі', 'RUF', 'Nestro', 'Pini Kay'],
    },
    coal: {
        trustItems: ['Антрацит та газове вугілля', 'Фасування від 25 кг', 'Доставка по Києву'],
        benefit: 'Вугілля — максимальна тепловіддача для котлів та промислових печей',
        seoH2: 'Купити вугілля з доставкою у Києві',
        seoText: `
            <h3>Антрацит чи газове вугілля</h3>
            <p>Антрацит — вугілля найвищого ступеня вуглефікації з найвищою теплоємністю. Горить без диму і майже без запаху, залишає мінімум золи. Газове вугілля дешевше і добре підходить для котлів типу АУСВ та опалення виробничих приміщень.</p>
            <h3>Для якого обладнання підходить</h3>
            <p>Вугілля ідеально підходить для твердопаливних котлів, промислових печей та котелень. Важливо обирати фракцію відповідно до технічних вимог вашого котла — ми допоможемо з вибором.</p>
            <h3>Доставка вугілля по Києву та Київській області</h3>
            <p>Доставляємо вугілля навалом та у мішках по всьому Київському регіону. Мінімальне замовлення — від 1 тонни. Власний транспорт гарантує точний обсяг та своєчасну доставку.</p>
        `,
        filters: ['Усі', 'Антрацит', 'Газове'],
    },
};

const DEFAULT_SEO = {
    trustItems: ['Якісна продукція', 'Доставка по Києву та області', 'Чесний облік'],
    benefit: 'Якісне тверде паливо з доставкою по Києву та Київській області',
    seoH2: 'Купити тверде паливо з доставкою',
    seoText: '',
    filters: ['Усі'],
};

const TRUST_BAR_ITEMS = [
    { icon: '🚚', text: 'Доставка по Києву за 24 години' },
    { icon: '🔥', text: 'Дрова природної вологості' },
    { icon: '📏', text: 'Чесний складометр' },
    { icon: '💳', text: 'Оплата після отримання' },
];

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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [orderProduct, setOrderProduct] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Усі');
    const [sortMode, setSortMode] = useState('popular');

    const { categorySlug } = useParams();
    const [searchParams] = useSearchParams();
    const { categories } = useCategories();

    const categoryQuery = searchParams.get('category');
    const activeCategorySlug = predefinedCategory || categorySlug || categoryQuery;
    const activeCategory = categories.find(c => c.slug === activeCategorySlug);
    const catSeo = CATEGORY_SEO[activeCategorySlug] || DEFAULT_SEO;

    const seo = useMemo(() => {
        if (!activeCategory) return {};
        const cat = activeCategory;
        const fallbackDesc = cat.seo_text
            ? cat.seo_text.replace(/<[^>]*>/g, '').substring(0, 160)
            : undefined;
        return {
            title: cat.meta_title || `${cat.name} — купити з доставкою по Києву`,
            description: cat.meta_description || fallbackDesc,
            h1: cat.seo_h1 || cat.name,
            ogImage: cat.og_image || cat.image_url,
            canonical: cat.canonical_url || undefined,
            robots: cat.is_indexable === false ? 'noindex, nofollow' : undefined,
        };
    }, [activeCategory]);

    useEffect(() => {
        setLoading(true);
        setActiveFilter('Усі');
        window.scrollTo(0, 0);
        api.get('/products/', { params: { category: activeCategorySlug } })
            .then(response => {
                const data = response.data;
                setProducts(Array.isArray(data) ? data : (data.items || []));
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
                    description={seo.description}
                    ogImage={seo.ogImage}
                    canonical={seo.canonical}
                    robots={seo.robots}
                />
            )}

            {/* ── CATALOG PAGE (compact ecommerce layout) ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    marginBottom: '0.875rem',
                    fontSize: '0.8125rem', color: 'var(--c-text2)',
                }}>
                    <Link to="/" style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--c-orange)'}
                        onMouseLeave={e => e.target.style.color = 'var(--c-text2)'}
                    >Головна</Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>{pageTitle}</span>
                </nav>

                {/* H1 + subtitle block */}
                {/* Condense Hero Section: Title and Subtitle remain. Trust line is now truly ONE LINE via flex settings. */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="nh-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h1 className="h1" style={{ fontSize: '1.75rem', margin: 0 }}>
                            <span style={{ color: 'var(--c-orange)' }}>{pageTitle}</span> для опалення
                        </h1>
                        {!loading && (
                            <p style={{ fontSize: '0.9375rem', color: 'var(--c-text2)', margin: 0 }}>
                                {`${products.length} ${activeCategorySlug === 'briquettes' ? 'брикетів' : activeCategorySlug === 'coal' ? 'видів вугілля' : 'видів дров'
                                    } з доставкою по Києву та області`}
                            </p>
                        )}
                        <style>{`
                            .catalog-trust-line {
                                display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
                                margin-top: 0.5rem; border-top: 1px dashed var(--color-border-subtle); padding-top: 1rem;
                            }
                            @media (max-width: 500px) {
                                .catalog-trust-line { flex-direction: column; align-items: flex-start; gap: 6px; }
                            }
                        `}</style>
                        <div className="catalog-trust-line">
                            {[
                                'Доставка по Києву за 24 години',
                                'Чесний складометр',
                                'Оплата після отримання',
                            ].map((item, i) => (
                                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--c-text2)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    <span style={{ color: '#22C55E', fontWeight: 800 }}>✔</span>{item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters + Sort toolbar */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '0.75rem',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--color-border-subtle)',
                }}>
                    {/* Filter label + pill chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flexShrink: 1 }}>
                        <span style={{
                            fontSize: '0.875rem', color: 'var(--c-text2)',
                            fontWeight: 600, flexShrink: 0,
                        }}>Порода:</span>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '0.375rem',
                            overflowX: 'auto', scrollbarWidth: 'none',
                            flexShrink: 1,
                        }}>
                            {catSeo.filters.map(chip => {
                                const active = activeFilter === chip;
                                return (
                                    <button
                                        key={chip}
                                        onClick={() => setActiveFilter(chip)}
                                        style={{
                                            padding: '7px 18px',
                                            borderRadius: 999,
                                            border: active
                                                ? '2px solid var(--c-orange)'
                                                : '1.5px solid var(--color-border-subtle)',
                                            background: active
                                                ? 'rgba(249,115,22,0.14)'
                                                : 'var(--color-bg-elevated)',
                                            color: active ? 'var(--c-orange)' : 'var(--c-text2)',
                                            fontWeight: active ? 700 : 500,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            whiteSpace: 'nowrap',
                                            transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                                            flexShrink: 0,
                                        }}
                                        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--c-text)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; } }}
                                        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--c-text2)'; e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; } }}
                                    >
                                        {chip}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sort dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--c-text2)' }}>Сортування:</span>
                        <select
                            value={sortMode}
                            onChange={e => setSortMode(e.target.value)}
                            style={{
                                background: 'var(--color-bg-elevated)',
                                border: '1px solid var(--color-border-subtle)',
                                color: 'var(--c-text)',
                                borderRadius: 8, padding: '7px 12px',
                                fontSize: '0.8125rem', fontWeight: 600,
                                fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
                            }}
                        >
                            <option value="popular">За популярністю</option>
                            <option value="price_asc">За ціною ↑</option>
                            <option value="price_desc">За ціною ↓</option>
                        </select>
                    </div>
                </div>


                {/* ── PRODUCT GRID ── */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                        <div style={{
                            width: 48, height: 48,
                            border: '3px solid rgba(249,115,22,0.15)',
                            borderTopColor: 'var(--c-orange)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : displayedProducts.length === 0 ? (
                    <div className="nh-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <p className="body" style={{ marginBottom: 'var(--s-element)' }}>
                            {activeFilter !== 'Усі'
                                ? `Товарів за фільтром «${activeFilter}» не знайдено.`
                                : 'У цій категорії поки немає товарів.'}
                        </p>
                        {activeFilter !== 'Усі' ? (
                            <button
                                onClick={() => setActiveFilter('Усі')}
                                style={{
                                    display: 'inline-flex', gap: 8, alignItems: 'center',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    color: '#fff', fontWeight: 700, borderRadius: 10, padding: '12px 24px',
                                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                Показати всі
                            </button>
                        ) : (
                            <Link to="/" style={{
                                display: 'inline-flex', gap: 8, alignItems: 'center',
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                color: '#fff', fontWeight: 700, borderRadius: 10, padding: '12px 24px',
                                textDecoration: 'none',
                            }}>
                                На головну
                            </Link>
                        )}
                    </div>
                ) : (
                    <>

                        {/* Card hover CSS */}
                        <style>{`
                            .catalog-card {
                                transition: transform 0.25s ease, box-shadow 0.25s ease;
                                cursor: pointer;
                            }
                            .catalog-card:hover {
                                transform: translateY(-6px);
                                box-shadow: 0 18px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(249,115,22,0.12);
                            }
                            .catalog-card:hover .catalog-card-img {
                                transform: scale(1.05);
                                filter: brightness(1.03);
                            }
                            .catalog-card-img {
                                transition: transform 0.3s ease;
                                width: 100%; height: 100%; object-fit: cover; display: block;
                            }
                            .catalog-card-img-placeholder {
                                width: 100%; height: 100%;
                                display: flex; align-items: center; justify-content: center;
                                background: linear-gradient(135deg, rgba(249,115,22,0.06), rgba(249,115,22,0.02));
                                color: var(--c-text2); font-size: 2.5rem;
                            }
                            .catalog-card-btn {
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                                background: linear-gradient(135deg, #f97316, #ea580c);
                                color: #fff;
                                font-weight: 700;
                                font-size: 0.875rem;
                                border: none;
                                border-radius: 10px;
                                padding: 11px 20px;
                                cursor: pointer;
                                box-shadow: 0 4px 14px rgba(249,115,22,0.25);
                                transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
                                font-family: inherit;
                                white-space: nowrap;
                                flex-shrink: 0;
                            }
                            .catalog-card-btn:hover {
                                background: linear-gradient(135deg, #fb923c, #f97316);
                                box-shadow: 0 6px 18px rgba(249,115,22,0.45);
                                transform: translateY(-1px);
                            }
                            @media (max-width: 500px) {
                                .catalog-card:hover { transform: none; box-shadow: none; }
                                .catalog-card-btn { width: 100%; justify-content: center; }
                            }
                        `}</style>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {displayedProducts.map((product, idx) => {
                                const displayPrice = product.variants?.length > 0
                                    ? product.variants[0].price
                                    : product.price;
                                const isPopular = idx < 2;
                                const benefit = getBenefitLine(product.name);

                                return (
                                    <Link
                                        key={product.id}
                                        to={getProductUrl(product)}
                                        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <article
                                            className="nh-card catalog-card"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                flex: 1,
                                            }}
                                        >
                                            {/* ── IMAGE ── */}
                                            <div style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                                                {product.image_url ? (
                                                    <img
                                                        src={getImageUrl(product.image_url, api.defaults.baseURL)}
                                                        alt={product.name}
                                                        className="catalog-card-img"
                                                        onError={e => { e.target.onerror = null; e.target.src = '/assets/product-placeholder-wood.webp'; }}
                                                    />
                                                ) : (
                                                    <div className="catalog-card-img-placeholder">
                                                        🪵
                                                    </div>
                                                )}
                                                {/* gradient overlay */}
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,16,0.65) 0%, transparent 55%)', pointerEvents: 'none' }} />

                                                {/* Top Left: Availability Overlay Badge */}
                                                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                                        background: 'rgba(34,197,94,0.85)',
                                                        color: '#fff',
                                                        borderRadius: 999,
                                                        padding: '4px 10px',
                                                        fontSize: '0.7rem', fontWeight: 700,
                                                        letterSpacing: '0.02em',
                                                        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                                    }}>
                                                        ✔ В наявності
                                                    </span>
                                                </div>

                                                {/* Top Right: Popularity Overlay Badge */}
                                                {isPopular && (
                                                    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center',
                                                            background: 'rgba(249,115,22,0.9)',
                                                            color: '#fff',
                                                            borderRadius: 999,
                                                            padding: '4px 10px',
                                                            fontSize: '0.7rem', fontWeight: 700,
                                                            letterSpacing: '0.04em', textTransform: 'uppercase',
                                                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                                        }}>
                                                            🔥 Популярний
                                                        </span>
                                                    </div>
                                                )}

                                            </div>


                                            {/* ── CONTENT ── */}
                                            <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>

                                                {/* Title row */}
                                                <h3 className="h3" style={{ margin: 0, marginBottom: 8, transition: 'color 0.2s', lineHeight: 1.25, fontWeight: 700 }}>
                                                    {product.name}
                                                </h3>


                                                {/* Description — fixed min-height for grid consistency */}
                                                <p className="body-sm" style={{
                                                    minHeight: '2.8em',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                    marginBottom: 16,
                                                    opacity: 0.8,
                                                }}>
                                                    {product.description || 'Якісне тверде паливо з доставкою по Києву та Київській області.'}
                                                </p>

                                                {/* Tags / variants */}
                                                {product.variants?.length > 0 && (
                                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                                                        {product.variants.slice(0, 3).map((v, i) => (
                                                            <span key={i} style={{
                                                                fontSize: '0.72rem', color: 'var(--c-text2)',
                                                                background: 'var(--c-surface)', borderRadius: 6,
                                                                padding: '2px 8px', border: '1px solid var(--c-border)',
                                                            }}>{v.name}</span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Price + CTA */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    paddingTop: 14, borderTop: '1px solid var(--color-border-subtle)',
                                                    marginTop: 'auto', gap: 12,
                                                }}>
                                                    {/* Price block — dominant */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--c-orange)', lineHeight: 1, margin: 0 }}>
                                                            {displayPrice} <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-orange)' }}>грн</span>
                                                        </p>
                                                        <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: 0 }}>
                                                            за 1 складометр
                                                        </p>
                                                    </div>

                                                    <button
                                                        className="catalog-card-btn"
                                                        onClick={(e) => { e.preventDefault(); handleOrder(product); }}
                                                    >
                                                        Замовити <ArrowRight size={14} />
                                                    </button>
                                                </div>

                                                {/* Micro-info */}
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: 10 }}>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        🚚 Доставка сьогодні
                                                    </span>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        ✔ Є на складі
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>

            {/* ── SEO TEXT SECTION ── */}
            {
                !loading && (
                    <section style={{ maxWidth: 1200, margin: '3rem auto 0', padding: '0 1.5rem' }}>
                        <div className="nh-card" style={{ padding: '2.5rem 3rem' }}>
                            <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
                                {activeCategory?.seo_text ? catSeo.seoH2 : `Купити ${activeCategorySlug === 'briquettes' ? 'брикети' : activeCategorySlug === 'coal' ? 'вугілля' : 'дрова'} для опалення в Києві`}
                            </h2>
                            <div
                                style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '0.9375rem' }}
                                dangerouslySetInnerHTML={{
                                    __html: activeCategory?.seo_text || `
                                    <p style="margin-bottom: 1rem;">
                                        Забезпечте свій дім надійним теплом з нашими дровами для опалення. Ми пропонуємо
                                        виключно високоякісні тверді породи деревини (дуб, граб, ясен), які забезпечують
                                        довготривале горіння та максимальну тепловіддачу. Ідеально підходить для твердопаливних
                                        котлів, печей та камінів.
                                    </p>
                                    <p>
                                        Ми гарантуємо чесний рівно складений об'єм (складометр) та швидку доставку по Києву
                                        та всій Київській області. Оплата здійснюється тільки після отримання та перевірки
                                        на місці — жодних передоплат і ризиків. Доставка можлива день у день!
                                    </p>
                                `
                                }}
                            />
                        </div>
                    </section>
                )
            }

            {/* ── CTA CONVERSION BLOCK ── */}
            {
                !loading && (
                    <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--s-section) 1.5rem' }}>
                        <div style={{
                            borderRadius: 16,
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border-orange)',
                            padding: '2.5rem 2rem',
                            display: 'flex', flexWrap: 'wrap', gap: '1.5rem',
                            alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div>
                                <h2 className="h2" style={{ marginBottom: '0.5rem' }}>
                                    Не знаєте, які <span style={{ color: 'var(--c-orange)' }}>{pageTitle.toLowerCase()}</span> обрати?
                                </h2>
                                <p className="body" style={{ maxWidth: 480 }}>
                                    Наш менеджер безкоштовно допоможе підібрати оптимальний варіант під ваш котел або камін та розрахує точну вартість доставки.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => handleOrder()}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        background: 'transparent',
                                        color: 'var(--c-text)', fontWeight: 700, fontSize: '0.9375rem',
                                        border: '1px solid var(--color-border-medium)',
                                        borderRadius: 10, padding: '13px 24px',
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'border-color 0.2s, background 0.2s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--color-border-orange)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--color-border-medium)';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <MessageCircle size={16} /> Консультація
                                </button>
                                <button
                                    onClick={() => handleOrder()}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                        color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
                                        border: 'none', borderRadius: 10, padding: '14px 24px',
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        boxShadow: '0 4px 18px rgba(249,115,22,0.25)',
                                        transition: 'box-shadow 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 26px rgba(249,115,22,0.45)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(249,115,22,0.25)'}
                                >
                                    <Truck size={16} /> Замовити доставку
                                </button>
                            </div>
                        </div>
                    </section>
                )
            }

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => { setIsOrderFormOpen(false); setOrderProduct(null); }}
                product={orderProduct}
            />
        </div >
    );
}
