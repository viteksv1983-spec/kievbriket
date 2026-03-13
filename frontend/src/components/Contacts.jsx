import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import shopConfig from '../shop.config';
import { ArrowRight, ChevronRight, Phone, CheckCircle2, ShieldCheck, MapPin, Truck, Flame, Box, Package, Clock, Loader2 } from 'lucide-react';
import SEOHead from './SEOHead';
import { usePageSEO } from '../hooks/usePageSEO';
import { OrderFormModal } from './new-home/OrderFormModal';
import { usePhoneInput } from '../hooks/usePhoneInput';
import FaqSection from './FaqSection';
import { KyivMap } from './new-home/DeliverySection';
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

// ─── CONTACT INFORMATION & QUICK ORDER FORM ───────────────────────
function ContactSectionCombined() {
    const { ref, visible } = useReveal();
    const [form, setForm] = useState({ name: "" });
    const { phoneProps, rawPhone, resetPhone } = usePhoneInput();
    const [status, setStatus] = useState("idle");
    const [errors, setErrors] = useState({});

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

    const setField = (k) => (e) => {
        setForm((p) => ({ ...p, [k]: e.target.value }));
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = "Введіть ваше ім'я";
        } else if (form.name.trim().length < 2) {
            newErrors.name = "Ім'я надто коротке";
        }

        if (rawPhone.length < 9) {
            newErrors.phone = "Введіть коректний номер телефону";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
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
                    @media (max-width: 640px) {
                        .contact-card-mobile { position: relative !important; align-items: center !important; }
                        .contact-card-title { text-align: center !important; }
                        .contact-card-header-wrap { flex-direction: column !important; align-items: center !important; justify-content: center !important; margin-bottom: 0.5rem !important; }
                        .contact-icon-mobile { position: absolute !important; left: 1.5rem !important; top: 50% !important; bottom: auto !important; margin: 0 !important; transform: translateY(-50%) !important; }
                        .contact-text-mobile { display: flex !important; flex-direction: column !important; width: 100% !important; align-items: center !important; padding: 0 40px !important; }
                        .contact-card-action-wrap { display: flex; justify-content: center !important; width: 100%; }
                    }
                `}</style>

                <div className={`reveal ${visible ? 'visible' : ''} contact-split-grid`}>

                    {/* Left: Contact Info Cards */}
                    <div className="contact-cards-inner">
                        {cards.map((c, i) => (
                            <div key={i} className="nh-card hover-glow contact-card-mobile" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%', borderRadius: '16px' }}>
                                <div className="contact-card-header-wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', marginBottom: '1rem', minHeight: '48px' }}>
                                    <div className="contact-icon-mobile" style={{
                                        width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249,115,22,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(249,115,22,0.2)', flexShrink: 0
                                    }}>
                                        {c.icon}
                                    </div>
                                    <div className="contact-text-mobile" style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                                        <h3 className="contact-card-title" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-text2)', marginBottom: '0.2rem' }}>{c.title}</h3>
                                        <p className="contact-card-title" style={{ color: 'var(--c-text)', fontWeight: 700, margin: 0, fontSize: '1.15rem', whiteSpace: 'pre-line' }}>{c.desc}</p>
                                    </div>
                                </div>
                                <div className="contact-card-action-wrap" style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    {c.action}
                                </div>
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
                                            background: "var(--c-surface2)", border: errors.name ? "1px solid var(--color-danger)" : "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", color: "var(--c-text)", fontSize: "1rem", outline: "none", transition: "border-color 0.2s", fontFamily: "inherit",
                                        }}
                                        onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"; }}
                                        onBlur={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                                    />
                                    {errors.name && <span style={{ color: "var(--color-danger)", fontSize: "0.80rem", marginTop: 4 }}>{errors.name}</span>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text2)" }}>Телефон</label>
                                    <input
                                        {...phoneProps}
                                        required
                                        style={{
                                            background: "var(--c-surface2)", border: errors.phone ? "1px solid var(--color-danger)" : "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", color: "var(--c-text)", fontSize: "1rem", outline: "none", transition: "border-color 0.2s", fontFamily: "inherit",
                                        }}
                                        onFocus={(e) => { phoneProps.onFocus?.(e); if (!errors.phone) e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"; }}
                                        onBlur={(e) => { phoneProps.onBlur?.(e); if (!errors.phone) e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                                        onChange={(e) => {
                                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                                            phoneProps.onChange(e);
                                        }}
                                    />
                                    {errors.phone && <span style={{ color: "var(--color-danger)", fontSize: "0.80rem", marginTop: 4 }}>{errors.phone}</span>}
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
function ContactMap() {
    const { ref, visible } = useReveal();

    return (
        <section ref={ref} style={{ padding: 'clamp(30px, 6vw, 60px) 0' }}>
            <div className="layout-container">
                <div className={`map-split-layout reveal ${visible ? 'visible' : ''}`}>
                    {/* Text Block */}
                    <div className="nh-card map-text-block">
                        <div style={{ maxWidth: 500 }}>
                            <h3 className="h3 map-overlay-title" style={{ fontSize: '2.25rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                                Безперебійна доставка по <span style={{ color: 'var(--c-orange)' }}>всьому Києву</span> та <span style={{ color: 'var(--c-orange)' }}>області</span>
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                Наш автопарк та оптимізована логістика дозволяють швидко та вчасно доставляти замовлення. Київ: день в день. Область: 24-48 годин.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link to="/dostavka" className="nh-btn-primary map-overlay-btn" style={{ padding: '12px 24px', fontSize: '0.95rem', borderRadius: '10px', textDecoration: 'none' }}>
                                    Детальніше про доставку
                                </Link>
                            </div>
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
                    .map-overlay-btn {
                        width: 100%;
                        justify-content: center;
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
                                Компанія «КиївДрова» забезпечує безперебійне постачання твердого палива. Ми спеціалізуємось на <strong>продажу дров</strong>, а також сучасних еко-альтернатив. Ви можете <Link to="/catalog/drova" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-medium)', textUnderlineOffset: '4px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-orange)'; e.currentTarget.style.textDecorationColor = 'var(--c-orange)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.textDecorationColor = 'var(--color-border-medium)'; }}>купити дрова київ</Link> з безкоштовним розвантаженням та чесним складометром. В наявності дуб, граб, береза та сосна.
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

                        <div className="category-bottom-cta-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="nh-btn-primary category-bottom-btn" style={{ padding: '16px 32px', fontSize: '1rem', textDecoration: 'none' }}>
                                <Phone size={18} style={{ marginRight: 8 }} /> Подзвонити
                            </a>
                            <button onClick={onOrderClick} className="nh-btn-ghost category-bottom-btn" style={{ padding: '16px 32px', fontSize: '1rem', border: '1px solid var(--color-border-medium)', cursor: 'pointer' }}>
                                Замовити доставку
                            </button>
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

export default function Contacts() {
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [faqs, setFaqs] = useState([]);

    React.useEffect(() => {
        api.get('/api/faqs?page=contacts')
            .then(res => setFaqs(res.data || []))
            .catch(() => { });
    }, []);

    const { pageData } = usePageSEO('/contacts');
    const title = pageData?.meta_title || "Контакти КиївДрова | Замовити дрова, брикети, вугілля";
    const description = pageData?.meta_description || "Контактна інформація КиївДрова. Телефони, графік роботи, адреса. Замовляйте дрова, паливні брикети та вугілля з доставкою по Києву та області.";

    const schemaList = [];
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
                canonical={`https://kievdrova.com.ua/kontakty`}
                schema={schemaList}
            />

            <HeroContacts onOrderClick={() => setIsOrderFormOpen(true)} />

            <ContactSectionCombined />

            <ContactMap />

            <WhatWeDeliver />

            <ContactsSeoBlock />

            <FaqSection pageId="contacts" />

            <FinalCtaBanner onOrderClick={() => setIsOrderFormOpen(true)} />

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
            />
        </div>
    );
}
