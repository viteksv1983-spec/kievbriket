import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/urls';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

import { useCategories } from '../../context/CategoryContext';

const WEIGHT_OPTIONS = [
    { value: 400, label: '400 г (Бенто)' },
    { value: 500, label: '500 г' },
    { value: 600, label: '600 г' },
    { value: 800, label: '800 г' },
    { value: 1000, label: '1 кг' },
    { value: 1500, label: '1.5 кг' },
    { value: 2000, label: '2 кг' },
    { value: 2500, label: '2.5 кг' },
    { value: 3000, label: '3 кг' },
    { value: 4000, label: '4 кг' },
    { value: 5000, label: '5 кг' }
];

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { categories } = useCategories();
    const isNew = !id || id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [activeTab, setActiveTab] = useState('content'); // 'content' or 'seo'

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        price: '',
        description: '',
        weight: '',
        image_url: '',
        is_available: true,
        is_deleted: false,
        variants: [],
        // SEO
        meta_title: '',
        meta_description: '',
        h1_heading: '',
        meta_keywords: '',
        canonical_url: ''
    });

    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setFormData({
                    ...response.data,
                    // Ensure fields are not null for inputs
                    slug: response.data.slug || '',
                    description: response.data.description || '',
                    weight: response.data.weight || '',
                    category: response.data.category || '',
                    image_url: response.data.image_url || '',
                    variants: response.data.variants || [],
                    meta_title: response.data.meta_title || '',
                    meta_description: response.data.meta_description || '',
                    h1_heading: response.data.h1_heading || '',
                    meta_keywords: response.data.meta_keywords || '',
                    canonical_url: response.data.canonical_url || ''
                });
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, isNew]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({ ...prev, variants: [...prev.variants, { name: '', price: '' }] }));
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const removeVariant = (index) => {
        setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert numbers to correct types and cleanup variants
            const cleanedVariants = formData.variants
                .filter(v => v.name.trim() !== '')
                .map(v => ({ name: v.name.trim(), price: parseFloat(v.price) || 0 }));

            const dataToSave = {
                ...formData,
                price: parseFloat(formData.price),
                weight: formData.weight ? parseFloat(formData.weight) : null,
                variants: cleanedVariants.length > 0 ? cleanedVariants : null
            };

            if (isNew) {
                await api.post('/products/', dataToSave, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Товар додано!');
            } else {
                await api.patch(`/products/${id}`, dataToSave, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Товар оновлено!');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error("Failed to save product", error);
            const detail = error.response?.data?.detail;
            const errorMsg = Array.isArray(detail) ? detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join('\n') : (typeof detail === 'string' ? detail : 'Помилка збереження');
            alert(errorMsg);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-full">
                    <FiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">{isNew ? 'Додавання нового товару' : `Редагування товару: ${formData.name}`}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 flex justify-center py-3 md:py-4 text-[10px] md:text-sm font-bold uppercase tracking-wider text-center ${activeTab === 'content' ? 'bg-gray-50 text-amber-700 border-b-2 border-amber-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Основна інформація
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('seo')}
                        className={`flex-1 flex justify-center py-3 md:py-4 text-[10px] md:text-sm font-bold uppercase tracking-wider text-center ${activeTab === 'seo' ? 'bg-gray-50 text-amber-700 border-b-2 border-amber-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        SEO Налаштування
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {activeTab === 'content' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Назва</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">URL slug (авто з назви якщо пусто)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="napryklad-drova"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ціна (грн)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={formData.is_available}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                </label>
                                <span className="text-sm font-bold text-gray-700">Відображати на сайті (В наявності)</span>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Опис</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Категорія</label>
                                    <div className="flex gap-2 items-center">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent cursor-pointer"
                                        >
                                            <option value="">Оберіть категорію</option>
                                            {categories.map(cat => (
                                                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin/categories')}
                                            className="shrink-0 px-3 py-2 text-sm font-bold text-antreme-red border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                                        >
                                            + Додати
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Варіанти товару (Фасування / Види)</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Якщо товар має декілька видів (наприклад: "В ящиках 2 склм" за 4000 грн, "Рубані" за 2000 грн). Базова ціна вище буде використовуватися як ціна "від".
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="px-4 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg text-sm font-bold shadow-sm hover:bg-orange-100 transition-colors"
                                    >
                                        + Додати варіант
                                    </button>
                                </div>

                                {formData.variants.length > 0 ? (
                                    <div className="space-y-3">
                                        {formData.variants.map((variant, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 bg-white border border-orange-200 rounded-lg shadow-sm">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Назва варіанту</label>
                                                    <input
                                                        type="text"
                                                        value={variant.name}
                                                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                        placeholder='напр: "Рубані"'
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                                <div className="w-32">
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Ціна (грн)</label>
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                                        placeholder="2000"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="mt-6 px-3 py-2 text-red-500 border border-red-200 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-sm text-gray-400 bg-white bg-opacity-50 rounded-lg border border-dashed border-gray-300">
                                        Не додано жодного варіанту. Цей товар не матиме вибору фасування.
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Зображення товару</label>
                                <div className="flex flex-col gap-4">
                                    {formData.image_url && (
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                                <img
                                                    src={getImageUrl(formData.image_url, api.defaults.baseURL)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                                className="px-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Видалити фото
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={handleChange}
                                                placeholder="Вставте посилання або завантажте файл"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent mb-2"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    const uploadData = new FormData();
                                                    uploadData.append('file', file);

                                                    try {
                                                        const response = await api.post('/admin/upload', uploadData, {
                                                            headers: {
                                                                'Content-Type': 'multipart/form-data',
                                                                'Authorization': `Bearer ${token}`
                                                            }
                                                        });
                                                        setFormData(prev => ({ ...prev, image_url: response.data.image_url }));
                                                    } catch (error) {
                                                        console.error("Upload failed", error);
                                                        const detail = error.response?.data?.detail;
                                                        alert("Помилка завантаження файлу: " + (typeof detail === 'string' ? detail : "Перевірте підключення або спробуйте увійти знову"));
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-red-700 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-6">
                            {/* SEO Auto-fill Button */}
                            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const name = formData.name || '';
                                        const slug = formData.slug || '';
                                        const cat = formData.category || 'drova';
                                        if (!name) { alert('Спочатку заповніть назву товару!'); return; }
                                        setFormData(prev => ({
                                            ...prev,
                                            meta_title: prev.meta_title || `Купити ${name.toLowerCase()} з доставкою по Києву — ціна за складометр | КиївБрикет`,
                                            meta_description: prev.meta_description || `${name} купити в Києві з доставкою. Чесний складометр, швидка доставка по Києву та області. Власний автопарк: ГАЗель, ЗІЛ, КАМАЗ.`,
                                            h1_heading: prev.h1_heading || `${name} з доставкою по Києву`,
                                            canonical_url: prev.canonical_url || `/catalog/${cat}/${slug}`,
                                            meta_keywords: prev.meta_keywords || 'дрова київ, купити дрова, доставка дров, дрова складометр, дрова для опалення'
                                        }));
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                    🔧 Автозаповнення SEO
                                </button>
                                <p className="text-xs text-blue-700 m-0">
                                    Заповнить порожні SEO поля на основі назви товару. Вже заповнені поля НЕ будуть перезаписані.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Meta Title (Заголовок вкладки)</label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                    placeholder="Купити дрова Київ..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Рекомендована довжина: 50-60 символів.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description (Опис для Google)</label>
                                <textarea
                                    name="meta_description"
                                    rows="3"
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    placeholder="Якісні дрова на замовлення..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Рекомендована довжина: 150-160 символів.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">H1 Заголовок</label>
                                <input
                                    type="text"
                                    name="h1_heading"
                                    value={formData.h1_heading}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Keywords (Ключові слова)</label>
                                <input
                                    type="text"
                                    name="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Canonical URL</label>
                                <input
                                    type="text"
                                    name="canonical_url"
                                    value={formData.canonical_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full md:w-auto bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all font-bold shadow-md shadow-orange-200 active:scale-95"
                    >
                        <FiSave className="w-5 h-5" />
                        <span>{isNew ? 'Додати товар' : 'Зберегти зміни'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
