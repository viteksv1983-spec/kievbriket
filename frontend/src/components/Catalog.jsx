import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import api from '../api';
import { ArrowRight, ChevronRight, Truck, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { getProductUrl, getImageUrl } from '../utils/urls';
import { useCategories } from '../context/CategoryContext';
import SEOHead from './SEOHead';
import { OrderFormModal } from './new-home/OrderFormModal';
import FirewoodCategoryPage from './FirewoodCategoryPage';

// ─── per-category SEO content ───────────────────────────────────────────────
const CATEGORY_SEO = {
    firewood: {
        trustItems: ['Дрова природної вологості', 'Доставка по Києву та області', 'Чесний складометр'],
        benefit: 'Колоті дрова твердих порід для опалення котлів, камінів та відкритого вогнища',
        seoH2: 'Купити дрова з доставкою у Києві',
        seoText: `
            <h3>Які дрова краще для опалення</h3>
            <p>Для постійного опалення будинку найкраще підходять дрова з твердих порід: дуб, граб та ясен. Вони горять значно довше і дають більше тепла порівняно з м'якими породами. Дубові дрова — класика для камінів і котлів тривалого горіння: щільна деревина повільно займається, але горить рівно і жарко.</p>
            <h3>Дрова для каміна та вуличних зон</h3>
            <p>Для каміна та вуличних мангалів рекомендуємо граб або вільху — породи, що майже не стріляють іскрами та горять стабільно. Соснові та берестові дрова ідеально підходять для швидкого розпалу та короткочасного обігріву — вони займаються легко та швидко.</p>
            <h3>Доставка дров по Києву та Київській області</h3>
            <p>Доставляємо дрова по всьому Києву та Київській області власним автопарком. Газель — до 6 складометрів, ЗІЛ або Камаз — до 15 складометрів. Стандартна доставка здійснюється наступного дня після оформлення замовлення. Оплата після отримання та перевірки об'єму — без передоплати.</p>
            <h3>Чому обирають нас</h3>
            <p>Ми продаємо дрова більше 10 років. Усі дрова щільно укладені в кузов складометрами — ви завжди отримаєте саме той обсяг, який замовили. Наша команда консультує з вибором породи та оптимального обсягу для вашого будинку або котельні.</p>
        `,
        filters: ['Усі', 'Дуб', 'Граб', 'Сосна', 'Береза'],
    },
    briquettes: {
        trustItems: ['RUF, Nestro, Pini Kay', 'Низька вологість < 10%', 'Висока калорійність'],
        benefit: 'Паливні брикети — компактна альтернатива дровам з вищою теплоємністю',
        seoH2: 'Купити паливні брикети з доставкою у Києві',
        seoText: `
            <h3>Чим брикети кращі за дрова</h3>
            <p>Паливні брикети мають значно нижчу вологість (до 8–10%) та вищу теплоємність, ніж звичайні дрова. Вони горять рівно і довго — один брикет горить у 2–3 рази довше за таке ж поліно. Ідеально підходять для котлів тривалого горіння, камінів та печей.</p>
            <h3>Типи паливних брикетів</h3>
            <p>RUF — класичний прямокутний брикет, зручний для зберігання та завантаження в котел. Nestro — циліндричні брикети з отвором, чудово підходять для камінів. Pini Kay — шестигранні брикети преміум-класу з найвищою теплоємністю для котлів та печей.</p>
            <h3>Доставка брикетів по Києву та Київській області</h3>
            <p>Брикети доставляємо в упаковках або навалом. Власний автопарк дозволяє здійснювати доставку в день замовлення або на наступний день по всьому Києву та прилеглих районах.</p>
        `,
        filters: ['Усі', 'RUF', 'Nestro', 'Pini Kay'],
    },
    coal: {
        trustItems: ['Антрацит та газове вугілля', 'Фасування від 25 кг', 'Доставка по Києву'],
        benefit: 'Вугілля — максимальна тепловіддача для котлів та промислових печей',
        seoH2: 'Купити вугілля з доставкою у Києві',
        seoText: `
            <h3>Антрацит чи газове вугілля</h3>
            <p>Антрацит — вугілля найвищого ступеня вуглефікації з найвищою теплоємністю. Горить без диму і майже без запаху, залишає мінімум золи. Газове вугілля дешевше і добре підходить для котлів типу АУСВ та опалення виробничих приміщень.</p>
            <h3>Для якого обладнання підходить</h3>
            <p>Вугілля ідеально підходить для твердопаливних котлів, промислових печей та котелень. Важливо обирати фракцію відповідно до технічних вимог вашого котла — ми допоможемо з вибором.</p>
            <h3>Доставка вугілля по Києву та Київській області</h3>
            <p>Доставляємо вугілля навалом та у мішках по всьому Київському регіону. Мінімальне замовлення — від 1 тонни. Власний транспорт гарантує точний обсяг та своєчасну доставку.</p>
        `,
        filters: ['Усі', 'Антрацит', 'Газове'],
    },
};

const DEFAULT_SEO = {
    trustItems: ['Якісна продукція', 'Доставка по Києву та області', 'Чесний облік'],
    benefit: 'Якісне тверде паливо з доставкою по Києву та Київській області',
    seoH2: 'Купити тверде паливо з доставкою',
    seoText: '',
    filters: ['Усі'],
};

const TRUST_BAR_ITEMS = [
    { icon: '🚚', text: 'Доставка по Києву за 24 години' },
    { icon: '🔥', text: 'Дрова природної вологості' },
    { icon: '📏', text: 'Чесний складометр' },
    { icon: '💳', text: 'Оплата після отримання' },
];

// ─── Benefit lines per product name keyword ─────────────────────────────────
function getBenefitLine(name = '') {
    const n = name.toLowerCase();
    if (n.includes('дуб')) return 'Горять довго, висока тепловіддача';
    if (n.includes('граб')) return 'Рівне горіння, мінімум іскор';
    if (n.includes('сосна') || n.includes('береза')) return 'Легко розпалюється, добрий жар';
    if (n.includes('ruf') || n.includes('нестро') || n.includes('pini')) return 'Не димлять, тривале горіння';
    if (n.includes('антрацит')) return 'Максимальна тепловіддача, мало золи';
    return 'Якісна продукція з доставкою';
}

// Sorting helpers
function sortProducts(arr, mode) {
    const copy = [...arr];
    if (mode === 'price_asc') return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (mode === 'price_desc') return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return copy; // 'popular' = original API order
}

export default function Catalog({ predefinedCategory }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [orderProduct, setOrderProduct] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Усі');
    const [sortMode, setSortMode] = useState('popular');

    const { categorySlug } = useParams();
    const [searchParams] = useSearchParams();
    const { categories } = useCategories();

    const categoryQuery = searchParams.get('category');
    const activeCategorySlug = predefinedCategory || categorySlug || categoryQuery;
    const activeCategory = categories.find(c => c.slug === activeCategorySlug);
    const catSeo = CATEGORY_SEO[activeCategorySlug] || DEFAULT_SEO;

    const seo = useMemo(() => {
        if (!activeCategory) return {};
        const cat = activeCategory;
        const fallbackDesc = cat.seo_text
            ? cat.seo_text.replace(/<[^>]*>/g, '').substring(0, 160)
            : undefined;
        return {
            title: cat.meta_title || `${cat.name} — купити з доставкою по Києву`,
            description: cat.meta_description || fallbackDesc,
            h1: cat.seo_h1 || cat.name,
            ogImage: cat.og_image || cat.image_url,
            canonical: cat.canonical_url || undefined,
            robots: cat.is_indexable === false ? 'noindex, nofollow' : undefined,
        };
    }, [activeCategory]);

    useEffect(() => {
        setLoading(true);
        setActiveFilter('Усі');
        window.scrollTo(0, 0);
        api.get('/products/', { params: { category: activeCategorySlug } })
            .then(response => {
                const data = response.data;
                setProducts(Array.isArray(data) ? data : (data.items || []));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [activeCategorySlug]);

    const handleOrder = useCallback((product = null) => {
        setOrderProduct(product);
        setIsOrderFormOpen(true);
    }, []);

    const pageTitle = activeCategory ? (seo.h1 || activeCategory.name) : 'Каталог';

    // Filter + sort
    const displayedProducts = useMemo(() => {
        let filtered = products;
        if (activeFilter !== 'Усі') {
            filtered = products.filter(p =>
                p.name?.toLowerCase().includes(activeFilter.toLowerCase())
            );
        }
        return sortProducts(filtered, sortMode);
    }, [products, activeFilter, sortMode]);

    return (
        <div
            className="new-home-scope"
            style={{
                minHeight: '100vh',
                background: 'var(--c-bg)',
                color: 'var(--c-text)',
                fontFamily: 'var(--font-outfit)',
                paddingTop: '64px',
            }}
        >
            {activeCategory && (
                <SEOHead
                    title={seo.title}
                    description={seo.description}
                    ogImage={seo.ogImage}
                    canonical={seo.canonical}
                    robots={seo.robots}
                />
            )}

            {/* ── PREMIUM CATEGORY PAGE (Dynamic for all categories) ── */}
            <FirewoodCategoryPage
                products={displayedProducts}
                seo={seo}
                onOrderProduct={handleOrder}
                activeCategory={activeCategory}
                activeCategorySlug={activeCategorySlug}
            />

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => { setIsOrderFormOpen(false); setOrderProduct(null); }}
                product={orderProduct}
            />
        </div >
    );
}
