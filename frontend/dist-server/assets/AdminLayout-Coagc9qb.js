import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { c as useAuth, a as api, d as useCategories } from "../entry-server.js";
import { useLocation, Link, Outlet } from "react-router-dom";
import { FiX, FiMenu, FiShoppingBag, FiPackage, FiGrid, FiImage, FiPlus, FiLayers, FiHome, FiMessageCircle, FiBarChart2, FiUsers, FiUser, FiLogOut } from "react-icons/fi";
import { Flame } from "lucide-react";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "react-icons/fa";
function AdminLayout() {
  const { logout, token, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState({ orders: false });
  const [customPages, setCustomPages] = useState([]);
  const CORE_ROUTES = /* @__PURE__ */ new Set(["/", "/delivery", "/contacts"]);
  useEffect(() => {
    if (!token) return;
    api.get("/admin/pages", { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      if (Array.isArray(res.data)) {
        setCustomPages(res.data.filter((p) => !CORE_ROUTES.has(p.route_path)));
      }
    }).catch(() => {
    });
  }, [location.search, token]);
  const isActive = (path) => location.pathname === path;
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get("category") || "all";
  const activeStatus = searchParams.get("status") || "all";
  const ORDER_STATUSES = [
    { id: "all", name: "Усі", icon: /* @__PURE__ */ jsx(FiGrid, { className: "w-3.5 h-3.5" }) },
    { id: "pending", name: "Очікують", color: "bg-amber-400" },
    { id: "processing", name: "В роботі", color: "bg-blue-400" },
    { id: "completed", name: "Виконано", color: "bg-green-400" },
    { id: "cancelled", name: "Скасовано", color: "bg-gray-400" }
  ];
  const { categories } = useCategories();
  const MAIN_CATS = categories;
  const getEmoji = (slug) => {
    const emojis = {
      oak: "🌳",
      birch: "🌿",
      pine: "🌲",
      alder: "🔥",
      mixed: "🪵",
      brikety: "🧱"
    };
    return emojis[slug] || "✨";
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-gray-50 font-sans", children: [
    /* @__PURE__ */ jsxs("header", { className: "lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.4)] flex-shrink-0", children: /* @__PURE__ */ jsx(Flame, { size: 18, color: "#fff", strokeWidth: 2.2 }) }),
        /* @__PURE__ */ jsxs("span", { className: "font-black tracking-tight text-lg", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-900", children: "Київ" }),
          /* @__PURE__ */ jsx("span", { className: "text-orange-500", children: "Брикет" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-medium ml-1.5 text-sm", children: "Admin" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsSidebarOpen(!isSidebarOpen),
          className: "p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors",
          children: isSidebarOpen ? /* @__PURE__ */ jsx(FiX, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(FiMenu, { className: "w-6 h-6" })
        }
      )
    ] }),
    isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity",
        onClick: () => setIsSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `
                w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50 transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-100 hidden lg:flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.4)] flex-shrink-0", children: /* @__PURE__ */ jsx(Flame, { size: 18, color: "#fff", strokeWidth: 2.2 }) }),
            /* @__PURE__ */ jsxs("span", { className: "font-black tracking-tight text-xl", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-900", children: "Київ" }),
              /* @__PURE__ */ jsx("span", { className: "text-orange-500", children: "Брикет" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-medium ml-1.5 text-base", children: "Admin" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto mt-16 lg:mt-0", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setExpanded((p) => ({ ...p, orders: !p.orders })),
                className: `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive("/admin/orders") || expanded.orders ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(FiShoppingBag, { className: "w-5 h-5" }),
                    /* @__PURE__ */ jsx("span", { children: "Замовлення" })
                  ] }),
                  expanded.orders ? /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 15l7-7 7 7" }) }) : /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
                ]
              }
            ),
            (isActive("/admin/orders") || expanded.orders) && /* @__PURE__ */ jsx("div", { className: "ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in", children: ORDER_STATUSES.map((status) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/admin/orders${status.id !== "all" ? `?status=${status.id}` : ""}`,
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeStatus === status.id && isActive("/admin/orders") ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                children: [
                  status.icon ? status.icon : /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `w-2 h-2 rounded-full ${status.color}`
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: status.name })
                ]
              },
              `order-${status.id}`
            )) }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/products",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/products") || location.pathname.startsWith("/admin/products/edit") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiPackage, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Товари" })
                ]
              }
            ),
            (isActive("/admin/products") || location.pathname.startsWith("/admin/products/edit")) && /* @__PURE__ */ jsxs("div", { className: "ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/admin/products",
                  onClick: () => setIsSidebarOpen(false),
                  className: `flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeCategory === "all" ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                  children: [
                    /* @__PURE__ */ jsx(FiGrid, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx("span", { children: "Усі товари" })
                  ]
                }
              ),
              MAIN_CATS.map((cat) => /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/admin/products?category=${cat.slug}`,
                  onClick: () => setIsSidebarOpen(false),
                  className: `flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeCategory === cat.slug ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: getEmoji(cat.slug) }),
                    /* @__PURE__ */ jsx("span", { children: cat.name })
                  ]
                },
                cat.slug
              ))
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/categories",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/categories") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiImage, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Категорії товарів" })
                ]
              }
            ),
            isActive("/admin/categories") && /* @__PURE__ */ jsxs("div", { className: "ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in", children: [
              MAIN_CATS.map((cat) => /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/admin/categories?edit=${cat.slug}`,
                  onClick: () => setIsSidebarOpen(false),
                  className: `flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get("edit") === cat.slug ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: getEmoji(cat.slug) }),
                    /* @__PURE__ */ jsx("span", { children: cat.name })
                  ]
                },
                `edit-${cat.slug}`
              )),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/admin/categories?new=true",
                  onClick: () => setIsSidebarOpen(false),
                  className: `flex items-center gap-2 py-2 mt-1 pt-3 border-t border-gray-100 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get("new") === "true" ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                  children: [
                    /* @__PURE__ */ jsx(FiPlus, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx("span", { children: "Додати категорію" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/seo",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/seo") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiLayers, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Сторінки" })
                ]
              }
            ),
            isActive("/admin/seo") && /* @__PURE__ */ jsxs("div", { className: "ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in", children: [
              [
                { key: "home", icon: "🏠", label: "Головна", route: "/" },
                { key: "delivery", icon: "🚚", label: "Доставка", route: "/delivery" },
                { key: "contacts", icon: "📞", label: "Контакти", route: "/contacts" }
              ].map((p) => {
                const activePage = searchParams.get("page") || "home";
                return /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: `/admin/seo?page=${p.key}`,
                    onClick: () => setIsSidebarOpen(false),
                    className: `flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activePage === p.key && !searchParams.get("new") && !searchParams.get("custom") ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { children: p.icon }),
                      /* @__PURE__ */ jsx("span", { children: p.label })
                    ]
                  },
                  p.key
                );
              }),
              customPages.map((cp) => /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/admin/seo?custom=${cp.route_path}`,
                  onClick: () => setIsSidebarOpen(false),
                  className: `flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get("custom") === cp.route_path ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: "📄" }),
                    /* @__PURE__ */ jsx("span", { children: cp.name })
                  ]
                },
                `custom-${cp.route_path}`
              )),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/admin/seo?new=true",
                  onClick: () => setIsSidebarOpen(false),
                  className: `flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${searchParams.get("new") === "true" ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`,
                  children: [
                    /* @__PURE__ */ jsx(FiPlus, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx("span", { children: "Додати сторінку" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/hero",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/hero") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiHome, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Головна" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/delivery",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/delivery") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiPackage, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Транспорт (Доставка)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/reviews",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/reviews") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiMessageCircle, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Відгуки" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/faqs",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/faqs") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiLayers, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "FAQ (Питання)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/telegram",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/telegram") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiMessageCircle, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Telegram" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/settings",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/settings") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiBarChart2, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Google Analytics" })
                ]
              }
            ),
            user?.is_superadmin && /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/users",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/users") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiUsers, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Користувачі" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin/profile",
                onClick: () => setIsSidebarOpen(false),
                className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/profile") ? "bg-orange-500 text-white shadow-md shadow-orange-100 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
                children: [
                  /* @__PURE__ */ jsx(FiUser, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Мій профіль" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-gray-100", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/",
                className: "flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-antreme-red mb-2 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(FiHome, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "На головну сайту" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: logout,
                className: "flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200",
                children: [
                  /* @__PURE__ */ jsx(FiLogOut, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Вийти" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("main", { className: "flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as default
};
//# sourceMappingURL=AdminLayout-Coagc9qb.js.map
