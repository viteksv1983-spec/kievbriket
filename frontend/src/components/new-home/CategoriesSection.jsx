import React, { useState } from "react";
import { ArrowRight, Truck, Package, Flame as FireIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useReveal } from "../../hooks/useReveal";
import api from "../../api";
import { getImageUrl } from "../../utils/urls";

function ProductCard({ p, delay }) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    // We assign some fake tags or details since API categories only have name/desc
    // but we try to match them gracefully.
    const isBriquettes = p.slug === 'brikety' || p.slug === 'ruf' || p.slug === 'pinikay';
    const isCoal = p.slug === 'vugillya' || p.slug === 'coal_ao' || p.slug === 'coal_as';

    let fakeTags = ["Деревина", "Екологічно"];
    let triggerIcon = <Truck size={13} />;
    let triggerText = "Доставка сьогодні";
    let seoDescription = "Колені дрова твердих і м’яких порід для опалення будинку, котлів та камінів. Доставка дров по Києву та області.";

    if (isBriquettes) {
        fakeTags = ["RUF", "Pini-Kay", "Висока тепловіддача"];
        triggerIcon = <FireIcon size={13} />;
        triggerText = "Хіт продажу";
        seoDescription = "Екологічні брикети RUF, Nestro та Pini Kay з високою тепловіддачею.";
    } else if (isCoal) {
        fakeTags = ["Антрацит", "Довгогоріння"];
        triggerIcon = <Package size={13} />;
        triggerText = "В наявності";
        seoDescription = "Кам’яне вугілля антрацит та інші види для ефективного опалення.";
    }

    // Handle image URL properly using the shared utility
    // If the image errors out, we switch to a data-uri placeholder to guarantee it loads inline
    const placeholderSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23888">${encodeURIComponent(p.name)}</text></svg>`;

    const initialImgUrl = getImageUrl(p.image_url, api.defaults.baseURL) || placeholderSvg;
    const currentImgUrl = imgError ? placeholderSvg : initialImgUrl;

    return (
        <article
            className="reveal"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "var(--c-surface)",
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${hovered ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"}`,
                transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(249,115,22,0.12)" : "0 4px 20px rgba(0,0,0,0.2)",
                transitionDelay: delay,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ height: 220, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img
                    src={currentImgUrl}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                        if (!imgError) setImgError(true);
                    }}
                    style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        filter: isCoal ? "brightness(0.75) saturate(0.9) contrast(1.2)" : "brightness(0.85) saturate(1.1)",
                        transform: hovered ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.5s ease",
                    }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(22,28,37,0.85) 0%, transparent 55%)" }} />
                {isCoal && (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 60%)", mixBlendMode: "overlay" }} />
                )}
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10, letterSpacing: "-0.02em" }}>
                    {p.name}
                </h3>

                <p style={{ fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {seoDescription}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                    {fakeTags.map((t) => (
                        <span key={t} style={{
                            background: "var(--c-surface2)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 6,
                            padding: "3px 10px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "var(--c-text2)",
                        }}>
                            {t}
                        </span>
                    ))}
                </div>

                <Link
                    to={`/catalog/${p.slug}/`}
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: hovered ? "var(--color-accent-dark)" : "var(--color-accent-primary)",
                        boxShadow: hovered ? "0 4px 20px rgba(249,115,22,0.45)" : "0 2px 10px rgba(249,115,22,0.25)",
                        color: "#fff",
                        borderRadius: 10,
                        padding: "12px 0",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        transition: "background 0.2s, box-shadow 0.2s",
                    }}
                >
                    Переглянути товари <ArrowRight size={15} />
                </Link>

                <div style={{
                    display: "flex", alignItems: "center", justifyItems: "center", gap: 5,
                    marginTop: 10,
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    justifyContent: "center"
                }}>
                    <span style={{ color: "rgba(249,115,22,0.7)", display: "flex", alignItems: "center" }}>{triggerIcon}</span>
                    {triggerText}
                </div>
            </div>
        </article>
    );
}

export function CategoriesSection({ categories = [] }) {
    const { ref, visible } = useReveal();

    // We'll show up to 3 categories to match the Figma grid cleanly,
    // or exactly what is passed.
    const displayCategories = categories.slice(0, 3);

    return (
        <section
            id="categories"
            ref={ref}
            style={{ padding: "var(--s-section) 0", background: "var(--c-green-bg)", position: "relative" }}
        >
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 80,
                background: "linear-gradient(180deg, var(--color-bg-main) 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 1,
            }} />
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 1,
                background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.18) 50%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 2,
            }} />

            <div className="layout-container" style={{ zIndex: 3 }}>

                <div className={`reveal ${visible ? "visible" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--s-header)", flexWrap: "wrap", gap: 20 }}>
                    <div>
                        <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Асортимент</p>
                        <h2 className="h2">
                            Популярні категорії<br />
                            <span style={{ color: "var(--c-orange)" }}>твердого палива</span>
                        </h2>
                    </div>
                    <Link to="/catalog/drova" style={{ color: "var(--c-text2)", fontSize: "0.9rem", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-text)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-text2)")}
                    >
                        Всі товари <ArrowRight size={14} />
                    </Link>
                </div>

                <div
                    className={`cat-grid ${visible ? "visible" : ""}`}
                    style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}
                >
                    {displayCategories.map((p, i) => (
                        <ProductCard key={p.slug || i} p={p} delay={`${i * 0.1}s`} />
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr !important; max-width: 480px; margin-left: auto; margin-right: auto; } }
        @media (max-width: 600px) { .cat-grid { max-width: 100% !important; } }
        @media (max-width: 479px) {
          .cat-grid article > div:first-child { height: 180px !important; }
          .cat-grid article > div:last-child { padding: 1.125rem !important; }
          .cat-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
        .cat-grid .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .cat-grid.visible .reveal:nth-child(1) { opacity:1; transform:none; transition-delay:0s; }
        .cat-grid.visible .reveal:nth-child(2) { opacity:1; transform:none; transition-delay:0.1s; }
        .cat-grid.visible .reveal:nth-child(3) { opacity:1; transform:none; transition-delay:0.2s; }
      `}</style>
        </section>
    );
}
