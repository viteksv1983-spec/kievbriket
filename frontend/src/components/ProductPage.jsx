import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Truck, ChevronRight, Ruler, Scale, Flame, Info, ArrowRight, CheckCircle2, ChevronDown, PackageCheck } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { getCategoryUrl, getImageUrl } from '../utils/urls';
import api from '../api';
import { OrderFormModal } from './new-home/OrderFormModal';
import SEOHead from './SEOHead';
import { useSSGData } from '../context/SSGDataContext';
import DeliveryOptionsDrova from './DeliveryOptionsDrova';

export default function ProductPage() {
    const { categorySlug, productSlug } = useParams();
    const ssgData = useSSGData();

    // During SSG: find product from pre-fetched data immediately (no loading spinner)
    const ssgProduct = ssgData?.products
        ? (() => {
            const items = Array.isArray(ssgData.products) ? ssgData.products : (ssgData.products.items || []);
            return items.find(p => p.slug === productSlug) || null;
        })()
        : null;

    const ssgRelated = ssgProduct && ssgData?.products
        ? (() => {
            const items = Array.isArray(ssgData.products) ? ssgData.products : (ssgData.products.items || []);
            return items.filter(p => p.category === ssgProduct.category && p.slug !== ssgProduct.slug).slice(0, 3);
        })()
        : [];

    const [product, setProduct] = useState(ssgProduct);
    const [relatedProducts, setRelatedProducts] = useState(ssgRelated);
    const [loading, setLoading] = useState(!ssgProduct);
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(ssgProduct?.variants?.[0] || null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);
    const { categories } = useCategories();

    // Legacy redirect
    const oldSlugMap = {
        'firewood': 'drova',
        'briquettes': 'brikety',
        'coal': 'vugillya'
    };


    const specificationsArray = (() => {
        if (!product?.specifications_json) return [];
        try {
            if (Array.isArray(product.specifications_json)) return product.specifications_json;
            if (typeof product.specifications_json === "string") return JSON.parse(product.specifications_json);
            if (typeof product.specifications_json === "object") return Object.values(product.specifications_json);
            return [];
        } catch (e) {
            return [];
        }
    })();

    const specs = specificationsArray.length > 0 ? specificationsArray.map(s => ({
        icon: <CheckCircle2 size={17} color="var(--c-orange)" />,
        label: s.name || s.label,
        value: s.value
    })) : product ? [
        { icon: <Flame size={17} color="var(--c-orange)" />, label: 'Порода', value: product.ingredients || (product.name.toLowerCase().includes('дуб') ? 'Дуб' : (product.name.toLowerCase().includes('сосн') ? 'Сосна' : (product.name.toLowerCase().includes('граб') ? 'Граб' : (product.category === 'brikety' ? 'Деревна тирса' : 'Тверді породи')))) },
        { icon: <CheckCircle2 size={17} color="var(--c-orange)" />, label: 'Тип', value: product.category === 'drova' ? 'Колоті, Ящик' : (product.category === 'brikety' ? 'Пресовані' : 'Сипуче') },
        product.category === 'brikety'
            ? { icon: <Ruler size={17} color="var(--c-orange)" />, label: 'Форма брикетів', value: product.name.toLowerCase().includes('ruf') ? 'Прямокутні пресовані' : product.name.toLowerCase().includes('pini') ? 'Восьмигранні з отвором' : product.name.toLowerCase().includes('nestro') ? 'Циліндричні' : product.name.toLowerCase().includes('пелет') ? 'Гранули 6-8 мм' : 'Пресований торф' }
            : { icon: <Ruler size={17} color="var(--c-orange)" />, label: 'Довжина полін', value: product.category === 'drova' ? '30-40 см' : '—' },
        { icon: <Scale size={17} color="var(--c-orange)" />, label: 'Фасування', value: product.category === 'drova' ? 'Складометр' : 'У пакуваннях / піддонах' },
        { icon: <Flame size={17} color="var(--c-orange)" />, label: 'Вологість', value: product.category === 'drova' ? 'Природна (До 25%)' : (product.category === 'brikety' ? '8-10%' : 'До 8%') },
        { icon: <Truck size={17} color="var(--c-orange)" />, label: 'Доставка', value: 'По Києву та області' },
    ] : [];

    const deliveryInfoObj = (() => {
        if (!product?.delivery_info_json) return null;
        try {
            if (typeof product.delivery_info_json === "string") return JSON.parse(product.delivery_info_json);
            if (typeof product.delivery_info_json === "object") return product.delivery_info_json;
            return null;
        } catch (e) {
            return null;
        }
    })();

    const orderStepsArray = (() => {
        if (!product?.order_steps_json) return [];
        try {
            if (Array.isArray(product.order_steps_json)) return product.order_steps_json;
            if (typeof product.order_steps_json === "string") return JSON.parse(product.order_steps_json);
            if (typeof product.order_steps_json === "object") return Object.values(product.order_steps_json);
            return [];
        } catch (e) {
            return [];
        }
    })();


    const faqsArray = (() => {
        if (!product?.faqs_json) return [];
        try {
            if (Array.isArray(product.faqs_json)) {
                return product.faqs_json;
            }
            if (typeof product.faqs_json === "string") {
                return JSON.parse(product.faqs_json);
            }
            if (typeof product.faqs_json === "object") {
                return Object.values(product.faqs_json);
            }
            return [];
        } catch (e) {
            return [];
        }
    })();

    const faqs = faqsArray.length > 0 ? faqsArray : product ? (product.category === 'brikety' ? [
        { q: `Які брикети краще для опалення?`, a: `Для максимальної тепловіддачі та тривалого горіння найкраще підходять дубові брикети RUF або Pini Kay. Якщо у вас котел тривалого горіння, Nestro також стануть чудовим вибором. Для автоматичних котлів використовують пелети.` },
        { q: `Скільки горять паливні брикети?`, a: `Залежно від типу котла та подачі кисню, брикети горять від 2 до 4 годин, після чого можуть тліти ще кілька годин, підтримуючи високу температуру.` },
        { q: `Чим брикети відрізняються від дров?`, a: `Брикети мають вищу щільність і набагато нижчу вологість (до 10%), тому вони віддають більше тепла. Крім того, вони займають менше місця при зберіганні та залишають значно менше попелу.` },
        { q: `Чи підходять брикети для камінів?`, a: `Так, особливо брикети RUF та Pini Kay. Вони горять рівним полум'ям, не іскрять і не виділяють зайвого диму, що робить їх ідеальними для відкритих та закритих камінів.` },
        { q: `Як замовити брикети з доставкою по Києву?`, a: `Оберіть потрібний тип та кількість брикетів на сайті, натисніть "Замовити", і наш менеджер зв'яжеться з вами для уточнення деталей доставки. Ми доставляємо власною технікою протягом 24 годин.` }
    ] : [
        { q: `Які дрова краще для опалення?`, a: `${product.ingredients || 'Дубові'} дрова вважаються одними з найкращих для опалення завдяки високій щільності деревини та тривалому горінню. Вони дають стабільний жар і підходять для твердопаливних котлів, печей та камінів.` },
        { q: `Яка довжина полін у дров?`, a: `Стандартна довжина полін — 30-40 см. Це оптимальний розмір для більшості побутових котлів та печей.` },
        { q: `Скільки дров потрібно на зиму?`, a: `Для опалення будинку площею 100 м² на один опалювальний сезон потрібно приблизно 8-12 складометрів дров, залежно від утеплення та типу котла.` },
        { q: `Як відбувається доставка?`, a: `Доставка дров здійснюється власним автопарком: ГАЗель (2 склм), ЗІЛ (5 склм), КАМАЗ (10 склм). Також доступні гідроборт та кран-маніпулятор. Доставка по Києву та області протягом 24 годин.` },
        { q: `Який об\u02BCєм складометра?`, a: `Складометр \u2014 це щільно укладене паливо в об\u02BCємі 1×1×1 метр. Ми завжди гарантуємо чесний об\u02BCєм при завантаженні автомобіля.` }
    ]) : [];

    useEffect(() => {
        // Skip fetch if we already have SSG data (first render after hydration)
        if (ssgProduct && !product?.slug?.length) return;
        window.scrollTo(0, 0);
        setLoading(true);
        setActiveImageIndex(0);

        api.get(`/products/${productSlug}`)
            .then(res => {
                const found = res.data;
                setProduct(found);

                if (found?.variants?.length > 0) {
                    setSelectedVariant(found.variants[0]);
                }

                // Fetch related products
                api.get(`/products/?category=${found.category}&limit=5`)
                    .then(relRes => {
                        const relData = relRes.data;
                        const items = Array.isArray(relData) ? relData : (relData.items || []);
                        const related = items.filter(p => p.slug !== found.slug).slice(0, 3);
                        setRelatedProducts(related);
                    })
                    .catch(err => console.error("Failed to fetch related products:", err))
                    .finally(() => setLoading(false));
            })
            .catch(() => setLoading(false));
    }, [productSlug]);

    const category = categories.find(c => c.slug === (categorySlug || product?.category));

    // Gather all images — use production domain during SSG, API domain on client
    const PROD_DOMAIN = 'https://kievdrova.com.ua';
    const isSSG = !!ssgData;
    const imgBase = isSSG ? PROD_DOMAIN : api.defaults.baseURL;
    const mainImg = product?.image_url ? getImageUrl(product.image_url, imgBase) : '';
    const img2 = product?.image_url_2 ? getImageUrl(product.image_url_2, imgBase) : '';
    const img3 = product?.image_url_3 ? getImageUrl(product.image_url_3, imgBase) : '';
    const galleryImages = [mainImg, img2, img3].filter(Boolean);

    const displayPrice = selectedVariant ? selectedVariant.price : product?.price;
    const isPopular = product?.is_popular || true; // Simulate feature for demo if not provided

    if (oldSlugMap[categorySlug]) {
        return <Navigate to={`/catalog/${oldSlugMap[categorySlug]}/${productSlug}`} replace />;
    }


    if (loading) {
        return (
            <div className="new-home-scope" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)', fontFamily: 'var(--font-outfit)' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(249,115,22,0.15)', borderTopColor: 'var(--c-orange)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="new-home-scope" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)', fontFamily: 'var(--font-outfit)', gap: '1.5rem' }}>
                <h1 className="h2">Товар не знайдено</h1>
                <Link to="/catalog/drova" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#fff', fontWeight: 700, borderRadius: 10, padding: '12px 24px',
                    textDecoration: 'none',
                }}>
                    До каталогу <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    // Schemas are handled by generate-seo-pages.js during SSG (consolidated @graph)
    // SEOHead is used here ONLY for client-side navigation (no schema to avoid duplicates)

    const dynamicTitle = product.meta_title || `Купити ${product.name.toLowerCase()} з доставкою по Києву — ціна за складометр | КиївБрикет`;

    const briketShortName = product?.name ? product.name.split('—')[0].split('- ')[0].trim() : '';
    const briketAlt = briketShortName.replace(/\(|\)/g, '').replace(/\s+/g, ' ');

    let briketH2 = `Характеристики ${briketShortName.toLowerCase()}`;
    let briketDesc = `Опис ${briketShortName.toLowerCase()}`;

    if (briketShortName.toLowerCase().startsWith('брикети')) {
        briketH2 = briketShortName.replace(/^Брикети/i, 'Характеристики брикетів');
        briketDesc = briketShortName.replace(/^Брикети/i, 'Опис брикетів');
    } else if (briketShortName.toLowerCase().startsWith('паливні брикети')) {
        briketH2 = briketShortName.replace(/^Паливні брикети/i, 'Характеристики паливних брикетів');
        briketDesc = briketShortName.replace(/^Паливні брикети/i, 'Опис паливних брикетів');
    } else if (briketShortName.toLowerCase().startsWith('торфобрикети')) {
        briketH2 = briketShortName.replace(/^Торфобрикети/i, 'Характеристики торфобрикетів');
        briketDesc = briketShortName.replace(/^Торфобрикети/i, 'Опис торфобрикетів');
    } else if (briketShortName.toLowerCase().startsWith('вугільні брикети')) {
        briketH2 = briketShortName.replace(/^Вугільні брикети/i, 'Характеристики вугільних брикетів');
        briketDesc = briketShortName.replace(/^Вугільні брикети/i, 'Опис вугільних брикетів');
    } else if (briketShortName.toLowerCase().startsWith('пелети')) {
        briketH2 = briketShortName.replace(/^Пелети/i, 'Характеристики пелет');
        briketDesc = briketShortName.replace(/^Пелети/i, 'Опис пелет');
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
            <SEOHead
                title={dynamicTitle}
                description={product.meta_description || product.description || `Замовляйте ${product.name.toLowerCase()} з швидкою доставкою по Києву та області.`}
                ogImage={product.og_image || product.image_url}
                canonical={product.canonical_url}
                productPrice={product.price}
                productCurrency="UAH"
            />

            {/* ── Breadcrumbs ── */}
            <div style={{
                background: 'var(--color-bg-deep)',
                borderBottom: '1px solid var(--color-border-subtle)',
                padding: '1rem 0',
            }}>
                <nav className="breadcrumbs-container" style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: '0.8125rem', color: 'var(--c-text2)',
                }}>
                    <Link to="/" style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--c-orange)'}
                        onMouseLeave={e => e.target.style.color = 'var(--c-text2)'}
                    >Головна</Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <Link
                        to={category ? getCategoryUrl(category.slug) : (product?.category === 'drova' ? '/catalog/drova' : '/catalog')}
                        style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--c-orange)'}
                        onMouseLeave={e => e.target.style.color = 'var(--c-text2)'}
                    >
                        {category ? category.name : (product?.category === 'drova' ? 'Дрова' : 'Каталог')}
                    </Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <span style={{ color: 'var(--c-text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                        {product.name}
                    </span>
                </nav>
            </div>

            {/* ── Mobile-only Title (above image) ── */}
            <div className="product-mobile-title" style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 1.5rem 0', textAlign: 'center' }}>
                <div className="product-mobile-h1" style={{ fontSize: 'clamp(22px, 5vw, 28px)', lineHeight: 1.15, margin: 0, fontWeight: 700 }}>
                    {product.category === 'brikety' ? (product.seo_h1 || product.name) : product.name}
                </div>
            </div>

            {/* ── Main Content ── */}
            <section className="product-main-content" style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--s-section) 1.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3rem',
                }}>
                    {/* ── Left: Image Gallery ── */}
                    <div style={{ position: 'sticky', top: '6rem' }}>
                        <div className="product-gallery-main" style={{
                            borderRadius: 20,
                            overflow: 'hidden',
                            aspectRatio: '4/3',
                            position: 'relative',
                            background: '#1a1f2b',
                            border: '1px solid rgba(255,255,255,0.06)',
                            marginBottom: '0.75rem',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                        }}>
                            {galleryImages.length > 0 ? (
                                <img
                                    key={activeImageIndex}
                                    src={galleryImages[activeImageIndex]}
                                    alt={product.category === 'brikety' ? briketAlt : product.name}
                                    width="600"
                                    height="450"
                                    loading={activeImageIndex === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://placehold.co/600x450/333/ccc?text=${encodeURIComponent(product.name)}`;
                                    }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.35s ease-in-out' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-text2)' }}>
                                    Немає фото
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => {
                                            const newI = activeImageIndex === 0 ? galleryImages.length - 1 : activeImageIndex - 1;
                                            setActiveImageIndex(newI);
                                            if (product?.variants?.length > 1 && newI < product.variants.length) {
                                                setSelectedVariant(product.variants[newI]);
                                            }
                                        }}
                                        aria-label="Попереднє фото"
                                        className="gallery-arrow gallery-arrow-left"
                                        style={{
                                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                            width: 40, height: 40, borderRadius: '50%',
                                            background: 'rgba(240,240,240,0.85)', backdropFilter: 'blur(4px)',
                                            border: 'none', color: '#666',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', padding: 0,
                                            transition: 'all 0.2s ease',
                                            zIndex: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.color = '#333'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,240,240,0.85)'; e.currentTarget.style.color = '#666'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newI = activeImageIndex === galleryImages.length - 1 ? 0 : activeImageIndex + 1;
                                            setActiveImageIndex(newI);
                                            if (product?.variants?.length > 1 && newI < product.variants.length) {
                                                setSelectedVariant(product.variants[newI]);
                                            }
                                        }}
                                        aria-label="Наступне фото"
                                        className="gallery-arrow gallery-arrow-right"
                                        style={{
                                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                            width: 40, height: 40, borderRadius: '50%',
                                            background: 'rgba(240,240,240,0.85)', backdropFilter: 'blur(4px)',
                                            border: 'none', color: '#666',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', padding: 0,
                                            transition: 'all 0.2s ease',
                                            zIndex: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.color = '#333'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,240,240,0.85)'; e.currentTarget.style.color = '#666'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {galleryImages.length > 1 && (
                            <div className="product-thumbnails" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                                {galleryImages.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveImageIndex(idx);
                                            if (product?.variants?.length > 1 && idx < product.variants.length) {
                                                setSelectedVariant(product.variants[idx]);
                                            }
                                        }}
                                        style={{
                                            width: 72, height: 72, borderRadius: 12, flexShrink: 0,
                                            border: activeImageIndex === idx ? '2px solid var(--c-orange)' : '1px solid rgba(255,255,255,0.08)',
                                            background: '#1a1f2b', cursor: 'pointer', overflow: 'hidden',
                                            padding: 0, transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                                            transform: activeImageIndex === idx ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: activeImageIndex === idx ? '0 0 0 3px rgba(249,115,22,0.2), 0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.15)',
                                            opacity: activeImageIndex === idx ? 1 : 0.7,
                                        }}
                                    >
                                        <img
                                            src={src}
                                            alt={`мініатюра ${idx + 1}`}
                                            width="72"
                                            height="72"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://placehold.co/72x72/333/ccc?text=${idx + 1}`;
                                            }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Info ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* ── Title & Badges ── */}
                        <div className="product-desktop-title" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h1 className="h1" style={{ fontSize: 'clamp(22px, 3vw, 36px)', lineHeight: 1.15, margin: 0, fontWeight: 700 }}>
                                {product.category === 'brikety' ? (product.seo_h1 || product.name) : product.name}
                            </h1>

                            <div className="product-badges-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    background: product.is_available !== false ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: product.is_available !== false ? '#22c55e' : '#ef4444',
                                    border: product.is_available !== false ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(239, 68, 68, 0.15)',
                                    padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700
                                }}>
                                    <CheckCircle2 size={14} /> {product.is_available !== false ? 'В наявності' : 'Немає в наявності'}
                                </span>

                            </div>
                        </div>

                        {/* ── Price Block & CTA ── */}
                        <div className="product-price-block" style={{
                            paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)',
                            display: 'flex', flexDirection: 'column', gap: '1.25rem'
                        }}>
                            <div className="product-price-line">
                                <p style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: 0, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '34px', fontWeight: 900, color: 'var(--c-orange)', lineHeight: 1 }}>{displayPrice}</span>
                                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--c-orange)' }}>грн</span>
                                    <span style={{ fontSize: '18px', color: 'var(--c-text2)', fontWeight: 500 }}>/ {selectedVariant ? selectedVariant.name : (product.category === 'brikety' || product.category === 'vugillya' ? 'тонна' : 'складометр')}</span>
                                </p>
                            </div>

                            <div className="product-top-badges" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 12px', borderRadius: '8px', color: '#e5e7eb', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Truck size={15} style={{ color: '#22c55e' }} />
                                    <span>Доставка за 24 години</span>
                                </div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 12px', borderRadius: '8px', color: '#e5e7eb', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <PackageCheck size={15} style={{ color: product.is_available !== false ? '#22c55e' : '#ef4444' }} />
                                    <span>{product.is_available !== false ? 'Є на складі' : 'Немає на складі'}</span>
                                </div>
                                <div className="desktop-only-payment-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 12px', borderRadius: '8px', color: '#e5e7eb', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <CheckCircle2 size={15} style={{ color: '#22c55e' }} />
                                    <span>Оплата після отримання</span>
                                </div>
                            </div>

                            {/* Variant selector (if any) */}
                            {product.variants?.length > 0 && (
                                <div className="product-variants-container" style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-text2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        Оберіть варіант
                                    </p>
                                    <div className="product-variants-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {product.variants.map((variant, idx) => {
                                            const active = selectedVariant?.name === variant.name;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => { setSelectedVariant(variant); if (galleryImages.length > 1) setActiveImageIndex(Math.min(idx, galleryImages.length - 1)); }}
                                                    style={{
                                                        padding: '10px 20px', borderRadius: 10,
                                                        border: active ? '1px solid var(--c-orange)' : '1px solid var(--color-border-subtle)',
                                                        background: active ? 'rgba(249,115,22,0.10)' : 'var(--color-bg-elevated)',
                                                        color: active ? 'var(--c-orange)' : 'var(--c-text)',
                                                        fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                                                        transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                                                        fontFamily: 'inherit',
                                                    }}
                                                >
                                                    {variant.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="product-cta-container">
                                {product.is_available !== false ? (
                                    <button
                                        className="product-cta-btn"
                                        onClick={() => setIsOrderFormOpen(true)}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                            color: '#fff', fontWeight: 800, fontSize: '1.125rem',
                                            border: 'none', borderRadius: 12, padding: '18px 32px',
                                            cursor: 'pointer', width: '100%',
                                            boxShadow: '0 4px 20px rgba(249,115,22,0.30)',
                                            transition: 'box-shadow 0.2s',
                                            fontFamily: 'inherit',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,0.50)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.30)'}
                                    >
                                        🔥 {product.category === 'brikety' ? 'Замовити брикети' : product.category === 'vugillya' ? 'Замовити вугілля' : 'Замовити дрова'}
                                    </button>
                                ) : (
                                    <button
                                        className="product-cta-btn"
                                        onClick={() => setIsOrderFormOpen(true)}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            background: 'var(--color-bg-elevated)',
                                            color: 'var(--c-text2)', fontWeight: 700, fontSize: '1.125rem',
                                            border: '1px solid var(--color-border-subtle)', borderRadius: 12, padding: '18px 32px',
                                            cursor: 'pointer', width: '100%',
                                            transition: 'color 0.2s, border-color 0.2s',
                                            fontFamily: 'inherit',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-text)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-text2)'; e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; }}
                                    >
                                        Повідомити про появу
                                    </button>
                                )}
                            </div>

                            {/* Trust Block */}
                            <div className="trust-block desktop-hidden-trust" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', marginTop: '0.25rem' }}>
                                <span className="desktop-only-trust-item" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--c-text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    <div style={{ background: 'rgba(34,197,94,0.15)', borderRadius: '50%', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={12} color="#22c55e" />
                                    </div>
                                    Доставка по Києву за 24 години
                                </span>
                                
                                <span className="mobile-badge-style trust-item-standard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--c-text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    <div className="trust-icon-container" style={{ background: 'rgba(34,197,94,0.15)', borderRadius: '50%', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={12} color="#22c55e" />
                                    </div>
                                    <CheckCircle2 className="mobile-badge-icon" size={15} style={{ color: '#22c55e', display: 'none' }} />
                                    Чесний складометр
                                </span>

                                <span className="mobile-badge-style trust-item-standard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--c-text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    <div className="trust-icon-container" style={{ background: 'rgba(34,197,94,0.15)', borderRadius: '50%', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={12} color="#22c55e" />
                                    </div>
                                    <CheckCircle2 className="mobile-badge-icon" size={15} style={{ color: '#22c55e', display: 'none' }} />
                                    Оплата після отримання
                                </span>

                                <span className="desktop-only-trust-item" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--c-text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    <div style={{ background: 'rgba(34,197,94,0.15)', borderRadius: '50%', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={12} color="#22c55e" />
                                    </div>
                                    Працюємо з 2013 року
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── SECTION 2, 3 & 4: Characteristics, Description, Delivery Info, FAQ ── */}
                <div style={{ marginTop: '4rem' }}>
                    <div className="product-info-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gridTemplateRows: 'auto auto auto',
                        gap: '1.5rem',
                    }}>
                        {/* ── ROW 1 LEFT: Specs ── */}
                        <div className="nh-card" style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16, gridColumn: '1', gridRow: '1', display: 'flex', flexDirection: 'column' }}>
                            {product.category === 'brikety' && (
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.5rem', lineHeight: 1.25 }}>
                                    {briketH2}
                                </h2>
                            )}
                            <div className="product-specs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', rowGap: '1.5rem', flex: 1 }}>
                                {specs.map((spec, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                            background: 'var(--color-accent-soft)',
                                            border: '1px solid rgba(249,115,22,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {spec.icon}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{spec.name || spec.label}</p>
                                            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--c-text)', marginTop: 2 }}>{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── ROW 1-3 RIGHT: Description SEO Block (spans all 3 rows) ── */}
                        <div style={{ gridColumn: '2', gridRow: '1 / 4', display: 'flex', flexDirection: 'column' }}>
                            <div className="nh-card" style={{ padding: '2rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16, flex: 1, position: 'sticky', top: '6rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.25rem' }}>
                                    {product.category === 'brikety' ? briketDesc : product.category === 'vugillya' ? 'Про це вугілля' : 'Про ці дрова'}
                                </h2>
                                <div style={{ color: 'var(--c-text2)', fontSize: '1rem', lineHeight: 1.6 }}>
                                    {product.short_description && (
                                        <p style={{ fontWeight: 600, color: 'var(--c-text)', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
                                            {product.short_description}
                                        </p>
                                    )}
                                    {product.description ? (
                                        <>
                                            {product.category === 'drova' ? (
                                                <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
                                            ) : (product.description.includes('<p>') || product.description.includes('<h2>')) ? (
                                                <div dangerouslySetInnerHTML={{ __html: product.description }} className="product-seo-description" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} />
                                            ) : (
                                                <>
                                                    <p style={{ marginBottom: '1rem' }}>{product.description}</p>
                                                    <p>Наші дрова щільно укладені в кузові автомобіля (складометрами), що гарантує чесний об'єм при доставці.</p>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {product.category === 'drova' ? (
                                                <p style={{ marginBottom: '1rem' }}>
                                                    Дубові дрова — одна з найкращих порід для опалення. Вони горять довго, дають стабільний жар та підходять для твердопаливних котлів, печей та камінів. Окрім <Link to="/catalog/drova" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>дров колотих</Link>, у нас можна замовити <Link to="/catalog/brikety" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>паливні брикети</Link> та <Link to="/catalog/vugillya" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>кам'яне вугілля</Link>.
                                                </p>
                                            ) : (
                                                <p style={{ marginBottom: '1rem' }}>Дубові дрова — одна з найкращих порід для опалення. Вони горять довго, дають стабільний жар та підходять для твердопаливних котлів, печей та камінів.</p>
                                            )}
                                            <p>Ми ретельно відбираємо сировину, щоб забезпечити максимальну тепловіддачу. Замовляючи у нас, ви отримуєте чесний об'єм та гарантовану якість палива для вашої оселі.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── ROW 2 LEFT: Delivery Info ── */}
                        <div className="nh-card" style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16, gridColumn: '1', gridRow: '2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                    background: 'var(--color-accent-soft)',
                                    border: '1px solid rgba(249,115,22,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Truck size={18} color="var(--c-orange)" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-text)', margin: 0 }}>
                                    Інформація про доставку
                                </h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 50 }}>
                                {(!deliveryInfoObj || Object.keys(deliveryInfoObj).length === 0) ? (
                                    <>
                                        <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                            <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Локація:</span> Доставка по Києву та області
                                        </p>
                                        <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                            <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Термін доставки:</span> 1 день
                                        </p>
                                        <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                            <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Вартість доставки:</span> Індивідуальна вартість доставки буде розрахована після вашого запиту
                                        </p>
                                        {product?.category === 'drova' && (
                                            <>
                                                <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                                    <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Мінімальне замовлення:</span> 1 складометр
                                                </p>
                                                <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                                    <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Автопарк:</span> ГАЗель, ЗІЛ, КАМАЗ
                                                </p>
                                                <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                                    <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Спецтехніка:</span> гідроборт, кран-маніпулятор
                                                </p>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {['location:Локація', 'time:Термін доставки', 'price:Вартість доставки', 'min_order:Мінімальне замовлення', 'fleet:Автопарк', 'special:Спецтехніка'].map(fieldStr => {
                                            const [key, label] = fieldStr.split(':');
                                            if (!deliveryInfoObj[key]) return null;
                                            return (
                                                <p key={key} style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                                    <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>{label}:</span> {deliveryInfoObj[key]}
                                                </p>
                                            );
                                        })}
                                    </>
                                )}
                                <Link to="/dostavka" style={{ color: 'var(--c-orange)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    {product.category === 'drova' ? 'Детальніше про доставку дров' : 'Детальніше про доставку'} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* ── ROW 3 LEFT: How to Order ── */}
                        <section className="nh-card order-steps" style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16, gridColumn: '1', gridRow: '3', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.5rem' }}>Як замовити {product.category === 'brikety' ? 'брикети' : product.category === 'vugillya' ? 'вугілля' : 'дрова'}</h3>
                            <ol className="order-steps-list" style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', color: 'var(--c-text)', lineHeight: 1.6, fontWeight: 500 }}>
                                {(!orderStepsArray || orderStepsArray.length === 0) ? (
                                    <>
                                        <li style={{ marginBottom: '8px' }}>Оберіть потрібний обсяг {product?.category === 'brikety' ? 'брикетів' : product?.category === 'vugillya' ? 'вугілля' : 'дров'}</li>
                                        <li style={{ marginBottom: '8px' }}>Натисніть кнопку "Замовити"</li>
                                        <li>Ми зв'яжемося для підтвердження доставки</li>
                                    </>
                                ) : (
                                    orderStepsArray.map((s, idx) => (
                                        <li key={idx} style={{ marginBottom: idx === orderStepsArray.length - 1 ? '0' : '8px' }}>{s.step}</li>
                                    ))
                                )}
                            </ol>
                            <p style={{ color: 'var(--c-text2)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                                Доставка {product.category === 'brikety' ? 'брикетів' : product.category === 'vugillya' ? 'вугілля' : 'дров'} по Києву здійснюється власним транспортом протягом 24 годин після оформлення замовлення.
                            </p>
                        </section>
                    </div>

                    {/* ── FAQ: Full Width ── */}
                    <div className="nh-card" style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16, marginTop: '1.5rem' }}>
                        <h3 className="faq-mobile-h2" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.5rem' }}>
                            Часті питання
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={{
                                    background: 'var(--color-bg-elevated)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderRadius: 12, overflow: 'hidden',
                                }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        style={{
                                            width: '100%', padding: '1.25rem 1.5rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            background: 'transparent', border: 'none', color: 'var(--c-text)',
                                            fontSize: '1rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', gap: '1rem',
                                        }}
                                    >
                                        <span style={{ flex: 1 }}>{faq.q}</span>
                                        <ChevronDown size={20} color="var(--c-orange)" style={{
                                            flexShrink: 0,
                                            transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease'
                                        }} />
                                    </button>
                                    <div style={{
                                        maxHeight: openFaq === idx ? 200 : 0,
                                        padding: openFaq === idx ? '0 1.5rem 1.5rem' : '0 1.5rem',
                                        opacity: openFaq === idx ? 1 : 0,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        color: 'var(--c-text2)', fontSize: '0.9375rem', lineHeight: 1.6,
                                    }}>
                                        {faq.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── SECTION: DELIVERY OPTIONS DROVA (FULL WIDTH) ── */}
                {product.category === 'drova' && (
                    <div style={{ marginTop: '4rem' }}>
                        <DeliveryOptionsDrova />
                    </div>
                )}

                {/* ── SECTION 5: RELATED PRODUCTS ── */}
                {relatedProducts.length > 0 && (
                    <div style={{ marginTop: '5rem' }}>
                        <h3 className="h2" style={{ marginBottom: '2rem' }}>Інші {product.category === 'brikety' ? 'брикети' : product.category === 'vugillya' ? 'вугілля' : 'дрова'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {relatedProducts.map((p, idx) => {
                                const displayPrice = p.variants?.length > 0 ? p.variants[0].price : p.price;
                                const isPopular = idx < 2;

                                return (
                                    <Link key={p.id} to={`/catalog/${categorySlug || p.category}/${p.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                                        <article className="nh-card catalog-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', flex: 1 }}>
                                            {/* ── IMAGE ── */}
                                            <div style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                                                {p.image_url ? (
                                                    <img
                                                        src={getImageUrl(p.image_url, api.defaults.baseURL)}
                                                        alt={p.category === 'drova' || categorySlug === 'drova' ? `${p.name} колоті дрова складометр доставка Київ` : p.category === 'brikety' ? (p.name.split('—')[0].split('- ')[0].trim().replace(/\(|\)/g, '').replace(/\s+/g, ' ')) : (p.h1_heading || p.name)}
                                                        className="catalog-card-img"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                        onError={e => {
                                                            e.target.onerror = null;
                                                            e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(p.name)}`;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="catalog-card-img-placeholder">🪵</div>
                                                )}
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,16,0.65) 0%, transparent 55%)', pointerEvents: 'none' }} />

                                                {/* Badges */}
                                                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.85)',
                                                        color: '#fff', borderRadius: 999, padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700,
                                                        letterSpacing: '0.02em', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                                    }}>
                                                        {p.is_available !== false ? '✔ В наявності' : '✖ Немає'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ── CONTENT ── */}
                                            <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <p className="h3" style={{ margin: 0, marginBottom: 8, transition: 'color 0.2s', lineHeight: 1.25, fontWeight: 700 }}>
                                                    {p.name}
                                                </p>
                                                <div className="catalog-card-description body-sm" style={{ minHeight: '2.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 16, opacity: 0.8 }} dangerouslySetInnerHTML={{ __html: (p.description || 'Якісне тверде паливо з доставкою по Києву та Київській області.').replace(/<h[1-6][^>]*>/gi, '<strong>').replace(/<\/h[1-6]>/gi, '</strong>') }} />
                                                {p.variants?.length > 0 && (
                                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                                                        {p.variants.slice(0, 3).map((v, i) => (
                                                            <span key={i} style={{ fontSize: '0.72rem', color: 'var(--c-text2)', background: 'var(--c-surface)', borderRadius: 6, padding: '2px 8px', border: '1px solid var(--c-border)' }}>{v.name}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--color-border-subtle)', marginTop: 'auto', gap: 12 }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'nowrap' }}>
                                                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--c-orange)', lineHeight: 1, margin: 0, whiteSpace: 'nowrap' }}>
                                                                {displayPrice} <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-orange)' }}>грн</span>
                                                            </p>
                                                        </div>
                                                        <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: 0, whiteSpace: 'nowrap' }}>за 1 {product.category === 'brikety' || product.category === 'vugillya' ? 'тонну' : 'складометр'}</p>
                                                    </div>
                                                    <button
                                                        className={`catalog-card-btn nh-btn-primary ${p.is_available === false ? 'out-of-stock-btn' : ''}`}
                                                        style={{
                                                            padding: p.is_available === false ? '6px 10px' : '8px 16px', 
                                                            fontSize: p.is_available === false ? '0.7rem' : '0.875rem', 
                                                            background: p.is_available === false ? 'rgba(255, 255, 255, 0.05)' : 'var(--c-orange)', 
                                                            color: p.is_available === false ? '#9ca3af' : '#fff', 
                                                            border: p.is_available === false ? '1px solid rgba(255, 255, 255, 0.1)' : 'none', 
                                                            borderRadius: '8px', 
                                                            cursor: 'pointer', 
                                                            fontWeight: 600,
                                                            transition: 'all 0.2s',
                                                            whiteSpace: 'nowrap',
                                                            flexShrink: 0
                                                        }}
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOrderFormOpen(true); }}
                                                    >
                                                        {p.is_available === false ? 'Повідомити про появу' : 'Замовити'}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* ── SECTION 6: BOTTOM SEO BLOCK ── */}
                {product.category === 'drova' && (
                    <section className="product-seo-bottom" style={{ marginTop: '5rem', padding: '2rem', background: '#1c1c1e', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.25rem' }}>Купити {product.name.toLowerCase()} в Києві</h2>
                        <div style={{ color: 'var(--c-text2)', fontSize: '1rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p>
                                Якщо вам потрібні якісні <Link to="/catalog/drova" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>колоті дрова</Link>
                                {' '}з доставкою по Києву, компанія КиївДрова пропонує швидке постачання
                                палива власним транспортом.
                            </p>
                            <p>
                                У нашому каталозі також доступні
                                {' '}<Link to="/catalog/brikety" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>паливні брикети</Link>{' '}
                                та
                                {' '}<Link to="/catalog/vugillya" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>кам'яне вугілля</Link>{' '}
                                для твердопаливних котлів та камінів.
                            </p>
                            <p>
                                Ми доставляємо дрова в усі райони Києва:
                                Дарницький, Деснянський, Оболонський,
                                Подільський, Шевченківський,
                                Голосіївський, Солом’янський,
                                Печерський, Святошинський,
                                Дніпровський.
                            </p>
                            <p>
                                Замовляючи <strong>{product.name.toLowerCase()}</strong> у нас, ви гарантовано отримуєте чесний об'єм, оскільки всі дрова щільно укладаються в кузові (в складометрах). Ми працюємо без передоплати — ви оплачуєте замовлення безпосередньо після розвантаження та перевірки якості.
                            </p>
                        </div>
                    </section>
                )}

                {/* ── SECTION 7: CROSS-CATEGORY LINKING ── */}
                <div style={{ marginTop: '5rem', paddingBottom: '2rem' }}>
                    <h2 className="h2" style={{ marginBottom: '2rem' }}>Інші види палива</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <Link to="/catalog/drova" className="nh-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                            <div>
                                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--c-text)', margin: 0 }}>Дрова колоті</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: '4px 0 0 0' }}>Дуб, граб, сосна</p>
                            </div>
                            <ChevronRight size={20} color="var(--c-orange)" />
                        </Link>
                        <Link to="/catalog/brikety" className="nh-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                            <div>
                                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--c-text)', margin: 0 }}>Паливні брикети</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: '4px 0 0 0' }}>RUF, Nestro, Pini Kay</p>
                            </div>
                            <ChevronRight size={20} color="var(--c-orange)" />
                        </Link>
                        <Link to="/catalog/vugillya" className="nh-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                            <div>
                                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--c-text)', margin: 0 }}>Кам'яне вугілля</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: '4px 0 0 0' }}>Антрацит, ДГ</p>
                            </div>
                            <ChevronRight size={20} color="var(--c-orange)" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── responsive grid ── */}
            <style>{`
                /* Hide scrollbar for thumbnails */
                .product-thumbnails::-webkit-scrollbar { display: none; }

                /* Mobile title: show above image; hide desktop title */
                .product-mobile-title { display: none; }

                @media (min-width: 769px) {
                    .desktop-hidden-trust { display: none !important; }
                }

                @media (max-width: 768px) {
                    .product-mobile-title { display: block !important; }
                    .product-desktop-title .h1 { display: none !important; }
                    .product-desktop-title { gap: 0.5rem !important; }
                    .product-badges-row { display: none !important; }
                    .product-popular-badge { display: none !important; }
                    .product-old-price { display: none !important; }
                    .desktop-only-payment-badge { display: none !important; }
                    .product-price-badge { display: inline-flex !important; }
                    .product-main-content > div { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
                    .product-main-content > div > div:first-child { position: static !important; }
                    .product-main-content > div > div:last-child { gap: 1rem !important; }
                    .product-price-block { order: -1; padding-top: 0 !important; border-top: none !important; gap: 0.6rem !important; }
                    /* Reorder inside price block on mobile: price first, variants, then badges */
                    .product-price-line { order: 1; }
                    .product-variants-container { order: 2; border-top: none !important; padding-top: 0 !important; }
                    .product-top-badges { order: 3; margin-top: 0.9rem !important; }
                    .trust-block.desktop-hidden-trust { order: 4; }
                    .product-cta-container { order: 10; }
                    .product-main-content { padding-top: 1rem !important; padding-bottom: 1rem !important; }
                    
                    /* Sticky Mobile CTA Container */
                    .product-cta-container {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: var(--color-bg-elevated);
                        border-top: 1px solid var(--color-border-subtle);
                        padding: 1rem 1.5rem;
                        z-index: 100;
                        box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
                    }
                    /* Add padding to bottom to account for the sticky bar */
                    .new-home-scope { padding-bottom: 90px; }

                    .desktop-only-trust-item { display: none !important; }
                    
                    .mobile-badge-style {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: flex-start !important;
                        gap: 6px !important;
                        background: rgba(255, 255, 255, 0.03) !important;
                        padding: 5px 8px !important;
                        border-radius: 8px !important;
                        color: #e5e7eb !important;
                        font-size: 0.75rem !important;
                        border: 1px solid rgba(255,255,255,0.05) !important;
                        width: 100% !important;
                        box-sizing: border-box !important;
                        line-height: 1.2 !important;
                        white-space: normal !important;
                        overflow: hidden !important;
                        min-width: 0 !important;
                    }

                    .trust-icon-container { display: none !important; }
                    .mobile-badge-icon { display: block !important; width: 14px; height: 14px; flex-shrink: 0; }
                    .trust-block.desktop-hidden-trust { 
                        display: grid !important; 
                        grid-template-columns: 1fr 1fr !important;
                        gap: 0.5rem !important;
                        margin-top: 0.9rem !important; 
                        width: 100% !important;
                        max-width: 100% !important;
                        overflow: hidden !important;
                    }

                    /* Make top price badges row compact on mobile too */
                    .product-price-block > div > div:last-child {
                        gap: 0.5rem !important;
                        margin-top: 0.75rem !important;
                    }
                    .product-price-block > div > div:last-child > div {
                        padding: 5px 8px !important;
                        font-size: 0.75rem !important;
                        gap: 6px !important;
                    }
                }
            `}</style>

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
                product={product}
                variant={selectedVariant}
                initialQuantity={1}
            />
        </div>
    );
}
