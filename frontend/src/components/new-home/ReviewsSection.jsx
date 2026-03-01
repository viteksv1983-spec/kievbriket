import React, { useState } from "react";
import { Star, Quote } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const reviews = [
    {
        id: 1,
        name: "Олена Ковальчук",
        city: "Київ, Оболонь",
        stars: 5,
        text: "Замовляємо дрова вже третій рік поспіль. Завжди сухі, чесна вага, привезли точно в домовлений час. Рекомендую всім сусідам по дачному кооперативу.",
        initials: "ОК",
        date: "Жовтень 2024",
    },
    {
        id: 2,
        name: "Дмитро Марченко",
        city: "Ірпінь",
        stars: 5,
        text: "Брали вугілля антрацит на зиму. Якість відмінна — котел тримає температуру значно краще ніж з попереднього постачальника. Ціна адекватна, доставка швидка. Наступного сезону знову тільки до вас.",
        initials: "ДМ",
        date: "Листопад 2024",
    },
    {
        id: 3,
        name: "Наталія Бондаренко",
        city: "Бровари",
        stars: 5,
        text: "Паливні брикети — щось нове для мене, але менеджер детально пояснив різницю між RUF і Pini-Kay. Зупинилась на RUF, задоволена на 100%.",
        initials: "НБ",
        date: "Грудень 2024",
    },
];

function StarRow({ count, bright }) {
    return (
        <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2, 3, 4].map((i) => (
                <Star
                    key={i}
                    size={14}
                    fill={i < count ? "#F97316" : "transparent"}
                    color="#F97316"
                    style={{
                        opacity: bright ? 1 : 0.75,
                        transition: "opacity 0.2s",
                        filter: bright && i < count ? "drop-shadow(0 0 3px rgba(249,115,22,0.7))" : "none",
                    }}
                />
            ))}
        </div>
    );
}

function ReviewCard({ r, delay }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="nh-card review-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transitionDelay: delay,
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                border: `1px solid ${hovered ? "rgba(249,115,22,0.30)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: hovered
                    ? "0 20px 52px rgba(0,0,0,0.45), 0 0 0 1px rgba(249,115,22,0.10), 0 0 32px rgba(249,115,22,0.08)"
                    : "0 6px 24px rgba(0,0,0,0.22)",
                transition: "transform 0.25s ease, border-color 0.25s, box-shadow 0.25s",
            }}
        >
            <Quote size={28} style={{ color: hovered ? "rgba(249,115,22,0.45)" : "rgba(249,115,22,0.22)", transition: "color 0.25s" }} />
            <StarRow count={r.stars} bright={hovered} />
            <p style={{ fontSize: "0.9rem", color: "var(--c-text2)", lineHeight: 1.7, flex: 1 }}>
                "{r.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--c-orange-dk), var(--c-orange))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800, color: "#fff", flexShrink: 0,
                    boxShadow: hovered ? "0 0 14px rgba(249,115,22,0.45)" : "none",
                    transition: "box-shadow 0.25s",
                }}>
                    {r.initials}
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--c-text)" }}>{r.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--c-text3)" }}>{r.city}</p>
                </div>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", flexShrink: 0 }}>{r.date}</p>
            </div>
        </div>
    );
}

export function ReviewsSection() {
    const { ref, visible } = useReveal();

    return (
        <section
            ref={ref}
            style={{
                padding: "var(--s-section) 0 5rem",
                background: "linear-gradient(180deg, #0D1117 0%, var(--c-green-bg) 30%, var(--c-green-bg) 100%)",
                position: "relative",
            }}
        >
            <div className="layout-container">
                {/* Header */}
                <div className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "var(--s-header)" }}>
                    <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Відгуки клієнтів</p>
                    <h2 className="h2" style={{ marginBottom: 28 }}>
                        Що кажуть{" "}
                        <span style={{ color: "var(--c-orange)" }}>наші клієнти</span>
                    </h2>

                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 20,
                        background: "var(--color-bg-overlay)",
                        border: "1px solid rgba(249,115,22,0.26)",
                        borderRadius: 16,
                        padding: "18px 36px",
                        boxShadow: "0 0 48px rgba(249,115,22,0.10), 0 0 0 1px rgba(249,115,22,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}>
                        <div className={`rating-stars ${visible ? "stars-visible" : ""}`} style={{ display: "flex", gap: 5 }}>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    fill="#F97316"
                                    color="#F97316"
                                    className="rating-star"
                                    style={{
                                        filter: "drop-shadow(0 0 6px rgba(249,115,22,0.75))",
                                        animationDelay: `${i * 0.08}s`,
                                    }}
                                />
                            ))}
                        </div>

                        <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.10)" }} />

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 5, lineHeight: 1 }}>
                                <span style={{
                                    fontSize: "2.6rem",
                                    fontWeight: 900,
                                    color: "var(--color-accent-display)",
                                    letterSpacing: "-0.05em",
                                    lineHeight: 1,
                                    textShadow: "0 0 30px rgba(249,115,22,0.65), 0 0 60px rgba(249,115,22,0.25)",
                                }}>4.9</span>
                                <span style={{ fontSize: "1.05rem", color: "rgba(249,115,22,0.45)", fontWeight: 600 }}>/ 5</span>
                            </div>
                            <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.36)", fontWeight: 400, letterSpacing: "0.01em" }}>
                                на основі <span style={{ color: "rgba(255,255,255,0.62)", fontWeight: 600 }}>320+</span> відгуків
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: 14 }}>
                        <a
                            href="#contact"
                            style={{
                                fontSize: "0.82rem", color: "rgba(255,255,255,0.32)", fontWeight: 500,
                                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5,
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(249,115,22,0.80)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.32)")}
                        >
                            Переглянути всі відгуки →
                        </a>
                    </div>
                </div>

                <div
                    className={`reviews-grid ${visible ? "visible" : ""}`}
                    style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}
                >
                    {reviews.map((r, i) => (
                        <ReviewCard key={r.id} r={r} delay={`${i * 0.1}s`} />
                    ))}
                </div>
            </div>

            <style>{`
        /* Star shimmer animation */
        @keyframes starPop {
          0%   { opacity: 0; transform: scale(0.5); }
          60%  { opacity: 1; transform: scale(1.18); }
          100% { opacity: 1; transform: scale(1); }
        }
        .rating-star { opacity: 0; }
        .stars-visible .rating-star {
          animation: starPop 0.40s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        @media (max-width: 900px) { .reviews-grid { grid-template-columns: 1fr !important; max-width: 520px; margin: 0 auto; } }
        @media (max-width: 600px) { .reviews-grid { max-width: 100% !important; } }
        @media (max-width: 479px) {
          .rating-pill {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 14px 20px !important;
            width: 100% !important;
            max-width: 280px !important;
          }
          .rating-pill-divider { display: none !important; }
          .review-card { padding: 1.25rem !important; }
        }
        .reviews-grid .nh-card { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease, border-color 0.25s, box-shadow 0.25s; }
        .reviews-grid.visible .nh-card:nth-child(1) { opacity:1; transform:none; transition-delay:0s; }
        .reviews-grid.visible .nh-card:nth-child(2) { opacity:1; transform:none; transition-delay:0.1s; }
        .reviews-grid.visible .nh-card:nth-child(3) { opacity:1; transform:none; transition-delay:0.2s; }
        .reviews-grid.visible .nh-card:hover { transform: translateY(-6px) !important; }
      `}</style>
        </section>
    );
}
