import React from "react";
import { Clock, Truck, Scale, Leaf, CreditCard, ShieldCheck } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const items = [
    { icon: <Clock size={26} />, title: "12+ років на ринку", desc: "12 років стабільної роботи без затримок, скандалів та невиконаних зобовʼязань." },
    { icon: <Truck size={26} />, title: "Власний транспорт", desc: "Власний автопарк — доставляємо без посередників та затримок." },
    { icon: <Clock size={26} />, title: "Доставка за 24 години", desc: "Доставка за 24 години. У межах Києва — в день замовлення.", hero: true },
    { icon: <Scale size={26} />, title: "Чесна вага та обʼєм", desc: "Зважуємо та міряємо при вас. Жодного недоважування." },
    { icon: <Leaf size={26} />, title: "Сухе якісне паливо", desc: "Вологість дров до 20%. Брикети — лише сертифікована сировина без домішок." },
    { icon: <CreditCard size={26} />, title: "Оплата при отриманні", desc: "Ніяких передоплат. Перевіряєте — платите. Просто і чесно." },
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
                            className={`nh-card benefit-card${item.hero ? " benefit-hero" : ""} reveal ${visible ? "visible" : ""}`}
                            style={{
                                padding: "1.75rem",
                                transitionDelay: `${i * 0.08}s`,
                            }}
                        >
                            <div style={{
                                width: 48, height: 48,
                                borderRadius: 12,
                                background: item.hero ? "rgba(249,115,22,0.18)" : "rgba(249,115,22,0.10)",
                                border: item.hero ? "1px solid rgba(249,115,22,0.45)" : "1px solid rgba(249,115,22,0.18)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "var(--c-orange)",
                                marginBottom: "var(--s-element)",
                                boxShadow: item.hero ? "0 0 18px rgba(249,115,22,0.25)" : "none",
                                transition: "background 0.22s, box-shadow 0.22s",
                                flexShrink: 0,
                            }}>
                                {item.icon}
                            </div>
                            <h3 className="h3" style={{ marginBottom: 8 }}>{item.title}</h3>
                            <p className="body-sm">{item.desc}</p>
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
        .benefit-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease !important;
        }
        .benefit-hero {
          border: 1px solid rgba(249,115,22,0.30) !important;
          box-shadow: 0 0 0 1px rgba(249,115,22,0.14), 0 0 28px rgba(249,115,22,0.12), inset 0 0 40px rgba(249,115,22,0.04) !important;
        }
        .benefit-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(249,115,22,0.18), 0 2px 10px rgba(0,0,0,0.35) !important;
        }
        .benefit-hero:hover {
          box-shadow: 0 12px 44px rgba(249,115,22,0.28), 0 2px 10px rgba(0,0,0,0.35) !important;
        }
      `}</style>
        </section>
    );
}
