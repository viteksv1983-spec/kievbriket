import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Phone, Flame, Truck, Scale, ShieldCheck, Thermometer, Clock, Package, CheckCircle2, MessageCircle } from 'lucide-react';
import shopConfig from '../shop.config';
import { useReveal } from '../hooks/useReveal';
import api from '../api';
import { getProductUrl, getImageUrl } from '../utils/urls';
import { FuelCalculatorSection } from './new-home/FuelCalculatorSection';
import { DeliverySection } from './new-home/DeliverySection';
import { BenefitsSection } from './new-home/BenefitsSection';

// We import the SEOHead and OrderFormModal from parent if needed, or Parent handles it.
// To keep things simple, we assume Parent (Catalog.jsx) handles SEOHead and OrderModal state,
// and we just render the visual sections here.

// ─── HERO CATEGORY SECTION ─────────────────────────────────────────
function HeroCategory({ onQuickOrderClick, activeCategory, activeCategorySlug }) {
    const { ref, visible } = useReveal();
    return (
        <section ref={ref} className="hero-section" style={{ minHeight: 'auto', padding: 'var(--s-section) 0 4rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background Glow */}
            <div
                className="glow-orb"
                style={{
                    width: 700, height: 600,
                    top: -100, right: '-10%',
                    background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)",
                }}
            />

            <div className="layout-container" style={{ zIndex: 1, position: 'relative' }}>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className={`reveal ${visible ? 'visible' : ''}`} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    marginBottom: '2rem',
                    fontSize: '0.8125rem', color: 'var(--c-text2)',
                }}>
                    <Link to="/" style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s' }}>Головна</Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <Link to="/catalog/firewood" style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s' }}>Каталог</Link>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>{activeCategory?.name || 'Дрова'}</span>
                </nav>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="responsive-grid">

                    {/* Left: Text */}
                    <div className="hero-text fade-up" style={{ paddingBottom: '2rem' }}>
                        <div className="nh-badge fade-up">
                            <Flame size={13} /> ТОВ «Київ Брикет»
                        </div>
                        <h1 className="display hero-h1 fade-up fade-up-d1" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                            Купити {activeCategory?.name?.toLowerCase() || 'тверде паливо'} у Києві<br />
                            <span style={{ color: 'var(--c-orange)' }}>з доставкою</span>
                        </h1>
                        <p className="body hero-sub fade-up fade-up-d2" style={{ maxWidth: 500 }}>
                            {activeCategory?.seo_text ?
                                activeCategory.seo_text.replace(/<[^>]*>/g, '').substring(0, 110) + '...'
                                : 'Сухе якісне паливо для опалення будинків, котлів і камінів. Доставка по Києву та Київській області.'}
                        </p>

                        <div className="hero-ctas fade-up fade-up-d3" style={{ marginBottom: '2rem' }}>
                            <button onClick={onQuickOrderClick} className="nh-btn-primary hero-btn-main">
                                Замовити {activeCategory?.name?.toLowerCase() || ''} <ArrowRight size={16} />
                            </button>
                            <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="nh-btn-ghost hero-btn-phone" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                                <Phone size={15} /> Подзвонити
                            </a>
                        </div>

                        <div className="hero-trust-row fade-up fade-up-d3">
                            <span className="hero-trust-item"><span className="hero-trust-check">✔</span>Доставка сьогодні</span>
                            <span className="hero-trust-sep" />
                            <span className="hero-trust-item"><span className="hero-trust-check">✔</span>Оплата після отримання</span>
                            <span className="hero-trust-sep" />
                            <span className="hero-trust-item"><span className="hero-trust-check">✔</span>Чесний складометр</span>
                        </div>
                    </div>

                    {/* Right: Premium Image */}
                    <div className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s', position: 'relative' }}>
                        <div style={{
                            aspectRatio: '4/3',
                            borderRadius: 24,
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            position: 'relative'
                        }}>
                            <img
                                src={activeCategory?.image_url ? getImageUrl(activeCategory.image_url, api.defaults.baseURL) : `/media/categories/${activeCategorySlug || 'firewood'}.webp`}
                                alt={activeCategory?.name || 'Категорія'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/assets/product-placeholder-wood.webp'; }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />
                        </div>
                        {/* Floating stat card */}
                        <div className="nh-card" style={{
                            position: 'absolute',
                            bottom: -20,
                            left: -20,
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            background: 'rgba(15, 20, 25, 0.85)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(249,115,22,0.3)',
                            borderRadius: 16
                        }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-orange)' }}>
                                <Thermometer size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--c-text2)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Тепловіддача</p>
                                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>До 2100 ккал/л</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @media(max-width: 900px) {
                    .responsive-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                }
            `}</style>
        </section>
    );
}

// ─── TYPES OF FIREWOOD (PRODUCT CARDS) ─────────────────────────────
function CategoryProducts({ products, onOrderProduct, activeCategory }) {
    const { ref, visible } = useReveal();

    // Custom mapping for descriptions
    const getDetailedDesc = (name) => {
        const n = name.toLowerCase();
        if (n.includes('дуб')) return { desc: 'Висока тепловіддача, довге горіння.', use: 'Ідеально для котлів і камінів.' };
        if (n.includes('граб')) return { desc: 'Найбільша щільність, рівне полум\'я.', use: 'Для тримання стабільної температури.' };
        if (n.includes('сосна')) return { desc: 'Легко розпалюється, дає швидкий жар.', use: 'Для лазень і швидкого обігріву.' };
        if (n.includes('береза')) return { desc: 'Рівне красиве полум\'я.', use: 'Для відкритих камінів.' };
        if (n.includes('антрацит')) return { desc: 'Максимальна тепловіддача.', use: 'Для твердопаливних котлів.' };
        if (n.includes('ruf') || n.includes('pini')) return { desc: 'Довге і рівне горіння.', use: 'Ідеально для котлів і камінів.' };
        return { desc: 'Якісне паливо з високою тепловіддачею.', use: 'Універсальне використання.' };
    };

    return (
        <section ref={ref} style={{ padding: 'var(--s-section) 0', background: 'var(--c-surface)' }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? "visible" : ""}`} style={{ marginBottom: "3rem", textAlign: 'center' }}>
                    <h2 className="h2" style={{ marginBottom: 12 }}>
                        Асортимент <span style={{ color: "var(--c-orange)" }}>{activeCategory?.name?.toLowerCase() || 'товарів'}</span>
                    </h2>
                    <p style={{ color: 'var(--c-text2)', maxWidth: 600, margin: '0 auto' }}>Оберіть варіант, що найкраще підходить для вашої системи опалення.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {products.map((product, i) => {
                        const info = getDetailedDesc(product.name);
                        const displayPrice = product.variants?.length > 0 ? product.variants[0].price : product.price;

                        return (
                            <Link key={product.id} to={getProductUrl(product)} style={{ textDecoration: 'none' }}>
                                <article
                                    className={`nh-card reveal ${visible ? 'visible' : ''}`}
                                    style={{
                                        display: 'flex', flexDirection: 'column', height: '100%',
                                        transitionDelay: `${i * 0.1}s`,
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s, box-shadow 0.3s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.15)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
                                        <img
                                            src={getImageUrl(product.image_url, api.defaults.baseURL)}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <h3 className="h3" style={{ marginBottom: '1rem', flexShrink: 0 }}>{product.name}</h3>

                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', marginBottom: '0.5rem', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                                <Flame size={16} color="var(--c-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                                                {info.desc}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--c-text2)', marginBottom: '1.5rem', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                                <CheckCircle2 size={16} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
                                                {info.use}
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <div>
                                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-orange)' }}>{displayPrice}</span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--c-text2)', marginLeft: 4 }}>грн / {activeCategory?.slug === 'coal' || activeCategory?.slug === 'briquettes' ? 'тонну' : 'складометр'}</span>
                                            </div>
                                            <button
                                                className="nh-btn-ghost"
                                                style={{ border: '1px solid var(--color-border-orange)', padding: '8px 16px', fontSize: '0.875rem' }}
                                                onClick={(e) => { e.preventDefault(); onOrderProduct(product); }}
                                            >
                                                Замовити
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ─── FAQ SECTION ───────────────────────────────────────────────
function FaqSection() {
    const { ref, visible } = useReveal();
    const [openIdx, setOpenIdx] = useState(0);

    const faqs = [
        { q: "Які дрова краще для котла?", a: "Для твердопаливного котла найкраще підходять тверді породи деревини: дуб, граб та ясен. Вони мають найвищу тепловіддачу та горять найдовше. Вологість не повинна перевищувати 20-25%." },
        { q: "Які дрова найкращі для печі?", a: "Для пічного опалення чудово підходять дрова твердих порід (дуб, граб), які забезпечують тривалий жар. Також часто використовують березові та вільхові дрова, оскільки вони горять рівним красивим полум'ям і менше забивають димохід сажею." },
        { q: "Чи можна купити дрова з доставкою сьогодні?", a: "Так, за умови оформлення замовлення в першій половині дня, доставка по Києву можлива в той самий день. По області — зазвичай на наступний день." },
        { q: "Скільки коштує машина дров?", a: "Вартість залежить від породи деревини та об'єму кузова (ЗІЛ, Камаз, Газель). Вартість доставки розраховується індивідуально в залежності від вашої адреси." },
        { q: "Який об'єм дров у машині? (чесний складометр)", a: "Ми ретельно укладаємо поліна на складі. Наприклад, в ЗІЛ поміщається до 6-7 складометрів. Ви можете особисто рулеткою заміряти габарити укладених дров у кузові перед вивантаженням (Довжина × Ширина × Висота = Складометри)." },
        { q: "Яка вологість дров для опалення?", a: "Ми поставляємо деревину природної та камерної сушки. Оптимальна вологість дров для ефективного горіння становить 15-20%. Саме такі показники дозволяють отримати максимальну тепловіддачу та мінімізувати утворення сажі." }
    ];

    return (
        <section ref={ref} style={{ padding: "var(--s-section) 0" }}>
            <div className="layout-container">
                <div className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 className="h2" style={{ maxWidth: 800, margin: '0 auto' }}>Поширені запитання</h2>
                </div>

                <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: '0.1s' }}>
                    {faqs.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                style={{
                                    borderBottom: '1px solid var(--color-border-subtle)',
                                    marginBottom: '1rem'
                                }}
                            >
                                <button
                                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                                    style={{
                                        width: '100%', textAlign: 'left', background: 'none', border: 'none',
                                        padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', cursor: 'pointer', color: 'var(--c-text)',
                                        fontFamily: 'inherit', fontSize: '1.125rem', fontWeight: 600
                                    }}
                                >
                                    {faq.q}
                                    <ChevronRight
                                        size={20}
                                        style={{
                                            color: 'var(--c-orange)',
                                            transform: isOpen ? 'rotate(90deg)' : 'none',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                </button>
                                <div style={{
                                    maxHeight: isOpen ? 500 : 0,
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s ease',
                                    color: 'var(--c-text2)',
                                    lineHeight: 1.6
                                }}>
                                    <p style={{ paddingBottom: '1.5rem', margin: 0 }}>{faq.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}


// ─── FINAL CTA BANNER ──────────────────────────────────────────
function FinalCtaBanner({ onQuickOrderClick, activeCategory }) {
    const { ref, visible } = useReveal();

    return (
        <section ref={ref} style={{ padding: "var(--s-section) 1.5rem", maxWidth: 1200, margin: '0 auto', marginBottom: 'var(--s-section)' }}>
            <div
                className={`nh-card reveal ${visible ? "visible" : ""}`}
                style={{
                    position: 'relative', overflow: 'hidden',
                    padding: '4rem 2rem', textAlign: 'center',
                    background: 'linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)',
                    border: '1px solid rgba(249,115,22,0.2)'
                }}
            >
                {/* Glow behind the CTA */}
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
                    zIndex: 0,
                    pointerEvents: "none",
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
                    <h2 className="h2" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
                        Замовте {activeCategory?.name?.toLowerCase() || 'тверде паливо'} <span style={{ color: 'var(--c-orange)' }}>вже сьогодні</span>
                    </h2>
                    <p style={{ color: 'var(--c-text2)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
                        Доставка по Києву можлива вже сьогодні. Чесний об'єм та гарантія якості від виробника.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={onQuickOrderClick} className="nh-btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                            Замовити {activeCategory?.name?.toLowerCase() || ''}
                        </button>
                        <a href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="nh-btn-ghost" style={{ padding: '16px 32px', fontSize: '1rem', border: '1px solid var(--color-border-medium)' }}>
                            <Phone size={18} style={{ marginRight: 8 }} /> Подзвонити
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── MAIN FIREWOOD CATEGORY COMPONENT ────────────────────────
export default function FirewoodCategoryPage({ products, seo, onOrderProduct, activeCategory, activeCategorySlug }) {

    // We import DeliverySection and BenefitsSection from new-home
    // Since creating them here duplicates too much code, let's just 
    // mock them or re-import them if we can't.
    // Actually, since I'm placing this file in frontend/src/components/
    // Let's assume this component lives inside `frontend/src/components/FirewoodCategoryPage.jsx`
    // and imports DeliverySection and BenefitsSection from `./new-home/...`.

    return (
        <div className="new-home-scope">
            <HeroCategory
                onQuickOrderClick={() => onOrderProduct(null)}
                activeCategory={activeCategory}
                activeCategorySlug={activeCategorySlug}
            />

            <CategoryProducts
                products={products}
                onOrderProduct={onOrderProduct}
                activeCategory={activeCategory}
            />

            <FuelCalculatorSection onQuickOrderClick={() => onOrderProduct(null)} />

            {/* Delivery and Benefits from existing NewHome */}
            <DeliverySection />
            <BenefitsSection />

            {/* SEO Text Block */}
            {activeCategorySlug === 'firewood' ? (
                <FirewoodSeoBlock />
            ) : (
                <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--s-section) 1.5rem' }}>
                    <h2 className="h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        {activeCategory?.seo_h1 || `Купити ${activeCategory?.name?.toLowerCase() || 'тверде паливо'} у Києві`}
                    </h2>
                    <div
                        style={{ maxWidth: 900, margin: '0 auto', color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem' }}
                        dangerouslySetInnerHTML={{
                            __html: activeCategory?.seo_text || `
                            <p>Якісне тверде паливо для опалення будинків, котлів та камінів.</p>
                            <p>Ми гарантуємо чесний об'єм та швидку доставку по Києву та всій Київській області. Оплата здійснюється тільки після отримання та перевірки на місці — жодних передоплат і ризиків. Доставка можлива день у день!</p>
                            `
                        }}
                    />
                </section>
            )}

            <PopularQueriesSection activeCategorySlug={activeCategorySlug} />

            <FaqSection />

            <FinalCtaBanner onQuickOrderClick={() => onOrderProduct(null)} activeCategory={activeCategory} />
        </div>
    );
}

// ─── CUSTOM FIREWOOD SEO BLOCK ─────────────────────────────────
function FirewoodSeoBlock() {
    return (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--s-section) 1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div className="nh-card" style={{ maxWidth: 900, width: '100%', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
                <h2 className="h2" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    Купити дрова у Києві
                </h2>

                <div style={{ maxWidth: 600, margin: '0 auto', color: 'var(--c-text2)', lineHeight: 1.8, fontSize: '1.05rem', width: '100%' }}>
                    <p style={{ marginBottom: '1rem' }}>
                        Купити дрова з доставкою по Києву та Київській області можна безпосередньо у постачальника. Компанія «КиївБрикет» пропонує колоті дрова різних порід дерева для ефективного опалення приватних будинків, котлів та камінів.
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Ми доставляємо дрова дуба, граба, сосни, берези та вільхи. Усі дрова мають низьку вологість та високу тепловіддачу.
                    </p>

                    <h3 style={{ color: 'var(--c-text)', fontSize: '1.125rem', marginBottom: '1rem', fontWeight: '600' }}>
                        Популярні породи дров:
                    </h3>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {[
                            'дубові дрова',
                            'грабові дрова',
                            'березові дрова',
                            'соснові дрова',
                            'вільхові дрова'
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Flame size={14} color="var(--c-orange)" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Internal Links Block */}
                    <div style={{
                        paddingTop: '1.5rem',
                        borderTop: '1px solid var(--color-border-subtle)',
                        display: 'flex', flexDirection: 'column', gap: '1rem'
                    }}>
                        <h4 style={{ color: 'var(--c-text)', fontSize: '1.05rem', margin: 0, fontWeight: '600' }}>Також дивіться:</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <Link to="/catalog/briquettes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-orange)', textDecoration: 'none', fontWeight: 500 }}>
                                <span>→</span> Паливні брикети
                            </Link>
                            <Link to="/catalog/coal" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-orange)', textDecoration: 'none', fontWeight: 500 }}>
                                <span>→</span> Кам’яне вугілля
                            </Link>
                            <Link to="/delivery" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-orange)', textDecoration: 'none', fontWeight: 500 }}>
                                <span>→</span> Доставка по Києву
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── POPULAR QUERIES (GRID) ────────────────────────────────────
function PopularQueriesSection({ activeCategorySlug }) {
    if (activeCategorySlug !== 'firewood') return null;

    const queries = [
        "Купити дрова Київ",
        "Дрова дубові Київ",
        "Дрова колоті Київ",
        "Дрова машина Київ",
        "Дрова складометр Київ"
    ];

    return (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem var(--s-section) 1.5rem' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                <h3 className="h3" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Популярні запити</h3>
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem'
                }}>
                    {queries.map((q, i) => (
                        <Link
                            key={i}
                            to="/catalog/firewood"
                            className="popular-link"
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '40px',
                                color: 'var(--c-text2)',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(249,115,22,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)';
                                e.currentTarget.style.color = 'var(--c-orange)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.color = 'var(--c-text2)';
                            }}
                        >
                            {q}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
