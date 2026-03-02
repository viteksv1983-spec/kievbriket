import React, { useState } from "react";
import { MapPin, Clock, CheckCircle2, ArrowRight, Truck, Star } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const zones = [
    { name: "Київ", detail: "Доставка в день замовлення (до 4 годин)", time: "0–4 год" },
    { name: "Ближнє Підмістя", detail: "Бориспіль, Бровари, Вишневе, Ірпінь, Буча", time: "24 год" },
    { name: "Київська область", detail: "Фастів, Біла Церква, Обухів, Переяслав", time: "24–48 год" },
];

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

function KyivMap({ hoveredZone }) {
    const oblastActive = hoveredZone === "Київська область";
    const suburbActive = hoveredZone === "Ближнє Підмістя";
    const kyivActive = hoveredZone === "Київ";

    return (
        <svg
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-label="Карта зони доставки Київ Брикет"
        >
            <defs>
                <filter id="kb-noise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" seed="9" stitchTiles="stitch" result="noise" />
                    <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
                    <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="blend" />
                    <feComposite in="blend" in2="SourceGraphic" operator="in" />
                </filter>

                <radialGradient id="kb-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity={kyivActive ? "0.45" : "0.30"} />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </radialGradient>

                <filter id="kb-pin-glow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <radialGradient id="kb-vignette" cx="50%" cy="50%" r="70%">
                    <stop offset="55%" stopColor="rgba(0,0,0,0)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
                </radialGradient>

                <radialGradient id="kb-bg-depth" cx="50%" cy="53%" r="55%">
                    <stop offset="0%" stopColor="#132b1a" />
                    <stop offset="100%" stopColor="#080f0a" />
                </radialGradient>

                <clipPath id="kb-clip">
                    <rect width="400" height="300" />
                </clipPath>
            </defs>

            <rect width="400" height="300" fill="#080f0a" />
            <rect width="400" height="300" fill="url(#kb-bg-depth)" />

            {[50, 100, 150, 200, 250].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y}
                    stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            ))}
            {[57, 114, 171, 228, 285, 342].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300"
                    stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            ))}

            <rect
                width="400" height="300"
                fill="rgba(255,255,255,0.07)"
                filter="url(#kb-noise)"
                clipPath="url(#kb-clip)"
                style={{ mixBlendMode: "overlay" }}
            />

            <path
                d={OBLAST_PATH}
                fill={oblastActive ? "rgba(249,115,22,0.055)" : "rgba(249,115,22,0.025)"}
                stroke={oblastActive ? "rgba(249,115,22,0.48)" : "rgba(249,115,22,0.32)"}
                strokeWidth="1.5"
                strokeDasharray="5 4"
                strokeLinejoin="round"
                style={{ transition: "fill 0.35s, stroke 0.35s" }}
            />

            <ellipse
                cx="200" cy="158" rx="76" ry="60"
                fill="none"
                stroke={suburbActive ? "rgba(249,115,22,0.50)" : "rgba(249,115,22,0.18)"}
                strokeWidth="1"
                strokeDasharray="4 5"
                style={{ transition: "stroke 0.35s" }}
            />

            {[0, 0.73, 1.46].map((begin, i) => (
                <circle key={i} cx="200" cy="158" r="22"
                    fill="none"
                    stroke="rgba(249,115,22,0.70)"
                    strokeWidth="1.5"
                >
                    <animate attributeName="r" from="22" to="50" dur="2.2s" repeatCount="indefinite" begin={`${begin}s`} />
                    <animate attributeName="opacity" from="0.55" to="0" dur="2.2s" repeatCount="indefinite" begin={`${begin}s`} />
                </circle>
            ))}

            <circle cx="200" cy="158" r={kyivActive ? 70 : 52}
                fill="url(#kb-glow)"
                style={{ transition: "r 0.4s ease" }}
            />

            {SAT_PINS.map((pin) => (
                <g key={pin.label}>
                    <circle cx={pin.cx} cy={pin.cy} r="9" fill="rgba(249,115,22,0.12)" />
                    <circle cx={pin.cx} cy={pin.cy} r="4.5" fill="#F97316" opacity="0.75" filter="url(#kb-pin-glow)">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s"
                            repeatCount="indefinite" begin={pin.beginAnim} />
                    </circle>
                    <text
                        x={pin.cx} y={pin.cy + 19}
                        textAnchor="middle"
                        style={{ fontFamily: "Inter, sans-serif", fontSize: "8.5px", fontWeight: 600, fill: "rgba(255,255,255,0.30)" }}
                    >
                        {pin.label}
                    </text>
                </g>
            ))}

            <g filter="url(#kb-pin-glow)">
                <circle cx="200" cy="158" r="11" fill="#F97316" />
                <circle cx="200" cy="158" r="5" fill="#fff" />
            </g>
            <text
                x="200" y="143"
                textAnchor="middle"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, fill: "rgba(255,255,255,0.55)" }}
            >
                Київ
            </text>

            <rect width="400" height="300" fill="url(#kb-vignette)" />

            <text
                x="14" y="285"
                style={{
                    fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700,
                    fill: "rgba(249,115,22,0.65)", letterSpacing: "0.07em", textTransform: "uppercase"
                }}
            >
                КИЇВ ТА ОБЛАСТЬ
            </text>

            <text
                x="200" y="293"
                textAnchor="middle"
                style={{
                    fontFamily: "Inter, sans-serif", fontSize: "8px", fontWeight: 400,
                    fill: "rgba(255,255,255,0.20)"
                }}
            >
                Працюємо по всій Київській області
            </text>
        </svg>
    );
}

