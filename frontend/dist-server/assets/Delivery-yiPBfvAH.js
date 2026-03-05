import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { h as usePageSEO, S as SEOHead, s as shopConfig, D as DeliverySection, F as FuelCalculatorSection, B as BenefitsSection, O as OrderFormModal, u as useReveal } from "../entry-server.js";
import { ChevronRight, ArrowRight, Phone, Truck, Package, CheckCircle2 } from "lucide-react";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
function HeroDelivery({ onOrderClick }) {
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
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Доставка" })
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
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2.5rem, 6vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.5rem", color: "#fff" }, children: [
          "Доставка дров, брикетів та вугілля ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "по Києву та області" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "18px",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "700px",
          marginBottom: "2rem",
          fontWeight: 400
        }, children: "Доставка власним транспортом: Газель, ЗІЛ, КАМАЗ, маніпулятор. Швидко, надійно, із розвантаженням." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "2rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onOrderClick,
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
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              },
              children: [
                "Замовити доставку",
                /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
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
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 20 }),
                "Подзвонити"
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
            " доставка сьогодні"
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
function DeliverySeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Доставка дров, брикетів та вугілля у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Ми доставляємо ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дрова" }),
          ", ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "паливні брикети" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "кам'яне вугілля" }),
          " по всьому Києву та області надійним транспортом. Обираючи доставку від постачальника, ви отримуєте гарантію точної ваги та прозорих цін без прихованих платежів за вивантаження."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ jsx("strong", { children: "Доставка дров" }),
          " відбувається автотранспортом від ЗІЛу до Камазу залежно від обсягу. Всі дрова щільно вкладаються в кузові, щоб ви могли перевірити чесність складометра власноруч до моменту вивантаження товарів."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          /* @__PURE__ */ jsx("strong", { children: "Доставка брикетів" }),
          " та ",
          /* @__PURE__ */ jsx("strong", { children: "доставка вугілля" }),
          " виконується акуратно у заводському упакуванні: мішках або на піддонах (палетах). Це забезпечує чистоту на вашому подвір'ї та максимальну зручність при подальшому зберіганні матеріалу."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Наш транспорт обладнаний зручними бортами для швидкого і легкого вивантаження. Наші водії завжди на зв’язку, готові під’їхати у зручний для вас час та надати якісний сервіс без затримок." })
      ] })
    ] })
  ] }) }) });
}
function PopularQueriesSection() {
  const { ref, visible } = useReveal();
  const queries = [
    { name: "доставка дров київ", url: "/dostavka" },
    { name: "доставка брикетів", url: "/catalog/brikety" },
    { name: "доставка вугілля", url: "/catalog/vugillya" },
    { name: "купити дрова доставка", url: "/catalog/drova" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)", background: "rgba(20,25,30,0.3)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "600" }, children: "Популярні запити:" }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }, children: queries.map((q, idx) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: q.url,
        style: {
          display: "inline-flex",
          alignItems: "center",
          padding: "0.75rem 1.25rem",
          borderRadius: "100px",
          border: "1px solid var(--color-border-subtle)",
          color: "var(--c-text2)",
          textDecoration: "none",
          fontSize: "0.95rem",
          transition: "all 0.2s",
          background: "var(--color-bg-elevated)",
          gap: "0.5rem"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.borderColor = "var(--c-orange)";
          e.currentTarget.style.color = "var(--c-text)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          e.currentTarget.style.color = "var(--c-text2)";
        },
        children: [
          /* @__PURE__ */ jsx(Truck, { size: 14, style: { opacity: 0.5 } }),
          q.name
        ]
      },
      idx
    )) })
  ] }) }) });
}
function FaqSection() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Скільки коштує доставка дров?", a: "ГАЗель (бус) — 1 500 грн (4–5 складометрів), ЗІЛ самоскид — 3 000 грн (4 складометри), КАМАЗ самоскид — 4 000 грн (8 складометрів). Доставка брикетів — 700 грн/тонна по Києву." },
    { q: "Як швидко привозите замовлення?", a: "За умови наявності замовленого товару та вільних машин, ми доставляємо протягом дня. Для передмістя доставка можлива протягом 1-2 днів." },
    { q: "Чи можна замовити доставку сьогодні?", a: "Так! Якщо ви оформите замовлення в першій половині дня, ми зможемо організувати відвантаження у той самий день." },
    { q: "Який мінімальний об'єм замовлення?", a: "Для дров мінімальне замовлення зазвичай становить 1 складометр. Брикети та вугілля постачаються від 1 тонни або мішками (уточнюйте у менеджера)." }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: [
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
function DistrictsSection() {
  const { ref, visible } = useReveal();
  const districts = [
    "Дарницький район",
    "Дніпровський район",
    "Деснянський район",
    "Оболонський район",
    "Печерський район",
    "Подільський район",
    "Святошинський район",
    "Солом'янський район",
    "Шевченківський район",
    "Голосіївський район"
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 8vw, 80px) 0", background: "rgba(255,255,255,0.015)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `nh-card reveal ${visible ? "visible" : ""}`, style: { padding: "clamp(1.5rem, 5vw, 3.5rem)", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem", textAlign: "center" }, children: "Райони Києва, куди ми доставляємо паливо" }),
    /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", textAlign: "center", maxWidth: "800px", margin: "0 auto 2.5rem", lineHeight: 1.6 }, children: [
      /* @__PURE__ */ jsx("strong", { style: { color: "var(--c-text)" }, children: "Доставка дров Київ, доставка брикетів Київ " }),
      " та ",
      /* @__PURE__ */ jsx("strong", { style: { color: "var(--c-text)" }, children: "доставка вугілля Київ" }),
      " здійснюється по всіх районах. Наш транспорт працює щодня, тому ми можемо доставити замовлення максимально швидко."
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem"
    }, children: districts.map((d, i) => /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          padding: "1rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "12px",
          textAlign: "center",
          fontSize: "1rem",
          color: "var(--c-text)",
          transition: "all 0.3s ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.borderColor = "var(--c-orange)";
          e.currentTarget.style.background = "rgba(249,115,22,0.03)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        },
        children: d
      },
      i
    )) })
  ] }) }) });
}
function DeliveryExtendedSeo() {
  const seoLinkStyle = {
    color: "inherit",
    textDecoration: "underline",
    textDecorationColor: "var(--color-border-medium)",
    textUnderlineOffset: "4px",
    transition: "all 0.2s"
  };
  const onEnter = (e) => {
    e.currentTarget.style.color = "var(--c-orange)";
    e.currentTarget.style.textDecorationColor = "var(--c-orange)";
  };
  const onLeave = (e) => {
    e.currentTarget.style.color = "inherit";
    e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
  };
  const thStyle = {
    padding: "1rem 1.25rem",
    textAlign: "left",
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "var(--c-text2)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "2px solid var(--c-orange)",
    background: "rgba(249,115,22,0.04)"
  };
  const tdBase = {
    padding: "1rem 1.25rem",
    borderBottom: "1px solid var(--color-border-subtle)"
  };
  const sectionPad = { padding: "clamp(40px, 8vw, 80px) 0 0" };
  const cardPad = { padding: "clamp(1.5rem, 5vw, 3.5rem)", borderRadius: "24px" };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem", textAlign: "center" }, children: "Яке паливо ми доставляємо" }),
      /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", textAlign: "center", maxWidth: "800px", margin: "0 auto 2.5rem", lineHeight: 1.6 }, children: [
        "Ми здійснюємо доставку ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "дров" }),
        ", ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "брикетів" }),
        " та ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "вугілля" }),
        " по Києву та Київській області власним транспортом."
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem"
      }, children: [
        { title: "Дрова колоті", link: "/catalog/drova" },
        { title: "Паливні брикети", link: "/catalog/brikety" },
        { title: "Кам'яне вугілля", link: "/catalog/vugillya" }
      ].map((item, i) => /* @__PURE__ */ jsx(Link, { to: item.link, style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            padding: "1.5rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "16px",
            textAlign: "center",
            transition: "all 0.3s ease",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          },
          className: "hover-glow",
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "var(--c-orange)";
            e.currentTarget.style.background = "rgba(249,115,22,0.03)";
            e.currentTarget.style.transform = "translateY(-4px)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            e.currentTarget.style.transform = "translateY(0)";
          },
          children: [
            /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--c-text)" }, children: item.title }),
            /* @__PURE__ */ jsxs("span", { style: { color: "var(--c-orange)", fontSize: "0.9rem", marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }, children: [
              "Перейти до каталогу ",
              /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
            ] })
          ]
        }
      ) }, i)) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Транспорт для доставки" }),
      /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "1rem", color: "var(--c-text)", minWidth: "600px" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Тип машини" }),
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Обсяг" }),
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Ціна доставки" }),
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Особливості" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: [
          { type: "ГАЗель", vol: "4–5 складометрів", price: "від 1500 грн", desc: "Швидка доставка невеликих замовлень" },
          { type: "ЗІЛ", vol: "до 4 складометрів", price: "від 3000 грн", desc: "Оптимально для приватних будинків" },
          { type: "КАМАЗ", vol: "до 8 складометрів", price: "від 4000 грн", desc: "Великі обсяги палива" },
          { type: "Фура", vol: "22–24 складометри", price: "за домовленістю", desc: "Поставка напряму з лісгоспу" }
        ].map((row, idx) => /* @__PURE__ */ jsxs("tr", { style: { background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }, children: [
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, fontWeight: 700, color: "var(--c-orange)" }, children: row.type }),
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, color: "var(--c-text2)" }, children: row.vol }),
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, fontWeight: 700, color: "var(--c-text)" }, children: row.price }),
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, color: "var(--c-text2)" }, children: row.desc })
        ] }, idx)) })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1rem" }, children: "Доставка дров по Києву" }),
        /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "2rem", maxWidth: 700 }, children: [
          "Доставка ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "дров" }),
          " здійснюється власним транспортом. Ви можете замовити доставку дров складометром у будь-який район Києва та Київської області."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: "1.5rem"
      }, children: [
        { src: "/images/delivery/gazel-dostavka-driv-kyiv.webp", alt: "ГАЗель доставка дров Київ", name: "ГАЗель (бус)", volume: "4–5 складометрів", price: "1 500 грн" },
        { src: "/images/delivery/zil-dostavka-driv-kyiv.webp", alt: "ЗІЛ доставка дров Київ", name: "ЗІЛ самоскид", volume: "4 складометри", price: "3 000 грн" },
        { src: "/images/delivery/kamaz-dostavka-driv-kyiv.webp", alt: "КАМАЗ доставка дров Київ", name: "КАМАЗ самоскид", volume: "8 складометрів", price: "4 000 грн" }
      ].map((card, i) => /* @__PURE__ */ jsxs(
        "figure",
        {
          className: "nh-card hover-glow",
          style: {
            margin: 0,
            padding: 0,
            borderRadius: "20px",
            overflow: "hidden",
            cursor: "default",
            transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease",
            border: "1px solid var(--color-border-subtle)"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.2)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: {
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)",
              padding: "1.5rem 1.5rem 0.5rem"
            }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: card.src,
                alt: card.alt,
                width: 800,
                height: 600,
                loading: "lazy",
                style: {
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "12px",
                  transition: "transform 0.4s ease"
                }
              }
            ) }),
            /* @__PURE__ */ jsxs("figcaption", { style: { padding: "1.25rem 1.5rem 1.5rem" }, children: [
              /* @__PURE__ */ jsx("h3", { style: {
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--c-text)",
                margin: "0 0 0.75rem"
              }, children: card.name }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
                color: "var(--c-text2)"
              }, children: [
                /* @__PURE__ */ jsx(Package, { size: 16, style: { color: "var(--c-orange)", flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: card.volume })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "#22c55e"
              }, children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 16, style: { flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: "Швидка доставка по Києву" })
              ] }),
              /* @__PURE__ */ jsx("div", { style: {
                display: "flex",
                alignItems: "baseline",
                gap: "0.25rem",
                paddingTop: "0.75rem",
                borderTop: "1px dashed rgba(255,255,255,0.08)"
              }, children: /* @__PURE__ */ jsx("span", { style: {
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--c-orange)"
              }, children: card.price }) })
            ] })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxs("table", { style: { position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Тип машини" }),
          /* @__PURE__ */ jsx("th", { children: "Обсяг" }),
          /* @__PURE__ */ jsx("th", { children: "Ціна доставки" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "ГАЗель (бус)" }),
            /* @__PURE__ */ jsx("td", { children: "4–5 складометрів" }),
            /* @__PURE__ */ jsx("td", { children: "1 500 грн" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "ЗІЛ самоскид" }),
            /* @__PURE__ */ jsx("td", { children: "4 складометри" }),
            /* @__PURE__ */ jsx("td", { children: "3 000 грн" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "КАМАЗ самоскид" }),
            /* @__PURE__ */ jsx("td", { children: "8 складометрів" }),
            /* @__PURE__ */ jsx("td", { children: "4 000 грн" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Доставка паливних брикетів" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
          "Вартість доставки ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "брикетів" }),
          " по Києву:"
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "1rem", marginBottom: "1.5rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(249,115,22,0.05)",
            border: "1px solid rgba(249,115,22,0.15)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "2rem", fontWeight: 800, color: "var(--c-orange)", display: "block", marginBottom: "0.25rem" }, children: "700 грн" }),
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontSize: "0.95rem" }, children: "за тонну по Києву" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "2rem", fontWeight: 800, color: "var(--c-text)", display: "block", marginBottom: "0.25rem" }, children: "+20 грн" }),
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontSize: "0.95rem" }, children: "за кожен кілометр за межі Києва" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { margin: 0 }, children: "Доставка брикетів здійснюється вантажним транспортом з можливістю розвантаження гідробортом або маніпулятором." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Доставка кам'яного вугілля" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
          "Вартість доставки ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "вугілля" }),
          " залежить від обсягу замовлення та відстані доставки. Ціну уточнюйте у менеджера."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Для доставки вугілля по Києву та області використовуються автомобілі:" }),
        /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }, children: ["ЗІЛ", "КАМАЗ", "Маніпулятор"].map((v, i) => /* @__PURE__ */ jsxs("li", { style: {
          padding: "0.75rem 1.25rem",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--color-border-subtle)",
          display: "flex",
          alignItems: "center",
          fontSize: "1.05rem",
          color: "var(--c-text)"
        }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)", marginRight: "10px", fontWeight: 700 }, children: "•" }),
          " ",
          v
        ] }, i)) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Спецтехніка для розвантаження" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "1.5rem" }, children: "Для зручного розвантаження палива у складних умовах ми пропонуємо спеціалізовану техніку:" }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: "1.5rem"
      }, children: [
        { src: "/images/delivery/manipulator-dostavka-kyiv.webp", alt: "Кран-маніпулятор доставка Київ", name: "Кран-маніпулятор", volume: "Складні умови", price: "від 4 500 грн" },
        { src: "/images/delivery/gidrobort-rokla-dostavka-kyiv.webp", alt: "Гідроборт рокла доставка Київ", name: "Гідроборт / рокла", volume: "Складні умови", price: "від 4 500 грн" }
      ].map((card, i) => /* @__PURE__ */ jsxs(
        "figure",
        {
          className: "nh-card hover-glow",
          style: {
            margin: 0,
            padding: 0,
            borderRadius: "20px",
            overflow: "hidden",
            cursor: "default",
            transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease",
            border: "1px solid var(--color-border-subtle)"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.2)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: {
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)",
              padding: "1.5rem 1.5rem 0.5rem"
            }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: card.src,
                alt: card.alt,
                width: 800,
                height: 600,
                loading: "lazy",
                style: {
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "12px",
                  transition: "transform 0.4s ease"
                }
              }
            ) }),
            /* @__PURE__ */ jsxs("figcaption", { style: { padding: "1.25rem 1.5rem 1.5rem" }, children: [
              /* @__PURE__ */ jsx("h3", { style: {
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--c-text)",
                margin: "0 0 0.75rem"
              }, children: card.name }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
                color: "var(--c-text2)"
              }, children: [
                /* @__PURE__ */ jsx(Package, { size: 16, style: { color: "var(--c-orange)", flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: card.volume })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "#22c55e"
              }, children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 16, style: { flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: "Швидка доставка по Києву" })
              ] }),
              /* @__PURE__ */ jsx("div", { style: {
                display: "flex",
                alignItems: "baseline",
                gap: "0.25rem",
                paddingTop: "0.75rem",
                borderTop: "1px dashed rgba(255,255,255,0.08)"
              }, children: /* @__PURE__ */ jsx("span", { style: {
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--c-orange)"
              }, children: card.price }) })
            ] })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxs("table", { style: { position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Послуга" }),
          /* @__PURE__ */ jsx("th", { children: "Ціна" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Кран-маніпулятор" }),
            /* @__PURE__ */ jsx("td", { children: "від 4 500 грн" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Гідроборт / рокла" }),
            /* @__PURE__ */ jsx("td", { children: "від 4 500 грн" })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: {
      ...cardPad,
      background: "linear-gradient(145deg, rgba(249,115,22,0.04) 0%, rgba(20,25,30,0.9) 100%)",
      border: "1px solid rgba(249,115,22,0.12)"
    }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Оптові поставки палива" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.25rem" }, children: [
          "Ми здійснюємо оптові поставки ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "дров" }),
          ", ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "брикетів" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "вугілля" }),
          " повними фурами безпосередньо з виробництва. Доставка дров фурою по Києву та області — вигідний варіант для великих обсягів."
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "1rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.15)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }, children: "Обсяг фури" }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-orange)" }, children: "22–24" }),
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "var(--c-text2)", fontSize: "0.9rem" }, children: "складометри дров" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }, children: "Ціна" }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-text)" }, children: "Індивідуально" }),
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "var(--c-text2)", fontSize: "0.9rem" }, children: "розраховується за запитом" })
          ] })
        ] })
      ] })
    ] }) }) })
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
            "Замовте доставку палива ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Готові обігріти вашу оселю. Чесний об'єм та гарантія якості від виробника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: onOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: "Замовити" }),
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-btn-ghost", style: { padding: "16px 32px", fontSize: "1rem", border: "1px solid var(--color-border-medium)" }, children: [
              /* @__PURE__ */ jsx(Phone, { size: 18, style: { marginRight: 8 } }),
              " Подзвонити"
            ] })
          ] })
        ] })
      ]
    }
  ) }) });
}
function Delivery() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const { pageData } = usePageSEO("/dostavka");
  const title = pageData?.meta_title || "Доставка дров по Києву — брикети та вугілля | КиївБрикет";
  const description = pageData?.meta_description || "Швидка доставка твердого палива (дров, брикетів, вугілля) по Києву та Київській області власним транспортом. Замовляйте сьогодні!";
  const combinedSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "КиївБрикет",
    "url": "https://kievbriket.com",
    "telephone": "+380991234567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "вул. Колекторна, 19",
      "addressLocality": "Київ",
      "addressCountry": "UA"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Київська область"
    },
    "makesOffer": {
      "@type": "Service",
      "name": "Доставка дров, брикетів та вугілля"
    }
  };
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
        canonical: `${shopConfig.domain}/dostavka`,
        schema: combinedSchema
      }
    ),
    /* @__PURE__ */ jsx(HeroDelivery, { onOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    /* @__PURE__ */ jsx(DeliverySeoBlock, {}),
    /* @__PURE__ */ jsx(PopularQueriesSection, {}),
    /* @__PURE__ */ jsx(FaqSection, {}),
    /* @__PURE__ */ jsx(DistrictsSection, {}),
    /* @__PURE__ */ jsx(DeliveryExtendedSeo, {}),
    /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 8vw, 80px) 0 0", color: "var(--c-text2)", lineHeight: 1.8 }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "900px", margin: "0 auto", fontSize: "0.95rem" }, children: [
      /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
        "Ми здійснюємо ",
        /* @__PURE__ */ jsx("strong", { children: "доставку твердого палива по Києву" }),
        " власним транспортом. У нас можна замовити ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "дрова колоті" }),
        ", ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "паливні брикети" }),
        " та ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "кам'яне вугілля" }),
        " з швидкою доставкою по всіх районах Києва та області."
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Наша компанія працює з 2013 року та забезпечує чесний обʼєм палива, швидке завантаження та оперативну доставку дров, брикетів і вугілля для приватних будинків, котелень та підприємств. Якщо вам потрібно ",
        /* @__PURE__ */ jsx("strong", { children: "купити дрова з доставкою" }),
        " або замовити ",
        /* @__PURE__ */ jsx("strong", { children: "доставку палива Київ" }),
        ", обирайте перевіреного постачальника КиївБрикет."
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: "1rem" }, children: [
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Ми доставляємо колоті дрова різних порід:" }),
        /* @__PURE__ */ jsxs("ul", { style: { listStyleType: "disc", paddingLeft: "1.5rem", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsx("li", { children: "дуб" }),
          /* @__PURE__ */ jsx("li", { children: "граб" }),
          /* @__PURE__ */ jsx("li", { children: "ясен" }),
          /* @__PURE__ */ jsx("li", { children: "береза" })
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
          "Замовити дрова з доставкою по Києву можна у будь-який район міста.",
          /* @__PURE__ */ jsx("br", {}),
          "Власний автопарк дозволяє виконувати швидку доставку дров, паливних брикетів та вугілля по всьому Києву та Київській області."
        ] })
      ] })
    ] }) }) }),
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
  Delivery as default
};
//# sourceMappingURL=Delivery-yiPBfvAH.js.map
