import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Truck, ChevronRight, Ruler, Scale, Flame, Info, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { getCategoryUrl, getImageUrl } from '../utils/urls';
import api from '../api';
import { OrderFormModal } from './new-home/OrderFormModal';
import SEOHead from './SEOHead';

export default function ProductPage() {
    const { categorySlug, productSlug } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);
    const { categories } = useCategories();

    // Legacy redirect
    const oldSlugMap = {
        'firewood': 'drova',
        'briquettes': 'brikety',
        'coal': 'vugillya'
    };


    // Dynamic Specs
    const specs = product ? [
        { icon: <Flame size={17} color="var(--c-orange)" />, label: 'Порода', value: product.name.toLowerCase().includes('дуб') ? 'Дуб' : (product.name.toLowerCase().includes('сосн') ? 'Сосна' : (product.name.toLowerCase().includes('граб') ? 'Граб' : (product.category === 'brikety' ? 'Деревна тирса' : 'Тверді породи'))) },
        { icon: <CheckCircle2 size={17} color="var(--c-orange)" />, label: 'Тип', value: product.category === 'drova' ? 'Колоті' : (product.category === 'brikety' ? 'Пресовані' : 'Сипуче') },
        { icon: <Scale size={17} color="var(--c-orange)" />, label: 'Фасування', value: product.category === 'drova' ? 'Складометр' : 'У пакуваннях / піддонах' },
        { icon: <Flame size={17} color="var(--c-orange)" />, label: 'Вологість', value: product.category === 'drova' ? 'Природна (До 25%)' : 'До 8%' },
        { icon: <Truck size={17} color="var(--c-orange)" />, label: 'Доставка', value: 'По Києву та області' },
    ] : [];

    const faqs = product ? [
        { q: `Скільки горять ${product.name.toLowerCase()}?`, a: `Залежить від типу вашого котла чи печі, але завдяки високій щільності та правильній вологості вони забезпечують максимально тривале горіння та високу тепловіддачу.` },
        { q: 'Який обʼєм складометра?', a: 'Складометр — це щільно укладене паливо в об’ємі 1 метр на 1 метр на 1 метр. Ми завжди гарантуємо чесний об\'єм при завантаженні автомобіля.' },
        { q: 'Чи можна замовити доставку сьогодні?', a: 'Так! При оформленні замовлення в першій половині дня ми намагаємося доставити власним транспортом в той же день по Києву та області.' }
    ] : [];

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setActiveImageIndex(0);
        api.get('/products/')
            .then(res => {
                const data = res.data;
                const items = Array.isArray(data) ? data : (data.items || []);
                const found = items.find(p => p.slug === productSlug);
                setProduct(found);

                if (found) {
                    const related = items.filter(p => p.category === found.category && p.slug !== found.slug).slice(0, 3);
                    setRelatedProducts(related);
                }

                if (found?.variants?.length > 0) {
                    setSelectedVariant(found.variants[0]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [productSlug]);

    const category = categories.find(c => c.slug === (categorySlug || product?.category));

    // Gather all images (main + gallery if it exists)
    const originalMainImg = product?.image_url ? getImageUrl(product.image_url, api.defaults.baseURL) : '';
    // Assuming product.gallery exists or fallback to array with main image
    const galleryImages = [originalMainImg].filter(Boolean); // If API provides gallery, append them here

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

    // Schemas
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Головна", "item": "https://kievbriket.com/" },
            { "@type": "ListItem", "position": 2, "name": category ? category.name : 'Каталог', "item": `https://kievbriket.com${category ? getCategoryUrl(category.slug) : '/catalog/drova'}` },
            { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://kievbriket.com/catalog/${categorySlug}/${productSlug}` }
        ]
    };

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": galleryImages[0] || "",
        "description": product.description || `Купити ${product.name.toLowerCase()} з доставкою по Києву`,
        "sku": product.id || String(product.slug),
        "brand": {
            "@type": "Brand",
            "name": "KievBriket"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://kievbriket.com/catalog/${categorySlug}/${productSlug}`,
            "priceCurrency": "UAH",
            "price": displayPrice || 0,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
            }
        }))
    };

    const dynamicTitle = `${product.name} купити Київ | ціна | KievBriket`;

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
                schema={[breadcrumbSchema, productSchema, faqSchema]}
            />

            {/* ── Breadcrumbs ── */}
            <div style={{
                background: 'var(--color-bg-deep)',
                borderBottom: '1px solid var(--color-border-subtle)',
                padding: '1rem 0',
            }}>
                <nav style={{
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
                        to={category ? getCategoryUrl(category.slug) : '/catalog/drova'}
                        style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--c-orange)'}
                        onMouseLeave={e => e.target.style.color = 'var(--c-text2)'}
                    >
                        {category ? category.name : 'Каталог'}
                    </Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <span style={{ color: 'var(--c-text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                        {product.name}
                    </span>
                </nav>
            </div>

            {/* ── Main Content ── */}
            <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--s-section) 1.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3rem',
                    alignItems: 'start',
                }}>
                    {/* ── Left: Image Gallery ── */}
                    <div style={{ position: 'sticky', top: '6rem' }}>
                        <div style={{
                            borderRadius: 16,
                            overflow: 'hidden',
                            aspectRatio: '4/3',
                            position: 'relative',
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border-subtle)',
                            marginBottom: '1rem',
                        }}>


                            {galleryImages.length > 0 ? (
                                <img
                                    src={galleryImages[activeImageIndex]}
                                    alt={product.name}
                                    width="600"
                                    height="450"
                                    loading={activeImageIndex === 0 ? "eager" : "lazy"}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                    onMouseEnter={e => window.innerWidth > 768 && (e.target.style.transform = 'scale(1.05)')}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-text2)' }}>
                                    Немає фото
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {galleryImages.length > 1 && (
                            <div className="product-thumbnails" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                                {galleryImages.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => window.innerWidth <= 768 && setActiveImageIndex(idx)}
                                        onMouseEnter={() => window.innerWidth > 768 && setActiveImageIndex(idx)}
                                        style={{
                                            width: 80, height: 80, borderRadius: 12, flexShrink: 0,
                                            border: activeImageIndex === idx ? '2px solid var(--c-orange)' : '1px solid var(--color-border-subtle)',
                                            background: 'var(--color-bg-elevated)', cursor: 'pointer', overflow: 'hidden',
                                            padding: 0, transition: 'border-color 0.2s',
                                        }}
                                    >
                                        <img
                                            src={src}
                                            alt={`мініатюра ${idx + 1}`}
                                            width="80"
                                            height="80"
                                            loading="lazy"
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h1 className="h1" style={{ fontSize: 'clamp(22px, 3vw, 36px)', lineHeight: 1.15, margin: 0, fontWeight: 700 }}>
                                {product.name}
                            </h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                                    border: '1px solid rgba(34,197,94,0.35)',
                                    padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700
                                }}>
                                    • В наявності
                                </span>
                                {isPopular && (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        background: 'rgba(255,115,0,0.15)', color: '#ff7a18',
                                        border: '1px solid rgba(255,115,0,0.35)',
                                        padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700
                                    }}>
                                        • Популярний
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Variant selector (if any) */}
                        {product.variants?.length > 0 && (
                            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-text2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    Оберіть варіант
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {product.variants.map((variant, idx) => {
                                        const active = selectedVariant?.name === variant.name;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedVariant(variant)}
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

                        {/* ── Price Block & CTA ── */}
                        <div style={{
                            paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)',
                            display: 'flex', flexDirection: 'column', gap: '1.25rem'
                        }}>
                            <div>
                                {displayPrice > 1000 && (
                                    <span style={{ fontSize: '1rem', color: 'var(--c-text2)', textDecoration: 'line-through', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                        {Math.round(displayPrice * 1.15)} грн
                                    </span>
                                )}
                                <p style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: 0, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '34px', fontWeight: 900, color: 'var(--c-orange)', lineHeight: 1 }}>{displayPrice}</span>
                                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--c-orange)' }}>грн</span>
                                    {!product.variants?.length && (
                                        <span style={{ fontSize: '18px', color: 'var(--c-text2)', fontWeight: 500 }}>/ складометр</span>
                                    )}
                                </p>

                                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                                        <span style={{ color: '#22c55e' }}>•</span> Доставка сьогодні
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                                        <span style={{ color: '#22c55e' }}>•</span> Є на складі
                                    </span>
                                </div>
                            </div>

                            <div className="product-cta-container">
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
                                    🔥 Замовити дрова
                                </button>
                            </div>

                            {/* Trust Block */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.25rem' }}>
                                {[
                                    'Доставка по Києву за 24 години',
                                    'Чесний складометр',
                                    'Оплата після отримання',
                                    'Працюємо з 2013 року'
                                ].map((item, idx) => (
                                    <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9375rem', color: 'var(--c-text)', fontWeight: 500 }}>
                                        <div style={{ background: 'rgba(34,197,94,0.15)', borderRadius: '50%', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CheckCircle2 size={14} color="#22c55e" />
                                        </div>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ── SECTION 2 & 3: Characteristics & Description ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {/* Specs */}
                            <div className="nh-card" style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', rowGap: '1.5rem' }}>
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
                                                <p style={{ fontSize: '0.75rem', color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{spec.label}</p>
                                                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--c-text)', marginTop: 2 }}>{spec.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description SEO Block */}
                            <div className="nh-card" style={{ padding: '2rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.25rem' }}>
                                    Про ці дрова
                                </h2>
                                <div style={{ color: 'var(--c-text2)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 700 }}>
                                    {product.description ? (
                                        <>
                                            <p style={{ marginBottom: '1rem' }}>{product.description}</p>
                                            <p>Наші дрова щільно укладені в кузові автомобіля (складометрами), що гарантує чесний об'єм при доставці.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ marginBottom: '1rem' }}>Дубові дрова — одна з найкращих порід для опалення. Вони горять довго, дають стабільний жар та підходять для твердопаливних котлів, печей та камінів.</p>
                                            <p>Ми ретельно відбираємо сировину, щоб забезпечити максимальну тепловіддачу. Замовляючи у нас, ви отримуєте чесний об'єм та гарантовану якість палива для вашої оселі.</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ── SECTION 3B: Delivery Info ── */}
                            <div className="nh-card" style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                        background: 'var(--color-accent-soft)',
                                        border: '1px solid rgba(249,115,22,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Truck size={18} color="var(--c-orange)" />
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-text)', margin: 0 }}>
                                        Інформація про доставку
                                    </h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 50 }}>
                                    <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                        <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Локація:</span> Доставка по Києву та області
                                    </p>
                                    <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.9375rem' }}>
                                        <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Термін доставки:</span> 1 день
                                    </p>
                                    <Link to="/delivery" style={{ color: 'var(--c-orange)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        Детальніше про доставку <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* ── SECTION 4: FAQ ── */}
                        <div style={{ marginTop: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.5rem' }}>
                                Часті питання
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                                                fontSize: '1rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                                            }}
                                        >
                                            {faq.q}
                                            <ChevronDown size={20} color="var(--c-orange)" style={{
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
                </div>

                {/* ── SECTION 5: RELATED PRODUCTS ── */}
                {relatedProducts.length > 0 && (
                    <div style={{ marginTop: '5rem' }}>
                        <h2 className="h2" style={{ marginBottom: '2rem' }}>Інші {category?.name?.toLowerCase() || 'дрова'}</h2>
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
                                                        alt={p.name}
                                                        className="catalog-card-img"
                                                        onError={e => { e.target.onerror = null; e.target.src = '/assets/product-placeholder-wood.webp'; }}
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
                                                        ✔ В наявності
                                                    </span>
                                                </div>
                                                {isPopular && (
                                                    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', background: 'rgba(249,115,22,0.9)',
                                                            color: '#fff', borderRadius: 999, padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700,
                                                            letterSpacing: '0.04em', textTransform: 'uppercase', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                                        }}>
                                                            🔥 Популярний
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── CONTENT ── */}
                                            <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <h3 className="h3" style={{ margin: 0, marginBottom: 8, transition: 'color 0.2s', lineHeight: 1.25, fontWeight: 700 }}>
                                                    {p.name}
                                                </h3>
                                                <p className="body-sm" style={{ minHeight: '2.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 16, opacity: 0.8 }}>
                                                    {p.description || 'Якісне тверде паливо з доставкою по Києву та Київській області.'}
                                                </p>
                                                {p.variants?.length > 0 && (
                                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                                                        {p.variants.slice(0, 3).map((v, i) => (
                                                            <span key={i} style={{ fontSize: '0.72rem', color: 'var(--c-text2)', background: 'var(--c-surface)', borderRadius: 6, padding: '2px 8px', border: '1px solid var(--c-border)' }}>{v.name}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--color-border-subtle)', marginTop: 'auto', gap: 12 }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--c-orange)', lineHeight: 1, margin: 0 }}>
                                                            {displayPrice} <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-orange)' }}>грн</span>
                                                        </p>
                                                        <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: 0 }}>за 1 складометр</p>
                                                    </div>
                                                    <button
                                                        className="catalog-card-btn"
                                                        onClick={(e) => { e.preventDefault(); setIsOrderFormOpen(true); }}
                                                    >
                                                        🛒 Замовити
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
                {/* ── SECTION 6: CROSS-CATEGORY LINKING ── */}
                <div style={{ marginTop: '5rem', paddingBottom: '2rem' }}>
                    <h2 className="h2" style={{ marginBottom: '2rem' }}>Інші види палива</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <Link to="/catalog/drova" className="nh-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--c-text)', margin: 0 }}>Дрова колоті</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: '4px 0 0 0' }}>Дуб, граб, сосна</p>
                            </div>
                            <ChevronRight size={20} color="var(--c-orange)" />
                        </Link>
                        <Link to="/catalog/brikety" className="nh-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--c-text)', margin: 0 }}>Паливні брикети</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: '4px 0 0 0' }}>RUF, Nestro, Pini Kay</p>
                            </div>
                            <ChevronRight size={20} color="var(--c-orange)" />
                        </Link>
                        <Link to="/catalog/vugillya" className="nh-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 16 }}>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--c-text)', margin: 0 }}>Кам'яне вугілля</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', margin: '4px 0 0 0' }}>Антрацит, ДГ</p>
                            </div>
                            <ChevronRight size={20} color="var(--c-orange)" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* ── responsive grid ── */}
            <style>{`
                /* Hide scrollbar for thumbnails */
                .product-thumbnails::-webkit-scrollbar { display: none; }

                @media (max-width: 768px) {
                    main > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    main > div > div:first-child { position: static !important; }
                    
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
                }
            `}</style>

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
                product={product}
                variant={selectedVariant}
            />
        </div>
    );
}
