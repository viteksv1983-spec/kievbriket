import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { c as useAuth, a as api } from "../entry-server.js";
import { FiUser, FiCheckCircle, FiLock } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
function MyProfile() {
  const { user, token } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    confirm_password: ""
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
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsx(Toaster, { position: "top-right" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FiUser, { className: "text-orange-500" }),
        "Мій профіль"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Особисті налаштування аккаунта" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-orange-600", children: user?.email?.charAt(0).toUpperCase() || "A" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: user?.email }),
          /* @__PURE__ */ jsx("div", { className: "mt-1", children: user?.is_superadmin ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700", children: [
            /* @__PURE__ */ jsx(FiCheckCircle, { className: "w-3 h-3" }),
            "Супер-адміністратор"
          ] }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700", children: "Менеджер" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FiLock, { className: "text-gray-400" }),
          "Зміна пароля"
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handlePasswordChange, className: "space-y-4 max-w-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Новий пароль" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                required: true,
                minLength: 6,
                value: passwordForm.new_password,
                onChange: (e) => setPasswordForm({ ...passwordForm, new_password: e.target.value }),
                className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all",
                placeholder: "Мінімум 6 символів"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Підтвердіть новий пароль" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                required: true,
                value: passwordForm.confirm_password,
                onChange: (e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value }),
                className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all",
                placeholder: "Повторіть пароль"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: submitting,
              className: "mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 flex justify-center items-center gap-2 w-full",
              children: [
                submitting && /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                "Зберегти пароль"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  MyProfile as default
};
//# sourceMappingURL=MyProfile-etrXsg_X.js.map
