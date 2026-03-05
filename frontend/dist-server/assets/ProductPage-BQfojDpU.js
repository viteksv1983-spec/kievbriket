import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Flame, CheckCircle2, Ruler, Scale, Truck, ArrowRight, ChevronRight, ChevronDown } from "lucide-react";
import { d as useSSGData, c as useCategories, b as api, a as getImageUrl, S as SEOHead, e as getCategoryUrl, O as OrderFormModal } from "../entry-server.js";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
function DeliveryOptionsDrova() {
  const cardPad = { padding: "clamp(1.5rem, 5vw, 2.5rem)", borderRadius: "20px" };
  const getImgUrl = (filename) => {
    return `/images/delivery/${filename}`;
  };
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2.5rem" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { ...cardPad, background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: 800 }, children: "Варіанти доставки дров (доставка дров Київ)" }),
      /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", marginBottom: "2rem", lineHeight: 1.6 }, children: [
        "Швидка та надійна ",
        /* @__PURE__ */ jsx("strong", { children: "доставка дров (Київ та Київська область)" }),
        ". Ми доставляємо власним транспортом, тому тип автомобіля підбирається залежно від обсягу вашого замовлення."
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem"
      }, children: [
        { title: "ГАЗель (бортова)", vol: "4–5 складометрів", price: "1500 грн", desc: "Оптимально для невеликих замовлень дров.", img: "gazel-dostavka-driv-kyiv.webp" },
        { title: "ЗІЛ самоскид", vol: "до 4 складометрів", price: "3000 грн", desc: "Найпопулярніший варіант доставки колотих дров.", img: "zil-dostavka-driv-kyiv.webp" },
        { title: "КАМАЗ самоскид", vol: "до 8–10 складометрів", price: "4000 грн", desc: "Підходить для великих замовлень дров.", img: "kamaz-dostavka-driv-kyiv.webp" }
      ].map((v, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { aspectRatio: "16/9", overflow: "hidden", background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)", padding: "1rem" }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: getImgUrl(v.img),
                alt: `Доставка дров машиною ${v.title} Київ`,
                width: "200",
                height: "113",
                loading: "lazy",
                style: { width: "100%", height: "100%", objectFit: "contain" }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { style: { padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }, children: [
              /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "0.25rem" }, children: v.title }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: "0.85rem", color: "var(--c-text2)", fontWeight: 600, marginBottom: "0.5rem" }, children: [
                "Обсяг: ",
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)" }, children: v.vol })
              ] }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.85rem", color: "var(--c-text2)", lineHeight: 1.4, flex: 1, margin: 0, marginBottom: "0.75rem" }, children: v.desc }),
              /* @__PURE__ */ jsx("div", { style: { paddingTop: "0.75rem", borderTop: "1px solid var(--color-border-subtle)", marginTop: "auto" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "1.1rem", fontWeight: 800, color: "var(--c-orange)" }, children: v.price }) })
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { ...cardPad, background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 800 }, children: "Спецтехніка для розвантаження дров" }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem"
      }, children: [
        { title: "Кран-маніпулятор", desc: "Для складних умов розвантаження дров (вузькі заїзди, паркани, обмежений доступ).", price: "від 4500 грн", img: "manipulator-dostavka-kyiv.webp" },
        { title: "Гідроборт / рокла", desc: "Для розвантаження палет або важких упаковок дров.", price: "від 4500 грн", img: "gidrobort-rokla-dostavka-kyiv.webp" }
      ].map((eq, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { aspectRatio: "16/9", overflow: "hidden", background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)", padding: "1rem" }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: getImgUrl(eq.img),
                alt: `Спецтехніка ${eq.title} для розвантаження дров Київ`,
                width: "200",
                height: "113",
                loading: "lazy",
                style: { width: "100%", height: "100%", objectFit: "contain" }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { style: { padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }, children: [
              /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "0.5rem" }, children: eq.title }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.85rem", color: "var(--c-text2)", lineHeight: 1.4, flex: 1, margin: 0, marginBottom: "0.75rem" }, children: eq.desc }),
              /* @__PURE__ */ jsx("div", { style: { paddingTop: "0.75rem", borderTop: "1px solid var(--color-border-subtle)", marginTop: "auto" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "1.1rem", fontWeight: 800, color: "var(--c-orange)" }, children: eq.price }) })
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "2rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: "20px" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.25rem" }, children: "Доставка дров по Києву" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", fontSize: "0.95rem", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Компанія КиївБрикет здійснює доставку колотих дров по Києву та Київській області власним транспортом." }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Ми використовуємо різні типи автомобілів залежно від обсягу замовлення: ГАЗель, ЗІЛ або КАМАЗ." }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1.5rem" }, children: "Для великих замовлень або складних умов розвантаження доступна спеціальна техніка: кран-маніпулятор або автомобілі з гідробортом." }),
        /* @__PURE__ */ jsxs("p", { style: { margin: 0 }, children: [
          "Детальні умови доставки дивіться на сторінці: ",
          /* @__PURE__ */ jsx(Link, { to: "/dostavka", style: { color: "var(--c-orange)", textDecoration: "none", fontWeight: 600 }, children: "доставка дров по Києву" })
        ] })
      ] })
    ] })
  ] });
}
function ProductPage() {
  const { categorySlug, productSlug } = useParams();
  const ssgData = useSSGData();
  const ssgProduct = ssgData?.products ? (() => {
    const items = Array.isArray(ssgData.products) ? ssgData.products : ssgData.products.items || [];
    return items.find((p) => p.slug === productSlug) || null;
  })() : null;
  const ssgRelated = ssgProduct && ssgData?.products ? (() => {
    const items = Array.isArray(ssgData.products) ? ssgData.products : ssgData.products.items || [];
    return items.filter((p) => p.category === ssgProduct.category && p.slug !== ssgProduct.slug).slice(0, 3);
  })() : [];
  const [product, setProduct] = useState(ssgProduct);
  const [relatedProducts, setRelatedProducts] = useState(ssgRelated);
  const [loading, setLoading] = useState(!ssgProduct);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(ssgProduct?.variants?.[0] || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const { categories } = useCategories();
  const oldSlugMap = {
    "firewood": "drova",
    "briquettes": "brikety",
    "coal": "vugillya"
  };
  const specs = product ? [
    { icon: /* @__PURE__ */ jsx(Flame, { size: 17, color: "var(--c-orange)" }), label: "Порода", value: product.ingredients || (product.name.toLowerCase().includes("дуб") ? "Дуб" : product.name.toLowerCase().includes("сосн") ? "Сосна" : product.name.toLowerCase().includes("граб") ? "Граб" : product.category === "brikety" ? "Деревна тирса" : "Тверді породи") },
    { icon: /* @__PURE__ */ jsx(CheckCircle2, { size: 17, color: "var(--c-orange)" }), label: "Тип", value: product.category === "drova" ? "Колоті" : product.category === "brikety" ? "Пресовані" : "Сипуче" },
    product.category === "brikety" ? { icon: /* @__PURE__ */ jsx(Ruler, { size: 17, color: "var(--c-orange)" }), label: "Форма брикетів", value: product.name.toLowerCase().includes("ruf") ? "Прямокутні пресовані" : product.name.toLowerCase().includes("pini") ? "Восьмигранні з отвором" : product.name.toLowerCase().includes("nestro") ? "Циліндричні" : product.name.toLowerCase().includes("пелет") ? "Гранули 6-8 мм" : "Пресований торф" } : { icon: /* @__PURE__ */ jsx(Ruler, { size: 17, color: "var(--c-orange)" }), label: "Довжина полін", value: product.category === "drova" ? "30-40 см" : "—" },
    { icon: /* @__PURE__ */ jsx(Scale, { size: 17, color: "var(--c-orange)" }), label: "Фасування", value: product.category === "drova" ? "Складометр" : "У пакуваннях / піддонах" },
    { icon: /* @__PURE__ */ jsx(Flame, { size: 17, color: "var(--c-orange)" }), label: "Вологість", value: product.shelf_life || (product.category === "drova" ? "Природна (До 25%)" : product.category === "brikety" ? "до 10%" : "До 8%") },
    { icon: /* @__PURE__ */ jsx(Truck, { size: 17, color: "var(--c-orange)" }), label: "Доставка", value: "По Києву та області" }
  ] : [];
  const faqs = product ? product.category === "brikety" ? [
    { q: `Які брикети краще для опалення?`, a: `Для максимальної тепловіддачі та тривалого горіння найкраще підходять дубові брикети RUF або Pini Kay. Якщо у вас котел тривалого горіння, Nestro також стануть чудовим вибором. Для автоматичних котлів використовують пелети.` },
    { q: `Скільки горять паливні брикети?`, a: `Залежно від типу котла та подачі кисню, брикети горять від 2 до 4 годин, після чого можуть тліти ще кілька годин, підтримуючи високу температуру.` },
    { q: `Чим брикети відрізняються від дров?`, a: `Брикети мають вищу щільність і набагато нижчу вологість (до 10%), тому вони віддають більше тепла. Крім того, вони займають менше місця при зберіганні та залишають значно менше попелу.` },
    { q: `Чи підходять брикети для камінів?`, a: `Так, особливо брикети RUF та Pini Kay. Вони горять рівним полум'ям, не іскрять і не виділяють зайвого диму, що робить їх ідеальними для відкритих та закритих камінів.` },
    { q: `Як замовити брикети з доставкою по Києву?`, a: `Оберіть потрібний тип та кількість брикетів на сайті, натисніть "Замовити", і наш менеджер зв'яжеться з вами для уточнення деталей доставки. Ми доставляємо власною технікою протягом 24 годин.` }
  ] : [
    { q: `Які дрова краще для опалення?`, a: `${product.ingredients || "Дубові"} дрова вважаються одними з найкращих для опалення завдяки високій щільності деревини та тривалому горінню. Вони дають стабільний жар і підходять для твердопаливних котлів, печей та камінів.` },
    { q: `Яка довжина полін у дров?`, a: `Стандартна довжина полін — 30-40 см. Це оптимальний розмір для більшості побутових котлів та печей.` },
    { q: `Скільки дров потрібно на зиму?`, a: `Для опалення будинку площею 100 м² на один опалювальний сезон потрібно приблизно 8-12 складометрів дров, залежно від утеплення та типу котла.` },
    { q: `Як відбувається доставка?`, a: `Доставка дров здійснюється власним автопарком: ГАЗель (2 склм), ЗІЛ (5 склм), КАМАЗ (10 склм). Також доступні гідроборт та кран-маніпулятор. Доставка по Києву та області протягом 24 годин.` },
    { q: `Який обʼєм складометра?`, a: `Складометр — це щільно укладене паливо в обʼємі 1×1×1 метр. Ми завжди гарантуємо чесний обʼєм при завантаженні автомобіля.` }
  ] : [];
  useEffect(() => {
    if (ssgProduct && !product?.slug?.length) return;
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveImageIndex(0);
    api.get(`/products/${productSlug}`).then((res) => {
      const found = res.data;
      setProduct(found);
      if (found?.variants?.length > 0) {
        setSelectedVariant(found.variants[0]);
      }
      api.get(`/products/?category=${found.category}&limit=5`).then((relRes) => {
        const relData = relRes.data;
        const items = Array.isArray(relData) ? relData : relData.items || [];
        const related = items.filter((p) => p.slug !== found.slug).slice(0, 3);
        setRelatedProducts(related);
      }).catch((err) => console.error("Failed to fetch related products:", err)).finally(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, [productSlug]);
  const category = categories.find((c) => c.slug === (categorySlug || product?.category));
  const PROD_DOMAIN = "https://kievbriket.com";
  const isSSG = !!ssgData;
  const imgBase = isSSG ? PROD_DOMAIN : api.defaults.baseURL;
  const originalMainImg = product?.image_url ? getImageUrl(product.image_url, imgBase) : "";
  const galleryImages = [originalMainImg].filter(Boolean);
  const displayPrice = selectedVariant ? selectedVariant.price : product?.price;
  product?.is_popular || true;
  if (oldSlugMap[categorySlug]) {
    return /* @__PURE__ */ jsx(Navigate, { to: `/catalog/${oldSlugMap[categorySlug]}/${productSlug}`, replace: true });
  }
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", style: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--c-bg)", fontFamily: "var(--font-outfit)" }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: 48, height: 48, border: "3px solid rgba(249,115,22,0.15)", borderTopColor: "var(--c-orange)", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }),
      /* @__PURE__ */ jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })
    ] });
  }
  if (!product) {
    return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--c-bg)", fontFamily: "var(--font-outfit)", gap: "1.5rem" }, children: [
      /* @__PURE__ */ jsx("h1", { className: "h2", children: "Товар не знайдено" }),
      /* @__PURE__ */ jsxs(Link, { to: "/catalog/drova", style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        color: "#fff",
        fontWeight: 700,
        borderRadius: 10,
        padding: "12px 24px",
        textDecoration: "none"
      }, children: [
        "До каталогу ",
        /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
      ] })
    ] });
  }
  const dynamicTitle = product.meta_title || `Купити ${product.name.toLowerCase()} з доставкою по Києву — ціна за складометр | КиївБрикет`;
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
        /* @__PURE__ */ jsx(
          SEOHead,
          {
            title: dynamicTitle,
            description: product.meta_description || product.description || `Замовляйте ${product.name.toLowerCase()} з швидкою доставкою по Києву та області.`,
            ogImage: product.og_image || product.image_url,
            canonical: product.canonical_url,
            productPrice: product.price,
            productCurrency: "UAH"
          }
        ),
        /* @__PURE__ */ jsx("div", { style: {
          background: "var(--color-bg-deep)",
          borderBottom: "1px solid var(--color-border-subtle)",
          padding: "1rem 0"
        }, children: /* @__PURE__ */ jsxs("nav", { style: {
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.8125rem",
          color: "var(--c-text2)"
        }, children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              style: { color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" },
              onMouseEnter: (e) => e.target.style.color = "var(--c-orange)",
              onMouseLeave: (e) => e.target.style.color = "var(--c-text2)",
              children: "Головна"
            }
          ),
          /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: category ? getCategoryUrl(category.slug) : product?.category === "drova" ? "/catalog/drova" : "/catalog",
              style: { color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" },
              onMouseEnter: (e) => e.target.style.color = "var(--c-orange)",
              onMouseLeave: (e) => e.target.style.color = "var(--c-text2)",
              children: category ? category.name : product?.category === "drova" ? "Дрова" : "Каталог"
            }
          ),
          /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }, children: product.name })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "product-mobile-title", style: { maxWidth: 1200, margin: "0 auto", padding: "1rem 1.5rem 0" }, children: /* @__PURE__ */ jsx("h1", { className: "h1", style: { fontSize: "clamp(22px, 5vw, 28px)", lineHeight: 1.15, margin: 0, fontWeight: 700 }, children: product.h1_heading || product.name }) }),
        /* @__PURE__ */ jsxs("section", { className: "product-main-content", style: { maxWidth: 1200, margin: "0 auto", padding: "var(--s-section) 1.5rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { position: "sticky", top: "6rem" }, children: [
              /* @__PURE__ */ jsx("div", { style: {
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "4/3",
                position: "relative",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-subtle)",
                marginBottom: "1rem"
              }, children: galleryImages.length > 0 ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: galleryImages[activeImageIndex],
                  alt: product.category === "drova" ? `${product.name} колоті дрова складометр доставка Київ` : product.h1_heading || product.name,
                  width: "600",
                  height: "450",
                  loading: activeImageIndex === 0 ? "eager" : "lazy",
                  decoding: "async",
                  style: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" },
                  onMouseEnter: (e) => window.innerWidth > 768 && (e.target.style.transform = "scale(1.05)"),
                  onMouseLeave: (e) => e.target.style.transform = "scale(1)"
                }
              ) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-text2)" }, children: "Немає фото" }) }),
              galleryImages.length > 1 && /* @__PURE__ */ jsx("div", { className: "product-thumbnails", style: { display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }, children: galleryImages.map((src, idx) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => window.innerWidth <= 768 && setActiveImageIndex(idx),
                  onMouseEnter: () => window.innerWidth > 768 && setActiveImageIndex(idx),
                  style: {
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    flexShrink: 0,
                    border: activeImageIndex === idx ? "2px solid var(--c-orange)" : "1px solid var(--color-border-subtle)",
                    background: "var(--color-bg-elevated)",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: 0,
                    transition: "border-color 0.2s"
                  },
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src,
                      alt: `мініатюра ${idx + 1}`,
                      width: "80",
                      height: "80",
                      loading: "lazy",
                      style: { width: "100%", height: "100%", objectFit: "cover" }
                    }
                  )
                },
                idx
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2rem" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "product-desktop-title", style: { display: "flex", flexDirection: "column", gap: "0.75rem" }, children: [
                /* @__PURE__ */ jsx("div", { className: "h1", style: { fontSize: "clamp(22px, 3vw, 36px)", lineHeight: 1.15, margin: 0, fontWeight: 700 }, children: product.h1_heading || product.name }),
                /* @__PURE__ */ jsxs("div", { className: "product-badges-row", style: { display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsx("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(34,197,94,0.15)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.35)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }, children: "• В наявності" }),
                  /* @__PURE__ */ jsx("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(255,115,0,0.15)",
                    color: "#ff7a18",
                    border: "1px solid rgba(255,115,0,0.35)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }, children: "• Популярний" })
                ] })
              ] }),
              product.variants?.length > 0 && /* @__PURE__ */ jsxs("div", { style: { paddingTop: "1.5rem", borderTop: "1px solid var(--color-border-subtle)" }, children: [
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", fontWeight: 700, color: "var(--c-text2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }, children: "Оберіть варіант" }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: product.variants.map((variant, idx) => {
                  const active = selectedVariant?.name === variant.name;
                  return /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setSelectedVariant(variant),
                      style: {
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: active ? "1px solid var(--c-orange)" : "1px solid var(--color-border-subtle)",
                        background: active ? "rgba(249,115,22,0.10)" : "var(--color-bg-elevated)",
                        color: active ? "var(--c-orange)" : "var(--c-text)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "border-color 0.2s, background 0.2s, color 0.2s",
                        fontFamily: "inherit"
                      },
                      children: variant.name
                    },
                    idx
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "product-price-block", style: {
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--color-border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem"
              }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  displayPrice > 1e3 && /* @__PURE__ */ jsxs("span", { className: "product-old-price", style: { fontSize: "1rem", color: "var(--c-text2)", textDecoration: "line-through", fontWeight: 600, display: "block", marginBottom: 4 }, children: [
                    Math.round(displayPrice * 1.15),
                    " грн"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "product-price-badge", style: {
                    display: "none",
                    alignItems: "center",
                    gap: 6,
                    color: "#22c55e",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    marginBottom: 6
                  }, children: "✔ В наявності" }),
                  /* @__PURE__ */ jsxs("p", { style: { display: "flex", alignItems: "baseline", gap: "8px", margin: 0, flexWrap: "wrap" }, children: [
                    /* @__PURE__ */ jsx("span", { style: { fontSize: "34px", fontWeight: 900, color: "var(--c-orange)", lineHeight: 1 }, children: displayPrice }),
                    /* @__PURE__ */ jsx("span", { style: { fontSize: "20px", fontWeight: 700, color: "var(--c-orange)" }, children: "грн" }),
                    /* @__PURE__ */ jsxs("span", { style: { fontSize: "18px", color: "var(--c-text2)", fontWeight: 500 }, children: [
                      "/ ",
                      product.category === "brikety" || product.category === "vugillya" ? "тонна" : "складометр"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "1.25rem", marginTop: "1rem" }, children: [
                    /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#22c55e" }, children: "•" }),
                      " Доставка сьогодні"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#22c55e" }, children: "•" }),
                      " Є на складі"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "product-cta-container", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "product-cta-btn",
                    onClick: () => setIsOrderFormOpen(true),
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      background: "linear-gradient(135deg, #f97316, #ea580c)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1.125rem",
                      border: "none",
                      borderRadius: 12,
                      padding: "18px 32px",
                      cursor: "pointer",
                      width: "100%",
                      boxShadow: "0 4px 20px rgba(249,115,22,0.30)",
                      transition: "box-shadow 0.2s",
                      fontFamily: "inherit"
                    },
                    onMouseEnter: (e) => e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.50)",
                    onMouseLeave: (e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.30)",
                    children: [
                      "🔥 ",
                      product.category === "brikety" ? "Замовити брикети" : product.category === "vugillya" ? "Замовити вугілля" : "Замовити дрова"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "0.25rem" }, children: [
                  "Доставка по Києву за 24 години",
                  "Чесний складометр",
                  "Оплата після отримання",
                  "Працюємо з 2013 року"
                ].map((item, idx) => /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: "0.9375rem", color: "var(--c-text)", fontWeight: 500 }, children: [
                  /* @__PURE__ */ jsx("div", { style: { background: "rgba(34,197,94,0.15)", borderRadius: "50%", padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CheckCircle2, { size: 14, color: "#22c55e" }) }),
                  item
                ] }, idx)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: "4rem" }, children: /* @__PURE__ */ jsxs("div", { className: "product-info-grid", style: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            alignItems: "start"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem" }, children: [
              /* @__PURE__ */ jsx("div", { className: "nh-card", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", rowGap: "1.5rem" }, children: specs.map((spec, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
                /* @__PURE__ */ jsx("div", { style: {
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: "var(--color-accent-soft)",
                  border: "1px solid rgba(249,115,22,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }, children: spec.icon }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "var(--c-text2)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }, children: spec.label }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9375rem", fontWeight: 700, color: "var(--c-text)", marginTop: 2 }, children: spec.value })
                ] })
              ] }, i)) }) }),
              /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16, display: "flex", flexDirection: "column", gap: "1rem" }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
                  /* @__PURE__ */ jsx("div", { style: {
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: "var(--color-accent-soft)",
                    border: "1px solid rgba(249,115,22,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }, children: /* @__PURE__ */ jsx(Truck, { size: 18, color: "var(--c-orange)" }) }),
                  /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", margin: 0 }, children: "Інформація про доставку" })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6, paddingLeft: 50 }, children: [
                  /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Локація:" }),
                    " Доставка по Києву та області"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Термін доставки:" }),
                    " 1 день"
                  ] }),
                  product.category === "drova" && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Мінімальне замовлення:" }),
                      " 1 складометр"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Автопарк:" }),
                      " ГАЗель, ЗІЛ, КАМАЗ"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Спецтехніка:" }),
                      " гідроборт, кран-маніпулятор"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(Link, { to: "/dostavka", style: { color: "var(--c-orange)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, marginTop: "0.25rem", display: "inline-flex", alignItems: "center", gap: 4 }, children: [
                    product.category === "drova" ? "Детальніше про доставку дров" : "Детальніше про доставку",
                    " ",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "nh-card order-steps", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("h2", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.5rem" }, children: [
                  "Як замовити ",
                  product.category === "brikety" ? "брикети" : product.category === "vugillya" ? "вугілля" : "дрова"
                ] }),
                /* @__PURE__ */ jsxs("ol", { style: { paddingLeft: "1.5rem", marginBottom: "1.5rem", color: "var(--c-text)", lineHeight: 1.6, fontWeight: 500, display: "flex", flexDirection: "column", gap: "0.75rem" }, children: [
                  /* @__PURE__ */ jsxs("li", { children: [
                    "Оберіть потрібний обсяг ",
                    product.category === "brikety" ? "брикетів" : product.category === "vugillya" ? "вугілля" : "дров"
                  ] }),
                  /* @__PURE__ */ jsx("li", { children: 'Натисніть кнопку "Замовити"' }),
                  /* @__PURE__ */ jsx("li", { children: "Ми зв'яжемося для підтвердження доставки" })
                ] }),
                /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }, children: [
                  "Доставка ",
                  product.category === "brikety" ? "брикетів" : product.category === "vugillya" ? "вугілля" : "дров",
                  " по Києву здійснюється власним транспортом протягом 24 годин після оформлення замовлення."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.5rem" }, children: "Часті питання" }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.75rem" }, children: faqs.map((faq, idx) => /* @__PURE__ */ jsxs("div", { style: {
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: 12,
                  overflow: "hidden"
                }, children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => setOpenFaq(openFaq === idx ? null : idx),
                      style: {
                        width: "100%",
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "transparent",
                        border: "none",
                        color: "var(--c-text)",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "left"
                      },
                      children: [
                        faq.q,
                        /* @__PURE__ */ jsx(ChevronDown, { size: 20, color: "var(--c-orange)", style: {
                          transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease"
                        } })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { style: {
                    maxHeight: openFaq === idx ? 200 : 0,
                    padding: openFaq === idx ? "0 1.5rem 1.5rem" : "0 1.5rem",
                    opacity: openFaq === idx ? 1 : 0,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    color: "var(--c-text2)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6
                  }, children: faq.a })
                ] }, idx)) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "6rem" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "2rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
              /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.25rem" }, children: product.category === "brikety" ? "Про ці брикети" : product.category === "vugillya" ? "Про це вугілля" : "Про ці дрова" }),
              /* @__PURE__ */ jsx("div", { style: { color: "var(--c-text2)", fontSize: "1rem", lineHeight: 1.6 }, children: product.description ? /* @__PURE__ */ jsx(Fragment, { children: product.category === "drova" ? /* @__PURE__ */ jsx("div", { className: "product-description", dangerouslySetInnerHTML: { __html: product.description } }) : product.description.includes("<p>") || product.description.includes("<h2>") ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: product.description }, className: "product-seo-description", style: { display: "flex", flexDirection: "column", gap: "1rem" } }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: product.description }),
                /* @__PURE__ */ jsx("p", { children: "Наші дрова щільно укладені в кузові автомобіля (складометрами), що гарантує чесний об'єм при доставці." })
              ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                product.category === "drova" ? /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
                  "Дубові дрова — одна з найкращих порід для опалення. Вони горять довго, дають стабільний жар та підходять для твердопаливних котлів, печей та камінів. Окрім ",
                  /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "дров колотих" }),
                  ", у нас можна замовити ",
                  /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "паливні брикети" }),
                  " та ",
                  /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "кам'яне вугілля" }),
                  "."
                ] }) : /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Дубові дрова — одна з найкращих порід для опалення. Вони горять довго, дають стабільний жар та підходять для твердопаливних котлів, печей та камінів." }),
                /* @__PURE__ */ jsx("p", { children: "Ми ретельно відбираємо сировину, щоб забезпечити максимальну тепловіддачу. Замовляючи у нас, ви отримуєте чесний об'єм та гарантовану якість палива для вашої оселі." })
              ] }) })
            ] }) })
          ] }) }),
          product.category === "drova" && /* @__PURE__ */ jsx("div", { style: { marginTop: "4rem" }, children: /* @__PURE__ */ jsx(DeliveryOptionsDrova, {}) }),
          relatedProducts.length > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: "5rem" }, children: [
            /* @__PURE__ */ jsxs("h2", { className: "h2", style: { marginBottom: "2rem" }, children: [
              "Інші ",
              product.category === "brikety" ? "брикети" : product.category === "vugillya" ? "вугілля" : "дрова"
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }, children: relatedProducts.map((p, idx) => {
              const displayPrice2 = p.variants?.length > 0 ? p.variants[0].price : p.price;
              const isPopular2 = idx < 2;
              return /* @__PURE__ */ jsx(Link, { to: `/catalog/${categorySlug || p.category}/${p.slug}`, style: { textDecoration: "none", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxs("article", { className: "nh-card catalog-card", style: { display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", flex: 1 }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/3" }, children: [
                  p.image_url ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: getImageUrl(p.image_url, api.defaults.baseURL),
                      alt: p.category === "drova" || categorySlug === "drova" ? `${p.name} колоті дрова складометр доставка Київ` : p.h1_heading || p.name,
                      className: "catalog-card-img",
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/product-placeholder-wood.webp";
                      }
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "catalog-card-img-placeholder", children: "🪵" }),
                  /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,12,16,0.65) 0%, transparent 55%)", pointerEvents: "none" } }),
                  /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 12, left: 12, zIndex: 2 }, children: /* @__PURE__ */ jsx("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(34,197,94,0.85)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
                  }, children: "✔ В наявності" }) }),
                  isPopular2 && /* @__PURE__ */ jsx("div", { className: "product-popular-badge", style: { position: "absolute", top: 12, right: 12, zIndex: 2 }, children: /* @__PURE__ */ jsx("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    background: "rgba(249,115,22,0.9)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
                  }, children: "🔥 Популярний" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { padding: "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", flex: 1 }, children: [
                  /* @__PURE__ */ jsx("p", { className: "h3", style: { margin: 0, marginBottom: 8, transition: "color 0.2s", lineHeight: 1.25, fontWeight: 700 }, children: p.name }),
                  /* @__PURE__ */ jsx("div", { className: "catalog-card-description body-sm", style: { minHeight: "2.8em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: 16, opacity: 0.8 }, dangerouslySetInnerHTML: { __html: (p.description || "Якісне тверде паливо з доставкою по Києву та Київській області.").replace(/<h[1-6][^>]*>/gi, "<strong>").replace(/<\/h[1-6]>/gi, "</strong>") } }),
                  p.variants?.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }, children: p.variants.slice(0, 3).map((v, i) => /* @__PURE__ */ jsx("span", { style: { fontSize: "0.72rem", color: "var(--c-text2)", background: "var(--c-surface)", borderRadius: 6, padding: "2px 8px", border: "1px solid var(--c-border)" }, children: v.name }, i)) }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--color-border-subtle)", marginTop: "auto", gap: 12 }, children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
                      /* @__PURE__ */ jsxs("p", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-orange)", lineHeight: 1, margin: 0 }, children: [
                        displayPrice2,
                        " ",
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "1rem", fontWeight: 700, color: "var(--c-orange)" }, children: "грн" })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: 0 }, children: [
                        "за 1 ",
                        product.category === "brikety" || product.category === "vugillya" ? "тонну" : "складометр"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        className: "catalog-card-btn",
                        onClick: (e) => {
                          e.preventDefault();
                          setIsOrderFormOpen(true);
                        },
                        children: [
                          "🛒 ",
                          product.category === "brikety" ? "Замовити брикети" : product.category === "vugillya" ? "Замовити вугілля" : "Замовити дрова"
                        ]
                      }
                    )
                  ] })
                ] })
              ] }) }, p.id);
            }) })
          ] }),
          product.category === "drova" && /* @__PURE__ */ jsxs("section", { className: "product-seo-bottom", style: { marginTop: "5rem", padding: "2rem", background: "var(--color-bg-elevated)", borderRadius: 20, border: "1px solid var(--color-border-subtle)" }, children: [
            /* @__PURE__ */ jsxs("h2", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.25rem" }, children: [
              "Купити ",
              product.name.toLowerCase(),
              " в Києві"
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", fontSize: "1rem", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }, children: [
              /* @__PURE__ */ jsxs("p", { children: [
                "Якщо вам потрібні якісні ",
                /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "колоті дрова" }),
                " ",
                "з доставкою по Києву, компанія КиївБрикет пропонує швидке постачання палива власним транспортом."
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                "У нашому каталозі також доступні",
                " ",
                /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "паливні брикети" }),
                " ",
                "та",
                " ",
                /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "кам'яне вугілля" }),
                " ",
                "для твердопаливних котлів та камінів."
              ] }),
              /* @__PURE__ */ jsx("p", { children: "Ми доставляємо дрова в усі райони Києва: Дарницький, Деснянський, Оболонський, Подільський, Шевченківський, Голосіївський, Солом’янський, Печерський, Святошинський, Дніпровський." }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Замовляючи ",
                /* @__PURE__ */ jsx("strong", { children: product.name.toLowerCase() }),
                " у нас, ви гарантовано отримуєте чесний об'єм, оскільки всі дрова щільно укладаються в кузові (в складометрах). Ми працюємо без передоплати — ви оплачуєте замовлення безпосередньо після розвантаження та перевірки якості."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: "5rem", paddingBottom: "2rem" }, children: [
            /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2rem" }, children: "Інші види палива" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }, children: [
              /* @__PURE__ */ jsxs(Link, { to: "/catalog/drova", className: "nh-card", style: { padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", margin: 0 }, children: "Дрова колоті" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: "4px 0 0 0" }, children: "Дуб, граб, сосна" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-orange)" })
              ] }),
              /* @__PURE__ */ jsxs(Link, { to: "/catalog/brikety", className: "nh-card", style: { padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", margin: 0 }, children: "Паливні брикети" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: "4px 0 0 0" }, children: "RUF, Nestro, Pini Kay" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-orange)" })
              ] }),
              /* @__PURE__ */ jsxs(Link, { to: "/catalog/vugillya", className: "nh-card", style: { padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", margin: 0 }, children: "Кам'яне вугілля" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: "4px 0 0 0" }, children: "Антрацит, ДГ" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-orange)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
                /* Hide scrollbar for thumbnails */
                .product-thumbnails::-webkit-scrollbar { display: none; }

                /* Mobile title: show above image; hide desktop title */
                .product-mobile-title { display: none; }

                @media (max-width: 768px) {
                    .product-mobile-title { display: block !important; }
                    .product-desktop-title .h1 { display: none !important; }
                    .product-desktop-title { gap: 0.5rem !important; }
                    .product-badges-row { display: none !important; }
                    .product-popular-badge { display: none !important; }
                    .product-old-price { display: none !important; }
                    .product-price-badge { display: inline-flex !important; }
                    .product-main-content > div { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
                    .product-main-content > div > div:first-child { position: static !important; }
                    .product-main-content > div > div:last-child { gap: 1rem !important; }
                    .product-price-block { order: -1; padding-top: 0 !important; border-top: none !important; }
                    .product-main-content { padding-top: 1rem !important; padding-bottom: 1rem !important; }
                    
                    /* Sticky Mobile CTA Container */
                    .product-cta-container {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: var(--color-bg-elevated);
                        border-top: 1px solid var(--color-border-subtle);
                        padding: 1rem 1.5rem;
                        z-index: 100;
                        box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
                    }
                    /* Add padding to bottom to account for the sticky bar */
                    .new-home-scope { padding-bottom: 90px; }
                }
            ` }),
        /* @__PURE__ */ jsx(
          OrderFormModal,
          {
            isOpen: isOrderFormOpen,
            onClose: () => setIsOrderFormOpen(false),
            product,
            variant: selectedVariant
          }
        )
      ]
    }
  );
}
export {
  ProductPage as default
};
//# sourceMappingURL=ProductPage-BQfojDpU.js.map
