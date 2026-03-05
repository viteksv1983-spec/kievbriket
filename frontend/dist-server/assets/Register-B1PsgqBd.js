import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { S as SEOHead, a as api } from "../entry-server.js";
import { useNavigate } from "react-router-dom";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await api.post("/users/", { email, password });
      setIsRegistered(true);
      setTimeout(() => {
        navigate("/login");
      }, 3e3);
    } catch (err) {
      setError("Реєстрація не вдалася. Можливо, email вже зайнятий або виникла технічна помилка.");
    } finally {
      setIsLoading(false);
    }
  };
  if (isRegistered) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        SEOHead,
        {
          title: "Успішна реєстрація | Firewood",
          description: "Дякуємо за реєстрацію! Тепер ви можете замовляти дрова ще швидше."
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8 bg-white p-10 shadow-xl border-t-4 border-green-500 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4", children: /* @__PURE__ */ jsx("svg", { className: "h-10 w-10 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif font-bold text-gray-900", children: "Реєстрація успішна!" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-600", children: "Ваш акаунт створено. Ви будете автоматично перенаправлені на сторінку входу через кілька секунд..." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/login"),
            className: "mt-6 text-amber-700 font-bold hover:underline",
            children: "Перейти до входу зараз"
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Реєстрація | Створити акаунт Firewood",
        description: "Зареєструйтесь, щоб отримувати ексклюзивні знижки на дрова, відстежувати замовлення та прискорити оформлення покупок."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8 bg-white p-10 shadow-2xl border-t-4 border-amber-700 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-600 opacity-10 rounded-full blur-2xl" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-4xl font-serif font-bold text-gray-900 tracking-tight", children: "Реєстрація" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-sm text-gray-500 font-medium uppercase tracking-widest", children: "Магазин Вацак" })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-amber-700 p-4 mb-4 animate-pulse", role: "alert", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 font-bold", children: error }) }),
      /* @__PURE__ */ jsxs("form", { className: "mt-8 space-y-7", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email-address", className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-amber-600", children: "Електронна пошта" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "email-address",
                name: "email",
                type: "email",
                required: true,
                className: "appearance-none block w-full px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-amber-600 transition-all sm:text-sm",
                placeholder: "example@mail.com",
                value: email,
                onChange: (e) => setEmail(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-amber-600", children: "Пароль" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password",
                name: "password",
                type: "password",
                required: true,
                className: "appearance-none block w-full px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-amber-600 transition-all sm:text-sm",
                placeholder: "••••••••",
                value: password,
                onChange: (e) => setPassword(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: `group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest text-white bg-amber-700 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
            children: isLoading ? /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            ] }) : "Створити акаунт"
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  Register as default
};
//# sourceMappingURL=Register-B1PsgqBd.js.map
