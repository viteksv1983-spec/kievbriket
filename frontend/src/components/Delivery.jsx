import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import shopConfig from '../shop.config';
import { ArrowRight, ChevronRight, Phone, Truck, ShieldCheck, MapPin, CheckCircle2, Navigation, Package, Flame, Clock } from 'lucide-react';
import SEOHead from './SEOHead';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import { BenefitsSection } from './new-home/BenefitsSection';
import { OrderFormModal } from './new-home/OrderFormModal';
import { DeliverySection } from './new-home/DeliverySection';
import { usePageSEO } from '../hooks/usePageSEO';

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
                        display: 'flex', gap: 'clamp(0.35rem, 1.5vw, 2rem)', flexWrap: 'wrap', justifyContent: 'flex-start',
                        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'clamp(12px, 3vw, 16px)', width: '100%',
                        fontSize: 'clamp(0.7rem, 2.8vw, 0.9rem)', color: 'rgba(255,255,255,0.7)'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> доставка сьогодні
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> чесний складометр
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> оплата після отримання
                        </span>
                    </div>
                </div>
            </div>
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
                <div className={`nh-card reveal ${visible ? 'visible' : ''}`} style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(to right, rgba(10,13,20,0.9) 0%, rgba(10,13,20,0.4) 50%, rgba(10,13,20,0.1) 100%)',
                        zIndex: 1, pointerEvents: 'none'
                    }} />

                    {/* Minimalist Map Background Illusion */}
                    <div style={{
                        width: '100%', height: '400px', background: '#0a0d14',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                        backgroundImage: 'radial-gradient(circle at center, rgba(249,115,22,0.1) 0%, transparent 70%), repeating-linear-gradient(rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)'
                    }}>
                        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(249,115,22,0.2)', filter: 'blur(40px)', zIndex: 0 }} />
                        <MapPin size={64} color="var(--c-orange)" style={{ opacity: 0.1, zIndex: 0, position: 'absolute', right: '30%' }} />

                        <div style={{ position: 'relative', zIndex: 2, padding: '3rem', width: '100%', display: 'flex', alignItems: 'center' }}>
                            <div style={{ maxWidth: 500 }}>
                                <h3 className="h3" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Покриття доставки</h3>
                                <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', lineHeight: 1.6 }}>
                                    Ми доставляємо дрова, паливні брикети та вугілля по всьому Києву та області. Власний автопарк дозволяє гнучко підстроїтися під ваші потреби, гарантуючи вчасність та акуратність при розвантаженні.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        <section ref={ref} style={{ padding: 'clamp(30px, 6vw, 60px) 0', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)', background: 'rgba(20,25,30,0.3)' }}>
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
                                <Truck size={14} style={{ opacity: 0.5 }} />
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
        { q: "Скільки коштує доставка дров?", a: "ГАЗель (бус) — 1 000–1 500 грн (4–5 складометрів), ЗІЛ самоскид — 2 500 грн (4 складометри), КАМАЗ самоскид — 3 000 грн (8 складометрів). Доставка брикетів — 700 грн/тонна по Києву." },
        { q: "Як швидко привозите замовлення?", a: "За умови наявності замовленого товару та вільних машин, ми доставляємо протягом дня. Для передмістя доставка можлива протягом 1-2 днів." },
        { q: "Чи можна замовити доставку сьогодні?", a: "Так! Якщо ви оформите замовлення в першій половині дня, ми зможемо організувати відвантаження у той самий день." },
        { q: "Який мінімальний об'єм замовлення?", a: "Для дров мінімальне замовлення зазвичай становить 1 складометр. Брикети та вугілля постачаються від 1 тонни або мішками (уточнюйте у менеджера)." }
    ];

    return (
        <section ref={ref} style={{ padding: 'clamp(40px, 10vw, 100px) 0' }}>
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

// ─── EXTENDED SEO SECTIONS ─────────────────────────────────────────
function DeliveryExtendedSeo() {
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
                        {[
                            { src: '/images/delivery/gazel-dostavka-driv-kyiv.webp', alt: 'ГАЗель доставка дров Київ', name: 'ГАЗель (бус)', volume: '4–5 складометрів', price: '1 000 – 1 500 грн' },
                            { src: '/images/delivery/zil-dostavka-driv-kyiv.webp', alt: 'ЗІЛ доставка дров Київ', name: 'ЗІЛ самоскид', volume: '4 складометри', price: '2 500 грн' },
                            { src: '/images/delivery/kamaz-dostavka-driv-kyiv.webp', alt: 'КАМАЗ доставка дров Київ', name: 'КАМАЗ самоскид', volume: '8 складометрів', price: '3 000 грн' },
                        ].map((card, i) => (
                            <figure
                                key={i}
                                className="nh-card hover-glow"
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
                                <div style={{
                                    position: 'relative', overflow: 'hidden',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)',
                                    padding: '1.5rem 1.5rem 0.5rem',
                                }}>
                                    <img
                                        src={card.src}
                                        alt={card.alt}
                                        width={800}
                                        height={600}
                                        loading="lazy"
                                        style={{
                                            width: '100%', height: 'auto',
                                            objectFit: 'contain',
                                            borderRadius: '12px',
                                            transition: 'transform 0.4s ease',
                                        }}
                                    />
                                </div>

                                {/* Info */}
                                <figcaption style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                                    <h3 style={{
                                        fontSize: '1.25rem', fontWeight: 800,
                                        color: 'var(--c-text)', margin: '0 0 0.75rem',
                                    }}>{card.name}</h3>

                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--c-text2)',
                                    }}>
                                        <Package size={16} style={{ color: 'var(--c-orange)', flexShrink: 0 }} />
                                        <span>{card.volume}</span>
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
                            <tr><td>ГАЗель (бус)</td><td>4–5 складометрів</td><td>1 000 – 1 500 грн</td></tr>
                            <tr><td>ЗІЛ самоскид</td><td>4 складометри</td><td>2 500 грн</td></tr>
                            <tr><td>КАМАЗ самоскид</td><td>8 складометрів</td><td>3 000 грн</td></tr>
                        </tbody>
                    </table>
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
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '1rem', color: 'var(--c-text)' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Послуга</th>
                                        <th style={thStyle}>Ціна</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { service: 'Кран-маніпулятор', price: 'від 3 500 грн' },
                                        { service: 'Гідроборт / рокла', price: 'від 4 500 грн' },
                                    ].map((row, idx) => (
                                        <tr key={idx} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                                            <td style={{ ...tdBase, fontWeight: 700, color: 'var(--c-orange)', whiteSpace: 'nowrap' }}>{row.service}</td>
                                            <td style={{ ...tdBase, fontWeight: 700, color: 'var(--c-orange)' }}>{row.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={onOrderClick} className="nh-btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function Delivery() {
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    const { pageData } = usePageSEO('/dostavka');
    const title = pageData?.meta_title || "Доставка дров, брикетів та вугілля по Києву | КиївБрикет";
    const description = pageData?.meta_description || "Швидка доставка твердого палива (дров, брикетів, вугілля) по Києву та Київській області власним транспортом. Замовляйте сьогодні!";

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Доставка твердого палива",
        "provider": {
            "@type": "LocalBusiness",
            "name": shopConfig.name
        },
        "areaServed": [
            { "@type": "City", "name": "Київ" },
            { "@type": "State", "name": "Київська область" }
        ],
        "description": description
    };

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
                schema={serviceSchema}
            />

            <HeroDelivery onOrderClick={() => setIsOrderFormOpen(true)} />

            <DeliverySection />

            <FuelCalculatorSection onQuickOrderClick={() => setIsOrderFormOpen(true)} />

            <BenefitsSection />

            <DeliverySeoBlock />

            <PopularQueriesSection />

            <FaqSection />

            <DeliveryExtendedSeo />

            <FinalCtaBanner onOrderClick={() => setIsOrderFormOpen(true)} />

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
            />
        </div>
    );
}
