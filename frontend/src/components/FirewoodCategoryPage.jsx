import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Phone, Flame, Truck, Scale, ShieldCheck, Thermometer, Clock, Package, CheckCircle2, MessageCircle } from 'lucide-react';
import shopConfig from '../shop.config';
import { useReveal } from '../hooks/useReveal';
import api from '../api';
import { getProductUrl, getImageUrl } from '../utils/urls';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import { DeliverySection } from './new-home/DeliverySection';
import { BenefitsSection } from './new-home/BenefitsSection';

// We import the SEOHead and OrderFormModal from parent if needed, or Parent handles it.
// To keep things simple, we assume Parent (Catalog.jsx) handles SEOHead and OrderModal state,
// and we just render the visual sections here.

// ─── HERO CATEGORY SECTION ─────────────────────────────────────────
function HeroCategory({ onQuickOrderClick, activeCategory, activeCategorySlug }) {
    const { ref, visible } = useReveal();
    return (
        <section ref={ref} className="hero-section" style={{ minHeight: 'auto', paddingTop: 'clamp(5px, 2vw, 40px)', paddingBottom: '0', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
            {/* Background Glow */}
            <div
                className="glow-orb"
                style={{
                    width: 700, height: 600,
                    top: -100, right: '-10%',
                    background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)",
                }}
            />

            <div className="layout-container" style={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kievbriket.com/" },
                            { "@type": "ListItem", "position": 2, "name": activeCategory?.name || 'Дрова', "item": "https://kievbriket.com/catalog/drova" }
                        ]
                    })
                }} />

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className={`reveal ${visible ? 'visible' : ''}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 6,
                    marginBottom: '1rem',
                    fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', width: '100%',
                }}>
                    <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}>Головна</Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{activeCategory?.name || 'Дрова'}</span>
                </nav>

                <div className="hero-text fade-up" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)', padding: 'clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: 'clamp(2rem, 5.5vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 'clamp(0.1rem, 1vw, 0.25rem)', color: '#fff' }}>
                        Купити <span style={{ color: 'var(--c-orange)' }}>{activeCategory?.name?.toLowerCase() || 'дрова'}</span> у Києві
                    </h1>

                    <p className="body hero-sub fade-up fade-up-d2" style={{ maxWidth: 600, marginBottom: 'clamp(0.65rem, 2.5vw, 1.25rem)', fontSize: 'clamp(0.85rem, 3.2vw, 18px)', color: 'var(--c-text2)', lineHeight: 1.5 }}>
                        Сухі колоті дрова з <Link to="/dostavka" className="seo-inline-link" style={{ color: 'inherit', fontWeight: 500 }}>доставкою по Києву</Link> та області. Дуб, граб, береза та інші породи з чесним складометром. Також пропонуємо <Link to="/catalog/brikety" className="seo-inline-link" style={{ color: 'inherit', fontWeight: 500 }}>паливні брикети</Link> та <Link to="/catalog/vugillya" className="seo-inline-link" style={{ color: 'inherit', fontWeight: 500 }}>кам'яне вугілля</Link>.
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
                            Замовити дрова
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

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px dashed rgba(255,255,255,0.1)', marginBottom: 'clamp(0.5rem, 1.8vw, 1rem)' }}></div>

                    <div className="hero-trust-row fade-up fade-up-d3" style={{
                        display: 'flex', gap: 'clamp(0.35rem, 1.5vw, 2rem)', flexWrap: 'wrap', justifyContent: 'flex-start',
                        fontSize: 'clamp(0.7rem, 2.8vw, 0.9rem)', color: 'rgba(255,255,255,0.7)', paddingBottom: '0.25rem'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> Доставка по Києву за 24 години
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> Чесний складометр
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> Оплата після отримання
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}

// ─── SEO INTRO (AFTER PRODUCTS) ──────────────────────────────────
function FirewoodSeoIntro({ activeCategorySlug }) {
    if (activeCategorySlug !== 'drova') return null;

    return (
        <section className="layout-container" style={{ paddingBottom: '32px' }}>
            <div className="nh-card" style={{
                width: '100%',
                margin: '64px 0 0 0',
                padding: 'clamp(1.5rem, 5vw, 4rem)',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.02)'
            }}>
                <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: 'var(--c-text)' }}>
                    Популярні породи дров у Києві
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>
                    <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                        Різні породи деревини мають унікальні характеристики горіння. Тверді породи (дуб, граб, ясен) мають найвищу тепловіддачу та довго тліють — ідеально для котлів тривалого горіння.
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                        Вільха та береза швидко розпалюються, не димлять і чудово підходять для відкритих камінів, а сосна використовується переважно для стартового розпалу або лазень.
                    </p>
                </div>
            </div>
        </section>
    );
}

// ─── TYPES OF FIREWOOD (PRODUCT CARDS) ─────────────────────────────
function CategoryProducts({ products, onOrderProduct, activeCategory }) {
    const { ref, visible } = useReveal();

    // Custom mapping for descriptions
    const getDetailedDesc = (name) => {
        const n = name.toLowerCase();
        if (n.includes('дуб')) return { desc: 'Висока тепловіддача, довге горіння.', use: 'Ідеально для котлів і камінів.' };
        if (n.includes('граб')) return { desc: 'Найбільша щільність, рівне полум\'я.', use: 'Для тримання стабільної температури.' };
        if (n.includes('сосна')) return { desc: 'Легко розпалюється, дає швидкий жар.', use: 'Для лазень і швидкого обігріву.' };
        if (n.includes('береза')) return { desc: 'Рівне красиве полум\'я.', use: 'Для відкритих камінів.' };
        if (n.includes('антрацит')) return { desc: 'Максимальна тепловіддача.', use: 'Для твердопаливних котлів.' };
        if (n.includes('ruf') || n.includes('pini')) return { desc: 'Довге і рівне горіння.', use: 'Ідеально для котлів і камінів.' };
        return { desc: 'Якісне паливо з високою тепловіддачею.', use: 'Універсальне використання.' };
    };

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

    return (
        <>
            <section ref={ref} className="catalog-section" style={{ paddingTop: '0px', paddingBottom: '120px', position: 'relative', zIndex: 10 }}>
                <div className="layout-container">

                    {/* Filter and Sorting Row */}
                    <div style={{
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
                                        {['Усі', 'Дуб', 'Граб', 'Сосна', 'Береза'].map(breed => {
                                            const isActive = selectedBreed === breed;
                                            return (
                                                <div
                                                    key={breed}
                                                    onClick={() => { setSelectedBreed(breed); setIsFilterOpen(false); }}
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

                    {/* Schema.org ItemList */}
                    <script type="application/ld+json" dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "itemListElement": filteredProducts.map((p, idx) => ({
                                "@type": "ListItem",
                                "position": idx + 1,
                                "url": `https://kievbriket.com${getProductUrl(p)}`
                            }))
                        })
                    }} />

                    {/* Schema.org Products */}
                    <script type="application/ld+json" dangerouslySetInnerHTML={{
                        __html: JSON.stringify(filteredProducts.map(p => ({
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": p.name,
                            "image": getImageUrl(p.image_url, api.defaults.baseURL),
                            "description": getDetailedDesc(p.name).desc,
                            "brand": { "@type": "Brand", "name": "КиївБрикет", "logo": "https://kievbriket.com/kievbriket.svg" },
                            "offers": {
                                "@type": "Offer",
                                "price": p.variants?.length > 0 ? p.variants[0].price : p.price,
                                "priceCurrency": "UAH",
                                "availability": "https://schema.org/InStock",
                                "url": `https://kievbriket.com${getProductUrl(p)}`
                            }
                        })))
                    }} />

                    <div className="product-grid">
                        {filteredProducts.map((product, i) => {
                            const info = getDetailedDesc(product.name);
                            const displayPrice = product.variants?.length > 0 ? product.variants[0].price : product.price;

                            return (
                                <Link key={product.id} to={getProductUrl(product)} className="product-card-link" style={{ textDecoration: 'none' }}>
                                    <article className={`reveal product-card-hover ${visible ? 'visible' : ''}`}
                                        style={{
                                            display: 'flex', flexDirection: 'column', height: '100%',
                                            transitionDelay: `${i * 0.1}s`,
                                            overflow: 'hidden',
                                            borderRadius: '16px',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-6px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.15)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div className="product-card-image" style={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden', position: 'relative' }}>
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
                                                <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'flex-start', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '6px', color: '#e5e7eb', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <Flame size={14} color="var(--c-orange)" style={{ flexShrink: 0, marginTop: 1 }} />
                                                    <span>{info.desc}</span>
                                                </div>
                                                <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'flex-start', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '6px', color: '#e5e7eb', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                                                    <span>{info.use}</span>
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
                                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-orange)' }}>{displayPrice}</span>
                                                        <span style={{ fontSize: '0.875rem', color: 'var(--c-text2)' }}>грн / {activeCategory?.slug === 'vugillya' || activeCategory?.slug === 'brikety' ? 'тонну' : 'складометр'}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="nh-btn-primary"
                                                    style={{ padding: '8px 16px', fontSize: '0.875rem', background: 'var(--c-orange)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOrderProduct(product); }}
                                                >
                                                    Замовити
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <style>{`
                    .product-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 24px;
                        width: 100%;
                    }
                    @media (max-width: 1024px) {
                        .product-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                    @media (max-width: 640px) {
                        .product-grid { grid-template-columns: 1fr; }
                        .desktop-delivery-badge, .desktop-availability-badge { display: none !important; }
                        .mobile-badges-container { display: flex !important; }
                    }
                    .product-card-hover:hover .img-zoom {
                        transform: scale(1.05); /* Zoom image precisely on card hover */
                    }
                    .seo-inline-link {
                        color: var(--c-text);
                        text-decoration: underline;
                        text-decoration-color: rgba(255,255,255,0.2);
                        text-underline-offset: 4px;
                        transition: all 0.2s ease;
                    }
                    .seo-inline-link:hover {
                        color: var(--c-orange);
                        text-decoration-color: var(--c-orange);
                    }
                `}</style>
            </section >

            <FirewoodSeoIntro activeCategorySlug={activeCategory?.slug} />
        </>
    );
}

// ─── FAQ SECTION ───────────────────────────────────────────────
function FaqSection() {
    const { ref, visible } = useReveal();
    const [openIdx, setOpenIdx] = useState(0);

    const faqs = [
        { q: "Які дрова краще для котла?", a: "Для твердопаливного котла найкраще підходять тверді породи деревини: дуб, граб та ясен. Вони мають найвищу тепловіддачу та горять найдовше. Вологість не повинна перевищувати 20-25%." },
        { q: "Які дрова найкращі для печі?", a: "Для пічного опалення чудово підходять дрова твердих порід (дуб, граб), які забезпечують тривалий жар. Також часто використовують березові та вільхові дрова, оскільки вони горять рівним красивим полум'ям і менше забивають димохід сажею." },
        { q: "Чи можна купити дрова з доставкою сьогодні?", a: "Так, за умови оформлення замовлення в першій половині дня, доставка по Києву можлива в той самий день. По області — зазвичай на наступний день." },
        { q: "Скільки коштує машина дров?", a: "Вартість залежить від породи деревини та об'єму кузова (ЗІЛ, Камаз, Газель). Вартість доставки розраховується індивідуально в залежності від вашої адреси." },
        { q: "Який об'єм дров у машині? (чесний складометр)", a: "Ми ретельно укладаємо поліна на складі. Наприклад, в ЗІЛ поміщається до 6-7 складометрів. Ви можете особисто рулеткою заміряти габарити укладених дров у кузові перед вивантаженням (Довжина × Ширина × Висота = Складометри)." },
        { q: "Яка вологість дров для опалення?", a: "Ми поставляємо деревину природної та камерної сушки. Оптимальна вологість дров для ефективного горіння становить 15-20%. Саме такі показники дозволяють отримати максимальну тепловіддачу та мінімізувати утворення сажі." }
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
                            <div
                                key={idx}
                                style={{
                                    borderBottom: '1px solid var(--color-border-subtle)',
                                    marginBottom: '1rem'
                                }}
                            >
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
                                <div style={{
                                    maxHeight: isOpen ? 500 : 0,
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s ease',
                                    color: 'var(--c-text2)',
                                    lineHeight: 1.6
                                }}>
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
function FinalCtaBanner({ onQuickOrderClick, activeCategory }) {
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
                    {/* Glow behind the CTA */}
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "100%",
                        height: "100%",
                        background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
                        zIndex: 0,
                        pointerEvents: "none",
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
                        <h2 className="h2" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
                            Замовте {activeCategory?.name?.toLowerCase() || 'тверде паливо'} <span style={{ color: 'var(--c-orange)' }}>вже сьогодні</span>
                        </h2>
                        <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
                            Доставка по Києву можлива вже сьогодні. Чесний об'єм та гарантія якості від виробника.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={onQuickOrderClick} className="nh-btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                                Замовити {activeCategory?.name?.toLowerCase() || ''}
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

// ─── MAIN FIREWOOD CATEGORY COMPONENT ────────────────────────
export default function FirewoodCategoryPage({ products, seo, onOrderProduct, activeCategory, activeCategorySlug }) {

    // We import DeliverySection and BenefitsSection from new-home
    // Since creating them here duplicates too much code, let's just 
    // mock them or re-import them if we can't.
    // Actually, since I'm placing this file in frontend/src/components/
    // Let's assume this component lives inside `frontend/src/components/FirewoodCategoryPage.jsx`
    // and imports DeliverySection and BenefitsSection from `./new-home/...`.

    return (
        <div className="new-home-scope">
            <HeroCategory
                onQuickOrderClick={() => onOrderProduct(null)}
                activeCategory={activeCategory}
                activeCategorySlug={activeCategorySlug}
            />

            <CategoryProducts
                products={products}
                onOrderProduct={onOrderProduct}
                activeCategory={activeCategory}
            />

            <HowToChooseFirewood activeCategorySlug={activeCategorySlug} />

            <FuelCalculatorSection onQuickOrderClick={() => onOrderProduct(null)} />

            {/* Delivery and Benefits from existing NewHome */}
            <DeliverySection />
            <BenefitsSection />

            {/* SEO Text Block */}
            {activeCategorySlug === 'drova' ? (
                <FirewoodSeoBlock />
            ) : (
                <section style={{ padding: 'clamp(40px, 10vw, 100px) 0', display: 'flex', justifyContent: 'center' }}>
                    <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="nh-card" style={{ width: '100%', padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                            <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                                {activeCategory?.seo_h1 || `Купити ${activeCategory?.name?.toLowerCase() || 'тверде паливо'} у Києві`}
                            </h2>
                            <div
                                style={{ maxWidth: '100%', color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', textAlign: 'left' }}
                                dangerouslySetInnerHTML={{
                                    __html: activeCategory?.seo_text || `
                                    <p>Якісне тверде паливо для опалення будинків, котлів та камінів.</p>
                                    <p>Ми гарантуємо чесний об'єм та швидку доставку по Києву та всій Київській області. Оплата здійснюється тільки після отримання та перевірки на місці — жодних передоплат і ризиків. Доставка можлива день у день!</p>
                                    `
                                }}
                            />
                        </div>
                    </div>
                </section>
            )}

            <PopularQueriesSection activeCategorySlug={activeCategorySlug} />

            <FaqSection />

            <FinalCtaBanner onQuickOrderClick={() => onOrderProduct(null)} activeCategory={activeCategory} />
        </div>
    );
}

// ─── CUSTOM FIREWOOD SEO BLOCK ─────────────────────────────────
function FirewoodSeoBlock() {
    return (
        <section style={{ padding: 'clamp(40px, 10vw, 100px) 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{ width: '100%', padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        Купити дрова у Києві
                    </h2>

                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '3rem' }}>

                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Купити дрова з доставкою по Києву та Київській області можна безпосередньо у постачальника. Компанія «КиївБрикет» пропонує колоті дрова різних порід дерева для ефективного опалення приватних будинків, котлів та камінів, а також <Link to="/catalog/brikety" className="seo-inline-link">паливні брикети</Link> та <Link to="/catalog/vugillya" className="seo-inline-link">кам'яне вугілля</Link>.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Ми доставляємо дрова дуба, граба, сосни, берези та вільхи. Усі дрова мають низьку вологість та високу тепловіддачу. Працює швидка та зручна <Link to="/dostavka" className="seo-inline-link">доставка по Києву</Link> та області.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--c-text)', fontSize: '1.125rem', marginBottom: '1rem', fontWeight: '600' }}>
                                    Популярні породи дров:
                                </h3>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.625rem' }}>
                                    {[
                                        { name: 'дубові дрова', slug: 'oak' },
                                        { name: 'грабові дрова', slug: 'hornbeam' },
                                        { name: 'березові дрова', slug: 'birch' },
                                        { name: 'соснові дрова', slug: 'pine' },
                                        { name: 'вільхові дрова', slug: 'alder' }
                                    ].map((item, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Flame size={14} color="var(--c-orange)" />
                                            <Link to={`/catalog/drova/${item.slug}`} style={{ color: 'var(--c-text2)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-text2)'; e.currentTarget.style.textDecorationColor = 'rgba(255,255,255,0.2)'; }}>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Internal Links Block */}
                            <div style={{
                                paddingTop: '1.5rem',
                                borderTop: '1px solid var(--color-border-subtle)',
                                display: 'flex', flexDirection: 'column', gap: '1rem'
                            }}>
                                <h4 style={{ color: 'var(--c-text)', fontSize: '1.05rem', margin: 0, fontWeight: '600' }}>Також дивіться:</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                                    <Link to="/catalog/brikety" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-orange)', textDecoration: 'none', fontWeight: 500 }}>
                                        <span>→</span> Паливні брикети
                                    </Link>
                                    <Link to="/catalog/vugillya" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-orange)', textDecoration: 'none', fontWeight: 500 }}>
                                        <span>→</span> Кам’яне вугілля
                                    </Link>
                                    <Link to="/dostavka" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-orange)', textDecoration: 'none', fontWeight: 500 }}>
                                        <span>→</span> Доставка по Києву
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── POPULAR QUERIES (GRID) ────────────────────────────────────
function PopularQueriesSection({ activeCategorySlug }) {
    if (activeCategorySlug !== 'drova') return null;

    const queries = [
        { text: "Купити дубові дрова Київ", to: "/catalog/drova/dubovi-drova" },
        { text: "Дрова граб Київ", to: "/catalog/drova/hrabovi-drova" },
        { text: "Дрова береза Київ", to: "/catalog/drova/berezovi-drova" },
        { text: "Дрова для каміна", to: "/catalog/drova/drova-dlya-kamina" },
        { text: "Дрова в ящиках", to: "/catalog/drova/drova-v-yashchykakh" },
        { text: "Дрова складометр Київ", to: "/catalog/drova/dubovi-drova" }
    ];

    return (
        <section style={{ padding: 'clamp(40px, 10vw, 100px) 0' }}>
            <div className="layout-container">
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <h3 className="h3" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Популярні запити</h3>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem'
                    }}>
                        {queries.map((q, i) => (
                            <Link
                                key={i}
                                to={q.to}
                                className="popular-link"
                                style={{
                                    padding: '8px 16px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '40px',
                                    color: 'var(--c-text2)',
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(249,115,22,0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)';
                                    e.currentTarget.style.color = 'var(--c-orange)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.color = 'var(--c-text2)';
                                }}
                            >
                                {q.text}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── HOW TO CHOOSE FIREWOOD ────────────────────────────────────
function HowToChooseFirewood({ activeCategorySlug }) {
    if (activeCategorySlug !== 'drova') return null;

    return (
        <section style={{ padding: 'clamp(40px, 10vw, 100px) 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{ width: '100%', padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem' }}>
                        Як вибрати дрова для опалення
                    </h2>

                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2.5rem' }}>
                        <div>
                            <p style={{ marginBottom: '1rem' }}>
                                Правильний вибір дров залежить від типу вашого опалювального пристрою. <strong>Для твердопаливного котла</strong> найкраще підходять дуб, граб та ясен, а також <Link to="/catalog/brikety" className="seo-inline-link">паливні брикети</Link> чи <Link to="/catalog/vugillya" className="seo-inline-link">кам'яне вугілля</Link>. Вони мають високу щільність, забезпечують довготривале горіння (тління) і максимальну тепловіддачу.
                            </p>
                        </div>
                        <div>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Для закритої печі або відкритого каміна</strong> чудовим вибором стануть береза та вільха. Ці породи легко розпалюються, горять гарним високим полум'ям і, що найважливіше, виділяють мінімум кіптяви та диму, запобігаючи швидкому засміченню димоходу. Сосну найчастіше використовують для лазень або як стартове паливо для розпалу.
                            </p>
                        </div>
                        <div>
                            <p style={{ marginBottom: 0 }}>
                                Окремо варто звернути увагу на <strong>вологість</strong>. Оптимальна вологість дров для ефективного опалення не повинна перевищувати 20-25%. Використання свіжопиляних дров значно знижує ККД котла та призводить до утворення конденсату та сажі.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
