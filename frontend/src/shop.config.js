/**
 * Shop Configuration — THE ONLY FILE you need to edit for a new store.
 * Change these values and your entire shop adapts automatically.
 */
const shopConfig = {
    // ─── Brand ────────────────────────────────────────
    name: "Antreme",
    tagline: "Торти на замовлення",
    description: "Авторські торти на замовлення у Києві від кондитерської Antreme. Готуємо з 100% натуральних інгредієнтів.",
    domain: "https://antreme.kyiv.ua",
    logo: "/logo.svg",

    // ─── Contact ──────────────────────────────────────
    phone: "+380 (63) 619-28-53",
    email: "antreme.ua@gmail.com",
    address: "Київ, Україна",
    instagram: "https://www.instagram.com/antreme_kyiv",
    telegram: "https://t.me/antreme_kyiv",

    // ─── Commerce ─────────────────────────────────────
    currency: "грн",
    currencySymbol: "₴",
    deliveryMethods: ["pickup", "delivery"],
    minOrderAmount: 0,

    // ─── SEO Defaults ─────────────────────────────────
    seo: {
        defaultTitle: "Antreme — Торти на замовлення у Києві",
        defaultDescription: "Авторські торти на замовлення у Києві від кондитерської Antreme. Готуємо з 100% натуральних інгредієнтів: весільні, дитячі, корпоративні десерти з адресною доставкою.",
        defaultKeywords: "торти, київ, замовлення, десерти, кондитерська",
        ogSiteName: "Antreme – Кондитерська майстерня",
    },

    // ─── API ──────────────────────────────────────────
    api: {
        products: "/products",
        orders: "/orders",
        auth: "/token",
    },

    // ─── UI Labels ────────────────────────────────────
    labels: {
        catalog: "Каталог",
        cart: "Кошик",
        order: "Замовити",
        quickOrder: "Замовити в 1 клік",
        delivery: "Доставка та оплата",
        about: "Про нас",
        reviews: "Відгуки",
        addToCart: "Додати до кошика",
        weight: "Вага",
        price: "Ціна",
        ingredients: "Склад",
        notAvailable: "Немає в наявності",
    },
};

export default shopConfig;
