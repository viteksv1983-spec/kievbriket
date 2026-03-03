import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const domain = 'https://kievbriket.com';
const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000';

const distDir = path.join(__dirname, 'dist');
const serverEntryPath = path.join(__dirname, 'dist-server', 'entry-server.js');

if (!fs.existsSync(distDir) || !fs.existsSync(serverEntryPath)) {
    console.error('Missing dist or dist-server. Run client and server builds first.');
    process.exit(1);
}

const indexPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

// Preloader injection cleanup (SSR doesn't need huge preloader delays if content is static) // Actually, keep it but let hydration remove it
// Convert path imports properly for dynamic JS import on Windows
const fileUrl = `file:///${serverEntryPath.replace(/\\/g, '/')}`;
const { render } = await import(fileUrl);

async function fetchJson(url) {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        return await res.json();
    } catch (e) {
        console.warn(`⚠️ Fetch failed for ${url}: ${e.message}`);
        return null; // Return null so the caller can handle fallbacks
    }
}

const baseRoutes = [
    { path: '/' },
    { path: '/dostavka' },
    { path: '/contacts' },
    { path: '/kontakty' }
];

const FALLBACK_CATEGORIES = [
    { slug: 'drova' },
    { slug: 'brikety' },
    { slug: 'vugillya' }
];

