import { ArrowRight, Truck, Package, Flame as FireIcon } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useState } from "react";

const droviImg = "https://images.unsplash.com/photo-1579583691306-079f182d2638?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMGZpcmV3b29kJTIwc3RhY2slMjBkYXJrJTIwbW9vZHklMjB3YXJlaG91c2V8ZW58MXx8fHwxNzcyMjE2MTgyfDA&ixlib=rb-4.1.0&q=80&w=800";
const brykеtyImg = "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZnVlbCUyMGJyaXF1ZXR0ZXMlMjBkYXJrJTIwYmFja2dyb3VuZCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzcyMjE2MTgzfDA&ixlib=rb-4.1.0&q=80&w=800";
const vuhilliaImg = "https://images.unsplash.com/photo-1602748363578-822e2e7f64ed?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FsJTIwY2h1bmtzJTIwZGFyayUyMGRyYW1hdGljJTIwaW5kdXN0cmlhbCUyMHRleHR1cmV8ZW58MXx8fHwxNzcyMjE2MTgzfDA&ixlib=rb-4.1.0&q=80&w=800";

interface Product {
  id: string;
  anchor: string;
  img: string;
  label: string;
  title: string;
  priceFrom: string;
  priceUnit: string;
  desc: string;
  tags: string[];
  trigger: { icon: React.ReactNode; text: string };
  coalOverlay?: boolean;
}

const products: Product[] = [
  {
    id: "drova",
    anchor: "#contact",
    img: droviImg,
    label: "01 — Дрова",
    title: "Дрова колоті",
    priceFrom: "1 200",
    priceUnit: "грн / скл. м",
    desc: "Дуб, граб, акація, береза. Сухі, колоті, готові до використання. Вологість до 20%.",
    tags: ["Дуб", "Граб", "Акація", "Береза"],
    trigger: { icon: <Truck size={13} />, text: "Доставка сьогодні" },
  },
  {
    id: "brykety",
    anchor: "#contact",
    img: brykеtyImg,
    label: "02 — Брикети",
    title: "Паливні брикети",
    priceFrom: "6 800",
    priceUnit: "грн / тонна",
    desc: "RUF та Pini-Kay. Висока теплотворність, мінімум золи, тривале горіння.",
    tags: ["RUF", "Pini-Kay", "5 000 ккал/кг"],
    trigger: { icon: <FireIcon size={13} />, text: "Хіт продажу" },
  },
  {
    id: "vuhillia",
    anchor: "#contact",
    img: vuhilliaImg,
    label: "03 — Вугілля",
    title: "Антрацит та вугілля",
    priceFrom: "8 200",
    priceUnit: "грн / тонна",
    desc: "Антрацит і кам'яне вугілля. Фракції на вибір. Для котлів, печей та камінів.",
    tags: ["нрацит", "Горіх", "Сім'янка"],
    trigger: { icon: <Package size={13} />, text: "В наявності" },
    coalOverlay: true,
  },
];

function ProductCard({ p, delay }: { p: Product; delay: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      id={p.id}
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
      {/* Image */}
      <div style={{ height: 220, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          decoding="async"
          width={800}
          height={533}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: p.coalOverlay
              ? "brightness(0.75) saturate(0.9) contrast(1.2)"
              : "brightness(0.85) saturate(1.1)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        {/* Base gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(22,28,37,0.85) 0%, transparent 55%)" }} />
        {/* Coal warm overlay */}
        {p.coalOverlay && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 60%)", mixBlendMode: "overlay" }} />
        )}
        {/* Label */}
        <span style={{
          position: "absolute", top: 16, left: 16,
          fontSize: "0.75rem", fontWeight: 700, color: "var(--c-orange)",
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          {p.label}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10, letterSpacing: "-0.02em" }}>
          {p.title}
        </h3>

        {/* Price — prominent */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 14 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(249,115,22,0.75)", letterSpacing: "0.02em" }}>від</span>
          <span style={{ fontSize: "1.55rem", fontWeight: 900, color: "#F97316", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {p.priceFrom}
          </span>
          <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(249,115,22,0.75)" }}>{p.priceUnit}</span>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
          {p.desc}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {p.tags.map((t) => (
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

        {/* CTA — orange by default */}
        <a
          href={p.anchor}
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
          Замовити <ArrowRight size={15} />
        </a>

        {/* Micro-trigger */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          marginTop: 10,
          color: "rgba(255,255,255,0.45)",
          fontSize: "0.75rem",
          fontWeight: 500,
        }}>
          <span style={{ color: "rgba(249,115,22,0.7)", display: "flex", alignItems: "center" }}>{p.trigger.icon}</span>
          {p.trigger.text}
        </div>
      </div>
    </article>
  );
}

export function CategoriesSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      id="categories"
      ref={ref as React.RefObject<HTMLElement>}
      style={{ padding: "var(--s-section) 0", background: "var(--c-green-bg)", position: "relative" }}
    >
      {/* Gradient bridge — blends from previous dark section into this section bg */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 80,
        background: "linear-gradient(180deg, var(--color-bg-main) 0%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      {/* Subtle orange axis line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.18) 50%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 3 }}>

        {/* Header */}
        <div className={`reveal ${visible ? "visible" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--s-header)", flexWrap: "wrap", gap: 20 }}>
          <div>
            <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Асортимент</p>
            <h2 className="h2">
              Три категорії<br />
              <span style={{ color: "var(--c-orange)" }}>твердого палива</span>
            </h2>
          </div>
          <a href="#contact" style={{ color: "var(--c-text2)", fontSize: "0.9rem", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-text2)")}
          >
            Всі продукти <ArrowRight size={14} />
          </a>
        </div>

        {/* Cards */}
        <div
          className={`cat-grid ${visible ? "visible" : ""}`}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}
        >
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={`${i * 0.1}s`} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr !important; max-width: 480px; margin-left: auto; margin-right: auto; } }
        @media (max-width: 600px) { .cat-grid { max-width: 100% !important; } }
        @media (max-width: 479px) {
          /* Image height smaller on mobile */
          .cat-grid article > div:first-child { height: 180px !important; }
          /* Content padding compact */
          .cat-grid article > div:last-child { padding: 1.125rem !important; }
          /* Header row: stack the "Всі продукти" link below title */
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