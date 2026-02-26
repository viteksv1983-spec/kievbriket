import { getCategoryUrl, getProductUrl } from '../utils/urls';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import shopConfig from '../shop.config';
import logo from '../assets/logo.webp';
import { CartContext } from '../context/CartContext';
import QuickOrderModal from './QuickOrderModal';
import heroBanner from '../assets/hero-banner.webp';
import mobileHeroBg from '../assets/mobile_hero_bg.webp';
import transparentHeroCake from '../assets/transparent-hero-cake.webp';
import bentoImg from '../assets/category-bento.webp';
import biscuitImg from '../assets/category-biscuit.webp';
import mousseImg from '../assets/category-mousse.webp';

import { CATEGORIES } from '../constants/categories';
import { FILLINGS } from '../constants/fillings';
import SEOHead from './SEOHead';

const blockStyles = [
    { bg: 'bg-[#FFF0F5]', border: 'border-pink-100', shadow: 'shadow-[0_8px_30px_rgba(160,21,62,0.06)] hover:shadow-[0_15px_40px_rgba(160,21,62,0.12)]' },
    { bg: 'bg-[#FFFBEB]', border: 'border-amber-100', shadow: 'shadow-[0_8px_30px_rgba(210,170,0,0.06)] hover:shadow-[0_15px_40px_rgba(210,170,0,0.12)]' },
    { bg: 'bg-[#F5F0FF]', border: 'border-purple-100', shadow: 'shadow-[0_8px_30px_rgba(120,60,220,0.06)] hover:shadow-[0_15px_40px_rgba(120,60,220,0.12)]' },
    { bg: 'bg-[#F0F8FF]', border: 'border-blue-100', shadow: 'shadow-[0_8px_30px_rgba(0,100,200,0.06)] hover:shadow-[0_15px_40px_rgba(0,100,200,0.12)]' },
    { bg: 'bg-[#F5FFFA]', border: 'border-teal-100', shadow: 'shadow-[0_8px_30px_rgba(0,150,120,0.06)] hover:shadow-[0_15px_40px_rgba(0,150,120,0.12)]' },
    { bg: 'bg-[#FFF5EE]', border: 'border-orange-100', shadow: 'shadow-[0_8px_30px_rgba(200,100,50,0.06)] hover:shadow-[0_15px_40px_rgba(200,100,50,0.12)]' },
    { bg: 'bg-[#F8F8FF]', border: 'border-indigo-100', shadow: 'shadow-[0_8px_30px_rgba(80,80,200,0.06)] hover:shadow-[0_15px_40px_rgba(80,80,200,0.12)]' },
    { bg: 'bg-[#FFFFF0]', border: 'border-yellow-100', shadow: 'shadow-[0_8px_30px_rgba(200,200,50,0.06)] hover:shadow-[0_15px_40px_rgba(200,200,50,0.12)]' },
    { bg: 'bg-[#F0FFF0]', border: 'border-green-100', shadow: 'shadow-[0_8px_30px_rgba(50,200,50,0.06)] hover:shadow-[0_15px_40px_rgba(50,200,50,0.12)]' },
];

const categoryDescriptions = {
    'wedding': 'Для найголовнішого\nсвята у житті',
    'birthday': 'Яскраві торти для\nвашого свята',
    'anniversary': 'Солідні торти для\nповажних дат',
    'kids': 'Казкові дизайни\nдля малечі',
    'boy': 'Оригінальні торти\nдля хлопчиків',
    'girl': 'Ніжні десерти\nдля дівчаток',
    'for-women': 'Вишукані торти\nдля жінок',
    'for-men': 'Стильні торти\nдля чоловіків',
    'patriotic': 'З любов\'ю\nдо України',
    'gender-reveal': 'Дізнайтесь стать\nмалюка солодко',
    'corporate': 'Індивідуальні\nкорпоративні десерти',
};

const categoryAltTexts = {
    'wedding': 'Весільний торт на замовлення Київ',
    'birthday': 'Торт на день народження Київ',
    'kids': 'Дитячий торт на замовлення Київ',
    'bento': 'Бенто торт Київ',
    'mousse': 'Мусовий торт Київ',
    'corporate': 'Корпоративний торт Київ',
    'anniversary': 'Торт на ювілей Київ',
    'boy': 'Торт для хлопчика на замовлення Київ',
    'girl': 'Торт для дівчинки на замовлення Київ',
    'for-women': 'Торт для жінки на замовлення Київ',
    'for-men': 'Торт для чоловіка на замовлення Київ',
    'patriotic': 'Патріотичний торт на замовлення Київ',
    'gender-reveal': 'Gender reveal торт Київ',
};

const PROMO_CATEGORY_SLUGS = [
    'wedding',
    'birthday',
    'anniversary',
    'kids',
    'patriotic',
    'gender-reveal',
    'for-women',
    'for-men',
    'corporate'
];

const promoCategories = PROMO_CATEGORY_SLUGS.map(slug => CATEGORIES.find(c => c.slug === slug)).filter(Boolean);

