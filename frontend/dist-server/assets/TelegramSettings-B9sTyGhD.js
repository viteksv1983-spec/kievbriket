import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { a as api } from "../entry-server.js";
import { FiBell, FiSend, FiSave, FiCheck, FiX } from "react-icons/fi";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "@react-oauth/google";
import "react-icons/fa";
const TelegramSettings = () => {
  const [settings, setSettings] = useState({
    bot_token: "",
    chat_id_1: "",
    label_1: "",
    chat_id_2: "",
    label_2: "",
    chat_id_3: "",
    label_3: "",
    is_active_1: true,
    is_active_2: true,
    is_active_3: true,
    is_active: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useEffect(() => {
    fetchSettings();
  }, []);
  const fetchSettings = async () => {
    try {
      const response = await api.get("/admin/telegram");
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Telegram settings:", error);
      showMessage("error", "Помилка завантаження налаштувань");
      setLoading(false);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put("/admin/telegram", settings);
      setSettings(response.data);
      showMessage("success", "Налаштування успішно збережено");
    } catch (error) {
      console.error("Error saving Telegram settings:", error);
      showMessage("error", "Помилка збереження налаштувань");
    } finally {
      setSaving(false);
    }
  };
  const handleTest = async () => {
    setTesting(true);
    try {
      await api.post("/admin/telegram/test");
      showMessage("success", "Тестове повідомлення відправлено! Перевірте ваші Telegram чати.");
    } catch (error) {
      console.error("Error sending test message:", error);
      showMessage("error", "Помилка відправки тестового повідомлення. Перевірте токен та ID чатів.");
    } finally {
      setTesting(false);
    }
  };
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5e3);
  };
  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-gray-500", children: "Завантаження налаштувань..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FiBell, { className: "text-[#E8C064]" }),
          "Telegram Сповіщення"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Налаштуйте отримання сповіщень про нові замовлення в Telegram." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto mt-4 md:mt-0", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleTest,
            disabled: testing || !settings.is_active || !settings.bot_token,
            className: `flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all w-full md:w-auto ${!settings.is_active || !settings.bot_token ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#E8C064]/20 text-[#A07A1F] hover:bg-[#E8C064]/30"}`,
            children: [
              /* @__PURE__ */ jsx(FiSend, {}),
              testing ? "Відправка..." : "Тестове повідомлення"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSave,
            disabled: saving,
            className: "flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-medium shadow-md shadow-orange-200 transition-all active:scale-95",
            children: [
              /* @__PURE__ */ jsx(FiSave, {}),
              saving ? "Збереження..." : "Зберегти"
            ]
          }
        )
      ] })
    ] }),
    message.text && /* @__PURE__ */ jsxs("div", { className: `mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`, children: [
      message.type === "success" ? /* @__PURE__ */ jsx(FiCheck, { className: "text-xl shrink-0" }) : /* @__PURE__ */ jsx(FiX, { className: "text-xl shrink-0" }),
      /* @__PURE__ */ jsx("p", { children: message.text })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-6 rounded-2xl border border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Основні налаштування" }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center cursor-pointer", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  name: "is_active",
                  checked: settings.is_active,
                  onChange: handleChange,
                  className: "sr-only"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: `block w-10 h-6 rounded-full transition-colors ${settings.is_active ? "bg-[#22c55e]" : "bg-gray-300"}` }),
              /* @__PURE__ */ jsx("div", { className: `dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.is_active ? "transform translate-x-4" : ""}` })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "ml-3 font-medium text-gray-700", children: settings.is_active ? "Сповіщення увімкнені" : "Сповіщення вимкнені" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Bot Token (Токен бота)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "bot_token",
              value: settings.bot_token || "",
              onChange: handleChange,
              placeholder: "Наприклад: 123456789:ABCdefGHIjklMNOpqrSTUvwxYZ",
              className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8C064] focus:border-transparent transition-all outline-none font-mono text-sm"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Токен отримується у @BotFather при створенні бота." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "Отримувачі сповіщень" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Ви можете додати до 3-х користувачів, які будуть отримувати сповіщення про нові замовлення. Щоб дізнатися Chat ID, напишіть боту @getmyid_bot." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-gray-100 bg-gray-50/50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 pb-2 border-b border-gray-200", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-800", children: "Користувач 1 (Основний)" }),
              /* @__PURE__ */ jsx("label", { className: "flex items-center cursor-pointer", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: "is_active_1",
                    checked: settings.is_active_1 ?? true,
                    onChange: handleChange,
                    className: "sr-only"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: `block w-10 h-6 rounded-full transition-colors ${settings.is_active_1 !== false ? "bg-[#22c55e]" : "bg-gray-300"}` }),
                /* @__PURE__ */ jsx("div", { className: `dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.is_active_1 !== false ? "transform translate-x-4" : ""}` })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5", children: "Ім'я / Посада" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "label_1",
                    value: settings.label_1 || "",
                    onChange: handleChange,
                    placeholder: "Наприклад: Віктор (Адмін)",
                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#E8C064] outline-none text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5", children: "Chat ID" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "chat_id_1",
                    value: settings.chat_id_1 || "",
                    onChange: handleChange,
                    placeholder: "Наприклад: 123456789",
                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#E8C064] outline-none text-sm font-mono"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-gray-100 bg-gray-50/50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 pb-2 border-b border-gray-200", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-800", children: "Користувач 2 (Додатковий)" }),
              /* @__PURE__ */ jsx("label", { className: "flex items-center cursor-pointer", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: "is_active_2",
                    checked: settings.is_active_2 ?? true,
                    onChange: handleChange,
                    className: "sr-only"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: `block w-10 h-6 rounded-full transition-colors ${settings.is_active_2 !== false ? "bg-[#22c55e]" : "bg-gray-300"}` }),
                /* @__PURE__ */ jsx("div", { className: `dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.is_active_2 !== false ? "transform translate-x-4" : ""}` })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5", children: "Ім'я / Посада" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "label_2",
                    value: settings.label_2 || "",
                    onChange: handleChange,
                    placeholder: "Наприклад: Менеджер Анна",
                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#E8C064] outline-none text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5", children: "Chat ID" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "chat_id_2",
                    value: settings.chat_id_2 || "",
                    onChange: handleChange,
                    placeholder: "Наприклад: 987654321",
                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#E8C064] outline-none text-sm font-mono"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-gray-100 bg-gray-50/50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 pb-2 border-b border-gray-200", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-800", children: "Користувач 3 (Резервний)" }),
              /* @__PURE__ */ jsx("label", { className: "flex items-center cursor-pointer", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: "is_active_3",
                    checked: settings.is_active_3 ?? true,
                    onChange: handleChange,
                    className: "sr-only"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: `block w-10 h-6 rounded-full transition-colors ${settings.is_active_3 !== false ? "bg-[#22c55e]" : "bg-gray-300"}` }),
                /* @__PURE__ */ jsx("div", { className: `dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.is_active_3 !== false ? "transform translate-x-4" : ""}` })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5", children: "Ім'я / Посада" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "label_3",
                    value: settings.label_3 || "",
                    onChange: handleChange,
                    placeholder: "Наприклад: Кур'єр",
                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#E8C064] outline-none text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5", children: "Chat ID" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "chat_id_3",
                    value: settings.chat_id_3 || "",
                    onChange: handleChange,
                    placeholder: "Наприклад: 456789123",
                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#E8C064] outline-none text-sm font-mono"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  TelegramSettings as default
};
//# sourceMappingURL=TelegramSettings-B9sTyGhD.js.map
