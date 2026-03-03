import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───
const domain = 'https://kievbriket.com';
const siteName = 'КиївБрикет';
const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000';

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    console.error('Directory "dist" not found. Run "vite build" first.');
    process.exit(1);
}

const indexPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

// ─── Utility: Fetch ───
async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    return await res.json();
}

// ─── Static Pages ───
const baseRoutes = [
    {
        path: '/',
        title: 'КиївБрикет — Купити колоті дрова з доставкою по Києву',
        description: 'Купити колоті дрова з доставкою по Києву та області. Дуб, граб, береза, вільха, сосна. Чесний об\'єм та швидка доставка вантажівками.'
    },
    {
        path: '/delivery',
        title: 'Доставка дров по Києву та області | КиївБрикет',
        description: 'Умови доставки та оплати дров по Києву та Київській області. Швидка доставка вантажівками. Самовивіз також доступний.'
    },
    {
        path: '/contacts',
        title: 'Контакти | КиївБрикет',
        description: 'Зв\'яжіться з нами для замовлення дров. Режим роботи: щодня 09:00–20:00. Київ та область.'
    },
    {
        path: '/payment',
        title: 'Оплата | КиївБрикет',
        description: 'Способи оплати дров, вугілля та брикетів. Готівка при отриманні, переказ на карту, безготівковий розрахунок.'
    }
];

// Fallback categories just in case backend is totally down during build
const FALLBACK_CATEGORIES = [
    { slug: 'drova', name: 'Дрова', seo_title: 'Купити дрова в Києві', seo_description: 'Дрова твердих порід з доставкою.' },
    { slug: 'brikety', name: 'Брикети', seo_title: 'Купити паливні брикети Києві', seo_description: 'Паливні брикети від виробника.' },
    { slug: 'vugillya', name: 'Вугілля', seo_title: 'Купити вугілля Києві', seo_description: 'Кам\'яне вугілля та антрацит.' }
];

async function generatePages() {
    console.log(`Fetching dynamic data for SSG...`);

    let categories = [];
    let products = [];

    try {
        console.log(`Fetching categories from ${API_BASE}...`);
        categories = await fetchJson(`${API_BASE}/products/categories`);
    } catch (e) {
        console.warn(`⚠️ Failed to fetch categories: ${e.message}. Using fallbacks.`);
        categories = FALLBACK_CATEGORIES;
    }

    try {
        console.log(`Fetching products from ${API_BASE}...`);
        const prodData = await fetchJson(`${API_BASE}/products/?limit=100`);
        products = Array.isArray(prodData) ? prodData : (prodData.items || []);
    } catch (e) {
        console.warn(`⚠️ Failed to fetch products: ${e.message}. Pages will not be generated for products.`);
    }

    // Compile ALL routes
    const allRoutes = [...baseRoutes];

    // Add category routes
    for (const cat of categories) {
        allRoutes.push({
            path: `/catalog/${cat.slug}`,
            title: cat.seo_title || `Купити ${cat.name.toLowerCase()} в Києві`,
            description: cat.seo_description || `Замовляйте ${cat.name.toLowerCase()} з швидкою доставкою по Києву та області.`
        });
    }

    // Add product routes
    for (const prod of products) {
        if (!prod.slug || !prod.category) continue;
        allRoutes.push({
            path: `/catalog/${prod.category}/${prod.slug}`,
            title: prod.seo_title || `${prod.name} — Купити в Києві | КиївБрикет`,
            description: prod.seo_description || `Замовляйте ${prod.name.toLowerCase()} за вигідною ціною. Доставка по Києву та Київській області.`
        });
    }

    console.log(`Starting SSG injection for ${allRoutes.length} pages...`);

    allRoutes.forEach(route => {
        const relativePath = route.path === '/' ? '' : route.path.replace(/^\//, '');
        const folderPath = path.join(distDir, relativePath);

        if (route.path !== '/') {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        let fullUrl = `${domain}${route.path}`;
        if (fullUrl !== domain + '/' && !fullUrl.endsWith('/')) {
            fullUrl += '/'; // Canonical should have trailing slash for consistency if we enforce it or match Vercel rules. But wait! We just disabled trailing slash in vercel.json.
            // Let's NOT add trailing slash to canonical! It should match exactly.
        }

        // Fix canonical logic based on recent trailingSlash: false rule
        let canonicalUrl = `${domain}${route.path}`;
        if (route.path === '/') canonicalUrl = `${domain}/`;

        const ogImageUrl = `${domain}/og-image.jpg`;

        // Clean existing tags to avoid duplicates
        let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/gi, '');
        html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
        html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
        html = html.replace(/<meta[^>]*property="og:[^>]*>/gi, '');
        html = html.replace(/<meta[^>]*name="twitter:[^>]*>/gi, '');

        const metaTags = `
    <title data-rh="true">${route.title}</title>
    <meta name="description" content="${route.description.replace(/"/g, '&quot;')}" data-rh="true" />
    <link rel="canonical" href="${canonicalUrl}" data-rh="true" />
    <meta name="robots" content="index, follow" data-rh="true" />
    <meta property="og:type" content="website" data-rh="true" />
    <meta property="og:title" content="${route.title}" data-rh="true" />
    <meta property="og:description" content="${route.description.replace(/"/g, '&quot;')}" data-rh="true" />
    <meta property="og:url" content="${canonicalUrl}" data-rh="true" />
    <meta property="og:image" content="${ogImageUrl}" data-rh="true" />
    <meta property="og:site_name" content="${siteName}" data-rh="true" />
    <meta name="twitter:card" content="summary_large_image" data-rh="true" />
    <meta name="twitter:title" content="${route.title}" data-rh="true" />
    <meta name="twitter:description" content="${route.description.replace(/"/g, '&quot;')}" data-rh="true" />
    <meta name="twitter:image" content="${ogImageUrl}" data-rh="true" />
</head>`;

        html = html.replace(/<\/head>/i, metaTags);

        // JSON-LD for homepage only
        if (route.path === '/') {
            const jsonLd = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": siteName,
                "image": ogImageUrl,
                "url": `${domain}/`,
                "areaServed": { "@type": "City", "name": "Kyiv" },
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Київ",
                    "addressCountry": "UA"
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "09:00",
                    "closes": "20:00"
                }
            });
            html = html.replace(/<\/head>/i, `    <script type="application/ld+json" data-rh="true">${jsonLd}</script>\n</head>`);
        }

        const filePath = path.join(folderPath, 'index.html');
        fs.writeFileSync(filePath, html, 'utf-8');
    });

    // ─── Generate 404.html ───
    console.log('Generating 404.html...');
    let html404 = baseHtml.replace(/<title>[\s\S]*?<\/title>/gi, '<title data-rh="true">Сторінку не знайдено (404) | КиївБрикет</title>');
    html404 = html404.replace(/<\/head>/i, `    <meta name="robots" content="noindex, follow" data-rh="true" />\n</head>`);
    fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');

    console.log(`🎉 Full SSG Generation Complete! Generated ${allRoutes.length} pages + 404.html`);
}

generatePages();
