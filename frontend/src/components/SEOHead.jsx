import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import shopConfig from '../shop.config';

export default function SEOHead({ title, description, ogDescription, keywords, h1, canonical, ogImage, type = 'website', schema, robots, is404 = false, productPrice, productCurrency, children }) {
    const location = useLocation();
    const [seoData, setSeoData] = useState(null);
    const domain = shopConfig.domain;

    // Fetch SEO data from backend if not provided via props (for static pages)
    useEffect(() => {
        if (title || is404) return; // If props provided, use them (e.g. Product Detail), skip fetching for 404

        const fetchSEO = async () => {
            try {
                // Encode path safely
                const path = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
                const response = await api.get(`/api/seo${path}`);
                if (response.data) {
                    setSeoData(response.data);
                }
            } catch (error) {
                // Fail silently, fallback to defaults
                console.log("No specific SEO data for this route");
            }
        };

        fetchSEO();
    }, [location.pathname, title]);

    const data = seoData || {};

    // Effective values: Prop > Backend > Default
    const effectiveTitle = title || data.meta_title || shopConfig.seo.defaultTitle;
    const effectiveDesc = description || data.meta_description || shopConfig.seo.defaultDescription;
    const effectiveKeywords = keywords || data.meta_keywords || shopConfig.seo.defaultKeywords;
    const effectiveRobots = robots || data.meta_robots || 'index, follow';

    // Construct canonical
    const pathForCanonical = canonical || location.pathname;
    // We must strictly enforce NO trailing slashes for canonical URLs
    let formattedPath = pathForCanonical;
    if (formattedPath !== '/' && formattedPath.endsWith('/')) {
        formattedPath = formattedPath.slice(0, -1);
    }

    const currentFullUrl = formattedPath.startsWith('http')
        ? formattedPath
        : `${domain}${formattedPath}`;

    const imagePath = ogImage || data.og_image || '/og-image.jpg';
    const effectiveOgImage = imagePath.startsWith('http') ? imagePath : `${domain}${imagePath}`;

    const effectiveSchema = schema || data.schema_json;

    return (
        <Helmet>
            <title>{effectiveTitle}</title>
            <meta name="description" content={effectiveDesc} />
            <meta name="keywords" content={effectiveKeywords} />
            {/* Canonical & OGs should be omitted on 404 pages */}
            {!is404 && <link rel="canonical" href={currentFullUrl} />}
            <meta name="robots" content={effectiveRobots} />

            {/* Open Graph */}
            <meta property="og:locale" content="uk_UA" />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={effectiveTitle} />
            <meta property="og:description" content={ogDescription || effectiveDesc} />
            <meta property="og:image" content={effectiveOgImage} />
            {!is404 && <meta property="og:url" content={currentFullUrl} />}
            <meta property="og:site_name" content={shopConfig.seo.ogSiteName} />

            {/* Product OpenGraph (for Telegram, Facebook, Viber, WhatsApp) */}
            {productPrice && (
                <>
                    <meta property="product:price:amount" content={String(productPrice)} />
                    <meta property="product:price:currency" content={productCurrency || 'UAH'} />
                    <meta property="product:availability" content="in stock" />
                </>
            )}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={effectiveTitle} />
            <meta name="twitter:description" content={effectiveDesc} />
            <meta name="twitter:image" content={effectiveOgImage} />

            {/* Schema.org */}
            {effectiveSchema && (
                <script type="application/ld+json">
                    {typeof effectiveSchema === 'string' ? effectiveSchema : JSON.stringify(effectiveSchema)}
                </script>
            )}

            {/* H1 Handling - usually rendered in page, but can be passed back if needed. 
                Here we just handle HEAD tags. H1 should be handled by the page component using the hook or context if dynamic H1 is needed globally.
                For now, let's assume specific pages render their own H1, 
                BUT for static pages managed via Admin, we might want to render H1 in PublicLayout? 
                Or allow pages to fetch it.
            */}
            {/* Custom tags passed as children (e.g., hreflang, twitter specific) */}
            {children}
        </Helmet>
    );
}
