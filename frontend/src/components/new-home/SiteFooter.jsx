import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Flame } from "lucide-react";
import { PrivacyModal } from "./PrivacyModal";
import shopConfig from '../../shop.config';

const catalog = [
    { label: "Дрова", to: "/catalog/firewood" },
    { label: "Паливні брикети", to: "/catalog/briquettes" },
    { label: "Вугілля", to: "/catalog/coal" },
    { label: "Доставка", to: "/dostavka" },
    { label: "Контакти", to: "#contact" },
];

export function SiteFooter() {
    const [showPrivacy, setShowPrivacy] = useState(false);

    return (
        <>
            <footer style={{ background: "var(--color-bg-deep)", borderTop: "1px solid var(--color-border-subtle)" }}>
                <div
                    style={{
                        maxWidth: 1200, margin: "0 auto",
                        padding: "4rem 1.5rem 3rem",
                        display: "grid",
                        gridTemplateColumns: "1.8fr 1fr 1.4fr 1fr",
                        gap: "3rem",
                    }}
                    className="footer-grid"
                >
                    {/* Brand / About */}
                    <div>
                        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
                            <span style={{
                                width: 38, height: 38, borderRadius: "50%",
                                background: "var(--gradient-accent)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 0 14px var(--color-accent-glow)", flexShrink: 0,
                            }}>
                                <Flame size={18} color="#fff" strokeWidth={2.2} />
                            </span>
                            <span style={{ lineHeight: 1 }}>
                                <span style={{ display: "block", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em" }}>
                                    <span style={{ color: "#ffffff" }}>Київ</span><span style={{ color: "#F97316" }}>Брикет</span>
                                </span>
                                <span style={{ display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", marginTop: 1 }}>
                                    ТОВ «Київ Брикет»
                                </span>
                            </span>
                        </a>
                        <p style={{ fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.7, maxWidth: 280, marginBottom: 12 }}>
                            ТОВ «Київ Брикет» — постачальник твердого палива з доставкою по Києву та Київській області. Дрова, брикети, вугілля з 2013 року.
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "rgba(249,115,22,0.75)", fontWeight: 600, marginBottom: 20, letterSpacing: "0.01em" }}>
                            Працюємо з фізичними та юридичними особами
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            {[
                                { Icon: Instagram, href: shopConfig.contact.instagram || "#", label: "Instagram" },
                                { Icon: Facebook, href: shopConfig.contact.facebook || "#", label: "Facebook" },
                            ].map(({ Icon, href, label }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    aria-label={`Перейти на сторінку в ${label}`}
                                    style={{
                                        width: 38, height: 38, borderRadius: 9,
                                        background: "var(--c-surface)",
                                        border: "1px solid var(--c-border)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--c-text2)", transition: "border-color 0.2s, color 0.2s",
                                        textDecoration: "none",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; e.currentTarget.style.color = "var(--c-orange)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-border)"; e.currentTarget.style.color = "var(--c-text2)"; }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Каталог */}
                    <div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            Каталог
                        </p>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0, margin: 0 }}>
                            {catalog.map((c) => (
                                <li key={c.to + c.label}>
                                    {c.to.startsWith('#') ? (
                                        <a
                                            href={c.to}
                                            style={{ fontSize: "0.875rem", color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-text)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-text2)")}
                                        >
                                            {c.label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={c.to}
                                            style={{ fontSize: "0.875rem", color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-text)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-text2)")}
                                        >
                                            {c.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Контакти */}
                    <div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            Контакти
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {[
                                { Icon: Phone, text: shopConfig.contact.phone, href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`, label: "Відділ продажу" },
                                { Icon: Phone, text: "+38 099 665 74 77", href: "tel:+380996657477", label: "Відділ продажу" },
                                { Icon: MapPin, text: "вул. Колекторна, 19, Київ", href: "https://maps.google.com/?q=вул.+Колекторна+19+Київ", label: "Адреса" },
                                { Icon: Mail, text: "info@kievbriket.com", href: "mailto:info@kievbriket.com", label: "Email" },
                            ].map(({ Icon, text, href, label }) => (
                                <a
                                    key={text}
                                    href={href}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    style={{ display: "flex", alignItems: "flex-start", gap: 10, textDecoration: "none", color: "var(--c-text2)", fontSize: "0.875rem", lineHeight: 1.5, transition: "color 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-text)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-text2)")}
                                >
                                    <Icon size={14} color="var(--c-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <span style={{ display: "block", fontSize: "0.72rem", color: "var(--c-text3)", marginBottom: 1 }}>{label}</span>
                                        {text}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Графік роботи */}
                    <div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            Графік роботи
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[
                                { day: "Пн – Пт", time: "09:00 – 20:00" },
                                { day: "Сб – Нд", time: "09:00 – 20:00" },
                            ].map((h) => (
                                <div key={h.day} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--c-text2)", width: 55 }}>{h.day}</span>
                                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text)" }}>{h.time}</span>
                                </div>
                            ))}
                            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 6, marginTop: 4 }}>
                                <Clock size={12} color="var(--c-orange)" />
                                <span style={{ fontSize: "0.75rem", color: "var(--c-orange)", fontWeight: 600 }}>Зараз відкрито</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{
                        maxWidth: 1200, margin: "0 auto",
                        padding: "1.25rem 1.5rem",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexWrap: "wrap", gap: 10,
                    }}>
                        <p style={{ fontSize: "0.8rem", color: "var(--c-text3)" }}>
                            © 2013–{new Date().getFullYear()} ТОВ «Київ Брикет». Всі права захищені.
                        </p>
                        <div style={{ display: "flex", gap: 20 }}>
                            <button
                                onClick={() => setShowPrivacy(true)}
                                style={{
                                    background: "none", border: "none", padding: 0, cursor: "pointer",
                                    fontSize: "0.8rem", color: "var(--c-text3)", transition: "color 0.2s", fontFamily: "inherit",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-text2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-text3)")}
                            >
                                Політика конфіденційності
                            </button>
                            <a
                                href="#"
                                style={{ fontSize: "0.8rem", color: "var(--c-text3)", textDecoration: "none", transition: "color 0.2s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-text2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-text3)")}
                            >
                                Умови використання
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

            <style>{`
                /* Desktop: 4 columns, evenly spread */
                @media (max-width: 900px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 2rem !important;
                        padding: 2.5rem 1.25rem 2rem !important;
                    }
                }
                /* Mobile: 2 columns, compact */
                @media (max-width: 540px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 1.2rem 1rem !important;
                        padding: 1.5rem 1rem 1.25rem !important;
                    }
                }
            `}</style>
        </>
    );
}
