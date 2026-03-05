import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { h as usePageSEO, S as SEOHead, O as OrderFormModal, u as useReveal, s as shopConfig, f as usePhoneInput, b as api } from "../entry-server.js";
import { ChevronRight, Phone, ArrowRight, CheckCircle2, Loader2, MapPin, Clock, Flame, Box } from "lucide-react";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
function HeroContacts({ onOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(15px, 3vw, 104px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "40px" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "glow-orb",
        style: {
          width: 700,
          height: 600,
          top: -100,
          right: "-10%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }, children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: `reveal ${visible ? "visible" : ""}`, style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 6,
        marginBottom: "1rem",
        fontSize: "0.8125rem",
        color: "rgba(255,255,255,0.4)",
        width: "100%"
      }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }, children: "Головна" }),
        /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Контакти" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "2.5rem 3rem 2rem 3rem",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsx("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2.5rem, 6vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.5rem", color: "#fff" }, children: "Контакти" }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "18px",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "700px",
          marginBottom: "2rem",
          fontWeight: 400
        }, children: "Замовити дрова, паливні брикети або вугілля з доставкою по Києву та області." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "2rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
              className: "btn-glow",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--c-orange)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.3s ease"
              },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 20 }),
                "Подзвонити"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onOrderClick,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              },
              children: [
                "Замовити доставку",
                /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-benefits fade-up fade-up-d4", style: {
          display: "flex",
          gap: "clamp(0.35rem, 1.5vw, 2rem)",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "clamp(12px, 3vw, 16px)",
          width: "100%",
          fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
          color: "rgba(255,255,255,0.7)"
        }, children: [
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " швидка доставка"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " чесний складометр"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " оплата після отримання"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function ContactSectionCombined() {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState({ name: "" });
  const { phoneProps, rawPhone, resetPhone } = usePhoneInput();
  const [status, setStatus] = useState("idle");
  const cards = [
    {
      title: "Телефон",
      desc: shopConfig.contact.phone,
      icon: /* @__PURE__ */ jsx(Phone, { size: 24, color: "var(--c-orange)" }),
      action: /* @__PURE__ */ jsx("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, style: { color: "var(--c-orange)", fontWeight: 600, textDecoration: "none", fontSize: "0.9rem", marginTop: "auto" }, children: "Подзвонити →" })
    },
    {
      title: "Графік роботи",
      desc: "Щодня\n09:00 – 20:00",
      icon: /* @__PURE__ */ jsx(Clock, { size: 24, color: "var(--c-orange)" }),
      action: /* @__PURE__ */ jsxs("span", { style: { color: "var(--color-success)", fontWeight: 600, fontSize: "0.9rem", marginTop: "auto", display: "flex", alignItems: "center", gap: 6 }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: "10px" }, children: "●" }),
        " Завжди на зв'язку"
      ] })
    },
    {
      title: "Локація",
      desc: "м. Київ\nвул. Колекторна, 19",
      icon: /* @__PURE__ */ jsx(MapPin, { size: 24, color: "var(--c-orange)" }),
      action: null
    }
  ];
  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/orders/quick", {
        customer_name: form.name,
        customer_phone: rawPhone
      });
      setStatus("success");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("success");
    }
  };
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "60px 0 40px" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("style", { children: `
                    .contact-split-grid {
                        display: grid;
                        grid-template-columns: 1fr 1.1fr;
                        gap: 2rem;
                        align-items: stretch;
                    }
                    .contact-cards-inner {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    @media (max-width: 900px) {
                        .contact-split-grid { grid-template-columns: 1fr; }
                        .contact-cards-inner { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
                    }
                ` }),
    /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""} contact-split-grid`, children: [
      /* @__PURE__ */ jsx("div", { className: "contact-cards-inner", children: cards.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "nh-card hover-glow", style: { padding: "2rem", display: "flex", flexDirection: "column", alignItems: "flex-start", height: "100%", borderRadius: "16px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "rgba(249,115,22,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(249,115,22,0.2)",
            flexShrink: 0
          }, children: c.icon }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "0.9rem", fontWeight: 600, color: "var(--c-text2)", marginBottom: "0.2rem" }, children: c.title }),
            /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text)", fontWeight: 700, margin: 0, fontSize: "1.15rem", whiteSpace: "pre-line" }, children: c.desc })
          ] })
        ] }),
        c.action
      ] }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "nh-card", style: {
        padding: "3rem 2.5rem",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(20,25,30,0.8) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        height: "100%"
      }, children: status === "success" ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 60, height: 60, background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }, children: /* @__PURE__ */ jsx(CheckCircle2, { size: 26, color: "var(--color-success)" }) }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10 }, children: "Заявку прийнято!" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "1rem", color: "var(--c-text2)", marginBottom: 24 }, children: "Ми вже отримали ваш контакт і передзвонимо вам найближчим часом." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setStatus("idle");
              setForm({ name: "" });
              resetPhone();
            },
            style: { background: "none", border: "none", color: "var(--c-orange)", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" },
            children: "Нова заявка →"
          }
        )
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, style: { display: "flex", flexDirection: "column", gap: "1.25rem" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "h2", style: { fontSize: "1.75rem", marginBottom: 8 }, children: "Швидке замовлення" }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)" }, children: "Залиште свій номер і ми передзвонимо за 15 хвилин." })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text2)" }, children: "Ім'я" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Ваше ім'я",
              value: form.name,
              onChange: setField("name"),
              required: true,
              style: {
                background: "var(--c-surface2)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12,
                padding: "14px 16px",
                color: "var(--c-text)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "inherit"
              },
              onFocus: (e) => e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)",
              onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text2)" }, children: "Телефон" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ...phoneProps,
              required: true,
              style: {
                background: "var(--c-surface2)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12,
                padding: "14px 16px",
                color: "var(--c-text)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "inherit"
              },
              onFocus: (e) => {
                phoneProps.onFocus(e);
                e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)";
              },
              onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "nh-btn-primary",
            disabled: status === "loading",
            style: { justifyContent: "center", marginTop: 12, width: "100%", padding: "18px 24px", fontSize: "1rem" },
            children: status === "loading" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin" }),
              " Обробка..."
            ] }) : "Замовити дзвінок"
          }
        )
      ] }) })
    ] })
  ] }) });
}
const OBLAST_PATH = "M 78,44 L 108,18 L 152,6 L 200,10 L 250,6 L 300,22 L 348,52 L 376,94 L 380,140 L 365,182 L 334,220 L 292,248 L 248,260 L 200,262 L 152,260 L 108,248 L 68,220 L 38,180 L 22,138 L 26,92 Z";
const SAT_PINS = [
  { label: "Бровари", cx: 272, cy: 100, beginAnim: "0s" },
  { label: "Ірпінь", cx: 104, cy: 116, beginAnim: "1.1s" },
  { label: "Бориспіль", cx: 298, cy: 192, beginAnim: "0.5s" },
  { label: "Вишневе", cx: 118, cy: 196, beginAnim: "1.7s" }
];
function ContactMap() {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsx("div", { className: `nh-card reveal ${visible ? "visible" : ""}`, style: { padding: "0", borderRadius: "24px", overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.08)" }, children: /* @__PURE__ */ jsxs("div", { style: {
    width: "100%",
    height: "450px",
    background: "#080f0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }, children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 400 300", preserveAspectRatio: "xMidYMid slice", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", height: "100%", display: "block", opacity: 0.6 }, children: [
      /* @__PURE__ */ jsxs("defs", { children: [
        /* @__PURE__ */ jsxs("filter", { id: "kb-pin-glow", x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
          /* @__PURE__ */ jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "4", result: "blur" }),
          /* @__PURE__ */ jsxs("feMerge", { children: [
            /* @__PURE__ */ jsx("feMergeNode", { in: "blur" }),
            /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("radialGradient", { id: "kb-glow", cx: "50%", cy: "50%", r: "50%", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#F97316", stopOpacity: "0.45" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#F97316", stopOpacity: "0" })
        ] })
      ] }),
      [50, 100, 150, 200, 250].map((y) => /* @__PURE__ */ jsx("line", { x1: "0", y1: y, x2: "400", y2: y, stroke: "rgba(255,255,255,0.02)", strokeWidth: "1" }, `h${y}`)),
      [57, 114, 171, 228, 285, 342].map((x) => /* @__PURE__ */ jsx("line", { x1: x, y1: "0", x2: x, y2: "300", stroke: "rgba(255,255,255,0.02)", strokeWidth: "1" }, `v${x}`)),
      /* @__PURE__ */ jsx("path", { d: OBLAST_PATH, fill: "rgba(249,115,22,0.04)", stroke: "rgba(249,115,22,0.3)", strokeWidth: "1", strokeDasharray: "5 4", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "200", cy: "158", rx: "76", ry: "60", fill: "none", stroke: "rgba(249,115,22,0.2)", strokeWidth: "1", strokeDasharray: "4 5" }),
      [0, 0.73, 1.46].map((begin, i) => /* @__PURE__ */ jsxs("circle", { cx: "200", cy: "158", r: "22", fill: "none", stroke: "rgba(249,115,22,0.5)", strokeWidth: "1.5", children: [
        /* @__PURE__ */ jsx("animate", { attributeName: "r", from: "22", to: "50", dur: "2.2s", repeatCount: "indefinite", begin: `${begin}s` }),
        /* @__PURE__ */ jsx("animate", { attributeName: "opacity", from: "0.55", to: "0", dur: "2.2s", repeatCount: "indefinite", begin: `${begin}s` })
      ] }, i)),
      /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: 55, fill: "url(#kb-glow)" }),
      SAT_PINS.map((pin) => /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("circle", { cx: pin.cx, cy: pin.cy, r: "9", fill: "rgba(249,115,22,0.12)" }),
        /* @__PURE__ */ jsx("circle", { cx: pin.cx, cy: pin.cy, r: "4.5", fill: "#F97316", opacity: "0.6", filter: "url(#kb-pin-glow)", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.4;0.9;0.4", dur: "3.5s", repeatCount: "indefinite", begin: pin.beginAnim }) })
      ] }, pin.label)),
      /* @__PURE__ */ jsxs("g", { filter: "url(#kb-pin-glow)", children: [
        /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: "11", fill: "#F97316" }),
        /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: "5", fill: "#fff" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: { position: "relative", zIndex: 2, padding: "3rem", width: "100%", height: "100%", display: "flex", alignItems: "center", background: "linear-gradient(to right, rgba(10,13,20,0.95) 0%, rgba(10,13,20,0.7) 40%, rgba(10,13,20,0) 100%)" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 450 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--c-orange)", marginBottom: "1rem", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }, children: [
        /* @__PURE__ */ jsx(MapPin, { size: 16 }),
        " Зона покриття"
      ] }),
      /* @__PURE__ */ jsxs("h3", { className: "h3", style: { fontSize: "2.25rem", marginBottom: "1.25rem", lineHeight: 1.2 }, children: [
        "Безперебійна доставка по ",
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "всьому Києву" }),
        " та ",
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "області" })
      ] }),
      /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2rem" }, children: "Наш автопарк та оптимізована логістика дозволяють швидко та вчасно доставляти замовлення. Київ: день в день. Область: 24-48 годин." }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "1rem", flexWrap: "wrap" }, children: /* @__PURE__ */ jsx(Link, { to: "/dostavka", className: "nh-btn-primary", style: { padding: "12px 24px", fontSize: "0.95rem", borderRadius: "10px", textDecoration: "none" }, children: "Детальніше про доставку" }) })
    ] }) })
  ] }) }) }) });
}
function WhatWeDeliver() {
  const { ref, visible } = useReveal();
  const sections = [
    { name: "Дрова", icon: /* @__PURE__ */ jsx(Flame, { size: 24 }), link: "/catalog/drova" },
    { name: "Паливні брикети", icon: /* @__PURE__ */ jsx(Box, { size: 24 }), link: "/catalog/brikety" },
    { name: "Вугілля", icon: /* @__PURE__ */ jsx(Box, { size: 24 }), link: "/catalog/vugillya" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "2.5rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2", style: { fontSize: "1.75rem" }, children: "Що ми доставляємо" }) }),
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", transitionDelay: "0.1s" }, children: sections.map((item, i) => /* @__PURE__ */ jsxs(Link, { to: item.link, className: "nh-card hover-glow", style: { padding: "2rem", display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }, children: [
      /* @__PURE__ */ jsx("div", { style: { background: "rgba(249,115,22,0.1)", color: "var(--c-orange)", padding: "12px", borderRadius: "12px" }, children: item.icon }),
      /* @__PURE__ */ jsx("span", { style: { fontSize: "1.25rem", fontWeight: 600, color: "var(--c-text)", flex: 1 }, children: item.name }),
      /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-text2)" })
    ] }, i)) })
  ] }) });
}
function ContactsSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 8vw, 80px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити дрова, брикети та вугілля у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Компанія «КиївБрикет» забезпечує безперебійне постачання твердого палива. Ми спеціалізуємось на ",
          /* @__PURE__ */ jsx("strong", { children: "продажу дров" }),
          ", а також сучасних еко-альтернатив. Ви можете ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "купити дрова київ" }),
          " з безкоштовним розвантаженням та чесним складометром. В наявності дуб, граб, береза та сосна."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Для власників твердопаливних котлів ми пропонуємо зручне паливо з високою тепловіддачею – ",
          /* @__PURE__ */ jsx("strong", { children: "продаж брикетів" }),
          " типів RUF, Pini Kay та Nestro. Звертайтесь, щоб замовити ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "брикети київ" }),
          " і забезпечити стабільний жар у вашій оселі."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Також ми здійснюємо ",
          /* @__PURE__ */ jsx("strong", { children: "продаж вугілля" }),
          ". Якісне ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "вугілля київ" }),
          " (антрацит та довгополум'яне) фасується в зручні мішки по 50 кг з доставкою прямо до вашого двору. Обирайте надійного постачальника з багаторічним досвідом та власним автопарком."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Незалежно від того, яке паливо ви обрали, ми гарантуємо відсутність прихованих платежів, швидку обробку заявок та можливість оплати безпосередньо після передачі товару на вашій ділянці." })
      ] })
    ] })
  ] }) }) });
}
function FaqSection() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Як замовити дрова?", a: "Ви можете оформити замовлення трьома способами: зателефонувати нам, заповнити форму зворотного зв'язку на цій сторінці або натиснути кнопку 'Замовити' на сторінці конкретного товару." },
    { q: "Чи можна замовити доставку сьогодні?", a: "Так, за умови оформлення заявки в першій половині дня та наявності вільних машин, доставка по Києву здійснюється 'день у день'." },
    { q: "Які способи оплати доступні?", a: "Ми приймаємо оплату готівкою при отриманні товару (після розвантаження та перевірки об'єму), а також можливий безготівковий розрахунок за потребою." },
    { q: "Чи працюєте по Київській області?", a: "Так, ми здійснюємо доставку по всьому Києву та всій Київській області (Бровари, Бориспіль, Ірпінь, Буча, Фастів тощо). Вартість доставки в область розраховується індивідуально." }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, style: { padding: "clamp(40px, 8vw, 80px) 0" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      })
    } }),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2", style: { maxWidth: 800, margin: "0 auto" }, children: "Поширені запитання" }) }),
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s" }, children: faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return /* @__PURE__ */ jsxs("div", { style: { borderBottom: "1px solid var(--color-border-subtle)", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpenIdx(isOpen ? -1 : idx),
              style: {
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "1.5rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                color: "var(--c-text)",
                fontFamily: "inherit",
                fontSize: "1.125rem",
                fontWeight: 600
              },
              children: [
                faq.q,
                /* @__PURE__ */ jsx(
                  ChevronRight,
                  {
                    size: 20,
                    style: {
                      color: "var(--c-orange)",
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.3s ease"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.4s ease", color: "var(--c-text2)", lineHeight: 1.6 }, children: /* @__PURE__ */ jsx("p", { style: { paddingBottom: "1.5rem", margin: 0 }, children: faq.a }) })
        ] }, idx);
      }) })
    ] })
  ] });
}
function FinalCtaBanner({ onOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `nh-card reveal ${visible ? "visible" : ""}`,
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)",
        textAlign: "center",
        background: "linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)",
        border: "1px solid rgba(249,115,22,0.2)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs("h2", { className: "h2", style: { fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "1rem" }, children: [
            "Зателефонуйте нам ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "прямо зараз" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Ми готові прийняти ваше замовлення та доставити якісне паливо без передоплат." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem", textDecoration: "none" }, children: [
              /* @__PURE__ */ jsx(Phone, { size: 18, style: { marginRight: 8 } }),
              " Подзвонити"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: onOrderClick, className: "nh-btn-ghost", style: { padding: "16px 32px", fontSize: "1rem", border: "1px solid var(--color-border-medium)", cursor: "pointer" }, children: "Замовити доставку" })
          ] })
        ] })
      ]
    }
  ) }) });
}
function Contacts() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const { pageData } = usePageSEO("/contacts");
  const title = pageData?.meta_title || "Контакти КиївБрикет | Замовити дрова, брикети, вугілля";
  const description = pageData?.meta_description || "Контактна інформація КиївБрикет. Телефони, графік роботи, адреса. Замовляйте дрова, паливні брикети та вугілля з доставкою по Києву та області.";
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", style: {
    minHeight: "100vh",
    background: "var(--c-bg)",
    color: "var(--c-text)",
    fontFamily: "var(--font-outfit)",
    paddingTop: "64px"
  }, children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title,
        description,
        canonical: `https://kievbriket.com/kontakty`
      }
    ),
    /* @__PURE__ */ jsx(HeroContacts, { onOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(ContactSectionCombined, {}),
    /* @__PURE__ */ jsx(ContactMap, {}),
    /* @__PURE__ */ jsx(WhatWeDeliver, {}),
    /* @__PURE__ */ jsx(ContactsSeoBlock, {}),
    /* @__PURE__ */ jsx(FaqSection, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner, { onOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(
      OrderFormModal,
      {
        isOpen: isOrderFormOpen,
        onClose: () => setIsOrderFormOpen(false)
      }
    )
  ] });
}
export {
  Contacts as default
};
//# sourceMappingURL=Contacts-DMMqQWzS.js.map
