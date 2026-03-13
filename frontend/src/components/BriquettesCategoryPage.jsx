import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Phone, Flame, Truck, Scale, ShieldCheck, Thermometer, Clock, Package, CheckCircle2, Droplets, Zap } from 'lucide-react';
import shopConfig from '../shop.config';
import { useReveal } from '../hooks/useReveal';
import api from '../api';
import { getProductUrl, getImageUrl } from '../utils/urls';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import ProductImageGallery from './ProductImageGallery';
import { DeliverySection } from './new-home/DeliverySection';
import { BenefitsSection } from './new-home/BenefitsSection';
import FaqSection from './FaqSection';
import { Helmet } from 'react-helmet-async';

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
                        display: 'flex', gap: 'clamp(0.35rem, 1.5vw, 2rem)', flexWrap: 'nowrap', justifyContent: 'flex-start',
                        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'clamp(12px, 3vw, 16px)', width: '100%',
                        fontSize: 'clamp(0.7rem, 2.8vw, 0.9rem)', color: 'rgba(255,255,255,0.7)', overflowX: 'auto', WebkitOverflowScrolling: 'touch'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            <span style={{ color: '#22C55E' }}>✔</span> чесний складометр
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            <span style={{ color: '#22C55E' }}>✔</span> оплата після отримання
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
                                onClick={() => {
                                    setIsFilterOpen(!isFilterOpen);
                                    if (!isFilterOpen) setIsSortOpen(false);
                                }}
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
                                onClick={() => {
                                    setIsSortOpen(!isSortOpen);
                                    if (!isSortOpen) setIsFilterOpen(false);
                                }}
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
                        "image": p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `https://kievdrova.com.ua${p.image_url}`) : undefined,
                        "description": p.description || p.name,
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "UAH",
                            "price": p.price,
                            "availability": "https://schema.org/InStock",
                            "url": `https://kievdrova.com.ua/catalog/brikety/${p.slug}`
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
                    {filteredProducts.map((product, i) => {
                        const displayPrice = product.variants?.length > 0 ? product.variants[0].price : product.price;
                        const info = {
                            desc: 'Висока тепловіддача',
                            use: 'Вологість < 8%',
                        };
                        const getProductUrl = (p) => `/catalog/brikety/${p.slug}`;

                        return (
                            <Link key={product.id} to={getProductUrl(product)} className="product-card-link group relative block" style={{ textDecoration: 'none' }}>
                                <article
                                    className="bg-[#1c1c1e] rounded-[16px] overflow-hidden border border-[#2a2a2a] transition-all duration-200 cursor-pointer"
                                    style={{
                                        display: 'flex', flexDirection: 'column', height: '100%',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                        transform: 'translateY(0px)',
                                        willChange: 'transform, box-shadow',
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget;
                                        el.style.transform = 'translateY(-10px)';
                                        el.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.25), 0 20px 60px rgba(249,115,22,0.15)';
                                        el.style.borderColor = 'rgba(249,115,22,0.3)';
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget;
                                        el.style.transform = 'translateY(0px)';
                                        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
                                        el.style.borderColor = '#2a2a2a';
                                    }}
                                >
                                    <div className="product-card-image relative overflow-hidden bg-[#d9d0c4]" style={{ height: '280px', width: '100%' }}>
                                        <img
                                            src={getImageUrl(product.image_url, api.defaults.baseURL)}
                                            alt={`${product.name} Київ`}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(product.name)}`;
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </div>
                                    <div className="px-5 pb-5 pt-4 flex flex-col flex-1">
                                        <h3 className="text-white mb-3" style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>
                                            {product.name}
                                        </h3>
                                        <div className="space-y-2 mb-3 flex-1">
                                            <div className="flex items-start gap-2">
                                                <Flame className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-zinc-400" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                                    {info.desc}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-zinc-400" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                                    {info.use}
                                                </span>
                                            </div>
                                        </div>

                                        {product.is_available !== false && (
                                            <div className="inline-flex items-center gap-1.5 bg-[#252525] border border-[#313131] rounded-lg px-3 py-1.5 mb-4 max-w-max">
                                                <Truck className="w-3.5 h-3.5 text-zinc-500" />
                                                <span className="text-zinc-400" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                                    Доставимо за 24 години
                                                </span>
                                            </div>
                                        )}

                                            <div className="flex items-end justify-between gap-2 mt-auto">
                                                <div>
                                                    <div className={`flex items-center gap-1.5 mb-1.5 ${product.is_available !== false ? 'text-emerald-500' : 'text-red-400'}`}>
                                                        {product.is_available !== false
                                                            ? <CheckCircle2 className="w-3.5 h-3.5" />
                                                            : <CheckCircle2 className="w-3.5 h-3.5 opacity-50" />
                                                        }
                                                        <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>
                                                            {product.is_available !== false ? 'Є в наявності' : 'Немає в наявності'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-white" style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>
                                                            {Number(displayPrice).toLocaleString('uk-UA')}
                                                        </span>
                                                        <span className="text-zinc-500" style={{ fontSize: '0.78rem' }}>
                                                            грн / тонну
                                                        </span>
                                                    </div>
                                                </div>

                                                {product.is_available !== false ? (
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOrderProduct(product); }}
                                                        className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm transition-all flex-shrink-0"
                                                        style={{ fontWeight: 600, border: 'none' }}
                                                    >
                                                        Замовити
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOrderProduct(product); }}
                                                        className="text-zinc-400 hover:text-white hover:border-orange-500 transition-all flex-shrink-0 whitespace-nowrap"
                                                        style={{ fontSize: '0.78rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 14px', fontWeight: 500, borderRadius: '12px', cursor: 'pointer' }}
                                                    >
                                                        Повідомити про появу
                                                    </button>
                                                )}
                                            </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
                <style>{`
                    .desktop-delivery-badge, .desktop-availability-badge { display: block; }
                    .mobile-badges-container { display: none !important; }
                    @media (max-width: 640px) {
                        .desktop-delivery-badge, .desktop-availability-badge { display: none !important; }
                        .mobile-badges-container { display: flex !important; }
                    }

                    .ag-green-pulse {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background-color: #22c55e;
                        box-shadow: 0 0 12px #22c55e;
                        animation: agPulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
                        display: inline-block;
                    }
                    @keyframes agPulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.6; transform: scale(1.3); }
                    }
                    
                    .ag-truck-bounce {
                        animation: agBounce 2s infinite ease-in-out;
                    }
                    @keyframes agBounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
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
        <section ref={ref} style={{ padding: 'clamp(40px, 8vw, 60px) 0 clamp(60px, 12vw, 100px)' }}>
            <div className="layout-container">
                <div className={`nh-card reveal ${visible ? 'visible' : ''} briquettes-compare-card`}>
                    <h2 className="h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>Порівняння паливних брикетів</h2>
                    <table className="briquettes-comparison-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--c-text)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                <th>Тип</th>
                                <th>Тепловіддача</th>
                                <th>Горіння</th>
                                <th>Вологість</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="briquettes-tr" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                <td data-label="Тип"><strong style={{ color: 'var(--c-text)' }}>RUF</strong></td>
                                <td data-label="Тепловіддача">висока</td>
                                <td data-label="Горіння">довге</td>
                                <td data-label="Вологість">6-8%</td>
                            </tr>
                            <tr className="briquettes-tr" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                <td data-label="Тип"><strong style={{ color: 'var(--c-text)' }}>Pini Kay</strong></td>
                                <td data-label="Тепловіддача"><span style={{ color: 'var(--c-orange)', fontWeight: 600 }}>дуже висока</span></td>
                                <td data-label="Горіння">дуже довге</td>
                                <td data-label="Вологість">5-7%</td>
                            </tr>
                            <tr className="briquettes-tr">
                                <td data-label="Тип"><strong style={{ color: 'var(--c-text)' }}>Nestro</strong></td>
                                <td data-label="Тепловіддача">висока</td>
                                <td data-label="Горіння">рівномірне</td>
                                <td data-label="Вологість">6-8%</td>
                            </tr>
                        </tbody>
                    </table>

                    <style>{`
                        .briquettes-compare-card {
                            padding: 3rem;
                            border-radius: 24px;
                        }
                        .briquettes-comparison-table th,
                        .briquettes-comparison-table td {
                            padding: 1.5rem 1rem;
                        }
                        .briquettes-comparison-table th {
                            font-weight: 600;
                            color: rgba(255,255,255,0.6);
                        }
                        .briquettes-comparison-table td {
                            color: var(--c-text2);
                        }
                        
                        @media (max-width: 640px) {
                            .briquettes-compare-card {
                                padding: 1.5rem !important;
                                border-radius: 16px !important;
                            }
                            .briquettes-comparison-table,
                            .briquettes-comparison-table thead,
                            .briquettes-comparison-table tbody,
                            .briquettes-comparison-table th,
                            .briquettes-comparison-table form {
                                display: block;
                                width: 100%;
                            }
                            .briquettes-comparison-table tr {
                                display: flex;
                                flex-direction: column;
                                width: 100%;
                            }
                            .briquettes-comparison-table thead tr {
                                display: none; /* Hide header row */
                            }
                            .briquettes-comparison-table .briquettes-tr {
                                padding: 1rem 0;
                            }
                            .briquettes-comparison-table .briquettes-tr:first-child {
                                padding-top: 0;
                            }
                            .briquettes-comparison-table .briquettes-tr:last-child {
                                padding-bottom: 0;
                            }
                            .briquettes-comparison-table td {
                                display: flex;
                                padding: 0.6rem 0.5rem;
                                align-items: center;
                                justify-content: space-between;
                                text-align: right;
                            }
                            .briquettes-comparison-table td::before {
                                content: attr(data-label);
                                font-weight: 500;
                                color: rgba(255,255,255,0.5);
                                text-align: left;
                                padding-right: 15px;
                            }
                        }
                    `}</style>
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
                                Компанія «КиївДрова» пропонує брикети найвищої якості стандартів RUF, Pini Kay та Nestro з доставкою по Києву та Київській області автотранспортом надійно та швидко.
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
                    <div className="cross-category-links" style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch', justifyContent: 'center', width: '100%' }}>
                        <Link
                            to="/catalog/drova"
                            style={{
                                display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem',
                                borderRadius: '12px', border: '1px solid var(--color-border-subtle)',
                                color: 'var(--c-text)', textDecoration: 'none', fontSize: '1rem',
                                transition: 'all 0.2s', background: 'var(--color-bg-elevated)', gap: '0.75rem',
                                flex: 1, justifyContent: 'center', textAlign: 'center'
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
                                transition: 'all 0.2s', background: 'var(--color-bg-elevated)', gap: '0.75rem',
                                flex: 1, justifyContent: 'center', textAlign: 'center'
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
            <style>{`
                @media (max-width: 640px) {
                    .cross-category-links {
                        width: 100% !important;
                    }
                    .cross-category-links > a {
                        flex: 1 !important;
                        padding-left: 0.5rem !important;
                        padding-right: 0.5rem !important;
                        font-size: 0.9rem !important;
                        white-space: nowrap;
                    }
                }
            `}</style>
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
        <section ref={ref} style={{ padding: 'clamp(30px, 6vw, 60px) 0' }}>
            <div className="layout-container">
                <div className="mobile-query-block" style={{ borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)', background: 'rgba(20,25,30,0.3)' }}>
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
            </div>
            <style>{`
                @media (max-width: 640px) {
                    .mobile-query-block {
                        padding: 1.5rem 1rem !important;
                        border-radius: 16px !important;
                        border: 1px solid var(--color-border-subtle) !important;
                    }
                }
                @media (min-width: 641px) {
                    .mobile-query-block {
                        padding: 3rem 0;
                    }
                }
            `}</style>
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

                        <div className="category-bottom-cta-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={onQuickOrderClick} className="nh-btn-primary category-bottom-btn" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                                Замовити
                            </button>
                            <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="nh-btn-ghost category-bottom-btn" style={{ padding: '16px 32px', fontSize: '1rem', border: '1px solid var(--color-border-medium)' }}>
                                <Phone size={18} style={{ marginRight: 8 }} /> Подзвонити
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 479px) {
                    .category-bottom-cta-wrap {
                        flex-direction: column !important;
                        width: 100% !important;
                    }
                    .category-bottom-btn {
                        width: 100% !important;
                        justify-content: center !important;
                    }
                }
            `}</style>
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
                    <h3 className="mobile-center-text" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--c-text)' }}>
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
            <style>{`
                @media (max-width: 640px) {
                    .mobile-center-text {
                        text-align: center;
                    }
                }
            `}</style>
        </section>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function BriquettesCategoryPage({ products, onOrderProduct }) {
    const [faqs, setFaqs] = useState([]);

    React.useEffect(() => {
        api.get('/api/faqs?page=brikety')
            .then(res => setFaqs(res.data || []))
            .catch(() => { });
    }, []);

    const schemaList = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Паливні брикети",
            "url": "https://kievdrova.com.ua/catalog/brikety",
            "description": "Купити паливні брикети RUF, Pini Kay, Nestro в Києві з доставкою.",
            "isPartOf": {
                "@type": "WebSite",
                "name": "КиївДрова",
                "url": "https://kievdrova.com.ua"
            }
        }
    ];

    if (faqs.length > 0) {
        schemaList.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        });
    }

    return (
        <div className="new-home-scope">
            <Helmet>
                <title>Купити паливні брикети в Києві — ціна від виробника | КиївДрова</title>
                <meta name="description" content="Паливні брикети RUF, Pini-Kay, Nestro для опалення. Купити брикети в Києві з доставкою. Висока тепловіддача, без передоплати." />
                <meta property="og:title" content="Купити паливні брикети в Києві | КиївДрова" />
                <meta property="og:description" content="Паливні брикети RUF, Pini-Kay, Nestro. Висока тепловіддача. Доставка по Києву та області." />
                <meta property="og:image" content="https://kievdrova.com.ua/media/categories/briquettes.webp" />
                <meta property="og:url" content="https://kievdrova.com.ua/catalog/brikety" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="КиївДрова" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Купити паливні брикети в Києві | КиївДрова" />
                <meta name="twitter:description" content="Паливні брикети RUF, Pini-Kay, Nestro. Доставка по Києву та області." />
                <meta name="twitter:image" content="https://kievdrova.com.ua/media/categories/briquettes.webp" />
                <link rel="canonical" href="https://kievdrova.com.ua/catalog/brikety" />
                <script type="application/ld+json">
                    {JSON.stringify(schemaList)}
                </script>
            </Helmet>

            <HeroCategory onQuickOrderClick={() => onOrderProduct(null)} />

            <CategoryProducts products={products} onOrderProduct={onOrderProduct} />

            <BriquetteTypesSection />

            <PopularBriquetteTypes />

            <ComparisonTable />

            {/* Reuse existing blocks */}
            <FuelCalculatorSection onQuickOrderClick={(payload) => onOrderProduct(payload)} defaultFuelType="brikety" />

            <DeliverySection />
            <BenefitsSection />

            <BriquettesSeoBlock />

            <CrossCategoryBlock />

            <PopularQueriesSection />

            <FaqSection pageId="brikety" />

            <FinalCtaBanner onQuickOrderClick={() => onOrderProduct(null)} />
        </div>
    );
}
