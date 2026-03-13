import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import shopConfig from '../shop.config';
import { ArrowRight, ChevronRight, Phone, Truck, ShieldCheck, MapPin, CheckCircle2, Navigation, Package, Flame, Clock } from 'lucide-react';
import SEOHead from './SEOHead';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import { BenefitsSection } from './new-home/BenefitsSection';
import { OrderFormModal } from './new-home/OrderFormModal';
import { DeliverySection, KyivMap } from './new-home/DeliverySection';
import FaqSection from './FaqSection';
import { usePageSEO } from '../hooks/usePageSEO';
import api from '../api';

// ─── HERO SECTION ──────────────────────────────────────────────────
function HeroDelivery({ onOrderClick }) {
    const { ref, visible } = useReveal();
    return (
        <section ref={ref} className="hero-section" style={{ minHeight: 'auto', paddingTop: 'clamp(15px, 3vw, 104px)', paddingBottom: '0', position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
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
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Доставка</span>
                </nav>

                <div className="hero-text fade-up" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)', padding: '2.5rem 3rem 2rem 3rem', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: 'clamp(2.5rem, 6vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', color: '#fff' }}>
                        Доставка дров, брикетів та вугілля <span style={{ color: 'var(--c-orange)' }}>по Києву та області</span>
                    </h1>
                    <p className="hero-subtitle fade-up fade-up-d2" style={{
                        fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
                        maxWidth: '700px', marginBottom: '2rem', fontWeight: 400
                    }}>
                        Доставка власним транспортом: Газель, ЗІЛ, КАМАЗ, маніпулятор. Швидко, надійно, із розвантаженням.
                    </p>

                    <div className="hero-actions fade-up fade-up-d3" style={{ display: 'flex', gap: '16px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={onOrderClick}
                            className="btn-glow"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'var(--c-orange)', color: '#fff', padding: '16px 32px',
                                borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                                border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            Замовити доставку
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
            <style>{`
                @media (max-width: 768px) {
                    .hero-section .layout-container {
                        padding-left: 15px !important;
                        padding-right: 15px !important;
                    }
                    .hero-text {
                        padding: 1.5rem !important;
                        width: 100% !important;
                    }
                    .hero-h1 {
                        font-size: 2rem !important;
                        text-align: left !important;
                    }
                    .hero-subtitle {
                        text-align: left !important;
                    }
                    .hero-benefits {
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        align-items: center !important;
                        gap: 0.75rem !important;
                        overflow-x: auto !important;
                    }
                }
            `}</style>
        </section>
    );
}

// ─── DELIVERY ZONES ────────────────────────────────────────────────
function DeliveryZones() {
    const { ref, visible } = useReveal();

    const zones = [
        {
            title: 'Київ',
            desc: 'Доставка протягом дня',
            icon: <MapPin size={28} color="var(--c-orange)" />
        },
        {
            title: 'Передмістя Києва',
            desc: 'Доставка 1-2 дні',
            icon: <Navigation size={28} color="var(--c-orange)" />
        },
        {
            title: 'Київська область',
            desc: 'Індивідуальний розрахунок',
            icon: <Truck size={28} color="var(--c-orange)" />
        }
    ];

    return (
        <section ref={ref} style={{ padding: '60px 0 40px' }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="h2">Зони доставки</h2>
                </div>

                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {zones.map((z, i) => (
                        <div key={i} className="nh-card hover-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', borderRadius: '16px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(249,115,22,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                                border: '1px solid rgba(249,115,22,0.2)'
                            }}>
                                {z.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--c-text)' }}>{z.title}</h3>
                            <p style={{ color: 'var(--c-text2)', fontWeight: 500, margin: 0, fontSize: '1.05rem' }}>{z.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── DELIVERY MAP BLOCK ────────────────────────────────────────────
function DeliveryMap() {
    const { ref, visible } = useReveal();

    return (
        <section ref={ref} style={{ padding: '40px 0 60px' }}>
            <div className="layout-container">
                <div className={`map-split-layout reveal ${visible ? 'visible' : ''}`}>
                    {/* Text Block */}
                    <div className="nh-card map-text-block">
                        <div style={{ maxWidth: 500 }}>
                            <h3 className="h3 map-overlay-title" style={{ fontSize: '2.25rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                                Безперебійна доставка по <span style={{ color: 'var(--c-orange)' }}>всьому Києву</span> та <span style={{ color: 'var(--c-orange)' }}>області</span>
                            </h3>
                            <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', lineHeight: 1.6 }}>
                                Ми доставляємо дрова, паливні брикети та вугілля по всьому Києву та області. Власний автопарк дозволяє гнучко підстроїтися під ваші потреби, гарантуючи вчасність та акуратність при розвантаженні.
                            </p>
                        </div>
                    </div>

                    {/* Map Visual Block */}
                    <div className="map-visual-block" style={{
                        background: 'var(--color-bg-green-card)',
                        border: '1px solid var(--color-border-orange-lg)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <KyivMap />
                    </div>
                </div>
            </div>

            <style>{`
                .map-split-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    align-items: stretch;
                }
                .map-text-block {
                    padding: clamp(2rem, 4vw, 3rem);
                    background: #0a0d14;
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.08);
                    display: flex;
                    align-items: center;
                }
                .map-visual-block {
                    aspect-ratio: 4/3;
                    min-height: 350px;
                }
                @media (max-width: 991px) {
                    .map-split-layout {
                        grid-template-columns: 1fr;
                    }
                    .map-visual-block {
                        min-height: 300px;
                        aspect-ratio: auto;
                    }
                }
                @media (max-width: 479px) {
                    .map-text-block {
                        padding: 1.5rem;
                        background: #0a0d14 !important;
                    }
                    .map-overlay-title {
                        font-size: 1.8rem !important;
                    }
                    .map-visual-block {
                        min-height: 250px;
                        border-radius: 16px;
                        width: 100%;
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </section>
    );
}

// ─── DELIVERY COST ─────────────────────────────────────────────────
function DeliveryCost() {
    const { ref, visible } = useReveal();

    const costs = [
        { area: 'Київ', price: 'від 300 грн', desc: 'Усі райони міста', icon: <MapPin size={24} /> },
        { area: 'Передмістя', price: 'від 400 грн', desc: 'До 30 км від КПП', icon: <Navigation size={24} /> },
        { area: 'Київська область', price: 'за домовленістю', desc: 'Індивідуальний розрахунок', icon: <Truck size={24} /> },
    ];

    return (
        <section ref={ref} style={{ padding: '60px 0 100px' }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="h2">Вартість доставки</h2>
                    <p style={{ color: 'var(--c-text2)', fontSize: '1.05rem', marginTop: '1rem', maxWidth: 600, margin: '1rem auto 0' }}>
                        Прозорі ціни без прихованих платежів. Остаточна вартість залежить від точної відстані та обсягу замовлення.
                    </p>
                </div>

                <div className={`reveal ${visible ? 'visible' : ''}`} style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '1.5rem', transitionDelay: '0.1s'
                }}>
                    {costs.map((item, i) => (
                        <div key={i} className="nh-card hover-glow" style={{
                            padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(20,25,30,0.5) 100%)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
                            position: 'relative', overflow: 'hidden', cursor: 'default'
                        }}>
                            {/* Subtle top glow */}
                            <div style={{
                                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                                width: '60%', height: '2px', background: 'var(--c-orange)', opacity: 0.5,
                                filter: 'blur(8px)'
                            }} />

                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                                color: 'var(--c-orange)', border: '1px solid rgba(249,115,22,0.2)'
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--c-text)' }}>{item.area}</h3>
                            <p style={{ color: 'var(--c-text2)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{item.desc}</p>

                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-orange)' }}>{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── SEO CONTENT ──────────────────────────────────────────────────
function DeliverySeoBlock() {
    return (
        <section style={{ padding: 'clamp(40px, 10vw, 100px) 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{ width: '100%', padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        Доставка дров, брикетів та вугілля у Києві
                    </h2>

                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '3rem' }}>
                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Ми доставляємо <Link to="/catalog/drova" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>дрова</Link>, <Link to="/catalog/brikety" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>паливні брикети</Link> та <Link to="/catalog/vugillya" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>кам'яне вугілля</Link> по всьому Києву та області надійним транспортом. Обираючи доставку від постачальника, ви отримуєте гарантію точної ваги та прозорих цін без прихованих платежів за вивантаження.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                <strong>Доставка дров</strong> відбувається автотранспортом від ЗІЛу до Камазу залежно від обсягу. Всі дрова щільно вкладаються в кузові, щоб ви могли перевірити чесність складометра власноруч до моменту вивантаження товарів.
                            </p>
                        </div>

                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                <strong>Доставка брикетів</strong> та <strong>доставка вугілля</strong> виконується акуратно у заводському упакуванні: мішках або на піддонах (палетах). Це забезпечує чистоту на вашому подвір'ї та максимальну зручність при подальшому зберіганні матеріалу.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Наш транспорт обладнаний зручними бортами для швидкого і легкого вивантаження. Наші водії завжди на зв’язку, готові під’їхати у зручний для вас час та надати якісний сервіс без затримок.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── POPULAR SEARCHES ─────────────────────────────────────────────
function PopularQueriesSection() {
    const { ref, visible } = useReveal();

    const queries = [
        { name: 'доставка дров київ', url: '/dostavka' },
        { name: 'доставка брикетів', url: '/catalog/brikety' },
        { name: 'доставка вугілля', url: '/catalog/vugillya' },
        { name: 'купити дрова доставка', url: '/catalog/drova' }
    ];

    return (
        <section ref={ref} style={{ padding: 'clamp(30px, 6vw, 60px) 0' }}>
            <div className="layout-container">
                <div className="mobile-query-block" style={{ borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)', background: 'rgba(20,25,30,0.3)' }}>
                    <div className={`reveal ${visible ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '1.5rem', fontWeight: '600' }}>
                            Популярні запити:
                        </h3>
                        <div className="queries-scroll-container delivery-queries-mobile">
                            {queries.map((q, idx) => (
                                <Link
                                    key={idx}
                                    to={q.url}
                                    className="query-bubble"
                                >
                                    <Truck size={14} style={{ opacity: 0.5 }} />
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
                    .delivery-queries-mobile {
                        flex-direction: column !important;
                        width: 100% !important;
                    }
                    .delivery-queries-mobile .query-bubble {
                        width: 100% !important;
                        justify-content: center !important;
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

// ─── DISTRICTS SECTION ──────────────────────────────────────────────
function DistrictsSection() {
    const { ref, visible } = useReveal();
    const districts = [
        "Дарницький район", "Дніпровський район", "Деснянський район",
        "Оболонський район", "Печерський район", "Подільський район",
        "Святошинський район", "Солом'янський район", "Шевченківський район",
        "Голосіївський район"
    ];

    return (
        <section ref={ref} style={{ padding: 'clamp(40px, 8vw, 80px) 0', background: 'rgba(255,255,255,0.015)' }}>
            <div className="layout-container">
                <div className={`nh-card reveal ${visible ? "visible" : ""}`} style={{ padding: 'clamp(1.5rem, 5vw, 3.5rem)', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        Райони Києва, куди ми доставляємо паливо
                    </h2>
                    <p style={{ color: 'var(--c-text2)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--c-text)' }}>Доставка дров Київ, доставка брикетів Київ </strong> та <strong style={{ color: 'var(--c-text)' }}>доставка вугілля Київ</strong> здійснюється по всіх районах. Наш транспорт працює щодня, тому ми можемо доставити замовлення максимально швидко.
                    </p>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'
                    }}>
                        {districts.map((d, i) => (
                            <div key={i} style={{
                                padding: '1rem', background: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--color-border-subtle)', borderRadius: '12px',
                                textAlign: 'center', fontSize: '1rem', color: 'var(--c-text)',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--c-orange)';
                                    e.currentTarget.style.background = 'rgba(249,115,22,0.03)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                }}
                            >
                                {d}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── EXTENDED SEO SECTIONS ─────────────────────────────────────────
function DeliveryExtendedSeo({ transportData }) {
    const seoLinkStyle = {
        color: 'inherit', textDecoration: 'underline',
        textDecorationColor: 'var(--color-border-medium)',
        textUnderlineOffset: '4px', transition: 'all 0.2s'
    };
    const onEnter = (e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; };
    const onLeave = (e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; };

    const thStyle = {
        padding: '1rem 1.25rem', textAlign: 'left',
        fontWeight: 700, fontSize: '0.85rem',
        color: 'var(--c-text2)', textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '2px solid var(--c-orange)',
        background: 'rgba(249,115,22,0.04)',
    };
    const tdBase = {
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--color-border-subtle)',
    };
    const sectionPad = { padding: 'clamp(40px, 8vw, 80px) 0 0' };
    const cardPad = { padding: 'clamp(1.5rem, 5vw, 3.5rem)', borderRadius: '24px' };

    return (
        <>
            {/* ── SECTION: Яке паливо ми доставляємо ──────────────── */}
            <section style={sectionPad}>
                <div className="layout-container">
                    <div className="nh-card" style={cardPad}>
                        <h2 className="h2" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            Яке паливо ми доставляємо
                        </h2>
                        <p style={{ color: 'var(--c-text2)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                            Ми здійснюємо доставку <Link to="/catalog/drova" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>дров</Link>, <Link to="/catalog/brikety" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>брикетів</Link> та <Link to="/catalog/vugillya" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>вугілля</Link> по Києву та Київській області власним транспортом.
                        </p>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'
                        }}>
                            {[
                                { title: 'Дрова колоті', link: '/catalog/drova' },
                                { title: 'Паливні брикети', link: '/catalog/brikety' },
                                { title: 'Кам\'яне вугілля', link: '/catalog/vugillya' }
                            ].map((item, i) => (
                                <Link key={i} to={item.link} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        padding: '1.5rem', background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--color-border-subtle)', borderRadius: '16px',
                                        textAlign: 'center', transition: 'all 0.3s ease', height: '100%',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center'
                                    }}
                                        className="hover-glow"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--c-orange)';
                                            e.currentTarget.style.background = 'rgba(249,115,22,0.03)';
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-text)' }}>
                                            {item.title}
                                        </h3>
                                        <span style={{ color: 'var(--c-orange)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                            Перейти до каталогу <ChevronRight size={16} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION: Транспорт для доставки ─────────────────── */}
            <section style={sectionPad}>
                <div className="layout-container">
                    <div className="nh-card delivery-transport-card" style={cardPad}>
                        <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
                            Транспорт для доставки
                        </h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="delivery-transport-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '1rem', color: 'var(--c-text)', minWidth: '600px' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Тип машини</th>
                                        <th style={thStyle}>Обсяг</th>
                                        <th style={thStyle}>Ціна доставки</th>
                                        <th style={thStyle}>Особливості</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(transportData || []).map((row, idx) => (
                                        <tr key={idx} className="delivery-tr" style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                                            <td data-label="Тип машини" style={{ ...tdBase, fontWeight: 700, color: 'var(--c-orange)' }}>{row.type}</td>
                                            <td data-label="Обсяг" style={{ ...tdBase, color: 'var(--c-text2)' }}>{row.vol}</td>
                                            <td data-label="Ціна доставки" style={{ ...tdBase, fontWeight: 700, color: 'var(--c-text)' }}>{row.price}</td>
                                            <td data-label="Особливості" style={{ ...tdBase, color: 'var(--c-text2)' }}>{row.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <style>{`
                                @media (max-width: 640px) {
                                    .delivery-transport-card {
                                        padding: 1.5rem !important;
                                    }
                                    .delivery-transport-table {
                                        min-width: unset !important;
                                        display: block;
                                        width: 100%;
                                    }
                                    .delivery-transport-table thead,
                                    .delivery-transport-table tbody,
                                    .delivery-transport-table th,
                                    .delivery-transport-table form {
                                        display: block;
                                        width: 100%;
                                    }
                                    .delivery-transport-table tr {
                                        display: flex;
                                        flex-direction: column;
                                        width: 100%;
                                        border-bottom: 1px solid rgba(255,255,255,0.1);
                                    }
                                    .delivery-transport-table thead tr {
                                        display: none; /* Hide header row */
                                    }
                                    .delivery-transport-table .delivery-tr {
                                        padding: 1rem 0;
                                    }
                                    .delivery-transport-table td {
                                        display: flex;
                                        padding: 0.6rem 0.5rem !important;
                                        align-items: center;
                                        justify-content: space-between;
                                        text-align: right;
                                        border: none !important;
                                    }
                                    .delivery-transport-table td::before {
                                        content: attr(data-label);
                                        font-weight: 500;
                                        color: rgba(255,255,255,0.5);
                                        text-align: left;
                                        padding-right: 15px;
                                        font-size: 0.85rem;
                                        text-transform: uppercase;
                                        letter-spacing: 0.05em;
                                    }
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: Доставка дров ───────────────────────── */}
            <section style={sectionPad}>
                <div className="layout-container">
                    <div style={{ marginBottom: '1rem' }}>
                        <h2 className="h2" style={{ marginBottom: '1rem' }}>
                            Доставка дров по Києву
                        </h2>
                        <p style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '2rem', maxWidth: 700 }}>
                            Доставка <Link to="/catalog/drova" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>дров</Link> здійснюється власним транспортом. Ви можете замовити доставку дров складометром у будь-який район Києва та Київської області.
                        </p>
                    </div>

                    {/* Interactive vehicle cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                        gap: '1.5rem',
                    }}>
                        {(transportData || []).filter(v => v.category === 'standard' && v.image).map((card, i) => (
                            <figure
                                key={i}
                                className="nh-card hover-glow delivery-vehicle-card"
                                style={{
                                    margin: 0, padding: 0, borderRadius: '20px',
                                    overflow: 'hidden', cursor: 'default',
                                    transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease',
                                    border: '1px solid var(--color-border-subtle)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Image */}
                                <div className="delivery-vehicle-img-wrapper" style={{
                                    position: 'relative', overflow: 'hidden',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(20,25,30,0) 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <img
                                        src={card.image}
                                        alt={`${card.type} доставка дров Київ`}
                                        width={800}
                                        height={600}
                                        loading="lazy"
                                        style={{
                                            width: '90%', height: '90%',
                                            objectFit: 'contain',
                                            transition: 'transform 0.4s ease',
                                        }}
                                    />
                                </div>

                                {/* Info */}
                                <figcaption style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                                    <h3 style={{
                                        fontSize: '1.25rem', fontWeight: 800,
                                        color: 'var(--c-text)', margin: '0 0 0.75rem',
                                    }}>{card.type}</h3>

                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--c-text2)',
                                    }}>
                                        <Package size={16} style={{ color: 'var(--c-orange)', flexShrink: 0 }} />
                                        <span>{card.vol}</span>
                                    </div>

                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        marginBottom: '0.5rem', fontSize: '0.9rem', color: '#22c55e',
                                    }}>
                                        <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                                        <span>Швидка доставка по Києву</span>
                                    </div>

                                    <div style={{
                                        display: 'flex', alignItems: 'baseline', gap: '0.25rem',
                                        paddingTop: '0.75rem',
                                        borderTop: '1px dashed rgba(255,255,255,0.08)',
                                    }}>
                                        <span style={{
                                            fontSize: '1.5rem', fontWeight: 800,
                                            color: 'var(--c-orange)',
                                        }}>{card.price}</span>
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>

                    {/* Hidden SEO table — crawlers see structured data */}
                    <table style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                        <thead><tr><th>Тип машини</th><th>Обсяг</th><th>Ціна доставки</th></tr></thead>
                        <tbody>
                            {(transportData || []).filter(v => ['standard', 'table_only'].includes(v.category)).map((v, i) => (
                                <tr key={i}><td>{v.type}</td><td>{v.vol}</td><td>{v.price}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <style>{`
                        .delivery-vehicle-img-wrapper {
                            aspect-ratio: 16/9;
                            padding: 1rem;
                        }
                        @media (max-width: 640px) {
                            .delivery-vehicle-card {
                                padding: 0 !important;
                            }
                        }
                        @media (max-width: 479px) {
                            .delivery-vehicle-img-wrapper {
                                aspect-ratio: 16/9;
                                padding: 0.5rem !important;
                            }
                            .delivery-vehicle-img-wrapper img {
                                width: 105% !important;
                                height: 105% !important;
                                transform: scale(1.05);
                            }
                        }
                    `}</style>
                </div>
            </section>

            {/* ── SECTION 3: Доставка брикетів ───────────────────── */}
            <section style={sectionPad}>
                <div className="layout-container">
                    <div className="nh-card" style={cardPad}>
                        <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
                            Доставка паливних брикетів
                        </h2>
                        <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Вартість доставки <Link to="/catalog/brikety" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>брикетів</Link> по Києву:
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '1.5rem', borderRadius: '16px',
                                    background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-orange)', display: 'block', marginBottom: '0.25rem' }}>700 грн</span>
                                    <span style={{ color: 'var(--c-text2)', fontSize: '0.95rem' }}>за тонну по Києву</span>
                                </div>
                                <div style={{
                                    padding: '1.5rem', borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-text)', display: 'block', marginBottom: '0.25rem' }}>+20 грн</span>
                                    <span style={{ color: 'var(--c-text2)', fontSize: '0.95rem' }}>за кожен кілометр за межі Києва</span>
                                </div>
                            </div>
                            <p style={{ margin: 0 }}>
                                Доставка брикетів здійснюється вантажним транспортом з можливістю розвантаження гідробортом або маніпулятором.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: Доставка вугілля ───────────────────── */}
            <section style={sectionPad}>
                <div className="layout-container">
                    <div className="nh-card" style={cardPad}>
                        <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
                            Доставка кам&#39;яного вугілля
                        </h2>
                        <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Вартість доставки <Link to="/catalog/vugillya" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>вугілля</Link> залежить від обсягу замовлення та відстані доставки. Ціну уточнюйте у менеджера.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>Для доставки вугілля по Києву та області використовуються автомобілі:</p>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {['ЗІЛ', 'КАМАЗ', 'Маніпулятор'].map((v, i) => (
                                    <li key={i} style={{
                                        padding: '0.75rem 1.25rem', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                                        display: 'flex', alignItems: 'center', fontSize: '1.05rem', color: 'var(--c-text)',
                                    }}>
                                        <span style={{ color: 'var(--c-orange)', marginRight: '10px', fontWeight: 700 }}>•</span> {v}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: Спецтехніка ─────────────────────────── */}
            <section style={sectionPad}>
                <div className="layout-container">
                    <div className="nh-card" style={cardPad}>
                        <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
                            Спецтехніка для розвантаження
                        </h2>
                        <p style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                            Для зручного розвантаження палива у складних умовах ми пропонуємо спеціалізовану техніку:
                        </p>
                        {/* Interactive vehicle cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                            gap: '1.5rem',
                        }}>
                            {(transportData || []).filter(v => v.category === 'special' && v.image).map((card, i) => (
                                <figure
                                    key={i}
                                    className="nh-card hover-glow delivery-vehicle-card"
                                    style={{
                                        margin: 0, padding: 0, borderRadius: '20px',
                                        overflow: 'hidden', cursor: 'default',
                                        transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease',
                                        border: '1px solid var(--color-border-subtle)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* Image */}
                                    <div className="delivery-vehicle-img-wrapper" style={{
                                        position: 'relative', overflow: 'hidden',
                                        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(20,25,30,0) 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <img
                                            src={card.image}
                                            alt={`${card.type} доставка дров Київ`}
                                            width={800}
                                            height={600}
                                            loading="lazy"
                                            style={{
                                                width: '90%', height: '90%',
                                                objectFit: 'contain',
                                                transition: 'transform 0.4s ease',
                                            }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <figcaption style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                                        <h3 style={{
                                            fontSize: '1.25rem', fontWeight: 800,
                                            color: 'var(--c-text)', margin: '0 0 0.75rem',
                                        }}>{card.type}</h3>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--c-text2)',
                                        }}>
                                            <Package size={16} style={{ color: 'var(--c-orange)', flexShrink: 0 }} />
                                            <span>{card.vol}</span>
                                        </div>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            marginBottom: '0.5rem', fontSize: '0.9rem', color: '#22c55e',
                                        }}>
                                            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                                            <span>Швидка доставка по Києву</span>
                                        </div>

                                        <div style={{
                                            display: 'flex', alignItems: 'baseline', gap: '0.25rem',
                                            paddingTop: '0.75rem',
                                            borderTop: '1px dashed rgba(255,255,255,0.08)',
                                        }}>
                                            <span style={{
                                                fontSize: '1.5rem', fontWeight: 800,
                                                color: 'var(--c-orange)',
                                            }}>{card.price}</span>
                                        </div>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>

                        {/* Hidden SEO table — crawlers see structured data */}
                        <table style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                            <thead><tr><th>Послуга</th><th>Ціна</th></tr></thead>
                            <tbody>
                                <tr><td>Кран-маніпулятор</td><td>від 4 500 грн</td></tr>
                                <tr><td>Гідроборт / рокла</td><td>від 4 500 грн</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: Оптові поставки ─────────────────────── */}
            <section style={sectionPad}>
                <div className="layout-container">
                    <div className="nh-card" style={{
                        ...cardPad,
                        background: 'linear-gradient(145deg, rgba(249,115,22,0.04) 0%, rgba(20,25,30,0.9) 100%)',
                        border: '1px solid rgba(249,115,22,0.12)',
                    }}>
                        <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
                            Оптові поставки палива
                        </h2>
                        <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                            <p style={{ marginBottom: '1.25rem' }}>
                                Ми здійснюємо оптові поставки <Link to="/catalog/drova" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>дров</Link>, <Link to="/catalog/brikety" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>брикетів</Link> та <Link to="/catalog/vugillya" style={seoLinkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>вугілля</Link> повними фурами безпосередньо з виробництва. Доставка дров фурою по Києву та області — вигідний варіант для великих обсягів.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                                <div style={{
                                    padding: '1.5rem', borderRadius: '16px',
                                    background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Обсяг фури</span>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--c-orange)' }}>22–24</span>
                                    <span style={{ display: 'block', color: 'var(--c-text2)', fontSize: '0.9rem' }}>складометри дров</span>
                                </div>
                                <div style={{
                                    padding: '1.5rem', borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Ціна</span>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--c-text)' }}>Індивідуально</span>
                                    <span style={{ display: 'block', color: 'var(--c-text2)', fontSize: '0.9rem' }}>розраховується за запитом</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}



// ─── FINAL CTA BANNER ──────────────────────────────────────────
function FinalCtaBanner({ onOrderClick }) {
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
                            Замовте доставку палива <span style={{ color: 'var(--c-orange)' }}>вже сьогодні</span>
                        </h2>
                        <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
                            Готові обігріти вашу оселю. Чесний об'єм та гарантія якості від виробника.
                        </p>

                        <div className="category-bottom-cta-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={onOrderClick} className="nh-btn-primary category-bottom-btn" style={{ padding: '16px 32px', fontSize: '1rem' }}>
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

export default function Delivery() {
    const [orderFormPayload, setOrderFormPayload] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [transportData, setTransportData] = useState([]);

    React.useEffect(() => {
        api.get('/api/faqs?page=delivery')
            .then(res => setFaqs(res.data || []))
            .catch(() => { });

        api.get('/api/site-settings/delivery')
            .then(res => setTransportData(res.data?.delivery_transport || []))
            .catch(() => { });
    }, []);

    const { pageData } = usePageSEO('/dostavka');
    const title = pageData?.meta_title || "Доставка дров по Києву — брикети та вугілля | КиївДрова";
    const description = pageData?.meta_description || "Швидка доставка твердого палива (дров, брикетів, вугілля) по Києву та Київській області власним транспортом. Замовляйте сьогодні!";

    let combinedSchema = [
        {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "КиївДрова",
            "url": "https://kievdrova.com.ua",
            "telephone": "+380991234567",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "вул. Колекторна, 19",
                "addressLocality": "Київ",
                "addressCountry": "UA"
            },
            "areaServed": {
                "@type": "AdministrativeArea",
                "name": "Київська область"
            },
            "makesOffer": {
                "@type": "Service",
                "name": "Доставка дров, брикетів та вугілля"
            }
        }
    ];

    if (faqs.length > 0) {
        combinedSchema.push({
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
        <div className="new-home-scope" style={{
            minHeight: '100vh',
            background: 'var(--c-bg)',
            color: 'var(--c-text)',
            fontFamily: 'var(--font-outfit)',
            paddingTop: '64px',
        }}>
            <SEOHead
                title={title}
                description={description}
                canonical={`${shopConfig.domain}/dostavka`}
                schema={combinedSchema}
            />

            <HeroDelivery onOrderClick={() => setOrderFormPayload(true)} />

            <DeliverySection />

            <FuelCalculatorSection onQuickOrderClick={(payload) => setOrderFormPayload(payload || true)} />

            <BenefitsSection />

            <DeliverySeoBlock />

            <PopularQueriesSection />

            <FaqSection pageId="delivery" />

            <DistrictsSection />

            <DeliveryExtendedSeo transportData={transportData} />

            {/* Final SEO Text block */}
            <section style={{ padding: 'clamp(40px, 8vw, 80px) 0 0', color: 'var(--c-text2)', lineHeight: 1.8 }}>
                <div className="layout-container">
                    <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '0.95rem' }}>
                        <p style={{ marginBottom: '1rem' }}>
                            Ми здійснюємо <strong>доставку твердого палива по Києву</strong> власним транспортом.
                            У нас можна замовити <Link to="/catalog/drova" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>дрова колоті</Link>, <Link to="/catalog/brikety" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>паливні брикети</Link> та <Link to="/catalog/vugillya" style={{ color: 'var(--c-orange)', textDecoration: 'none' }}>кам'яне вугілля</Link> з швидкою доставкою
                            по всіх районах Києва та області.
                        </p>
                        <p>
                            Наша компанія працює з 2013 року та забезпечує
                            чесний обʼєм палива, швидке завантаження та
                            оперативну доставку дров, брикетів і вугілля
                            для приватних будинків, котелень та підприємств. Якщо вам потрібно <strong>купити дрова з доставкою</strong> або замовити <strong>доставку палива Київ</strong>, обирайте перевіреного постачальника КиївДрова.
                        </p>
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ marginBottom: '1rem' }}>Ми доставляємо колоті дрова різних порід:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>дуб</li>
                                <li>граб</li>
                                <li>ясен</li>
                                <li>береза</li>
                            </ul>
                            <p style={{ marginBottom: '1rem' }}>
                                Замовити дрова з доставкою по Києву можна у будь-який район міста.<br />
                                Власний автопарк дозволяє виконувати швидку доставку дров, паливних брикетів та вугілля по всьому Києву та Київській області.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <FinalCtaBanner onOrderClick={() => setOrderFormPayload(true)} />

            <OrderFormModal
                isOpen={!!orderFormPayload}
                onClose={() => setOrderFormPayload(null)}
                defaultRef={typeof orderFormPayload === 'object' ? orderFormPayload : null}
            />
        </div>
    );
}
