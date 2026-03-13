import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import api from '../api';
import SEOHead from './SEOHead';
import shopConfig from '../shop.config';
import { getProductUrl } from '../utils/urls';
import { useCategories } from '../context/CategoryContext';

// Import all new components
import { HeroSection } from './new-home/HeroSection';
import { BenefitsSection } from './new-home/BenefitsSection';
import { TrustBlock } from './new-home/TrustBlock';
import { CategoriesSection } from './new-home/CategoriesSection';
import { DeliverySection } from './new-home/DeliverySection';
import { ReviewsSection } from './new-home/ReviewsSection';
import { SeoIntroSection, SeoFooterSection, SeoContentBlock } from './new-home/SeoSections';
import FaqSection from './FaqSection';
import { CtaBanner } from './new-home/CtaBanner';
import { ContactSection } from './new-home/ContactSection';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import { OrderFormModal } from './new-home/OrderFormModal';
import { usePageSEO } from '../hooks/usePageSEO';

function Home() {
    const { addToCart } = useContext(CartContext);
    const { categories } = useCategories();
    const [featuredCakes, setFeaturedCakes] = useState([]);
    const [allCakes, setAllCakes] = useState([]);
    const [orderFormPayload, setOrderFormPayload] = useState(null);
    const [heroSettings, setHeroSettings] = useState({});
    const [faqs, setFaqs] = useState([]);

    const { pageData } = usePageSEO('/');

    const handleQuickOrderDefault = (payload = null) => {
        setOrderFormPayload(payload || true);
    };

    useEffect(() => {
        api.get('/products/')
            .then(response => {
                const data = response.data;
                const items = Array.isArray(data) ? data : (data.items || []);
                setAllCakes(items);
                setFeaturedCakes(items.slice(0, 4));
            })
            .catch(error => {
                console.error("Error fetching featured products", error);
            });

        // Fetch hero section settings (public, no auth)
        api.get('/api/site-settings/hero')
            .then(res => setHeroSettings(res.data || {}))
            .catch(() => { /* use defaults */ });

        // Fetch home FAQs for schema generation
        api.get('/api/faqs?page=home')
            .then(res => setFaqs(res.data || []))
            .catch(() => { /* ignore error, component handles it too */ });
    }, []);

    const homeSchema = {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness"],
        "name": shopConfig.name,
        "image": `${shopConfig.domain}/og-image.jpg`,
        "url": `${shopConfig.domain}/`,
        "telephone": shopConfig.contact.phone,
        "priceRange": "₴₴",
        "areaServed": { "@type": "City", "name": "Kyiv" },
        "sameAs": [shopConfig.contact.instagram],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "вул. Колекторна, 19",
            "addressLocality": "Київ",
            "postalCode": "02000",
            "addressRegion": "Київська область",
            "addressCountry": "UA"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "09:00",
            "closes": "20:00"
        }
    };

    const faqSchemaQuestions = faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }));

    const faqSchema = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqSchemaQuestions
    } : null;

    const productSchema = featuredCakes.map(product => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${shopConfig.domain}${product.image_url}`) : "",
        "description": `Купити ${product.name} з доставкою в Києві. Чесний об'єм, швидка доставка.`,
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "UAH",
            "availability": "https://schema.org/InStock",
            "url": `${shopConfig.domain}${getProductUrl(product)}`
        }
    }));

    const combinedSchema = [homeSchema, ...productSchema];
    if (faqSchema) {
        combinedSchema.push(faqSchema);
    }

    return (
        <>
            <SEOHead
                title={pageData?.meta_title || "Дрова, брикети та вугілля з доставкою по Києву | КиївДрова"}
                description={pageData?.meta_description || "Купити дрова, паливні брикети та вугілля у Києві. Швидка доставка по Києву та області. Чесний складометр, оплата після отримання."}
                canonicalUrl={`${shopConfig.domain}/`}
                schema={combinedSchema}
            />

            <HeroSection
                onQuickOrderClick={handleQuickOrderDefault}
                heroBadges={heroSettings.hero_badges}
                heroTrustText={heroSettings.hero_trust_text}
                heroImageUrl={heroSettings.hero_image_url}
            />
            <BenefitsSection />
            <TrustBlock onOrderClick={handleQuickOrderDefault} />
            <CategoriesSection categories={categories} />
            <FuelCalculatorSection onQuickOrderClick={handleQuickOrderDefault} />
            <DeliverySection />
            <ReviewsSection />
            <FaqSection pageId="home" />

            <SeoIntroSection />
            <SeoFooterSection />
            <SeoContentBlock />

            <CtaBanner />
            <ContactSection />

            <OrderFormModal
                isOpen={!!orderFormPayload}
                onClose={() => setOrderFormPayload(null)}
                defaultRef={typeof orderFormPayload === 'object' ? orderFormPayload : null}
            />
        </>
    );
}

export default Home;
