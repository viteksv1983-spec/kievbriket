import { CheckCircle2 } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

const deliveryImg = "https://images.unsplash.com/photo-1605530096090-a4d31cd82288?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJld29vZCUyMGRlbGl2ZXJ5JTIwdHJ1Y2slMjB1bmxvYWRpbmclMjBsb2dzfGVufDF8fHx8MTc3MjIxOTk3NHww&ixlib=rb-4.1.0&q=80&w=1080";

const points = [
  "Власний автопарк — без затримок",
  "Сертифіковане паливо",
  "1000+ постійних клієнтів",
  "Офіційна діяльність, повний пакет документів",
];

export function TrustBlock() {
  const { ref, visible } = useReveal();

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      style={{ padding: "var(--s-section) 0", background: "var(--c-green-s)", position: "relative", overflow: "hidden" }}
    >
      {/* Gradient bridge — blends from green-bg into green-s */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 80,
        background: "var(--gradient-section-fade)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      {/* Subtle orange top line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "var(--gradient-orange-line)", zIndex: 1 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="trust-grid">

          {/* Image */}
          <div
            className={`reveal ${visible ? "visible" : ""}`}
            style={{ borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}
          >
            <img
              src={deliveryImg}
              alt="Доставка твердого палива"
              loading="lazy"
              decoding="async"
              width={720}
              height={540}
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", filter: "brightness(0.80) saturate(1.15) contrast(1.05)" }}
            />
            {/* Warm overlay for depth */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,17,23,0.55) 0%, transparent 50%)", pointerEvents: "none" }} />
            {/* Floating badge */}
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

            <a href="#contact" className="btn-primary">
              Замовити з доставкою
            </a>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 840px) { .trust-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
        @media (max-width: 479px) {
          .trust-grid { gap: 1.5rem !important; }
          /* Image first → text second on mobile already works (DOM order) */
        }
      `}</style>
    </section>
  );
}