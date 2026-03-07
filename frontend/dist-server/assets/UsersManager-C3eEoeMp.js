import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { c as useAuth, a as api } from "../entry-server.js";
import { FiShield, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
function UsersManager() {
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
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Користувача видалено");
      fetchUsers();
    } catch (err) {
      toast.error("Помилка видалення");
      console.error(err);
    }
  };
  if (!user?.is_superadmin) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[50vh] text-gray-500", children: "У вас немає доступу до цієї сторінки." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsx(Toaster, { position: "top-right" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FiShield, { className: "text-orange-500" }),
          "Користувачі та Адміністрування"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Керуйте доступом менеджерів до адмін-панелі сайту" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsModalOpen(true),
          className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-sm hover:shadow-orange-200 hover:-translate-y-0.5 transition-all font-medium text-sm",
          children: [
            /* @__PURE__ */ jsx(FiUserPlus, { className: "w-4 h-4" }),
            "Створити менеджера"
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" }) }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-gray-600", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-700 text-xs uppercase font-semibold", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 rounded-tl-xl w-16", children: "ID" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Логін / Email" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Рівень доступу" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right rounded-tr-xl", children: "Дії" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100", children: [
        users.map((u) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-orange-50/30 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 font-mono text-gray-400", children: [
            "#",
            u.id
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium text-gray-900", children: u.email }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: u.is_superadmin ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700", children: [
            /* @__PURE__ */ jsx(FiShield, { className: "w-3 h-3" }),
            "Супер-адмін"
          ] }) : u.is_admin ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700", children: "Менеджер" }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600", children: "Клієнт" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: user.id !== u.id && !u.is_superadmin && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(u.id),
              className: "p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block",
              title: "Видалити користувача",
              children: /* @__PURE__ */ jsx(FiTrash2, { className: "w-5 h-5" })
            }
          ) })
        ] }, u.id)),
        users.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "4", className: "px-6 py-8 text-center text-gray-400", children: "Користувачів не знайдено" }) })
      ] })
    ] }) }) }),
    isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-gray-900", children: "Новий менеджер" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsModalOpen(false),
            className: "text-gray-400 hover:text-gray-600 transition-colors",
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateManager, className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Логін (або Email) ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: formData.email,
                onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all",
                placeholder: "Наприклад: manager2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Пароль ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                required: true,
                minLength: 6,
                value: formData.password,
                onChange: (e) => setFormData({ ...formData, password: e.target.value }),
                className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all",
                placeholder: "Мінімум 6 символів"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsModalOpen(false),
              className: "flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm",
              children: "Скасувати"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: submitting,
              className: "flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50 flex justify-center items-center gap-2",
              children: [
                submitting && /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                "Створити"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  UsersManager as default
};
//# sourceMappingURL=UsersManager-C3eEoeMp.js.map
