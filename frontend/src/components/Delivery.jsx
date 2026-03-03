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
        <section ref={ref} className="hero-section" style={{ minHeight: 'auto', paddingTop: '104px', paddingBottom: '0', position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
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
                    <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', color: '#fff' }}>
                        Доставка дров, брикетів та вугілля <span style={{ color: 'var(--c-orange)' }}>у Києві</span>
                    </h1>
                    <p className="hero-subtitle fade-up fade-up-d2" style={{
                        fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
                        maxWidth: '700px', marginBottom: '2rem', fontWeight: 400
                    }}>
                        Швидка доставка твердого палива по Києву та Київській області власним транспортом.
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
                        display: 'flex', gap: '24px', flexWrap: 'wrap',
                        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', width: '100%'
                    }}>
                        {[
                            { icon: <Truck size={20} />, text: 'доставка сьогодні' },
                            { icon: <Package size={20} />, text: 'чесний складометр' },
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
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', transitionDelay: '0.1s'
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
        <section style={{ padding: '100px 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{ width: '100%', padding: '4rem', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        Доставка дров, брикетів та вугілля у Києві
                    </h2>

                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
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
        { name: 'доставка дров київ', url: '/delivery' },
        { name: 'доставка брикетів', url: '/catalog/brikety' },
        { name: 'доставка вугілля', url: '/catalog/vugillya' },
        { name: 'купити дрова доставка', url: '/catalog/drova' }
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
        { q: "Скільки коштує доставка дров?", a: "По Києву вартість доставки стартує від 300 грн. У передмістя та область розраховується індивідуально в залежності від відстані та об'єму замовлення (від 400 грн)." },
        { q: "Як швидко привозите замовлення?", a: "За умови наявності замовленого товару та вільних машин, ми доставляємо протягом дня. Для передмістя доставка можлива протягом 1-2 днів." },
        { q: "Чи можна замовити доставку сьогодні?", a: "Так! Якщо ви оформите замовлення в першій половині дня, ми зможемо організувати відвантаження у той самий день." },
        { q: "Який мінімальний об'єм замовлення?", a: "Для дров мінімальне замовлення зазвичай становить 1 складометр. Брикети та вугілля постачаються від 1 тонни або мішками (уточнюйте у менеджера)." }
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
function FinalCtaBanner({ onOrderClick }) {
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

    const { pageData } = usePageSEO('/delivery');
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
                canonical={`${shopConfig.domain}/delivery`}
                schema={serviceSchema}
            />

            <HeroDelivery onOrderClick={() => setIsOrderFormOpen(true)} />

            <DeliverySection />

            <DeliveryCost />

            <FuelCalculatorSection onQuickOrderClick={() => setIsOrderFormOpen(true)} />

            <BenefitsSection />

            <DeliverySeoBlock />

            <PopularQueriesSection />

            <FaqSection />

            <FinalCtaBanner onOrderClick={() => setIsOrderFormOpen(true)} />

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
            />
        </div>
    );
}
