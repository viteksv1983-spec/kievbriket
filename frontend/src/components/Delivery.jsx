import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Store, Clock, CreditCard, ArrowRight, CheckCircle2, ChevronRight, Flame } from 'lucide-react';
import SEOHead from './SEOHead';
import shopConfig from '../shop.config';
import { OrderFormModal } from './new-home/OrderFormModal';
import { DeliverySection } from './new-home/DeliverySection';

function Delivery() {
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    const methods = [
        {
            Icon: Truck,
            title: 'Газель',
            desc: 'до 6 складометрів',
            price: 'від 600 грн',
            sub: 'Популярний вибір',
            highlight: true,
        },
        {
            Icon: Package,
            title: 'ЗІЛ / Камаз',
            desc: 'до 15 складометрів',
            price: 'від 1 200 грн',
            sub: 'Для великих замовлень',
            highlight: false,
        },
        {
            Icon: Store,
            title: 'Самовивіз',
            desc: shopConfig.contact.address,
            price: 'Безкоштовно',
            sub: 'Зі складу в Києві',
            highlight: false,
        },
    ];

    const details = [
        { Icon: Clock, title: 'Час доставки', text: 'Зазвичай наступного дня. У день замовлення — за наявністю вільного транспорту.' },
        { Icon: Package, title: "Об'єм", text: "Дрова доставляються щільно укладеними складометрами — чесний об'єм перевіряється перед розвантаженням." },
        { Icon: CheckCircle2, title: 'Вивантаження', text: 'Базова ціна включає вивантаження біля машини. Складання в дровітню — окремо.' },
        { Icon: CreditCard, title: 'Оплата', text: "Готівкою або на картку — після перевірки об'єму та якості при доставці. Без передоплати." },
    ];

    const zones = [
        { zone: 'Київ (Правий берег)', price: 'від 600 грн', areas: 'Голосіївський, Печерський, Святошинський, Солом\'янський, Шевченківський, Оболонський, Подільський' },
        { zone: 'Київ (Лівий берег)', price: 'від 700 грн', areas: 'Дарницький, Деснянський, Дніпровський' },
        { zone: 'Передмістя (до 15 км)', price: 'від 900 грн', areas: 'Вишневе, Крюківщина, Боярка, Ірпінь, Буча, Вишгород, Бровари' },
        { zone: 'Область (до 40 км)', price: 'від 1 500 грн', areas: 'Обухів, Васильків, Бориспіль, Макарів' },
    ];

    return (
        <div
            className="new-home-scope"
            style={{
                minHeight: '100vh',
                background: 'var(--c-bg)',
                color: 'var(--c-text)',
                fontFamily: 'var(--font-outfit)',
            }}
        >
            <SEOHead
                title={`Доставка дров | ${shopConfig.name}`}
                description="Швидка доставка колотих дров по Києву та Київській області. Власний автопарк вантажівок, чесний об'єм. Від 600 грн."
            />

            {/* ── Hero ── */}
            <section style={{
                position: 'relative',
                overflow: 'hidden',
                padding: 'calc(var(--s-section) * 0.75) 0 calc(var(--s-section) * 0.65)',
                background: 'var(--color-bg-deep)',
                borderBottom: '1px solid var(--color-border-subtle)',
            }}>
                <div style={{
                    position: 'absolute', top: -80, right: -160,
                    width: 560, height: 420,
                    background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--s-element)', fontSize: '0.8125rem', color: 'var(--c-text2)' }}>
                        <Link to="/" style={{ color: 'var(--c-text2)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = 'var(--c-orange)'}
                            onMouseLeave={e => e.target.style.color = 'var(--c-text2)'}
                        >Головна</Link>
                        <ChevronRight size={13} style={{ opacity: 0.4 }} />
                        <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>Доставка</span>
                    </nav>

                    <div className="nh-badge" style={{ marginBottom: 'var(--s-tight)', display: 'inline-flex' }}>
                        <Truck size={13} /> Власний автопарк
                    </div>

                    <h1 className="h2 fade-up" style={{ marginBottom: 'var(--s-tight)', marginTop: 'var(--s-tight)' }}>
                        Доставка дров<br />
                        <span style={{ color: 'var(--c-orange)' }}>по Києву та області</span>
                    </h1>
                    <p className="body fade-up fade-up-d1" style={{ maxWidth: 520 }}>
                        Оперативна доставка власним транспортом. Чесний об'єм та гарантія якості без посередників.
                    </p>
                </div>
            </section>

            {/* ── Delivery Methods ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--s-section) 1.5rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--s-header)' }}>
                    <p className="section-label" style={{ marginBottom: 'var(--s-tight)' }}>Способи доставки</p>
                    <h2 className="h2">Оберіть зручний варіант</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>
                    {methods.map(({ Icon, title, desc, price, sub, highlight }) => (
                        <div
                            key={title}
                            className="nh-card"
                            style={{
                                padding: '1.75rem 1.5rem',
                                textAlign: 'center',
                                position: 'relative',
                                border: highlight ? '1px solid var(--color-border-orange)' : '1px solid var(--color-border-subtle)',
                            }}
                        >
                            {highlight && (
                                <div style={{
                                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    color: '#fff', borderRadius: 999, padding: '3px 14px',
                                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                    whiteSpace: 'nowrap',
                                }}>Популярно</div>
                            )}
                            <div style={{
                                width: 52, height: 52, borderRadius: '50%',
                                background: 'var(--color-accent-soft)',
                                border: '1px solid rgba(249,115,22,0.20)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--s-element)',
                            }}>
                                <Icon size={22} color="var(--c-orange)" />
                            </div>
                            <h3 className="h3" style={{ marginBottom: 6 }}>{title}</h3>
                            <p className="body-sm" style={{ marginBottom: 'var(--s-element)' }}>{desc}</p>
                            <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--c-orange)', marginBottom: 4 }}>{price}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--c-text2)' }}>{sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Delivery Details ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--s-section) 1.5rem 0' }}>
                <div className="nh-card" style={{ padding: '2rem 2.5rem' }}>
                    <h2 className="h2" style={{ marginBottom: 'var(--s-block)' }}>Особливості доставки</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
                        {details.map(({ Icon, title, text }) => (
                            <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                                    background: 'var(--color-accent-soft)',
                                    border: '1px solid rgba(249,115,22,0.20)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={18} color="var(--c-orange)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--c-text)', marginBottom: 4 }}>{title}</h3>
                                    <p className="body-sm">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Delivery Map section (reuse from homepage) ── */}
            <DeliverySection />

            {/* ── Zones Table ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem var(--s-section)' }}>
                <h2 className="h2" style={{ textAlign: 'center', marginBottom: 'var(--s-block)' }}>
                    Зони та вартість <span style={{ color: 'var(--c-orange)' }}>(Газель)</span>
                </h2>
                <div className="nh-card" style={{ overflow: 'hidden', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                {['Зона', 'Вартість доставки', 'Райони / Населені пункти'].map(h => (
                                    <th key={h} style={{
                                        padding: '1rem 1.5rem', textAlign: 'left',
                                        fontSize: '0.7rem', fontWeight: 700, color: 'var(--c-orange)',
                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {zones.map((row, i) => (
                                <tr key={i} style={{
                                    borderBottom: i < zones.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                                    transition: 'background 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.04)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--c-text)', whiteSpace: 'nowrap' }}>{row.zone}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: 'var(--c-orange)', whiteSpace: 'nowrap' }}>{row.price}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--c-text2)', fontSize: '0.875rem' }}>{row.areas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--c-text2)', textAlign: 'center', marginTop: '1rem', opacity: 0.7 }}>
                    * Остаточна вартість розраховується індивідуально диспетчером залежно від точної відстані.
                </p>
            </section>

            {/* ── CTA Banner ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem var(--s-section)' }}>
                <div style={{
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(234,88,12,0.06) 100%)',
                    border: '1px solid var(--color-border-orange)',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                }}>
                    <h2 className="h2" style={{ marginBottom: '0.75rem' }}>
                        Розрахувати точну вартість?
                    </h2>
                    <p className="body" style={{ maxWidth: 480, margin: '0 auto var(--s-block)' }}>
                        Зателефонуйте або залиште заявку — ми розрахуємо ціну з урахуванням доставки до вашого будинку.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                        <a
                            href={`tel:${shopConfig.contact.phone.replace(/\D/g, '')}`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                color: 'var(--c-orange)', fontWeight: 700, fontSize: '1.125rem',
                                textDecoration: 'none',
                            }}
                        >
                            📞 {shopConfig.contact.phone}
                        </a>
                        <button
                            onClick={() => setIsOrderFormOpen(true)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
                                border: 'none', borderRadius: 10, padding: '14px 28px',
                                cursor: 'pointer', boxShadow: '0 4px 18px rgba(249,115,22,0.25)',
                                transition: 'box-shadow 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 26px rgba(249,115,22,0.45)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(249,115,22,0.25)'}
                        >
                            Залишити заявку <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            <OrderFormModal isOpen={isOrderFormOpen} onClose={() => setIsOrderFormOpen(false)} />
        </div>
    );
}

export default Delivery;