export function DeliverySection() {
    const { ref, visible } = useReveal();
    const [hoveredZone, setHoveredZone] = useState(null);

    return (
        <section
            id="delivery"
            ref={ref}
            style={{ padding: "var(--s-section) 0", background: "var(--c-bg)", position: "relative" }}
        >
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 96,
                background: "var(--gradient-section-fade)",
                pointerEvents: "none",
                zIndex: 0,
            }} />

            <div className="layout-container" style={{ zIndex: 1 }}>

                <div className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "var(--s-header)" }}>
                    <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Зона покриття</p>
                    <h2 className="h2" style={{ marginBottom: 12 }}>
                        Доставляємо по{" "}
                        <span style={{ color: "var(--c-orange)" }}>Києву та області</span>
                    </h2>
                    <p style={{ fontSize: "0.9375rem", color: "var(--c-text2)", maxWidth: 460, margin: "0 auto", marginBottom: "1.5rem" }}>
                        Власний автопарк дозволяє нам контролювати терміни і якість доставки без посередників.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text)' }}>
                            <CheckCircle2 size={14} color="var(--c-orange)" /> 5000+ доставок
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text)' }}>
                            <Star size={14} color="var(--c-orange)" /> 12 років досвіду
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text)' }}>
                            <Truck size={14} color="var(--c-orange)" /> власний автопарк
                        </span>
                    </div>
                </div>

                <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}
                    className="delivery-grid"
                >
                    <div
                        className={`reveal ${visible ? "visible" : ""}`}
                        style={{
                            background: "var(--color-bg-green-card)",
                            border: "1px solid var(--color-border-orange-lg)",
                            borderRadius: 16,
                            overflow: "hidden",
                            position: "relative",
                            aspectRatio: "4/3",
                        }}
                    >
                        <KyivMap hoveredZone={hoveredZone} />
                    </div>

                    <div
                        className={`reveal ${visible ? "visible" : ""}`}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem", transitionDelay: "0.12s" }}
                    >
                        {zones.map((z) => (
                            <div
                                key={z.name}
                                className="nh-card"
                                onMouseEnter={() => setHoveredZone(z.name)}
                                onMouseLeave={() => setHoveredZone(null)}
                                style={{
                                    padding: "1.5rem", display: "flex", justifyContent: "space-between",
                                    alignItems: "flex-start", gap: 16,
                                    cursor: "default",
                                    border: `1px solid ${hoveredZone === z.name ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"}`,
                                    transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                                    transform: hoveredZone === z.name ? "translateX(4px)" : "none",
                                    boxShadow: hoveredZone === z.name
                                        ? "0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(249,115,22,0.08)"
                                        : "none",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <MapPin size={15} color="var(--c-orange)" />
                                        <span style={{ fontWeight: 700, color: "var(--c-text)", fontSize: "0.9375rem" }}>{z.name}</span>
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "var(--c-text2)", lineHeight: 1.5 }}>{z.detail}</p>
                                </div>
                                <div style={{
                                    background: hoveredZone === z.name ? "rgba(249,115,22,0.18)" : "rgba(249,115,22,0.10)",
                                    border: "1px solid rgba(249,115,22,0.20)",
                                    borderRadius: 8,
                                    padding: "6px 12px",
                                    display: "flex", alignItems: "center", gap: 5,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    transition: "background 0.25s",
                                }}>
                                    <Clock size={12} color="var(--c-orange)" />
                                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--c-orange)" }}>{z.time}</span>
                                </div>
                            </div>
                        ))}

                        <div style={{
                            padding: "1.25rem",
                            background: "rgba(249,115,22,0.06)",
                            borderRadius: 12,
                            border: "1px solid rgba(249,115,22,0.15)",
                            display: "flex", flexDirection: "column", gap: 12,
                        }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <CheckCircle2 size={17} style={{ color: "var(--c-orange)", flexShrink: 0, marginTop: 2 }} />
                                <p style={{ fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.6 }}>
                                    Потрібна доставка за межі Київської обл.?{" "}
                                    <span style={{ color: "var(--c-text)", fontWeight: 600 }}>Зв'яжіться з нами</span> — знайдемо рішення.
                                </p>
                            </div>
                            <a
                                href="#contact"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 7,
                                    background: "#F97316",
                                    color: "#fff",
                                    borderRadius: 9,
                                    padding: "10px 18px",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    alignSelf: "flex-start",
                                    boxShadow: "0 2px 12px rgba(249,115,22,0.30)",
                                    transition: "background 0.2s, box-shadow 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#ea580c";
                                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.45)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#F97316";
                                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(249,115,22,0.30)";
                                }}
                            >
                                Уточнити доставку <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) { .delivery-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 479px) {
          .delivery-grid { gap: 0.875rem !important; }
          .delivery-grid .nh-card { padding: 1rem !important; }
        }
      `}</style>
        </section>
    );
}
