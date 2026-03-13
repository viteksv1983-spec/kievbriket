import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import SEOHead from "./SEOHead";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <SEOHead
          title="Вхід в особистий кабінет | Firewood"
          description="Увійдіть до свого облікового запису, щоб переглядати історію замовлень та відстежувати статус доставки дров."
        />
        <div className="max-w-md w-full space-y-8 bg-[#FDFBF7] p-10 shadow-2xl border-t-4 border-amber-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 -mt-4 -ml-4 w-24 h-24 bg-amber-600 opacity-10 rounded-full blur-2xl"></div>
          <div>
            <h2 className="mt-6 text-center text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Авторизація
            </h2>
          </div>
          {error && (
            <div
              className="bg-red-50 border-l-4 border-amber-700 p-4 mb-4 animate-pulse"
              role="alert"
            >
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </div>
          )}
          <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="relative group">
                <label
                  htmlFor="login-username"
                  className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-amber-600"
                >
                  Логін або Email
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-amber-600 transition-all sm:text-sm"
                  placeholder="Ваш логін"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-amber-600"
                >
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-amber-600 transition-all sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-bold text-amber-700 hover:text-black transition-colors uppercase tracking-widest text-xs"
                >
                  Забули пароль?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest text-white bg-amber-700 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Увійти"
                )}
              </button>
            </div>



            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                Немає акаунту?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-amber-700 hover:underline"
                >
                  Створити зараз
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
