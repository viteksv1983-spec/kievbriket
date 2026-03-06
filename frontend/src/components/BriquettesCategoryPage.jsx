import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Phone, Flame, Truck, Scale, ShieldCheck, Thermometer, Clock, Package, CheckCircle2, Droplets, Zap } from 'lucide-react';
import shopConfig from '../shop.config';
import { useReveal } from '../hooks/useReveal';
import api from '../api';
import { getProductUrl, getImageUrl } from '../utils/urls';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import { DeliverySection } from './new-home/DeliverySection';
import { BenefitsSection } from './new-home/BenefitsSection';

// ─── HERO CATEGORY SECTION ─────────────────────────────────────────
function HeroCategory({ onQuickOrderClick }) {
    const { ref, visible } = useReveal();
    return (
        <section ref={ref} className="hero-section" style={{ minHeight: 'auto', paddingTop: 'clamp(5px, 2vw, 40px)', paddingBottom: '0', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
            <div
                className="glow-orb"
                style={{
                    width: 700, height: 600,
                    top: -100, right: '-10%',
                    background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)",
                }}
            />

            <div className="layout-container" style={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <nav aria-label="Breadcrumb" className={`reveal ${visible ? 'visible' : ''}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 6,
                    marginBottom: '1rem',
                    fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', width: '100%',
                }}>
                    <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}>Головна</Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Паливні брикети</span>
                </nav>

                <div className="hero-text fade-up" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)', padding: 'clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: 'clamp(2rem, 5.5vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 'clamp(0.1rem, 1vw, 0.25rem)', color: '#fff' }}>
                        Купити паливні <span style={{ color: 'var(--c-orange)' }}>брикети</span> у Києві
                    </h1>
                    <p className="hero-subtitle fade-up fade-up-d2" style={{
                        fontSize: 'clamp(0.85rem, 3.2vw, 18px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
                        maxWidth: '100%', marginBottom: 'clamp(0.65rem, 2.5vw, 1.5rem)', fontWeight: 400
                    }}>
                        RUF, Pini Kay та Nestro. <br />
                        Висока тепловіддача та низька вологість. Доставка по Києву та області.
                    </p>

                    <div className="hero-actions fade-up fade-up-d3" style={{ display: 'flex', gap: '16px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={onQuickOrderClick}
                            className="btn-glow"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'var(--c-orange)', color: '#fff', padding: '16px 32px',
                                borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                                border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            Замовити брикети
                            <ArrowRight size={20} />
                        </button>
                        <a
                            href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '16px 32px',
                                borderRadius: '12px', fontSize: '16px', fontWeight: 600,
                                textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Phone size={20} />
                            Подзвонити
                        </a>
                    </div>

                    <div className="hero-benefits fade-up fade-up-d4" style={{
                        display: 'flex', gap: 'clamp(0.35rem, 1.5vw, 2rem)', flexWrap: 'wrap', justifyContent: 'flex-start',
                        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'clamp(12px, 3vw, 16px)', width: '100%',
                        fontSize: 'clamp(0.7rem, 2.8vw, 0.9rem)', color: 'rgba(255,255,255,0.7)'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> доставка сьогодні
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> без передоплати
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> сухе паливо
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── TYPES OF BRIQUETTES SECTION ─────────────────────────────────
function BriquetteTypesSection() {
    const { ref, visible } = useReveal();

    const types = [
        {
            title: 'RUF',
            desc: 'Класичні прямокутні брикети (цеглинки). Добре підходять для котлів, печей та камінів. Зручні для зберігання (щільно вкладаються) та завантаження.',
        },
        {
            title: 'Pini Kay',
            desc: 'Багатогранні брикети (найчастіше шестигранні) з отвором посередині. Мають темну випалену кірку ззовні. Дають найвищу тепловіддачу та ідеально підходять для камінів (красиво горять).',
        },
        {
            title: 'Nestro',
            desc: 'Брикети циліндричної форми. Відрізняються рівномірним горінням та високою тепловіддачею. Чудово зарекомендували себе в котлах тривалого горіння.',
        }
    ];

    return (
        <section ref={ref} className="briquette-types-section" style={{ padding: 'clamp(40px, 8vw, 80px) 0 clamp(20px, 4vw, 40px)' }}>
            <div className="layout-container full-width-mobile">
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="h2">Типи паливних брикетів</h2>
                </div>

                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {types.map((t, i) => (
                        <div key={i} className="nh-card hover-glow" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '16px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--c-orange)' }}>{t.title}</h3>
                            <p style={{ color: 'var(--c-text2)', lineHeight: 1.6, flex: 1, margin: 0, fontSize: '0.95rem' }}>{t.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── PRODUCT GRID ────────────────────────────────────────────────
function CategoryProducts({ products, onOrderProduct }) {
    const { ref, visible } = useReveal();
    const [selectedBreed, setSelectedBreed] = useState('Усі');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('popular');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        let list = [...products];
        if (selectedBreed !== 'Усі') {
            list = list.filter(p => p.name.toLowerCase().includes(selectedBreed.toLowerCase()));
        }

        switch (sortOrder) {
            case 'price_asc':
                list.sort((a, b) => {
                    const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
                    const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
                    return priceA - priceB;
                });
                break;
            case 'price_desc':
                list.sort((a, b) => {
                    const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
                    const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
                    return priceB - priceA;
                });
                break;
            case 'popular':
            default:
                break;
        }

        return list;
    }, [products, selectedBreed, sortOrder]);

    // Removed the aggressive null return to fix disappearing products on direct load.

    return (
        <section ref={ref} className="catalog-section" style={{ paddingTop: '0px', paddingBottom: '100px', position: 'relative', zIndex: 10 }}>
            <div className="layout-container">

                {/* Filter and Sorting Row */}
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{
                    position: 'relative', zIndex: 50,
                    display: 'flex', flexWrap: 'nowrap', gap: '0.25rem', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '2rem'
                }}>
                    {/* Breed Filter Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)', zIndex: 25, flexShrink: 1, minWidth: 0 }}>
                        <span style={{ color: 'var(--c-text2)', fontWeight: 500, fontSize: 'clamp(0.75rem, 2.5vw, 1rem)', whiteSpace: 'nowrap' }}>Порода:</span>
                        <div style={{ position: 'relative', flexShrink: 1, minWidth: 0 }}>
                            <div
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                style={{
                                    position: 'relative', display: 'flex', alignItems: 'center',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                                    borderRadius: '8px', padding: '6px 10px', paddingRight: '24px', cursor: 'pointer',
                                    userSelect: 'none', minWidth: '60px', maxWidth: '120px'
                                }}>
                                <span style={{ color: 'var(--c-text)', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {selectedBreed}
                                </span>
                                <ChevronRight size={14} style={{ color: 'var(--c-text2)', position: 'absolute', right: '8px', transform: `rotate(${isFilterOpen ? '-90deg' : '90deg'})`, transition: 'transform 0.2s' }} />
                            </div>

                            {isFilterOpen && (
                                <div style={{
                                    position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                                    background: 'var(--c-surface)', border: '1px solid var(--color-border-subtle)',
                                    borderRadius: '8px', padding: '8px 0', zIndex: 9999, minWidth: '160px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}>
                                    {['Усі', 'Сосна', 'Дуб', 'Мікс'].map(breed => {
                                        const isActive = selectedBreed === breed;
                                        const breedKey = breed === 'Мікс' ? 'мікс' : breed;
                                        return (
                                            <div
                                                key={breed}
                                                onClick={() => { setSelectedBreed(breedKey === 'Усі' ? 'Усі' : breedKey); setIsFilterOpen(false); }}
                                                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem', color: isActive ? 'var(--c-orange)' : 'var(--c-text)', background: isActive ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                                            >
                                                {breed}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sorting Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)', zIndex: 20, flexShrink: 1, minWidth: 0 }}>
                        <span style={{ color: 'var(--c-text2)', fontWeight: 500, fontSize: 'clamp(0.75rem, 2.5vw, 1rem)', whiteSpace: 'nowrap' }}>Сортування:</span>
                        <div style={{ position: 'relative', flexShrink: 1, minWidth: 0 }}>
                            <div
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                style={{
                                    position: 'relative', display: 'flex', alignItems: 'center',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                                    borderRadius: '8px', padding: '6px 10px', paddingRight: '24px', cursor: 'pointer',
                                    userSelect: 'none', maxWidth: '180px'
                                }}>
                                <span style={{ color: 'var(--c-text)', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {sortOrder === 'popular' ? 'За популярністю' : sortOrder === 'price_asc' ? 'Від дешевих до дорогих' : 'Від дорогих до дешевих'}
                                </span>
                                <ChevronRight size={14} style={{ color: 'var(--c-text2)', position: 'absolute', right: '12px', transform: `rotate(${isSortOpen ? '-90deg' : '90deg'})`, transition: 'transform 0.2s' }} />
                            </div>

                            {isSortOpen && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                    background: 'var(--c-surface)', border: '1px solid var(--color-border-subtle)',
                                    borderRadius: '8px', padding: '8px 0', zIndex: 9999, minWidth: '220px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}>
                                    <div
                                        onClick={() => { setSortOrder('popular'); setIsSortOpen(false); }}
                                        style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem', color: sortOrder === 'popular' ? 'var(--c-orange)' : 'var(--c-text)', background: sortOrder === 'popular' ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                                    >
                                        За популярністю
                                    </div>
                                    <div
                                        onClick={() => { setSortOrder('price_asc'); setIsSortOpen(false); }}
                                        style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem', color: sortOrder === 'price_asc' ? 'var(--c-orange)' : 'var(--c-text)', background: sortOrder === 'price_asc' ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                                    >
                                        Від дешевих до дорогих
                                    </div>
                                    <div
                                        onClick={() => { setSortOrder('price_desc'); setIsSortOpen(false); }}
                                        style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem', color: sortOrder === 'price_desc' ? 'var(--c-orange)' : 'var(--c-text)', background: sortOrder === 'price_desc' ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                                    >
                                        Від дорогих до дешевих
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify(filteredProducts.map(p => ({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": p.name,
                        "image": p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `https://kievbriket.com${p.image_url}`) : undefined,
                        "description": p.description || p.name,
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "UAH",
                            "price": p.price,
                            "availability": "https://schema.org/InStock",
                            "url": `https://kievbriket.com/catalog/brikety/${p.slug}`
                        }
                    })))
                }} />

                <div
                    className={`product-grid reveal ${visible ? 'visible' : ''}`}
                    style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                        gap: '24px', transitionDelay: '0.2s',
                    }}
                >
                    {filteredProducts.map((product) => (
                        <Link
                            to={`/catalog/brikety/${product.slug}`}
                            key={product.id}
                            className="product-card-link"
                            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
                        >
                            <article
                                className="nh-card hover-glow group"
                                style={{
                                    padding: '0', display: 'flex', flexDirection: 'column',
                                    height: '100%', overflow: 'hidden', position: 'relative', borderRadius: '16px'
                                }}
                            >


                                <div className="product-card-image" style={{ aspectRatio: '4/3', width: '100%', position: 'relative', overflow: 'hidden', background: '#0a0d14' }}>
                                    {product.image_url ? (
                                        <img
                                            src={getImageUrl(product.image_url, api.defaults.baseURL)}
                                            alt={`${product.name} Київ`}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(product.name)}`;
                                            }}
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                transition: 'transform 0.7s ease'
                                            }}
                                            className="group-hover:scale-105"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                            Немає фото
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(10,13,20,0.8) 0%, transparent 60%)',
                                        pointerEvents: 'none'
                                    }} />
                                    <h3 className="product-card-title-overlay" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                                        {product.name}
                                    </h3>
                                </div>

                                <div className="product-card-body" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', flex: 1, background: '#161C25' }}>
                                    <div className="product-card-title-static" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0 }}>
                                        <h3 className="h3" style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.2 }}>{product.name}</h3>
                                    </div>

                                    {product.short_description && (
                                        <div style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                                            {product.short_description}
                                        </div>
                                    )}

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', marginBottom: '1rem' }}>
                                        <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '6px', color: '#e5e7eb', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Zap size={14} style={{ color: 'var(--c-orange)' }} />
                                            <span>Висока тепловіддача</span>
                                        </div>
                                        <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '6px', color: '#e5e7eb', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Droplets size={14} style={{ color: '#22c55e' }} />
                                            <span>Вологість &lt; 8%</span>
                                        </div>
                                    </div>

                                    <div className="desktop-delivery-badge" style={{ marginBottom: '1.25rem' }}>
                                        <span style={{ display: 'inline-flex', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, alignItems: 'center', gap: '4px' }}>
                                            <Truck size={12} /> Доставимо сьогодні
                                        </span>
                                    </div>

                                    <div className="mobile-badges-container" style={{ display: 'none', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                                        <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={12} /> Є в наявності
                                        </span>
                                        <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Truck size={12} /> Доставимо сьогодні
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <div>
                                            <div className="desktop-availability-badge" style={{ marginBottom: '6px' }}>
                                                <span style={{ display: 'inline-flex', background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, alignItems: 'center', gap: '4px' }}>
                                                    <CheckCircle2 size={12} /> Є в наявності
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-orange)' }}>{product.price}</span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--c-text2)' }}>грн / тонна</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOrderProduct(product); }}
                                            className="nh-btn-primary"
                                            style={{
                                                padding: '10px 20px', borderRadius: '8px', fontSize: '0.95rem',
                                                background: 'var(--c-orange)', color: '#fff', fontWeight: 'bold'
                                            }}
                                        >
                                            Замовити
                                        </button>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
                <style>{`
                    .desktop-delivery-badge, .desktop-availability-badge { display: block; }
                    .mobile-badges-container { display: none !important; }
                    @media (max-width: 640px) {
                        .desktop-delivery-badge, .desktop-availability-badge { display: none !important; }
                        .mobile-badges-container { display: flex !important; }
                    }
                `}</style>
            </div>
        </section>
    );
}

// ─── COMPARISON TABLE ────────────────────────────────────────────
function ComparisonTable() {
    const { ref, visible } = useReveal();
    return (
        <section ref={ref} style={{ padding: '60px 0 100px' }}>
            <div className="layout-container">
                <div className={`nh-card reveal ${visible ? 'visible' : ''}`} style={{ padding: '3rem', borderRadius: '24px', overflowX: 'auto' }}>
                    <h2 className="h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>Порівняння паливних брикетів</h2>
                    <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', textAlign: 'left', color: 'var(--c-text)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                <th style={{ padding: '1.5rem 1rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Тип</th>
                                <th style={{ padding: '1.5rem 1rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Тепловіддача</th>
                                <th style={{ padding: '1.5rem 1rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Горіння</th>
                                <th style={{ padding: '1.5rem 1rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Вологість</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                <td style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>RUF</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>висока</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>довге</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>6-8%</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                <td style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>Pini Kay</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-orange)', fontWeight: 600 }}>дуже висока</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>дуже довге</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>5-7%</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>Nestro</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>висока</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>рівномірне</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--c-text2)' }}>6-8%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

// ─── SEO CONTENT ──────────────────────────────────────────────────
function BriquettesSeoBlock() {
    return (
        <section style={{ padding: 'clamp(40px, 10vw, 100px) 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{ width: '100%', padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        Купити паливні брикети у Києві
                    </h2>

                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '3rem' }}>
                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Паливні брикети — це сучасна та високоефективна альтернатива традиційним <Link to="/catalog/drova" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>дровам</Link>. Вони виготовляються шляхом пресування тирси, тріски та інших деревних відходів без додавання будь-якої хімії. Завдяки високому тиску при виробництві, брикети мають надзвичайно низьку вологість (до 8%) та величезну щільність, що робить їх безпечнішою та чистішою альтернативою, ніж <Link to="/catalog/vugillya" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>кам'яне вугілля</Link>.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Це означає, що їх тепловіддача значно перевищує тепловіддачу навіть найсухіших дубових дров. Вони горять довго, стабільно і майже не залишають золи.
                            </p>
                        </div>

                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Окрім чудових теплових характеристик, брикети надзвичайно зручні у зберіганні. Вони акуратно спаковані на піддонах або в упаковках по 10 кг, не засмічують приміщення корою чи пилом.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Компанія «КиївБрикет» пропонує брикети найвищої якості стандартів RUF, Pini Kay та Nestro з доставкою по Києву та Київській області автотранспортом надійно та швидко.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── CROSS CATEGORY BLOCK ─────────────────────────────────────────
function CrossCategoryBlock() {
    return (
        <section style={{ padding: '0 0 60px 0' }}>
            <div className="layout-container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--c-text)', marginBottom: '1.5rem', fontWeight: '700' }}>
                        Також дивіться
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch', justifyContent: 'center' }}>
                        <Link
                            to="/catalog/drova"
                            style={{
                                display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem',
                                borderRadius: '12px', border: '1px solid var(--color-border-subtle)',
                                color: 'var(--c-text)', textDecoration: 'none', fontSize: '1rem',
                                transition: 'all 0.2s', background: 'var(--color-bg-elevated)', gap: '0.75rem'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c-orange)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; }}
                        >
                            <span style={{ color: 'var(--c-orange)' }}>→</span>
                            Дрова для опалення
                        </Link>
                        <Link
                            to="/catalog/vugillya"
                            style={{
                                display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem',
                                borderRadius: '12px', border: '1px solid var(--color-border-subtle)',
                                color: 'var(--c-text)', textDecoration: 'none', fontSize: '1rem',
                                transition: 'all 0.2s', background: 'var(--color-bg-elevated)', gap: '0.75rem'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c-orange)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; }}
                        >
                            <span style={{ color: 'var(--c-orange)' }}>→</span>
                            Кам'яне вугілля
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── POPULAR QUERIES ──────────────────────────────────────────────
function PopularQueriesSection() {
    const { ref, visible } = useReveal();

    const queries = [
        { name: 'брикети RUF Київ', url: '/catalog/brikety' },
        { name: 'паливні брикети Київ', url: '/catalog/brikety' },
        { name: 'купити брикети Київ', url: '/catalog/brikety' },
        { name: 'брикети pini kay Київ', url: '/catalog/brikety' }
    ];

    return (
        <section ref={ref} style={{ padding: 'clamp(30px, 6vw, 60px) 0', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)', background: 'rgba(20,25,30,0.3)' }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '1.5rem', fontWeight: '600' }}>
                        Популярні запити:
                    </h3>
                    <div className="queries-scroll-container">
                        {queries.map((q, idx) => (
                            <Link
                                key={idx}
                                to={q.url}
                                className="query-bubble"
                            >
                                <Flame size={14} style={{ opacity: 0.5 }} />
                                {q.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────
function FaqSection() {
    const { ref, visible } = useReveal();
    const [openIdx, setOpenIdx] = useState(0);

    const faqs = [
        { q: "Що краще — брикети чи дрова?", a: "Все залежить від ваших потреб. Брикети виграють завдяки більшій тепловіддачі та компактності зберігання. Вони горять довше і не стріляють іскрами. Дрова — це класика, створюють гарне полум'я та затишок. Багато хто комбінує: розпалює дровами, а на ніч закладає брикети для тривалого тління." },
        { q: "Які брикети дають більше тепла?", a: "Брикети Pini Kay (з отвором посередині) вважаються лідерами за рівнем тепловіддачі через додаткове випалювання кірки. RUF та Nestro також мають високі показники, проте Pini Kay розгораються швидше та горять найбільш яскраво та жарко." },
        { q: "Скільки брикетів потрібно на зиму?", a: "Для будинку в 100 кв.м. з середньою утепленістю, як правило, достатньо від 3 до 5 тонн паливних брикетів на весь опалювальний сезон. Це значно менше за об'ємом, ніж дрова, де б знадобилося близько 10-15 складометрів." },
        { q: "Чи можна топити брикетами камін?", a: "Так, звісно! Навіть рекомендується. Nestro і Pini Kay ідеально підходять для каміна, оскільки вони не іскрять, мають гарне полум'я і не забивають димохід сажею завдяки дуже низькій вологості. RUF теж підійдуть, але вони горять менш естетично в порівнянні з іншими." }
    ];

    return (
        <section ref={ref} className="faq-mobile-section" style={{ padding: 'clamp(40px, 10vw, 100px) 0' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
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
                })
            }} />
            <div className="layout-container">
                <div className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 className="h2 faq-mobile-h2" style={{ maxWidth: 800, margin: '0 auto' }}>Поширені запитання</h2>
                </div>

                <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: '0.1s' }}>
                    {faqs.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1rem' }}>
                                <button
                                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                                    style={{
                                        width: '100%', textAlign: 'left', background: 'none', border: 'none',
                                        padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', cursor: 'pointer', color: 'var(--c-text)',
                                        fontFamily: 'inherit', fontSize: '1.125rem', fontWeight: 600, gap: '1rem'
                                    }}
                                >
                                    <span style={{ flex: 1 }}>{faq.q}</span>
                                    <ChevronRight
                                        size={20}
                                        style={{
                                            flexShrink: 0,
                                            color: 'var(--c-orange)',
                                            transform: isOpen ? 'rotate(90deg)' : 'none',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                </button>
                                <div style={{ maxHeight: isOpen ? 500 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', color: 'var(--c-text2)', lineHeight: 1.6 }}>
                                    <p style={{ paddingBottom: '1.5rem', margin: 0 }}>{faq.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ─── FINAL CTA BANNER ──────────────────────────────────────────
function FinalCtaBanner({ onQuickOrderClick }) {
    const { ref, visible } = useReveal();

    return (
        <section ref={ref} style={{ padding: 'clamp(40px, 10vw, 100px) 0' }}>
            <div className="layout-container">
                <div
                    className={`nh-card reveal ${visible ? "visible" : ""}`}
                    style={{
                        position: 'relative', overflow: 'hidden',
                        padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)', textAlign: 'center',
                        background: 'linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)',
                        border: '1px solid rgba(249,115,22,0.2)'
                    }}
                >
                    <div style={{
                        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                        width: "100%", height: "100%", background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
                        zIndex: 0, pointerEvents: "none",
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
                        <h2 className="h2" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
                            Замовте паливні брикети <span style={{ color: 'var(--c-orange)' }}>вже сьогодні</span>
                        </h2>
                        <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
                            Доставка по Києву можлива вже сьогодні. Чесний об'єм та гарантія якості від виробника.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={onQuickOrderClick} className="nh-btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                                Замовити
                            </button>
                            <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="nh-btn-ghost" style={{ padding: '16px 32px', fontSize: '1rem', border: '1px solid var(--color-border-medium)' }}>
                                <Phone size={18} style={{ marginRight: 8 }} /> Подзвонити
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── POPULAR BRIQUETTE TYPES BLOCK ──────────────────────────────
function PopularBriquetteTypes() {
    const types = [
        { name: 'Брикети RUF', url: '/catalog/brikety#ruf' },
        { name: 'Брикети Pini Kay', url: '/catalog/brikety#pini-kay' },
        { name: 'Брикети Nestro', url: '/catalog/brikety#nestro' },
        { name: 'Деревні брикети', url: '/catalog/brikety' }
    ];

    return (
        <section style={{ padding: '0 0 60px 0' }}>
            <div className="layout-container">
                <div style={{ padding: '1.5rem 2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--c-text)' }}>
                        Популярні типи брикетів
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                        {types.map((type, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--c-orange)' }} />
                                <Link
                                    to={type.url}
                                    style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-text)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--c-text2)'}
                                >
                                    {type.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function BriquettesCategoryPage({ products, onOrderProduct }) {
    return (
        <div className="new-home-scope">
            <HeroCategory onQuickOrderClick={() => onOrderProduct(null)} />

            <CategoryProducts products={products} onOrderProduct={onOrderProduct} />

            <BriquetteTypesSection />

            <PopularBriquetteTypes />

            <ComparisonTable />

            {/* Reuse existing blocks */}
            <FuelCalculatorSection onQuickOrderClick={() => onOrderProduct(null)} defaultFuelType="brikety" />

            <DeliverySection />
            <BenefitsSection />

            <BriquettesSeoBlock />

            <CrossCategoryBlock />

            <PopularQueriesSection />

            <FaqSection />

            <FinalCtaBanner onQuickOrderClick={() => onOrderProduct(null)} />
        </div>
    );
}
