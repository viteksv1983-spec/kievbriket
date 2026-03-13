import React from "react";
import { Clock, Truck, Scale, Leaf, CreditCard, Timer } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const items = [
    { icon: <Clock size={28} />, title: "12+ років на ринку", desc: "12 років стабільної роботи — це розуміння клієнтів з пів слова" },
    { icon: <Truck size={28} />, title: "Власний транспорт", desc: "Власний автопарк — доставляємо без посередників та затримок." },
    { icon: <Timer size={28} />, title: "Доставка за 24 години", desc: "Доставка за 24 години у межах Києва та області.", hero: true },
    { icon: <Scale size={28} />, title: "Чесна вага та обʼєм", desc: "Ви можете поміряти об'єм прямо при отриманні і бути спокійними, що отримали те, що замовляли" },
    { icon: <Leaf size={28} />, title: "Сухе якісне паливо", desc: "Якісні вітчизняні дрова. Брикети — лише сертифікована сировина без домішок." },
    { icon: <CreditCard size={28} />, title: "Оплата при отриманні", desc: "Ніяких передоплат. Перевіряєте — платите. Просто і чесно." },
];

export function BenefitsSection() {
    const { ref, visible } = useReveal();

    return (
        <section
            id="about"
            ref={ref}
            style={{ padding: "100px 0", background: "var(--c-bg)" }}
        >
            <div className="layout-container">
                {/* Header */}
                <div className={`reveal ${visible ? "visible" : ""}`} style={{ marginBottom: "var(--s-header)" }}>
                    <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Чому обирають нас</p>
                    <h2 className="h2" style={{ maxWidth: 540 }}>
                        Чому нам довіряють<br />
                        <span style={{ color: "var(--c-orange)" }}>понад 1000 клієнтів</span>
                    </h2>
                </div>

                {/* Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "1.25rem",
                    }}
                    className="benefits-grid"
                >
                    {items.map((item, i) => (
                        <div
                            key={item.title}
                            className={`nh-card benefit-card-v2${item.hero ? " benefit-hero-v2" : ""} reveal ${visible ? "visible" : ""}`}
                            style={{
                                padding: "1.75rem",
                                transitionDelay: `${i * 0.08}s`,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Top accent line */}
                            <div className="benefit-top-line" />

                            {/* Horizontal: icon left, text right */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}>
                                <div className={`benefit-icon-circle${item.hero ? " benefit-icon-circle-hero" : ""}`}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 className="h3" style={{ margin: "0 0 6px 0", lineHeight: 1.3, paddingLeft: "1rem" }}>{item.title}</h3>
                                    <p className="body-sm" style={{
                                        margin: 0,
                                        paddingLeft: "1rem",
                                        color: "rgba(255,255,255,0.48)",
                                        lineHeight: 1.55,
                                    }}>{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) { .benefits-grid { grid-template-columns: repeat(2,1fr) !important; } }
                @media (max-width: 560px) { .benefits-grid { grid-template-columns: 1fr !important; } }
                @media (max-width: 479px) {
                    .benefits-grid { gap: 0.875rem !important; }
                    .benefits-grid .nh-card { padding: 1.25rem !important; }
                }

                /* ── Card inner redesign ── */
                .benefit-card-v2 {
                    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease !important;
                }

                /* Top accent line */
                .benefit-top-line {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.0) 30%, rgba(249,115,22,0.0) 70%, transparent 100%);
                    transition: background 0.4s ease;
                }

                .benefit-card-v2:hover .benefit-top-line {
                    background: linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.6) 30%, rgba(249,115,22,0.6) 70%, transparent 100%);
                }

                /* Icon circle */
                .benefit-icon-circle {
                    width: 52px;
                    height: 52px;
                    min-width: 52px;
                    border-radius: 14px;
                    background: rgba(249,115,22,0.08);
                    border: 1px solid rgba(249,115,22,0.16);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--c-orange);
                    transition: all 0.3s ease;
                }

                .benefit-card-v2:hover .benefit-icon-circle {
                    background: rgba(249,115,22,0.14);
                    border-color: rgba(249,115,22,0.35);
                    box-shadow: 0 0 18px rgba(249,115,22,0.2);
                    transform: scale(1.05);
                }

                /* Hero icon */
                .benefit-icon-circle-hero {
                    background: rgba(249,115,22,0.15) !important;
                    border-color: rgba(249,115,22,0.4) !important;
                    box-shadow: 0 0 14px rgba(249,115,22,0.15);
                }

                /* Card hover */
                .benefit-card-v2:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 14px 40px rgba(249,115,22,0.12), 0 4px 12px rgba(0,0,0,0.35) !important;
                    border-color: rgba(249,115,22,0.18) !important;
                }

                /* Hero card */
                .benefit-hero-v2 {
                    border: 1px solid rgba(249,115,22,0.25) !important;
                    background: linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(249,115,22,0.01) 100%) !important;
                    padding: 1.75rem !important;
                }

                .benefit-hero-v2 .h3 {
                    padding-left: 0.35rem;
                }

                .benefit-hero-v2 .benefit-top-line {
                    background: linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.35) 30%, rgba(249,115,22,0.35) 70%, transparent 100%);
                }

                .benefit-hero-v2:hover {
                    box-shadow: 0 14px 44px rgba(249,115,22,0.2), 0 4px 12px rgba(0,0,0,0.35) !important;
                }

                /* ── Mobile tweaks ── */
                @media (max-width: 560px) {
                    .benefit-card-v2:hover {
                        transform: none;
                        box-shadow: none !important;
                    }
                    .benefit-card-v2 h3 {
                        text-align: left !important;
                    }
                    .benefit-card-v2 p {
                        text-align: left !important;
                    }
                }
            `}</style>
        </section>
    );
}
