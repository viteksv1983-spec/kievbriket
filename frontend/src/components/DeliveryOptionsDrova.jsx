import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function DeliveryOptionsDrova() {
    const [transportData, setTransportData] = useState([]);

    useEffect(() => {
        api.get('/api/site-settings/delivery')
            .then(res => setTransportData(res.data?.delivery_transport || []))
            .catch(() => { });
    }, []);
    const cardPad = { padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: '20px' };

    const getImgUrl = (filename) => {
        // Direct absolute path since this is rendered on both client and server 
        // using the public directory assets
        return `/images/delivery/${filename}`;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* ── SECTION 1: DELIVERY VEHICLES BLOCK ── */}
            <div className="nh-card" style={{ ...cardPad, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)' }}>
                <h2 className="h2" style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
                    Варіанти доставки дров (доставка дров Київ)
                </h2>
                <p style={{ color: 'var(--c-text2)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Швидка та надійна <strong>доставка дров (Київ та Київська область)</strong>. Ми доставляємо власним транспортом, тому тип автомобіля підбирається залежно від обсягу вашого замовлення.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem'
                }}>
                    {(transportData || []).filter(v => v.category === 'standard' && v.image).map((v, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                                e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                            }}
                        >
                            <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)', padding: '1rem' }}>
                                <img
                                    src={v.image}
                                    alt={`Доставка дров машиною ${v.type} Київ`}
                                    width="200" height="113"
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '0.25rem' }}>{v.type}</h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--c-text2)', fontWeight: 600, marginBottom: '0.5rem' }}>Обсяг: <span style={{ color: 'var(--c-text)' }}>{v.vol}</span></div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--c-text2)', lineHeight: 1.4, flex: 1, margin: 0, marginBottom: '0.75rem' }}>{v.desc}</p>
                                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--c-orange)' }}>{v.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SECTION 2: SPECIAL UNLOADING EQUIPMENT ── */}
            <div className="nh-card" style={{ ...cardPad, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)' }}>
                <h2 className="h2" style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
                    Спецтехніка для розвантаження дров
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem'
                }}>
                    {(transportData || []).filter(v => v.category === 'special' && v.image).map((eq, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border-subtle)',
                            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                                e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                            }}
                        >
                            <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)', padding: '1rem' }}>
                                <img
                                    src={eq.image}
                                    alt={`Спецтехніка ${eq.type} для розвантаження дров Київ`}
                                    width="200" height="113"
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '0.5rem' }}>{eq.type}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--c-text2)', lineHeight: 1.4, flex: 1, margin: 0, marginBottom: '0.75rem' }}>{eq.desc}</p>
                                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--c-orange)' }}>{eq.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SECTION 3: SEO DELIVERY TEXT ── */}
            <div className="nh-card" style={{ padding: '2rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '20px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-text)', marginBottom: '1.25rem' }}>
                    Доставка дров по Києву
                </h2>
                <div style={{ color: 'var(--c-text2)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <p style={{ marginBottom: '1rem' }}>
                        Компанія КиївДрова здійснює доставку колотих дров по Києву та Київській області власним транспортом.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        Ми використовуємо різні типи автомобілів залежно від обсягу замовлення: ГАЗель, ЗІЛ або КАМАЗ.
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Для великих замовлень або складних умов розвантаження доступна спеціальна техніка: кран-маніпулятор або автомобілі з гідробортом.
                    </p>
                    <p style={{ margin: 0 }}>
                        Детальні умови доставки дивіться на сторінці: <Link to="/dostavka" style={{ color: 'var(--c-orange)', textDecoration: 'none', fontWeight: 600 }}>доставка дров по Києву</Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
