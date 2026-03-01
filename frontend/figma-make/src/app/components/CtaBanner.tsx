import { ArrowRight, Flame, Phone } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

const fireplaceImg = "https://images.unsplash.com/photo-1706636875248-e0d4fe6c121e?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwZmlyZXBsYWNlJTIwZGFyayUyMHJvb20lMjB3YXJtJTIwb3JhbmdlJTIwZmxhbWVzfGVufDF8fHx8MTc3MjIxNjE4NHww&ixlib=rb-4.1.0&q=80&w=1400";

export function CtaBanner() {
  const { ref, visible } = useReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "var(--s-section) 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* BG image */}
      <img
        src={fireplaceImg}
        alt="Тепло вдома"
        loading="lazy"
        decoding="async"
        width={1400}
        height={933}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover",
          filter: "brightness(0.22) saturate(0.75)",
          zIndex: 0,
        }}
      />

      {/* Radial glow — строго из центра */}
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

      {/* Content wrapper */}
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

          {/* Badge */}
          <div
            className="badge"
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

          {/* Heading */}
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

          {/* Subtext */}
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

          {/* Buttons */}
          <div className="cta-btns">
            <a
              href="#contact"
              className="btn-primary cta-btn-main"
              style={{ fontSize: "1rem", padding: "16px 40px" }}
            >
              Оформити замовлення <ArrowRight size={17} />
            </a>

            <a
              href="tel:+380678832810"
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

        </div>
      </div>
      <style>{`
        .cta-btns {
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
        .cta-btn-phone {
          font-size: 1rem;
          padding: 15px 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 14px;
          border: 2px solid rgba(249,115,22,0.55);
          color: #F97316;
          background: transparent;
          font-weight: 700;
          letter-spacing: -0.01em;
          box-shadow: 0 0 20px rgba(249,115,22,0.12);
          text-decoration: none;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.22s, color 0.22s;
          cursor: pointer;
          font-family: inherit;
        }
        .cta-btn-phone:hover {
          border-color: rgba(249,115,22,0.9);
          box-shadow: 0 0 32px rgba(249,115,22,0.28);
          background: rgba(249,115,22,0.08);
          color: #fff;
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
    </section>
  );
}