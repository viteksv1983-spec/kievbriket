import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Plus, X, Save, RefreshCw, GripVertical, Trash2 } from "lucide-react";
import { a as api } from "../entry-server.js";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "react-icons/fa";
function FaqSettings() {
  const PAGE_OPTIONS = [
    { value: "home", label: "Головна" },
    { value: "drova", label: "Дрова" },
    { value: "delivery", label: "Доставка" },
    { value: "contacts", label: "Контакти" },
    { value: "brikety", label: "Брикети" },
    { value: "vugillya", label: "Вугілля" }
  ];
  const [activeTab, setActiveTab] = useState(PAGE_OPTIONS[0].value);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    page: "home",
    question: "",
    answer: "",
    is_active: true,
    sort_order: 0
  });
  useEffect(() => {
    fetchFaqs();
  }, []);
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/faqs");
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      showStatus("error");
    } finally {
      setLoading(false);
    }
  };
  const showStatus = (status) => {
    setSaveStatus(status);
    setTimeout(() => setSaveStatus(null), 3e3);
  };
  const handleCreateNew = () => {
    setEditingId("new");
    setFormData({
      page: activeTab,
      question: "",
      answer: "",
      is_active: true,
      sort_order: faqs.filter((f) => f.page === activeTab).length * 10
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
      if (editingId === "new") {
        await api.post("/admin/faqs", formData);
      } else {
        await api.patch(`/admin/faqs/${editingId}`, formData);
      }
      await fetchFaqs();
      setEditingId(null);
      showStatus("success");
      if (formData.page !== activeTab) {
        setActiveTab(formData.page);
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      showStatus("error");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити це питання?")) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      await fetchFaqs();
      showStatus("success");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      showStatus("error");
    }
  };
  const handleToggleActive = async (faq) => {
    try {
      await api.patch(`/admin/faqs/${faq.id}`, { is_active: !faq.is_active });
      await fetchFaqs();
    } catch (error) {
      console.error("Error toggling FAQ status:", error);
      showStatus("error");
    }
  };
  const activeFaqs = faqs.filter((f) => f.page === activeTab);
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Поширені питання (FAQ)" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Керування питаннями на всіх сторінках сайту" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        saveStatus === "success" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
          " Збережено"
        ] }),
        saveStatus === "error" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
          " Помилка"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "bg-[#EA580C] hover:bg-[#C2410C] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
            onClick: handleCreateNew,
            disabled: editingId !== null,
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 18 }),
              " Додати питання"
            ]
          }
        )
      ] })
    ] }),
    editingId && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden mb-8 relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-orange-50/50 p-4 border-b border-orange-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-bold text-orange-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-orange-500" }),
          editingId === "new" ? "Нове питання" : "Редагування питання"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: handleCancel, className: "text-gray-400 hover:text-gray-600 transition-colors p-1 bg-white rounded-lg shadow-sm border border-gray-100 hidden", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Сторінка відображення" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                className: "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none",
                value: formData.page,
                onChange: (e) => setFormData({ ...formData, page: e.target.value }),
                required: true,
                children: PAGE_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Порядок сортування" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none",
                value: formData.sort_order,
                onChange: (e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500 italic", children: "Менше число = вище в списку" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Питання" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none font-medium",
              value: formData.question,
              onChange: (e) => setFormData({ ...formData, question: e.target.value }),
              placeholder: "Наприклад: Які дрова краще для котла?",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Відповідь" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none min-h-[120px]",
              value: formData.answer,
              onChange: (e) => setFormData({ ...formData, answer: e.target.value }),
              placeholder: "Введіть повну розгорнуту відповідь...",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center cursor-pointer group w-max", children: [
          /* @__PURE__ */ jsx("span", { className: `w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${formData.is_active ? "bg-green-500" : "bg-gray-200"}`, children: /* @__PURE__ */ jsx("span", { className: `bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ease-in-out ${formData.is_active ? "translate-x-4" : "translate-x-0"}` }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "hidden",
              checked: formData.is_active,
              onChange: (e) => setFormData({ ...formData, is_active: e.target.checked })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "ml-3 select-none", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-sm font-bold text-gray-900", children: "Активно" }),
            /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: "Відображати на сайті" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-100", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors",
              onClick: handleCancel,
              children: "Скасувати"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: "px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors shadow-sm flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Save, { size: 18 }),
                " Зберегти"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto hide-scrollbar gap-2 pb-1 md:pb-0 w-full md:w-auto", children: PAGE_OPTIONS.map((opt) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab(opt.value),
            className: `whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === opt.value ? "bg-orange-100 text-orange-700 shadow-sm border border-orange-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`,
            children: [
              opt.label,
              /* @__PURE__ */ jsx("span", { className: "ml-2 px-1.5 py-0.5 rounded-md text-[10px] bg-white/60 border border-black/5", children: faqs.filter((f) => f.page === opt.value).length })
            ]
          },
          opt.value
        )) }),
        /* @__PURE__ */ jsx("button", { className: "flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors bg-white shadow-sm", onClick: fetchFaqs, title: "Оновити список", children: /* @__PURE__ */ jsx(RefreshCw, { size: 16, className: loading ? "animate-spin text-orange-500" : "" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: loading && !faqs.length ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Завантаження..." })
      ] }) : activeFaqs.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-16 text-center text-gray-400 flex flex-col items-center", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 48, className: "mb-4 text-gray-200" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: "Немає питань" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "На цій сторінці ще немає жодного питання." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCreateNew,
            className: "mt-4 text-orange-600 font-bold text-sm hover:underline",
            children: "Створити перше питання"
          }
        )
      ] }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-left md:min-w-[800px]", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-24", children: "Порядок" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Питання та Відповідь" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-32 text-center", children: "Статус" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-32 text-right", children: "Дії" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: activeFaqs.sort((a, b) => a.sort_order - b.sort_order).map((faq) => /* @__PURE__ */ jsxs("tr", { className: `hover:bg-gray-50/50 transition-colors group ${!faq.is_active ? "opacity-60 bg-gray-50/30" : ""}`, children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-400", children: [
            /* @__PURE__ */ jsx(GripVertical, { size: 14, className: "opacity-50" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: faq.sort_order })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-gray-900 flex items-start gap-2 max-w-lg mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-orange-500 mt-0.5", children: "Q:" }),
              faq.question
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 flex items-start gap-2 max-w-lg line-clamp-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-medium", children: "A:" }),
              faq.answer
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleToggleActive(faq),
              className: `px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer focus:outline-none w-full ${faq.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`,
              title: faq.is_active ? "Вимкнути" : "Увімкнути",
              children: faq.is_active ? "Активно" : "Приховано"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-16 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm",
                onClick: () => handleEdit(faq),
                title: "Редагувати",
                children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-none", children: "Ред" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm",
                onClick: () => handleDelete(faq.id),
                title: "Видалити",
                children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
              }
            )
          ] }) })
        ] }, faq.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            ` })
  ] });
}
export {
  FaqSettings as default
};
//# sourceMappingURL=FaqSettings-BGz8Pw3E.js.map
