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
import { SeoIntroSection, SeoFooterSection, FaqSection } from './new-home/SeoSections';
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
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    const { pageData } = usePageSEO('/');

    const handleQuickOrderDefault = () => {
        setIsOrderFormOpen(true);
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

    const faqQuestions = [
        {
            "@type": "Question",
            "name": "Які дрова краще для опалення?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Для котлів та камінів найчастіше використовують дубові або грабові дрова. Вони мають високу тепловіддачу та довго горять."
            }
        },
        {
            "@type": "Question",
            "name": "Чи можна оплатити після доставки?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Так. Ми працюємо без передоплати — оплата можлива після перевірки замовлення."
            }
        },
        {
            "@type": "Question",
            "name": "Скільки часу займає доставка?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "По Києву доставка можлива в день замовлення. По області — протягом 24 годин."
            }
        },
        {
            "@type": "Question",
            "name": "Які паливні брикети краще?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Брикети Pini-Kay мають високу щільність і довго горять, а брикети RUF є більш доступними за ціною."
            }
        },
        {
            "@type": "Question",
            "name": "Чи доставляєте ви по Київській області?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Так, доставка здійснюється по Києву та всій Київській області власним транспортом."
            }
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqQuestions
    };

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

    const combinedSchema = [homeSchema, faqSchema, ...productSchema];

    return (
        <>
            <SEOHead
                title={pageData?.meta_title || "Дрова, брикети та вугілля з доставкою по Києву | КиївБрикет"}
                description={pageData?.meta_description || "Купити дрова, паливні брикети та вугілля у Києві. Швидка доставка по Києву та області. Чесний складометр, оплата після отримання."}
                canonicalUrl={`${shopConfig.domain}/`}
                schema={combinedSchema}
            />

            <HeroSection onQuickOrderClick={handleQuickOrderDefault} />
            <BenefitsSection />
            <TrustBlock onOrderClick={handleQuickOrderDefault} />
            <CategoriesSection categories={categories} />
            <FuelCalculatorSection onQuickOrderClick={handleQuickOrderDefault} />
            <DeliverySection />
            <ReviewsSection />
            <FaqSection faqs={faqQuestions} />

            <SeoIntroSection />
            <SeoFooterSection />

            <CtaBanner />
            <ContactSection />

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
            />
        </>
    );
}

export default Home;
