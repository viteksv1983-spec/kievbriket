import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import shopConfig from '../shop.config';
import { ArrowRight, ChevronRight, Phone, CheckCircle2, ShieldCheck, MapPin, Truck, Flame, Box, Package, Clock, Loader2 } from 'lucide-react';
import SEOHead from './SEOHead';
import { usePageSEO } from '../hooks/usePageSEO';
import { OrderFormModal } from './new-home/OrderFormModal';
import { usePhoneInput } from '../hooks/usePhoneInput';
import api from '../api';

// ─── HERO CONTACTS ────────────────────────────────────────────────
function HeroContacts({ onOrderClick }) {
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
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Контакти</span>
                </nav>

                <div className="hero-text fade-up" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)', padding: '2.5rem 3rem 2rem 3rem', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: 'clamp(2.5rem, 6vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', color: '#fff' }}>
                        Контакти
                    </h1>
                    <p className="hero-subtitle fade-up fade-up-d2" style={{
                        fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
                        maxWidth: '700px', marginBottom: '2rem', fontWeight: 400
                    }}>
                        Замовити дрова, паливні брикети або вугілля з доставкою по Києву та області.
                    </p>

                    <div className="hero-actions fade-up fade-up-d3" style={{ display: 'flex', gap: '16px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <a
                            href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                            className="btn-glow"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'var(--c-orange)', color: '#fff', padding: '16px 32px',
                                borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                                textDecoration: 'none', transition: 'all 0.3s ease'
                            }}
                        >
                            <Phone size={20} />
                            Подзвонити
                        </a>
                        <button
                            onClick={onOrderClick}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '16px 32px',
                                borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                            Замовити доставку
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="hero-benefits fade-up fade-up-d4" style={{
                        display: 'flex', gap: 'clamp(0.35rem, 1.5vw, 2rem)', flexWrap: 'wrap', justifyContent: 'flex-start',
                        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'clamp(12px, 3vw, 16px)', width: '100%',
                        fontSize: 'clamp(0.7rem, 2.8vw, 0.9rem)', color: 'rgba(255,255,255,0.7)'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ color: '#22C55E' }}>✔</span> швидка доставка
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

// ─── CONTACT INFORMATION & QUICK ORDER FORM ───────────────────────
function ContactSectionCombined() {
    const { ref, visible } = useReveal();
    const [form, setForm] = useState({ name: "" });
    const { phoneProps, rawPhone, resetPhone } = usePhoneInput();
    const [status, setStatus] = useState("idle");

    const cards = [
        {
            title: 'Телефон',
            desc: shopConfig.contact.phone,
            icon: <Phone size={24} color="var(--c-orange)" />,
            action: <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--c-orange)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem', marginTop: 'auto' }}>Подзвонити →</a>
        },
        {
            title: 'Графік роботи',
            desc: 'Щодня\n09:00 – 20:00',
            icon: <Clock size={24} color="var(--c-orange)" />,
            action: <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.9rem', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: '10px' }}>●</span> Завжди на зв'язку</span>
        },
        {
            title: 'Локація',
            desc: 'м. Київ\nвул. Колекторна, 19',
            icon: <MapPin size={24} color="var(--c-orange)" />,
            action: null
        }
    ];

    const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await api.post("/orders/quick", {
                customer_name: form.name,
                customer_phone: rawPhone,
            });
            setStatus("success");
        } catch (err) {
            console.error("Contact form error:", err);
            setStatus("success");
        }
    };

    return (
        <section ref={ref} style={{ padding: '60px 0 40px' }}>
            <div className="layout-container">
                <style>{`
                    .contact-split-grid {
                        display: grid;
                        grid-template-columns: 1fr 1.1fr;
                        gap: 2rem;
                        align-items: stretch;
                    }
                    .contact-cards-inner {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    @media (max-width: 900px) {
                        .contact-split-grid { grid-template-columns: 1fr; }
                        .contact-cards-inner { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
                    }
                `}</style>

                <div className={`reveal ${visible ? 'visible' : ''} contact-split-grid`}>

                    {/* Left: Contact Info Cards */}
                    <div className="contact-cards-inner">
                        {cards.map((c, i) => (
                            <div key={i} className="nh-card hover-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249,115,22,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(249,115,22,0.2)', flexShrink: 0
                                    }}>
                                        {c.icon}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-text2)', marginBottom: '0.2rem' }}>{c.title}</h3>
                                        <p style={{ color: 'var(--c-text)', fontWeight: 700, margin: 0, fontSize: '1.15rem', whiteSpace: 'pre-line' }}>{c.desc}</p>
                                    </div>
                                </div>
                                {c.action}
                            </div>
                        ))}
                    </div>

                    {/* Right: Quick Order Form */}
                    <div className="nh-card" style={{
                        padding: '3rem 2.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(20,25,30,0.8) 100%)',
                        border: '1px solid rgba(255,255,255,0.08)', height: '100%'
                    }}>
                        {status === "success" ? (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ width: 60, height: 60, background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                    <CheckCircle2 size={26} color="var(--color-success)" />
                                </div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10 }}>Заявку прийнято!</h3>
                                <p style={{ fontSize: "1rem", color: "var(--c-text2)", marginBottom: 24 }}>Ми вже отримали ваш контакт і передзвонимо вам найближчим часом.</p>
                                <button
                                    onClick={() => { setStatus("idle"); setForm({ name: "" }); resetPhone(); }}
                                    style={{ background: "none", border: "none", color: "var(--c-orange)", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}
                                >
                                    Нова заявка →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: '1.25rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <h2 className="h2" style={{ fontSize: "1.75rem", marginBottom: 8 }}>Швидке замовлення</h2>
                                    <p style={{ color: "var(--c-text2)" }}>Залиште свій номер і ми передзвонимо за 15 хвилин.</p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text2)" }}>Ім'я</label>
                                    <input
                                        type="text"
                                        placeholder="Ваше ім'я"
                                        value={form.name}
                                        onChange={setField("name")}
                                        required
                                        style={{
                                            background: "var(--c-surface2)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", color: "var(--c-text)", fontSize: "1rem", outline: "none", transition: "border-color 0.2s", fontFamily: "inherit",
                                        }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)")}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text2)" }}>Телефон</label>
                                    <input
                                        {...phoneProps}
                                        required
                                        style={{
                                            background: "var(--c-surface2)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", color: "var(--c-text)", fontSize: "1rem", outline: "none", transition: "border-color 0.2s", fontFamily: "inherit",
                                        }}
                                        onFocus={(e) => { phoneProps.onFocus(e); e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"; }}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="nh-btn-primary"
                                    disabled={status === "loading"}
                                    style={{ justifyContent: "center", marginTop: 12, width: "100%", padding: "18px 24px", fontSize: '1rem' }}
                                >
                                    {status === "loading" ? <><Loader2 size={18} className="animate-spin" /> Обробка...</> : "Замовити дзвінок"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── MAP (SVG) ────────────────────────────────────────────────────
const OBLAST_PATH =
    "M 78,44 L 108,18 L 152,6 L 200,10 L 250,6 L 300,22 L 348,52 " +
    "L 376,94 L 380,140 L 365,182 L 334,220 L 292,248 L 248,260 " +
    "L 200,262 L 152,260 L 108,248 L 68,220 L 38,180 L 22,138 " +
    "L 26,92 Z";

const SAT_PINS = [
    { label: "Бровари", cx: 272, cy: 100, beginAnim: "0s" },
    { label: "Ірпінь", cx: 104, cy: 116, beginAnim: "1.1s" },
    { label: "Бориспіль", cx: 298, cy: 192, beginAnim: "0.5s" },
    { label: "Вишневе", cx: 118, cy: 196, beginAnim: "1.7s" },
];

function ContactMap() {
    const { ref, visible } = useReveal();

    return (
        <section ref={ref} style={{ padding: 'clamp(30px, 6vw, 60px) 0' }}>
            <div className="layout-container">
                <div className={`nh-card reveal ${visible ? 'visible' : ''}`} style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>

                    <div style={{
                        width: '100%', height: '450px', background: '#080f0a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block", opacity: 0.6 }}>
                                <defs>
                                    <filter id="kb-pin-glow" x="-80%" y="-80%" width="260%" height="260%">
                                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <radialGradient id="kb-glow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                                    </radialGradient>
                                </defs>

                                {/* Grid */}
                                {[50, 100, 150, 200, 250].map((y) => (
                                    <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                                ))}
                                {[57, 114, 171, 228, 285, 342].map((x) => (
                                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                                ))}

                                {/* Oblast Background */}
                                <path d={OBLAST_PATH} fill="rgba(249,115,22,0.04)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" strokeDasharray="5 4" strokeLinejoin="round" />

                                {/* Suburbs */}
                                <ellipse cx="200" cy="158" rx="76" ry="60" fill="none" stroke="rgba(249,115,22,0.2)" strokeWidth="1" strokeDasharray="4 5" />

                                {/* Ripples */}
                                {[0, 0.73, 1.46].map((begin, i) => (
                                    <circle key={i} cx="200" cy="158" r="22" fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="1.5">
                                        <animate attributeName="r" from="22" to="50" dur="2.2s" repeatCount="indefinite" begin={`${begin}s`} />
                                        <animate attributeName="opacity" from="0.55" to="0" dur="2.2s" repeatCount="indefinite" begin={`${begin}s`} />
                                    </circle>
                                ))}

                                {/* Kyiv Main */}
                                <circle cx="200" cy="158" r={55} fill="url(#kb-glow)" />

                                {/* Pins */}
                                {SAT_PINS.map((pin) => (
                                    <g key={pin.label}>
                                        <circle cx={pin.cx} cy={pin.cy} r="9" fill="rgba(249,115,22,0.12)" />
                                        <circle cx={pin.cx} cy={pin.cy} r="4.5" fill="#F97316" opacity="0.6" filter="url(#kb-pin-glow)">
                                            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.5s" repeatCount="indefinite" begin={pin.beginAnim} />
                                        </circle>
                                    </g>
                                ))}

                                <g filter="url(#kb-pin-glow)">
                                    <circle cx="200" cy="158" r="11" fill="#F97316" />
                                    <circle cx="200" cy="158" r="5" fill="#fff" />
                                </g>
                            </svg>
                        </div>

                        {/* Foreground Text Box overlaying map */}
                        <div style={{ position: 'relative', zIndex: 2, padding: '3rem', width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: 'linear-gradient(to right, rgba(10,13,20,0.95) 0%, rgba(10,13,20,0.7) 40%, rgba(10,13,20,0) 100%)' }}>
                            <div style={{ maxWidth: 450 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--c-orange)', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    <MapPin size={16} /> Зона покриття
                                </div>
                                <h3 className="h3" style={{ fontSize: '2.25rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                                    Безперебійна доставка по <span style={{ color: 'var(--c-orange)' }}>всьому Києву</span> та <span style={{ color: 'var(--c-orange)' }}>області</span>
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                    Наш автопарк та оптимізована логістика дозволяють швидко та вчасно доставляти замовлення. Київ: день в день. Область: 24-48 годин.
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <Link to="/dostavka" className="nh-btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem', borderRadius: '10px', textDecoration: 'none' }}>
                                        Детальніше про доставку
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

// ─── WHAT WE DELIVER ──────────────────────────────────────────────
function WhatWeDeliver() {
    const { ref, visible } = useReveal();

    const sections = [
        { name: 'Дрова', icon: <Flame size={24} />, link: '/catalog/drova' },
        { name: 'Паливні брикети', icon: <Box size={24} />, link: '/catalog/brikety' },
        { name: 'Вугілля', icon: <Box size={24} />, link: '/catalog/vugillya' },
    ];

    return (
        <section ref={ref} style={{ padding: 'clamp(30px, 6vw, 60px) 0' }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 className="h2" style={{ fontSize: '1.75rem' }}>Що ми доставляємо</h2>
                </div>
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', transitionDelay: '0.1s' }}>
                    {sections.map((item, i) => (
                        <Link key={i} to={item.link} className="nh-card hover-glow" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--c-orange)', padding: '12px', borderRadius: '12px' }}>
                                {item.icon}
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--c-text)', flex: 1 }}>{item.name}</span>
                            <ChevronRight size={20} color="var(--c-text2)" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── SEO TEXT ─────────────────────────────────────────────────────
function ContactsSeoBlock() {
    return (
        <section style={{ padding: 'clamp(40px, 8vw, 80px) 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{ width: '100%', padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        Купити дрова, брикети та вугілля у Києві
                    </h2>

                    <div style={{ color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '3rem' }}>
                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Компанія «КиївБрикет» забезпечує безперебійне постачання твердого палива. Ми спеціалізуємось на <strong>продажу дров</strong>, а також сучасних еко-альтернатив. Ви можете <Link to="/catalog/drova" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>купити дрова київ</Link> з безкоштовним розвантаженням та чесним складометром. В наявності дуб, граб, береза та сосна.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Для власників твердопаливних котлів ми пропонуємо зручне паливо з високою тепловіддачею – <strong>продаж брикетів</strong> типів RUF, Pini Kay та Nestro. Звертайтесь, щоб замовити <Link to="/catalog/brikety" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>брикети київ</Link> і забезпечити стабільний жар у вашій оселі.
                            </p>
                        </div>
                        <div>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Також ми здійснюємо <strong>продаж вугілля</strong>. Якісне <Link to="/catalog/vugillya" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>вугілля київ</Link> (антрацит та довгополум'яне) фасується в зручні мішки по 50 кг з доставкою прямо до вашого двору. Обирайте надійного постачальника з багаторічним досвідом та власним автопарком.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Незалежно від того, яке паливо ви обрали, ми гарантуємо відсутність прихованих платежів, швидку обробку заявок та можливість оплати безпосередньо після передачі товару на вашій ділянці.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────
function FaqSection() {
    const { ref, visible } = useReveal();
    const [openIdx, setOpenIdx] = useState(0);

    const faqs = [
        { q: "Як замовити дрова?", a: "Ви можете оформити замовлення трьома способами: зателефонувати нам, заповнити форму зворотного зв'язку на цій сторінці або натиснути кнопку 'Замовити' на сторінці конкретного товару." },
        { q: "Чи можна замовити доставку сьогодні?", a: "Так, за умови оформлення заявки в першій половині дня та наявності вільних машин, доставка по Києву здійснюється 'день у день'." },
        { q: "Які способи оплати доступні?", a: "Ми приймаємо оплату готівкою при отриманні товару (після розвантаження та перевірки об'єму), а також можливий безготівковий розрахунок за потребою." },
        { q: "Чи працюєте по Київській області?", a: "Так, ми здійснюємо доставку по всьому Києву та всій Київській області (Бровари, Бориспіль, Ірпінь, Буча, Фастів тощо). Вартість доставки в область розраховується індивідуально." }
    ];

    return (
        <section ref={ref} className="faq-mobile-section" style={{ padding: 'clamp(40px, 8vw, 80px) 0' }}>
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
                            Зателефонуйте нам <span style={{ color: 'var(--c-orange)' }}>прямо зараз</span>
                        </h2>
                        <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
                            Ми готові прийняти ваше замовлення та доставити якісне паливо без передоплат.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="nh-btn-primary" style={{ padding: '16px 32px', fontSize: '1rem', textDecoration: 'none' }}>
                                <Phone size={18} style={{ marginRight: 8 }} /> Подзвонити
                            </a>
                            <button onClick={onOrderClick} className="nh-btn-ghost" style={{ padding: '16px 32px', fontSize: '1rem', border: '1px solid var(--color-border-medium)', cursor: 'pointer' }}>
                                Замовити доставку
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function Contacts() {
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    const { pageData } = usePageSEO('/contacts');
    const title = pageData?.meta_title || "Контакти КиївБрикет | Замовити дрова, брикети, вугілля";
    const description = pageData?.meta_description || "Контактна інформація КиївБрикет. Телефони, графік роботи, адреса. Замовляйте дрова, паливні брикети та вугілля з доставкою по Києву та області.";

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
                canonical={`https://kievbriket.com/kontakty`}
            />

            <HeroContacts onOrderClick={() => setIsOrderFormOpen(true)} />

            <ContactSectionCombined />

            <ContactMap />

            <WhatWeDeliver />

            <ContactsSeoBlock />

            <FaqSection />

            <FinalCtaBanner onOrderClick={() => setIsOrderFormOpen(true)} />

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
            />
        </div>
    );
}
