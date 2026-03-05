import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { b as useAuth, a as api } from "../entry-server.js";
import { FiPlus, FiEdit2 } from "react-icons/fi";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
function SEOPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  useEffect(() => {
    fetchPages();
  }, []);
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
  const handleCreate = () => {
    setEditingPage({
      route_path: "/",
      name: "",
      meta_title: "",
      meta_description: "",
      h1_heading: ""
    });
    setIsEditing(true);
  };
  const handleEdit = (page) => {
    setEditingPage(page);
    setIsEditing(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingPage.id) {
        await api.patch(`/admin/pages/${editingPage.id}`, editingPage, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post("/admin/pages", editingPage, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsEditing(false);
      setEditingPage(null);
      fetchPages();
      alert("Збережено!");
    } catch (error) {
      console.error("Failed to save page", error);
      alert("Помилка збереження");
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { children: "Завантаження..." });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "SEO Статичних Сторінок" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleCreate,
          className: "flex items-center justify-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors shrink-0",
          children: [
            /* @__PURE__ */ jsx(FiPlus, {}),
            /* @__PURE__ */ jsx("span", { children: "Додати сторінку" })
          ]
        }
      )
    ] }),
    isEditing ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-6", children: editingPage.id ? "Редагування" : "Нова сторінка" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "URL (Route Path)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: editingPage.route_path,
              onChange: (e) => setEditingPage({ ...editingPage, route_path: e.target.value }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
              placeholder: "/ або /catalog"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Назва (для адмінки)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: editingPage.name,
              onChange: (e) => setEditingPage({ ...editingPage, name: e.target.value }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
              placeholder: "Головна сторінка"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold mb-4 text-gray-900", children: "SEO Дані" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Meta Title" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: editingPage.meta_title || "",
                  onChange: (e) => setEditingPage({ ...editingPage, meta_title: e.target.value }),
                  className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Meta Description" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: "3",
                  value: editingPage.meta_description || "",
                  onChange: (e) => setEditingPage({ ...editingPage, meta_description: e.target.value }),
                  className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "H1 Heading" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: editingPage.h1_heading || "",
                  onChange: (e) => setEditingPage({ ...editingPage, h1_heading: e.target.value }),
                  className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 mt-8", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setIsEditing(false),
            className: "px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg",
            children: "Скасувати"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700",
            children: "Зберегти"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-gray-600 min-w-[600px]", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-900 font-bold uppercase text-xs", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "URL" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 hidden sm:table-cell", children: "Назва" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Title" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 hidden md:table-cell", children: "H1" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Дії" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: pages.map((page) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-mono text-xs", children: page.route_path }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium text-gray-900 hidden sm:table-cell", children: page.name }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 truncate max-w-[150px] sm:max-w-[200px]", title: page.meta_title, children: page.meta_title }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 hidden md:table-cell", children: page.h1_heading }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleEdit(page),
            className: "inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors",
            children: [
              /* @__PURE__ */ jsx(FiEdit2, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Редагувати" })
            ]
          }
        ) })
      ] }, page.id)) })
    ] }) })
  ] });
}
export {
  SEOPages as default
};
//# sourceMappingURL=SEOPages-DzKVOXzR.js.map
