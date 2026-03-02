import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Phone, Flame, Truck, Scale, ShieldCheck, Thermometer, Clock, Package, CheckCircle2, Droplets, Zap } from 'lucide-react';
import shopConfig from '../shop.config';
import { useReveal } from '../hooks/useReveal';
import api from '../api';
import { getProductUrl } from '../utils/urls';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import { DeliverySection } from './new-home/DeliverySection';
import { BenefitsSection } from './new-home/BenefitsSection';

// ─── HERO CATEGORY SECTION ─────────────────────────────────────────
function HeroCategory({ onQuickOrderClick }) {
    const { ref, visible } = useReveal();
    return (
        <section ref={ref} className="hero-section" style={{ minHeight: 'auto', paddingTop: '40px', paddingBottom: '0', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
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
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Вугілля</span>
                </nav>

                <div className="hero-text fade-up" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)', padding: '2rem 3rem 1.5rem 3rem', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.25rem', color: '#fff' }}>
                        Купити вугілля <span style={{ color: 'var(--c-orange)' }}>у Києві</span>
                    </h1>
                    <p className="hero-subtitle fade-up fade-up-d2" style={{
                        fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
                        maxWidth: '700px', marginBottom: '1.5rem', fontWeight: 400
                    }}>
                        Якісне кам'яне вугілля для котлів та печей з доставкою по Києву та області.
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
                            Замовити вугілля
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
                        display: 'flex', gap: '24px', flexWrap: 'wrap',
                        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', width: '100%'
                    }}>
                        {[
                            { icon: <Truck size={20} />, text: 'доставка сьогодні' },
                            { icon: <Scale size={20} />, text: 'чесний об\'єм' },
                            { icon: <ShieldCheck size={20} />, text: 'оплата після отримання' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
                                <div style={{ color: 'var(--c-orange)', display: 'flex', alignItems: 'center' }}>
                                    <CheckCircle2 size={16} />
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.02em' }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── HOW TO CHOOSE COAL SECTION ─────────────────────────────────
function HowToChooseCoalSection() {
    const { ref, visible } = useReveal();

    const types = [
        {
            title: 'Фракція',
            desc: 'Розмір шматків вугілля. Для автоматичних котлів використовують дрібні фракції (13-25 мм), для класичних печей — крупніше вугілля (25-50 мм), що не провалюється крізь колосники.',
        },
        {
            title: 'Теплотворність',
            desc: 'Кількість тепла, що виділяється при згорянні. Чим вищий цей показник (наприклад, як у антрациту), тим рідше доведеться завантажувати котел і тим більша економія палива.',
        },
        {
            title: 'Тип котла',
            desc: 'Дізнайтесь вимоги виробника вашого обладнання. Автоматизовані системи дуже чутливі до розміру гранул та зольності, тоді як звичайні твердопаливні котли більш універсальні.',
        }
    ];

    return (
        <section ref={ref} style={{ padding: '80px 0 40px' }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="h2">Як вибрати вугілля для опалення</h2>
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
    const [selectedType, setSelectedType] = useState('Усі');
    const [sortOrder, setSortOrder] = useState('popular');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        let list = [...products];
        if (selectedType !== 'Усі') {
            list = list.filter(p => p.name.toLowerCase().includes(selectedType.toLowerCase()));
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
    }, [products, selectedType, sortOrder]);

    return (
        <section ref={ref} className="catalog-section" style={{ paddingTop: '0px', paddingBottom: '100px', position: 'relative', zIndex: 10 }}>
            <div className="layout-container">

                {/* Filter and Sorting Row */}
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{
                    position: 'relative', zIndex: 50,
                    display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '2rem'
                }}>
                    {/* Fuel Type Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--c-text2)', fontWeight: 500, marginRight: '8px' }}>Вид вугілля:</span>
                        {['Усі', 'Антрацит', 'Кам\'яне'].map(type => {
                            const isActive = selectedType === type;
                            const typeKey = type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(typeKey === 'Усі' ? 'Усі' : typeKey)}
                                    style={{
                                        padding: '6px 20px', borderRadius: '40px', fontSize: '0.9rem', fontWeight: isActive ? 600 : 400,
                                        background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                                        color: isActive ? 'var(--c-orange)' : 'var(--c-text2)',
                                        border: `1px solid ${isActive ? 'var(--c-orange)' : 'var(--color-border-subtle)'}`,
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}>{type}</button>
                            );
                        })}
                    </div>

                    {/* Sorting Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20 }}>
                        <span style={{ color: 'var(--c-text2)', fontWeight: 500 }}>Сортування:</span>
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                style={{
                                    position: 'relative', display: 'flex', alignItems: 'center',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                                    borderRadius: '8px', padding: '6px 12px', paddingRight: '32px', cursor: 'pointer',
                                    userSelect: 'none'
                                }}>
                                <span style={{ color: 'var(--c-text)', fontSize: '0.9rem', fontWeight: 500 }}>
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
                        "image": p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `https://kievbriket.com.ua${p.image_url}`) : undefined,
                        "description": p.description || p.name,
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "UAH",
                            "price": p.price,
                            "availability": "https://schema.org/InStock",
                            "url": `https://kievbriket.com.ua/catalog/vugillya/${p.slug}`
                        }
                    })))
                }} />

                <div
                    className={`product-grid reveal ${visible ? 'visible' : ''}`}
                    style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px', transitionDelay: '0.2s',
                    }}
                >
                    {filteredProducts.map((product) => (
                        <Link
                            to={`/catalog/vugillya/${product.slug}`}
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
                                <div style={{
                                    position: 'absolute', top: 16, left: 16, zIndex: 10,
                                    background: 'var(--color-success)', color: '#fff', fontSize: '0.65rem',
                                    fontWeight: 700, padding: '4px 10px', borderRadius: '4px',
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                    boxShadow: '0 0 10px rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    <span>✔ В наявності</span>
                                </div>

                                <div style={{ height: '300px', width: '100%', position: 'relative', overflow: 'hidden', background: '#0a0d14' }}>
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url.startsWith('http') ? product.image_url : `${api.defaults.baseURL}${product.image_url}`}
                                            alt={`${product.name} Київ`}
                                            loading="lazy"
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
                                </div>

                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, background: '#161C25' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1rem', lineHeight: 1.3 }}>
                                        {product.name}
                                    </h3>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--c-text2)', fontSize: '0.875rem' }}>
                                            <Zap size={14} style={{ color: 'var(--c-orange)' }} />
                                            <span>Висока теплотворність</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--c-text2)', fontSize: '0.875rem' }}>
                                            <Thermometer size={14} style={{ color: 'var(--c-orange)' }} />
                                            <span>Довге горіння</span>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '2px', fontWeight: 600 }}>Ціна за тонну</div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-orange)', lineHeight: 1 }}>{product.price}</span>
                                                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>грн</span>
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
            </div>
        </section>
    );
}

// ─── POPULAR TYPES BLOCK (SEO BLOCK 1) ─────────────────────────────────
function PopularTypesBlock() {
    return (
        <section style={{ padding: '0 0 100px 0' }}>
            <div className="layout-container">
                <div className="nh-card" style={{ padding: '4rem', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>Популярні види вугілля</h2>
                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Для різних потреб опалення використовуються <strong>різні фракції вугілля</strong>. Більш дрібні фракції ідеальні для автоматичних котлів, тоді як крупне вугілля добре підходить для класичних печей та твердопаливних котлів, забезпечуючи тривале та рівномірне горіння.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                <strong>Антрацит</strong> — це вугілля найвищої якості. Воно відрізняється максимальною теплотворністю, низьким вмістом золи та мінімальним виділенням диму. Це робить його найкращим вибором для обігріву приватних будинків.
                            </p>
                        </div>
                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Правильне <strong>використання для котлів</strong> гарантує не лише тепло у вашій оселі, але й подовжує термін служби обладнання. Вибираючи якісне паливо, ви зменшуєте витрати на обслуговування котла та підвищуєте ефективність підігріву.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Для альтернативного опалення також часто використовують <Link to="/catalog/drova" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>дрова</Link> або <Link to="/catalog/brikety" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>паливні брикети</Link>. Комбінування різних видів палива дозволяє досягти оптимального балансу ціни та ефективності.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── SEO CONTENT ──────────────────────────────────────────────────
function CoalSeoBlock() {
    return (
        <section style={{ padding: '100px 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{ width: '100%', padding: '4rem', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        Купити кам'яне вугілля у Києві
                    </h2>

                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Шукаєте надійне та економне джерело тепла? Пропонуємо <strong>купити вугілля київ</strong> за вигідними цінами. Наше вугілля має високу теплотворність, довго горить та залишає мінімум золи, що робить його ідеальним вибором як для побутових, так і для промислових потреб.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Ми постачаємо гарантовано якісне <strong>кам'яне вугілля</strong>, яке проходить ретельний контроль вологості та зольності. Незалежно від того, чи потрібне вам паливо для невеликого домашнього котла, чи для великої котельні, ми запропонуємо найкращий з актуальних варіант.
                            </p>
                        </div>

                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Особливим попитом користується <strong>антрацит</strong> — преміальне паливо, що забезпечує максимальну температуру та відсутність диму при горінні. Замовляючи у нас, ви гарантовано отримуєте чесну вагу з доставкою.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Також у нашому асортименті доступні й інші види твердого палива. Ви завжди можете обрати класичні <Link to="/catalog/drova" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>дрова</Link> або спробувати зручні <Link to="/catalog/brikety" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>паливні брикети</Link>, які відмінно доповнюють або замінюють вугілля у деяких котлах.
                            </p>
                        </div>
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
        { name: 'вугілля київ', url: '/catalog/vugillya' },
        { name: 'купити вугілля київ', url: '/catalog/vugillya' },
        { name: 'антрацит київ', url: '/catalog/vugillya' },
        { name: 'кам\'яне вугілля доставка', url: '/catalog/vugillya' }
    ];

    return (
        <section ref={ref} style={{ padding: '60px 0', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)', background: 'rgba(20,25,30,0.3)' }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '1.5rem', fontWeight: '600' }}>
                        Популярні запити:
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                        {queries.map((q, idx) => (
                            <Link
                                key={idx}
                                to={q.url}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.25rem',
                                    borderRadius: '100px', border: '1px solid var(--color-border-subtle)',
                                    color: 'var(--c-text2)', textDecoration: 'none', fontSize: '0.95rem',
                                    transition: 'all 0.2s', background: 'var(--color-bg-elevated)', gap: '0.5rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--c-orange)';
                                    e.currentTarget.style.color = 'var(--c-text)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                                    e.currentTarget.style.color = 'var(--c-text2)';
                                }}
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
        { q: "Яке вугілля краще для котла?", a: "Для більшості класичних твердопаливних котлів найкраще підходить кам'яне вугілля середніх та крупних фракцій, а також антрацит. Антрацит горить довше та дає найбільше тепла, але для його розпалу необхідна вища температура. Кам'яне вугілля легше розгоряється і підходить для систем з меншою тягою." },
        { q: "Яка фракція вугілля потрібна?", a: "Фракція підбирається під тип котла. Для автоматичних котлів зі шнековою подачею використовується 'горішок' або дрібні фракції (13-25 мм). Для котлів з ручним завантаженням та класичних печей краще брати більш крупне вугілля (фракція 25-50 мм і більше), оскільки воно не провалюється крізь колосники." },
        { q: "Чи можна замовити вугілля з доставкою сьогодні?", a: "Так, за наявності вільного транспорту ми можемо організувати доставку в день замовлення. У піковий сезон термін доставки може становити 1-2 дні. Будь ласка, уточнюйте можливість термінової доставки у нашого менеджера по телефону." },
        { q: "Скільки коштує тонна вугілля?", a: "Ціна за тонну варіюється залежно від марки та фракції вугілля. Наприклад, класичне кам'яне вугілля коштує дешевше, ніж високоякісний антрацит. Зверніть увагу на актуальні ціни у нашому каталозі. Для оптових замовлень ми пропонуємо індивідуальні знижки." }
    ];

    return (
        <section ref={ref} style={{ padding: "100px 0" }}>
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
                    <h2 className="h2" style={{ maxWidth: 800, margin: '0 auto' }}>Поширені запитання</h2>
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
                                        fontFamily: 'inherit', fontSize: '1.125rem', fontWeight: 600
                                    }}
                                >
                                    {faq.q}
                                    <ChevronRight
                                        size={20}
                                        style={{
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
        <section ref={ref} style={{ padding: "100px 0" }}>
            <div className="layout-container">
                <div
                    className={`nh-card reveal ${visible ? "visible" : ""}`}
                    style={{
                        position: 'relative', overflow: 'hidden',
                        padding: '4rem 2rem', textAlign: 'center',
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
                            Замовте вугілля <span style={{ color: 'var(--c-orange)' }}>вже сьогодні</span>
                        </h2>
                        <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
                            Доставка по Києву та області. Чесний об'єм та гарантія якості від перевіреного постачальника.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={onQuickOrderClick} className="nh-btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                                Замовити вугілля
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function CoalCategoryPage({ products, onOrderProduct }) {
    return (
        <div className="new-home-scope">
            <HeroCategory onQuickOrderClick={() => onOrderProduct(null)} />

            <CategoryProducts products={products} onOrderProduct={onOrderProduct} />

            <HowToChooseCoalSection />

            <PopularTypesBlock />

            <FuelCalculatorSection onQuickOrderClick={() => onOrderProduct(null)} defaultFuelType="vugillya" />

            <DeliverySection />
            <BenefitsSection />

            <CoalSeoBlock />

            <PopularQueriesSection />

            <FaqSection />

            <FinalCtaBanner onQuickOrderClick={() => onOrderProduct(null)} />
        </div>
    );
}
