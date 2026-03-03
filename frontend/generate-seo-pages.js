import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───
const domain = 'https://kievbriket.com';
const siteName = 'Дрова Київ';

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    console.error('Directory "dist" not found. Run "vite build" first.');
    process.exit(1);
}

const indexPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

// ─── Only these 3 static pages get SSG injection ───
const routes = [
    {
        path: '/',
        title: 'Дрова Київ — Купити колоті дрова з доставкою по Києву',
        description: 'Купити колоті дрова з доставкою по Києву та області. Дуб, граб, береза, вільха, сосна. Чесний об\'єм та швидка доставка вантажівками.'
    },
    {
        path: '/delivery',
        title: 'Доставка дров по Києву та області | Дрова Київ',
        description: 'Умови доставки та оплати дров по Києву та Київській області. Швидка доставка вантажівками. Самовивіз також доступний.'
    },
    {
        path: '/contacts',
        title: 'Контакти | Дрова Київ',
        description: 'Зв\'яжіться з нами для замовлення дров. Режим роботи: щодня 09:00–20:00. Київ та область.'
    }
];

function generatePages() {
    console.log(`Starting SSG injection for ${routes.length} static pages...`);

    routes.forEach(route => {
        const relativePath = route.path === '/' ? '' : route.path.replace(/^\//, '');
        const folderPath = path.join(distDir, relativePath);

        if (route.path !== '/') {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        let fullUrl = `${domain}${route.path}`;
        if (fullUrl !== domain + '/' && !fullUrl.endsWith('/')) {
            fullUrl += '/';
        }

        const ogImageUrl = `${domain}/og-image.jpg`;

        // Clean existing tags to avoid duplicates
        let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/gi, '');
        html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
        html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
        html = html.replace(/<meta[^>]*property="og:[^>]*>/gi, '');
        html = html.replace(/<meta[^>]*name="twitter:[^>]*>/gi, '');

        const metaTags = `
    <title data-rh="true">${route.title}</title>
    <meta name="description" content="${route.description}" data-rh="true" />
    <link rel="canonical" href="${fullUrl}" data-rh="true" />
    <meta name="robots" content="index, follow" data-rh="true" />
    <meta property="og:type" content="website" data-rh="true" />
    <meta property="og:title" content="${route.title}" data-rh="true" />
    <meta property="og:description" content="${route.description}" data-rh="true" />
    <meta property="og:url" content="${fullUrl}" data-rh="true" />
    <meta property="og:image" content="${ogImageUrl}" data-rh="true" />
    <meta property="og:site_name" content="${siteName}" data-rh="true" />
    <meta name="twitter:card" content="summary_large_image" data-rh="true" />
    <meta name="twitter:title" content="${route.title}" data-rh="true" />
    <meta name="twitter:description" content="${route.description}" data-rh="true" />
    <meta name="twitter:image" content="${ogImageUrl}" data-rh="true" />
</head>`;

        html = html.replace(/<\/head>/i, metaTags);

        // JSON-LD for homepage
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
        console.log(`✅ Injected SEO for: ${route.path === '/' ? 'Root (Homepage)' : route.path}`);
    });

    // 404 page
    let html404 = baseHtml.replace(/<title>[\s\S]*?<\/title>/gi, '<title>Сторінку не знайдено | Дрова Київ</title>');
    html404 = html404.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    html404 = html404.replace(/<meta[^>]*property="og:[^>]*>/gi, '');
    html404 = html404.replace(/<\/head>/i, `    <meta name="robots" content="noindex, follow" />\n</head>`);
    fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');
    console.log('✅ Created 404.html');

    console.log('🎉 SSG SEO Injection complete! (3 static pages only — no legacy routes)');
}

generatePages();
