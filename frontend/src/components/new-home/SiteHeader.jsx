import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Flame, ChevronRight, Truck, MapPin, ShoppingCart, Clock } from "lucide-react";
import shopConfig from '../../shop.config';

const links = [
    { label: "Дрова", to: "/catalog/drova", icon: Flame },
    { label: "Брикети", to: "/catalog/brikety", icon: ShoppingCart },
    { label: "Вугілля", to: "/catalog/vugillya", icon: ShoppingCart },
    { label: "Доставка", to: "/dostavka", icon: Truck },
    { label: "Контакти", to: "/contacts", icon: MapPin },
];

const NAV_CSS = `
  .nh-nav-link {
    position: relative;
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 500;
    padding-bottom: 4px;
    transition: color 0.18s;
    color: rgba(255,255,255,0.85);
  }
  .nh-nav-link:hover {
    color: #F97316 !important;
  }
  .nh-nav-link.active {
    color: #F97316 !important;
  }
  .nh-nav-link .underline-bar {
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 2px;
    background: #F97316;
    opacity: 0;
    transition: opacity 0.18s;
  }
  .nh-nav-link.active .underline-bar {
    opacity: 1;
  }
  .nh-nav-phone {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #ffffff;
    font-size: 0.875rem;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.18s;
  }
  .nh-nav-phone:hover {
    color: #F97316 !important;
  }

  /* Responsive show/hide */
  .desktop-only { display: flex; }
  .mobile-only { display: none; }
  @media (max-width: 768px) {
    .desktop-only { display: none !important; }
    .mobile-only { display: flex !important; }
  }

  /* Mobile menu animation */
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 89;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .mobile-menu-overlay.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-menu-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 91;
    width: min(320px, 85vw);
    background: linear-gradient(180deg, #0f1118 0%, #161926 100%);
    border-left: 1px solid rgba(255,255,255,0.08);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mobile-menu-drawer.is-open {
    transform: translateX(0);
  }

  .mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    text-decoration: none;
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
    font-weight: 500;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s, color 0.2s;
  }
  .mobile-menu-item:active {
    background: rgba(249,115,22,0.08);
    color: #F97316;
  }
  .mobile-menu-item .menu-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(249,115,22,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .mobile-menu-cta {
    margin: 16px 20px;
    padding: 16px 0;
    border-radius: 14px;
    background: var(--gradient-accent);
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    border: none;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 20px rgba(249,115,22,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .mobile-menu-cta:active {
    transform: scale(0.97);
  }

  .mobile-phone-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    text-decoration: none;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    transition: background 0.2s;
    border-radius: 12px;
    margin: 0 12px;
    background: rgba(249,115,22,0.06);
    border: 1px solid rgba(249,115,22,0.12);
  }
  .mobile-phone-link:active {
    background: rgba(249,115,22,0.15);
  }
`;

export function SiteHeader({ onQuickOrderClick }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const drawerRef = useRef(null);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);



    // Lock body scroll when drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const closeMenu = () => setOpen(false);

    return (
        <>
            <style>{NAV_CSS}</style>
            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 90,
                    transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
                    background: scrolled ? "var(--color-bg-overlay)" : "transparent",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                    borderBottom: scrolled ? "1px solid var(--color-border-subtle)" : "1px solid transparent",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <span style={{
                            width: 38, height: 38,
                            borderRadius: "50%",
                            background: "var(--gradient-accent)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 0 14px var(--color-accent-glow)",
                            flexShrink: 0,
                        }}>
                            <Flame size={18} color="#fff" strokeWidth={2.2} />
                        </span>
                        <span style={{ lineHeight: 1 }}>
                            <span style={{ display: "block", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em" }}>
                                <span style={{ color: "#ffffff" }}>Київ</span><span style={{ color: "#F97316" }}>Брикет</span>
                            </span>
                            <span style={{ display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em", marginTop: 1 }}>
                                ТОВ «Київ Брикет»
                            </span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-only">
                        {links.map((l) => (
                            <Link
                                key={l.to + l.label}
                                to={l.to}
                                className={`nh-nav-link${location.pathname === l.to ? " active" : ""}`}
                            >
                                {l.label}
                                <span className="underline-bar" />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop right */}
                    <div className="desktop-only" style={{ alignItems: "center", gap: 20 }}>
                        <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="nh-nav-phone">
                            <Phone size={14} color="#F97316" />
                            {shopConfig.contact.phone}
                        </a>
                        <button onClick={onQuickOrderClick} className="nh-btn-primary" style={{ padding: "10px 22px", fontSize: "0.875rem" }}>
                            Замовити
                        </button>
                    </div>

                    {/* Mobile: phone shortcut + burger */}
                    <div className="mobile-only" style={{ alignItems: "center", gap: 6 }}>
                        <a
                            href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                            aria-label="Зателефонувати"
                            style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: "rgba(249,115,22,0.1)",
                                border: "1px solid rgba(249,115,22,0.2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                textDecoration: "none",
                            }}
                        >
                            <Phone size={18} color="#F97316" />
                        </a>
                        <button
                            onClick={() => setOpen(!open)}
                            style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: open ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "background 0.2s",
                            }}
                            aria-label="Меню"
                        >
                            {open ? <X size={20} color="#F97316" /> : <Menu size={20} color="#fff" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile overlay */}
            <div
                className={`mobile-menu-overlay${open ? " is-open" : ""}`}
                onClick={closeMenu}
            />

            {/* Mobile drawer */}
            <div
                ref={drawerRef}
                className={`mobile-menu-drawer${open ? " is-open" : ""}`}
            >
                {/* Drawer top bar */}
                <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", flexShrink: 0 }}>
                    <button
                        onClick={closeMenu}
                        aria-label="Закрити меню"
                        style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <X size={20} color="#fff" />
                    </button>
                </div>

                {/* Navigation links */}
                <nav style={{ flex: 1 }}>
                    {links.map((l) => {
                        const IconComp = l.icon;
                        return (
                            <Link
                                key={l.to + l.label}
                                to={l.to}
                                className="mobile-menu-item"
                                onClick={closeMenu}
                            >
                                <span className="menu-icon-wrap">
                                    <IconComp size={16} color="#F97316" />
                                </span>
                                <span style={{ flex: 1 }}>{l.label}</span>
                                <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                            </Link>
                        );
                    })}
                </nav>

                {/* Phone + CTA at bottom */}
                <div style={{ padding: "12px 0 24px", flexShrink: 0 }}>
                    <a
                        href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                        className="mobile-phone-link"
                    >
                        <span style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "rgba(249,115,22,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <Phone size={16} color="#F97316" />
                        </span>
                        <span>
                            <span style={{ display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>Зателефонувати</span>
                            {shopConfig.contact.phone}
                        </span>
                    </a>

                    <div style={{
                        display: "flex", alignItems: "center", gap: 12,
                        margin: "8px 12px 0", padding: "12px 20px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                        <span style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "rgba(34,197,94,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <Clock size={16} color="#22c55e" />
                        </span>
                        <span>
                            <span style={{ display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>Режим роботи</span>
                            <span style={{ fontSize: "0.95rem", color: "#fff", fontWeight: 600 }}>Щодня 09:00 – 20:00</span>
                        </span>
                    </div>

                    <button
                        onClick={() => { closeMenu(); onQuickOrderClick?.(); }}
                        className="mobile-menu-cta"
                        style={{ display: "block", width: "calc(100% - 40px)" }}
                    >
                        🔥 Замовити зараз
                    </button>
                </div>
            </div>
        </>
    );
}
