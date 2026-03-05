import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { b as useAuth, a as api } from "../entry-server.js";
import { FiPlus, FiTrash2, FiSave, FiSettings, FiInfo } from "react-icons/fi";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
const PAGE_CONFIG = {
  "home": { route: "/", label: "Головна сторінка", icon: "🏠", defaultSchemaType: "localbusiness" },
  "delivery": { route: "/delivery", label: "Доставка", icon: "🚚", defaultSchemaType: "article" },
  "contacts": { route: "/contacts", label: "Контакти", icon: "📞", defaultSchemaType: "localbusiness" }
};
const ROUTE_TO_KEY = { "/": "home", "/delivery": "delivery", "/contacts": "contacts" };
const CORE_ROUTES = /* @__PURE__ */ new Set(["/", "/delivery", "/contacts"]);
function PageEditor() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [selectedPage, setSelectedPage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const [newPageData, setNewPageData] = useState({ route_path: "", name: "" });
  const activePageKey = searchParams.get("page") || "home";
  useEffect(() => {
    fetchPages();
  }, []);
  useEffect(() => {
    if (pages.length > 0) {
      if (searchParams.get("new") === "true") {
        setIsCreating(true);
        setSelectedPage(null);
        return;
      }
      setIsCreating(false);
      const customRoute = searchParams.get("custom");
      if (customRoute) {
        const match = pages.find((p) => p.route_path === customRoute);
        if (match) {
          setSelectedPage({ ...match });
        }
        return;
      }
      const cfg2 = PAGE_CONFIG[activePageKey];
      if (cfg2) {
        const match = pages.find((p) => p.route_path === cfg2.route);
        if (match) {
          setSelectedPage({ ...match });
        }
      }
    }
  }, [activePageKey, pages, searchParams]);
  const fetchPages = async () => {
    try {
      const response = await api.get("/admin/pages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(response.data);
    } catch (error) {
      console.error("Failed to fetch pages", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { id, route_path, ...updateData } = selectedPage;
      await api.patch(`/admin/pages/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Сторінку оновлено! ✨");
      fetchPages();
    } catch (error) {
      console.error("Save failed", error);
      alert("Помилка при збереженні");
    } finally {
      setIsSaving(false);
    }
  };
  const handleCreatePage = async () => {
    if (!newPageData.route_path || !newPageData.name) {
      alert("Заповніть URL та назву сторінки");
      return;
    }
    let route = newPageData.route_path.trim();
    if (!route.startsWith("/")) route = "/" + route;
    try {
      const res = await api.post("/admin/pages", {
        route_path: route,
        name: newPageData.name.trim(),
        meta_title: newPageData.name.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Сторінку створено! ✨");
      setIsCreating(false);
      setNewPageData({ route_path: "", name: "" });
      await fetchPages();
      setSearchParams({ custom: res.data.route_path });
    } catch (error) {
      console.error("Create failed", error);
      alert("Помилка при створенні. Можливо, такий URL вже існує.");
    }
  };
  const handleDeletePage = async () => {
    if (!selectedPage || CORE_ROUTES.has(selectedPage.route_path)) return;
    if (!confirm(`Видалити сторінку "${selectedPage.name}"?`)) return;
    try {
      await api.delete(`/admin/pages/${selectedPage.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Сторінку видалено");
      setSelectedPage(null);
      setSearchParams({});
      fetchPages();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Помилка при видаленні");
    }
  };
  const update = (field, value) => {
    setSelectedPage((prev) => ({ ...prev, [field]: value }));
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" }) });
  pages.filter((p) => !CORE_ROUTES.has(p.route_path));
  if (isCreating) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-xl font-bold text-gray-900 flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx(FiPlus, { className: "text-orange-500" }),
        "Створити нову сторінку"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "Назва сторінки" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: newPageData.name,
              onChange: (e) => setNewPageData((prev) => ({ ...prev, name: e.target.value })),
              className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none",
              placeholder: "Наприклад: Про нас, FAQ, Блог"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "URL сторінки" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-sm font-mono", children: "/page/" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: newPageData.route_path,
                onChange: (e) => setNewPageData((prev) => ({ ...prev, route_path: e.target.value.replace(/[^a-z0-9-]/g, "") })),
                className: "flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none font-mono",
                placeholder: "faq"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-1 ml-1", children: [
            "Сторінка буде доступна за адресою: site.com/page/",
            newPageData.route_path || "slug"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setIsCreating(false);
                setSearchParams({});
              },
              className: "px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all",
              children: "Скасувати"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleCreatePage,
              className: "flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-md shadow-orange-200 transition-all active:scale-95",
              children: [
                /* @__PURE__ */ jsx(FiPlus, {}),
                "Створити"
              ]
            }
          )
        ] })
      ] })
    ] }) });
  }
  const cfg = selectedPage ? PAGE_CONFIG[ROUTE_TO_KEY[selectedPage.route_path]] || { icon: "📄", label: selectedPage.name } : null;
  if (!selectedPage || !cfg) return /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-400", children: "Сторінку не знайдено" });
  const isCustomPage = !CORE_ROUTES.has(selectedPage.route_path);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-xl font-bold text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl", children: cfg.icon }),
          cfg.label
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-xs font-mono mt-1", children: selectedPage.route_path }),
        isCustomPage && /* @__PURE__ */ jsxs("p", { className: "text-xs text-orange-500 font-medium mt-1", children: [
          "Доступна на сайті: /page",
          selectedPage.route_path
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        isCustomPage && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleDeletePage,
            className: "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-all",
            children: [
              /* @__PURE__ */ jsx(FiTrash2, {}),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Видалити" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSave,
            disabled: isSaving,
            className: `flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600 transition-all ${isSaving ? "opacity-70 cursor-not-allowed" : "active:scale-95"}`,
            children: [
              isSaving ? /* @__PURE__ */ jsx("div", { className: "animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" }) : /* @__PURE__ */ jsx(FiSave, {}),
              /* @__PURE__ */ jsx("span", { children: "ЗБЕРЕГТИ" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FiSettings, { className: "text-orange-500" }),
        "SEO налаштування"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "Meta Title" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: selectedPage.meta_title || "",
                onChange: (e) => update("meta_title", e.target.value),
                className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none",
                placeholder: "Назва для пошукових систем"
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-0.5 ml-1", children: [
              (selectedPage.meta_title || "").length,
              "/60"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "H1 Заголовок" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: selectedPage.h1_heading || "",
                onChange: (e) => update("h1_heading", e.target.value),
                className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none font-bold",
                placeholder: "Головний заголовок на сторінці"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "Meta Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: "3",
              value: selectedPage.meta_description || "",
              onChange: (e) => update("meta_description", e.target.value),
              className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none resize-none",
              placeholder: "Опис для пошукової видачі Google (до 160 символів)"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-0.5 ml-1", children: [
            (selectedPage.meta_description || "").length,
            "/160"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500",
              checked: selectedPage.is_indexable !== false,
              onChange: (e) => update("is_indexable", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Індексувати сторінку" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Якщо вимкнено — noindex, nofollow" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FiInfo, { className: "text-orange-500" }),
        "Контент сторінки"
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "Текст сторінки (HTML)" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mb-2 ml-1", children: "Підтримується HTML: <h2>, <p>, <ul>, <ol>, <b>, <i>, <img>" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: selectedPage.content || "",
            onChange: (e) => update("content", e.target.value),
            className: "w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none min-h-[250px] font-mono",
            placeholder: "<h2>Заголовок</h2>\\n<p>Текст сторінки...</p>"
          }
        )
      ] }),
      selectedPage.content && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "Попередній перегляд" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "prose prose-gray max-w-none bg-gray-50 border border-gray-200 rounded-2xl p-6 prose-headings:font-bold prose-p:text-gray-600 prose-a:text-orange-600",
            dangerouslySetInnerHTML: { __html: selectedPage.content }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1", children: "SEO текст (внизу сторінки)" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: selectedPage.bottom_seo_text || "",
            onChange: (e) => update("bottom_seo_text", e.target.value),
            className: "w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm outline-none min-h-[120px] font-mono",
            placeholder: "HTML текст для SEO блоку..."
          }
        )
      ] })
    ] })
  ] });
}
export {
  PageEditor as default
};
//# sourceMappingURL=PageEditor-B-AsxV3M.js.map
