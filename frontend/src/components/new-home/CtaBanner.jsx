import React from "react";
import { ArrowRight, Flame, Phone } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import shopConfig from '../../shop.config';
import fireplaceImg from "./assets/cta-fireplace.webp";

export function CtaBanner() {
    const { ref, visible } = useReveal();

    return (
        <section
            ref={ref}
            style={{
                position: "relative",
                overflow: "hidden",
                padding: "var(--s-section) 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img
                src={fireplaceImg}
                alt="Тепло вдома"
                loading="lazy"
                decoding="async"
                width="1400"
                height="933"
                style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.22) saturate(0.75)",
                    zIndex: 0,
                }}
            />

            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.04) 50%, transparent 70%)",
                zIndex: 1,
                pointerEvents: "none",
            }} />

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    maxWidth: 740,
                    margin: "0 auto",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div className={`reveal ${visible ? "visible" : ""}`} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

                    <div
                        className="nh-badge"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            marginBottom: 28,
                        }}
                    >
                        <Flame size={13} />
                        Пропозиція обмежена · Зима 2025/26
                    </div>

                    <h2
                        style={{
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 900,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                            color: "var(--c-text)",
                            marginBottom: 20,
                            textAlign: "center",
                        }}
                    >
                        Замовте тверде паливо<br />
                        <span style={{ color: "var(--c-orange)" }}>вже сьогодні</span>
                    </h2>

                    <p
                        style={{
                            fontSize: "1rem",
                            color: "var(--c-text2)",
                            lineHeight: 1.75,
                            maxWidth: 480,
                            textAlign: "center",
                            marginBottom: 40,
                        }}
                    >
                        Ціни зростають із першим похолоданням.{" "}
                        <span style={{ color: "var(--c-text)", fontWeight: 600 }}>
                            Забронюйте паливо зараз за фіксованою ціною.
                        </span>
                    </p>

                    <div className="cta-btns">
                        <a
                            href="#contact"
                            className="nh-btn-primary cta-btn-main"
                            style={{ fontSize: "1rem", padding: "16px 40px" }}
                        >
                            Оформити замовлення <ArrowRight size={17} />
                        </a>

                        <a
                            href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                            className="cta-btn-phone"
                            style={{
                                fontSize: "1rem",
                                padding: "15px 40px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                borderRadius: 14,
                                border: "2px solid rgba(249,115,22,0.55)",
                                color: "#F97316",
                                background: "transparent",
                                fontWeight: 700,
                                letterSpacing: "-0.01em",
                                boxShadow: "0 0 20px rgba(249,115,22,0.12)",
                                textDecoration: "none",
                                transition: "border-color 0.22s, box-shadow 0.22s, background 0.22s, color 0.22s",
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget;
                                el.style.borderColor = "rgba(249,115,22,0.9)";
                                el.style.boxShadow = "0 0 32px rgba(249,115,22,0.28)";
                                el.style.background = "rgba(249,115,22,0.08)";
                                el.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget;
                                el.style.borderColor = "rgba(249,115,22,0.55)";
                                el.style.boxShadow = "0 0 20px rgba(249,115,22,0.12)";
                                el.style.background = "transparent";
                                el.style.color = "#F97316";
                            }}
                        >
                            <Phone size={16} style={{ flexShrink: 0 }} />
                            Подзвонити
                        </a>
                    </div>

                    {/* Urgency micro-text */}
                    <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span style={{
                            display: 'inline-block',
                            width: 7, height: 7,
                            borderRadius: '50%',
                            background: 'var(--c-orange)',
                            boxShadow: '0 0 8px var(--c-orange)',
                            animation: 'ctaPulse 2s ease-in-out infinite',
                            flexShrink: 0,
                        }} />
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                            Сьогодні ще доступна доставка
                        </span>
                    </div>

                </div>
            </div>
            <style>{`
        @keyframes ctaPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--c-orange); }
          50% { opacity: 0.5; box-shadow: 0 0 3px var(--c-orange); }
        }
        .cta-btns {
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
        @media (max-width: 479px) {
          .cta-btns {
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }
          .cta-btn-main,
          .cta-btn-phone {
            width: 100% !important;
            padding: 16px 24px !important;
            min-width: unset !important;
            justify-content: center;
            border-radius: 12px !important;
          }
        }
      `}</style>
        </section >
    );
}