async function generatePages() {
    console.log(`Starting Full SSG via React renderToString...`);

    // 1. Fetch dynamic data with safety try/catch
    let categories = await fetchJson(`${API_BASE}/products/categories`);
    if (!categories) {
        console.warn('Using fallback categories.');
        categories = FALLBACK_CATEGORIES;
    }

    let products = await fetchJson(`${API_BASE}/products/?limit=100`);
    if (products) {
        products = Array.isArray(products) ? products : (products.items || []);
    } else {
        products = [];
    }

    const allRoutes = [...baseRoutes];

    categories.forEach(cat => allRoutes.push({ path: `/catalog/${cat.slug}` }));
    products.forEach(prod => {
        if (prod.slug && prod.category) {
            allRoutes.push({ path: `/catalog/${prod.category}/${prod.slug}` });
        }
    });

    console.log(`Injecting ${allRoutes.length} SSG Pages...`);

    // We don't want the old manual SEO loop anymore, because Helmet generates everything!
    // But we need to clean ANY existing static tags from baseHtml to prevent duplicates
    let cleanedHtml = baseHtml;
    // Remove static <title> if present
    cleanedHtml = cleanedHtml.replace(/<title[\s\S]*?<\/title>/gi, '');
    // Clean out <meta> tags EXCEPT viewport/theme-color/charset
    // Actually, it's safer to just let Helmet inject. Our index.html has NONE except charsets.

    for (const route of allRoutes) {
        try {
            // Helmet context buffer
            const helmetContext = {};

            // Render the React tree for this URL!
            // SSR provides full <h1>, <section>, SEO text from your components.
            const appHtml = render(route.path, helmetContext);

            let html = cleanedHtml.replace('<!--ssr-outlet-->', appHtml);

            // Generate Manual Tags using pre-fetched data
            let manualTags = '';
            const pathName = route.path;

            if (pathName === '/') {
                manualTags = `
                    <title>КиївБрикет — дрова, брикети та вугілля з доставкою по Києву</title>
                    <meta name="description" content="Купити колоті дрова, паливні брикети та кам'яне вугілля від виробника. Швидка доставка по Києву та Київській області." />
                    <link rel="canonical" href="${domain}" />
                    <meta name="robots" content="index, follow" />
                `;
            } else if (pathName.startsWith('/catalog/')) {
                const parts = pathName.split('/');
                if (parts.length === 3) {
                    const cSlug = parts[2];
                    const cat = categories.find(c => c.slug === cSlug);
                    if (cat) {
                        const fallbackDesc = cat.seo_text ? cat.seo_text.replace(/<[^>]*>/g, '').substring(0, 160) : '';
                        manualTags = `
                            <title>${cat.meta_title || `${cat.name} — купити з доставкою по Києву`}</title>
                            <meta name="description" content="${cat.meta_description || fallbackDesc}" />
                            <link rel="canonical" href="${domain}${pathName}" />
                            <meta name="robots" content="${cat.meta_robots || 'index, follow'}" />
                            <meta property="og:title" content="${cat.meta_title || cat.name}" />
                            <meta property="og:image" content="${domain}${cat.og_image || cat.image_url}" />
                            <meta property="og:url" content="${domain}${pathName}" />
                            <meta property="og:type" content="website" />
                        `;
                        if (cat.schema_json) {
                            manualTags += `\n<script type="application/ld+json">${typeof cat.schema_json === 'string' ? cat.schema_json : JSON.stringify(cat.schema_json)}</script>`;
                        }
                    }
                } else if (parts.length === 4) {
                    const pSlug = parts[3];
                    const prod = products.find(p => p.slug === pSlug);
                    if (prod) {
                        const fallbackDesc = prod.description ? prod.description.replace(/<[^>]*>/g, '').substring(0, 160) : '';
                        manualTags = `
                            <title>${prod.meta_title || `${prod.name} — купити в Києві`}</title>
                            <meta name="description" content="${prod.meta_description || fallbackDesc}" />
                            <link rel="canonical" href="${domain}${pathName}" />
                            <meta name="robots" content="${prod.meta_robots || 'index, follow'}" />
                            <meta property="og:title" content="${prod.meta_title || prod.name}" />
                            <meta property="og:image" content="${domain}${prod.primary_image || prod.image_url || '/og-image.jpg'}" />
                            <meta property="og:url" content="${domain}${pathName}" />
                            <meta property="og:type" content="product" />
                        `;
                        // Product JSON-LD schema
                        if (prod.schema_json) {
                            manualTags += `\n<script type="application/ld+json">${typeof prod.schema_json === 'string' ? prod.schema_json : JSON.stringify(prod.schema_json)}</script>`;
                        } else {
                            // Fallback Product schema
                            const productSchema = JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Product",
                                "name": prod.name,
                                "description": (prod.meta_description || fallbackDesc).substring(0, 300),
                                "image": prod.primary_image || prod.image_url ? `${domain}${prod.primary_image || prod.image_url}` : `${domain}/og-image.jpg`,
                                "url": `${domain}${pathName}`,
                                "brand": {
                                    "@type": "Brand",
                                    "name": "КиївБрикет"
                                },
                                ...(prod.price ? {
                                    "offers": {
                                        "@type": "Offer",
                                        "price": prod.price,
                                        "priceCurrency": "UAH",
                                        "availability": "https://schema.org/InStock",
                                        "url": `${domain}${pathName}`
                                    }
                                } : {})
                            });
                            manualTags += `\n<script type="application/ld+json">${productSchema}</script>`;
                        }
                    }
                }
            } else if (pathName === '/dostavka') {
                manualTags = `
                    <title>Доставка дров, брикетів та вугілля по Києву | КиївБрикет</title>
                    <meta name="description" content="Доставка дров, паливних брикетів та вугілля по Києву та області. Власний автопарк, доставка в день замовлення." />
                    <link rel="canonical" href="${domain}${pathName}" />
                    <meta name="robots" content="index, follow" />
                `;
            } else if (pathName === '/contacts' || pathName === '/kontakty') {
                const contactsSchema = JSON.stringify({
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
                    "openingHours": "Mo-Su 09:00-20:00",
                    "areaServed": {
                        "@type": "City",
                        "name": "Kyiv"
                    }
                });
                manualTags = `
                    <title>Контакти КиївБрикет — телефон, адреса, доставка дров у Києві</title>
                    <meta name="description" content="Контакти інтернет-магазину твердого палива КиївБрикет. Адреса, телефон, графік роботи." />
                    <link rel="canonical" href="${domain}/contacts" />
                    <meta name="robots" content="index, follow" />
                    <script type="application/ld+json">${contactsSchema}</script>
                `;
            }

            // Extract remaining tags from Helmet (like JSON-LD scripts, etc.)
            // When manualTags are present, skip Helmet's title/meta/link to avoid duplicates
            let helmetTags = '';
            if (helmetContext.helmet) {
                // Only use Helmet title if we have NO manual tags
                if (!manualTags) {
                    const helmetTitle = helmetContext.helmet.title.toString();
                    if (helmetTitle && !helmetTitle.includes('data-rh="true"></title>')) {
                        helmetTags += helmetTitle;
                    }
                }

                // Filter Helmet meta: skip description/robots/og tags if manual tags cover them
                if (!manualTags) {
                    const helmetMeta = helmetContext.helmet.meta.toString();
                    if (helmetMeta) helmetTags += '\n' + helmetMeta;
                }

                // Skip Helmet canonical link if we already have manual canonical
                if (!manualTags) {
                    const helmetLink = helmetContext.helmet.link.toString();
                    if (helmetLink) helmetTags += '\n' + helmetLink;
                }

                // Always inject Helmet scripts (JSON-LD schema etc.)
                const helmetScript = helmetContext.helmet.script.toString();
                if (helmetScript) helmetTags += '\n' + helmetScript;
            }

            // Inject manualTags + whatever useful helmetTags remain into <head>
            html = html.replace('</head>', `${manualTags}\n${helmetTags}\n</head>`);

            // Write to dist folder structure
            const relativePath = route.path === '/' ? '' : route.path.replace(/^\//, '');
            const folderPath = path.join(distDir, relativePath);

            if (route.path !== '/') {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const filePath = path.join(folderPath, 'index.html');
            fs.writeFileSync(filePath, html, 'utf-8');

        } catch (err) {
            console.error(`❌ Error rendering ${route.path}:`, err);
        }
    }

    // Generate 404 page (render standard Not Found component)
    try {
        const helmetContext404 = {};
        const appHtml404 = render('/404-forced-error-page', helmetContext404); // unknown route triggers <NotFound>
        let html404 = cleanedHtml.replace('<!--ssr-outlet-->', appHtml404);

        if (helmetContext404.helmet) {
            const tags = `
                ${helmetContext404.helmet.title.toString()}
                ${helmetContext404.helmet.meta.toString()}
                ${helmetContext404.helmet.link.toString()}
            `;
            html404 = html404.replace('</head>', `${tags}\n</head>`);
        }
        fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');
        console.log(`✅ Generated 404.html`);
    } catch (err) {
        console.error('Failed to generate 404', err);
    }

    console.log(`🎉 SSG Complete! Generated ${allRoutes.length} static DOM pages.`);
}

generatePages();
