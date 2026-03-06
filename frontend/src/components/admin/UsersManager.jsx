import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { FiTrash2, FiPlus, FiUserPlus, FiShield } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function UsersManager() {
    const { token, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (err) {
            toast.error("Помилка завантаження користувачів");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateManager = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/users/manager", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Менеджера успішно створено!");
            setIsModalOpen(false);
            setFormData({ email: "", password: "" });
            fetchUsers();
        } catch (err) {
            if (err.response?.status === 400) {
                toast.error("Користувач з таким логіном вже існує!");
            } else {
                toast.error("Помилка при створенні менеджера");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Ви дійсно хочете видалити цього користувача? Цю дію неможливо скасувати.")) return;
        try {
            await api.delete(`/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Користувача видалено");
            fetchUsers();
        } catch (err) {
            toast.error("Помилка видалення");
            console.error(err);
        }
    };

    if (!user?.is_superadmin) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-gray-500">
                У вас немає доступу до цієї сторінки.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <Toaster position="top-right" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FiShield className="text-orange-500" />
                        Користувачі та Адміністрування
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Керуйте доступом менеджерів до адмін-панелі сайту</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-sm hover:shadow-orange-200 hover:-translate-y-0.5 transition-all font-medium text-sm"
                >
                    <FiUserPlus className="w-4 h-4" />
                    Створити менеджера
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl w-16">ID</th>
                                    <th className="px-6 py-4">Логін / Email</th>
                                    <th className="px-6 py-4">Рівень доступу</th>
                                    <th className="px-6 py-4 text-right rounded-tr-xl">Дії</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-orange-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-400">#{u.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{u.email}</td>
                                        <td className="px-6 py-4">
                                            {u.is_superadmin ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                    <FiShield className="w-3 h-3" />
                                                    Супер-адмін
                                                </span>
                                            ) : u.is_admin ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    Менеджер
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    Клієнт
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.id !== u.id && !u.is_superadmin && (
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                                    title="Видалити користувача"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                                            Користувачів не знайдено
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900">Новий менеджер</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreateManager} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Логін (або Email) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        placeholder="Наприклад: manager2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Пароль <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        placeholder="Мінімум 6 символів"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    Створити
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