function Home() {
    const { addToCart } = useContext(CartContext);
    const [featuredCakes, setFeaturedCakes] = useState([]);
    const [allCakes, setAllCakes] = useState([]);
    const [categoryMetadata, setCategoryMetadata] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [selectedCakeForQuickOrder, setSelectedCakeForQuickOrder] = useState(null);

    // Filter functions for buttons (mapped to categories)
    const handleAddToCart = (cake) => {
        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const defaultFlavor = (cake && CAKE_CATEGORIES.includes(cake.category) && FILLINGS.length > 0) ? FILLINGS[0].name : null;
        addToCart(cake, 1, defaultFlavor, null, null, 'pickup');
    };
    const handleQuickOrderDefault = () => {
        // Find first cake for quick order if none selected
        if (featuredCakes.length > 0) {
            handleQuickOrder(featuredCakes[0]);
        } else {
            // Fallback: search for a generic cake or open modal with placeholder
            setIsQuickOrderOpen(true);
        }
    };

    const handleQuickOrder = (cake) => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const defaultDate = date.toISOString().split('T')[0];

        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const defaultFlavor = (cake && CAKE_CATEGORIES.includes(cake.category) && FILLINGS.length > 0) ? FILLINGS[0].name : null;

        setSelectedCakeForQuickOrder({
            ...cake,
            deliveryDate: defaultDate,
            deliveryMethod: 'pickup',
            flavor: defaultFlavor
        });
        setIsQuickOrderOpen(true);
    };

    useEffect(() => {
        // Fetch all cakes
        api.get('/products/')
            .then(response => {
                setAllCakes(response.data);
                setFeaturedCakes(response.data.slice(0, 4));
            })
            .catch(error => {
                console.error("Error fetching featured cakes", error);
            });

        // Fetch category metadata for promo blocks
        api.get('/admin/categories/metadata')
            .then(response => {
                setCategoryMetadata(response.data);
            })
            .catch(error => {
                console.error("Error fetching category metadata", error);
            });

        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const homeSchema = {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Bakery"],
        "name": shopConfig.name,
        "image": `${shopConfig.domain}/og-image.jpg`,
        "url": `${shopConfig.domain}/`,
        "telephone": "+380979081504",
        "priceRange": "₴₴",
        "areaServed": { "@type": "City", "name": "Kyiv" },
        "sameAs": ["https://www.instagram.com/antreme.kyiv/"],
        "servesCuisine": [
            "Торти на замовлення",
            "Весільні торти",
            "Дитячі торти",
            "Бенто-торти",
            "Десерти"
        ],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Харківське шосе, 180/21",
            "addressLocality": "Київ",
            "postalCode": "02091",
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

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Чи можна замовити торт у Києві терміново?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Залежить від завантаженості та складності замовлення. Прості торти без складного декору ми іноді виконуємо за 2 дні. Уточнюйте наявність через контакти."
                }
            },
            {
                "@type": "Question",
                "name": "За скільки днів потрібно робити замовлення?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Мінімальний термін — 3 робочі дні. Для складних весільних тортів рекомендуємо звертатися за 2–4 тижні."
                }
            },
            {
                "@type": "Question",
                "name": "Чи можна обрати індивідуальну начинку?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Так, ми погоджуємо склад до виробництва. Пропонуємо 7+ авторських начинок та складаємо індивідуальні комбінації."
                }
            },
            {
                "@type": "Question",
                "name": "Скільки коштує доставка торта по Києву?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Доставка розраховується за тарифами таксі (Uklon/Bolt) від нашої кондитерської до вашої адреси. Самовивіз — безкоштовно."
                }
            },
            {
                "@type": "Question",
                "name": "Чи є варіанти без глютену або для алергіків?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Розглядаємо такі запити індивідуально. Звертайтесь — обговоримо склад і можливості для вашого випадку."
                }
            },
            {
                "@type": "Question",
                "name": "Чи працюєте ви з корпоративними замовленнями?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Так, виготовляємо торти з брендуванням, логотипом або корпоративними кольорами для будь-якого масштабу заходу."
                }
            }
        ]
    };

    const productSchema = featuredCakes.map(cake => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": cake.name,
        "image": cake.image_url ? (cake.image_url.startsWith('http') ? cake.image_url : `${shopConfig.domain}${cake.image_url}`) : "",
        "description": `Авторський торт "${cake.name}" на замовлення в Києві. Індивідуальний дизайн, натуральні інгредієнти.`,
        "offers": {
            "@type": "Offer",
            "price": cake.price,
            "priceCurrency": "UAH",
            "availability": "https://schema.org/InStock",
            "url": `${shopConfig.domain}${getProductUrl(cake)}`
        }
    }));

    const combinedSchema = [homeSchema, faqSchema, ...productSchema];

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <SEOHead
                title="Торти на замовлення Київ — Antreme | Авторська кондитерська"
                description="Замовити торт у Києві з індивідуальним дизайном та доставкою. Весільні, дитячі, бенто та святкові торти на замовлення. Antreme — авторська кондитерська."
                canonical="/"
                ogImage="/og-image.jpg"
                schema={combinedSchema}
            />
            {/* ====== HERO SECTION ====== */}
            <div className="w-full pt-2 md:pt-4 mb-4 md:mb-6 px-4 md:px-10">
                <section
                    className="max-w-[1340px] mx-auto relative flex flex-col md:block rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #3D0814 0%, #5a0020 45%, #7b002c 100%)' }}
                >
                    {/* === DESKTOP: bg-image approach === */}
                    <img
                        src={heroBanner}
                        alt="Торт на замовлення в Києві від кондитерської Antreme"
                        className="absolute inset-0 w-full h-full object-cover hidden md:block"
                        style={{ zIndex: 0, objectPosition: 'center right' }}
                        fetchpriority="high"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* === MOBILE: Transparent PNG Cake overlay === */}
                    <img
                        src="/transparent-hero-cake.webp"
                        alt="Торт на замовлення Київ – Antreme"
                        className="absolute right-[-10%] bottom-[20%] w-[82%] object-contain md:hidden pointer-events-none"
                        style={{ zIndex: 5 }}
                        fetchpriority="high"
                        width="600"
                        height="600"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* Desktop gradient overlay */}
                    <div
                        className="absolute inset-0 hidden md:block"
                        style={{
                            background: 'linear-gradient(90deg, rgba(61,8,20,0.95) 0%, rgba(90,0,32,0.85) 35%, rgba(123,0,44,0.45) 60%, rgba(123,0,44,0.15) 80%, transparent 100%)',
                            zIndex: 1
                        }}
                    ></div>

                    {/* Декоративное розовое свечение */}
                    <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-[#C0314A]/15 to-transparent pointer-events-none" style={{ zIndex: 2 }}></div>

                    {/* Золотые боке-частицы */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
                        <div className="absolute top-[8%] right-[12%] w-[80px] h-[80px] rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[50%] right-[5%] w-[120px] h-[120px] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #F5C24D 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[15%] right-[35%] w-[60px] h-[60px] rounded-full opacity-[0.1]" style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}></div>
                        <div className="absolute bottom-[20%] right-[18%] w-[90px] h-[90px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #F5C24D 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[65%] right-[40%] w-[50px] h-[50px] rounded-full opacity-[0.09]" style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[12%] right-[22%] w-2 h-2 bg-[#FFD700] rounded-full opacity-50 animate-pulse" style={{ boxShadow: '0 0 10px 4px rgba(255,215,0,0.3)' }}></div>
                        <div className="absolute top-[30%] right-[8%] w-1.5 h-1.5 bg-[#F5C24D] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s', boxShadow: '0 0 8px 3px rgba(245,194,77,0.35)' }}></div>
                        <div className="absolute top-[55%] right-[28%] w-1 h-1 bg-[#FFD700] rounded-full opacity-55 animate-pulse" style={{ animationDelay: '0.5s', boxShadow: '0 0 6px 2px rgba(255,215,0,0.4)' }}></div>
                        <div className="absolute top-[22%] right-[45%] w-1.5 h-1.5 bg-[#F5C24D] rounded-full opacity-35 animate-pulse" style={{ animationDelay: '1.5s', boxShadow: '0 0 8px 3px rgba(245,194,77,0.3)' }}></div>
                        <div className="absolute top-[75%] right-[15%] w-1 h-1 bg-[#FFD700] rounded-full opacity-45 animate-pulse" style={{ animationDelay: '2s', boxShadow: '0 0 6px 2px rgba(255,215,0,0.35)' }}></div>
                        <div className="absolute top-[40%] right-[50%] w-2 h-2 bg-[#F5C24D] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.8s', boxShadow: '0 0 10px 4px rgba(245,194,77,0.25)' }}></div>
                        <div className="absolute top-[5%] right-[30%] w-1 h-1 bg-[#FFD700] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1.2s', boxShadow: '0 0 6px 2px rgba(255,215,0,0.3)' }}></div>
                        <div className="absolute top-[85%] right-[35%] w-1.5 h-1.5 bg-[#F5C24D] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2.2s', boxShadow: '0 0 8px 3px rgba(245,194,77,0.2)' }}></div>
                        <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #FFD700, transparent 60%)' }}></div>
                    </div>

                    {/* === MOBILE FLEX COLUMN: Text(1) → Cake(2) → Buttons(3) === */}
                    {/* === DESKTOP: Flow layout with padding === */}

                    {/* === MOCKUP-STYLE MOBILE CONTENT === */}
                    {/* — ORDER 1: Text Block — */}
                    <div className="relative flex flex-col order-1 px-5 md:px-12 lg:px-16 pt-8 pb-4 md:pb-16 md:pt-16 md:pr-[45%] lg:pr-[42%] md:min-h-[440px] lg:min-h-[480px] justify-center" style={{ zIndex: 10 }}>
                        <div className="w-[65%] md:w-auto">
                            <h1 className="text-[28px] md:text-[40px] lg:text-[50px] xl:text-[56px] font-black text-white leading-[1.15] mb-2 md:mb-3 tracking-tight max-w-[200px] md:max-w-none" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Торти на замовлення в Києві — кондитерська Antreme
                            </h1>
                            <div className="text-[#F5C24D] text-[11px] md:text-[13px] lg:text-[14px] font-black leading-tight mb-2 md:mb-5 tracking-[0.1em] uppercase" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                КОНДИТЕРСЬКА <br className="md:hidden" />
                                МАЙСТЕРНЯ <br className="md:hidden" />
                                ANTREME
                            </div>
                            <p className="text-white/85 text-[11px] md:text-[13px] lg:text-[14px] mb-[10px] md:mb-8 leading-snug font-medium max-w-[400px]">
                                Авторські торти ручної <br className="md:hidden" />
                                роботи <br className="md:hidden" />
                                з натуральних <br className="md:hidden" />
                                інгредієнтів.
                            </p>
                            <p className="text-white/85 text-[11px] md:text-[13px] lg:text-[14px] mb-[10px] md:mb-8 leading-snug font-medium max-w-[400px]">
                                Кожен торт <br className="md:hidden" />
                                створюється <br className="md:hidden" />
                                індивідуально <br className="md:hidden" />
                                протягом 3 днів.
                            </p>
                            <p className="text-white/85 text-[11px] md:text-[13px] lg:text-[14px] mb-0 md:mb-8 leading-snug font-medium max-w-[400px]">
                                Доставка по Києву у зручний для вас час.
                            </p>
                        </div>

                        {/* Desktop buttons (hidden on mobile) */}
                        <div className="hidden md:flex flex-row items-center gap-3 mt-8">
                            <button
                                onClick={handleQuickOrderDefault}
                                className="h-[48px] lg:h-[52px] px-6 lg:px-8 bg-gradient-to-b from-[#FAD872] via-[#F5C24D] to-[#D4A048] hover:brightness-110 text-[#5E0C1B] font-black uppercase tracking-wider text-[12px] lg:text-[13px] rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(245,194,77,0.45)] active:scale-95 flex items-center justify-center whitespace-nowrap"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}
                            >
                                ЗАМОВИТИ ТОРТ
                            </button>
                            <Link
                                to="/torty-na-zamovlennya/"
                                className="h-[48px] lg:h-[52px] px-5 lg:px-6 bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-black uppercase tracking-wider text-[11px] lg:text-[12px] rounded-full transition-all duration-300 flex items-center justify-center text-center whitespace-nowrap"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}
                            >
                                ПЕРЕГЛЯНУТИ КАТАЛОГ
                            </Link>
                        </div>
                    </div>

                    {/* — ORDER 2: Mobile Buttons (at bottom) — */}
                    <div className="relative order-2 md:hidden flex flex-row items-center justify-start gap-2 px-5 pb-7 mt-3" style={{ zIndex: 10 }}>
                        <button
                            onClick={handleQuickOrderDefault}
                            className="flex-1 h-[42px] bg-gradient-to-b from-[#FAD872] via-[#F5C24D] to-[#D4A048] hover:brightness-110 text-[#5E0C1B] font-black uppercase tracking-wider text-[11px] rounded-[20px] transition-all duration-300 shadow-[0_4px_12px_rgba(245,194,77,0.3)] min-w-[140px]"
                            style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}
                        >
                            ЗАМОВИТИ ТОРТ
                        </button>
                        <Link
                            to="/torty-na-zamovlennya/"
                            className="flex-1 h-[42px] bg-[#9e1634] bg-opacity-90 border border-white/20 hover:bg-[#8B1030] text-white font-black uppercase tracking-[0.05em] text-[10px] rounded-[20px] transition-all duration-300 shadow-sm flex flex-col items-center justify-center leading-[1.2]"
                            style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}
                        >
                            <span>ПЕРЕГЛЯНУТИ</span>
                            <span>КАТАЛОГ</span>
                        </Link>
                    </div>
                </section>
            </div>


            {/* ====== CATEGORY CARDS — горизонтальный макет: текст слева, фото справа ====== */}
            <div className="w-full px-3 md:px-8 pt-4 md:pt-6 pb-8 md:pb-10" id="categories">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {promoCategories.map((cat, index) => {
                        const style = blockStyles[index % blockStyles.length];
                        const meta = categoryMetadata.find(m => m.slug === cat.slug);
                        let imgUrl = meta?.image_url;
                        if (imgUrl && !imgUrl.startsWith('http')) {
                            imgUrl = `${api.defaults.baseURL}${imgUrl}`;
                        } else if (!imgUrl) {
                            imgUrl = `https://placehold.co/400x400/fff/7b002c?text=${cat.name}`;
                        }

                        const desc = categoryDescriptions[cat.slug] || 'Ексклюзивні торти\nна замовлення';

                        return (
                            <div key={cat.slug} className={`group relative flex flex-row items-stretch ${style.bg} rounded-[1.5rem] md:rounded-[2rem] ${style.shadow} transition-all duration-500 overflow-visible ${style.border} border hover:-translate-y-1 min-h-[130px] md:min-h-[160px] `}>
                                <div className="flex-1 px-5 md:px-7 py-5 md:py-7 z-10 w-[60%] flex flex-col items-start">
                                    <h2 className="text-[17px] md:text-[20px] lg:text-[22px] font-black text-gray-900 mb-1.5 uppercase tracking-tight leading-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        {cat.name}
                                    </h2>
                                    <p className="text-gray-700 mb-4 text-[11px] md:text-[13px] font-medium leading-snug whitespace-pre-line flex-grow">
                                        {desc}
                                    </p>
                                    <Link to={getCategoryUrl(cat.slug)} className="mt-auto inline-block bg-[#f8f3ef] text-[#4a2e2b] border border-[#e8dfd8] px-[16px] py-[8px] text-center font-bold uppercase text-[10px] md:text-[11px] tracking-[0.12em] transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_6px_rgba(0,0,0,0.04)] rounded-full hover:shadow-[0_4px_12px_rgba(74,46,43,0.1)] hover:-translate-y-[2px] hover:bg-[#fff9f5] relative z-10 w-max">
                                        Дивитись {cat.name}
                                    </Link>
                                </div>
                                <div className="relative flex-shrink-0 w-[110px] md:w-[150px] self-end pr-2 md:pr-4 pb-2 md:pb-4">
                                    <img src={imgUrl} alt={categoryAltTexts[cat.slug] || `${cat.name} на замовлення Київ`} width="160" height="160" className="w-full h-auto max-h-[120px] md:max-h-[160px] object-contain mix-blend-multiply group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500" loading="lazy" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Visual Impact Section - Premium Value Proportions */}
            <section className="relative py-24 md:py-36 overflow-hidden bg-[#FDFBF7]">
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B6508] mb-6">Наші принципи</div>
                    <h2 className="text-5xl md:text-8xl lg:text-[110px] font-black mb-10 leading-none uppercase tracking-tighter" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        <span className="text-[#9C751E]">СМАК</span>
                        <span className="text-gray-300 hidden md:inline"> / </span>
                        <span className="text-gray-900">ЯКІСТЬ</span>
                        <span className="text-gray-300 hidden md:inline"> / </span>
                        <span className="text-[#9C751E]">ЦІНА</span>
                    </h2>
                    <p className="text-xl md:text-3xl font-medium italic text-gray-500 border-t border-b border-[#E8C064]/20 py-3 inline-block" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        це наші головні цінності
                    </p>
                </div>
            </section>

            {/* About Section - Confectioner Spotlight */}
            <div className="relative py-24 overflow-hidden bg-[#FDFBF7]">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Image Column */}
                        <div className="w-full lg:w-1/2 animate-fade-in-delayed group">
                            <div className="relative rounded-[2rem] overflow-hidden shadow-xl transform transition duration-500 group-hover:scale-[1.02] border border-gray-100">
                                <img
                                    src="/images/confectioner.webp"
                                    alt="Шеф-кондитер Antreme з авторським тортом у Києві"
                                    className="w-full h-auto object-cover"
                                    width="600"
                                    height="800"
                                    loading="lazy"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                                    <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Людмила Приходько</h3>
                                    <p className="text-[#9C751E] font-medium">Шеф-кондитер</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="w-full lg:w-1/2 relative flex flex-col items-center text-center">
                            <img src={logo} alt="Antreme — авторська кондитерська тортів у Києві" className="w-[380px] h-auto object-contain mb-4 animate-fade-in" loading="lazy" />

                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight animate-fade-in uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                ТОРТИ З <span className="text-[#7A0019]">ДУШЕЮ</span> ТА <span className="text-[#9C751E]">ЛЮБОВ'Ю</span>
                            </h2>

                            <p className="text-lg text-gray-500 mb-10 leading-relaxed font-light animate-fade-in-delayed max-w-xl mx-auto italic">
                                "Я створюю торти з любов'ю та увагою до кожної деталі. Кожен десерт — це маленька історія, виготовлена індивідуально з натуральних інгредієнтів найвищої якості. Моя мета — зробити ваше свято незабутнім."
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full">
                                {[
                                    { icon: '✨', color: '#FFF8E7', title: 'Ручна робота', sub: 'Унікальний дизайн для кожного' },
                                    { icon: '🌿', color: '#F0FFF4', title: 'Натуральність', sub: 'Тільки свіжі інгредієнти' },
                                    { icon: '💝', color: '#FFF5F5', title: "З любов'ю", sub: 'Вкладаю душу в кожен торт' },
                                    { icon: '💎', color: '#F0F5FF', title: 'Якість', sub: 'Бездоганний смак та вигляд' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 bg-white border border-gray-100 shadow-sm hover:shadow-md">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: item.color }}>{item.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-500">{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Holiday Cakes Promo Section - Dark Premium */}
            <section className="py-20 md:py-32 overflow-hidden bg-[#FDFBF7]">
                <div className="container mx-auto px-4 md:px-8">
                    <Link to="/torty-na-zamovlennya/" className="group block relative overflow-hidden rounded-3xl md:rounded-[3rem] border border-gray-100 hover:border-[#E8C064]/40 transition-all duration-500 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                        <div className="flex flex-col md:flex-row items-center">
                            {/* Text Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-20 text-center md:text-left z-10 flex flex-col justify-center">
                                <div className="mb-4">
                                    <span className="inline-block px-4 py-1.5 bg-[#7A0019] text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-full">
                                        Нова Колекція
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Торти для вашого <br />
                                    <span className="text-[#7A0019]">особливого свята</span>
                                </h2>
                                <p className="text-gray-500 text-sm md:text-lg mb-8 md:mb-12 max-w-md font-medium leading-relaxed">
                                    Від бенто-тортів до величних весільних шедеврів. Оберіть ідеальну категорію для вашої незабутньої події.
                                </p>
                                <div className="inline-flex items-center justify-center md:justify-start gap-3 bg-[#7A0019] text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-[#5a0014] transition-all shadow-md active:scale-95 group/btn w-fit mx-auto md:mx-0">
                                    Відкрити каталог
                                    <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Image Grid / Visual */}
                            <div className="w-full md:w-1/2 h-[300px] md:h-[650px] relative overflow-hidden order-first md:order-last rounded-t-3xl md:rounded-t-none md:rounded-r-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=1000"
                                    alt="Ексклюзивні святкові та весільні торти на замовлення в Києві"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                                    width="1000"
                                    height="650"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <div className="relative pt-10 md:pt-20 pb-16 md:pb-20 overflow-hidden bg-[#FDFBF7]">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-8 md:mb-14 animate-fade-in">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B6508] mb-3">Популярні</div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Обирають найчастіше
                        </h2>
                        <div className="w-16 h-1 bg-[#E8C064] mx-auto mt-4 rounded-full" />
                    </div>

                    {featuredCakes.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                                {featuredCakes.map((cake, index) => (
                                    <div
                                        key={cake.id}
                                        className="group flex flex-col bg-white rounded-2xl md:rounded-3xl transition-all duration-300 border border-gray-100 p-4 md:p-5 pb-5 md:pb-6 h-full animate-fade-in-stagger hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Image Container */}
                                        <Link to={getProductUrl(cake)} className="relative w-full aspect-square mb-4 flex items-center justify-center">
                                            {/* Badges */}
                                            <div className="absolute top-0 left-0 flex flex-col gap-2 z-20 pointer-events-none">
                                                {index === 0 && (
                                                    <div className="bg-[#7A0019] text-white text-[7px] md:text-[9px] font-black uppercase w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white tracking-tighter">
                                                        Хіт
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-full h-full flex items-center justify-center relative z-10 p-2">
                                                {cake.image_url && (
                                                    <img
                                                        src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                                        alt={`${cake.name} – замовити в Києві`}
                                                        className="w-full h-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                )}
                                            </div>
                                        </Link>

                                        {/* Content Section */}
                                        <div className="flex flex-col flex-grow text-center items-center justify-between">
                                            <div className="w-full">
                                                <Link to={getProductUrl(cake)}>
                                                    <h3 className="text-[14px] md:text-[16px] font-black text-gray-900 uppercase tracking-wide leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#7A0019] transition-colors duration-300">
                                                        {cake.name}
                                                    </h3>
                                                </Link>
                                            </div>

                                            {/* Price & Action Section */}
                                            <div className="w-full flex-col flex items-center mt-3">
                                                <div className="text-[22px] md:text-[26px] font-black text-[#8B6508] flex items-baseline justify-center mb-4 leading-none">
                                                    {cake.price} <span className="text-[12px] md:text-[14px] font-bold text-gray-500 ml-1.5 uppercase">грн</span>
                                                </div>

                                                <div className="flex items-center gap-2 w-full justify-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleQuickOrder(cake);
                                                        }}
                                                        className="flex-1 h-10 md:h-12 bg-[#7A0019] hover:bg-[#9C142B] text-white font-bold uppercase tracking-wider text-[9px] md:text-[11px] rounded-[10px] md:rounded-xl transition-all duration-300 active:scale-95"
                                                    >
                                                        Швидке замовлення
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleAddToCart(cake);
                                                        }}
                                                        className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-[#E8C064] hover:bg-[#D4A83C] text-[#5A0014] rounded-[10px] md:rounded-xl flex items-center justify-center transition-all active:scale-95 group/cart"
                                                        aria-label="Додати в кошик"
                                                    >
                                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="9" cy="21" r="1" />
                                                            <circle cx="20" cy="21" r="1" />
                                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-12 animate-fade-in-delayed">
                                <Link to="/torty-na-zamovlennya/" className="group inline-flex items-center gap-3 px-12 py-5 font-black uppercase text-sm tracking-wider transition-all hover:scale-105 duration-300 rounded-full bg-[#E8C064] hover:bg-[#D4A83C] text-[#5A0014] shadow-md">
                                    Всі пропозиції
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-[#7A0019]/20 border-t-[#7A0019] rounded-full animate-spin mb-4"></div>
                            <div className="text-gray-500 font-medium tracking-wider text-sm animate-pulse uppercase">Завантаження шедеврів...</div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== PROCESS SECTION (How to Order) ===== */}
            <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Як зробити <span className="text-[#9C751E]">замовлення</span>?
                    </h2>
                    <p className="text-gray-500 font-medium italic max-w-xl mx-auto" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        Всього 4 прості кроки до ідеального свята
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#E8C064] via-gray-200 to-[#E8C064] z-0"></div>

                    {[
                        { step: '01', title: 'Оберіть дизайн', desc: 'Перегляньте каталог або надішліть нам своє фото для натхнення.' },
                        { step: '02', title: 'Виберіть начинку', desc: 'Більше 15 авторських смаків: від класики до екзотики.' },
                        { step: '03', title: 'Деталі та Оплата', desc: 'Узгоджуємо вагу, дату доставки та вносимо передплату.' },
                        { step: '04', title: 'Насолоджуйтесь!', desc: 'Отримуєте свій ідеальний торт точно у визначений час.' }
                    ].map((item, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-[#FDFBF7] shadow-xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                                <span className="text-3xl font-black text-[#7A0019]" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>{item.step}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 max-w-[200px]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Banner - Premium Dark */}
            <div className="relative py-24 md:py-36 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 mb-8">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8C064] mb-5">Antreme</div>
                    <h3 className="text-4xl md:text-6xl font-black mb-5 animate-fade-in tracking-tight text-white uppercase" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        ГОТОВІ ЗАМОВИТИ <span className="text-[#E8C064]">ТОРТ МРІЇ?</span>
                    </h3>
                    <p className="text-xl mb-10 text-white/65 italic max-w-2xl mx-auto animate-fade-in-delayed" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        Дозвольте собі шматочок справжнього щастя. Оберіть свій ідеальний смак прямо зараз.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-delayed">
                        <a href="tel:0979081504" className="inline-flex items-center gap-2 px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 border border-white/30 text-white hover:border-white/60 hover:bg-white/10">
                            📞 097 908 15 04
                        </a>
                        <Link to="/torty-na-zamovlennya/" className="inline-block px-12 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#5A0014] shadow-md">
                            Обрати Торт
                        </Link>
                    </div>
                </div>
            </div>

            {/* ===== DELIVERY MAP SECTION ===== */}
            <div className="bg-[#FDFBF7] py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-10 md:mb-14">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B6508] mb-3">Доставка</div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Доставляємо у <span className="text-[#7A0019]">всі райони Києва</span>
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
                            Швидка та бережна доставка вашого торту на таксі у всі райони: <strong>Печерський, Оболонь, Троєщина, Позняки, Дарниця, Голосіїв, Шевченківський та Солом'янський.</strong>
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 max-w-6xl mx-auto">
                        {/* Map */}
                        <div className="w-full lg:w-3/5 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] bg-white" style={{ minHeight: '400px' }}>
                            <iframe
                                title="Доставка по Києву"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d162757.45277145904!2d30.39475415!3d50.4016355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf4ee15a4505%3A0x764931d2170146fe!2z0JrQuNC10LIsINCj0LrRgNCw0LjQvdCwLCAwMjAwMA!5e0!3m2!1suk!2sua!4v1700000000000!5m2!1suk!2sua"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '400px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Info Cards */}
                        <div className="w-full lg:w-2/5 flex flex-col gap-4">
                            {/* Taxi delivery card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] flex items-center justify-center text-2xl">🚕</div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase text-sm tracking-wide" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Доставка на таксі</h3>
                                        <p className="text-xs text-gray-500">По всьому Києву</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed mb-3">
                                    Ви сплачуєте лише вартість поїздки таксі. Кондитер особисто передає торт водію з інструкціями щодо бережного перевезення.
                                </p>
                                <div className="flex items-center gap-2 text-[#8B6508] font-black text-sm">
                                    <span>⏱</span> 30–90 хвилин по місту
                                </div>
                            </div>

                            {/* Pickup card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F0FFF4] flex items-center justify-center text-2xl">🏪</div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase text-sm tracking-wide" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Самовивіз</h3>
                                        <p className="text-xs text-gray-500">г. Київ, вул. Прирічна 11</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Забрати у зручний для вас час за адресою:<br />
                                    <span className="text-gray-900 font-semibold">вул. Харківське шосе, 180/21</span>
                                </p>
                            </div>

                            {/* Advantages strip */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: '❄️', label: 'Термопакет' },
                                    { icon: '🎂', label: 'Бережно' },
                                    { icon: '📍', label: 'Всі райони' },
                                ].map((a, i) => (
                                    <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
                                        <div className="text-xl mb-1">{a.icon}</div>
                                        <div className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-wider">{a.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link to="/dostavka/" className="block text-center bg-[#7A0019] hover:bg-[#5a0014] text-white font-black uppercase tracking-widest text-xs md:text-sm py-4 rounded-2xl transition-all active:scale-95 shadow-md">
                                Детальніше про доставку →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== INSTAGRAM REVIEWS CAROUSEL ===== */}
            <div className="bg-[#FDFBF7] py-16 md:py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-10 md:mb-14">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            {/* Instagram gradient icon */}
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                                <svg className="w-5 h-5 md:w-6 md:h-6 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.058-2.148.262-2.91.56a5.89 5.89 0 00-2.126 1.384 5.89 5.89 0 00-1.383 2.127c-.298.762-.502 1.633-.561 2.91-.057 1.28-.072 1.688-.072 4.947s.015 3.667.072 4.947c.059 1.277.263 2.148.561 2.91a5.89 5.89 0 001.383 2.127 5.89 5.89 0 002.127 1.383c.762.298 1.633.502 2.91.561 1.28.057 1.688.072 4.947.072s3.667-.015 4.947-.072c1.277-.059 2.148-.263 2.91-.561a5.89 5.89 0 002.127-1.383 5.89 5.89 0 001.383-2.127c.298-.762.502-1.633.561-2.91.057-1.28.072-1.688.072-4.947s-.015-3.667-.072-4.947c-.059-1.277-.263-2.148-.561-2.91a5.89 5.89 0 00-1.383-2.127 5.89 5.89 0 00-2.127-1.383c-.762-.298-1.633-.502-2.91-.561-1.28-.057-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Відгуки клієнтів
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Реальні відгуки з Instagram та месенджерів
                        </p>
                    </div>

                    {/* Stories Row — horizontal scroll */}
                    <div className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 md:-mx-0 md:px-0 mb-8 md:mb-12 justify-center">
                        {[
                            { id: 1, title: "Єдиноріг", thumb: "/reviews/review_1.jpg" },
                            { id: 2, title: "Ми разом", thumb: "/reviews/review_2.jpg" },
                            { id: 3, title: "Капкейки", thumb: "/reviews/review_3.jpg" },
                            { id: 4, title: "Річниця", thumb: "/reviews/review_4.jpg" },
                            { id: 5, title: "Відгук", thumb: "/reviews/review_5.jpg" },
                            { id: 6, title: "Pokemon", thumb: "/reviews/review_6.jpg" },
                            { id: 7, title: "Перфект", thumb: "/reviews/review_7.jpg" },
                        ].map(story => (
                            <Link to="/vidguky/" key={story.id} className="shrink-0 flex flex-col items-center gap-1.5 group">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                                        <img src={story.thumb} alt={`Відгук клієнта Antreme – ${story.title}`} className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                </div>
                                <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center leading-tight max-w-[70px] line-clamp-1">{story.title}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Review Cards Carousel */}
                    <div className="relative">
                        {/* Scroll arrows (desktop) */}
                        <button onClick={() => document.getElementById('reviewsCarousel')?.scrollBy({ left: -360, behavior: 'smooth' })} aria-label="Попередній відгук" className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center hover:shadow-xl hover:border-[#E8C064] transition-all">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => document.getElementById('reviewsCarousel')?.scrollBy({ left: 360, behavior: 'smooth' })} aria-label="Наступний відгук" className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center hover:shadow-xl hover:border-[#E8C064] transition-all">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>

                        <div id="reviewsCarousel" className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-4 px-4 md:-mx-0 md:px-0" style={{ scrollSnapType: 'x mandatory' }}>
                            {[
                                { id: 1, text: "Смакуємо торт))) цей смак неймовірний, торт не мокрий а саме так як має бути. Все до смаку. Дякуємо ❤️", author: "Ольга" },
                                { id: 2, text: "Людочка, Ви, як завжди, на висоті! Торт неперевершений. Смак просто 🔥 всі в захваті!", author: "Наталія" },
                                { id: 3, text: "Дякуємо за неймовірно смачний тортик ❤️ і чудове свято!", author: "Катерина" },
                                { id: 4, text: "Дуже смачно 😍 Дякуємо Вам за свято! Торт був просто неймовірний!", author: "Марина" },
                                { id: 5, text: "Тортик був на смак просто неймовірний, на дууууже смачний 😊 Дякуємо!", author: "Тетяна" },
                                { id: 6, text: "Дуже дякую за ту красоту і смакоту 🔥🔥🔥 просто неперевершена ✨✨✨", author: "Ірина" },
                                { id: 7, text: "Тортик неймовірний! Батьки прослезились! Це так гарно! ❤️❤️", author: "Андрій" },
                                { id: 8, text: "Торт був неймовірно смачний і красивий, як завжди на протязі багатьох років ❤️", author: "Олена" },
                            ].map(review => (
                                <div key={review.id} className="shrink-0 w-[80vw] md:w-[340px] lg:w-[360px]" style={{ scrollSnapAlign: 'start' }}>
                                    <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 h-full flex flex-col border border-gray-50">
                                        {/* Quote icon */}
                                        <div className="text-[#9C751E]/30 text-4xl font-serif leading-none mb-2 select-none">"</div>

                                        {/* Stars */}
                                        <div className="flex items-center gap-0.5 mb-3">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <svg key={s} className="w-3.5 h-3.5 text-[#9C751E]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>

                                        {/* Text */}
                                        <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed mb-5 flex-1 italic">
                                            {review.text}
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            <div className="w-9 h-9 rounded-full bg-[#7A0019] text-white flex items-center justify-center font-black text-sm shadow-sm">
                                                {review.author[0]}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-900">{review.author}</div>
                                                <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                    Перевірений покупець
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA link */}
                    <div className="text-center mt-8 md:mt-10">
                        <Link to="/vidguky/" className="inline-flex items-center gap-2 text-[#7A0019] font-black text-xs uppercase tracking-wider border-b-2 border-[#E8C064] pb-1 hover:text-[#9C142B] transition-all">
                            Всі відгуки
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
            {/* ====== SEO TEXT + FAQ SECTION ====== */}
            <section aria-label="Про кондитерську" className="max-w-7xl mx-auto px-4 md:px-10 py-16">

                {/* --- SEO Text Block --- */}
                <article className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 mb-12">
                    <div className="prose prose-sm md:prose-base max-w-none text-gray-600 space-y-4">

                        {/* SEO Context for Google */}
                        <div className="sr-only">Antreme — авторська кондитерська в Києві. Торти на замовлення з доставкою по всіх районах.</div>

                        <p><strong>Antreme</strong> — авторська <strong>кондитерська в Києві</strong> з понад 20-річною історією. Спеціалізація — <strong>торти на замовлення</strong> для приватних свят, весіль, корпоративів та сімейних подій. Тут не купують готовий десерт — тут отримують продукт, виготовлений під конкретну дату, конкретний стиль та конкретну кількість гостей.</p>

                        <p>Antreme — це кондитерська в Києві, яка працює у форматі повного циклу виробництва: від розробки концепції до доставки готового виробу. Виготовлення тортів під замовлення для приватних та корпоративних клієнтів — без складських залишків і масового виробництва.</p>

                        <p>Якщо ви шукаєте, де <strong>замовити торт у Києві</strong> з доставкою та гарантією якості, Antreme працює саме в сегменті індивідуальних рішень — без шаблонів і масового виробництва.</p>

                        <p>Якщо ви вирішили <strong>замовити торт у Києві</strong> і хочете бути впевнені в результаті — цифри говорять самі за себе:</p>

                        <ul className="list-none pl-0 space-y-1 mt-2 mb-4 text-gray-800 font-semibold">
                            <li>✔ 6 000+ виконаних замовлень</li>
                            <li>✔ 9 000+ підписників Instagram</li>
                            <li>✔ 20 років досвіду</li>
                        </ul>

                        <p>Кожне замовлення задокументоване. Кожен відгук — справжній.</p>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Чому обирають Antreme, а не іншу кондитерську
                        </h2>
                        <p>Більшість кондитерських у Києві пропонують стандартний набір: каталог шаблонів, обмежений список начинок, мінімальне залучення клієнта до процесу. Antreme працює інакше.</p>
                        <ul className="list-disc pl-5 space-y-2 mt-3">
                            <li><strong>Натуральні інгредієнти</strong> — вершкове масло, бельгійський шоколад, натуральні вершки, сезонні ягоди та фрукти. Жодного маргарину, замінників какао-масла чи штучних стабілізаторів. Склад завжди доступний клієнту до оформлення.</li>
                            <li><strong>Індивідуальний дизайн</strong> — концепція розробляється під формат заходу: від мінімалізму та сучасної геометрії до складного тематичного декору. Ваш торт не повторюватиметься.</li>
                            <li><strong>Прозоре ціноутворення.</strong> Фінальна <strong>ціна торта на замовлення</strong> фіксується до початку виробництва. Без доплат за «складність», «терміновість» чи «нестандартний колір».</li>
                            <li><strong>Шеф-кондитер із 20-річним стажем.</strong> Людмила Приходько особисто контролює кожен етап — від замісу до пакування. Це не конвеєр, а майстерня з іменем.</li>
                        </ul>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торт під замовлення: повний цикл — від ідеї до подачі
                        </h2>
                        <p>Жодного готового торта на вітрині. Кожен <strong>торт під замовлення</strong> проходить погодження дизайну, ваги, начинки, дати та часу отримання. Виробництво стартує лише після затвердження всіх деталей — тому результат завжди відповідає очікуванням.</p>
                        <p>Стандартний цикл — від 3 робочих днів. Для простих форматів доступне <strong>термінове виготовлення торта</strong> за 24–48 годин — за умови вільної дати у графіку виробництва. <strong>Весільний торт Київ</strong> — рекомендований термін бронювання від 2 до 4 тижнів.</p>

                        <p className="mt-4">Antreme підходить для тих, хто:</p>
                        <ul className="list-none pl-0 space-y-1 mt-2 mb-4 text-gray-700">
                            <li>– планує весілля або сімейне свято</li>
                            <li>– шукає корпоративний торт з логотипом</li>
                            <li>– хоче <strong>купити торт у Києві</strong> без ризику «як на фото — так і в реальності»</li>
                            <li>– цінує натуральний склад та персональний підхід</li>
                        </ul>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Скільки коштує торт на замовлення у Києві
                        </h2>
                        <p>Вартість залежить від трьох факторів: вага виробу, обрана начинка та складність декору. Немає фіксованого прайсу — є чесний індивідуальний розрахунок під ваше замовлення.</p>
                        <ul className="list-disc pl-5 space-y-1 mt-3">
                            <li>Бенто-торти (300–400 г) — від 300 грн</li>
                            <li>Класичні торти від 1 кг — від 650 грн/кг</li>
                            <li>Весільні торти — від 950 грн/кг, фінальна сума після узгодження ярусності та декору</li>
                            <li><strong>Корпоративний торт Київ</strong> — розрахунок за запитом, враховується масштаб події та брендування</li>
                        </ul>
                        <p>Щоб дізнатись, <strong>скільки коштує торт</strong> саме для вашої події — надішліть запит із датою, форматом заходу та кількістю гостей. Точний розрахунок — протягом години.</p>
                        <p className="mt-2 text-gray-500 text-sm">Остаточна вартість залежить від складності декору, кількості ярусів та термінів виготовлення.</p>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Категорії тортів на замовлення в Києві
                        </h2>

                        <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Весільні торти</h3>
                        <p>Багатоярусні конструкції, декор живими квітами, мінімалістичні та класичні композиції. <strong>Весільний торт</strong> — фінальний акорд вашого святкового вечора. Виїзний монтаж на локації (ресторан, заміський комплекс) — включено. <Link to="/torty-na-zamovlennya/vesilni/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Весільні торти для подій у Києві →</Link></p>

                        <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Торти на день народження</h3>
                        <p>Тематичні, іменні, стилізовані під подію — будь-який формат і складність. Від елегантних дорослих дизайнів до яскравих дитячих концепцій. <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Торти на день народження на замовлення →</Link></p>

                        <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Дитячі торти</h3>
                        <p><strong>Дитячий торт Київ</strong> — це яскравий дизайн із перевіреним складом. Улюблені герої дитини, безпечні харчові барвники, обов'язкове погодження алергенів із батьками. Якщо потрібно <strong>замовити дитячий торт у Києві</strong> і бути впевненим у кожному інгредієнті — це сюди. <Link to="/torty-na-zamovlennya/dytyachi/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Дитячі торти на замовлення в Києві →</Link></p>

                        <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Бенто-торти</h3>
                        <p>Компактний формат для персональних привітань — ідеальний подарунок, коли торт потрібен для однієї людини. <Link to="/bento-torty/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Бенто-торти з доставкою по Києву →</Link></p>

                        <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Мусові торти</h3>
                        <p>Повітряна текстура, дзеркальна глазур, нестандартні поєднання смаків. Вибір тих, хто цінує сучасну кондитерську естетику.</p>

                        <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Корпоративні торти</h3>
                        <p><strong>Корпоративний торт</strong> із логотипом, у фірмових кольорах або під тематику івенту. Ефектний акцент для презентацій, річниць компанії та командних свят. <Link to="/torty-na-zamovlennya/korporatyvni/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Корпоративні торти на замовлення в Києві →</Link></p>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Начинки: 15+ авторських смаків
                        </h2>
                        <p>Кожна начинка — це перевірена рецептура, відпрацьована на тисячах замовлень. Найпопулярніші позиції:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Шоколадний трюфель</li>
                            <li>Полуниця з вершками</li>
                            <li>Карамель-банан</li>
                            <li>Лісова ягода</li>
                            <li>Фісташка-малина</li>
                            <li>Лимонний чізкейк</li>
                            <li>Кокос-манго</li>
                        </ul>
                        <p className="mt-2">Індивідуальні комбінації також доступні — достатньо вказати побажання при оформленні. <Link to="/nachynky/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Начинки для тортів на замовлення →</Link></p>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Доставка тортів у всі райони Києва
                        </h2>
                        <p><strong>Доставка тортів Київ</strong> охоплює всі райони без обмежень: Печерськ, Шевченківський, Голосіївський, Солом'янка, Оболонь, Поділ, Дарниця, Позняки, Осокорки, Троєщина, Деснянський район, Святошин. Лівий та правий берег — однаково.</p>
                        <p>Потрібен <strong>торт з доставкою</strong> додому, <strong>доставка в ресторан</strong> чи офіс? Час подачі, температурний режим та формат транспортування узгоджуються заздалегідь. Кондитер особисто передає виріб водію з детальними інструкціями.</p>
                        <p>Доставка можлива як на домашню адресу, так і в ресторан, банкетний зал або офіс у будь-якому районі Києва. <Link to="/dostavka/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Доставка тортів по Києву — умови та райони →</Link></p>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Як замовити торт у Києві
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Опишіть подію — через сайт, Telegram або Viber. Вкажіть дату, кількість гостей, побажання до стилю.</li>
                            <li>Отримайте пропозицію — дизайн, начинка, вага, точна вартість.</li>
                            <li>Затвердіть і внесіть передоплату — фіксація дати виробництва.</li>
                            <li>Отримайте готовий торт — <strong>торт додому</strong> з доставкою по Києву або самовивіз за адресою: Харківське шосе, 180/21.</li>
                        </ol>
                        <p className="mt-3">Якщо ви плануєте <strong>купити торт у Києві</strong> для особливої події — підготуємо індивідуальну пропозицію.</p>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-8 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Портфоліо та реальні відгуки клієнтів у Києві
                        </h2>
                        <p>6 000+ виконаних замовлень. Тисячі фотографій реальних робіт — не студійних постановок, а тортів, які були доставлені клієнтам по всьому Києву. Instagram Antreme — це публічний архів результатів, відкритий для перевірки. <Link to="/vidguky/" className="text-[#7A0019] font-semibold underline underline-offset-2 hover:text-[#9C142B]">Відгуки про торти на замовлення — Antreme Київ →</Link></p>

                        <p className="mt-4">Якщо ви порівнюєте кондитерські в Києві та обираєте, де замовити торт для важливої події — зверніть увагу на досвід, портфоліо та умови виробництва. Antreme поєднує всі три фактори.</p>

                        <p className="mt-6 pt-6 border-t border-gray-100 text-gray-700">
                            <strong>Antreme — кондитерська в Києві, де якість підтверджується не словами, а портфоліо.</strong> Якщо ви плануєте <strong>купити торт у Києві</strong> для особливої події — залиште заявку зараз. Прорахунок вартості протягом 1 години, підбір дизайну та бронювання дати — безкоштовно.
                        </p>
                    </div>
                </article>

                {/* --- CTA Repeat Block --- */}
                <section className="text-center py-10 mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Готові замовити торт у Києві?
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base mb-6 max-w-lg mx-auto">
                        Залиште заявку або зателефонуйте нам — підготуємо індивідуальну пропозицію.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-3 font-black text-xs uppercase tracking-widest rounded-full border border-gray-200 text-gray-800 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">
                            📞 Зателефонувати
                        </a>
                        <Link to="/torty-na-zamovlennya/" className="inline-block px-8 py-3 font-black text-xs uppercase tracking-widest rounded-full bg-[#7A0019] hover:bg-[#5a0014] text-white transition-all shadow-sm">
                            Переглянути каталог
                        </Link>
                    </div>
                </section>

                {/* --- FAQ Block --- */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black text-center text-gray-900 mb-8 uppercase tracking-wide" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Часті запитання
                    </h2>
                    <div className="space-y-4">
                        {[
                            { q: 'Чи можна замовити торт терміново?', a: 'Так, у деяких випадках можливе виготовлення від 24–48 годин. Уточнюйте наявність через контакти.' },
                            { q: 'Чи можливі безглютенові або безцукрові варіанти?', a: 'Такі запити розглядаються індивідуально. Напишіть нам — обговоримо склад та можливості.' },
                            { q: 'Яка передоплата?', a: 'Передоплата фіксує дату виробництва. Точний відсоток уточнюється при оформленні замовлення.' },
                            { q: 'Скільки зберігається торт?', a: 'У холодильнику 2–5 днів залежно від начинки. Умови зберігання передаємо разом із замовленням.' },
                            { q: 'Чи доставляєте по всіх районах Києва?', a: 'Так — лівий і правий берег, будь-який район. Вартість доставки за тарифами таксі (Uklon/Bolt). Самовивіз — безкоштовно.' },
                            { q: 'Чи працюєте з корпоративними замовленнями?', a: 'Так, виготовляємо торти з брендуванням та корпоративним дизайном для будь-якого масштабу заходу.' },
                            { q: 'Чи можна замовити торт з логотипом компанії?', a: 'Так. Наносимо логотип, фірмові кольори та будь-яку корпоративну символіку. Детальніше — у розділі корпоративних тортів.' },
                        ].map(({ q, a }, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2 text-base">{q}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Add custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-delayed {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }

                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
                .animate-shimmer { animation: shimmer 3s infinite; background-size: 200% 100%; }
                .animate-fade-in { animation: fade-in 1s ease-out; }
                .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out 0.3s both; }
                .animate-slide-up { animation: slide-up 0.8s ease-out; }
                .animate-scale-in { animation: scale-in 0.6s ease-out; }
                .animate-scale-in-delayed { animation: scale-in 0.6s ease-out 0.2s both; }
                .animate-scale-in-more-delayed { animation: scale-in 0.6s ease-out 0.4s both; }
                .animate-fade-in-stagger { animation: fade-in 0.6s ease-out both; }
                .animate-gradient { 
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
            `}</style>

            <QuickOrderModal
                isOpen={isQuickOrderOpen}
                onClose={() => setIsQuickOrderOpen(false)}
                cake={selectedCakeForQuickOrder}
                deliveryDate={selectedCakeForQuickOrder?.deliveryDate}
                deliveryMethod={selectedCakeForQuickOrder?.deliveryMethod}
                flavor={selectedCakeForQuickOrder?.flavor}
            />
        </div >
    );
}

export default Home;
