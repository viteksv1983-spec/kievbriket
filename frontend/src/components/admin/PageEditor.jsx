import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiSettings, FiInfo, FiGlobe, FiChevronDown, FiChevronUp, FiPlus, FiTrash2 } from 'react-icons/fi';

// Fixed list: core pages (these always exist)
const PAGE_CONFIG = {
    'home': { route: '/', label: 'Головна сторінка', icon: '🏠', defaultSchemaType: 'localbusiness' },
    'delivery': { route: '/delivery', label: 'Доставка', icon: '🚚', defaultSchemaType: 'article' },
    'contacts': { route: '/contacts', label: 'Контакти', icon: '📞', defaultSchemaType: 'localbusiness' },
};

const ROUTE_TO_KEY = { '/': 'home', '/delivery': 'delivery', '/contacts': 'contacts' };
const CORE_ROUTES = new Set(['/', '/delivery', '/contacts']);

export default function PageEditor() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [selectedPage, setSelectedPage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showOg, setShowOg] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCreating, setIsCreating] = useState(false);
    const [newPageData, setNewPageData] = useState({ route_path: '', name: '' });

    const activePageKey = searchParams.get('page') || 'home';

    useEffect(() => {
        fetchPages();
    }, []);

    // When URL param changes, select the matching page
    useEffect(() => {
        if (pages.length > 0) {
            if (searchParams.get('new') === 'true') {
                setIsCreating(true);
                setSelectedPage(null);
                return;
            }
            setIsCreating(false);

            // Check if it's a custom page by route_path
            const customRoute = searchParams.get('custom');
            if (customRoute) {
                const match = pages.find(p => p.route_path === customRoute);
                if (match) {
                    setSelectedPage({ ...match });
                    setShowOg(false);
                    setShowAdvanced(false);
                }
                return;
            }

            // Core page
            const cfg = PAGE_CONFIG[activePageKey];
            if (cfg) {
                const match = pages.find(p => p.route_path === cfg.route);
                if (match) {
                    setSelectedPage({ ...match });
                    setShowOg(false);
                    setShowAdvanced(false);
                }
            }
        }
    }, [activePageKey, pages, searchParams]);

    const fetchPages = async () => {
        try {
            const response = await api.get('/admin/pages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPages(response.data);
        } catch (error) {
            console.error("Failed to fetch pages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { id, route_path, ...updateData } = selectedPage;
            await api.patch(`/admin/pages/${id}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Сторінку оновлено! ✨');
            fetchPages();
        } catch (error) {
            console.error("Save failed", error);
            alert('Помилка при збереженні');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreatePage = async () => {
        if (!newPageData.route_path || !newPageData.name) {
            alert('Заповніть URL та назву сторінки');
            return;
        }
        // Ensure route starts with /
        let route = newPageData.route_path.trim();
        if (!route.startsWith('/')) route = '/' + route;

        try {
            const res = await api.post('/admin/pages', {
                route_path: route,
                name: newPageData.name.trim(),
                meta_title: newPageData.name.trim(),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Сторінку створено! ✨');
            setIsCreating(false);
            setNewPageData({ route_path: '', name: '' });
            await fetchPages();
            setSearchParams({ custom: res.data.route_path });
        } catch (error) {
            console.error("Create failed", error);
            alert('Помилка при створенні. Можливо, такий URL вже існує.');
        }
    };

    const handleDeletePage = async () => {
        if (!selectedPage || CORE_ROUTES.has(selectedPage.route_path)) return;
        if (!confirm(`Видалити сторінку "${selectedPage.name}"?`)) return;

        try {
            await api.delete(`/admin/pages/${selectedPage.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Сторінку видалено');
            setSelectedPage(null);
            setSearchParams({});
            fetchPages();
        } catch (error) {
            console.error("Delete failed", error);
            alert('Помилка при видаленні');
        }
    };

    const update = (field, value) => {
        setSelectedPage(prev => ({ ...prev, [field]: value }));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );

    // Separate core and custom pages
    const customPages = pages.filter(p => !CORE_ROUTES.has(p.route_path));

    // --- Create Page Form ---
    if (isCreating) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <FiPlus className="text-orange-500" />
                        Створити нову сторінку
                    </h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Назва сторінки</label>
                            <input
                                type="text"
                                value={newPageData.name}
                                onChange={e => setNewPageData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none"
                                placeholder="Наприклад: Про нас, FAQ, Блог"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">URL сторінки</label>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm font-mono">/page/</span>
                                <input
                                    type="text"
                                    value={newPageData.route_path}
                                    onChange={e => setNewPageData(prev => ({ ...prev, route_path: e.target.value.replace(/[^a-z0-9-]/g, '') }))}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none font-mono"
                                    placeholder="faq"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1 ml-1">Сторінка буде доступна за адресою: site.com/page/{newPageData.route_path || 'slug'}</p>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => { setIsCreating(false); setSearchParams({}); }}
                                className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleCreatePage}
                                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-md shadow-orange-200 transition-all active:scale-95"
                            >
                                <FiPlus />
                                Створити
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- No page selected ---
    const cfg = selectedPage ? (PAGE_CONFIG[ROUTE_TO_KEY[selectedPage.route_path]] || { icon: '📄', label: selectedPage.name, defaultSchemaType: 'webpage' }) : null;

    if (!selectedPage || !cfg) return (
        <div className="text-center py-20 text-gray-400">Сторінку не знайдено</div>
    );

    const isCustomPage = !CORE_ROUTES.has(selectedPage.route_path);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">{cfg.icon}</span>
                        {cfg.label}
                    </h1>
                    <p className="text-gray-400 text-xs font-mono mt-1">{selectedPage.route_path}</p>
                    {isCustomPage && (
                        <p className="text-xs text-orange-500 font-medium mt-1">
                            Доступна на сайті: /page{selectedPage.route_path}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isCustomPage && (
                        <button
                            onClick={handleDeletePage}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-all"
                        >
                            <FiTrash2 />
                            <span className="hidden sm:inline">Видалити</span>
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600 transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div> : <FiSave />}
                        <span>ЗБЕРЕГТИ</span>
                    </button>
                </div>
            </div>

            {/* SEO Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FiSettings className="text-orange-500" />
                    SEO налаштування
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Meta Title</label>
                            <input
                                type="text"
                                value={selectedPage.meta_title || ''}
                                onChange={e => update('meta_title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none"
                                placeholder="Назва для пошукових систем"
                            />
                            <p className="text-xs text-gray-400 mt-0.5 ml-1">{(selectedPage.meta_title || '').length}/60</p>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">H1 Заголовок</label>
                            <input
                                type="text"
                                value={selectedPage.h1_heading || ''}
                                onChange={e => update('h1_heading', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none font-bold"
                                placeholder="Головний заголовок на сторінці"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Meta Description</label>
                        <textarea
                            rows="3"
                            value={selectedPage.meta_description || ''}
                            onChange={e => update('meta_description', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none resize-none"
                            placeholder="Опис для пошукової видачі Google (до 160 символів)"
                        />
                        <p className="text-xs text-gray-400 mt-0.5 ml-1">{(selectedPage.meta_description || '').length}/160</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Canonical URL</label>
                        <input
                            type="text"
                            value={selectedPage.canonical_url || ''}
                            onChange={e => update('canonical_url', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none font-mono"
                            placeholder="Залиште пустим для автогенерації"
                        />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            checked={selectedPage.is_indexable !== false}
                            onChange={e => update('is_indexable', e.target.checked)}
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-700">Індексувати сторінку</span>
                            <p className="text-xs text-gray-400">Якщо вимкнено — noindex, nofollow</p>
                        </div>
                    </label>
                </div>
            </div>


            {/* Content Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FiInfo className="text-orange-500" />
                    Контент сторінки
                </h3>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Текст сторінки (HTML)</label>
                    <p className="text-xs text-gray-400 mb-2 ml-1">Підтримується HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;b&gt;, &lt;i&gt;, &lt;img&gt;</p>
                    <textarea
                        value={selectedPage.content || ''}
                        onChange={e => update('content', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none min-h-[250px] font-mono"
                        placeholder="<h2>Заголовок</h2>\n<p>Текст сторінки...</p>"
                    />
                </div>
                {/* Live Preview */}
                {selectedPage.content && (
                    <div className="mt-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Попередній перегляд</label>
                        <div
                            className="prose prose-gray max-w-none bg-gray-50 border border-gray-200 rounded-2xl p-6 prose-headings:font-bold prose-p:text-gray-600 prose-a:text-orange-600"
                            dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                        />
                    </div>
                )}
                <div className="mt-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">SEO текст (внизу сторінки)</label>
                    <textarea
                        value={selectedPage.bottom_seo_text || ''}
                        onChange={e => update('bottom_seo_text', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none min-h-[120px] font-mono"
                        placeholder="HTML текст для SEO блоку..."
                    />
                </div>
            </div>

            {/* Advanced — collapsible */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <span>⚙️ Розширені налаштування</span>
                    {showAdvanced ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showAdvanced && (
                    <div className="px-6 pb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Schema Type</label>
                                <select
                                    value={selectedPage.schema_type || cfg.defaultSchemaType}
                                    onChange={e => update('schema_type', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                >
                                    <option value="localbusiness">LocalBusiness</option>
                                    <option value="article">Article</option>
                                    <option value="webpage">WebPage</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={selectedPage.meta_keywords || ''}
                                    onChange={e => update('meta_keywords', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                    placeholder="ключ1, ключ2, ключ3"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Custom Schema JSON-LD</label>
                            <textarea
                                rows="4"
                                value={selectedPage.custom_schema || ''}
                                onChange={e => update('custom_schema', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none font-mono"
                                placeholder='{"@context":"https://schema.org",...}'
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Open Graph — collapsible */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowOg(!showOg)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <FiGlobe className="text-blue-500" />
                        Open Graph (соцмережі)
                    </span>
                    {showOg ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showOg && (
                    <div className="px-6 pb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">OG Title</label>
                                <input
                                    type="text"
                                    value={selectedPage.og_title || ''}
                                    onChange={e => update('og_title', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                    placeholder="Fallback → Meta Title"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">OG Image</label>
                                <input
                                    type="text"
                                    value={selectedPage.og_image || ''}
                                    onChange={e => update('og_image', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none font-mono"
                                    placeholder="/media/og-image.webp"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">OG Description</label>
                            <textarea
                                rows="2"
                                value={selectedPage.og_description || ''}
                                onChange={e => update('og_description', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none"
                                placeholder="Fallback → Meta Description"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
