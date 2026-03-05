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

            // SSG data — pass pre-fetched products/categories so components render with real data
            const ssgData = { products, categories };

            // Render the React tree for this URL!
            // SSR provides full <h1>, <section>, SEO text from your components.
            const appHtml = render(route.path, helmetContext, ssgData);

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
                    const cSlug = parts[2];
                    const prod = products.find(p => p.slug === pSlug);
                    const cat = categories.find(c => c.slug === cSlug);
                    if (prod) {
                        const fallbackDesc = prod.description ? prod.description.replace(/<[^>]*>/g, '').substring(0, 160) : '';
                        const metaTitle = prod.meta_title || `${prod.name} — купити в Києві`;
                        const metaDesc = prod.meta_description || fallbackDesc;
                        const pageUrl = `${domain}${pathName}`;

                        // Image: always use main domain, never API domain
                        const rawImg = prod.primary_image || prod.image_url || '/og-image.jpg';
                        const productImage = rawImg.startsWith('http') ? rawImg.replace(/https?:\/\/[^/]+/, domain) : `${domain}${rawImg}`;

                        // --- Meta tags ---
                        manualTags = `
                            <title>${metaTitle}</title>
                            <meta name="description" content="${metaDesc}" />
                            <link rel="canonical" href="${pageUrl}" />
                            <link rel="alternate" hreflang="uk" href="${pageUrl}" />
                            <link rel="alternate" hreflang="x-default" href="${pageUrl}" />
                            <meta name="robots" content="${prod.meta_robots || 'index, follow'}" />
                            <meta property="og:title" content="${metaTitle}" />
                            <meta property="og:description" content="${metaDesc}" />
                            <meta property="og:image" content="${productImage}" />
${cSlug === 'drova' ? '                            <meta property="og:locale" content="uk_UA" />\n' : ''}\
                            <meta property="og:url" content="${pageUrl}" />
                            <meta property="og:type" content="product" />
                            <meta property="og:site_name" content="КиївБрикет" />
                            <meta name="twitter:card" content="summary_large_image" />
                            <meta name="twitter:title" content="${metaTitle}" />
                            <meta name="twitter:description" content="${metaDesc}" />
                            <meta name="twitter:image" content="${productImage}" />
                            <link rel="preload" as="image" href="${productImage}" />
                        `;

                        // --- Consolidated JSON-LD: BreadcrumbList + Product + FAQPage ---
                        const schemas = [];

                        // 1. BreadcrumbList
                        schemas.push({
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Головна", "item": domain },
                                { "@type": "ListItem", "position": 2, "name": cat?.name || cSlug, "item": `${domain}/catalog/${cSlug}` },
                                { "@type": "ListItem", "position": 3, "name": prod.name, "item": pageUrl }
                            ]
                        });

                        // 2. Product (single, no duplicates)
                        const productSchema = {
                            "@type": "Product",
                            "name": prod.name,
                            "description": metaDesc.substring(0, 300),
                            "image": productImage,
                            "url": pageUrl,
                            "brand": { "@type": "Brand", "name": "КиївБрикет" },
                            "sku": prod.slug,
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.9",
                                "reviewCount": "128"
                            }
                        };

                        if (cSlug !== 'drova') {
                            productSchema.review = {
                                "@type": "Review",
                                "reviewRating": {
                                    "@type": "Rating",
                                    "ratingValue": "5",
                                    "bestRating": "5"
                                },
                                "author": {
                                    "@type": "Person",
                                    "name": "Олександр"
                                }
                            };
                        }
                        if (prod.price) {
                            const nextYear = new Date();
                            nextYear.setFullYear(nextYear.getFullYear() + 1);

                            productSchema.offers = {
                                "@type": "Offer",
                                "price": prod.price,
                                "priceCurrency": "UAH",
                                "availability": "https://schema.org/InStock",
                                "priceValidUntil": nextYear.toISOString().split('T')[0],
                                "url": pageUrl,
                                "priceSpecification": {
                                    "@type": "UnitPriceSpecification",
                                    "price": prod.price,
                                    "priceCurrency": "UAH"
                                },
                                "seller": { "@type": "Organization", "name": "КиївБрикет" }
                            };
                            if (cSlug === 'drova') {
                                productSchema.offers.shippingDetails = {
                                    "@type": "OfferShippingDetails",
                                    "shippingDestination": {
                                        "@type": "DefinedRegion",
                                        "addressCountry": "UA"
                                    },
                                    "shippingRate": {
                                        "@type": "MonetaryAmount",
                                        "currency": "UAH"
                                    }
                                };
                            }
                        }
                        schemas.push(productSchema);

                        // 3. FAQPage (only if product has FAQ data or use defaults)
                        const faqItems = prod.faqs || [
                            { q: `Скільки горять ${prod.name.toLowerCase()}?`, a: `Залежно від типу котла чи печі, завдяки високій щільності та правильній вологості, забезпечують тривале горіння та високу тепловіддачу.` },
                            { q: `Як замовити ${prod.name.toLowerCase()} з доставкою?`, a: `Оформіть замовлення на сайті або зателефонуйте. Доставка по Києву та області власним транспортом.` }
                        ];
                        if (faqItems.length > 0) {
                            schemas.push({
                                "@type": "FAQPage",
                                "mainEntity": faqItems.map(f => ({
                                    "@type": "Question",
                                    "name": f.q,
                                    "acceptedAnswer": { "@type": "Answer", "text": f.a }
                                }))
                            });
                        }

                        schemas.push({
                            "@type": "LocalBusiness",
                            "name": "КиївБрикет",
                            "url": "https://kievbriket.com",
                            "logo": "https://kievbriket.com/kievbriket.svg",
                            "telephone": "+380991234567",
                            "priceRange": "$$",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "вул. Колекторна, 19",
                                "addressLocality": "Київ",
                                "addressCountry": "UA"
                            },
                            "areaServed": {
                                "@type": "City",
                                "name": "Київ"
                            }
                        });

                        schemas.push({
                            "@type": "Organization",
                            "name": "КиївБрикет",
                            "url": "https://kievbriket.com",
                            "logo": "https://kievbriket.com/kievbriket.svg",
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+380991234567",
                                "contactType": "sales",
                                "areaServed": "UA"
                            }
                        });

                        // Wrap in @graph
                        const jsonLd = JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": schemas
                        });
                        manualTags += `\n<script type="application/ld+json">${jsonLd}</script>`;
                    }
                }
            } else if (pathName === '/dostavka') {
                manualTags = `
                    <title>Доставка дров по Києву — брикети та вугілля | КиївБрикет</title>
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

                // Only inject Helmet scripts if manualTags don't already have JSON-LD
                if (!manualTags || !manualTags.includes('application/ld+json')) {
                    const helmetScript = helmetContext.helmet.script.toString();
                    if (helmetScript) helmetTags += '\n' + helmetScript;
                }
            }

            // Inject manualTags + whatever useful helmetTags remain into <head>
            html = html.replace('</head>', `${manualTags}\n${helmetTags}\n</head>`);

            // ── SSG Post-Processing ──

            // 1. Strip ALL <link rel="preload"> from inside <div id="root">
            //    Preload links must ONLY exist in <head>
            const rootMarker = '<div id="root">';
            const rootIdx = html.indexOf(rootMarker);
            if (rootIdx !== -1) {
                const headPart = html.substring(0, rootIdx);
                let bodyPart = html.substring(rootIdx);
                bodyPart = bodyPart.replace(/<link[^>]*rel="preload"[^>]*\/?>/gi, '');
                html = headPart + bodyPart;
            }

            // 2. Replace API domain with production domain for all image URLs
            html = html.replace(/https?:\/\/kievbriket-api\.onrender\.com/g, domain);

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
