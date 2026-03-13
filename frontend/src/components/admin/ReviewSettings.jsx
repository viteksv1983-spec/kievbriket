import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiCheck, FiTrash2, FiEdit2, FiPlus, FiVideo, FiMessageSquare } from 'react-icons/fi';

export default function ReviewSettings() {
    const { token } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Form state
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        date: '',
        stars: 5,
        text: '',
        youtube_url: '',
        is_active: true,
        sort_order: 0
    });

    useEffect(() => {
        if (token) fetchReviews();
    }, [token]);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/admin/reviews', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleEdit = (review) => {
        setEditingId(review.id);
        setFormData({
            name: review.name,
            city: review.city || '',
            date: review.date || '',
            stars: review.stars,
            text: review.text,
            youtube_url: review.youtube_url || '',
            is_active: review.is_active,
            sort_order: review.sort_order
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Видалити цей відгук?')) return;
        try {
            await api.delete(`/admin/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReviews();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await api.patch(`/admin/reviews/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ type: 'success', text: 'Відгук оновлено!' });
            } else {
                await api.post('/admin/reviews', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ type: 'success', text: 'Відгук додано!' });
            }
            fetchReviews();
            resetForm();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Помилка збереження' });
        }
        setSaving(false);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '', city: '', date: '', stars: 5, text: '', youtube_url: '', is_active: true, sort_order: 0
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900 }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                        💬 Відгуки
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Керування текстовими відгуками та відеовідгуками клієнтів.
                    </p>
                </div>
            </div>

            {message && (
                <div style={{
                    padding: '12px 16px', borderRadius: 12, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8,
                    background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: message.type === 'success' ? '#15803d' : '#dc2626',
                    border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                    <FiCheck /> {message.text}
                </div>
            )}

            {/* Form */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {editingId ? <><FiEdit2 /> Редагувати відгук</> : <><FiPlus /> Додати відгук</>}
                </h2>
                <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Ім'я клієнта *</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="form-input" placeholder="Олена Ковальчук" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Місто / Локація</label>
                        <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                            className="form-input" placeholder="Київ, Оболонь" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Дата</label>
                        <input type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="form-input" placeholder="Жовтень 2024" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Оцінка (Зірки)</label>
                        <select value={formData.stars} onChange={e => setFormData({ ...formData, stars: Number(e.target.value) })}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }}>
                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ⭐️</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Сортування</label>
                        <input type="number" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                            className="form-input" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Текст відгуку *</label>
                        <textarea required value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })}
                            rows={4} className="form-input" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiVideo color="#f97316" /> Посилання на відео YouTube (опціонально)
                        </label>
                        <input type="url" value={formData.youtube_url} onChange={e => setFormData({ ...formData, youtube_url: e.target.value })}
                            className="form-input" placeholder="https://youtube.com/shorts/... або https://youtu.be/..."
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>Якщо вказано посилання, над відгуком з'явиться відео.</p>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                        <label htmlFor="isActive" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Показувати на сайті</label>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12, marginTop: '1rem' }}>
                        <button type="submit" disabled={saving} style={{ background: '#f97316', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Збереження...' : (editingId ? 'Оновити' : 'Створити')}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                                Скасувати
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {reviews.map(r => (
                    <div key={r.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{r.name}</h3>
                                {r.stars && <span style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: 600 }}>{r.stars} ⭐️</span>}
                                {!r.is_active && <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>Приховано</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', marginBottom: 12, lineHeight: 1.5 }}>"{r.text}"</p>
                            <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: '#6b7280' }}>
                                {r.city && <span>📍 {r.city}</span>}
                                {r.date && <span>📅 {r.date}</span>}
                                {r.youtube_url && <span style={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><FiVideo /> Є відео</span>}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <button onClick={() => handleEdit(r)} style={{ background: '#f3f4f6', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', color: '#4b5563' }} title="Редагувати">
                                <FiEdit2 />
                            </button>
                            <button onClick={() => handleDelete(r.id)} style={{ background: '#fee2e2', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', color: '#dc2626' }} title="Видалити">
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
