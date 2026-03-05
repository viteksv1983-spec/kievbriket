import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import { F as FuelCalculatorSection, D as DeliverySection, B as BenefitsSection, u as useReveal, s as shopConfig, g as getProductUrl, a as getImageUrl, b as api, c as useCategories, d as useSSGData, N as NotFound, S as SEOHead, O as OrderFormModal } from "../entry-server.js";
import { ChevronRight, ArrowRight, Phone, Flame, CheckCircle2, Zap, Droplets, Thermometer } from "lucide-react";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
function HeroCategory$2({ onQuickOrderClick, activeCategory, activeCategorySlug }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(5px, 2vw, 40px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "24px" }, children: [
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
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kievbriket.com/" },
            { "@type": "ListItem", "position": 2, "name": activeCategory?.name || "Дрова", "item": "https://kievbriket.com/catalog/drova" }
          ]
        })
      } }),
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
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: activeCategory?.name || "Дрова" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2rem, 5.5vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "clamp(0.1rem, 1vw, 0.25rem)", color: "#fff" }, children: [
          "Купити ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: activeCategory?.name?.toLowerCase() || "дрова" }),
          " у Києві"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "body hero-sub fade-up fade-up-d2", style: { maxWidth: 600, marginBottom: "clamp(0.65rem, 2.5vw, 1.25rem)", fontSize: "clamp(0.85rem, 3.2vw, 18px)", color: "var(--c-text2)", lineHeight: 1.5 }, children: [
          "Сухі колоті дрова з ",
          /* @__PURE__ */ jsx(Link, { to: "/dostavka", className: "seo-inline-link", style: { color: "inherit", fontWeight: 500 }, children: "доставкою по Києву" }),
          " та області. Дуб, граб, береза та інші породи з чесним складометром. Також пропонуємо ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-inline-link", style: { color: "inherit", fontWeight: 500 }, children: "паливні брикети" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-inline-link", style: { color: "inherit", fontWeight: 500 }, children: "кам'яне вугілля" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "1.5rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onQuickOrderClick,
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
                "Замовити дрова",
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
        /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "1px", background: "rgba(255,255,255,0.05)", borderBottom: "1px dashed rgba(255,255,255,0.1)", marginBottom: "clamp(0.5rem, 1.8vw, 1rem)" } }),
        /* @__PURE__ */ jsxs("div", { className: "hero-trust-row fade-up fade-up-d3", style: {
          display: "flex",
          gap: "clamp(0.35rem, 1.5vw, 2rem)",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
          color: "rgba(255,255,255,0.7)",
          paddingBottom: "0.25rem"
        }, children: [
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " Доставка по Києву за 24 години"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " Чесний складометр"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " Оплата після отримання"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function FirewoodSeoIntro({ activeCategorySlug }) {
  if (activeCategorySlug !== "drova") return null;
  return /* @__PURE__ */ jsx("section", { className: "layout-container", style: { paddingBottom: "32px" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: {
    width: "100%",
    margin: "64px 0 0 0",
    padding: "clamp(1.5rem, 5vw, 4rem)",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.02)"
  }, children: [
    /* @__PURE__ */ jsx("h2", { style: { fontSize: "32px", fontWeight: 700, marginBottom: "24px", color: "var(--c-text)" }, children: "Популярні породи дров у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "2rem" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }, children: "Різні породи деревини мають унікальні характеристики горіння. Тверді породи (дуб, граб, ясен) мають найвищу тепловіддачу та довго тліють — ідеально для котлів тривалого горіння." }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }, children: "Вільха та береза швидко розпалюються, не димлять і чудово підходять для відкритих камінів, а сосна використовується переважно для стартового розпалу або лазень." })
    ] })
  ] }) });
}
function CategoryProducts$2({ products, onOrderProduct, activeCategory }) {
  const { ref, visible } = useReveal();
  const getDetailedDesc = (name) => {
    const n = name.toLowerCase();
    if (n.includes("дуб")) return { desc: "Висока тепловіддача, довге горіння.", use: "Ідеально для котлів і камінів." };
    if (n.includes("граб")) return { desc: "Найбільша щільність, рівне полум'я.", use: "Для тримання стабільної температури." };
    if (n.includes("сосна")) return { desc: "Легко розпалюється, дає швидкий жар.", use: "Для лазень і швидкого обігріву." };
    if (n.includes("береза")) return { desc: "Рівне красиве полум'я.", use: "Для відкритих камінів." };
    if (n.includes("антрацит")) return { desc: "Максимальна тепловіддача.", use: "Для твердопаливних котлів." };
    if (n.includes("ruf") || n.includes("pini")) return { desc: "Довге і рівне горіння.", use: "Ідеально для котлів і камінів." };
    return { desc: "Якісне паливо з високою тепловіддачею.", use: "Універсальне використання." };
  };
  const [selectedBreed, setSelectedBreed] = useState("Усі");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedBreed !== "Усі") {
      list = list.filter((p) => p.name.toLowerCase().includes(selectedBreed.toLowerCase()));
    }
    switch (sortOrder) {
      case "price_asc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceB - priceA;
        });
        break;
    }
    return list;
  }, [products, selectedBreed, sortOrder]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { ref, className: "catalog-section", style: { paddingTop: "0px", paddingBottom: "120px", position: "relative", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
        /* @__PURE__ */ jsxs("div", { style: {
          position: "relative",
          zIndex: 50,
          display: "flex",
          flexWrap: "nowrap",
          gap: "0.25rem",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 25, flexShrink: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Порода:" }),
            /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => setIsFilterOpen(!isFilterOpen),
                  style: {
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    paddingRight: "24px",
                    cursor: "pointer",
                    userSelect: "none",
                    minWidth: "60px",
                    maxWidth: "120px"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: selectedBreed }),
                    /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "8px", transform: `rotate(${isFilterOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
                  ]
                }
              ),
              isFilterOpen && /* @__PURE__ */ jsx("div", { style: {
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "8px",
                background: "var(--c-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "8px 0",
                zIndex: 9999,
                minWidth: "160px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }, children: ["Усі", "Дуб", "Граб", "Сосна", "Береза"].map((breed) => {
                const isActive = selectedBreed === breed;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSelectedBreed(breed);
                      setIsFilterOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: isActive ? "var(--c-orange)" : "var(--c-text)", background: isActive ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: breed
                  },
                  breed
                );
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 20, flexShrink: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Сортування:" }),
            /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => setIsSortOpen(!isSortOpen),
                  style: {
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    paddingRight: "24px",
                    cursor: "pointer",
                    userSelect: "none",
                    maxWidth: "180px"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: sortOrder === "popular" ? "За популярністю" : sortOrder === "price_asc" ? "Від дешевих до дорогих" : "Від дорогих до дешевих" }),
                    /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "12px", transform: `rotate(${isSortOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
                  ]
                }
              ),
              isSortOpen && /* @__PURE__ */ jsxs("div", { style: {
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "var(--c-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "8px 0",
                zIndex: 9999,
                minWidth: "220px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }, children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSortOrder("popular");
                      setIsSortOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "popular" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "popular" ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: "За популярністю"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSortOrder("price_asc");
                      setIsSortOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_asc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_asc" ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: "Від дешевих до дорогих"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSortOrder("price_desc");
                      setIsSortOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_desc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_desc" ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: "Від дорогих до дешевих"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": filteredProducts.map((p, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "url": `https://kievbriket.com${getProductUrl(p)}`
            }))
          })
        } }),
        /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
          __html: JSON.stringify(filteredProducts.map((p) => ({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": p.name,
            "image": getImageUrl(p.image_url, api.defaults.baseURL),
            "description": getDetailedDesc(p.name).desc,
            "brand": { "@type": "Brand", "name": "КиївБрикет", "logo": "https://kievbriket.com/kievbriket.svg" },
            "offers": {
              "@type": "Offer",
              "price": p.variants?.length > 0 ? p.variants[0].price : p.price,
              "priceCurrency": "UAH",
              "availability": "https://schema.org/InStock",
              "url": `https://kievbriket.com${getProductUrl(p)}`
            }
          })))
        } }),
        /* @__PURE__ */ jsx("div", { className: "product-grid", children: filteredProducts.map((product, i) => {
          const info = getDetailedDesc(product.name);
          const displayPrice = product.variants?.length > 0 ? product.variants[0].price : product.price;
          return /* @__PURE__ */ jsx(Link, { to: getProductUrl(product), className: "product-card-link", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxs(
            "article",
            {
              className: `reveal product-card-hover ${visible ? "visible" : ""}`,
              style: {
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transitionDelay: `${i * 0.1}s`,
                overflow: "hidden",
                borderRadius: "16px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.15)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "product-card-image", style: { aspectRatio: "4/3", width: "100%", overflow: "hidden", position: "relative" }, children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: getImageUrl(product.image_url, api.defaults.baseURL),
                      alt: `${product.name.replace(/[()]/g, "").trim()} Київ`,
                      loading: "lazy",
                      className: "img-zoom",
                      style: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(10,13,20,0.8) 0%, transparent 60%)",
                    pointerEvents: "none"
                  } }),
                  /* @__PURE__ */ jsx("h3", { className: "product-card-title-overlay", style: { fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.3 }, children: product.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "product-card-body", style: { padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1, background: "#161C25" }, children: [
                  /* @__PURE__ */ jsxs("div", { className: "product-card-title-static", style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem", flexShrink: 0 }, children: [
                    /* @__PURE__ */ jsx("h3", { className: "h3", style: { margin: 0 }, children: product.name }),
                    /* @__PURE__ */ jsx("div", { style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#22C55E",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "40px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: "0 0 10px rgba(34,197,94,0.4)"
                    }, children: "✔ В наявності" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
                    /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", marginBottom: "0.5rem", display: "flex", gap: 8, alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx(Flame, { size: 16, color: "var(--c-orange)", style: { flexShrink: 0, marginTop: 2 } }),
                      info.desc
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", marginBottom: "1.5rem", display: "flex", gap: 8, alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx(CheckCircle2, { size: 16, color: "#22C55E", style: { flexShrink: 0, marginTop: 2 } }),
                      info.use
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--color-border-subtle)" }, children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "category-card-mobile-badge", style: { display: "none", color: "#22c55e", fontSize: "0.9rem", fontWeight: 700, marginBottom: 4 }, children: "✔ В наявності" }),
                      /* @__PURE__ */ jsx("span", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-orange)" }, children: displayPrice }),
                      /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)", marginLeft: 4 }, children: [
                        "грн / ",
                        activeCategory?.slug === "vugillya" || activeCategory?.slug === "brikety" ? "тонну" : "складометр"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "nh-btn-primary",
                        style: { padding: "8px 16px", fontSize: "0.875rem", background: "var(--c-orange)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 },
                        onClick: (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onOrderProduct(product);
                        },
                        children: "Замовити"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ) }, product.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                    .product-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 24px;
                        width: 100%;
                    }
                    @media (max-width: 1024px) {
                        .product-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                    @media (max-width: 640px) {
                        .product-grid { grid-template-columns: 1fr; }
                    }
                    .product-card-hover:hover .img-zoom {
                        transform: scale(1.05); /* Zoom image precisely on card hover */
                    }
                    .seo-inline-link {
                        color: var(--c-text);
                        text-decoration: underline;
                        text-decoration-color: rgba(255,255,255,0.2);
                        text-underline-offset: 4px;
                        transition: all 0.2s ease;
                    }
                    .seo-inline-link:hover {
                        color: var(--c-orange);
                        text-decoration-color: var(--c-orange);
                    }
                ` })
    ] }),
    /* @__PURE__ */ jsx(FirewoodSeoIntro, { activeCategorySlug: activeCategory?.slug })
  ] });
}
function FaqSection$2() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Які дрова краще для котла?", a: "Для твердопаливного котла найкраще підходять тверді породи деревини: дуб, граб та ясен. Вони мають найвищу тепловіддачу та горять найдовше. Вологість не повинна перевищувати 20-25%." },
    { q: "Які дрова найкращі для печі?", a: "Для пічного опалення чудово підходять дрова твердих порід (дуб, граб), які забезпечують тривалий жар. Також часто використовують березові та вільхові дрова, оскільки вони горять рівним красивим полум'ям і менше забивають димохід сажею." },
    { q: "Чи можна купити дрова з доставкою сьогодні?", a: "Так, за умови оформлення замовлення в першій половині дня, доставка по Києву можлива в той самий день. По області — зазвичай на наступний день." },
    { q: "Скільки коштує машина дров?", a: "Вартість залежить від породи деревини та об'єму кузова (ЗІЛ, Камаз, Газель). Вартість доставки розраховується індивідуально в залежності від вашої адреси." },
    { q: "Який об'єм дров у машині? (чесний складометр)", a: "Ми ретельно укладаємо поліна на складі. Наприклад, в ЗІЛ поміщається до 6-7 складометрів. Ви можете особисто рулеткою заміряти габарити укладених дров у кузові перед вивантаженням (Довжина × Ширина × Висота = Складометри)." },
    { q: "Яка вологість дров для опалення?", a: "Ми поставляємо деревину природної та камерної сушки. Оптимальна вологість дров для ефективного горіння становить 15-20%. Саме такі показники дозволяють отримати максимальну тепловіддачу та мінімізувати утворення сажі." }
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
        return /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              borderBottom: "1px solid var(--color-border-subtle)",
              marginBottom: "1rem"
            },
            children: [
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
              /* @__PURE__ */ jsx("div", { style: {
                maxHeight: isOpen ? 500 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease",
                color: "var(--c-text2)",
                lineHeight: 1.6
              }, children: /* @__PURE__ */ jsx("p", { style: { paddingBottom: "1.5rem", margin: 0 }, children: faq.a }) })
            ]
          },
          idx
        );
      }) })
    ] })
  ] });
}
function FinalCtaBanner$2({ onQuickOrderClick, activeCategory }) {
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
            "Замовте ",
            activeCategory?.name?.toLowerCase() || "тверде паливо",
            " ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Доставка по Києву можлива вже сьогодні. Чесний об'єм та гарантія якості від виробника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs("button", { onClick: onQuickOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: [
              "Замовити ",
              activeCategory?.name?.toLowerCase() || ""
            ] }),
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
function FirewoodCategoryPage({ products, seo, onOrderProduct, activeCategory, activeCategorySlug }) {
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", children: [
    /* @__PURE__ */ jsx(
      HeroCategory$2,
      {
        onQuickOrderClick: () => onOrderProduct(null),
        activeCategory,
        activeCategorySlug
      }
    ),
    /* @__PURE__ */ jsx(
      CategoryProducts$2,
      {
        products,
        onOrderProduct,
        activeCategory
      }
    ),
    /* @__PURE__ */ jsx(HowToChooseFirewood, { activeCategorySlug }),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => onOrderProduct(null) }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    activeCategorySlug === "drova" ? /* @__PURE__ */ jsx(FirewoodSeoBlock, {}) : /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: activeCategory?.seo_h1 || `Купити ${activeCategory?.name?.toLowerCase() || "тверде паливо"} у Києві` }),
      /* @__PURE__ */ jsx(
        "div",
        {
          style: { maxWidth: "100%", color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", textAlign: "left" },
          dangerouslySetInnerHTML: {
            __html: activeCategory?.seo_text || `
                                    <p>Якісне тверде паливо для опалення будинків, котлів та камінів.</p>
                                    <p>Ми гарантуємо чесний об'єм та швидку доставку по Києву та всій Київській області. Оплата здійснюється тільки після отримання та перевірки на місці — жодних передоплат і ризиків. Доставка можлива день у день!</p>
                                    `
          }
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx(PopularQueriesSection$2, { activeCategorySlug }),
    /* @__PURE__ */ jsx(FaqSection$2, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner$2, { onQuickOrderClick: () => onOrderProduct(null), activeCategory })
  ] });
}
function FirewoodSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити дрова у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Купити дрова з доставкою по Києву та Київській області можна безпосередньо у постачальника. Компанія «КиївБрикет» пропонує колоті дрова різних порід дерева для ефективного опалення приватних будинків, котлів та камінів, а також ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-inline-link", children: "паливні брикети" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-inline-link", children: "кам'яне вугілля" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Ми доставляємо дрова дуба, граба, сосни, берези та вільхи. Усі дрова мають низьку вологість та високу тепловіддачу. Працює швидка та зручна ",
          /* @__PURE__ */ jsx(Link, { to: "/dostavka", className: "seo-inline-link", children: "доставка по Києву" }),
          " та області."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2rem" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { style: { color: "var(--c-text)", fontSize: "1.125rem", marginBottom: "1rem", fontWeight: "600" }, children: "Популярні породи дров:" }),
          /* @__PURE__ */ jsx("ul", { style: { listStyleType: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.625rem" }, children: [
            { name: "дубові дрова", slug: "oak" },
            { name: "грабові дрова", slug: "hornbeam" },
            { name: "березові дрова", slug: "birch" },
            { name: "соснові дрова", slug: "pine" },
            { name: "вільхові дрова", slug: "alder" }
          ].map((item, i) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [
            /* @__PURE__ */ jsx(Flame, { size: 14, color: "var(--c-orange)" }),
            /* @__PURE__ */ jsx(Link, { to: `/catalog/drova/${item.slug}`, style: { color: "var(--c-text2)", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.2)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
              e.currentTarget.style.color = "var(--c-orange)";
              e.currentTarget.style.textDecorationColor = "var(--c-orange)";
            }, onMouseLeave: (e) => {
              e.currentTarget.style.color = "var(--c-text2)";
              e.currentTarget.style.textDecorationColor = "rgba(255,255,255,0.2)";
            }, children: item.name })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--color-border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }, children: [
          /* @__PURE__ */ jsx("h4", { style: { color: "var(--c-text)", fontSize: "1.05rem", margin: 0, fontWeight: "600" }, children: "Також дивіться:" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "1.5rem" }, children: [
            /* @__PURE__ */ jsxs(Link, { to: "/catalog/brikety", style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--c-orange)", textDecoration: "none", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsx("span", { children: "→" }),
              " Паливні брикети"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/catalog/vugillya", style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--c-orange)", textDecoration: "none", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsx("span", { children: "→" }),
              " Кам’яне вугілля"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/dostavka", style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--c-orange)", textDecoration: "none", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsx("span", { children: "→" }),
              " Доставка по Києву"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) }) });
}
function PopularQueriesSection$2({ activeCategorySlug }) {
  if (activeCategorySlug !== "drova") return null;
  const queries = [
    { text: "Купити дубові дрова Київ", to: "/catalog/drova/dubovi-drova" },
    { text: "Дрова граб Київ", to: "/catalog/drova/hrabovi-drova" },
    { text: "Дрова береза Київ", to: "/catalog/drova/berezovi-drova" },
    { text: "Дрова для каміна", to: "/catalog/drova/drova-dlya-kamina" },
    { text: "Дрова в ящиках", to: "/catalog/drova/drova-v-yashchykakh" },
    { text: "Дрова складометр Київ", to: "/catalog/drova/dubovi-drova" }
  ];
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 900, margin: "0 auto", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { className: "h3", style: { marginBottom: "1.5rem", fontSize: "1.25rem" }, children: "Популярні запити" }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.75rem"
    }, children: queries.map((q, i) => /* @__PURE__ */ jsx(
      Link,
      {
        to: q.to,
        className: "popular-link",
        style: {
          padding: "8px 16px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "40px",
          color: "var(--c-text2)",
          fontSize: "0.875rem",
          textDecoration: "none",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "rgba(249,115,22,0.1)";
          e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          e.currentTarget.style.color = "var(--c-orange)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "var(--c-text2)";
        },
        children: q.text
      },
      i
    )) })
  ] }) }) });
}
function HowToChooseFirewood({ activeCategorySlug }) {
  if (activeCategorySlug !== "drova") return null;
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem" }, children: "Як вибрати дрова для опалення" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "2.5rem" }, children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
        "Правильний вибір дров залежить від типу вашого опалювального пристрою. ",
        /* @__PURE__ */ jsx("strong", { children: "Для твердопаливного котла" }),
        " найкраще підходять дуб, граб та ясен, а також ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-inline-link", children: "паливні брикети" }),
        " чи ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-inline-link", children: "кам'яне вугілля" }),
        ". Вони мають високу щільність, забезпечують довготривале горіння (тління) і максимальну тепловіддачу."
      ] }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsx("strong", { children: "Для закритої печі або відкритого каміна" }),
        " чудовим вибором стануть береза та вільха. Ці породи легко розпалюються, горять гарним високим полум'ям і, що найважливіше, виділяють мінімум кіптяви та диму, запобігаючи швидкому засміченню димоходу. Сосну найчастіше використовують для лазень або як стартове паливо для розпалу."
      ] }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
        "Окремо варто звернути увагу на ",
        /* @__PURE__ */ jsx("strong", { children: "вологість" }),
        ". Оптимальна вологість дров для ефективного опалення не повинна перевищувати 20-25%. Використання свіжопиляних дров значно знижує ККД котла та призводить до утворення конденсату та сажі."
      ] }) })
    ] })
  ] }) }) });
}
function HeroCategory$1({ onQuickOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(5px, 2vw, 40px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "24px" }, children: [
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
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Паливні брикети" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2rem, 5.5vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "clamp(0.1rem, 1vw, 0.25rem)", color: "#fff" }, children: [
          "Купити паливні ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "брикети" }),
          " у Києві"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "clamp(0.85rem, 3.2vw, 18px)",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "100%",
          marginBottom: "clamp(0.65rem, 2.5vw, 1.5rem)",
          fontWeight: 400
        }, children: [
          "RUF, Pini Kay та Nestro. ",
          /* @__PURE__ */ jsx("br", {}),
          "Висока тепловіддача та низька вологість. Доставка по Києву та області."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "1.5rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onQuickOrderClick,
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
                "Замовити брикети",
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
            " без передоплати"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " сухе паливо"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function BriquetteTypesSection() {
  const { ref, visible } = useReveal();
  const types = [
    {
      title: "RUF",
      desc: "Класичні прямокутні брикети (цеглинки). Добре підходять для котлів, печей та камінів. Зручні для зберігання (щільно вкладаються) та завантаження."
    },
    {
      title: "Pini Kay",
      desc: "Багатогранні брикети (найчастіше шестигранні) з отвором посередині. Мають темну випалену кірку ззовні. Дають найвищу тепловіддачу та ідеально підходять для камінів (красиво горять)."
    },
    {
      title: "Nestro",
      desc: "Брикети циліндричної форми. Відрізняються рівномірним горінням та високою тепловіддачею. Чудово зарекомендували себе в котлах тривалого горіння."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 8vw, 80px) 0 clamp(20px, 4vw, 40px)" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2", children: "Типи паливних брикетів" }) }),
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }, children: types.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "nh-card hover-glow", style: { padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%", borderRadius: "16px" }, children: [
      /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--c-orange)" }, children: t.title }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", lineHeight: 1.6, flex: 1, margin: 0, fontSize: "0.95rem" }, children: t.desc })
    ] }, i)) })
  ] }) });
}
function CategoryProducts$1({ products, onOrderProduct }) {
  const { ref, visible } = useReveal();
  const [selectedBreed, setSelectedBreed] = useState("Усі");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedBreed !== "Усі") {
      list = list.filter((p) => p.name.toLowerCase().includes(selectedBreed.toLowerCase()));
    }
    switch (sortOrder) {
      case "price_asc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceB - priceA;
        });
        break;
    }
    return list;
  }, [products, selectedBreed, sortOrder]);
  return /* @__PURE__ */ jsx("section", { ref, className: "catalog-section", style: { paddingTop: "0px", paddingBottom: "100px", position: "relative", zIndex: 10 }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: {
      position: "relative",
      zIndex: 50,
      display: "flex",
      flexWrap: "nowrap",
      gap: "0.25rem",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "2rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 25, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Порода:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsFilterOpen(!isFilterOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                minWidth: "60px",
                maxWidth: "120px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: selectedBreed }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "8px", transform: `rotate(${isFilterOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isFilterOpen && /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "160px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: ["Усі", "Сосна", "Дуб", "Мікс"].map((breed) => {
            const isActive = selectedBreed === breed;
            const breedKey = breed === "Мікс" ? "мікс" : breed;
            return /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSelectedBreed(breedKey === "Усі" ? "Усі" : breedKey);
                  setIsFilterOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: isActive ? "var(--c-orange)" : "var(--c-text)", background: isActive ? "rgba(255,255,255,0.02)" : "transparent" },
                children: breed
              },
              breed
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 20, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Сортування:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsSortOpen(!isSortOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                maxWidth: "180px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: sortOrder === "popular" ? "За популярністю" : sortOrder === "price_asc" ? "Від дешевих до дорогих" : "Від дорогих до дешевих" }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "12px", transform: `rotate(${isSortOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isSortOpen && /* @__PURE__ */ jsxs("div", { style: {
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "220px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("popular");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "popular" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "popular" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "За популярністю"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_asc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_asc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_asc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дешевих до дорогих"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_desc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_desc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_desc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дорогих до дешевих"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify(filteredProducts.map((p) => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.name,
        "image": p.image_url ? p.image_url.startsWith("http") ? p.image_url : `https://kievbriket.com${p.image_url}` : void 0,
        "description": p.description || p.name,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "UAH",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "url": `https://kievbriket.com/catalog/brikety/${p.slug}`
        }
      })))
    } }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `product-grid reveal ${visible ? "visible" : ""}`,
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          gap: "24px",
          transitionDelay: "0.2s"
        },
        children: filteredProducts.map((product) => /* @__PURE__ */ jsx(
          Link,
          {
            to: `/catalog/brikety/${product.slug}`,
            className: "product-card-link",
            style: { textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" },
            children: /* @__PURE__ */ jsxs(
              "article",
              {
                className: "nh-card hover-glow group",
                style: {
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "16px"
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "product-card-image", style: { height: "300px", width: "100%", position: "relative", overflow: "hidden", background: "#0a0d14" }, children: [
                    product.image_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.image_url.startsWith("http") ? product.image_url : `${api.defaults.baseURL}${product.image_url}`,
                        alt: `${product.name} Київ`,
                        loading: "lazy",
                        style: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.7s ease"
                        },
                        className: "group-hover:scale-105"
                      }
                    ) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }, children: "Немає фото" }),
                    /* @__PURE__ */ jsx("div", { style: {
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10,13,20,0.8) 0%, transparent 60%)",
                      pointerEvents: "none"
                    } }),
                    /* @__PURE__ */ jsx("h3", { className: "product-card-title-overlay", style: { fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.3 }, children: product.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "product-card-body", style: { padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1, background: "#161C25" }, children: [
                    /* @__PURE__ */ jsxs("div", { className: "product-card-title-static", style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem", flexShrink: 0 }, children: [
                      /* @__PURE__ */ jsx("h3", { className: "h3", style: { margin: 0 }, children: product.name }),
                      /* @__PURE__ */ jsx("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#22C55E",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "40px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        flexShrink: 0,
                        boxShadow: "0 0 10px rgba(34,197,94,0.4)"
                      }, children: "✔ В наявності" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--c-text2)", fontSize: "0.875rem" }, children: [
                        /* @__PURE__ */ jsx(Zap, { size: 14, style: { color: "var(--c-orange)" } }),
                        /* @__PURE__ */ jsx("span", { children: "Висока тепловіддача" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--c-text2)", fontSize: "0.875rem" }, children: [
                        /* @__PURE__ */ jsx(Droplets, { size: 14, style: { color: "#22c55e" } }),
                        /* @__PURE__ */ jsx("span", { children: "Вологість < 8%" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid var(--color-border-subtle)"
                    }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "category-card-mobile-badge", style: { display: "none", color: "#22c55e", fontSize: "0.9rem", fontWeight: 700, marginBottom: 4 }, children: "✔ В наявності" }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-orange)" }, children: product.price }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)", marginLeft: 4 }, children: "грн / тонна" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOrderProduct(product);
                          },
                          className: "nh-btn-primary",
                          style: {
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            background: "var(--c-orange)",
                            color: "#fff",
                            fontWeight: "bold"
                          },
                          children: "Замовити"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            )
          },
          product.id
        ))
      }
    )
  ] }) });
}
function ComparisonTable() {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "60px 0 100px" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `nh-card reveal ${visible ? "visible" : ""}`, style: { padding: "3rem", borderRadius: "24px", overflowX: "auto" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2rem", textAlign: "center" }, children: "Порівняння паливних брикетів" }),
    /* @__PURE__ */ jsxs("table", { style: { width: "100%", minWidth: 600, borderCollapse: "collapse", textAlign: "left", color: "var(--c-text)" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid var(--color-border-subtle)" }, children: [
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Тип" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Тепловіддача" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Горіння" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Вологість" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid var(--color-border-subtle)" }, children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", fontWeight: 700 }, children: "RUF" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "висока" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "довге" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "6-8%" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid var(--color-border-subtle)" }, children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", fontWeight: 700 }, children: "Pini Kay" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-orange)", fontWeight: 600 }, children: "дуже висока" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "дуже довге" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "5-7%" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", fontWeight: 700 }, children: "Nestro" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "висока" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "рівномірне" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "6-8%" })
        ] })
      ] })
    ] })
  ] }) }) });
}
function BriquettesSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити паливні брикети у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Паливні брикети — це сучасна та високоефективна альтернатива традиційним ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дровам" }),
          ". Вони виготовляються шляхом пресування тирси, тріски та інших деревних відходів без додавання будь-якої хімії. Завдяки високому тиску при виробництві, брикети мають надзвичайно низьку вологість (до 8%) та величезну щільність, що робить їх безпечнішою та чистішою альтернативою, ніж ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "кам'яне вугілля" }),
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Це означає, що їх тепловіддача значно перевищує тепловіддачу навіть найсухіших дубових дров. Вони горять довго, стабільно і майже не залишають золи." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1.5rem" }, children: "Окрім чудових теплових характеристик, брикети надзвичайно зручні у зберіганні. Вони акуратно спаковані на піддонах або в упаковках по 10 кг, не засмічують приміщення корою чи пилом." }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Компанія «КиївБрикет» пропонує брикети найвищої якості стандартів RUF, Pini Kay та Nestro з доставкою по Києву та Київській області автотранспортом надійно та швидко." })
      ] })
    ] })
  ] }) }) });
}
function CrossCategoryBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "0 0 60px 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "700" }, children: "Також дивіться" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "nowrap", gap: "0.5rem", overflowX: "auto", paddingBottom: "8px", WebkitOverflowScrolling: "touch", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/catalog/drova",
          style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-border-subtle)",
            color: "var(--c-text)",
            textDecoration: "none",
            fontSize: "1rem",
            transition: "all 0.2s",
            background: "var(--color-bg-elevated)",
            gap: "0.75rem"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "var(--c-orange)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "→" }),
            "Дрова для опалення"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/catalog/vugillya",
          style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-border-subtle)",
            color: "var(--c-text)",
            textDecoration: "none",
            fontSize: "1rem",
            transition: "all 0.2s",
            background: "var(--color-bg-elevated)",
            gap: "0.75rem"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "var(--c-orange)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "→" }),
            "Кам'яне вугілля"
          ]
        }
      )
    ] })
  ] }) }) });
}
function PopularQueriesSection$1() {
  const { ref, visible } = useReveal();
  const queries = [
    { name: "брикети RUF Київ", url: "/catalog/brikety" },
    { name: "паливні брикети Київ", url: "/catalog/brikety" },
    { name: "купити брикети Київ", url: "/catalog/brikety" },
    { name: "брикети pini kay Київ", url: "/catalog/brikety" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)", background: "rgba(20,25,30,0.3)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "600" }, children: "Популярні запити:" }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "nowrap", gap: "0.5rem", overflowX: "auto", paddingBottom: "8px", WebkitOverflowScrolling: "touch", justifyContent: "center" }, children: queries.map((q, idx) => /* @__PURE__ */ jsxs(
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
          /* @__PURE__ */ jsx(Flame, { size: 14, style: { opacity: 0.5 } }),
          q.name
        ]
      },
      idx
    )) })
  ] }) }) });
}
function FaqSection$1() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Що краще — брикети чи дрова?", a: "Все залежить від ваших потреб. Брикети виграють завдяки більшій тепловіддачі та компактності зберігання. Вони горять довше і не стріляють іскрами. Дрова — це класика, створюють гарне полум'я та затишок. Багато хто комбінує: розпалює дровами, а на ніч закладає брикети для тривалого тління." },
    { q: "Які брикети дають більше тепла?", a: "Брикети Pini Kay (з отвором посередині) вважаються лідерами за рівнем тепловіддачі через додаткове випалювання кірки. RUF та Nestro також мають високі показники, проте Pini Kay розгораються швидше та горять найбільш яскраво та жарко." },
    { q: "Скільки брикетів потрібно на зиму?", a: "Для будинку в 100 кв.м. з середньою утепленістю, як правило, достатньо від 3 до 5 тонн паливних брикетів на весь опалювальний сезон. Це значно менше за об'ємом, ніж дрова, де б знадобилося близько 10-15 складометрів." },
    { q: "Чи можна топити брикетами камін?", a: "Так, звісно! Навіть рекомендується. Nestro і Pini Kay ідеально підходять для каміна, оскільки вони не іскрять, мають гарне полум'я і не забивають димохід сажею завдяки дуже низькій вологості. RUF теж підійдуть, але вони горять менш естетично в порівнянні з іншими." }
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
function FinalCtaBanner$1({ onQuickOrderClick }) {
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
            "Замовте паливні брикети ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Доставка по Києву можлива вже сьогодні. Чесний об'єм та гарантія якості від виробника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: onQuickOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: "Замовити" }),
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
function PopularBriquetteTypes() {
  const types = [
    { name: "Брикети RUF", url: "/catalog/brikety#ruf" },
    { name: "Брикети Pini Kay", url: "/catalog/brikety#pini-kay" },
    { name: "Брикети Nestro", url: "/catalog/brikety#nestro" },
    { name: "Деревні брикети", url: "/catalog/brikety" }
  ];
  return /* @__PURE__ */ jsx("section", { style: { padding: "0 0 60px 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { padding: "1.5rem 2rem", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border-subtle)" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", color: "var(--c-text)" }, children: "Популярні типи брикетів" }),
    /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "1.5rem" }, children: types.map((type, idx) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: "4px", height: "4px", borderRadius: "50%", background: "var(--c-orange)" } }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: type.url,
          style: { color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s", fontSize: "0.95rem" },
          onMouseEnter: (e) => e.currentTarget.style.color = "var(--c-text)",
          onMouseLeave: (e) => e.currentTarget.style.color = "var(--c-text2)",
          children: type.name
        }
      )
    ] }, idx)) })
  ] }) }) });
}
function BriquettesCategoryPage({ products, onOrderProduct }) {
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", children: [
    /* @__PURE__ */ jsx(HeroCategory$1, { onQuickOrderClick: () => onOrderProduct(null) }),
    /* @__PURE__ */ jsx(CategoryProducts$1, { products, onOrderProduct }),
    /* @__PURE__ */ jsx(BriquetteTypesSection, {}),
    /* @__PURE__ */ jsx(PopularBriquetteTypes, {}),
    /* @__PURE__ */ jsx(ComparisonTable, {}),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => onOrderProduct(null), defaultFuelType: "brikety" }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    /* @__PURE__ */ jsx(BriquettesSeoBlock, {}),
    /* @__PURE__ */ jsx(CrossCategoryBlock, {}),
    /* @__PURE__ */ jsx(PopularQueriesSection$1, {}),
    /* @__PURE__ */ jsx(FaqSection$1, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner$1, { onQuickOrderClick: () => onOrderProduct(null) })
  ] });
}
function HeroCategory({ onQuickOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(5px, 2vw, 40px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "24px" }, children: [
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
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Вугілля" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2rem, 5.5vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "clamp(0.1rem, 1vw, 0.25rem)", color: "#fff" }, children: [
          "Купити вугілля ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "у Києві" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "clamp(0.85rem, 3.2vw, 18px)",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "100%",
          marginBottom: "clamp(0.65rem, 2.5vw, 1.5rem)",
          fontWeight: 400
        }, children: "Якісне кам'яне вугілля для котлів та печей з доставкою по Києву та області." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "1.5rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onQuickOrderClick,
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
                "Замовити вугілля",
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
            " чесний об'єм"
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
function HowToChooseCoalSection() {
  const { ref, visible } = useReveal();
  const types = [
    {
      title: "Фракція",
      desc: "Розмір шматків вугілля. Для автоматичних котлів використовують дрібні фракції (13-25 мм), для класичних печей — крупніше вугілля (25-50 мм), що не провалюється крізь колосники."
    },
    {
      title: "Теплотворність",
      desc: "Кількість тепла, що виділяється при згорянні. Чим вищий цей показник (наприклад, як у антрациту), тим рідше доведеться завантажувати котел і тим більша економія палива."
    },
    {
      title: "Тип котла",
      desc: "Дізнайтесь вимоги виробника вашого обладнання. Автоматизовані системи дуже чутливі до розміру гранул та зольності, тоді як звичайні твердопаливні котли більш універсальні."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 8vw, 80px) 0 clamp(20px, 4vw, 40px)" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2", children: "Як вибрати вугілля для опалення" }) }),
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }, children: types.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "nh-card hover-glow", style: { padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%", borderRadius: "16px" }, children: [
      /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--c-orange)" }, children: t.title }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", lineHeight: 1.6, flex: 1, margin: 0, fontSize: "0.95rem" }, children: t.desc })
    ] }, i)) })
  ] }) });
}
function CategoryProducts({ products, onOrderProduct }) {
  const { ref, visible } = useReveal();
  const [selectedType, setSelectedType] = useState("Усі");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedType !== "Усі") {
      list = list.filter((p) => p.name.toLowerCase().includes(selectedType.toLowerCase()));
    }
    switch (sortOrder) {
      case "price_asc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceB - priceA;
        });
        break;
    }
    return list;
  }, [products, selectedType, sortOrder]);
  return /* @__PURE__ */ jsx("section", { ref, className: "catalog-section", style: { paddingTop: "0px", paddingBottom: "100px", position: "relative", zIndex: 10 }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: {
      position: "relative",
      zIndex: 50,
      display: "flex",
      flexWrap: "nowrap",
      gap: "0.25rem",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "2rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 25, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Вид:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsFilterOpen(!isFilterOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                minWidth: "60px",
                maxWidth: "120px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: selectedType }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "8px", transform: `rotate(${isFilterOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isFilterOpen && /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "160px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: ["Усі", "Антрацит", "Кам'яне"].map((type) => {
            const isActive = selectedType === type;
            const typeKey = type;
            return /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSelectedType(typeKey === "Усі" ? "Усі" : typeKey);
                  setIsFilterOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: isActive ? "var(--c-orange)" : "var(--c-text)", background: isActive ? "rgba(255,255,255,0.02)" : "transparent" },
                children: type
              },
              type
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 20, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Сортування:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsSortOpen(!isSortOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                maxWidth: "180px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: sortOrder === "popular" ? "За популярністю" : sortOrder === "price_asc" ? "Від дешевих до дорогих" : "Від дорогих до дешевих" }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "12px", transform: `rotate(${isSortOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isSortOpen && /* @__PURE__ */ jsxs("div", { style: {
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "220px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("popular");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "popular" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "popular" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "За популярністю"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_asc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_asc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_asc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дешевих до дорогих"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_desc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_desc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_desc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дорогих до дешевих"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify(filteredProducts.map((p) => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.name,
        "image": p.image_url ? p.image_url.startsWith("http") ? p.image_url : `https://kievbriket.com${p.image_url}` : void 0,
        "description": p.description || p.name,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "UAH",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "url": `https://kievbriket.com/catalog/vugillya/${p.slug}`
        }
      })))
    } }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `product-grid reveal ${visible ? "visible" : ""}`,
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          gap: "24px",
          transitionDelay: "0.2s"
        },
        children: filteredProducts.map((product) => /* @__PURE__ */ jsx(
          Link,
          {
            to: `/catalog/vugillya/${product.slug}`,
            className: "product-card-link",
            style: { textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" },
            children: /* @__PURE__ */ jsxs(
              "article",
              {
                className: "nh-card hover-glow group",
                style: {
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "16px"
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "product-card-image", style: { height: "300px", width: "100%", position: "relative", overflow: "hidden", background: "#0a0d14" }, children: [
                    product.image_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.image_url.startsWith("http") ? product.image_url : `${api.defaults.baseURL}${product.image_url}`,
                        alt: `${product.name} Київ`,
                        loading: "lazy",
                        style: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.7s ease"
                        },
                        className: "group-hover:scale-105"
                      }
                    ) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }, children: "Немає фото" }),
                    /* @__PURE__ */ jsx("div", { style: {
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10,13,20,0.8) 0%, transparent 60%)",
                      pointerEvents: "none"
                    } }),
                    /* @__PURE__ */ jsx("h3", { className: "product-card-title-overlay", style: { fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.3 }, children: product.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "product-card-body", style: { padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1, background: "#161C25" }, children: [
                    /* @__PURE__ */ jsxs("div", { className: "product-card-title-static", style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem", flexShrink: 0 }, children: [
                      /* @__PURE__ */ jsx("h3", { className: "h3", style: { margin: 0 }, children: product.name }),
                      /* @__PURE__ */ jsx("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#22C55E",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "40px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        flexShrink: 0,
                        boxShadow: "0 0 10px rgba(34,197,94,0.4)"
                      }, children: "✔ В наявності" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--c-text2)", fontSize: "0.875rem" }, children: [
                        /* @__PURE__ */ jsx(Zap, { size: 14, style: { color: "var(--c-orange)" } }),
                        /* @__PURE__ */ jsx("span", { children: "Висока теплотворність" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--c-text2)", fontSize: "0.875rem" }, children: [
                        /* @__PURE__ */ jsx(Thermometer, { size: 14, style: { color: "#22c55e" } }),
                        /* @__PURE__ */ jsx("span", { children: "Довге горіння" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid var(--color-border-subtle)"
                    }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "category-card-mobile-badge", style: { display: "none", color: "#22c55e", fontSize: "0.9rem", fontWeight: 700, marginBottom: 4 }, children: "✔ В наявності" }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-orange)" }, children: product.price }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)", marginLeft: 4 }, children: "грн / тонна" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOrderProduct(product);
                          },
                          className: "nh-btn-primary",
                          style: {
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            background: "var(--c-orange)",
                            color: "#fff",
                            fontWeight: "bold"
                          },
                          children: "Замовити"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            )
          },
          product.id
        ))
      }
    )
  ] }) });
}
function PopularTypesBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "0 0 100px 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "clamp(1.5rem, 5vw, 4rem)", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Популярні види вугілля" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Для різних потреб опалення використовуються ",
          /* @__PURE__ */ jsx("strong", { children: "різні фракції вугілля" }),
          ". Більш дрібні фракції ідеальні для автоматичних котлів, тоді як крупне вугілля добре підходить для класичних печей та твердопаливних котлів, забезпечуючи тривале та рівномірне горіння."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ jsx("strong", { children: "Антрацит" }),
          " — це вугілля найвищої якості. Воно відрізняється максимальною теплотворністю, низьким вмістом золи та мінімальним виділенням диму. Це робить його найкращим вибором для обігріву приватних будинків."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Правильне ",
          /* @__PURE__ */ jsx("strong", { children: "використання для котлів" }),
          " гарантує не лише тепло у вашій оселі, але й подовжує термін служби обладнання. Вибираючи якісне паливо, ви зменшуєте витрати на обслуговування котла та підвищуєте ефективність підігріву."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Для альтернативного опалення також часто використовують ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дрова" }),
          " або ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "паливні брикети" }),
          ". Комбінування різних видів палива дозволяє досягти оптимального балансу ціни та ефективності."
        ] })
      ] })
    ] })
  ] }) }) });
}
function CoalSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити кам'яне вугілля у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Шукаєте надійне та економне джерело тепла? Пропонуємо ",
          /* @__PURE__ */ jsx("strong", { children: "купити вугілля київ" }),
          " за вигідними цінами. Наше вугілля має високу теплотворність, довго горить та залишає мінімум золи, що робить його ідеальним вибором як для побутових, так і для промислових потреб."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Ми постачаємо гарантовано якісне ",
          /* @__PURE__ */ jsx("strong", { children: "кам'яне вугілля" }),
          ", яке проходить ретельний контроль вологості та зольності. Незалежно від того, чи потрібне вам паливо для невеликого домашнього котла, чи для великої котельні, ми запропонуємо найкращий з актуальних варіант."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Особливим попитом користується ",
          /* @__PURE__ */ jsx("strong", { children: "антрацит" }),
          " — преміальне паливо, що забезпечує максимальну температуру та відсутність диму при горінні. Замовляючи у нас, ви гарантовано отримуєте чесну вагу з доставкою."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Також у нашому асортименті доступні й інші види твердого палива. Ви завжди можете обрати класичні ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дрова" }),
          " або спробувати зручні ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "паливні брикети" }),
          ", які відмінно доповнюють або замінюють вугілля у деяких котлах."
        ] })
      ] })
    ] })
  ] }) }) });
}
function PopularQueriesSection() {
  const { ref, visible } = useReveal();
  const queries = [
    { name: "вугілля київ", url: "/catalog/vugillya" },
    { name: "купити вугілля київ", url: "/catalog/vugillya" },
    { name: "антрацит київ", url: "/catalog/vugillya" },
    { name: "кам'яне вугілля доставка", url: "/catalog/vugillya" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)", background: "rgba(20,25,30,0.3)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "600" }, children: "Популярні запити:" }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "nowrap", gap: "0.5rem", overflowX: "auto", paddingBottom: "8px", WebkitOverflowScrolling: "touch", justifyContent: "center" }, children: queries.map((q, idx) => /* @__PURE__ */ jsxs(
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
          /* @__PURE__ */ jsx(Flame, { size: 14, style: { opacity: 0.5 } }),
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
    { q: "Яке вугілля краще для котла?", a: "Для більшості класичних твердопаливних котлів найкраще підходить кам'яне вугілля середніх та крупних фракцій, а також антрацит. Антрацит горить довше та дає найбільше тепла, але для його розпалу необхідна вища температура. Кам'яне вугілля легше розгоряється і підходить для систем з меншою тягою." },
    { q: "Яка фракція вугілля потрібна?", a: "Фракція підбирається під тип котла. Для автоматичних котлів зі шнековою подачею використовується 'горішок' або дрібні фракції (13-25 мм). Для котлів з ручним завантаженням та класичних печей краще брати більш крупне вугілля (фракція 25-50 мм і більше), оскільки воно не провалюється крізь колосники." },
    { q: "Чи можна замовити вугілля з доставкою сьогодні?", a: "Так, за наявності вільного транспорту ми можемо організувати доставку в день замовлення. У піковий сезон термін доставки може становити 1-2 дні. Будь ласка, уточнюйте можливість термінової доставки у нашого менеджера по телефону." },
    { q: "Скільки коштує тонна вугілля?", a: "Ціна за тонну варіюється залежно від марки та фракції вугілля. Наприклад, класичне кам'яне вугілля коштує дешевше, ніж високоякісний антрацит. Зверніть увагу на актуальні ціни у нашому каталозі. Для оптових замовлень ми пропонуємо індивідуальні знижки." }
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
function FinalCtaBanner({ onQuickOrderClick }) {
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
            "Замовте вугілля ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Доставка по Києву та області. Чесний об'єм та гарантія якості від перевіреного постачальника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: onQuickOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: "Замовити вугілля" }),
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
function CoalCategoryPage({ products, onOrderProduct }) {
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", children: [
    /* @__PURE__ */ jsx(HeroCategory, { onQuickOrderClick: () => onOrderProduct(null) }),
    /* @__PURE__ */ jsx(CategoryProducts, { products, onOrderProduct }),
    /* @__PURE__ */ jsx(HowToChooseCoalSection, {}),
    /* @__PURE__ */ jsx(PopularTypesBlock, {}),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => onOrderProduct(null), defaultFuelType: "vugillya" }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    /* @__PURE__ */ jsx(CoalSeoBlock, {}),
    /* @__PURE__ */ jsx(PopularQueriesSection, {}),
    /* @__PURE__ */ jsx(FaqSection, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner, { onQuickOrderClick: () => onOrderProduct(null) })
  ] });
}
function sortProducts(arr, mode) {
  const copy = [...arr];
  if (mode === "price_asc") return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (mode === "price_desc") return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  return copy;
}
function Catalog({ predefinedCategory }) {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const { categories, loading: categoriesLoading } = useCategories();
  const categoryQuery = searchParams.get("category");
  const activeCategorySlug = predefinedCategory || categorySlug || categoryQuery;
  const ssgData = useSSGData();
  const ssgProducts = useMemo(() => {
    if (!ssgData?.products) return [];
    const items = Array.isArray(ssgData.products) ? ssgData.products : ssgData.products.items || [];
    if (activeCategorySlug) {
      return items.filter((p) => p.category === activeCategorySlug);
    }
    return items;
  }, [ssgData, activeCategorySlug]);
  const [products, setProducts] = useState(ssgProducts);
  const [loading, setLoading] = useState(true);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Усі");
  const [sortMode, setSortMode] = useState("popular");
  const oldSlugMap = {
    "firewood": "drova",
    "briquettes": "brikety",
    "coal": "vugillya"
  };
  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);
  const seo = useMemo(() => {
    if (!activeCategory) return {};
    const cat = activeCategory;
    const fallbackDesc = cat.seo_text ? cat.seo_text.replace(/<[^>]*>/g, "").substring(0, 160) : void 0;
    return {
      title: activeCategorySlug === "drova" ? "Купити дрова в Києві — колоті дрова з доставкою | КиєвБрикет" : activeCategorySlug === "brikety" ? "Паливні брикети купити в Києві — ціна за тонну | КиєвБрикет" : cat.meta_title || `${cat.name} — купити з доставкою по Києву`,
      description: activeCategorySlug === "drova" ? "Купити дрова в Києві з доставкою. Колоті дрова: дуб, граб, акація, ясен. Чесний складометр, власний автопарк — ГАЗель, ЗІЛ, КАМАЗ. Доставка по Києву та області." : activeCategorySlug === "brikety" ? "Купити паливні брикети в Києві з доставкою. Pini Kay, RUF, Nestro, торфобрикети та пелети. Висока тепловіддача, чесна ціна за тонну. Доставка по Києву та області." : cat.meta_description || fallbackDesc,
      ogDescription: activeCategorySlug === "drova" ? "Купити дрова в Києві з доставкою. Дуб, граб, акація, ясен. Чесний складометр." : activeCategorySlug === "brikety" ? "Паливні брикети з доставкою по Києву. Pini Kay, RUF, Nestro, торфобрикети та пелети." : cat.meta_description || fallbackDesc,
      h1: cat.seo_h1 || cat.name,
      ogImage: cat.og_image || cat.image_url,
      canonical: cat.canonical_url || void 0
    };
  }, [activeCategory]);
  useEffect(() => {
    setLoading(true);
    setActiveFilter("Усі");
    window.scrollTo(0, 0);
    api.get("/products/", { params: { category: activeCategorySlug } }).then((response) => {
      const data = response.data;
      const fetched = Array.isArray(data) ? data : data.items || [];
      if (fetched.length > 0) setProducts(fetched);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeCategorySlug]);
  const handleOrder = useCallback((product = null) => {
    setOrderProduct(product);
    setIsOrderFormOpen(true);
  }, []);
  activeCategory ? seo.h1 || activeCategory.name : "Каталог";
  const displayedProducts = useMemo(() => {
    let filtered = products;
    if (activeFilter !== "Усі") {
      filtered = products.filter(
        (p) => p.name?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    return sortProducts(filtered, sortMode);
  }, [products, activeFilter, sortMode]);
  if (oldSlugMap[activeCategorySlug]) {
    return /* @__PURE__ */ jsx(Navigate, { to: `/catalog/${oldSlugMap[activeCategorySlug]}`, replace: true });
  }
  if (!activeCategory && !loading && !categoriesLoading) {
    return /* @__PURE__ */ jsx(NotFound, {});
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "new-home-scope",
      style: {
        minHeight: "100vh",
        background: "var(--c-bg)",
        color: "var(--c-text)",
        fontFamily: "var(--font-outfit)",
        paddingTop: "64px"
      },
      children: [
        activeCategory && /* @__PURE__ */ jsxs(
          SEOHead,
          {
            title: seo.title,
            description: seo.description,
            ogDescription: seo.ogDescription,
            ogImage: seo.ogImage,
            canonical: seo.canonical,
            robots: seo.robots,
            children: [
              activeCategorySlug === "drova" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "uk", href: "https://kievbriket.com/catalog/drova" }),
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: "https://kievbriket.com/catalog/drova" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Купити дрова в Києві — колоті дрова з доставкою" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Дрова дуб, граб, акація, ясен з доставкою по Києву та області." }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://kievbriket.com/media/categories/firewood.webp" }),
                /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: `
{
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 "name": "Дрова",
 "url": "https://kievbriket.com/catalog/drova",
 "description": "Купити дрова в Києві з доставкою. Дуб, граб, акація, ясен.",
 "isPartOf": {
   "@type": "WebSite",
   "name": "КиєвБрикет",
   "url": "https://kievbriket.com"
 }
}
                                ` })
              ] }),
              activeCategorySlug === "brikety" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "uk", href: "https://kievbriket.com/catalog/brikety" }),
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: "https://kievbriket.com/catalog/brikety" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Паливні брикети купити в Києві — ціна за тонну" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Pini Kay, RUF, Nestro, торфобрикети та пелети з доставкою по Києву та області." }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://kievbriket.com/media/products/ruf.webp" }),
                /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: `
{
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 "name": "Паливні брикети",
 "url": "https://kievbriket.com/catalog/brikety",
 "description": "Купити паливні брикети в Києві з доставкою. Pini Kay, RUF, Nestro, торфобрикети та пелети.",
 "isPartOf": {
   "@type": "WebSite",
   "name": "КиєвБрикет",
   "url": "https://kievbriket.com"
 }
}
                                ` })
              ] })
            ]
          }
        ),
        activeCategorySlug === "brikety" ? /* @__PURE__ */ jsx(
          BriquettesCategoryPage,
          {
            products: displayedProducts,
            onOrderProduct: handleOrder,
            activeCategory
          }
        ) : activeCategorySlug === "vugillya" ? /* @__PURE__ */ jsx(
          CoalCategoryPage,
          {
            products: displayedProducts,
            onOrderProduct: handleOrder,
            activeCategory
          }
        ) : /* @__PURE__ */ jsx(
          FirewoodCategoryPage,
          {
            products: displayedProducts,
            seo,
            onOrderProduct: handleOrder,
            activeCategory,
            activeCategorySlug
          }
        ),
        /* @__PURE__ */ jsx(
          OrderFormModal,
          {
            isOpen: isOrderFormOpen,
            onClose: () => {
              setIsOrderFormOpen(false);
              setOrderProduct(null);
            },
            product: orderProduct
          }
        )
      ]
    }
  );
}
export {
  Catalog as default
};
//# sourceMappingURL=Catalog-wX5jCCBX.js.map
