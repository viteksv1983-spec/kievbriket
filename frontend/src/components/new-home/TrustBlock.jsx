import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import deliveryImg from "./assets/trust-delivery.webp";
import deliveryImgMobile from "./assets/trust-delivery-mobile.webp";

const points = [
    "Власний автопарк — без затримок",
    "Сертифіковане паливо",
    "1000+ постійних клієнтів",
    "Офіційна діяльність, повний пакет документів",
];

export function TrustBlock({ onOrderClick }) {
    const { ref, visible } = useReveal();

    return (
        <section
            id="about-trust"
            ref={ref}
            style={{ padding: "var(--s-section) 0", background: "var(--c-green-s)", position: "relative", overflow: "hidden" }}
        >
            {/* Gradient bridge */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 80,
                background: "var(--gradient-section-fade)",
                pointerEvents: "none",
                zIndex: 0,
            }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "var(--gradient-orange-line)", zIndex: 1 }} />

            <div className="layout-container" style={{ zIndex: 2 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="trust-grid">

                    {/* Image */}
                    <div
                        className={`reveal ${visible ? "visible" : ""}`}
                        style={{ borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}
                    >
                        <picture>
                            <source media="(max-width: 600px)" srcSet={deliveryImgMobile} />
                            <img
                                src={deliveryImg}
                                alt="Доставка твердого палива"
                                loading="lazy"
                                decoding="async"
                                width="720"
                                height="540"
                                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", filter: "brightness(0.80) saturate(1.15) contrast(1.05)" }}
                            />
                        </picture>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,17,23,0.55) 0%, transparent 50%)", pointerEvents: "none" }} />
                        <div style={{
                            position: "absolute", top: 20, right: 20,
                            background: "rgba(13,17,23,0.88)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(249,115,22,0.20)",
                            borderRadius: 12,
                            padding: "14px 20px",
                            textAlign: "center",
                        }}>
                            <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--c-orange)", lineHeight: 1 }}>12+</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--c-text2)", marginTop: 4, fontWeight: 500 }}>років на ринку</p>
                        </div>
                    </div>

                    {/* Text */}
                    <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
                        <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Про нас</p>
                        <h2 className="h2" style={{ marginBottom: 20 }}>
                            Стабільний постачальник<br />
                            <span style={{ color: "var(--c-orange)" }}>твердого палива з 2013 року</span>
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "var(--c-text2)", lineHeight: 1.75, marginBottom: "var(--s-block)", maxWidth: 440 }}>
                            Щомісяця виконуємо десятки доставок по Києву та області. Понад 12 років працюємо без зривів термінів та невиконаних зобов'язань.
                        </p>

                        <ul style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "var(--s-header)" }}>
                            {points.map((pt) => (
                                <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                    <CheckCircle2 size={18} style={{ color: "var(--c-orange)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: "0.9rem", color: "var(--c-text2)", lineHeight: 1.6 }}>{pt}</span>
                                </li>
                            ))}
                        </ul>

                        <button onClick={onOrderClick} className="nh-btn-primary">
                            Замовити з доставкою
                        </button>
                    </div>

                </div>
            </div>

            <style>{`
        @media (max-width: 840px) { .trust-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
        @media (max-width: 479px) {
          .trust-grid { gap: 1.5rem !important; }
        }
      `}</style>
        </section>
    );
}
