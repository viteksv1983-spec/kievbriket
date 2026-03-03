import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───
const BASE_URL = 'https://kievbriket.com';
const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000';

// ─── Static pages (only these 3 exist) ───
const STATIC_PAGES = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/dostavka', priority: '0.9', changefreq: 'monthly' },
    { path: '/contacts', priority: '0.9', changefreq: 'monthly' },
];

// ─── Category pages (fetched from backend, fallback to hardcoded) ───
const FALLBACK_CATEGORIES = ['drova', 'brikety', 'vugillya'];

async function fetchCategories() {
    try {
        const response = await axios.get(`${API_BASE}/products/categories`, { timeout: 5000 });
        return response.data.map(c => c.slug);
    } catch {
        console.log('⚠️ Cannot fetch categories from backend — using fallback list.');
        return FALLBACK_CATEGORIES;
    }
}

async function fetchProducts() {
    try {
        const response = await axios.get(`${API_BASE}/products/?limit=100`, { timeout: 5000 });
        const items = Array.isArray(response.data) ? response.data : (response.data.items || []);
        console.log(`✅ Fetched ${items.length} products for sitemap.`);
        return items;
    } catch (error) {
        console.log(`⚠️ Backend unavailable — skipping product URLs. (${error.message})`);
        return [];
    }
}

function urlEntry(loc, priority, changefreq, lastmod) {
    return [
        `  <url>`,
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        `  </url>`
    ].join('\n');
}

async function generateSitemap() {
    console.log('Generating sitemap for КиївБрикет...');
    const categories = await fetchCategories();
    const products = await fetchProducts();
    const today = new Date().toISOString().split('T')[0];
    const urls = new Set();
    const entries = [];

    const addUrl = (urlPath, priority, changefreq, lastmod) => {
        const full = `${BASE_URL}${urlPath}`;
        if (urls.has(full)) return;
        urls.add(full);
        entries.push({ path: urlPath, priority, changefreq, lastmod: lastmod || today, full });
    };

    // Static pages
    STATIC_PAGES.forEach(p => addUrl(p.path, p.priority, p.changefreq));

    // Category pages
    categories.forEach(slug => {
        addUrl(`/catalog/${slug}`, '0.8', 'weekly');
    });

    // Product pages
    products.forEach(product => {
        if (!product.slug || !product.category) return;
        const lastmod = product.updated_at
            ? new Date(product.updated_at).toISOString().split('T')[0]
            : today;
        addUrl(`/catalog/${product.category}/${product.slug}`, '0.7', 'weekly', lastmod);
    });

    // Sort: priority desc, then alphabetically
    entries.sort((a, b) => {
        const pDiff = parseFloat(b.priority) - parseFloat(a.priority);
        if (pDiff !== 0) return pDiff;
        return a.path.localeCompare(b.path);
    });

    // Build XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    entries.forEach(e => {
        sitemap += urlEntry(e.full, e.priority, e.changefreq, e.lastmod) + '\n';
    });
    sitemap += `</urlset>`;

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log(`✅ Sitemap generated: ${sitemapPath} (${entries.length} URLs)`);
    console.log(`   Static=${STATIC_PAGES.length}, Categories=${categories.length}, Products=${products.length}`);
}

generateSitemap();
