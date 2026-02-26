import React, { useEffect, useState, useContext, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import shopConfig from '../shop.config';
import { CartContext } from '../context/CartContext';
import { FILLINGS } from '../constants/fillings';
import QuickOrderModal from './QuickOrderModal';
import SEOHead from './SEOHead';
import { categorySeoData } from '../constants/categorySeo';
import { getProductUrl, getCategoryUrl } from '../utils/urls';
import { dbCategoryToSlug, isGroupA, getCategoryCanonicalUrl } from '../constants/seoRoutes';
import { GET_CATEGORY_NAME } from '../constants/categories';
import { marked } from 'marked';
import professionalHeroBg from '../assets/mobile_hero_bg.webp';

function CakeList({ predefinedCategory, predefinedSlug, groupType }) {
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [selectedCakeForQuickOrder, setSelectedCakeForQuickOrder] = useState(null);
    const [wishlist, setWishlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
    });
    const { addToCart } = useContext(CartContext);
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const category = predefinedCategory || categoryQuery;
    const searchQuery = searchParams.get('search');

    // Retrieve SEO Data if available
    const seoData = category ? categorySeoData[category] : null;

    // ===== FILTER & SORT STATE =====
    const [sortBy, setSortBy] = useState('popular');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedWeights, setSelectedWeights] = useState([]);
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get('/products/', { params: { category } })
            .then(response => {
                setCakes(response.data);
                setLoading(false);
                // Set initial price range based on data
                if (response.data.length > 0) {
                    const prices = response.data.map(c => c.price);
                    setPriceRange([Math.min(...prices), Math.max(...prices)]);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the cakes!", error);
                setLoading(false);
            });
    }, [category]);

    // Price bounds from data
    const priceBounds = useMemo(() => {
        if (cakes.length === 0) return [0, 10000];
        const prices = cakes.map(c => c.price);
        return [Math.min(...prices), Math.max(...prices)];
    }, [cakes]);

    const handleAddToCart = (cake) => {
        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const defaultFlavor = (cake && CAKE_CATEGORIES.includes(cake.category) && FILLINGS.length > 0) ? FILLINGS[0].name : null;
        addToCart(cake, 1, defaultFlavor, null, null, 'pickup');
    };

    const toggleWishlist = (cakeId) => {
        setWishlist(prev => {
            const next = prev.includes(cakeId) ? prev.filter(id => id !== cakeId) : [...prev, cakeId];
            localStorage.setItem('wishlist', JSON.stringify(next));
            return next;
        });
    };

    const categoryLabels = {
        'bento': 'Торти бенто',
        'biscuit': 'Бісквітні торти',
        'wedding': 'Весільні торти',
        'mousse': 'Мусові торти',
        'cupcakes': 'Капкейки',
        'gingerbread': 'Імбирні пряники'
    };

    const getCategorySubtitle = () => {
        if (searchQuery) return `Результати пошуку для: "${searchQuery}"`;
        if (!category) return 'Оберіть категорію, щоб знайти ідеальний десерт';
        if (category === 'bento') return 'Маленькі бенто торти для великих емоцій';
        if (category === 'biscuit') return 'Класичні бісквітні торти з ніжними начинками';
        if (category === 'wedding') return 'Розкішні торти для вашого особливого дня';
        if (category === 'mousse') return 'Сучасні мусові десерти з вишуканим декором';
        if (category === 'cupcakes') return 'Порційні десерти, які зручно взяти з собою';
        if (category === 'gingerbread') return 'Ароматні пряники ручної роботи';
        return 'Найкраща продукція з натуральних інгредієнтів';
    };

    const getCategoryTitle = () => {
        if (searchQuery) return 'ПОШУК ТОРТІВ';
        if (seoData && seoData.h1) return seoData.h1;
        if (!category) return 'ВСЯ КОЛЕКЦІЯ';
        return categoryLabels[category]?.toUpperCase() || 'ПРОДУКЦІЯ';
    };

    // ===== FILTER + SORT LOGIC =====
    const getProcessedCakes = () => {
        let result = [...cakes];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(cake =>
                cake.name.toLowerCase().includes(query) ||
                (cake.description && cake.description.toLowerCase().includes(query)) ||
                (cake.category && cake.category.toLowerCase().includes(query))
            );
        }

        // Price filter
        result = result.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1]);

        // Weight filter
        if (selectedWeights.length > 0) {
            result = result.filter(c => {
                const w = c.weight || (c.category === 'bento' ? 450 : c.category === 'cupcakes' ? 80 : 1000);
                const wKg = w < 10 ? w : w / 1000;
                return selectedWeights.some(sw => {
                    if (sw === 'mini') return wKg <= 0.5;
                    if (sw === 'small') return wKg > 0.5 && wKg <= 1;
                    if (sw === 'medium') return wKg > 1 && wKg <= 2;
                    if (sw === 'large') return wKg > 2;
                    return true;
                });
            });
        }

        // Sort
        if (sortBy === 'cheap') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'expensive') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'new') result.sort((a, b) => b.id - a.id);
        // 'popular' = default order

        return result;
    };

    const processedCakes = getProcessedCakes();

    // Active filter count (for badge)
    const activeFilterCount = (
        (priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1] ? 1 : 0) +
        (selectedWeights.length > 0 ? 1 : 0) +
        (onlyAvailable ? 1 : 0)
    );

    const resetFilters = () => {
        setPriceRange(priceBounds);
        setSelectedWeights([]);
        setOnlyAvailable(false);
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

    const getRating = (id) => {
        const seed = ((id * 7 + 13) % 20) / 20;
        return { stars: 5, count: Math.floor(seed * 40 + 5) };
    };

    const getWeight = (cake) => {
        if (cake.weight) return cake.weight;
        if (cake.category === 'bento') return '450Г';
        if (cake.category === 'cupcakes') return '80Г';
        return '1000Г';
    };

    const toggleWeight = (w) => {
        setSelectedWeights(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);
    };

    const sortOptions = [
        { key: 'popular', label: 'Популярні' },
        { key: 'cheap', label: 'Дешевші' },
        { key: 'expensive', label: 'Дорожчі' },
        { key: 'new', label: 'Нові' },
    ];

    const weightChips = [
        { key: 'mini', label: 'до 500г', icon: '🧁' },
        { key: 'small', label: '0.5–1 кг', icon: '🎂' },
        { key: 'medium', label: '1–2 кг', icon: '🎂' },
        { key: 'large', label: '2+ кг', icon: '🎂' },
    ];

    // ─── BreadcrumbList: Group A vs Group B ───
    const categorySlugForSeo = category ? dbCategoryToSlug(category) : null;
    const isGroupACat = categorySlugForSeo && isGroupA(categorySlugForSeo);
    const categoryLabel = category ? (GET_CATEGORY_NAME(category) || getCategoryTitle()) : null;
    const categorySeoUrl = category ? getCategoryUrl(category) : null;

    const breadcrumbs = [{
        "@type": "ListItem",
        "position": 1,
        "name": "Головна",
        "item": `${shopConfig.domain}/`
    }];

    if (category) {
        if (isGroupACat) {
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 2,
                "name": "Торти на замовлення",
                "item": `${shopConfig.domain}/torty-na-zamovlennya/`
            });
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 3,
                "name": categoryLabel
            });
        } else {
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 2,
                "name": categoryLabel || "Каталог"
            });
        }
    } else {
        breadcrumbs.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Каталог"
        });
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs
    };

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": processedCakes.map((cake, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${shopConfig.domain}${getProductUrl(cake)}`
        }))
    };

    const schemaData = [breadcrumbSchema, itemListSchema];

    // Service + Product Schema for wedding category (SEO)
    if (category === 'wedding') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Весільні торти на замовлення у Києві",
            "serviceType": "Wedding Cake Custom Design",
            "areaServed": "Kyiv",
            "provider": shopConfig.name
        });
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Весільний торт на замовлення",
            "brand": shopConfig.name,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "UAH",
                "price": "650",
                "availability": "InStock"
            }
        });
    }

    // Kids FAQ data
    const kidsFaqData = [
        { q: 'Скільки коштує дитячий торт?', a: 'Вартість дитячого торта залежить від обраної начинки, ваги та складності оформлення. Базова ціна починається від 650 грн за кілограм. Декор (мастичні фігурки, пряники, фотодрук) розраховується індивідуально.' },
        { q: 'Як замовити дитячий торт у Києві?', a: 'Ви можете оформити замовлення прямо на нашому сайті через онлайн-форму, написати нам у месенджери (Viber/Telegram) або просто зателефонувати. Рекомендуємо робити замовлення за 3-5 днів до свята.' },
        { q: 'Чи робите ви доставку?', a: 'Так, ми здійснюємо безпечну адресну доставку дитячих тортів по всіх районах Києва (Оболонь, Позняки, Троєщина, Печерськ тощо). Торти доставляються в спеціальних холодильних боксах.' },
        { q: 'Які начинки безпечні для дітей?', a: 'Для малечі ми рекомендуємо легкі та натуральні смаки: ванільний бісквіт зі свіжими фруктами, йогуртовий мус або класичну "Полуничну ніжність". Всі наші десерти виготовляються без додавання штучних консервантів.' },
        { q: 'Чи можна зробити торт без мастики?', a: 'Так, абсолютно! Ми спеціалізуємось на ніжних кремових покриттях. Мастику використовуємо виключно для деяких складних фігурок чи дрібного декору за вашим бажанням.' },
        { q: 'Чи можна змінити дизайн з фото?', a: 'Звичайно! Ви можете надіслати нам будь-яке фото з Pinterest чи Instagram, і ми адаптуємо дизайн під ваші побажання, змінимо кольори або додамо улюблених героїв вашої дитини.' },
    ];

    // Boy FAQ data
    const boyFaqData = [
        { q: 'Скільки коштує дитячий торт для хлопчика?', a: 'Ціна залежить від ваги та декору. Базова вартість — від 650 грн за кг. Мінімальне замовлення зазвичай від 1.5 кг. Складні фігурки супергероїв чи машин розраховуються додатково.' },
        { q: 'Як замовити торт хлопчику в Києві?', a: 'Ви можете обрати дизайн у нашому каталозі або надіслати власне фото. Замовлення приймаємо через сайт, месенджери або телефоном. Бажано за 3-5 днів до свята.' },
        { q: 'Чи робите ви доставку по Києву?', a: 'Так, ми здійснюємо адресну доставку по всьому Києву у спеціальних термобоксах, що гарантує збереження вигляду та свіжості торта.' },
        { q: 'Які начинки ви порадите для дітей?', a: 'Для дитячих свят ми рекомендуємо натуральні та легкі начинки: "Полунична ніжність", ванільний бісквіт з йогуртовим кремом або шоколадний "Снікерс".' },
        { q: 'Чи можна зробити торт з улюбленим героєм?', a: 'Так! Ми створюємо торти з будь-якими героями мультфільмів, ігор чи коміксів за допомогою пряничних топперів, мастичних фігурок або фотодруку.' },
        { q: 'Коли краще робити замовлення?', a: 'Найкраще оформлювати замовлення за 3-7 днів до події. У святкові дні та вихідні кондитерська завантажена сильніше, тому краще бронювати дату заздалегідь.' },
    ];


    if (category === 'kids') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": kidsFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    if (category === 'boy') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": boyFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }


    // Wedding FAQ data
    const weddingFaqData = [
        { q: 'За скільки часу потрібно замовити весільний торт?', a: 'Рекомендуємо оформити замовлення за 2–4 тижні до дати весілля, щоб ми встигли продумати кожну деталь.' },
        { q: 'Чи можна замовити дегустацію?', a: 'Так, за попереднім записом доступна дегустація начинок. Зв\'яжіться з нами для узгодження.' },
        { q: 'Чи робите ви доставку до ресторану?', a: 'Так, ми доставляємо та встановлюємо багатоярусні торти безпосередньо на локації.' },
        { q: 'Чи можна змінити дизайн після узгодження?', a: 'Так, корективи можливі до початку виробництва. Узгоджуємо зміни індивідуально.' },
        { q: 'Яка передоплата?', a: 'Передоплата фіксує дату та складає 50% від вартості замовлення. Решту — при отриманні.' },
    ];

    // Birthday FAQ data
    const birthdayFaqData = [
        { q: 'За скільки днів потрібно замовити торт?', a: 'Рекомендуємо оформлювати замовлення за 3-5 днів до дати свята, щоб ми встигли підготувати дизайн та необхідні інгредієнти.' },
        { q: 'Чи можна зробити термінове замовлення?', a: 'Так, ми намагаємось йти назустріч і часто беремо термінові замовлення "на завтра". Зателефонуйте нам для уточнення можливості.' },
        { q: 'Чи робите торти без цукру або глютену?', a: 'На жаль, наразі ми не виготовляємо безглютенові або безцукрові десерти, оскільки наша рецептура базується на класичних інгредієнтах вищої якості.' },
        { q: 'Чи можливий фотодрук?', a: 'Звичайно! Ми можемо надрукувати будь-яке фото, логотип чи картинку на їстівному цукровому папері безпечними харчовими барвниками.' },
    ];

    if (category === 'birthday') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": birthdayFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Anniversary FAQ data
    const anniversaryFaqData = [
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо оформити замовлення за 5-7 днів до ювілею, щоб ми змогли підготувати дизайн потрібної складності та потрібні інгредієнти.' },
        { q: 'Чи можна змінити дизайн?', a: 'Так, кожен торт створюється за індивідуальним дизайном. Ви можете обрати будь-який декор або надіслати нам фото бажаного торта.' },
        { q: 'Чи можна зробити торт з фото?', a: 'Звичайно! Ми робимо якісний їстівний фотодрук на цукровому папері для ювілярів.' },
        { q: 'Чи доставляєте ви за місто?', a: 'Так, можлива доставка в передмістя Києва. Вартість розраховується індивідуально за тарифами таксі.' },
    ];

    if (category === 'anniversary') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": anniversaryFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // For Women FAQ data
    const forWomenFaqData = [
        { q: 'Чи можна зробити індивідуальний напис?', a: 'Так, ми безкоштовно робимо будь-який напис на торті або шоколадній табличці за вашим бажанням.' },
        { q: 'Чи використовуються живі квіти?', a: 'Так, за запитом ми декоруємо торти живими квітами (троянди, еустоми, півонії), які попередньо обробляються та ізолюються від десерту.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо оформити замовлення за 3-5 днів до свята, щоб ми встигли підготувати дизайн потрібної складності та свіжі квіти, якщо вони є в декорі.' },
    ];

    if (category === 'for-women') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": forWomenFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // For Men FAQ data
    const forMenFaqData = [
        { q: 'Чи можна зробити тематичний дизайн?', a: 'Так, ми створюємо торти з улюбленими авто, на тему спорту, з міні-пляшечками алкоголю тощо.' },
        { q: 'Чи можна додати цифру віку?', a: 'Так, ми можемо додати шоколадні цифри або зробити топпер з віком та індивідуальним написом.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Бажано оформити замовлення за 3-5 днів. Проте ми також приймаємо термінові замовлення за 1-2 дні.' },
    ];

    if (category === 'for-men') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": forMenFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Bento FAQ data
    const bentoFaqData = [
        { q: 'Скільки важить бенто торт?', a: 'Стандартна вага бенто торта становить 400-500 грамів. Цього достатньо для пригощання 1-3 осіб.' },
        { q: 'Чи можна додати будь-який напис?', a: 'Так, ми можемо зробити будь-який напис кремом або надрукувати картинку на цукровому папері.' },
        { q: 'За скільки часу потрібно замовити?', a: 'Рекомендуємо замовляти за 1-3 дні. Проте часто ми маємо можливість виготовити бенто торт швидше.' },
        { q: 'Чи доставляєте в день замовлення?', a: 'Так, за наявності вільних місць у графіку ми можемо виготовити та доставити бенто торт у день замовлення.' },
    ];

    if (category === 'bento') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": bentoFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Corporate FAQ data
    const corporateFaqData = [
        { q: 'Як замовити торт з логотипом?', a: 'Надішліть нам логотип вашої компанії у векторному форматі або у високій якості. Ми перенесемо його на торт за допомогою їстівного фотодруку на цукровому папері або створимо об\'ємний логотип з шоколаду/мастики.' },
        { q: 'Чи можна розрахуватися за безготівковим рахунком?', a: 'Так, ми працюємо з компаніями за безготівковим розрахунком. Надаємо всі необхідні документи (рахунок-фактура, акт виконаних робіт).' },
        { q: 'За скільки часу потрібно робити корпоративне замовлення?', a: 'Для невеликих замовлень (до 5 кг) достатньо 3-5 днів. Для масштабних корпоративів (торти від 10 кг або кенді-бари) рекомендуємо звертатися мінімум за 1-2 тижні, щоб ми могли забронювати час і розробити унікальний дизайн.' },
        { q: 'Чи можете ви виготовити багато порційних десертів з брендуванням?', a: 'Так, окрім великих тортів, ми виготовляємо брендовані капкейки, макарони, пряники та міні-десерти з логотипами, які чудово підходять для подарунків співробітникам або клієнтам.' },
    ];

    if (category === 'corporate') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": corporateFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Gender Reveal FAQ data
    const genderRevealFaqData = [
        { q: 'Чи можна передати стать дитини конфіденційно?', a: 'Так, звичайно! Ви можете передати нам закритий конверт від лікаря особисто у нашій кондитерській, або попросити лікаря/друга надіслати нам результати УЗД у месенджер. Ми гарантуємо повну конфіденційність до моменту розрізання торта.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів до свята. Але ми розуміємо специфіку Gender Reveal, тому якщо результати обстеження ви отримали щойно — телефонуйте, ми намагатимемося виконати термінове замовлення.' },
        { q: 'Чи можна зробити без штучних барвників?', a: 'Всередині ми найчастіше використовуємо натуральні ягідні пюре (рожевий колір) або безпечні сертифіковані харчові барвники. За вашим бажанням ми можемо повністю відмовитись від барвників і зробити кольоровим лише сюрприз-конфетті всередині або нейтральний крем з відповідними ягодами.' },
        { q: 'Чи можна додати індивідуальний напис?', a: 'Так, ми безкоштовно додаємо короткі кремові або шоколадні написи (наприклад, "Boy or Girl?", "Love", дати, тощо), або робимо таблички з цукрової мастики.' },
    ];

    if (category === 'gender-reveal') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": genderRevealFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Christening FAQ data
    const christeningFaqData = [
        { q: 'За скільки днів потрібно замовляти торт на хрестини?', a: 'Рекомендуємо замовляти за 3-5 днів до свята, щоб ми встигли розробити та виготовити детальний індивідуальний декор.' },
        { q: 'Чи можна зробити торт без барвників?', a: 'Так! Для дитячих і хрестильних тортів ми пропонуємо повністю натуральні начинки та білі або пастельні креми без додавання штучних барвників.' },
        { q: 'Чи додаєте ви ім’я дитини?', a: 'Звісно, ми безкоштовно можемо додати ім\'я дитини, дату народження чи хрещення на торті, або розмістити цю інформацію на спеціальній шоколадній табличці.' },
        { q: 'Яка мінімальна вага торта?', a: 'Мінімальна вага для тортів на хрестини з індивідуальним дизайном становить від 1 кілограма.' },
    ];

    if (category === 'christening') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": christeningFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Photo Cakes FAQ data
    const photoCakesFaqData = [
        { q: 'Чи можна надрукувати будь-яке фото?', a: 'Так, ми можемо перенести на торт будь-яке зображення: особисту фотографію, логотип компанії, картинку з мультфільму або Ваш авторський малюнок.' },
        { q: 'Яка якість зображення потрібна?', a: 'Для найкращого результату фото має бути високої якості (чітке, без розмиття). Чим краща якість оригінального файлу, тим реалістичнішим вийде друк на торті.' },
        { q: 'Чи безпечний їстівний друк?', a: 'Абсолютно! Ми використовуємо харчовий принтер та сертифіковані харчові барвники. Друк виконується на спеціальному цукровому або вафельному папері, який є на 100% їстівним та безпечним навіть для дітей.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів до свята. Але якщо торт потрібен терміново — телефонуйте, ми спробуємо вам допомогти.' },
    ];

    if (category === 'photo-cakes') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": photoCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Professional Holiday Cakes FAQ data
    const professionalCakesFaqData = [
        { q: 'Чи можна зробити торт з логотипом компанії?', a: 'Так, ми можемо перенести на торт будь-який логотип: за допомогою харчового друку на цукровому папері або ручного розпису в корпоративних кольорах.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів. Проте, якщо вам потрібен торт "на завтра", зателефонуйте нам — ми завжди намагаємося допомогти.' },
        { q: 'Чи можна додати персональне побажання?', a: 'Звісно! Ми безкоштовно додамо ваш індивідуальний вітальний напис кремом або розмістимо побажання на спеціальній шоколадній табличці.' },
        { q: 'Яка мінімальна вага?', a: 'Мінімальна вага тематичних тортів на професійні свята становить від 1 кілограма.' },
    ];

    if (category === 'professional') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": professionalCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Seasonal Cakes FAQ data
    const seasonalCakesFaqData = [
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів до свята, оскільки в період популярних свят (Новий Рік, 8 березня, Великдень) кількість місць може бути обмеженою.' },
        { q: 'Чи можна змінити дизайн?', a: 'Так, ми можемо адаптувати дизайн під ваші побажання: змінити кольорову гаму, додати індивідуальні написи або декоративні елементи.' },
        { q: 'Чи можна зробити без барвників?', a: 'Звісно. Ми використовуємо лише якісні харчові барвники, але якщо ви бажаєте, можемо виготовити торт у натуральних відтінках, використовуючи шоколад чи ягоди.' },
        { q: 'Яка мінімальна вага?', a: 'Мінімальна вага сезонних тортів на замовлення становить від 1 кілограма.' },
    ];

    if (category === 'seasonal') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": seasonalCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Hobby Cakes FAQ data
    const hobbyCakesFaqData = [
        { q: 'Чи можна створити дизайн за моїм ескізом?', a: 'Звісно! Ми спеціалізуємося на індивідуальних замовленнях. Ви можете надіслати нам свій ескіз, фото з інтернету або просто описати ідею, і ми втілимо її в життя.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів. Для складних 3D-конструкцій краще звертатися за тиждень, щоб ми встигли підготувати всі деталі декору.' },
        { q: 'Чи можна додати фото?', a: 'Так, ми використовуємо якісний харчовий друк на цукровому папері. Ви можете додати особисте фото, логотип команди або будь-яке інше зображення.' },
        { q: 'Яка мінімальна вага?', a: 'Мінімальна вага тематичних тортів за хобі становить від 1 кілограма. Для складних 3D-форм мінімальна вага може бути більшою (від 2-2.5 кг).' },
    ];

    if (category === 'hobby') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": hobbyCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Mousse Cakes FAQ data
    const mousseCakesFaqData = [
        { q: 'Чи можна зробити мусовий торт без глютену?', a: 'Так, ми можемо виготовити мусовий торт з безглютеновим бісквітом та начинкою за вашим запитом.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Мусові торти потребують часу на стабілізацію та заморожування, тому рекомендуємо замовляти за 3-4 дні.' },
        { q: 'Яка мінімальна вага?', a: 'Мінімальна вага мусового торта становить від 1 кілограма.' },
        { q: 'Чи можна змінити форму?', a: 'Звісно. Ми маємо широкий вибір форм: від класичних кіл та квадратів до сердець та сучасних геометричних фігур.' },
    ];

    if (category === 'mousse') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": mousseCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Biscuit Cakes FAQ data
    const biscuitCakesFaqData = [
        { q: 'Яка мінімальна вага?', a: 'Мінімальна вага бісквітного торта становить від 1 кілограма.' },
        { q: 'Чи можна змінити начинку?', a: 'Так, ви можете обрати будь-яку начинку з нашого каталогу або запропонувати свої побажання.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів до події.' },
        { q: 'Чи можна додати напис?', a: 'Звісно. Ми можемо додати будь-який напис кремом, шоколадом або на їстівній основі.' },
    ];

    if (category === 'biscuit') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": biscuitCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Cupcakes FAQ data
    const cupcakesFaqData = [
        { q: 'Яка мінімальна кількість?', a: 'Мінімальна кількість для замовлення — від 6 штук.' },
        { q: 'Чи можна зробити різні дизайни в одному замовленні?', a: 'Так, ми можемо оформити кожний капкейк індивідуально в межах тематики вашого свята.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 2-3 дні.' },
        { q: 'Чи можна замовити разом з тортом?', a: 'Звісно. Ми часто створюємо кенді-бари, де капкейки та торт виконані в єдиному стилі.' },
    ];

    if (category === 'cupcakes') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": cupcakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Girl's Cakes FAQ data
    const girlCakesFaqData = [
        { q: 'Чи можна зробити торт за моїм прикладом?', a: 'Так, ми можемо виготовити торт за вашим фото або ескізом, адаптувавши його під ваші побажання.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів до події. У випадку термінових замовлень, будь ласка, уточнюйте наявність вільних місць.' },
        { q: 'Чи можна додати фото?', a: 'Звісно. Ми виконуємо якісний їстівний фотодрук на цукровому папері, що дозволяє перенести будь-яке зображення на торт.' },
        { q: 'Яка мінімальна вага?', a: 'Мінімальна вага торта для дівчини становить від 1 кілограма.' },
    ];

    if (category === 'girl') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": girlCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Patriotic Cakes FAQ data
    const patrioticCakesFaqData = [
        { q: 'Чи можна зробити торт з конкретною символікою?', a: 'Так, ми можемо додати на торт герб, прапор або будь-яку іншу національну символіку, використовуючи мастику, шоколад або їстівний фотодрук.' },
        { q: 'За скільки днів потрібно замовляти?', a: 'Рекомендуємо робити замовлення за 3-5 днів до події. У випадку термінових замовлень, будь ласка, уточнюйте наявність вільних місць по телефону.' },
        { q: 'Чи можна додати напис?', a: 'Звісно. Ми можемо нанести будь-який патріотичний напис або персональне побажання на поверхню торта чи підкладку.' },
        { q: 'Яка мінімальна вага?', a: 'Мінімальна вага патріотичних тортів становить від 1 кілограма.' },
    ];

    if (category === 'patriotic') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": patrioticCakesFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    // Gingerbread FAQ data
    const gingerbreadFaqData = [
        { q: 'За скільки днів потрібно замовляти пряники?', a: 'Рекомендуємо робити замовлення за 5-7 днів. Для великих корпоративних партій — за 10-14 днів.' },
        { q: 'Чи можна замовити брендований дизайн?', a: 'Так, ми виконуємо пряники з логотипами компаній будь-якої складності за допомогою харчового друку або ручного розпису.' },
        { q: 'Чи можна зробити подарункову упаковку?', a: 'Звісно. Кожен пряник може бути упакований в індивідуальний пакетик, або ми можемо зібрати набір у святкову коробку зі стрічкою.' },
        { q: 'Чи можливе термінове виготовлення?', a: 'Це залежить від складності декору та завантаженості виробництва. Будь ласка, зателефонуйте нам для уточнення.' },
    ];

    if (category === 'gingerbread') {
        schemaData.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": gingerbreadFaqData.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        });
    }

    const [openFaq, setOpenFaq] = useState(null);

    const canonicalUrl = categorySeoUrl || (category ? `/cakes?category=${category}` : '/cakes/');

    const metaTitle = seoData ? seoData.title : `${getCategoryTitle()} | Купити торти в Києві – Antreme`;
    const metaDesc = seoData ? seoData.description : `Шукаєте ${getCategoryTitle().toLowerCase()}? В кондитерській Antreme величезний вибір свіжих десертів з натуральних інгредієнтів. Адресна доставка по Києву.`;

    return (
        <div className="min-h-screen bg-white">
            <SEOHead
                title={metaTitle}
                description={metaDesc}
                canonical={canonicalUrl}
                ogImage={seoData?.ogImage}
                schema={schemaData}
            />
            {/* Page Header */}
            <div className="bg-white pt-6 md:pt-12 pb-4 md:pb-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-6xl font-black text-gray-900 uppercase tracking-tight mb-2 md:mb-4"
                        style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        {getCategoryTitle()}
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="h-[1px] w-8 md:w-12 bg-gray-200" />
                        <p className="text-gray-500 text-xs md:text-base font-medium italic"
                            style={{ fontFamily: "'Dancing Script', cursive" }}>
                            {getCategorySubtitle()}
                        </p>
                        <div className="h-[1px] w-8 md:w-12 bg-gray-200" />
                    </div>
                </div>
            </div>

            {/* ===== SORT CHIPS + FILTER BUTTON ===== */}
            <div className="max-w-7xl mx-auto px-2 md:px-6 mb-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:justify-center">
                    {/* Sort chips */}
                    {sortOptions.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setSortBy(opt.key)}
                            className={`shrink-0 h-9 md:h-10 px-4 md:px-5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all active:scale-95 border-2 ${sortBy === opt.key
                                ? 'bg-[#7A0019] border-[#7A0019] text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-200 shrink-0 mx-1" />

                    {/* Filter button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="shrink-0 h-9 md:h-10 px-4 md:px-5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all active:scale-95 border-2 border-gray-200 text-gray-600 hover:border-[#E8C064] hover:text-[#7A0019] bg-white flex items-center gap-2 relative"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Фільтр
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E8C064] text-[#4a1c28] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>


            </div>

            {/* ===== PRODUCT GRID ===== */}
            <div className="max-w-7xl mx-auto px-2 md:px-6 pb-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-14 h-14 border-4 border-[#E8C064]/30 border-t-[#E8C064] rounded-full animate-spin mb-5" />
                        <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">Завантаження...</div>
                    </div>
                ) : processedCakes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-5 opacity-30">🔍</div>
                        <p className="text-gray-500 text-base font-medium mb-2">Нічого не знайдено</p>
                        <p className="text-gray-500 text-sm mb-6">Спробуйте змінити параметри фільтра</p>
                        <button
                            onClick={resetFilters}
                            className="inline-block text-[#7A0019] font-bold uppercase tracking-widest text-xs border-b-2 border-[#7A0019] pb-1 hover:text-[#9C142B] transition-all"
                        >
                            Скинути фільтри
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
                        {processedCakes.map((cake, index) => {
                            const rating = getRating(cake.id);
                            const weight = getWeight(cake);
                            const isWished = wishlist.includes(cake.id);

                            return (
                                <div key={cake.id}
                                    className="group bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full overflow-hidden relative"
                                >
                                    <div className="p-3 md:p-4 flex flex-col h-full">

                                        {/* Title at top */}
                                        <Link to={getProductUrl(cake)}>
                                            <h3 className="text-[11px] md:text-[14px] font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] text-center mb-1 group-hover:text-[#7A0019] transition-colors"
                                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                                {cake.name}
                                            </h3>
                                        </Link>

                                        {/* Image + Wishlist */}
                                        <div className="relative w-full aspect-square mb-2">
                                            <button
                                                onClick={(e) => { e.preventDefault(); toggleWishlist(cake.id); }}
                                                className="absolute top-0 right-0 z-20 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all"
                                                title="Додати в обране"
                                            >
                                                <svg className="w-5 h-5 md:w-6 md:h-6 transition-colors" viewBox="0 0 24 24"
                                                    fill={isWished ? '#E8C064' : 'none'}
                                                    stroke={isWished ? '#E8C064' : '#ccc'}
                                                    strokeWidth="2">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                            </button>

                                            {index < 2 && (
                                                <div className="absolute top-0 left-0 z-20 bg-[#E8C064] text-[#4a1c28] text-[8px] md:text-[10px] font-black uppercase px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm tracking-wider">
                                                    ХІТ
                                                </div>
                                            )}

                                            <Link to={getProductUrl(cake)} className="block w-full h-full flex items-center justify-center p-1">
                                                {cake.image_url && (
                                                    <img
                                                        src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                                        alt={category === 'wedding'
                                                            ? `Весільний торт у Києві – ${cake.name}`
                                                            : category === 'kids'
                                                                ? `Дитячий торт ${cake.name} — замовити в Києві`
                                                                : category === 'boy'
                                                                    ? `Торт для хлопчика на замовлення в Києві — ${cake.name}`
                                                                    : category === 'corporate'
                                                                        ? `Корпоративний торт з логотипом компанії — Antreme Київ`
                                                                        : category === 'gender-reveal'
                                                                            ? 'Торт Gender Reveal з сюрпризом — Antreme Київ'
                                                                            : category === 'christening'
                                                                                ? 'Торт на хрестини для дитини — Antreme Київ'
                                                                                : category === 'photo-cakes'
                                                                                    ? 'Фото-торт з їстівним фотодруком — Antreme Київ'
                                                                                    : category === 'professional'
                                                                                        ? 'Торт на професійне свято — Antreme Київ'
                                                                                        : category === 'seasonal'
                                                                                            ? 'Сезонний торт на замовлення — Antreme Київ'
                                                                                            : category === 'hobby'
                                                                                                ? 'Торт за хобі на замовлення — Antreme Київ'
                                                                                                : category === 'biscuit'
                                                                                                    ? 'Бісквітний торт на замовлення — Antreme Київ'
                                                                                                    : category === 'gingerbread'
                                                                                                        ? 'Імбирні пряники на замовлення — Antreme Київ'
                                                                                                        : category === 'cupcakes'
                                                                                                            ? 'Капкейки на замовлення — Antreme Київ'
                                                                                                            : category === 'mousse'
                                                                                                                ? 'Мусовий торт на замовлення — Antreme Київ'
                                                                                                                : `${cake.name} – замовити в Києві`
                                                        }
                                                        className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                )}
                                            </Link>
                                        </div>

                                        {/* Stars rating */}
                                        <div className="flex items-center justify-center gap-1 mb-1.5">
                                            <div className="flex items-center gap-px">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <svg key={s} className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#9C751E]" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[10px] md:text-xs text-gray-500 font-medium ml-0.5">{rating.count}</span>
                                        </div>

                                        {/* Weight + Availability */}
                                        <div className="flex flex-col items-center gap-0.5 mb-2 md:mb-3">
                                            <span className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide">{weight}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                                <span className="text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-wider">Можливе замовлення</span>
                                            </div>
                                        </div>

                                        {/* Price + Buttons */}
                                        <div className="mt-auto flex items-center justify-between gap-1.5">
                                            <div className="flex items-baseline gap-1 min-w-0 shrink-0">
                                                <span className="text-[18px] md:text-[22px] font-black text-gray-900 leading-none"
                                                    style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                                    {cake.price}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-gray-500 font-bold">₴</span>
                                            </div>

                                            <div className="flex items-center gap-1 md:gap-1.5">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleQuickOrder(cake); }}
                                                    className="h-8 md:h-10 px-2.5 md:px-4 border-2 border-[#E8C064] text-[#7A0019] rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-wider hover:bg-[#FFF8E7] active:scale-95 transition-all whitespace-nowrap"
                                                >
                                                    1 клік
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleAddToCart(cake); }}
                                                    className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 bg-[#E8C064] hover:bg-[#D4A83C] text-[#5A0014] rounded-lg md:rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                                                    aria-label="Додати в кошик"
                                                >
                                                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="9" cy="21" r="1" />
                                                        <circle cx="20" cy="21" r="1" />
                                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ===== CATEGORY SEO TEXT ===== */}
            {category === 'corporate' ? (
                <>
                    {/* ── БЛОК 2: Про корпоративні торти (Основний блок) ── */}
                    <section className="category-intro mt-8 mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торт для компанії, який підкреслює бренд
                        </h2>
                        <p className="intro-text">
                            Корпоративний торт — це не просто десерт, а інструмент для підкреслення статусу компанії, святкування успіхів та формування лояльності команди. Кондитерська Antreme пропонує замовити <strong>корпоративні торти з логотипом у Києві</strong> будь-якого масштабу та складності.
                        </p>
                        <p className="intro-text">
                            Ми співпрацюємо з провідними компаніями України понад 20 років, створюючи десерти, які ідеально відповідають брендбуку. Від класичних тортів з фотодруком до багатоярусних конструкцій та об'ємних 3D-логотипів.
                        </p>
                    </section>

                    {/* ── БЛОК 2.5: Для яких подій ── */}
                    <section className="bg-white py-10 md:py-14">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Для яких корпоративних подій ми створюємо торти?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <Link to="/torty-na-zamovlennya/na-yuviley/" className="bg-[#FDFBF7] p-5 rounded-xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="text-3xl">🏢</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">День народження компанії</h3>
                                        <p className="text-sm text-gray-600">Масштабні торти для святкування річниці або ювілею заснування.</p>
                                    </div>
                                </Link>
                                <Link to="/torty-na-zamovlennya/profesiine-svyato/" className="bg-[#FDFBF7] p-5 rounded-xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="text-3xl">👨‍💻</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Професійні свята</h3>
                                        <p className="text-sm text-gray-600">День ІТ-спеціаліста, медика, бухгалтера та інші галузеві свята.</p>
                                    </div>
                                </Link>
                                <div className="bg-[#FDFBF7] p-5 rounded-xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="text-3xl">🚀</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Запуск нового продукту</h3>
                                        <p className="text-sm text-gray-600">Десерти у формі вашого продукту або з його зображенням.</p>
                                    </div>
                                </div>
                                <div className="bg-[#FDFBF7] p-5 rounded-xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="text-3xl">🏆</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Корпоративи та вечірки</h3>
                                        <p className="text-sm text-gray-600">Новорічні та літні корпоративи, святкування досягнення цілей (KPI).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: Переваги (карточки) ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { title: '20 років досвіду', desc: 'Експертиза підтверджена часом', icon: '👑' },
                                    { title: '6000+ виконаних замовлень', desc: 'Довіряють B2B сектор', icon: '🤝' },
                                    { title: 'Брендинг', desc: 'Точне відтворення логотипу та кольорів', icon: '🎨' },
                                    { title: 'Доставка по Києву', desc: 'Безпечне перевезення в офіс чи ресторан', icon: '🚕' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                        <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: Скільки коштує корпоративний торт ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col items-start md:items-center text-left md:text-center">
                                <div className="flex items-center gap-3 mb-4 mx-auto justify-center w-full">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">💼</div>
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight text-left md:text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Вартість корпоративних замовлень
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm md:text-base text-center w-full max-w-lg mx-auto">
                                    Ми працюємо як з невеликими командами, так і з великими корпораціями. Надаємо повний пакет документів для безготівкового розрахунку.
                                </p>
                                <ul className="space-y-3 mb-6 w-full max-w-sm mx-auto text-left">
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Базова вартість — від 750 грн за кг
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Створення логотипу — розраховується індивідуально
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Можливість брендування капкейків, макаронів та пряників
                                    </li>
                                </ul>
                                <div className="w-full text-center">
                                    <a href="tel:0979081504" className="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#5A0014] shadow-[#E8C064]/30 shadow-lg mx-auto">
                                        Отримати комерційну пропозицію
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: Начинки та формати ── */}
                    <section className="py-10 md:py-14 bg-white">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки та формати
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Обирайте серед розмаїття смаків: від класичних <Link to="/biskvitni-torty/" className="text-[#7A0019] hover:underline font-bold">бісквітних тортів</Link> до вишуканих європейських <Link to="/musovi-torty/" className="text-[#7A0019] hover:underline font-bold">мусових десертів</Link>.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
                                {[
                                    'Шоколадний трюфель',
                                    'Карамель-горіх (Снікерс)',
                                    'Фісташка-франбуаз',
                                    'Екзотик (Манго-Маракуя)',
                                    'Класичний Наполеон / Медовик'
                                ].map((filling, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span>
                                        <span className="font-bold text-gray-800">{filling}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/nachynky/" className="inline-block px-10 py-3.5 font-black text-xs uppercase tracking-widest rounded-full transition-all hover:scale-105 border-2 border-[#7A0019] text-[#7A0019] hover:bg-[#7A0019] hover:text-white">
                                Всі 15+ начинок
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 6: Доставка ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка в офіси та на локації у Києві
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto md:text-lg">
                                Ми доставляємо замовлення у всі райони Києва: Печерськ, Поділ, Центр, Оболонь, Позняки, Дарниця та інші. Доставка здійснюється з контролем температури.
                            </p>
                            <p className="text-gray-500 font-medium italic mb-10 max-w-3xl mx-auto bg-[#FDFBF7] p-4 rounded-xl border border-[#E8C064]/20">
                                За необхідності виконуємо професійний монтаж багатоярусних конструкцій або оформлення кенді-бару безпосередньо на локації вашого заходу. Детальніше про <Link to="/dostavka/" className="text-[#7A0019] hover:underline font-bold">умови доставки</Link>.
                            </p>
                        </div>
                    </section>

                    {/* ── Call to Action Banner (Before FAQ) ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Обговоріть корпоративне замовлення з нами
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <a href="tel:0979081504" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Отримати розрахунок
                                </a>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── FAQ Section (Corporate) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання (B2B)
                            </h2>
                            <div className="space-y-3">
                                {corporateFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'wedding' ? (
                <>
                    {/* ── БЛОК 2: Про весільні торти (Основний блок) ── */}
                    <section className="category-intro mt-8 mx-auto px-4">
                        <h2>
                            Весільний торт у Києві — авторський дизайн для вашого особливого дня
                        </h2>

                        <p className="intro-text">
                            Весільний торт — це фінальний акцент святкового вечора та важлива частина атмосфери вашого весілля. У кондитерській Antreme ми створюємо весільні торти на замовлення в Києві з урахуванням стилю події, кількості гостей та ваших побажань до смаку й декору.
                        </p>

                        <p className="intro-text">
                            Ми працюємо понад 20 років та виконали більше 6000 замовлень у Києві. Кожен весільний торт виготовляється індивідуально — без шаблонів і масового виробництва. Ви отримуєте унікальний десерт, який повністю відповідає концепції вашого весілля.
                        </p>

                        <p className="intro-text">
                            Якщо ви шукаєте, де замовити весільний торт у Києві з доставкою та гарантією якості — Antreme працює саме в цьому сегменті.
                        </p>
                    </section>

                    {/* ── БЛОК 3: Переваги (карточки) ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { title: '20 років досвіду', desc: 'Експертиза підтверджена часом', icon: '👑' },
                                    { title: '6000+ виконаних замовлень', desc: 'Довіряють найважливіші події', icon: '❤️' },
                                    { title: 'Індивідуальний дизайн', desc: 'Будь-які ідеї та оформлення', icon: '🎨' },
                                    { title: 'Доставка по Києву', desc: 'Бережне перевезення до ресторану', icon: '🚕' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                        <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: Скільки коштує весільний торт ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col items-start md:items-center text-left md:text-center">
                                <div className="flex items-center gap-3 mb-4 mx-auto justify-center w-full">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">💰</div>
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight text-left md:text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Скільки коштує весільний торт у Києві
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm md:text-base text-center w-full max-w-lg mx-auto">
                                    Вартість весільного торта залежить від ваги, кількості ярусів, складності декору та обраної начинки.
                                </p>
                                <ul className="space-y-3 mb-6 w-full max-w-sm mx-auto text-left">
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Мінімальна вага весільного торта — від 1 кг
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Середня вага для весілля на 50 гостей — 5–6 кг
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Вартість — від 650 грн за кг
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Фінальна ціна розраховується після погодження дизайну
                                    </li>
                                </ul>
                                <p className="text-[#7A0019] font-bold italic mb-8 text-center text-sm w-full">
                                    Ми одразу озвучуємо точну вартість без прихованих доплат.
                                </p>
                                <div className="w-full text-center">
                                    <a href="tel:0979081504" className="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#5A0014] shadow-[#E8C064]/30 shadow-lg mx-auto">
                                        Розрахувати вартість
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: Популярні стилі ── */}
                    <section className="bg-[#FAFAFA] py-10 md:py-14">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні стилі весільних тортів
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Серед найпопулярніших варіантів у Києві:
                            </p>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
                                {[
                                    { icon: '🏛️', label: 'Класичні багатоярусні торти' },
                                    { icon: '🤍', label: 'Мінімалістичні білі торти' },
                                    { icon: '🌸', label: 'Весільні торти з живими квітами' },
                                    { icon: '🌾', label: 'Rustic та boho стиль' },
                                    { icon: '📐', label: 'Сучасні дизайнерські композиції' },
                                ].map((style, i) => (
                                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                                        <div className="text-2xl md:text-3xl mb-3">{style.icon}</div>
                                        <div className="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">{style.label}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-500 text-sm italic">
                                Переглянути весільні торти фото можна в каталозі або в Instagram Antreme.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 6: Начинки ── */}
                    <section className="py-10 md:py-14 bg-white">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для весільного торта
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Ми пропонуємо понад 10 авторських смаків. Найпопулярніші начинки:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
                                {[
                                    'Фісташка-малина',
                                    'Лісова ягода',
                                    'Лимонний чизкейк',
                                    'Карамель-банан',
                                    'Шоколадний трюфель'
                                ].map((filling, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span>
                                        <span className="font-bold text-gray-800">{filling}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-500 font-medium italic mb-8">
                                За потреби проводимо дегустацію.
                            </p>
                            <Link to="/nachynky/" className="inline-block px-10 py-3.5 font-black text-xs uppercase tracking-widest rounded-full transition-all hover:scale-105 border-2 border-[#7A0019] text-[#7A0019] hover:bg-[#7A0019] hover:text-white">
                                Усі начинки
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: Доставка ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка весільних тортів у Києві
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto md:text-lg">
                                Ми доставляємо весільні торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Солом'янський, Дарницький, Оболонський, Подільський та інші.
                            </p>
                            <p className="text-gray-500 font-medium italic mb-10 max-w-3xl mx-auto bg-[#FDFBF7] p-4 rounded-xl border border-[#E8C064]/20">
                                Доставка здійснюється з контролем температури. За необхідності виконуємо монтаж багатоярусних конструкцій безпосередньо на локації.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 8: Як замовити весільний торт ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-4xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Як замовити весільний торт
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { step: '1', text: 'Залиште заявку через сайт або зателефонуйте' },
                                    { step: '2', text: 'Узгодимо дизайн, вагу та начинку' },
                                    { step: '3', text: 'Зафіксуємо дату передоплатою' },
                                    { step: '4', text: 'Доставимо торт у зручний для вас час' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                                        <div className="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">
                                            {item.step}
                                        </div>
                                        {i < 3 && <div className="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>}
                                        <p className="font-bold text-gray-800 text-sm">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Call to Action Banner (Before FAQ) ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Обговоріть деталі замовлення зараз
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/vesilni/" onClick={resetFilters} className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Подивитися каталог
                                </Link>
                            </div>
                        </div>
                        {/* Decorative background elements inside CTA */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── FAQ Section (5 questions) ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {weddingFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Category Linking Cards ── */}
                    <section className="bg-[#FAFAFA] py-10 md:py-14">
                        <div className="max-w-5xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Інші категорії тортів
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { icon: '👶', title: 'Дитячі торти', desc: 'Казкові дизайни для свята', to: '/torty-na-zamovlennya/dytyachi/' },
                                    { icon: '🍱', title: 'Бенто торти', desc: 'Мініатюрні торти для подарунку', to: '/bento-torty/' },
                                    { icon: '🍫', title: 'Мусові торти', desc: 'Французька витонченість', to: '/musovi-torty/' },
                                ].map((cat, i) => (
                                    <Link key={i} to={cat.to}
                                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all group text-center">
                                        <div className="text-4xl mb-3">{cat.icon}</div>
                                        <h3 className="font-black text-gray-900 uppercase text-sm tracking-wide mb-1 group-hover:text-[#7A0019] transition-colors" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                            {cat.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">{cat.desc}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Bottom Internal Links ── */}
                    <nav className="max-w-4xl mx-auto px-4 md:px-8 pb-12" aria-label="Корисні посилання">
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Link to="/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Головна</Link>
                                <Link to="/nachynky/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Начинки</Link>
                                <Link to="/dostavka/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Доставка та оплата</Link>
                                <Link to="/vidguky/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Відгуки</Link>
                            </div>
                        </div>
                    </nav>
                </>
            ) : category === 'kids' ? (
                <>
                    {/* ── БЛОК 2: SEO Інтро ── */}
                    <section className="category-intro mt-12 mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Дитячі торти на день народження в Києві
                        </h2>
                        <p className="intro-text">
                            Шукаєте ідеальний <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="text-[#7A0019] hover:underline font-bold">дитячий торт на день народження у Києві</Link>? Вибір десерту для малечі — це завжди відповідальна задача для батьків. В кондитерській <strong>Antreme</strong> ви можете <strong>замовити дитячий торт з доставкою</strong>, який не лише викличе щирий захват своїм зовнішнім виглядом, але й буде абсолютно безпечним.
                        </p>
                        <p className="intro-text">
                            Незалежно від того, потрібен вам <Link to="/torty-na-zamovlennya/dlya-hlopchykiv/" className="text-[#7A0019] hover:underline font-bold">торт для хлопчика</Link> з супергероями чи ніжний <Link to="/torty-na-zamovlennya/dlya-divchat/" className="text-[#7A0019] hover:underline font-bold">торт для дівчинки</Link> з принцесами — ми знаємо, як втілити солодку мрію в реальність. Від першого рочку до підліткового віку — у нас є безліч ідей для кожного етапу!
                        </p>
                    </section>

                    {/* ── БЛОК 3: Переваги (карточки) ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🌿</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>100% натурально</h3>
                                    <p className="text-gray-500 text-sm">Тільки вершкове масло та вершки</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🎨</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Безпечні фарби</h3>
                                    <p className="text-gray-500 text-sm">Сертифіковані харчові барвники</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">✨</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Казкові дизайни</h3>
                                    <p className="text-gray-500 text-sm">Будь-які герої та оформлення</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🚕</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Бережна доставка</h3>
                                    <p className="text-gray-500 text-sm">Безпечне перевезення по Києву</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: Скільки коштує ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col items-start md:items-center text-left md:text-center">
                                <div className="flex items-center gap-3 mb-4 mx-auto justify-center w-full">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">💰</div>
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight text-left md:text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Скільки коштує дитячий торт у Києві
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm md:text-base text-center w-full max-w-lg mx-auto">
                                    Вартість дитячого торта залежить від обраної начинки, ваги та складності оформлення.
                                </p>
                                <ul className="space-y-3 mb-6 w-full max-w-sm mx-auto text-left">
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Мінімальна вага дитячого торта — від 1.5 кг
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Вартість — від 650 грн за кг
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Декор (фігурки, пряники, фотодрук) розраховується індивідуально
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        Можливість сховати "сюрприз" всередині торта
                                    </li>
                                </ul>
                                <p className="text-[#7A0019] font-bold italic mb-8 text-center text-sm w-full">
                                    Ми одразу озвучуємо точну вартість без прихованих доплат.
                                </p>
                                <div className="w-full text-center">
                                    <a href="tel:0979081504" className="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-[#E8C064]/30 shadow-lg mx-auto">
                                        Розрахувати вартість
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: Популярні стилі ── */}
                    <section className="bg-[#FAFAFA] py-10 md:py-14">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні дизайни дитячих тортів
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Ми втілюємо будь-які фантазії малечі у солодкій реальності:
                            </p>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                                    <div className="text-2xl md:text-3xl mb-3">🧸</div>
                                    <div className="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Для найменших (на 1 рочок)</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                                    <div className="text-2xl md:text-3xl mb-3">🦸‍♂️</div>
                                    <div className="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Герої Marvel та машинки</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                                    <div className="text-2xl md:text-3xl mb-3">👸</div>
                                    <div className="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug">Принцеси Діснея та єдинороги</div>
                                </div>
                                <Link to="/torty-na-zamovlennya/foto-torty/" className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group">
                                    <div className="text-2xl md:text-3xl mb-3">🖼️</div>
                                    <div className="text-[11px] md:text-xs font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors">Їстівний фотодрук</div>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: Начинки ── */}
                    <section className="py-10 md:py-14 bg-white">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Безпечні начинки для дітей
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Для малечі ми рекомендуємо легкі та абсолютно безпечні смаки:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
                                {[
                                    'Ванільна ніжність з полуницею',
                                    'Легкий йогуртовий мус',
                                    'Карамель-банан (без штучних добавок)',
                                    'Домашній шоколадний "Снікерс"'
                                ].map((filling, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-[#E8C064] flex-shrink-0 ml-1"></span>
                                        <span className="font-bold text-gray-800">{filling}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-500 font-medium italic mb-8">
                                За потреби обговорюємо список алергенів.
                            </p>
                            <Link to="/nachynky/" className="inline-block px-10 py-3.5 font-black text-xs uppercase tracking-widest rounded-full transition-all hover:scale-105 border-2 border-[#7A0019] text-[#7A0019] hover:bg-[#7A0019] hover:text-white">
                                Усі начинки
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: Доставка ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка дитячих тортів у Києві
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto md:text-lg">
                                Ми здійснюємо доставку на <strong>лівий та правий берег</strong> Києва: Оболонь, Троєщина, Печерськ, Позняки, Голосіїво та інші райони. Можлива точна <strong>доставка у день свята</strong> прямо до дверей чи в ресторан.
                            </p>
                            <p className="text-gray-500 font-medium italic mb-10 max-w-3xl mx-auto bg-[#FDFBF7] p-4 rounded-xl border border-[#E8C064]/20">
                                Для 100% збереження якості ми використовуємо <strong>термобокс</strong>. Гарантуємо <strong>обережне транспортування фігурок</strong> та тендітного декору!
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 8: Як замовити ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-4xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Як замовити дитячий торт
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { step: '1', text: 'Оберіть дизайн та бажану начинку' },
                                    { step: '2', text: 'Залиште заявку (бажано за 3-5 днів)' },
                                    { step: '3', text: 'Зафіксуйте дату передоплатою' },
                                    { step: '4', text: 'Отримайте торт із доставкою на свято' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center">
                                        <div className="w-10 h-10 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-xl mb-4 shadow-sm z-10">
                                            {item.step}
                                        </div>
                                        {i < 3 && <div className="hidden lg:block absolute top-[2.3rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>}
                                        <p className="font-bold text-gray-800 text-sm">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Call to Action Banner (Before FAQ) ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Обговоріть деталі свята з кондитером
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/nachynky/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Подивитися начинки
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── FAQ Section (Kids) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання (FAQ)
                            </h2>
                            <div className="space-y-3">
                                {kidsFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'boy' ? (
                <>
                    {/* ── БЛОК 2: SEO Інтро (Boy) ── */}
                    <section className="category-intro mt-12 mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Дизайни тортів для хлопчиків: від супергероїв до машинок
                        </h2>
                        <p className="intro-text">
                            Плануєте незабутній день народження для сина? У кондитерській <strong>Antreme</strong> ми знаємо, як створити <Link to="/torty-na-zamovlennya/dlya-hlopchykiv/" className="text-[#7A0019] hover:underline font-bold">ідеальний торт для хлопчика</Link>, який стане головним героєм свята. Від улюблених персонажів мультфільмів до крутих автомобілів — ми втілимо будь-яку мрію вашого маленького захисника.
                        </p>
                        <p className="intro-text">
                            Ми працюємо тільки з <strong>натуральними інгредієнтами</strong> і створюємо декор вручну. Такий десерт не лише вразить дизайном, а й порадує чистотою складу, що особливо важливо для дитячого харчування. Вибирайте стильні <Link to="/torty-na-zamovlennya/dytyachi/" className="text-[#7A0019] hover:underline">дитячі торти</Link> з нашої колекції або замовляйте індивідуальний проєкт!
                        </p>
                    </section>

                    {/* ── БЛОК 3: Популярні теми ── */}
                    <section className="bg-[#FDFBF7] py-10 md:py-14 border-t border-b border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Модні теми для хлоп'ячого свята
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { icon: '🏎️', title: 'Машинки та Hot Wheels', desc: 'Для любителів швидкості' },
                                    { icon: '🦸', title: 'Супергерої Marvel', desc: 'Людина-павук та Месники' },
                                    { icon: '🎮', title: 'Brawl Stars & Roblox', desc: 'Хіти для геймерів' },
                                    { icon: '🚀', title: 'Космос та планети', desc: 'Для юних дослідників' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-4xl mb-3">{item.icon}</div>
                                        <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: Вартість ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-[#7A0019] text-white rounded-3xl p-8 relative overflow-hidden">
                                <h2 className="text-2xl md:text-3xl font-black mb-4 relative z-10" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Вартість торта для хлопчика
                                </h2>
                                <p className="mb-6 opacity-90 relative z-10">
                                    Ми пропонуємо прозору систему розрахунку ціни, яка фіксується при замовленні.
                                </p>
                                <div className="space-y-4 mb-8 relative z-10">
                                    <div className="flex justify-between border-b border-white/20 pb-2">
                                        <span className="font-medium">Базова вартість</span>
                                        <span className="font-black text-[#9C751E]">від 650 грн/кг</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/20 pb-2">
                                        <span className="font-medium">Декор (фігурки, топпери)</span>
                                        <span className="font-black text-[#9C751E]">індивідуально</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/20 pb-2">
                                        <span className="font-medium">Мінімальна вага</span>
                                        <span className="font-black text-[#9C751E]">від 1.5 кг</span>
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <a href="tel:0979081504" className="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] text-[#4a1c28] shadow-lg">
                                        Дізнатися точну ціну
                                    </a>
                                </div>
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: Начинки та сестрички ── */}
                    <section className="py-10 md:py-14 bg-white">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Найсмачніші начинки
                            </h2>
                            <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Ми рекомендуємо обирати перевірені часом смаки, які обожнюють діти: шоколадний "Снікерс", ванільну полуницю або легкі йогуртові муси. Повний список доступний у розділі <Link to="/nachynky/" className="text-[#7A0019] font-bold border-b border-[#7A0019]/30">начинки для тортів</Link>.
                            </p>
                            <div className="bg-[#FAFAFA] rounded-2xl p-6 md:p-8 border border-gray-100">
                                <p className="text-gray-500 font-medium italic">
                                    Шукаєте варіант для дівчинки? Перегляньте нашу колекцію <Link to="/torty-na-zamovlennya/dlya-divchatok/" className="text-[#7A0019] hover:underline font-bold">ніжних тортів для принцес</Link>.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: Доставка ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка по Києву
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto md:text-lg">
                                Ми привеземо ваш торт у будь-який район Києва (Оболонь, Печерськ, Позняки, Дарниця та інші). Використовуємо спеціальні бокси та термосумки, щоб декор доїхав неушкодженим. Подробиці дивіться у розділі <Link to="/dostavka/" className="text-[#7A0019] font-bold">доставка та оплата</Link>.
                            </p>
                            <div className="flex justify-center flex-wrap gap-4">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] text-[#4a1c28] shadow-md">
                                    Замовити зараз
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* ── FAQ Section (Boy) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {boyFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'birthday' ? (

                <>
                    {/* ── БЛОК 1: HERO ТЕКСТ (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Замовити торт на день народження в Києві — індивідуальний дизайн для будь-якого віку
                        </h2>
                        <p className="intro-text">
                            Кондитерська майстерня Antreme створює <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="text-[#7A0019] hover:underline font-bold">торти на день народження в Києві</Link> для дітей, дорослих та ювілярів. Ми працюємо виключно під індивідуальне замовлення — без шаблонів і масового виробництва.
                        </p>
                        <p className="intro-text">
                            Торт на день народження — це центральний елемент свята. Ми враховуємо вік, стиль заходу, кількість гостей і побажання щодо декору та начинки. Понад 20 років досвіду та більше 6000 виконаних замовлень дозволяють нам гарантувати стабільну якість і точний розрахунок ваги.
                        </p>
                        <p className="intro-text">
                            Замовити святковий торт у Києві можна з <Link to="/dostavka/" className="text-[#7A0019] hover:underline font-bold">доставкою</Link> в будь-який район міста або самовивозом.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ПЕРЕВАГИ (картки з іконками) ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🎨</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Індивідуальний дизайн</h3>
                                    <p className="text-gray-500 text-sm">Враховуємо всі побажання</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🍰</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Понад 15 начинок</h3>
                                    <p className="text-gray-500 text-sm">Авторські смакові поєднання</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">💰</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Прозора вартість</h3>
                                    <p className="text-gray-500 text-sm">Без прихованих та раптових доплат</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🚕</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Доставка по Києву</h3>
                                    <p className="text-gray-500 text-sm">В усі райони точно у визначений час</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: Скільки коштує торт на день народження ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col items-start md:items-center text-left md:text-center">
                                <div className="flex items-center gap-3 mb-4 mx-auto justify-center w-full">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">💰</div>
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight text-left md:text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Скільки коштує торт на день народження у Києві?
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm md:text-base text-center w-full max-w-lg mx-auto">
                                    Вартість залежить від ваги, складності декору та обраної <Link to="/nachynky/" className="text-[#7A0019] hover:underline">начинки</Link>:
                                </p>
                                <ul className="space-y-3 mb-8 w-full max-w-sm mx-auto text-left">
                                    <li className="flex items-start gap-3 text-gray-700 font-medium border-b border-[#E8C064]/30 pb-2">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        <span>Святкові торти — <strong>від 650 грн за 1 кг</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium border-b border-[#E8C064]/30 pb-2">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        <span>Бенто-формат — <strong>від 300 грн</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium border-b border-[#E8C064]/30 pb-2">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        <span>Ювілейні композиції — <strong>індивідуально</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        <span>Мінімальна вага стандартного торта — <strong>від 1 кг</strong></span>
                                    </li>
                                </ul>
                                <div className="w-full text-center">
                                    <a href="tel:0979081504" className="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-[#E8C064]/30 shadow-lg mx-auto">
                                        Розрахувати вартість
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ПОПУЛЯРНІ ДИЗАЙНИ ── */}
                    <section className="bg-[#FAFAFA] py-10 md:py-14 mt-6">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні дизайни тортів на день народження
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-4">
                                <Link to="/torty-na-zamovlennya/dlya-zhinok/" className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group">
                                    <div className="text-3xl mb-3">🌺</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors">Торт для жінки</div>
                                </Link>
                                <Link to="/torty-na-zamovlennya/dlya-cholovikiv/" className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group">
                                    <div className="text-3xl mb-3">🎩</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors">Торт для чоловіка</div>
                                </Link>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                                    <div className="text-3xl mb-3">🔞</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug">Торт на 18 років</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                                    <div className="text-3xl mb-3">🎉</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug">Торт на 30 років</div>
                                </div>
                                <Link to="/torty-na-zamovlennya/na-yuviley/" className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group col-span-2 md:col-span-1 lg:col-span-1 mx-auto w-full max-w-[200px] md:max-w-full">
                                    <div className="text-3xl mb-3">👑</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors">Торт на ювілей</div>
                                </Link>
                            </div>
                            <p className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
                                Не знайшли потрібний варіант? Перегляньте весь асортимент <Link to="/torty-na-zamovlennya/" className="text-[#7A0019] hover:underline font-bold">тортів на замовлення</Link> або цікаві варіанти <Link to="/torty-na-zamovlennya/dytyachi/" className="text-[#7A0019] hover:underline font-bold">дитячих</Link> та <Link to="/torty-na-zamovlennya/vesilni/" className="text-[#7A0019] hover:underline font-bold">весільних тортів</Link>.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка тортів на день народження по Києву
                            </h2>
                            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto md:text-lg">
                                Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський, Солом’янський та інші.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 7: Як замовити ── */}
                    <section className="py-12 md:py-16 bg-[#FAFAFA] border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Як замовити святковий торт
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { step: '1', text: 'Оберіть дизайн' },
                                    { step: '2', text: 'Узгодьте начинку' },
                                    { step: '3', text: 'Погодьте дату' },
                                    { step: '4', text: 'Внесіть передоплату' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-full bg-[#E8C064] text-white font-black flex items-center justify-center text-2xl mb-4 shadow-sm z-10">
                                            {item.step}
                                        </div>
                                        {i < 3 && <div className="hidden lg:block absolute top-[2.75rem] -right-1/2 w-full h-[2px] bg-gradient-to-r from-[#E8C064] to-transparent z-0 opacity-30"></div>}
                                        <p className="font-bold text-gray-800 text-base">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 8: CTA БЛОК ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Обговоріть деталі святкового торта вже сьогодні
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Переглянути каталог
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 9: FAQ Section (Birthday) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання (FAQ)
                            </h2>
                            <div className="space-y-3">
                                {birthdayFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'anniversary' ? (
                <>
                    {/* ── БЛОК 1: HERO ТЕКСТ (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торт на ювілей у Києві — стильний акцент святкового вечора
                        </h2>
                        <p className="intro-text">
                            Ювілей — особлива дата, яка потребує особливого десерту. Кондитерська Antreme створює <Link to="/torty-na-zamovlennya/na-yuviley/" className="text-[#7A0019] hover:underline font-bold">ювілейні торти на замовлення в Києві</Link> для 18, 30, 40, 50 та інших річниць.
                        </p>
                        <p className="intro-text">
                            Ми враховуємо вік, стиль заходу, формат святкування та кількість гостей. Кожен торт виготовляється індивідуально — без шаблонів і масового виробництва.
                        </p>
                        <p className="intro-text">
                            Понад 6000 виконаних замовлень та 20 років досвіду гарантують стабільну якість та безпечні інгредієнти.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ПЕРЕВАГИ (картки з іконками) ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">👑</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Індивідуальний дизайн</h3>
                                    <p className="text-gray-500 text-sm">Створюємо під ваш вік і стиль</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🎨</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Об'ємні цифри</h3>
                                    <p className="text-gray-500 text-sm">Декорація цифр та індивідуальних написів</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🍰</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Понад 15 начинок</h3>
                                    <p className="text-gray-500 text-sm">Ніжні креми, бісквіти та соковиті фрукти</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mb-4">🚕</div>
                                    <h3 className="text-[14px] font-black text-[#7A0019] uppercase tracking-wide mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Доставка по Києву</h3>
                                    <p className="text-gray-500 text-sm">Надійна адресна доставка в строк</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: Скільки коштує ювілейний торт ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col items-start md:items-center text-left md:text-center">
                                <div className="flex items-center gap-3 mb-4 mx-auto justify-center w-full">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">💰</div>
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight text-left md:text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Скільки коштує ювілейний торт у Києві?
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-5 text-sm md:text-base text-center w-full max-w-lg mx-auto">
                                    Вартість залежить від ваги, складності декору та формату:
                                </p>
                                <ul className="space-y-3 mb-8 w-full max-w-sm mx-auto text-left">
                                    <li className="flex items-start gap-3 text-gray-700 font-medium border-b border-[#E8C064]/30 pb-2">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        <span>Торти — <strong>від 650 грн/кг</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium border-b border-[#E8C064]/30 pb-2">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        <span>Дизайни з об'ємними цифрами — <strong>індивідуально</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 font-medium">
                                        <span className="w-6 h-6 rounded-full bg-[#E8C064]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-[#8B6508]">✓</span>
                                        <span>Мінімальна вага — <strong>від 1 кг</strong></span>
                                    </li>
                                </ul>
                                <div className="w-full text-center">
                                    <a href="tel:0979081504" className="inline-block px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-[#E8C064]/30 shadow-lg mx-auto">
                                        Розрахувати вартість
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ПОПУЛЯРНІ ДИЗАЙНИ ── */}
                    <section className="bg-[#FAFAFA] py-10 md:py-14 mt-6">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні ювілейні дизайни
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-4">
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group relative overflow-hidden">
                                    <div className="text-3xl mb-3">🔞</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors relative z-10">Торт на 18 років</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group relative overflow-hidden">
                                    <div className="text-3xl mb-3">🎉</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors relative z-10">Торт на 30 років</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group relative overflow-hidden">
                                    <div className="text-3xl mb-3">🍾</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors relative z-10">Торт на 40 років</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group relative overflow-hidden">
                                    <div className="text-3xl mb-3">🥂</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors relative z-10">Торт на 50 років</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center group relative overflow-hidden col-span-2 md:col-span-1 mx-auto w-full max-w-[200px] md:max-w-full">
                                    <div className="text-3xl mb-3">🔢</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700 tracking-wider leading-snug group-hover:text-[#7A0019] transition-colors relative z-10">Ювілейні та цифрові композиції</div>
                                </div>
                            </div>
                            <p className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
                                Не знайшли потрібний варіант? Перегляньте весь асортимент <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="text-[#7A0019] hover:underline font-bold">тортів на день народження</Link> або цікаві варіанти <Link to="/torty-na-zamovlennya/dlya-zhinok/" className="text-[#7A0019] hover:underline font-bold">жіночих</Link> та <Link to="/torty-na-zamovlennya/dlya-cholovikiv/" className="text-[#7A0019] hover:underline font-bold">чоловічих тортів</Link>.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 5: НАЧИНКИ ТА ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Начинки для ювілейного торта
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ми пропонуємо понад 15 класичних і авторських смакових комбінацій. Зробіть торт ніжним і легким або насичено шоколадним за вашим вибором.
                                </p>
                                <Link to="/nachynky/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Переглянути всі начинки →
                                </Link>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Доставка ювілейних тортів по Києву
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський, Солом’янський та інші райони. Гарантуємо вчасну та безпечну доставку.
                                </p>
                                <Link to="/delivery/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Умови доставки →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: CTA БЛОК ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Готові замовити ювілейний торт?
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 7: FAQ Section (Anniversary) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання (FAQ)
                            </h2>
                            <div className="space-y-3">
                                {anniversaryFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'for-women' ? (
                <>
                    {/* ── БЛОК 2: ІНТРО ── */}
                    <div className="bg-[#FAFAFA] pt-8 md:pt-16 pb-12 md:pb-20 px-4 md:px-8 shadow-inner border-b border-gray-100">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-4xl font-black text-[#7A0019] mb-6 uppercase tracking-tight"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Стильні торти для жінок на день народження та ювілей
                            </h2>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 max-w-3xl mx-auto">
                                Кондитерська Antreme створює торти для жінок на замовлення в Києві з урахуванням віку, стилю свята та побажань щодо декору. Ми виготовляємо святкові композиції для дня народження, ювілею, професійного свята або романтичної події.
                            </p>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
                                Кожен торт розробляється індивідуально — від мінімалістичних сучасних дизайнів до ніжних квіткових композицій.
                            </p>
                        </div>
                    </div>

                    {/* ── БЛОК 3: ПЕРЕВАГИ ── */}
                    <section className="bg-white py-12 md:py-16">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">✨</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Індивідуальний дизайн під стиль жінки</p>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">🍰</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Авторські начинки</p>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">🌸</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Декор живими квітами</p>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">🚘</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Доставка по Києву</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ПОПУЛЯРНІ ВАРІАНТИ ── */}
                    <section className="py-12 md:py-16 bg-[#FDFBF7] border-t border-b border-[#E8C064]/20 relative overflow-hidden">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні варіанти тортів для жінок
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4">
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">💝</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700">Торт для мами</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">💍</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700">Торт для дружини</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">🎀</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700">Торт для сестри</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">💼</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700">Торт для колеги</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow group col-span-2 lg:col-span-1 mx-auto w-full max-w-[200px] lg:max-w-full">
                                    <div className="text-3xl mb-3">🥂</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-700">На 30, 40, 50 років</div>
                                </div>
                            </div>
                            <p className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
                                Перегляньте також наші <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="text-[#7A0019] hover:underline font-bold">торти на день народження</Link> та спеціальні пропозиції для <Link to="/torty-na-zamovlennya/na-yuviley/" className="text-[#7A0019] hover:underline font-bold">ювілеїв</Link>.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ЦІНИ ── */}
                    <section className="bg-white py-12 md:py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Скільки коштує торт для жінки у Києві?
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                                Вартість залежить від ваги та складності декору:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                                <div className="flex items-center gap-3 bg-[#FAFAFA] p-4 rounded-xl border border-gray-100">
                                    <span className="text-[#9C751E] text-xl">✓</span>
                                    <span className="font-bold text-gray-800 text-sm">Торти — від 650 грн/кг</span>
                                </div>
                                <div className="flex items-center gap-3 bg-[#FAFAFA] p-4 rounded-xl border border-gray-100">
                                    <span className="text-[#9C751E] text-xl">✓</span>
                                    <span className="font-bold text-gray-800 text-sm">Складні квіткові композиції — розрахунок індивідуально</span>
                                </div>
                                <div className="flex items-center gap-3 bg-[#FAFAFA] p-4 rounded-xl border border-gray-100">
                                    <span className="text-[#9C751E] text-xl">✓</span>
                                    <span className="font-bold text-gray-800 text-sm">Мінімальна вага — від 1 кг</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: НАЧИНКИ ТА ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Начинки для святкового торта
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ми пропонуємо понад 15 авторських начинок: Фісташка-малина, Полуниця-вершки, Шоколадний мус, Лимонний крем та інші вишукані смаки.
                                </p>
                                <Link to="/nachynky/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Ознайомитися з начинками →
                                </Link>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Доставка тортів для жінок по Києву
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ми доставляємо замовлення у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський та інші.
                                </p>
                                <Link to="/delivery/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Деталі доставки →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 7: CTA БЛОК ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Замовте стильний торт для жінки вже сьогодні
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 8: FAQ Section (For Women) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання (FAQ)
                            </h2>
                            <div className="space-y-3">
                                {forWomenFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'for-men' ? (
                <>
                    {/* ── БЛОК 2: ІНТРО ── */}
                    <div className="bg-[#FAFAFA] pt-8 md:pt-16 pb-12 md:pb-20 px-4 md:px-8 shadow-inner border-b border-gray-100">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-4xl font-black text-[#7A0019] mb-6 uppercase tracking-tight"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Стильні та лаконічні торти для чоловіків
                            </h2>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 max-w-3xl mx-auto">
                                Кондитерська Antreme створює торти для чоловіків на замовлення в Києві — для дня народження, ювілею або корпоративної події. Ми враховуємо характер, стиль та інтереси іменинника, створюючи сучасні, стримані або тематичні дизайни.
                            </p>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
                                Кожен чоловічий торт виготовляється індивідуально — від мінімалістичних композицій до тематичних декорів з урахуванням хобі чи професії.
                            </p>
                        </div>
                    </div>

                    {/* ── БЛОК 3: ПЕРЕВАГИ ── */}
                    <section className="bg-white py-12 md:py-16">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">🎩</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Сучасний стриманий дизайн</p>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">🔢</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Індивідуальні написи та цифри</p>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">🍫</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Понад 15 начинок</p>
                                </div>
                                <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#E8C064]/20 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8C064]/30 shadow-sm">🚘</div>
                                    <p className="font-bold text-[#4a1c28] text-sm">Доставка по Києву</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ПОПУЛЯРНІ ВАРІАНТИ ── */}
                    <section className="py-12 md:py-16 bg-[#FDFBF7] border-t border-b border-gray-200 relative overflow-hidden">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні варіанти тортів для чоловіків
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4">
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">🖤</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-800">Торт для чоловіка</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">👨‍👧‍👦</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-800">Торт для тата</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">🤵</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-800">Торт для керівника</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow group">
                                    <div className="text-3xl mb-3">🎯</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-800">Тематичні (хобі)</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow group col-span-2 lg:col-span-1 mx-auto w-full max-w-[200px] lg:max-w-full">
                                    <div className="text-3xl mb-3">🥃</div>
                                    <div className="text-[11px] md:text-sm font-bold text-gray-800">На 30, 40, 50 років</div>
                                </div>
                            </div>
                            <p className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
                                Перегляньте також наші варіанти <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="text-[#7A0019] hover:underline font-bold">на день народження</Link> та спеціальні композиції для <Link to="/torty-na-zamovlennya/na-yuviley/" className="text-[#7A0019] hover:underline font-bold">ювілеїв</Link>.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ЦІНИ ── */}
                    <section className="bg-white py-12 md:py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Скільки коштує торт для чоловіка у Києві?
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                                Вартість залежить від ваги та складності декору:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                                <div className="flex items-center gap-3 bg-[#FAFAFA] p-4 rounded-xl border border-gray-200">
                                    <span className="text-[#9C751E] text-xl">✓</span>
                                    <span className="font-bold text-gray-800 text-sm">Торти — від 650 грн/кг</span>
                                </div>
                                <div className="flex items-center gap-3 bg-[#FAFAFA] p-4 rounded-xl border border-gray-200">
                                    <span className="text-[#9C751E] text-xl">✓</span>
                                    <span className="font-bold text-gray-800 text-sm">Тематичні композиції — розрахунок індивідуально</span>
                                </div>
                                <div className="flex items-center gap-3 bg-[#FAFAFA] p-4 rounded-xl border border-gray-200">
                                    <span className="text-[#9C751E] text-xl">✓</span>
                                    <span className="font-bold text-gray-800 text-sm">Мінімальна вага — від 1 кг</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: НАЧИНКИ ТА ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Начинки для святкового чоловічого торта
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ми пропонуємо понад 15 авторських насичених начинок: Шоколадний трюфель, Снікерс, Фісташка-малина, Карамель-горіх та інші.
                                </p>
                                <Link to="/nachynky/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Переглянути всі начинки →
                                </Link>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Доставка тортів для чоловіків по Києву
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ми доставляємо замовлення у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський, Солом’янський та інші.
                                </p>
                                <Link to="/delivery/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Все про доставку →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 7: CTA БЛОК ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Замовте торт для чоловіка вже сьогодні
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 8: FAQ Section (For Men) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання (FAQ)
                            </h2>
                            <div className="space-y-3">
                                {forMenFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'bento' ? (
                <>
                    {/* ── БЛОК 2: ІНТРО ── */}
                    <div className="bg-[#FAFAFA] pt-8 md:pt-16 pb-12 md:pb-20 px-4 md:px-8 shadow-inner border-b border-gray-100">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-4xl font-black text-[#7A0019] mb-6 uppercase tracking-tight"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Маленький торт з великим настроєм
                            </h2>
                            <div className="w-20 h-1 bg-[#E8C064] mx-auto mb-8"></div>
                            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 font-medium">
                                Бенто торт — це компактний святковий десерт для 1–2 осіб, який ідеально підходить для привітання, сюрпризу або невеликого святкування.
                                Кондитерська <Link to="/" className="text-[#7A0019] hover:underline font-bold">Antreme</Link> виготовляє <strong>бенто торти на замовлення в Києві</strong> з індивідуальними написами та дизайном.
                            </p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
                                Незважаючи на невеликий розмір, кожен бенто торт створюється з тих самих натуральних інгредієнтів та
                                авторських <Link to="/nachynky/" className="text-[#a88a4a] hover:underline font-bold">начинок</Link>, що й великі святкові торти.
                            </p>
                        </div>
                    </div>

                    {/* ── БЛОК 3: ПЕРЕВАГИ ── */}
                    <section className="py-12 md:py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                {[
                                    { t: 'Індивідуальний напис', d: 'Ваш текст або малюнок', icon: '✍️' },
                                    { t: 'Ідеально для 1–2 осіб', d: 'Вага 300–500 г', icon: '🍰' },
                                    { t: 'Від 300 грн', d: 'Доступна ціна за якість', icon: '💰' },
                                    { t: 'Доставка по Києву', d: 'Швидко та обережно', icon: '🚚' }
                                ].map((item, id) => (
                                    <div key={id} className="bg-[#FDFBF7] p-6 rounded-2xl border border-orange-50 text-center hover:shadow-lg transition-shadow">
                                        <div className="text-3xl mb-3">{item.icon}</div>
                                        <h3 className="font-black text-[#4a1c28] uppercase text-sm mb-2" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>{item.t}</h3>
                                        <p className="text-gray-500 text-xs leading-tight">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ЦІНИ ТА ХАРАКТЕРИСТИКИ ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-20 px-4 md:px-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] mb-10 text-center uppercase tracking-tight"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Скільки коштує бенто торт у Києві?
                            </h2>
                            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-orange-100 mb-8">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                        <span className="font-bold text-gray-700">Стандартний бенто</span>
                                        <span className="text-[#7A0019] font-black text-xl">від 300 грн</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                        <span className="font-bold text-gray-700">Індивідуальний дизайн</span>
                                        <span className="text-gray-500 text-sm italic text-right">розрахунок індивідуально</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                        <span className="font-bold text-gray-700">Вага десерту</span>
                                        <span className="text-gray-700 font-bold">300–500 г</span>
                                    </div>
                                </div>
                                <div className="mt-10 text-center">
                                    <p className="text-gray-500 text-sm mb-6 max-w-xl mx-auto">
                                        Наші <strong>бенто торти</strong> — це ідеальне рішення для подарунка. Вартість залежить від складності вибраного декору та начинки.
                                    </p>
                                    <Link to="/torty-na-zamovlennya/" className="inline-block bg-[#7A0019] text-white px-8 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-[#5a151f] transition-all shadow-md">
                                        Замовити бенто торт
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ПОПУЛЯРНІ ВАРІАНТИ ── */}
                    <section className="py-12 md:py-20 bg-white px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] mb-8 text-center uppercase tracking-tight"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні варіанти бенто тортів
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3 mb-10">
                                {['Бенто з написом', 'Бенто для коханої', 'Бенто для друга', 'Мінімалістичні дизайни', 'Смішні написи'].map((cat, idx) => (
                                    <span key={idx} className="px-5 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm font-bold text-gray-600">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="p-4 border rounded-xl hover:border-[#E8C064] transition-colors group">
                                    <div className="font-bold text-[#7A0019] group-hover:text-[#9C751E]">На День Народження →</div>
                                </Link>
                                <Link to="/torty-na-zamovlennya/dlya-zhinok/" className="p-4 border rounded-xl hover:border-[#E8C064] transition-colors group">
                                    <div className="font-bold text-[#7A0019] group-hover:text-[#9C751E]">Жіночі бенто →</div>
                                </Link>
                                <Link to="/torty-na-zamovlennya/dlya-cholovikiv/" className="p-4 border rounded-xl hover:border-[#E8C064] transition-colors group">
                                    <div className="font-bold text-[#7A0019] group-hover:text-[#9C751E]">Для чоловіків →</div>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: НАЧИНКИ ТА ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Начинки для бенто торта
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ми використовуємо преміальні інгредієнти для кожного міні-торта. Виберіть свій ідеальний смак у розділі з нашими фірмовими розробками.
                                </p>
                                <Link to="/nachynky/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Всі начинки →
                                </Link>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Доставка бенто тортів по Києву
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ми доставляємо бенто торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський, Солом’янський та інші.
                                </p>
                                <Link to="/delivery/" className="inline-block mt-2 font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">
                                    Деталі доставки →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 7: CTA БЛОК ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <p className="text-[#9C751E] font-bold uppercase tracking-widest text-xs mb-3">Хочете зробити сюрприз?</p>
                            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Замовте бенто торт вже сьогодні
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 8: FAQ Section (Bento) ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {bentoFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'photo-cakes' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торт з вашим фото — яскравий акцент свята
                        </h2>
                        <p className="intro-text">
                            Кондитерська Antreme виготовляє фото-торти у Києві з їстівним фотодруком високої якості. Ми переносимо зображення на спеціальний цукровий папір, зберігаючи чіткість деталей та кольорів.
                        </p>
                        <p className="intro-text">
                            Фото-торт — це ідеальний варіант для дня народження, ювілею, корпоративу або тематичної вечірки.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ЯК ЗАМОВИТИ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Як замовити торт з фото?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#7A0019] text-white flex items-center justify-center rounded-full font-black text-xl shadow-md">1</div>
                                    <h3 className="font-bold text-gray-900 mb-2 mt-2">Надішліть фото</h3>
                                    <p className="text-sm text-gray-600">Надішліть фотографію або картинку у високій якості у месенджер.</p>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#7A0019] text-white flex items-center justify-center rounded-full font-black text-xl shadow-md">2</div>
                                    <h3 className="font-bold text-gray-900 mb-2 mt-2">Погоджуємо макет</h3>
                                    <p className="text-sm text-gray-600">Наш кондитер погоджує з вами розмір та розташування фото на торті.</p>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#7A0019] text-white flex items-center justify-center rounded-full font-black text-xl shadow-md">3</div>
                                    <h3 className="font-bold text-gray-900 mb-2 mt-2">Виготовляємо</h3>
                                    <p className="text-sm text-gray-600">Друкуємо зображення харчовими фарбами на цукровому папері.</p>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#7A0019] text-white flex items-center justify-center rounded-full font-black text-xl shadow-md">4</div>
                                    <h3 className="font-bold text-gray-900 mb-2 mt-2">Доставляємо</h3>
                                    <p className="text-sm text-gray-600">Привозимо ідеальний фото-торт у день вашого свята.</p>
                                </div>
                            </div>
                            <p className="mt-8 text-sm text-gray-500 uppercase tracking-widest leading-loose">
                                Подія: <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">на день народження</Link> | <Link to="/torty-na-zamovlennya/korporatyvni/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">корпоративні</Link>
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ВАРІАНТИ ДИЗАЙНУ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Які фото можна розмістити?
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                <span className="px-6 py-3 bg-[#FAFAFA] border border-gray-200 rounded-full text-sm font-bold text-gray-700 shadow-sm">Портрети іменинника</span>
                                <span className="px-6 py-3 bg-[#FAFAFA] border border-gray-200 rounded-full text-sm font-bold text-gray-700 shadow-sm">Сімейні фотографії</span>
                                <span className="px-6 py-3 bg-[#FAFAFA] border border-gray-200 rounded-full text-sm font-bold text-gray-700 shadow-sm">Логотип компанії</span>
                                <span className="px-6 py-3 bg-[#FAFAFA] border border-gray-200 rounded-full text-sm font-bold text-gray-700 shadow-sm">Улюблені персонажі</span>
                                <span className="px-6 py-3 bg-[#FAFAFA] border border-gray-200 rounded-full text-sm font-bold text-gray-700 shadow-sm">Жартівливі або тематичні картинки</span>
                            </div>
                            <p className="text-sm text-gray-500 uppercase tracking-widest leading-loose">
                                Дивіться також: <Link to="/torty-na-zamovlennya/dytyachi/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">дитячі</Link> | <Link to="/torty-na-zamovlennya/dlya-hlopchykiv/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">для хлопчиків</Link> | <Link to="/torty-na-zamovlennya/dlya-divchatok/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">для дівчаток</Link>
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 4: СКІЛЬКИ КОШТУЄ ── */}
                    <section className="py-10 md:py-14 bg-[#FDFBF7]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-sm flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0 md:pr-8 text-center md:text-left">
                                    <h2 className="text-xl md:text-2xl font-black text-[#7A0019] mb-4 pb-2 border-b-2 border-[#E8C064]/50 inline-block" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Скільки коштує фото-торт?
                                    </h2>
                                    <ul className="space-y-3 mt-4">
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Від 750 грн/кг
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Друк фото — включено у вартість або розраховується окремо
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Мінімальна вага — від 1 кг
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link to="/torty-na-zamovlennya/" className="inline-block px-8 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#7A0019] text-white shadow-md text-center">
                                        Замовити фото-торт
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: НАЧИНКИ ── */}
                    <section className="bg-white py-12 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для фото-тортів
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                                Ми використовуємо тільки натуральні інгредієнти, щоб ваші десерти були не лише красивими, але й безпечними та смачними. Обирайте начинку під ваш смак.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/nachynky/" className="inline-block font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">Всі начинки →</Link>
                                <Link to="/biskvitni-torty/" className="inline-block font-bold text-gray-500 hover:text-gray-700 uppercase tracking-widest text-sm border-b-2 border-gray-200 hover:border-gray-400 pb-1 transition-colors">Бісквітні →</Link>
                                <Link to="/musovi-torty/" className="inline-block font-bold text-gray-500 hover:text-gray-700 uppercase tracking-widest text-sm border-b-2 border-gray-200 hover:border-gray-400 pb-1 transition-colors">Мусові →</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-[#FAFAFA] py-12 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка фото-тортів по Києву
                            </h2>
                            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto md:text-lg mb-6">
                                Ми дбайливо доставляємо торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] font-bold hover:text-[#5a151f] uppercase tracking-widest text-sm border-b-2 border-[#7A0019] pb-1">
                                Умови доставки
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: ПЕРЕВАГИ (Як у Весільних) ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <h3 className="font-bold text-gray-900 mb-2">20 років досвіду</h3>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🎂</div>
                                    <h3 className="font-bold text-gray-900 mb-2">6000+ замовлень</h3>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🖨️</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Якісний фотодрук</h3>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🌿</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Натуральні інгредієнти</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 8: CTA ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Хочете торт з вашим фото?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Надіслати фото (Замовити)
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 9: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {photoCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'seasonal' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торти до свят протягом року
                        </h2>
                        <p className="intro-text">
                            Кондитерська Antreme виготовляє сезонні торти у Києві до найпопулярніших свят. Ми створюємо тематичний дизайн, адаптуємо декор до події та використовуємо натуральні начинки.
                        </p>
                        <p className="intro-text">
                            Сезонний торт — це яскравий акцент святкового столу та можливість підкреслити атмосферу події.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ОСНОВНІ СЕЗОННІ СВЯТА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                До яких свят замовляють торти?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                {/* Новий рік */}
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow border-t-4 border-t-[#7A0019]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Новий рік</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Торт з новорічним декором, кремовими ялинками та сніжинками.
                                    </p>
                                </div>
                                {/* День святого Валентина */}
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow border-t-4 border-t-[#7A0019]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>День святого Валентина</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Романтичні дизайни у червоних і рожевих відтінках.
                                    </p>
                                </div>
                                {/* 8 березня */}
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow border-t-4 border-t-[#7A0019]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>8 березня</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Ніжні весняні торти з квітами.
                                    </p>
                                </div>
                                {/* Великдень */}
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow border-t-4 border-t-[#7A0019]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Великдень</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Світлі пастельні торти з тематичним декором.
                                    </p>
                                </div>
                                {/* Хелловін */}
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow border-t-4 border-t-[#7A0019]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Хелловін</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Яскраві та креативні варіанти.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">На День Народження</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/korporatyvni/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Корпоративні свята</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДИЗАЙН ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Дизайн сезонних тортів
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Тематичні кольори</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Святкові елементи декору</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Індивідуальні написи</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Фото або логотип (за потреби)</strong>
                                </li>
                            </ul>
                            <Link to="/foto-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Дивіться також: Фото-торти →
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 4: СКІЛЬКИ КОШТУЄ ── */}
                    <section className="py-12 md:py-16 bg-white border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Скільки коштує сезонний торт?
                            </h2>
                            <div className="flex flex-col md:flex-row gap-6 justify-center text-left">
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-2xl font-black text-[#7A0019] mb-2">Від 700 ₴ / кг</div>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-2xl font-black text-[#7A0019] mb-2">Від 1 кг</div>
                                    <p className="text-sm text-gray-600">Мінімальна вага для замовлення.</p>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-xl font-bold text-[#7A0019] mb-2">Складний декор — індивідуальний розрахунок</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: НАЧИНКИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для сезонних тортів
                            </h2>
                            <div className="flex flex-wrap gap-4 justify-center items-center mt-6">
                                <Link to="/nachynky/" className="inline-flex items-center justify-center px-6 py-3 font-bold text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-white border border-gray-200 text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">Всі начинки</Link>
                                <Link to="/musovi-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Мусові торти</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/biskvitni-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Бісквітні торти</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка сезонних тортів по Києву
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-4 max-w-2xl mx-auto">
                                Ми доставляємо у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Детальніше про доставку →
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: ПЕРЕВАГИ (Icon Grid) ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-center text-[#7A0019] uppercase tracking-tight mb-10"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🍰</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">20 років досвіду</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🏆</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">6000+ замовлень</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🎨</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Індивідуальний дизайн</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🌿</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Натуральні інгредієнти</h3>
                                </div>
                                <div className="flex flex-col items-center col-span-2 md:col-span-1 mx-auto md:mx-0">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">💬</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Узгодження перед виготовленням</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 8: CTA БАНЕР ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Плануєте свято?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Замовити сезонний торт
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 9: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {seasonalCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'hobby' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торт, що відображає захоплення
                        </h2>
                        <p className="intro-text">
                            Кондитерська Antreme створює тематичні торти за хобі у Києві з індивідуальним дизайном. Ми враховуємо інтереси людини — спорт, музику, риболовлю, комп’ютерні ігри, подорожі та інші захоплення.
                        </p>
                        <p className="intro-text">
                            Такий торт стає персональним подарунком і підкреслює унікальність події.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ПОПУЛЯРНІ НАПРЯМКИ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Для яких хобі замовляють торти?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">⚽</div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Спорт</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">🎣</div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Риболовля</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">🏹</div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Полювання</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">🎮</div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Геймінг</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">🚗</div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Авто</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">🎸</div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Музика</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">✈️</div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight">Подорожі</h3>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">На День Народження</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/dlya-cholovikiv/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Для чоловіків</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/dlya-zhinok/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Для жінок</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДИЗАЙН ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Дизайн тематичних тортів
                            </h2>
                            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">3D-фігурки</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Спортивна символіка</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Фото або логотип</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Персональні написи</strong>
                                </li>
                            </ul>
                            <Link to="/foto-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Дивіться також: Фото-торти →
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 4: СКІЛЬКИ КОШТУЄ ── */}
                    <section className="py-12 md:py-16 bg-white border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Скільки коштує торт за хобі?
                            </h2>
                            <div className="flex flex-col md:flex-row gap-6 justify-center text-left">
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-2xl font-black text-[#7A0019] mb-2">Від 700 ₴ / кг</div>
                                    <p className="text-sm text-gray-600 leading-relaxed text-balance">
                                        Ціна залежить від складності декору та обраної начинки.
                                    </p>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-2xl font-black text-[#7A0019] mb-2">Від 1 кг</div>
                                    <p className="text-sm text-gray-600">Мінімальна вага для замовлення тематичного торту.</p>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-xl font-bold text-[#7A0019] mb-2">Складний декор</div>
                                    <p className="text-sm text-gray-600">Індивідуальний розрахунок вартості 3D-елементів.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: НАЧИНКИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для тематичних тортів
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl mx-auto">
                                Обирайте свою ідеальну начинку — від класичного бісквіту до легких мусових десертів. Ми використовуємо лише натуральні інгредієнти.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/nachynky/" className="inline-flex items-center justify-center px-6 py-3 font-bold text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-white border border-gray-200 text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">Всі начинки</Link>
                                <Link to="/musovi-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Мусові торти</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/biskvitni-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Бісквітні торти</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка по Києву
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-4 max-w-2xl mx-auto">
                                Ми доставляємо у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Детальніше про доставку →
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: ПЕРЕВАГИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-center text-[#7A0019] uppercase tracking-tight mb-10"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🎂</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 uppercase tracking-tight">20 років досвіду</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🍰</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 uppercase tracking-tight">6000+ замовлень</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🎨</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 uppercase tracking-tight">Індивідуальний дизайн</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">✅</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 uppercase tracking-tight">Узгодження макету</h3>
                                </div>
                                <div className="flex flex-col items-center col-span-2 md:col-span-1 mx-auto md:mx-0">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🌱</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 uppercase tracking-tight">Натуральні інгредієнти</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 8: CTA БАНЕР ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Потрібен торт, що відображає хобі?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 9: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {hobbyCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'biscuit' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Класичний формат, що завжди доречний
                        </h2>
                        <p className="intro-text max-w-3xl mx-auto italic text-gray-600 mb-4">
                            Кондитерська Antreme виготовляє бісквітні торти у Києві з м’якими коржами та збалансованими кремами. Це універсальний варіант для будь-якої події — від дня народження до корпоративного святкування.
                        </p>
                        <p className="intro-text max-w-3xl mx-auto">
                            Бісквітний торт — це поєднання ніжної текстури, натуральних інгредієнтів та можливості реалізувати будь-який дизайн.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ПОПУЛЯРНІ СМАКИ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні смаки бісквітних тортів
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                                {[
                                    { name: 'Шоколадний трюфель', icon: '🍫' },
                                    { name: 'Полуниця з вершками', icon: '🍓' },
                                    { name: 'Карамель – банан', icon: '🍌' },
                                    { name: 'Лісова ягода', icon: '🫐' },
                                    { name: 'Фісташка – малина', icon: '🟢' }
                                ].map((flavor, idx) => (
                                    <div key={idx} className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-50 text-center transition-transform hover:scale-105 shadow-sm">
                                        <div className="text-3xl mb-3">{flavor.icon}</div>
                                        <h3 className="text-sm font-bold text-gray-800">{flavor.name}</h3>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <Link to="/nachynky/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Дивитись всі начинки</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДЛЯ ЯКИХ ПОДІЙ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Для яких подій обирають бісквітні торти?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                                {[
                                    { name: 'День народження', icon: '🎂', link: '/torty-na-zamovlennya/na-den-narodzhennya/' },
                                    { name: 'Ювілей', icon: '🎉', link: '/torty-na-zamovlennya/na-yuviley/' },
                                    { name: 'Весілля', icon: '💍', link: '/torty-na-zamovlennya/vesilni/' },
                                    { name: 'Дитяче свято', icon: '🎈', link: '/torty-na-zamovlennya/dytyachi/' },
                                    { name: 'Корпоратив', icon: '💼', link: '/torty-na-zamovlennya/korporatyvni/' }
                                ].map((event, idx) => (
                                    <Link key={idx} to={event.link} className="bg-white p-4 rounded-2xl border border-gray-50 text-center transition-transform hover:scale-105 shadow-sm">
                                        <div className="text-3xl mb-2">{event.icon}</div>
                                        <h3 className="text-xs md:text-sm font-bold text-gray-800">{event.name}</h3>
                                    </Link>
                                ))}
                            </div>
                            <div className="text-center">
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Всі категорії</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ДИЗАЙН ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Дизайн бісквітних тортів
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#7A0019] mb-3">✨</div>
                                    <strong className="block text-gray-900 text-sm">Мінімалізм</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#7A0019] mb-3">🧁</div>
                                    <strong className="block text-gray-900 text-sm">Класика</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#7A0019] mb-3">📸</div>
                                    <strong className="block text-gray-900 text-sm">Фото-друк</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#7A0019] mb-3">🎨</div>
                                    <strong className="block text-gray-900 text-sm">Тематичний</strong>
                                </li>
                            </ul>
                            <Link to="/foto-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Фото-торти</Link>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ВАРТІСТЬ ── */}
                    <section className="py-12 md:py-20 bg-[#FAFAFA]">
                        <div className="max-w-4xl mx-auto px-4 md:px-8">
                            <div className="bg-[#7A0019] rounded-[40px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                                <h2 className="text-2xl md:text-3xl font-black mb-6 relative z-10 uppercase" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Скільки коштує бісквітний торт?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 relative z-10">
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Ціна від</p>
                                        <p className="text-2xl font-black text-[#9C751E]">650 ₴/кг</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Мінімальна вага</p>
                                        <p className="text-2xl font-black text-[#9C751E]">від 1 кг</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Складний декор</p>
                                        <p className="text-sm font-bold uppercase text-[#9C751E]">Індивідуально</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                    <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 bg-[#E8C064] text-[#4a1c28] font-black uppercase tracking-widest text-sm rounded-full transition-all hover:scale-105 hover:bg-[#D4A83C] shadow-lg">
                                        Оформити замовлення
                                    </Link>
                                    <a href="tel:0979081504" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/40 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all hover:bg-white/10">
                                        ✉️ Зателефонувати
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка по Києву
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed text-left md:text-center">
                                Ми доставляємо торти у всі райони Києва: <strong>Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський.</strong>
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Детальніше про доставку
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: CTA ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Замовити бісквітний торт у Києві
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    Оформити замовлення
                                </Link>
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    📞 Зателефонувати
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── БЛОК 8: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {biscuitCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-50">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'cupcakes' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Індивідуальні капкейки для будь-якої події
                        </h2>
                        <p className="intro-text max-w-3xl mx-auto italic text-gray-600 mb-4">
                            Кондитерська Antreme виготовляє капкейки у Києві з авторським декором та натуральними начинками. Це зручний формат для свят, корпоративів, дитячих заходів або як доповнення до основного торта.
                        </p>
                        <p className="intro-text max-w-3xl mx-auto">
                            Капкейки можна оформити в єдиному стилі з тортом або створити окремий тематичний дизайн.
                        </p>
                    </section>

                    {/* ── БЛОК 2: КОЛИ ЗАМОВЛЯЮТЬ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Коли замовляють капкейки?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                                {[
                                    { name: 'День народження', icon: '🎂', link: '/torty-na-zamovlennya/na-den-narodzhennya/' },
                                    { name: 'Дитяче свято', icon: '🎈', link: '/torty-na-zamovlennya/dytyachi/' },
                                    { name: 'Gender Reveal', icon: '👶', link: '/torty-na-zamovlennya/gender-reveal/' },
                                    { name: 'Корпоратив', icon: '💼', link: '/torty-na-zamovlennya/korporatyvni/' },
                                    { name: 'Весілля', icon: '💍', link: '/torty-na-zamovlennya/vesilni/' }
                                ].map((event, idx) => (
                                    <Link key={idx} to={event.link} className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-50 transition-transform hover:scale-105 shadow-sm flex flex-col items-center">
                                        <div className="text-3xl mb-2">{event.icon}</div>
                                        <h3 className="text-xs md:text-sm font-bold">{event.name}</h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДИЗАЙН ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Дизайн капкейків
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#7A0019] mb-3 shadow-sm">✍️</div>
                                    <strong className="block text-gray-900 text-sm">Індивідуальні написи</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#7A0019] mb-3 shadow-sm">📸</div>
                                    <strong className="block text-gray-900 text-sm">Фото або логотип</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#7A0019] mb-3 shadow-sm">🎨</div>
                                    <strong className="block text-gray-900 text-sm">Тематичний декор</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#7A0019] mb-3 shadow-sm">✨</div>
                                    <strong className="block text-gray-900 text-sm">Мінімалізм</strong>
                                </li>
                            </ul>
                            <Link to="/foto-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Дивитись фото-торти</Link>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ВАРТІСТЬ ── */}
                    <section className="py-12 md:py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-4 md:px-8">
                            <div className="bg-[#7A0019] rounded-[40px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                                <h2 className="text-2xl md:text-3xl font-black mb-6 relative z-10 uppercase" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Скільки коштують капкейки?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 relative z-10">
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Ціна від</p>
                                        <p className="text-2xl font-black text-[#9C751E]">80–120 ₴/шт</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Мінімальне замовлення</p>
                                        <p className="text-2xl font-black text-[#9C751E]">від 6 шт</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Великі партії</p>
                                        <p className="text-sm font-bold uppercase text-[#9C751E]">Індивідуально</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                    <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 bg-[#E8C064] text-[#4a1c28] font-black uppercase tracking-widest text-sm rounded-full transition-all hover:scale-105 hover:bg-[#D4A83C] shadow-lg">
                                        Замовити капкейки
                                    </Link>
                                    <a href="tel:0979081504" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/40 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all hover:bg-white/10">
                                        ✉️ Зателефонувати
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: СМАКИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Смаки капкейків
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                                {[
                                    { name: 'Шоколадні', icon: '🍫' },
                                    { name: 'Ванільні', icon: '🍦' },
                                    { name: 'Фісташкові', icon: '🟢' },
                                    { name: 'Ягідні', icon: '🫐' }
                                ].map((flavor, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-50 text-center transition-transform hover:scale-105 shadow-sm">
                                        <div className="text-3xl mb-3">{flavor.icon}</div>
                                        <h3 className="text-sm font-bold text-gray-800">{flavor.name}</h3>
                                    </div>
                                ))}
                            </div>
                            <Link to="/nachynky/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Всі начинки</Link>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка капкейків по Києву
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed text-left md:text-center">
                                Ми доставляємо у всі райони Києва: <strong>Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський.</strong>
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Детальніше про доставку
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: CTA ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Потрібні капкейки для свята?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    Оформити замовлення
                                </Link>
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    📞 Зателефонувати
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── БЛОК 8: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {cupcakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-50">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'gingerbread' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Авторські імбирні пряники для будь-якої події
                        </h2>
                        <p className="intro-text max-w-3xl mx-auto italic text-gray-600 mb-4">
                            Кондитерська Antreme виготовляє імбирні пряники у Києві з натуральних інгредієнтів та ручним розписом. Це ідеальний варіант для подарунків, дитячих свят, корпоративів та сезонних заходів.
                        </p>
                        <p className="intro-text max-w-3xl mx-auto">
                            Ми створюємо як поштучні пряники, так і великі брендовані партії.
                        </p>
                    </section>

                    {/* ── БЛОК 2: КОЛИ ЗАМОВЛЯЮТЬ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Коли замовляють імбирні пряники?
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                                {[
                                    { name: 'Новий рік', icon: '❄️', link: '/torty-na-zamovlennya/sezonni/' },
                                    { name: 'Різдво', icon: '🎄', link: '/torty-na-zamovlennya/sezonni/' },
                                    { name: 'Великдень', icon: '🥚', link: '/torty-na-zamovlennya/sezonni/' },
                                    { name: 'День народження', icon: '🎂', link: '/torty-na-zamovlennya/na-den-narodzhennya/' },
                                    { name: 'Корпоратив', icon: '💼', link: '/torty-na-zamovlennya/korporatyvni/' }
                                ].map((event, idx) => (
                                    <Link key={idx} to={event.link} className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-50 transition-transform hover:scale-105 shadow-sm flex flex-col items-center">
                                        <div className="text-3xl mb-2">{event.icon}</div>
                                        <h3 className="text-xs md:text-sm font-bold">{event.name}</h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: БРЕНДОВАНІ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Пряники з логотипом компанії
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Ми виготовляємо пряники з логотипом, корпоративною символікою або індивідуальним дизайном. Це ефективний формат подарунків для партнерів та співробітників.
                            </p>
                            <Link to="/torty-na-zamovlennya/korporatyvni/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Корпоративні замовлення
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ВАРТІСТЬ ── */}
                    <section className="py-12 md:py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-4 md:px-8">
                            <div className="bg-[#7A0019] rounded-[40px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                                <h2 className="text-2xl md:text-3xl font-black mb-6 relative z-10 uppercase" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Скільки коштують імбирні пряники?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 relative z-10">
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Ціна від</p>
                                        <p className="text-2xl font-black text-[#9C751E]">70–100 ₴/шт</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Мінімальне замовлення</p>
                                        <p className="text-2xl font-black text-[#9C751E]">від 10 шт</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Великі партії</p>
                                        <p className="text-sm font-bold uppercase text-[#9C751E]">Індивідуально</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                    <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 bg-[#E8C064] text-[#4a1c28] font-black uppercase tracking-widest text-sm rounded-full transition-all hover:scale-105 hover:bg-[#D4A83C] shadow-lg">
                                        Замовити пряники
                                    </Link>
                                    <a href="tel:0979081504" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/40 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all hover:bg-white/10">
                                        ✉️ Зателефонувати
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ДОСТАВКА ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка імбирних пряників у Києві
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed text-left md:text-center">
                                Ми доставляємо у всі райони Києва: <strong>Печерський, Шевченківський, Дарницький, Оболонський, Подільський та інші.</strong>
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Торти на замовлення</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/kapkeyky/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Капкейки</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/nachynky/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Начинки</Link>
                            </div>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Детальніше про доставку
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 6: CTA ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Потрібні святкові пряники?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    Оформити замовлення
                                </Link>
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    📞 Зателефонувати
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── БЛОК 7: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {gingerbreadFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-50">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'mousse' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Легка текстура та сучасний стиль
                        </h2>
                        <p className="intro-text max-w-3xl mx-auto italic text-gray-600 mb-4">
                            Кондитерська Antreme виготовляє мусові торти у Києві з ніжною текстурою та сучасним дизайном. Це ідеальний вибір для тих, хто шукає легкий десерт без важких кремів.
                        </p>
                        <p className="intro-text max-w-3xl mx-auto">
                            Мусовий торт поєднує витончену геометрію, дзеркальну глазур та збалансовані смаки, створюючи справжній кулінарний шедевр.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ПОПУЛЯРНІ СМАКИ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Популярні поєднання смаків
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                {[
                                    { name: 'Малина – фісташка', icon: '🍓' },
                                    { name: 'Манго – маракуйя', icon: '🥭' },
                                    { name: 'Карамель – шоколад', icon: '🍫' },
                                    { name: 'Лимон – ваніль', icon: '🍋' }
                                ].map((flavor, idx) => (
                                    <div key={idx} className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-50 text-center transition-transform hover:scale-105 shadow-sm">
                                        <div className="text-3xl mb-3">{flavor.icon}</div>
                                        <h3 className="text-sm font-bold text-gray-800">{flavor.name}</h3>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <Link to="/nachynky/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Дивитись всі начинки</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДЛЯ ЯКИХ ПОДІЙ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Коли обирають мусові торти?
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#7A0019] mb-3">🎂</div>
                                    <strong className="block text-gray-900 text-sm">День народження</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#7A0019] mb-3">💍</div>
                                    <strong className="block text-gray-900 text-sm">Весілля</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#7A0019] mb-3">💼</div>
                                    <strong className="block text-gray-900 text-sm">Корпоратив</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#7A0019] mb-3">🕯️</div>
                                    <strong className="block text-gray-900 text-sm">Вечеря</strong>
                                </li>
                            </ul>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Торти на замовлення</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/vesilni/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Весільні торти</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/korporatyvni/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Корпоративні торти</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ВАРТІСТЬ ── */}
                    <section className="py-12 md:py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-4 md:px-8">
                            <div className="bg-[#7A0019] rounded-[40px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                                <h2 className="text-2xl md:text-3xl font-black mb-6 relative z-10 uppercase" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Скільки коштує мусовий торт?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 relative z-10">
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Ціна від</p>
                                        <p className="text-2xl font-black text-[#9C751E]">750 ₴/кг</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Мінімальна вага</p>
                                        <p className="text-2xl font-black text-[#9C751E]">від 1 кг</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Складний дизайн</p>
                                        <p className="text-sm font-bold uppercase text-[#9C751E]">Індивідуально</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                    <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 bg-[#E8C064] text-[#4a1c28] font-black uppercase tracking-widest text-sm rounded-full transition-all hover:scale-105 hover:bg-[#D4A83C] shadow-lg">
                                        Оформити замовлення
                                    </Link>
                                    <a href="tel:0979081504" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/40 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all hover:bg-white/10">
                                        ✉️ Зателефонувати
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ДОСТАВКА ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-y border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-gray-800">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка по Києву
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Мусові торти потребують дбайливого транспортування. Ми доставляємо десерти у спеціальних контейнерах по всьому Києву, зберігаючи ідеальну глазур та форму.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Детальніше про доставку
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 6: CTA ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Замовити мусовий торт у Києві
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    Оформити замовлення
                                </Link>
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    📞 Зателефонувати
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── БЛОК 7: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {mousseCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-50">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'girl' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торт, який підкреслює характер
                        </h2>
                        <p className="intro-text max-w-3xl mx-auto italic text-gray-600 mb-4">
                            Кондитерська Antreme створює торти для дівчат у Києві з індивідуальним дизайном. Це можуть бути ніжні пастельні варіанти, стильний мінімалізм або яскравий креативний декор.
                        </p>
                        <p className="intro-text max-w-3xl mx-auto">
                            Такий торт стане особливим подарунком на день народження, річницю або іншу важливу подію для вашої коханої, сестри чи подруги.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ДЛЯ ЯКИХ ПОДІЙ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Коли замовляють торт для дівчини?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                                {[
                                    { name: 'День народження', icon: '🎂' },
                                    { name: 'Річниця', icon: '💑' },
                                    { name: 'Освідчення', icon: '💍' },
                                    { name: '8 березня', icon: '💐' },
                                    { name: 'День закоханих', icon: '❤️' }
                                ].map((event, idx) => (
                                    <div key={idx} className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-50 text-center transition-transform hover:scale-105 shadow-sm">
                                        <div className="text-3xl mb-2">{event.icon}</div>
                                        <h3 className="text-xs md:text-sm font-bold text-gray-800">{event.name}</h3>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">День народження</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/sezonni/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Сезонні свята</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДИЗАЙН ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Варіанти дизайну
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-400 mb-3">🌸</div>
                                    <strong className="block text-gray-900 text-sm">Квіти та пастель</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 mb-3">✍️</div>
                                    <strong className="block text-gray-900 text-sm">Мінімалізм</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 mb-3">📸</div>
                                    <strong className="block text-gray-900 text-sm">Фото на торті</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center text-[#7A0019] mb-3">❤️</div>
                                    <strong className="block text-gray-900 text-sm">Побажання</strong>
                                </li>
                            </ul>
                            <Link to="/foto-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Дивитись фото-торти</Link>
                        </div>
                    </section>

                    {/* ── БЛОК 4: ВАРТІСТЬ ── */}
                    <section className="py-12 md:py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-4 md:px-8">
                            <div className="bg-[#7A0019] rounded-[40px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                                <h2 className="text-2xl md:text-3xl font-black mb-6 relative z-10" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Скільки коштує торт для дівчини?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 relative z-10">
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Ціна від</p>
                                        <p className="text-2xl font-black">650 ₴/кг</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Мінімальна вага</p>
                                        <p className="text-2xl font-black">від 1 кг</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Складний декор</p>
                                        <p className="text-sm font-bold uppercase">Індивідуально</p>
                                    </div>
                                </div>
                                <a href="tel:0979081504" className="inline-flex items-center justify-center px-10 py-4 bg-[#E8C064] text-[#4a1c28] font-black uppercase tracking-widest text-sm rounded-full transition-all hover:scale-105 hover:bg-[#D4A83C] shadow-lg relative z-10">
                                    Замовити торт
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: НАЧИНКИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-y border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для тортів
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Обирайте з понад 15 авторських начинок: від класичних бісквітних до легких мусових варіантів. Ми використовуємо тільки натуральні інгредієнти.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/nachynky/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Всі начинки</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/musovi-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Мусові торти</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/biskvitni-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Бісквітні торти</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="py-12 md:py-16 bg-white">
                        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка по Києву
                            </h2>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Ми дбайливо доставляємо торти у всі райони Києва: <strong>Печерський, Шевченківський, Голосіївський, Подільський, Дарницький, Оболонський</strong> та інші. Кожен торт транспортується у надійній упаковці.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Детальніше про доставку</Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: ПЕРЕВАГИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                {[
                                    { t: '20 років досвіду', d: 'Професійна майстерність.' },
                                    { t: '6000+ замовлень', d: 'Довіра наших клієнтів.' },
                                    { t: 'Індивідуальний дизайн', d: 'Втілюємо будь-які ідеї.' },
                                    { t: 'Натуральні складові', d: 'Без штучних добавок.' },
                                    { t: 'Фото перед відправкою', d: 'Повна впевненість у результаті.' }
                                ].map((adv, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{adv.t}</h4>
                                        <p className="text-xs text-gray-500">{adv.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 8: CTA БАНЕР ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Плануєте сюрприз?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── БЛОК 9: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {girlCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-50">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'patriotic' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Торт у національному стилі
                        </h2>
                        <p className="intro-text max-w-3xl mx-auto">
                            Кондитерська Antreme виготовляє патріотичні торти у Києві з повагою до національної символіки. Ми створюємо дизайни у синьо-жовтих кольорах, з елементами української символіки та індивідуальними написами.
                        </p>
                        <p className="intro-text max-w-3xl mx-auto">
                            Такий торт доречний для свят, урочистих подій, підтримки військових або важливих особистих дат.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ДЛЯ ЯКИХ ПОДІЙ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Коли замовляють патріотичні торти?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 border-t-4 border-t-[#0057B7]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Державні свята</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        День Незалежності, День Конституції та інші офіційні дати.
                                    </p>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 border-t-4 border-t-[#FFD700]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Підтримка військових</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Подарунок для захисників та захисниць України.
                                    </p>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 border-t-4 border-t-[#7A0019]">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>Урочисті та благодійні події</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Заходи, спрямовані на підтримку українських ініціатив.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/torty-na-zamovlennya/profesiine-svyato/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Професійне свято</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/korporatyvni/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5 transition-all">Корпоративні торти</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДИЗАЙН ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Варіанти оформлення
                            </h2>
                            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#0057B7]/10 flex items-center justify-center text-[#0057B7] mb-3 font-bold">UA</div>
                                    <strong className="block text-gray-900 text-sm">Синьо-жовта гама</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#7A0019] mb-3">🔱</div>
                                    <strong className="block text-gray-900 text-sm">Тризуб / Орнамент</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#7A0019] mb-3">✍️</div>
                                    <strong className="block text-gray-900 text-sm">Патріотичні написи</strong>
                                </li>
                                <li className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-3">✓</div>
                                    <strong className="block text-gray-900 text-sm">Мінімалізм</strong>
                                </li>
                            </ul>
                            <Link to="/torty-na-zamovlennya/za-hobi/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Дивіться також: Торти за хобі →
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 4: СКІЛЬКИ КОШТУЄ ── */}
                    <section className="py-12 md:py-16 bg-white border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Скільки коштує патріотичний торт?
                            </h2>
                            <div className="flex flex-col md:flex-row gap-6 justify-center text-left">
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-2xl font-black text-[#7A0019] mb-2">Від 700 ₴ / кг</div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Ціна залежить від обраного декору та начинки.
                                    </p>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-2xl font-black text-[#7A0019] mb-2">Від 1 кг</div>
                                    <p className="text-sm text-gray-600">Мінімальна вага для замовлення.</p>
                                </div>
                                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                    <div className="text-xl font-bold text-[#7A0019] mb-2">Складний декор</div>
                                    <p className="text-sm text-gray-600">Ручне ліплення символіки — індивідуальний розрахунок.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: НАЧИНКИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для патріотичних тортів
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl mx-auto">
                                Обирайте будь-яку з наших фірмових начинок. Ми використовуємо лише натуральні вершки, шоколад та ягоди.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <Link to="/nachynky/" className="inline-flex items-center justify-center px-6 py-3 font-bold text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-white border border-gray-200 text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">Всі начинки</Link>
                                <Link to="/musovi-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Мусові торти</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/biskvitni-torty/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Бісквітні торти</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка по Києву
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mb-4">
                                Швидка та дбайлива доставка у всі райони Києва.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] font-bold text-sm tracking-widest uppercase border-b border-[#7A0019] pb-1 transition-all">
                                Сторінка доставки →
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: ПЕРЕВАГИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-center text-[#7A0019] uppercase tracking-tight mb-10"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🏆</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase">20 років досвіду</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">⭐</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase">6000+ замовлень</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🤝</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase">Індивідуальний підхід</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">📋</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase">Узгодження дизайну</h3>
                                </div>
                                <div className="flex flex-col items-center col-span-2 lg:col-span-1 mx-auto lg:mx-0">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-2xl">🌿</div>
                                    <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase">Натуральні складові</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 8: CTA ── */}
                    <div className="bg-[#7A0019] relative overflow-hidden py-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Потрібен патріотичний торт у Києві?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064]/10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 9: FAQ ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {patrioticCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-50">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'professional' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Тематичний торт для особливої професії
                        </h2>
                        <p className="intro-text">
                            Кондитерська Antreme виготовляє торти на професійні свята у Києві з індивідуальним дизайном. Ми створюємо тематичні десерти для лікарів, вчителів, військових, айті-фахівців, бухгалтерів та представників інших професій.
                        </p>
                        <p className="intro-text">
                            Такий торт — це оригінальний спосіб подякувати та підкреслити важливість роботи людини.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ДЛЯ ЯКИХ ПРОФЕСІЙ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Для яких професій замовляють торти?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                                <div className="bg-[#FAFAFA] py-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
                                    <div className="text-3xl mb-3 text-[#7A0019]">🩺</div>
                                    <h3 className="font-bold text-sm text-gray-800">День медика</h3>
                                </div>
                                <div className="bg-[#FAFAFA] py-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
                                    <div className="text-3xl mb-3 text-[#7A0019]">📚</div>
                                    <h3 className="font-bold text-sm text-gray-800">День вчителя</h3>
                                </div>
                                <div className="bg-[#FAFAFA] py-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
                                    <div className="text-3xl mb-3 text-[#7A0019]">📊</div>
                                    <h3 className="font-bold text-sm text-gray-800">День бухгалтера</h3>
                                </div>
                                <div className="bg-[#FAFAFA] py-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
                                    <div className="text-3xl mb-3 text-[#7A0019]">⚖️</div>
                                    <h3 className="font-bold text-sm text-gray-800">День юриста</h3>
                                </div>
                                <div className="bg-[#FAFAFA] py-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
                                    <div className="text-3xl mb-3 text-[#7A0019]">🎖️</div>
                                    <h3 className="font-bold text-sm text-gray-800">День військового</h3>
                                </div>
                                <div className="bg-[#FAFAFA] py-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
                                    <div className="text-3xl mb-3 text-[#7A0019]">💻</div>
                                    <h3 className="font-bold text-sm text-gray-800">День айті-фахівця</h3>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center items-center">
                                <span className="text-gray-500 font-medium italic">Дивіться також:</span>
                                <Link to="/torty-na-zamovlennya/korporatyvni/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">Корпоративні торти</Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="inline-flex items-center text-[#7A0019] hover:text-[#5a151f] uppercase tracking-widest text-xs font-bold border-b border-[#7A0019] pb-0.5">На День Народження</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДИЗАЙН ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                                <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl relative">
                                    <img
                                        src={professionalHeroBg}
                                        alt="Дизайн професійних тортів"
                                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h2 className="text-3xl md:text-4xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Дизайн тематичних тортів
                                    </h2>
                                    <ul className="space-y-5 mb-8">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mr-4 mt-1">✓</div>
                                            <div>
                                                <strong className="block text-gray-900 mb-1">Професійні атрибути</strong>
                                                <span className="text-gray-600 block leading-relaxed text-sm">Ліпка зі солодкої мастики чи шоколаду: стетоскоп, книга, калькулятор, пістолет або будівельна каска.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mr-4 mt-1">✓</div>
                                            <div>
                                                <strong className="block text-gray-900 mb-1">Написи та побажання</strong>
                                                <span className="text-gray-600 block leading-relaxed text-sm">Теплі слова, жартівливі фрази або подяка, нанесені кондитерським кремом.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mr-4 mt-1">✓</div>
                                            <div>
                                                <strong className="block text-gray-900 mb-1">Логотип організації</strong>
                                                <span className="text-gray-600 block leading-relaxed text-sm">Перенесення символіки компанії або підрозділу на торт за допомогою <Link to="/torty-na-zamovlennya/foto-torty/" className="text-[#7A0019] border-b border-[#7A0019] hover:text-[#5a151f]">харчового друку</Link>.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8C064]/20 flex items-center justify-center text-[#9C751E] mr-4 mt-1">✓</div>
                                            <div>
                                                <strong className="block text-gray-900 mb-1">Сучасний мінімалізм</strong>
                                                <span className="text-gray-600 block leading-relaxed text-sm">Для тих, хто віддає перевагу стильному та креативному підходу без зайвого декору.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: СКІЛЬКИ КОШТУЄ ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100 text-center">
                        <div className="max-w-5xl mx-auto px-4 md:px-8">
                            <h2 className="text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Скільки коштує торт на професійне свято?
                            </h2>
                            <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
                                <div className="bg-[#FAFAFA] md:w-1/3 py-8 px-6 rounded-[2rem] border border-gray-100">
                                    <div className="text-4xl font-black text-gray-900 mb-2">Від 700 ₴<span className="text-xl text-gray-500 font-medium">/кг</span></div>
                                    <p className="text-gray-500 uppercase tracking-wider text-xs font-bold font-sans">Базова вартість начинки</p>
                                </div>
                                <div className="bg-[#FAFAFA] md:w-1/3 py-8 px-6 rounded-[2rem] border border-gray-100">
                                    <div className="text-4xl font-black text-gray-900 mb-2">Від 1 кг</div>
                                    <p className="text-gray-500 uppercase tracking-wider text-xs font-bold font-sans">Мінімальне замовлення</p>
                                </div>
                                <div className="bg-[#FAFAFA] md:w-1/3 py-8 px-6 rounded-[2rem] border border-gray-100">
                                    <div className="text-4xl font-black text-gray-900 mb-2 mt-1">Декор</div>
                                    <p className="text-gray-500 uppercase tracking-wider text-xs font-bold font-sans">Розраховується індівідуально</p>
                                </div>
                            </div>
                            <Link to="/torty-na-zamovlennya/" className="inline-block px-10 py-5 font-black text-sm uppercase tracking-widest rounded-full transition-transform hover:scale-105 bg-[#7A0019] text-white shadow-xl">
                                Замовити тематичний торт
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 5: НАЧИНКИ ── */}
                    <section className="bg-[#FAFAFA] py-12 border-t border-gray-100 text-center">
                        <div className="max-w-5xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для тематичних тортів
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                                Смак так само важливий, як і вигляд. Обирайте найкращу комбінацію серед нашого широкого асортименту натуральних смаків.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/nachynky/" className="inline-flex items-center text-[#7A0019] font-bold hover:text-[#5a151f] uppercase tracking-widest text-sm border-b-2 border-transparent hover:border-[#7A0019] pb-1 transition-colors">Всі начинки →</Link>
                                <Link to="/musovi-torty/" className="inline-flex items-center text-gray-500 font-bold hover:text-gray-700 uppercase tracking-widest text-sm border-b-2 border-transparent hover:border-gray-400 pb-1 transition-colors">Мусові →</Link>
                                <Link to="/biskvitni-torty/" className="inline-flex items-center text-gray-500 font-bold hover:text-gray-700 uppercase tracking-widest text-sm border-b-2 border-transparent hover:border-gray-400 pb-1 transition-colors">Бісквітні →</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ДОСТАВКА ── */}
                    <section className="bg-white py-12 border-t border-gray-100 text-center">
                        <div className="max-w-5xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка по Києву
                            </h2>
                            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto md:text-lg mb-6">
                                Ми доставляємо торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Подільський, Дарницький, Оболонський та інші.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] font-bold hover:text-[#5a151f] uppercase tracking-widest text-sm border-b-2 border-[#7A0019] pb-1">
                                Детальні умови доставки
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 7: ПЕРЕВАГИ ── */}
                    <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100 text-center">
                        <div className="max-w-6xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <h3 className="font-bold text-gray-900 text-sm">20 років досвіду</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🎂</div>
                                    <h3 className="font-bold text-gray-900 text-sm">6000+ замовлень</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🤝</div>
                                    <h3 className="font-bold text-gray-900 text-sm">Індивідуальний підхід</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">✍️</div>
                                    <h3 className="font-bold text-gray-900 text-sm">Узгодження дизайну</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1 border-b-4 border-b-green-500">
                                    <div className="text-4xl mb-4">🌿</div>
                                    <h3 className="font-bold text-gray-900 text-sm">Натуральні інгредієнти</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 8: CTA ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Потрібен торт на професійне свято?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 -mt-10 -ml-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 9: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-white">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                FAQ: Найчастіші запитання
                            </h2>
                            <div className="space-y-3">
                                {professionalCakesFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'christening' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Ніжний торт для особливого дня
                        </h2>
                        <p className="intro-text">
                            Кондитерська Antreme створює торти на хрестини у Києві з урахуванням традицій та побажань родини. Ми виготовляємо хрестильні торти для хлопчиків і дівчаток з витонченим декором, пастельними кольорами та натуральними начинками.
                        </p>
                        <p className="intro-text">
                            Такий торт стає символом важливої події та прикрасою святкового столу.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ДИЗАЙН ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Дизайн тортів на хрестини
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-sm text-gray-800">Янголята та хрестики</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-sm text-gray-800">Ім’я дитини та дата</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-sm text-gray-800">Пастельні кольори</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-sm text-gray-800">Фігурки малюка</h3>
                                </div>
                                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 shadow-sm col-span-2 md:col-span-1">
                                    <h3 className="font-bold text-sm text-gray-800">Сучасний мінімалізм</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 uppercase tracking-widest leading-loose">
                                Також дивіться: <Link to="/torty-na-zamovlennya/dytyachi/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">дитячі торти</Link> | <Link to="/torty-na-zamovlennya/dlya-hlopchykiv/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">для хлопчиків</Link> | <Link to="/torty-na-zamovlennya/dlya-divchatok/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold mx-2">для дівчаток</Link>
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 3: СКІЛЬКИ КОШТУЄ ── */}
                    <section className="py-10 md:py-14 bg-[#FDFBF7]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-sm flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0 md:pr-8 text-center md:text-left">
                                    <h2 className="text-xl md:text-2xl font-black text-[#7A0019] mb-4 pb-2 border-b-2 border-[#E8C064]/50 inline-block" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Скільки коштує торт на хрестини?
                                    </h2>
                                    <ul className="space-y-3 mt-4">
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Від 700 грн/кг
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Мінімальна вага — від 1 кг
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Складний декор розраховується індивідуально
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link to="/torty-na-zamovlennya/" className="inline-block px-8 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#7A0019] text-white shadow-md text-center">
                                        Замовити торт на хрестини
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 4: НАЧИНКИ ── */}
                    <section className="bg-white py-12 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Начинки для хрестильного торта
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                                Ми використовуємо тільки натуральні інгредієнти, щоб наші десерти були безпечними та смачними. Обирайте від класичних варіантів до вишуканих мусів.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/nachynky/" className="inline-block font-bold text-[#9C751E] hover:text-[#D4A83C] uppercase tracking-widest text-sm border-b-2 border-[#E8C064] pb-1 transition-colors">Всі начинки →</Link>
                                <Link to="/biskvitni-torty/" className="inline-block font-bold text-gray-500 hover:text-gray-700 uppercase tracking-widest text-sm border-b-2 border-gray-200 hover:border-gray-400 pb-1 transition-colors">Бісквітні →</Link>
                                <Link to="/musovi-torty/" className="inline-block font-bold text-gray-500 hover:text-gray-700 uppercase tracking-widest text-sm border-b-2 border-gray-200 hover:border-gray-400 pb-1 transition-colors">Мусові →</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ДОСТАВКА ── */}
                    <section className="bg-[#FAFAFA] py-12 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка тортів на хрестини по Києву
                            </h2>
                            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto md:text-lg mb-6">
                                Ми дбайливо доставляємо торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Подільський, Дарницький, Оболонський та інші.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] font-bold hover:text-[#5a151f] uppercase tracking-widest text-sm border-b-2 border-[#7A0019] pb-1">
                                Умови доставки
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ПЕРЕВАГИ (Як у Весільних) ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <h3 className="font-bold text-gray-900 mb-2">20 років досвіду</h3>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🎂</div>
                                    <h3 className="font-bold text-gray-900 mb-2">6000+ замовлень</h3>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🌿</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Натуральні інгредієнти</h3>
                                </div>
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">✨</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Індивідуальний підхід</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 7: CTA ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Плануєте хрестини у Києві?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 8: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {christeningFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : category === 'gender-reveal' ? (
                <>
                    {/* ── БЛОК 1: HERO (SEO Інтро) ── */}
                    <section className="category-intro mt-12 mb-8 mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Найсолодший момент — дізнатися стать малюка
                        </h2>
                        <p className="intro-text">
                            Кондитерська Antreme створює торти Gender Reveal у Києві з кольоровим сюрпризом всередині. Рожевий або блакитний бісквіт, крем чи конфетті відкриють головну інтригу вечора.
                        </p>
                        <p className="intro-text">
                            Ми зберігаємо таємницю до моменту розрізання — або готуємо торт за конвертом від лікаря.
                        </p>
                    </section>

                    {/* ── БЛОК 2: ЯКИЙ СЮРПРИЗ (Варіанти) ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Який сюрприз можна зробити?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
                                    <div className="text-4xl mb-3">🍰</div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">Кольоровий бісквіт</h3>
                                    <p className="text-sm text-gray-600">Насичений рожевий або яскраво-блакитний корж.</p>
                                </div>
                                <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
                                    <div className="text-4xl mb-3">🧁</div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">Кольоровий крем</h3>
                                    <p className="text-sm text-gray-600">Крем-чіз відповідного кольору між коржами.</p>
                                </div>
                                <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
                                    <div className="text-4xl mb-3">🎊</div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">Конфетті всередині</h3>
                                    <p className="text-sm text-gray-600">Центр торта заповнюється їстівними цукерками або драже.</p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm">
                                Ми можемо сховати також приховану капсулу (за індивідуальним запитом). Обирайте смак у нашому розділі <Link to="/nachynky/" className="text-[#7A0019] hover:underline font-bold">начинки</Link>.
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 3: ДИЗАЙН ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-16 border-t border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-8" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Дизайн торта для гендер пати
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                <span className="px-6 py-3 bg-white border border-[#E8C064]/30 rounded-full text-sm font-bold text-gray-700 shadow-sm">Ніжний мінімалізм</span>
                                <span className="px-6 py-3 bg-white border border-[#E8C064]/30 rounded-full text-sm font-bold text-gray-700 shadow-sm">Тематика "Хлопчик чи дівчинка?"</span>
                                <span className="px-6 py-3 bg-white border border-[#E8C064]/30 rounded-full text-sm font-bold text-gray-700 shadow-sm">Декор з написами</span>
                                <span className="px-6 py-3 bg-white border border-[#E8C064]/30 rounded-full text-sm font-bold text-gray-700 shadow-sm">Фігурки малюка, лелеки, пінетки</span>
                            </div>
                            <p className="text-sm text-gray-500 uppercase tracking-widest">
                                Більше ідей шукайте в розділі <Link to="/torty-na-zamovlennya/dytyachi/" className="text-[#7A0019] border-b border-[#7A0019] pb-0.5 hover:text-[#5a151f] font-bold">дитячі торти</Link>
                            </p>
                        </div>
                    </section>

                    {/* ── БЛОК 4: СКІЛЬКИ КОШТУЄ ── */}
                    <section className="py-10 md:py-14">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E8C064]/20 shadow-[0_4px_20px_rgba(232,192,100,0.15)] flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0 md:pr-8 text-center md:text-left">
                                    <h2 className="text-xl md:text-2xl font-black text-[#7A0019] mb-4 pb-2 border-b-2 border-[#E8C064]/50 inline-block" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                        Скільки коштує торт Gender Reveal?
                                    </h2>
                                    <ul className="space-y-3 mt-4">
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Від 700 грн/кг
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Мінімальна вага — від 1 кг
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#7A0019]"></span> Складний декор розраховується окремо
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-shrink-0">
                                    <a href="tel:0979081504" className="inline-block px-8 py-4 font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 bg-[#E8C064] text-[#4a1c28] shadow-[#E8C064]/30 shadow-lg whitespace-nowrap">
                                        Замовити прорахунок
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 5: ДОСТАВКА ── */}
                    <section className="bg-white py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Доставка торта Gender Reveal по Києву
                            </h2>
                            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto md:text-lg mb-6">
                                Ми доставляємо у всі райони Києва: Печерський, Шевченківський, Голосіївський, Дарницький, Оболонський, Подільський. Транспортуємо з дотриманням температурного режиму, щоб сюрприз приїхав в ідеальному стані.
                            </p>
                            <Link to="/dostavka/" className="inline-flex items-center text-[#7A0019] font-bold hover:text-[#5a151f] uppercase tracking-widest text-sm border-b-2 border-[#7A0019] pb-1">
                                Умови доставки
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    </section>

                    {/* ── БЛОК 6: ПЕРЕВАГИ (Як у Весільних) ── */}
                    <section className="bg-[#FDFBF7] py-12 md:py-16 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] tracking-tight mb-10" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Чому обирають Antreme?
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <h3 className="font-bold text-gray-900 mb-2">20 років досвіду</h3>
                                    <p className="text-xs text-gray-500">Бездоганна репутація з 2004 року.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🎂</div>
                                    <h3 className="font-bold text-gray-900 mb-2">6000+ замовлень</h3>
                                    <p className="text-xs text-gray-500">Тисячі щасливих клієнтів у Києві.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🤫</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Збереження інтриги</h3>
                                    <p className="text-xs text-gray-500">Акуратність і повна конфіденційність сюрпризу.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-4xl mb-4">🌿</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Натуральність</h3>
                                    <p className="text-xs text-gray-500">Виключно натуральні інгредієнти та барвники.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── БЛОК 7: CTA ── */}
                    <div className="relative py-12 md:py-16 overflow-hidden bg-[#7A0019] rounded-3xl mx-4 md:mx-8 my-8 shadow-xl">
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Готові відкрити головну інтригу?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:0979081504" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 bg-[#E8C064] hover:bg-[#D4A83C] text-[#4a1c28] shadow-md">
                                    📞 Зателефонувати
                                </a>
                                <Link to="/torty-na-zamovlennya/" className="inline-flex items-center justify-center px-10 py-4 cursor-pointer font-black text-sm tracking-widest rounded-full transition-transform hover:scale-105 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white">
                                    Замовити торт Gender Reveal
                                </Link>
                            </div>
                            <p className="mt-6 text-white/70 text-sm">
                                Або перегляньте інші <Link to="/torty-na-zamovlennya/na-den-narodzhennya/" className="underline hover:text-white">торти на день народження</Link>.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#E8C064] opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* ── БЛОК 8: FAQ Schema UI ── */}
                    <section className="py-10 md:py-14 bg-[#FAFAFA]">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#7A0019] uppercase tracking-tight mb-8 text-center"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Поширені запитання
                            </h2>
                            <div className="space-y-3">
                                {genderRevealFaqData.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{faq.q}</h3>
                                            <svg className={`w-5 h-5 text-[#7A0019] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {seoData && seoData.seoText && (
                        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
                            <div
                                className="prose prose-sm md:prose-base prose-stone max-w-none prose-headings:text-[#7A0019] prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal"
                                dangerouslySetInnerHTML={{ __html: marked.parse(seoData.seoText) }}
                            />
                        </div>
                    )}

                    {/* ===== INTERNAL LINKING BLOCK ===== */}
                    {category && (
                        <nav className="max-w-4xl mx-auto px-4 md:px-8 pb-12" aria-label="Корисні посилання">
                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Дивіться також</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Link to="/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Головна</Link>
                                    <Link to="/nachynky/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Начинки</Link>
                                    <Link to="/delivery/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Доставка та оплата</Link>
                                    <Link to="/reviews/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Відгуки</Link>
                                    <Link to="/torty-na-zamovlennya/" className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-600 hover:border-[#7A0019] hover:text-[#7A0019] transition-all">Усі категорії</Link>
                                </div>
                            </div>
                        </nav>
                    )}

                    {/* ===== FILTER BOTTOM SHEET (OVERLAY) ===== */}
                    {isFilterOpen && (
                        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />

                            {/* Sheet */}
                            <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up">
                                {/* Handle bar (mobile) */}
                                <div className="sticky top-0 bg-white rounded-t-3xl md:rounded-t-3xl z-10 border-b border-gray-100">
                                    <div className="flex justify-center pt-3 pb-1 md:hidden">
                                        <div className="w-10 h-1 bg-gray-300 rounded-full" />
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                            Фільтр
                                        </h3>
                                        <button onClick={() => setIsFilterOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="px-6 py-5 space-y-8">

                                    {/* === Price Range === */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                                            Ціна, ₴
                                        </label>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Від</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#E8C064] transition-all"
                                                />
                                            </div>
                                            <div className="w-4 h-0.5 bg-gray-300 mt-5" />
                                            <div className="flex-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">До</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#E8C064] transition-all"
                                                />
                                            </div>
                                        </div>
                                        {/* Slider */}
                                        <input
                                            type="range"
                                            min={priceBounds[0]}
                                            max={priceBounds[1]}
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8C064]"
                                        />
                                    </div>

                                    {/* === Weight === */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                            Вага
                                        </label>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {weightChips.map(w => (
                                                <button
                                                    key={w.key}
                                                    onClick={() => toggleWeight(w.key)}
                                                    className={`h-12 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 active:scale-95 ${selectedWeights.includes(w.key)
                                                        ? 'bg-[#7A0019] border-[#7A0019] text-white shadow-md'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className="text-base">{w.icon}</span>
                                                    {w.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom actions */}
                                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center gap-3">
                                    <button
                                        onClick={resetFilters}
                                        className="h-12 px-5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider hover:border-gray-300 active:scale-95 transition-all"
                                    >
                                        Скинути
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="flex-1 h-12 bg-[#E8C064] hover:bg-[#D4A83C] text-[#5A0014] rounded-xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                                    >
                                        Показати {processedCakes.length} {processedCakes.length === 1 ? 'товар' : processedCakes.length < 5 ? 'товари' : 'товарів'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
            }

            <style>{`
                    @keyframes slideUp {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .animate-slide-up {
                        animation: slideUp 0.3s ease-out;
                    }
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

export default CakeList;
