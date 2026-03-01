import heroImg from "figma:asset/444003e8df63e7da82e3d3e798edc374a8fdaf62.png";
import { ArrowRight, Flame, Phone, Star } from "lucide-react";

const stats = [
  { value: "12+",     label: "років досвіду" },
  { value: "1\u00a0000+", label: "клієнтів", highlight: true }, // \u00a0 = NBSP (typographic: prevents line-break in number)
  { value: "24\u00a0год", label: "доставка",  accent: true  }, // \u00a0 = NBSP
];

const imageBadges = [
  { emoji: "🔥", text: "Сухе паливо" },
  { emoji: "🚚", text: "Доставка по Києву сьогодні" },
  { emoji: "⭐", text: "1000+ клієнтів" },
];

export function HeroSection() {
  return (
    <section className="hero-section">
      {/* Ambient glow */}
      <div
        className="glow-orb hero-glow-r"
        style={{
          width: 600, height: 500,
          top: -80, right: -120,
          background: "radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)",
          filter: "none",
        }}
      />

      <div className="hero-inner">
        <div className="hero-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="hero-text fade-up">

            {/* Badge */}
            <div className="badge hero-badge fade-up">
              <Flame size={13} />
              ТОВ «Київ Брикет» · Київ та область
            </div>

            {/* Headline */}
            <h1 className="display hero-h1 fade-up fade-up-d1">
              Надійне тепло<br />
              для вашого дому
              {/* Decorative CSS divider — replaces the text symbol "—" */}
              <span className="hero-h1-divider" aria-hidden="true" />
              <span style={{ color: "var(--c-orange)" }}>
                без зайвих турбот
              </span>
            </h1>

            {/* Sub */}
            <p className="body hero-sub fade-up fade-up-d2">
              Дрова, паливні брикети та вугілля з швидкою доставкою по Києву та області.{" "}
              <span style={{ color: "var(--c-text)", opacity: 0.9 }}>
                12 років досвіду. Власний транспорт. Гарантія якості.
              </span>
            </p>

            {/* CTAs */}
            <div className="hero-ctas fade-up fade-up-d3">
              <a href="#contact" className="btn-primary hero-btn-main">
                Замовити зараз{" "}<ArrowRight size={16} />
              </a>
              <a
                href="tel:+380678832810"
                className="btn-ghost hero-btn-phone"
                style={{ border: "1px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.90)" }}
              >
                <Phone size={15} />{" "}Подзвонити
              </a>
            </div>

            {/* Urgency */}
            <p className="hero-urgency fade-up fade-up-d3">
              <span className="hero-dot" />
              Доставка по Києву можлива сьогодні
            </p>

            {/* Stats */}
            <div className="hero-stats fade-up fade-up-d4">
              {stats.map((s) => (
                <div key={s.label} className="hero-stat">
                  <p className="hero-stat-val" style={{
                    color: s.highlight ? "var(--c-orange)" : s.accent ? "rgba(255,255,255,0.92)" : "var(--c-text)",
                  }}>
                    {s.value}
                  </p>
                  <p className="hero-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN — LCP image ── */}
          <div className="hero-img-wrap">
            <img
              src={heroImg}
              alt="Паливні брикети КиєвБрикет"
              className="hero-img"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={600}
              height={750}
            />
            <div className="hero-img-overlay" />

            {/* Floating badges — desktop only, hidden on mobile */}
            <div className="hero-img-badges">
              {imageBadges.map((item) => (
                <div key={item.text} className="hero-img-badge">
                  <span style={{ fontSize: "0.8rem" }}>{item.emoji}</span>
                  <span className="hero-img-badge-text">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Trust pill */}
            <div className="hero-trust-pill">
              <div style={{ display: "flex", gap: 2 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={13} fill="var(--c-orange)" color="var(--c-orange)" />
                ))}
              </div>
              <span className="hero-trust-text">
                4.9 · 320+ відгуків
              </span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        /* ── Hero section base ───────────────────── */
        .hero-section {
          position: relative;
          overflow: hidden;
          background: var(--c-bg);
          padding-top: 84px;
          padding-bottom: 56px;
        }

        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* ── Two-column desktop grid ─────────────── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        /* ── Text column ─────────────────────────── */
        .hero-badge { margin-bottom: 24px; }
        .hero-h1    { margin-bottom: 20px; }
        .hero-sub   { max-width: 420px; margin-bottom: 32px; }

        /* ── Decorative divider ───────────────────────────────────────────
         * Block element, fixed width/height — replaces the text "—" symbol.
         * Gradient fades from orange to transparent (left → right).
         * ──────────────────────────────────────────────────────────────── */
        .hero-h1-divider {
          display: block;
          width: 48px;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--c-orange) 0%,
            rgba(249, 115, 22, 0.22) 100%
          );
          border-radius: 2px;
          margin: 14px 0 16px;
        }

        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .hero-urgency {
          font-size: 0.78rem;
          color: var(--c-orange);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hero-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--c-orange);
          display: inline-block;
          box-shadow: 0 0 6px var(--c-orange);
          flex-shrink: 0;
        }

        .hero-stats {
          display: flex;
          gap: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          flex-wrap: wrap;
        }
        .hero-stat-val {
          font-size: 1.875rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: var(--c-text2);
          margin-top: 4px;
        }

        /* ── Image column ────────────────────────── */
        .hero-img-wrap {
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          position: relative;
          box-shadow: 0 0 0 1px rgba(249,115,22,0.18), 0 40px 80px rgba(0,0,0,0.55);
          /* LCP: no fade-up animation — paint immediately */
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
        }
        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.86) saturate(1.05);
          display: block;
        }
        .hero-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            rgba(13,17,23,0.80) 0%,
            rgba(13,17,23,0.18) 55%,
            transparent 100%
          );
        }

        .hero-img-badges {
          position: absolute; top: 16px; left: 16px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .hero-img-badge {
          display: flex; align-items: center; gap: 7px;
          background: rgba(13,17,23,0.62);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 6px 12px;
          width: fit-content;
          opacity: 0.88;
        }
        .hero-img-badge-text {
          font-size: 0.78rem;
          color: var(--c-text);
          font-weight: 600;
          white-space: nowrap;
        }

        .hero-trust-pill {
          position: absolute; bottom: 20px; left: 20px;
          background: rgba(13,17,23,0.80);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px;
          padding: 12px 18px;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-trust-text {
          font-size: 0.8rem;
          color: var(--c-text);
          font-weight: 600;
        }

        /* ── Tablet (640–767px) ──────────────────── */
        @media (max-width: 767px) {
          .hero-section { padding-bottom: 48px; }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .hero-img-wrap {
            aspect-ratio: 16 / 9;
            border-radius: 16px;
            max-height: 320px;
          }
          .hero-glow-r { display: none; }
        }

        /* ── Mobile (<=479px) ────────────────────── */
        @media (max-width: 479px) {
          .hero-section {
            padding-top: 76px;
            padding-bottom: 40px;
          }
          .hero-inner { padding: 0 1rem; }

          .hero-badge { margin-bottom: 16px; font-size: 0.75rem; }

          .hero-h1 {
            margin-bottom: 16px;
            font-size: clamp(1.75rem, 8.5vw, 2.5rem);
            letter-spacing: -0.03em;
          }

          /* Divider compact on mobile */
          .hero-h1-divider {
            width: 36px;
            height: 2px;
            margin: 10px 0 12px;
          }

          .hero-sub { margin-bottom: 24px; max-width: 100%; }

          /* Buttons — full-width column on mobile */
          .hero-ctas {
            flex-direction: column;
            gap: 10px;
            margin-bottom: 12px;
          }
          .hero-btn-main,
          .hero-btn-phone {
            width: 100%;
            justify-content: center;
            padding: 16px 24px;
            border-radius: 12px;
          }

          .hero-urgency { margin-bottom: 24px; }

          /* Stats — compact */
          .hero-stats { gap: 20px; padding-top: 16px; }
          .hero-stat-val { font-size: 1.5rem; }

          /* Image — wide/short on mobile */
          .hero-img-wrap {
            aspect-ratio: 16 / 9;
            border-radius: 12px;
            max-height: 240px;
          }
          .hero-img-badges { display: none; }
          .hero-trust-pill { padding: 8px 12px; }
          .hero-trust-text { font-size: 0.72rem; }
        }
      `}</style>
    </section>
  );
}
