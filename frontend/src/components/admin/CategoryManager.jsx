import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../context/CategoryContext';
import { FiUpload, FiCheck, FiX, FiPlus, FiTrash2, FiEdit2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function CategoryManager() {
    const { token } = useAuth();
    const { categories, refetchCategories } = useCategories();
    // Using local state to manage the list before contextual refresh
    const [localCategories, setLocalCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingSlug, setUploadingSlug] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Form state for Add/Edit
    const emptyForm = { slug: '', name: '', description: '', seo_text: '', meta_title: '', meta_description: '', seo_h1: '', og_title: '', og_description: '', og_image: '', is_indexable: true, canonical_url: '' };
    const [formData, setFormData] = useState(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSeo, setShowSeo] = useState(false);

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (!loading && localCategories.length > 0) {
            const editSlug = searchParams.get('edit');
            const isNew = searchParams.get('new') === 'true';

            if (isNew && editingCategory !== 'new') {
                openCreateModal();
            } else if (editSlug) {
                const cat = localCategories.find(c => c.slug === editSlug);
                if (cat && (!editingCategory || editingCategory.slug !== editSlug)) {
                    openEditModal(cat);
                }
            } else if (!isNew && !editSlug && editingCategory) {
                setEditingCategory(null);
            }
        }
    }, [searchParams, loading, localCategories]);

    const closeModals = () => {
        setEditingCategory(null);
        setSearchParams({});
    };

    const fetchMetadata = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/categories/metadata');
            setLocalCategories(response.data);
            if (refetchCategories) refetchCategories();
        } catch (error) {
            console.error("Failed to fetch category metadata", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (slug, file) => {
        setUploadingSlug(slug);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const uploadRes = await api.post('/admin/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            const imageUrl = uploadRes.data.image_url;

            // Update metadata
            await api.patch(`/admin/categories/metadata/${slug}`, { image_url: imageUrl }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            fetchMetadata();
            alert('Зображення оновлено!');
        } catch (error) {
            console.error("Upload failed", error);
            alert('Помилка завантаження. Спробуйте інше фото.');
        } finally {
            setUploadingSlug(null);
        }
    };

    const handleDelete = async (slug) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю категорію? Усі товари в цій категорії залишаться, але не будуть мати прив'язки до неї.")) return;
        try {
            await api.delete(`/admin/categories/metadata/${slug}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchMetadata();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Не вдалося видалити категорію.");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Normalize canonical_url
            const payload = { ...formData };
            if (payload.canonical_url) {
                let url = payload.canonical_url.trim();
                if (url && !url.startsWith('http') && !url.startsWith('/')) {
                    url = '/' + url;
                }
                if (url && !url.endsWith('/') && !url.includes('?')) {
                    url += '/';
                }
                payload.canonical_url = url;
            }
            if (editingCategory) {
                await api.patch(`/admin/categories/metadata/${editingCategory.slug}`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await api.post(`/admin/categories/metadata`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            closeModals();
            setFormData(emptyForm);
            setShowSeo(false);
            fetchMetadata();
        } catch (error) {
            console.error("Submit failed", error);
            alert("Помилка збереження. Перевірте, чи slug унікальний.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (cat) => {
        setFormData({
            slug: cat.slug,
            name: cat.name,
            description: cat.description || '',
            seo_text: cat.seo_text || '',
            meta_title: cat.meta_title || '',
            meta_description: cat.meta_description || '',
            seo_h1: cat.seo_h1 || '',
            og_title: cat.og_title || '',
            og_description: cat.og_description || '',
            og_image: cat.og_image || '',
            is_indexable: cat.is_indexable !== false,
            canonical_url: cat.canonical_url || '',
        });
        const hasSeo = cat.meta_title || cat.meta_description || cat.seo_h1 || cat.og_title || cat.canonical_url;
        setShowSeo(!!hasSeo);
        setEditingCategory(cat);
    };

    const openCreateModal = () => {
        setFormData(emptyForm);
        setShowSeo(false);
        setEditingCategory('new');
    };

    const getCategoryImage = (cat) => {
        if (cat && cat.image_url) {
            return cat.image_url.startsWith('http') ? cat.image_url : `${api.defaults.baseURL}${cat.image_url}`;
        }
        return `https://placehold.co/400x400/fff/7b002c?text=${cat.name || cat.slug}`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antreme-red"></div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Керування категоріями</h1>
                    <p className="text-gray-500 text-sm mt-1">Додавайте, редагуйте категорії та керуйте SEO контентом</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
                >
                    <FiPlus /> Додати категорію
                </button>
            </div>

            {/* Modal for Create/Edit */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={closeModals}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                        >
                            <FiX size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            {editingCategory === 'new' ? 'Додати нову категорію' : 'Редагувати категорію'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Назва (відображається на сайті)</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-xl"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                    <input
                                        required
                                        disabled={editingCategory !== 'new'}
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-xl bg-gray-50 disabled:text-gray-500"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Короткий опис</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-xl"
                                    rows="2"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Текст (HTML)</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-xl font-mono text-sm"
                                    rows="6"
                                    placeholder="<h2>Заголовок</h2><p>Текст для SEO...</p>"
                                    value={formData.seo_text}
                                    onChange={e => setFormData({ ...formData, seo_text: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Цей текст буде відображатися внизу сторінки каталогу для цієї категорії.</p>
                            </div>

                            {/* Collapsible SEO Section */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setShowSeo(!showSeo)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-bold text-gray-700"
                                >
                                    <span>🔍 SEO Налаштування</span>
                                    {showSeo ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {showSeo && (
                                    <div className="p-4 space-y-4 bg-white">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title (max 60 символів)</label>
                                                <input
                                                    type="text"
                                                    maxLength={255}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    placeholder="Назва для пошукових систем"
                                                    value={formData.meta_title}
                                                    onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                                                />
                                                <p className="text-xs text-gray-400 mt-0.5">{formData.meta_title.length}/60</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">SEO H1 Заголовок</label>
                                                <input
                                                    type="text"
                                                    maxLength={255}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    placeholder="H1 на сторінці категорії"
                                                    value={formData.seo_h1}
                                                    onChange={e => setFormData({ ...formData, seo_h1: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description (max 160 символів)</label>
                                            <textarea
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                                rows="2"
                                                placeholder="Опис для пошукової видачі Google"
                                                value={formData.meta_description}
                                                onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-400 mt-0.5">{formData.meta_description.length}/160</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Canonical URL</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                                                placeholder="/catalog/drova/ або https://site.ua/catalog/drova/"
                                                value={formData.canonical_url}
                                                onChange={e => setFormData({ ...formData, canonical_url: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-400 mt-0.5">Залиште пустим для автогенерації</p>
                                        </div>
                                        <hr className="border-gray-100" />
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open Graph (соцмережі)</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">OG Title</label>
                                                <input
                                                    type="text"
                                                    maxLength={255}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    placeholder="Заголовок для Facebook/Telegram"
                                                    value={formData.og_title}
                                                    onChange={e => setFormData({ ...formData, og_title: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">OG Image URL</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                                                    placeholder="/media/image.webp"
                                                    value={formData.og_image}
                                                    onChange={e => setFormData({ ...formData, og_image: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">OG Description</label>
                                            <textarea
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                                rows="2"
                                                placeholder="Опис для соцмереж"
                                                value={formData.og_description}
                                                onChange={e => setFormData({ ...formData, og_description: e.target.value })}
                                            />
                                        </div>
                                        <hr className="border-gray-100" />
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                checked={formData.is_indexable}
                                                onChange={e => setFormData({ ...formData, is_indexable: e.target.checked })}
                                            />
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Індексувати сторінку</span>
                                                <p className="text-xs text-gray-400">Якщо вимкнено — Google не буде індексувати цю категорію (noindex, nofollow)</p>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeModals();
                                        setFormData(emptyForm);
                                    }}
                                    className="px-4 py-2 w-full md:w-auto border rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 w-full md:w-auto bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all text-sm font-bold shadow-md shadow-orange-200 disabled:opacity-50 active:scale-95"
                                >
                                    {isSubmitting ? 'Збереження...' : (editingCategory === 'new' ? 'Створити' : 'Зберегти')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {localCategories.map((cat) => (
                    <div key={cat.slug} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Image section */}
                        <div className="w-full sm:w-48 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0 relative bg-gray-50 border border-gray-100">
                            <img
                                src={getCategoryImage(cat)}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                            />
                            {uploadingSlug === cat.slug && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Content section */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg md:text-xl">{cat.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">/{cat.slug}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {cat.description || <span className="text-gray-400 italic">Опис відсутній</span>}
                            </p>

                            {cat.seo_text ? (
                                <div className="text-xs text-green-600 flex items-center gap-1 mb-4 font-bold bg-green-50 w-fit px-2 py-1 rounded"><FiCheck /> SEO-текст заповнено</div>
                            ) : (
                                <div className="text-xs text-orange-500 flex items-center gap-1 mb-4 font-bold bg-orange-50 w-fit px-2 py-1 rounded"><FiX /> SEO-текст відсутній</div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => openEditModal(cat)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-sm rounded-lg transition-colors"
                                >
                                    <FiEdit2 className="w-4 h-4" /><span>Редагувати</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.slug)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-sm rounded-lg transition-colors"
                                >
                                    <FiTrash2 className="w-4 h-4" /><span>Видалити</span>
                                </button>
                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold text-sm rounded-lg cursor-pointer transition-colors ml-auto sm:ml-0">
                                    <FiUpload className="w-4 h-4" />
                                    <span>Фото</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleImageUpload(cat.slug, e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {localCategories.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">Жодної категорії не знайдено</p>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                    >
                        <FiPlus /> Створити першу категорію
                    </button>
                </div>
            )}
        </div>
    );
}
