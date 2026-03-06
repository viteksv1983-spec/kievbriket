import React, { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiLock, FiCheckCircle } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function MyProfile() {
    const { user, token } = useAuth();
    const [passwordForm, setPasswordForm] = useState({
        new_password: "",
        confirm_password: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error("Паролі не співпадають!");
            return;
        }

        if (passwordForm.new_password.length < 6) {
            toast.error("Пароль має містити щонайменше 6 символів");
            return;
        }

        setSubmitting(true);
        try {
            await api.put(
                "/users/me/password",
                { new_password: passwordForm.new_password },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Ваш пароль успішно змінено!");
            setPasswordForm({ new_password: "", confirm_password: "" });
        } catch (err) {
            toast.error("Помилка при зміні пароля");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-12">
            <Toaster position="top-right" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FiUser className="text-orange-500" />
                    Мій профіль
                </h1>
                <p className="text-sm text-gray-500 mt-1">Особисті налаштування аккаунта</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-orange-600">
                                {user?.email?.charAt(0).toUpperCase() || "A"}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.email}</h2>
                            <div className="mt-1">
                                {user?.is_superadmin ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                        <FiCheckCircle className="w-3 h-3" />
                                        Супер-адміністратор
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        Менеджер
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiLock className="text-gray-400" />
                        Зміна пароля
                    </h3>

                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Новий пароль
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={passwordForm.new_password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                placeholder="Мінімум 6 символів"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Підтвердіть новий пароль
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordForm.confirm_password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                placeholder="Повторіть пароль"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 flex justify-center items-center gap-2 w-full"
                        >
                            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Зберегти пароль
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
