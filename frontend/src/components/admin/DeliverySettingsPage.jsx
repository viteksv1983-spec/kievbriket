import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FiSave, FiCheck, FiPlus, FiTrash2, FiTruck } from 'react-icons/fi';

const DEFAULT_TRANSPORT = [
    { type: 'ГАЗель (бус)', vol: '4–5 складометрів', price: '1 500 грн', desc: 'Швидка доставка невеликих замовлень', category: 'standard', image: '/images/delivery/gazel-dostavka-driv-kyiv.webp' },
    { type: 'ЗІЛ самоскид', vol: '4 складометри', price: '3 000 грн', desc: 'Оптимально для приватних будинків', category: 'standard', image: '/images/delivery/zil-dostavka-driv-kyiv.webp' },
    { type: 'КАМАЗ самоскид', vol: '8 складометрів', price: '4 000 грн', desc: 'Великі обсяги палива', category: 'standard', image: '/images/delivery/kamaz-dostavka-driv-kyiv.webp' },
    { type: 'Кран-маніпулятор', vol: 'Складні умови', price: 'від 4 500 грн', desc: 'Для розвантаження у складних умовах', category: 'special', image: '/images/delivery/manipulator-dostavka-kyiv.webp' },
    { type: 'Гідроборт / рокла', vol: 'Складні умови', price: 'від 4 500 грн', desc: 'Для розвантаження палет', category: 'special', image: '/images/delivery/gidrobort-rokla-dostavka-kyiv.webp' },
    { type: 'Фура', vol: '22–24 складометри', price: 'за домовленістю', desc: 'Поставка напряму з лісгоспу', category: 'table_only', image: '' },
];

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#fff',
};

const cardStyle = {
    background: '#f9fafb',
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    marginBottom: '1rem',
    position: 'relative',
};

const labelStyle = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

function DeliverySettingsPage() {
    const [transportItems, setTransportItems] = useState(DEFAULT_TRANSPORT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        api.get('/admin/site-settings', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                const d = res.data;
                if (d.delivery_transport) {
                    try {
                        const parsed = JSON.parse(d.delivery_transport);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setTransportItems(parsed);
                        }
                    } catch { /* keep defaults */ }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/admin/site-settings', {
                delivery_transport: JSON.stringify(transportItems.filter(t => t.type.trim())),
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage({ type: 'success', text: 'Збережено!' });
            setTimeout(() => setMessage(null), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Помилка збереження' });
        }
        setSaving(false);
    };

    const updateItem = (index, field, value) => {
        setTransportItems(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t));
    };

    const addItem = () => {
        setTransportItems(prev => [...prev, { type: '', vol: '', price: '', desc: '', category: 'standard', image: '' }]);
    };

    const removeItem = (index) => {
        setTransportItems(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ width: 24, height: 24, border: '3px solid #e5e7eb', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800 }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                    🚚 Налаштування доставки
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Таблиця "Транспорт для доставки" на сторінці доставки. Додавайте, редагуйте або видаляйте транспортні засоби.
                </p>
            </div>

            {message && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: message.type === 'success' ? '#15803d' : '#dc2626',
                    border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                    <FiCheck style={{ flexShrink: 0 }} />
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave}>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: 16, border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Транспортні засоби</h2>
                        <button
                            type="button"
                            onClick={addItem}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '8px 14px', borderRadius: 8,
                                border: '1px solid #d1d5db', background: '#fff',
                                fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                                color: '#374151', fontFamily: 'inherit',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <FiPlus size={14} /> Додати авто
                        </button>
                    </div>

                    {transportItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 12 }}>
                            <FiTruck size={24} style={{ marginBottom: 12, opacity: 0.5 }} />
                            <p>Немає доданих автомобілів.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {transportItems.map((item, i) => (
                                <div key={i} style={cardStyle}>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(i)}
                                        style={{
                                            position: 'absolute', top: '1.25rem', right: '1.25rem',
                                            width: 32, height: 32, borderRadius: 8,
                                            border: '1px solid #fecaca', background: '#fef2f2',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: '#dc2626',
                                            transition: 'background 0.2s'
                                        }}
                                        title="Видалити"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem', marginBottom: '1.25rem', paddingRight: '3rem' }}>
                                        <div>
                                            <label style={labelStyle}>Тип машини (Назва)</label>
                                            <input
                                                type="text"
                                                value={item.type}
                                                onChange={(e) => updateItem(i, 'type', e.target.value)}
                                                placeholder="напр., ГАЗель"
                                                style={inputStyle}
                                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Обсяг</label>
                                            <input
                                                type="text"
                                                value={item.vol}
                                                onChange={(e) => updateItem(i, 'vol', e.target.value)}
                                                placeholder="напр., 4–5 складометрів"
                                                style={inputStyle}
                                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Ціна доставки</label>
                                            <input
                                                type="text"
                                                value={item.price}
                                                onChange={(e) => updateItem(i, 'price', e.target.value)}
                                                placeholder="напр., від 1500 грн"
                                                style={inputStyle}
                                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem', paddingRight: '3rem' }}>
                                        <div>
                                            <label style={labelStyle}>Особливості / Опис</label>
                                            <input
                                                type="text"
                                                value={item.desc}
                                                onChange={(e) => updateItem(i, 'desc', e.target.value)}
                                                placeholder="напр., Швидка доставка невеликих замовлень"
                                                style={inputStyle}
                                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Категорія</label>
                                            <select
                                                value={item.category || 'standard'}
                                                onChange={(e) => updateItem(i, 'category', e.target.value)}
                                                style={inputStyle}
                                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                            >
                                                <option value="standard">Стандартний транспорт</option>
                                                <option value="special">Спецтехніка (Маніпулятор/Рокла)</option>
                                                <option value="table_only">Тільки таблиця (без фото)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Зображення (URL або шлях)</label>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                {item.image && (
                                                    <img src={item.image} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                                                )}
                                                <input
                                                    type="text"
                                                    value={item.image || ''}
                                                    onChange={(e) => updateItem(i, 'image', e.target.value)}
                                                    placeholder="напр., /images/delivery/zil.webp"
                                                    style={inputStyle}
                                                    onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save button */}
                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 28px',
                        background: saving ? '#d1d5db' : '#f97316',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
                        fontFamily: 'inherit'
                    }}
                >
                    <FiSave size={16} />
                    {saving ? 'Збереження...' : 'Зберегти зміни'}
                </button>
            </form>
        </div>
    );
}

export default DeliverySettingsPage;
