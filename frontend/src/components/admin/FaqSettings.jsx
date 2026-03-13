import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, GripVertical, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import api from '../../api';

export default function FaqSettings() {
    const PAGE_OPTIONS = [
        { value: 'home', label: 'Головна' },
        { value: 'drova', label: 'Дрова' },
        { value: 'delivery', label: 'Доставка' },
        { value: 'contacts', label: 'Контакти' },
        { value: 'brikety', label: 'Брикети' },
        { value: 'vugillya', label: 'Вугілля' }
    ];

    const [activeTab, setActiveTab] = useState(PAGE_OPTIONS[0].value);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        page: 'home',
        question: '',
        answer: '',
        is_active: true,
        sort_order: 0
    });

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/faqs');
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            showStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const showStatus = (status) => {
        setSaveStatus(status);
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const handleCreateNew = () => {
        setEditingId('new');
        setFormData({
            page: activeTab,
            question: '',
            answer: '',
            is_active: true,
            sort_order: faqs.filter(f => f.page === activeTab).length * 10
        });
    };

    const handleEdit = (faq) => {
        setEditingId(faq.id);
        setFormData({
            page: faq.page,
            question: faq.question,
            answer: faq.answer,
            is_active: faq.is_active,
            sort_order: faq.sort_order
        });
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId === 'new') {
                await api.post('/admin/faqs', formData);
            } else {
                await api.patch(`/admin/faqs/${editingId}`, formData);
            }
            await fetchFaqs();
            setEditingId(null);
            showStatus('success');
            if (formData.page !== activeTab) {
                setActiveTab(formData.page);
            }
        } catch (error) {
            console.error('Error saving FAQ:', error);
            showStatus('error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити це питання?')) return;
        try {
            await api.delete(`/admin/faqs/${id}`);
            await fetchFaqs();
            showStatus('success');
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            showStatus('error');
        }
    };

    const handleToggleActive = async (faq) => {
        try {
            await api.patch(`/admin/faqs/${faq.id}`, { is_active: !faq.is_active });
            await fetchFaqs();
        } catch (error) {
            console.error('Error toggling FAQ status:', error);
            showStatus('error');
        }
    };

    const activeFaqs = faqs.filter(f => f.page === activeTab);

    return (
        <div className="animate-fade-in max-w-6xl">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Поширені питання (FAQ)</h1>
                    <p className="text-sm text-gray-500 mt-1">Керування питаннями на всіх сторінках сайту</p>
                </div>
                <div className="flex items-center gap-4">
                    {saveStatus === 'success' && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                            <CheckCircle size={16} /> Збережено
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                            <AlertCircle size={16} /> Помилка
                        </div>
                    )}
                    <button
                        className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleCreateNew}
                        disabled={editingId !== null}
                    >
                        <Plus size={18} /> Додати питання
                    </button>
                </div>
            </div>

            {editingId && (
                <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden mb-8 relative">
                    <div className="bg-orange-50/50 p-4 border-b border-orange-100 flex items-center justify-between">
                        <h2 className="font-bold text-orange-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            {editingId === 'new' ? 'Нове питання' : 'Редагування питання'}
                        </h2>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 bg-white rounded-lg shadow-sm border border-gray-100 hidden">
                            <X size={16} />
                        </button>
                    </div>
                    <form onSubmit={handleSave} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Сторінка відображення</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none"
                                    value={formData.page}
                                    onChange={e => setFormData({ ...formData, page: e.target.value })}
                                    required
                                >
                                    {PAGE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Порядок сортування</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none"
                                    value={formData.sort_order}
                                    onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                />
                                <p className="mt-1 text-xs text-gray-500 italic">Менше число = вище в списку</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Питання</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none font-medium"
                                value={formData.question}
                                onChange={e => setFormData({ ...formData, question: e.target.value })}
                                placeholder="Наприклад: Які дрова краще для котла?"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Відповідь</label>
                            <textarea
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none min-h-[120px]"
                                value={formData.answer}
                                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="Введіть повну розгорнуту відповідь..."
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className="flex items-center cursor-pointer group w-max">
                                <span className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${formData.is_active ? 'bg-green-500' : 'bg-gray-200'}`}>
                                    <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ease-in-out ${formData.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                                </span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <div className="ml-3 select-none">
                                    <span className="block text-sm font-bold text-gray-900">Активно</span>
                                    <span className="block text-xs text-gray-500">Відображати на сайті</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                onClick={handleCancel}
                            >
                                Скасувати
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Save size={18} /> Зберегти
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 md:pb-0 w-full md:w-auto">
                        {PAGE_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setActiveTab(opt.value)}
                                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === opt.value
                                    ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {opt.label}
                                <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] bg-white/60 border border-black/5">
                                    {faqs.filter(f => f.page === opt.value).length}
                                </span>
                            </button>
                        ))}
                    </div>
                    <button className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors bg-white shadow-sm" onClick={fetchFaqs} title="Оновити список">
                        <RefreshCw size={16} className={loading ? 'animate-spin text-orange-500' : ''} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {loading && !faqs.length ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Завантаження...</span>
                        </div>
                    ) : activeFaqs.length === 0 ? (
                        <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                            <AlertCircle size={48} className="mb-4 text-gray-200" />
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Немає питань</h3>
                            <p className="text-sm">На цій сторінці ще немає жодного питання.</p>
                            <button
                                onClick={handleCreateNew}
                                className="mt-4 text-orange-600 font-bold text-sm hover:underline"
                            >
                                Створити перше питання
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-left md:min-w-[800px]">
                            <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 w-24">Порядок</th>
                                    <th className="px-6 py-4">Питання та Відповідь</th>
                                    <th className="px-6 py-4 w-32 text-center">Статус</th>
                                    <th className="px-6 py-4 w-32 text-right">Дії</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activeFaqs.sort((a, b) => a.sort_order - b.sort_order).map((faq) => (
                                    <tr key={faq.id} className={`hover:bg-gray-50/50 transition-colors group ${!faq.is_active ? 'opacity-60 bg-gray-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <GripVertical size={14} className="opacity-50" />
                                                <span className="font-bold text-gray-900">{faq.sort_order}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 flex items-start gap-2 max-w-lg mb-1">
                                                <span className="text-orange-500 mt-0.5">Q:</span>
                                                {faq.question}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-start gap-2 max-w-lg line-clamp-2">
                                                <span className="text-gray-400 font-medium">A:</span>
                                                {faq.answer}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleActive(faq)}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer focus:outline-none w-full ${faq.is_active
                                                    ? 'bg-green-50 text-green-600 border-green-200'
                                                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                                    }`}
                                                title={faq.is_active ? 'Вимкнути' : 'Увімкнути'}
                                            >
                                                {faq.is_active ? 'Активно' : 'Приховано'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="w-16 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                                                    onClick={() => handleEdit(faq)}
                                                    title="Редагувати"
                                                >
                                                    <span className="text-xs font-bold leading-none">Ред</span>
                                                </button>
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                                                    onClick={() => handleDelete(faq.id)}
                                                    title="Видалити"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
