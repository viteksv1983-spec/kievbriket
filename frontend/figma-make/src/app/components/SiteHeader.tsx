import { useState, useEffect } from "react";
import { Menu, X, Phone, Flame } from "lucide-react";

const links = [
  { label: "Дрова", href: "#drova" },
  { label: "Брикети", href: "#brykety" },
  { label: "Вугілля", href: "#vuhillia" },
  { label: "Доставка", href: "#delivery" },
  { label: "Контакти", href: "#contact" },
];

const NAV_CSS = `
  .nav-link {
    position: relative;
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 500;
    padding-bottom: 4px;
    transition: color 0.18s;
    color: rgba(255,255,255,0.85);
  }
  .nav-link:hover {
    color: #F97316 !important;
  }
  .nav-link.active {
    color: #F97316 !important;
  }
  .nav-link .underline-bar {
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 2px;
    background: #F97316;
    opacity: 0;
    transition: opacity 0.18s;
  }
  .nav-link.active .underline-bar {
    opacity: 1;
  }
  .nav-phone {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #ffffff;
    font-size: 0.875rem;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.18s;
  }
  .nav-phone:hover {
    color: #F97316 !important;
  }
`;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{NAV_CSS}</style>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
          background: scrolled ? "var(--color-bg-overlay)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-border-subtle)" : "1px solid transparent",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <span style={{
              width: 38, height: 38,
              borderRadius: "50%",
              background: "var(--gradient-accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 14px var(--color-accent-glow)",
              flexShrink: 0,
            }}>
              <Flame size={18} color="#fff" strokeWidth={2.2} />
            </span>
            <span style={{ lineHeight: 1 }}>
              <span style={{ display: "block", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em" }}>
                <span style={{ color: "#ffffff" }}>Київ</span><span style={{ color: "#F97316" }}>Брикет</span>
              </span>
              <span style={{ display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", marginTop: 1 }}>
                ТОВ «Київ Брикет»
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setActiveHref(l.href)}
                className={`nav-link${activeHref === l.href ? " active" : ""}`}
              >
                {l.label}
                <span className="underline-bar" />
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 20 }}>
            <a href="tel:+380678832810" className="nav-phone">
              <Phone size={14} color="#F97316" />
              +38 067 883 28 10
            </a>
            <a href="#contact" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.875rem" }}>
              Замовити
            </a>
          </div>

          {/* Burger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", color: "var(--c-text)", cursor: "pointer", padding: 4 }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{
            background: "var(--color-bg-overlay-full)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "1.25rem 1.25rem 1.5rem",
            display: "flex", flexDirection: "column", gap: 0,
          }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "block",
                }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href="tel:+380678832810"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  color: "#ffffff", textDecoration: "none",
                  fontSize: "0.9rem", fontWeight: 600,
                  padding: "12px 0",
                }}
              >
                <Phone size={14} color="#F97316" /> +38 067 883 28 10
              </a>
              <a
                href="#contact"
                className="btn-primary"
                style={{ textAlign: "center", justifyContent: "center", borderRadius: 12, padding: "15px 0", width: "100%" }}
                onClick={() => setOpen(false)}
              >
                Замовити
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}