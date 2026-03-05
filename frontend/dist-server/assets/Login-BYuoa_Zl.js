import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useContext } from "react";
import { A as AuthContext, S as SEOHead } from "../entry-server.js";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath);
    } catch (err) {
      setError("Невірний email або пароль. Будь ласка, спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(
    GoogleOAuthProvider,
    {
      clientId: "YOUR_GOOGLE_CLIENT_ID",
      children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsx(
          SEOHead,
          {
            title: "Вхід в особистий кабінет | Firewood",
            description: "Увійдіть до свого облікового запису, щоб переглядати історію замовлень та відстежувати статус доставки дров."
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8 bg-[#FDFBF7] p-10 shadow-2xl border-t-4 border-amber-700 relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 -mt-4 -ml-4 w-24 h-24 bg-amber-600 opacity-10 rounded-full blur-2xl" }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-4xl font-serif font-bold text-gray-900 tracking-tight", children: "Авторизація" }) }),
          error && /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-red-50 border-l-4 border-amber-700 p-4 mb-4 animate-pulse",
              role: "alert",
              children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 font-bold", children: error })
            }
          ),
          /* @__PURE__ */ jsxs("form", { className: "mt-8 space-y-7", onSubmit: handleSubmit, children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "login-username",
                    className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-amber-600",
                    children: "Логін або Email"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "login-username",
                    name: "username",
                    type: "text",
                    required: true,
                    className: "appearance-none block w-full px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-amber-600 transition-all sm:text-sm",
                    placeholder: "Ваш логін",
                    value: email,
                    onChange: (e) => setEmail(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "password",
                    className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-amber-600",
                    children: "Пароль"
                  }
                ),
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
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                className: "font-bold text-amber-700 hover:text-black transition-colors uppercase tracking-widest text-xs",
                children: "Забули пароль?"
              }
            ) }) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: isLoading,
                className: `group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest text-white bg-amber-700 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
                children: isLoading ? /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "animate-spin h-5 w-5 text-white",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                      /* @__PURE__ */ jsx(
                        "circle",
                        {
                          className: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          strokeWidth: "4"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          className: "opacity-75",
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }
                      )
                    ]
                  }
                ) : "Увійти"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "relative my-8", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-gray-200" }) }),
              /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase tracking-widest font-bold", children: /* @__PURE__ */ jsx("span", { className: "bg-white px-4 text-gray-500", children: "Або за допомогою" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
              GoogleLogin,
              {
                onSuccess: (credentialResponse) => {
                  loginWithGoogle(credentialResponse.credential);
                  const redirectPath = location.state?.from || "/";
                  navigate(redirectPath);
                },
                onError: () => {
                  setError("Помилка авторизації через Google");
                }
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 uppercase tracking-widest font-bold", children: [
              "Немає акаунту?",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigate("/register"),
                  className: "text-amber-700 hover:underline",
                  children: "Створити зараз"
                }
              )
            ] }) })
          ] })
        ] })
      ] })
    }
  );
}
export {
  Login as default
};
//# sourceMappingURL=Login-BYuoa_Zl.js.map
