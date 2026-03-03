import React from 'react';
import { ArrowRight, Flame, Phone, Star } from 'lucide-react';
import shopConfig from '../../shop.config';

const stats = [
  { value: "12+", label: "років досвіду" },
  { value: "1\u00a0000+", label: "клієнтів", highlight: true },
  { value: "24\u00a0год", label: "доставка", accent: true },
];

const imageBadges = [
  { emoji: "🔥", text: "Сухе паливо" },
  { emoji: "🚚", text: "Доставка по Києву сьогодні" },
  { emoji: "⭐", text: "1000+ клієнтів" },
];

export function HeroSection({ onQuickOrderClick }) {
  return (
    <section className="hero-section">
      <div
        className="glow-orb hero-glow-r"
        style={{
          width: 600, height: 500,
          top: -80, right: -120,
          background: "radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)",
          filter: "none",
        }}
      />

      <div className="layout-container" style={{ zIndex: 1 }}>
        <div className="hero-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="hero-text fade-up">

            {/* Badge */}
            <div className="nh-badge hero-badge fade-up">
              <Flame size={13} />
              ТОВ «Київ Брикет» · Київ та область
            </div>

            {/* Headline */}
            <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}>
              Надійне тверде паливо<br />
              з доставкою по Києву
              <span className="hero-h1-divider" aria-hidden="true" />
              <span style={{ color: "var(--c-orange)" }}>
                та області
              </span>
            </h1>

            {/* Sub */}
            <p className="body hero-sub fade-up fade-up-d2">
              Дрова, паливні брикети та вугілля для опалення будинку, котлів і камінів.{" "}
              <span style={{ color: "var(--c-text)", opacity: 0.9 }}>
                {stats[0].value} років досвіду. Власний транспорт. Гарантія якості.
              </span>
            </p>

            {/* CTAs */}
            <div className="hero-ctas fade-up fade-up-d3">
              <button onClick={onQuickOrderClick} className="nh-btn-primary hero-btn-main">
                Замовити зараз{" "}<ArrowRight size={16} />
              </button>
              <a
                href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="nh-btn-ghost hero-btn-phone"
                style={{ border: "1px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.90)" }}
              >
                <Phone size={15} />{" "}Подзвонити
              </a>
            </div>

            {/* Trust indicators */}
            <div className="hero-trust-row fade-up fade-up-d3">
              <span className="hero-trust-item"><span className="hero-trust-check">✔</span>Доставка сьогодні</span>
              <span className="hero-trust-sep" />
              <span className="hero-trust-item"><span className="hero-trust-check">✔</span>Оплата після отримання</span>
              <span className="hero-trust-sep" />
              <span className="hero-trust-item"><span className="hero-trust-check">✔</span>Чесний складометр</span>
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
              src="/images/hero-bg.webp"
              alt="Дрова, брикети та вугілля КиївБрикет"
              title="Купити тверде паливо у Києві"
              className="hero-img"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              width="600"
              height="750"
            />
            <div className="hero-img-overlay" />

            <div className="hero-img-badges">
              {imageBadges.map((item) => (
                <div key={item.text} className="hero-img-badge">
                  <span style={{ fontSize: "0.8rem" }}>{item.emoji}</span>
                  <span className="hero-img-badge-text">{item.text}</span>
                </div>
              ))}
            </div>

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
          margin-bottom: 14px;
        }

        /* Trust indicators row */
        .hero-trust-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px 16px;
          margin-bottom: 16px;
        }
        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.775rem;
          color: rgba(255,255,255,0.55);
          font-weight: 500;
          white-space: nowrap;
        }
        .hero-trust-check {
          color: var(--c-orange);
          font-size: 0.7rem;
        }
        .hero-trust-sep {
          width: 1px;
          height: 12px;
          background: rgba(255,255,255,0.15);
          display: block;
          flex-shrink: 0;
        }
        @media (max-width: 479px) {
          .hero-trust-sep { display: none; }
          .hero-trust-row { gap: 6px 12px; }
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
          border-radius: 22px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          position: relative;
          /* Multi-layer premium shadow system */
          box-shadow:
            0 0 0 1px rgba(249,115,22,0.15),
            0 0 0 2px rgba(255,255,255,0.04),
            0 8px 24px rgba(0,0,0,0.35),
            0 32px 64px rgba(0,0,0,0.45),
            0 0 80px rgba(249,115,22,0.08);
          /* LCP: no fade-up animation — paint immediately */
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
        }
        /* Subtle top-edge shine */
        .hero-img-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.12) 30%,
            rgba(255,255,255,0.18) 50%,
            rgba(255,255,255,0.12) 70%,
            transparent 100%
          );
          z-index: 4;
        }
        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.88) saturate(1.08) contrast(1.04);
          display: block;
        }
        .hero-img-overlay {
          position: absolute; inset: 0;
          background:
            radial-gradient(
              ellipse 80% 50% at 50% 80%,
              rgba(249,115,22,0.06) 0%,
              transparent 60%
            ),
            linear-gradient(
              to top,
              rgba(8,12,16,0.85) 0%,
              rgba(13,17,23,0.30) 45%,
              rgba(13,17,23,0.08) 65%,
              transparent 100%
            );
        }

        .hero-img-badges {
          position: absolute; top: 18px; left: 18px;
          display: flex; flex-direction: column; gap: 8px;
          z-index: 3;
        }
        .hero-img-badge {
          display: flex; align-items: center; gap: 8px;
          background: rgba(8,12,16,0.72);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-left: 2px solid rgba(249,115,22,0.40);
          border-radius: 10px;
          padding: 8px 14px;
          width: fit-content;
          transition: border-left-color 0.25s ease, background 0.25s ease;
        }
        .hero-img-badge:hover {
          border-left-color: rgba(249,115,22,0.75);
          background: rgba(8,12,16,0.80);
        }
        .hero-img-badge-text {
          font-size: 0.78rem;
          color: rgba(241,245,249,0.92);
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .hero-trust-pill {
          position: absolute; bottom: 22px; left: 22px;
          background: rgba(8,12,16,0.78);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 14px 20px;
          display: flex; align-items: center; gap: 10px;
          box-shadow:
            0 8px 24px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.05);
          z-index: 3;
        }
        .hero-trust-text {
          font-size: 0.82rem;
          color: rgba(241,245,249,0.92);
          font-weight: 600;
          letter-spacing: 0.01em;
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
