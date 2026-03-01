import "../styles/landing.css";
// ─────────────────────────────────────────────────────────────────────────────
// UTF-8 ENCODING REQUIREMENT
// All source files in this project MUST be saved as UTF-8 without BOM.
// The build environment (Vite + esbuild) handles Ukrainian Cyrillic (U+0400–U+04FF)
// correctly when files are UTF-8. Do NOT add \uXXXX escape sequences for
// Ukrainian text — write the characters directly (сьогодні, Загальні положення).
//
// Exception: \u00a0 (NBSP) is intentionally kept as an escape in the stats
// array inside HeroSection.tsx for typographic clarity (prevents line-breaks
// in formatted numbers like "1 000+"). All other \u escapes are forbidden.
//
// index.html: this project uses a virtual entrypoint (__figma__entrypoint__.ts).
// The Figma Make build system injects <meta charset="UTF-8"> automatically.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useInsertionEffect } from "react";

import { SiteHeader } from "./components/SiteHeader";
import { HeroSection } from "./components/HeroSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { CategoriesSection } from "./components/CategoriesSection";
import { TrustBlock } from "./components/TrustBlock";
import { DeliverySection } from "./components/DeliverySection";
import { ReviewsSection } from "./components/ReviewsSection";
import { CtaBanner } from "./components/CtaBanner";
import { ContactSection } from "./components/ContactSection";
import { SiteFooter } from "./components/SiteFooter";
import { Phone } from "lucide-react";

export default function App() {
  /* ── Critical CSS — injected synchronously before first paint ────────────
   * useInsertionEffect fires BEFORE DOM mutations, before useLayoutEffect.
   * This prevents white flash while the extracted CSS file loads.
   * Only the truly render-blocking styles belong here: bg color + font stack.
   * ──────────────────────────────────────────────────────────────────────── */
  useInsertionEffect(() => {
    const id = "kb-critical-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = [
      /* 1. Page background — prevents white flash on load */
      "html,body{background:#0D1117;color:#EDE8E0;margin:0;padding:0}",
      /* 2. Immediate font stack — fallback before Google Fonts swap */
      "body{font-family:Inter,'Inter-fallback',system-ui,-apple-system,sans-serif}",
      /* 3. Box-sizing baseline */
      "*,*::before,*::after{box-sizing:border-box}",
      /* 4. Core tokens available before landing.css parses */
      ":root{" +
        "--color-bg-main:#0D1117;" +
        "--color-bg-deep:#080C10;" +
        "--color-accent-primary:#F97316;" +
        "--color-text-primary:#EDE8E0;" +
        /* legacy aliases */
        "--c-bg:var(--color-bg-main);" +
        "--c-orange:var(--color-accent-primary);" +
        "--c-text:var(--color-text-primary)" +
        "}",
    ].join("");
    document.head.insertBefore(style, document.head.firstChild);
  }, []);

  /* ── Performance: inject font preconnect hints once ── */
  useEffect(() => {
    const hints: Array<{ href: string; crossOrigin?: string }> =
      [
        { href: "https://fonts.googleapis.com" },
        {
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
      ];
    hints.forEach(({ href, crossOrigin }) => {
      if (
        document.querySelector(
          `link[rel="preconnect"][href="${href}"]`,
        )
      )
        return;
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div
      style={{
        background: "var(--c-bg)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Page-level ambient: single radial glow anchored to top-center, fades across the full height */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(900px, 90vw)",
          height: 600,
          background: "var(--gradient-ambient)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <SiteHeader />

      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <BenefitsSection />
        <CategoriesSection />
        <TrustBlock />
        <DeliverySection />
        <ReviewsSection />
        <CtaBanner />
        <ContactSection />
      </main>

      <SiteFooter />

      {/* Mobile sticky CTA */}
      <div className="sticky-cta md:hidden">
        <a
          href="tel:+380678832810"
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            borderRadius: 14,
            padding: "17px 0",
            fontSize: "1rem",
            boxShadow: "0 8px 32px rgba(249,115,22,0.40)",
          }}
        >
          <Phone size={18} /> Подзвонити зараз
        </a>
      </div>
    </div>
  );
}