import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { u as useAuth, b as useCategories, a as api } from "../entry-server.js";
import { FiGrid, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "@react-oauth/google";
import "react-icons/fa";
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const { token } = useAuth();
  const { categories } = useCategories();
  const NAV_CATEGORIES = [
    { id: "all", name: "Усі товари", icon: /* @__PURE__ */ jsx(FiGrid, {}) },
    ...categories.map((c) => ({ id: c.slug, name: c.name }))
  ];
  const fetchProducts = async (category) => {
    setLoading(true);
    try {
      const params = category !== "all" ? { category } : {};
      const response = await api.get("/products/", { params });
      const data = response.data;
      setProducts(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Ви впевнені, що хочете видалити товар "${productName}"?`)) return;
    try {
      await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Помилка при видаленні товару. Можливо у вас немає прав.");
    }
  };
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);
  return /* @__PURE__ */ jsx("div", { className: "max-w-6xl", children: /* @__PURE__ */ jsxs("div", { className: "flex-grow", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Товари" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: selectedCategory === "all" ? "Керування усім асортиментом" : `Керування категорією: ${NAV_CATEGORIES.find((c) => c.id === selectedCategory)?.name}` })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/admin/products/new",
          className: "flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-200 active:scale-95 w-full sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(FiPlus, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { children: "Додати товар" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto", children: loading ? /* @__PURE__ */ jsxs("div", { className: "p-20 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium", children: "Завантаження товарів..." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-gray-600 min-w-[700px]", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "ID" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Фото" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Назва" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Ціна" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Дії" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: products.length > 0 ? products.map((product) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors group", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 font-medium text-gray-400 text-xs", children: [
            "#",
            product.id
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-yellow-200 transition-colors", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: product.image_url && product.image_url.startsWith("http") ? product.image_url : `${api.defaults.baseURL}${product.image_url}`,
              alt: product.name,
              className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            }
          ) }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900", children: product.name }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 uppercase mt-0.5", children: product.category })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: product.price }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 ml-1", children: "₴" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/admin/products/edit/${product.id}`,
                className: "inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-bold transition-all",
                title: "Редагувати",
                children: /* @__PURE__ */ jsx(FiEdit2, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(product.id, product.name),
                className: "inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all font-bold",
                title: "Видалити",
                children: /* @__PURE__ */ jsx(FiTrash2, { className: "w-4 h-4" })
              }
            )
          ] }) })
        ] }, product.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-20 text-center text-gray-500", children: "Товарів у цій категорії поки що немає" }) }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden divide-y divide-gray-100", children: products.length > 0 ? products.map((product) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-4 bg-white hover:bg-gray-50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: product.image_url && product.image_url.startsWith("http") ? product.image_url : `${api.defaults.baseURL}${product.image_url}`,
            alt: product.name,
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 py-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 text-sm truncate leading-tight w-4/5", children: product.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400 ml-2", children: [
              "#",
              product.id
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 uppercase mt-0.5 tracking-wider font-medium", children: product.category }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end mt-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-gray-900 text-sm", children: [
              product.price,
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 font-normal", children: "₴" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: `/admin/products/edit/${product.id}`,
                  className: "p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100",
                  children: /* @__PURE__ */ jsx(FiEdit2, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(product.id, product.name),
                  className: "p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-100",
                  children: /* @__PURE__ */ jsx(FiTrash2, { className: "w-4 h-4" })
                }
              )
            ] })
          ] })
        ] })
      ] }, product.id)) : /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-gray-500", children: "Товарів у цій категорії поки що немає" }) })
    ] }) })
  ] }) });
}
export {
  Products as default
};
//# sourceMappingURL=Products-8D6lj1jp.js.map
