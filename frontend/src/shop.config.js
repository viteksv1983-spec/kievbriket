const shopConfig = {
    // ─── Brand ────────────────────────────────────────
    name: "Дрова Київ",
    tagline: "Якісні дрова з доставкою",
    description: "Купити колоті дрова з доставкою по Києву та області. Дуб, граб, береза, вільха, сосна. Чесний об'єм та швидка доставка вантажівками.",
    domain: "https://kievbriket.com",
    logo: "/logo.svg", // Replaced text via css/components later if needed

    // ─── Contact ──────────────────────────────────────
    contact: {
        phone: "+380 (99) 123-45-67",
        email: "info@kievbriket.com",
        address: "Київ та Київська область",
        instagram: "https://www.instagram.com/drova_kiyv_example",
        telegram: "https://t.me/drova_kyiv_bot",
    },

    // ─── Commerce ─────────────────────────────────────
    currency: "грн",
    currencySymbol: "₴",
    deliveryMethods: ["delivery", "pickup"],
    minOrderAmount: 1000,

    // ─── SEO Defaults ─────────────────────────────────
    seo: {
        defaultTitle: "Дрова Київ — Купити колоті дрова з доставкою",
        defaultDescription: "Швидка доставка дров по Києву та області. Дуб, ясен, граб, береза. Без передоплати, точний об'єм. Замовляйте якісні дрова для опалення.",
        defaultKeywords: "дрова київ, купити дрова, доставка дров, дрова колоті, дубові дрова, дрова ціна",
        ogSiteName: "Дрова Київ",
    },

    // ─── API ──────────────────────────────────────────
    api: {
        products: "/products",
        orders: "/orders",
        auth: "/token",
    },

    // ─── UI Labels ────────────────────────────────────
    labels: {
        catalog: "Каталог дров",
        cart: "Кошик",
        order: "Замовити дрова",
        quickOrder: "Швидке замовлення",
        delivery: "Доставка та оплата",
        about: "Про нас",
        reviews: "Відгуки клієнтів",
        addToCart: "Додати до кошика",
        weight: "Об'єм (складометрів)",
        price: "Ціна за 1 скл/м",
        ingredients: "Порода дерева",
        notAvailable: "Немає в наявності",
        shelfLife: "Вологість"
    },

    // ─── External Services (Google Cloud, etc.) ───────
    services: {
        googleMapsApiKey: "", // Paste your Google Maps API Key here
        googleAnalyticsId: "", // G-XXXXXXXXXX
        googleSearchConsoleId: "", // Verification tag
    }
};

export default shopConfig;
