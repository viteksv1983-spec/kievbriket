import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { c as useAuth, g as getImageUrl, a as api } from "../entry-server.js";
import { FiUser, FiChevronRight, FiPackage, FiCopy, FiX, FiPhone } from "react-icons/fi";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const response = await api.get("/orders/", { params });
      const items = Array.isArray(response.data) ? response.data : response.data.items || [];
      const sorted = items.sort((a, b) => b.id - a.id);
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Помилка при оновленні статусу");
    }
  };
  const handleCopyOrder = (order) => {
    const itemsText = order.items.map(
      (item) => `- ${item.product?.name || "Дрова"} x${item.quantity}${item.flavor ? ` (${item.flavor})` : ""}${item.weight ? ` [${item.weight}${item.product?.category === "drova" ? "скл. м" : "кг"}]` : ""}`
    ).join("\n");
    const text = `📦 ЗАМОВЛЕННЯ #${order.id}
👤 Клієнт: ${order.customer_name || "Гість"}
📞 Телефон: ${order.customer_phone || "-"}
🚚 Доставка: ${order.delivery_method === "uklon" ? "🚕 Таксі" : "🏪 Самовивіз"}
📅 Дата: ${order.delivery_date || "-"}
🎂 Товари:
${itemsText}
💰 Сума: ${order.total_price} грн`;
    navigator.clipboard.writeText(text);
    alert("Деталі замовлення скопійовано!");
  };
  useEffect(() => {
    let mounted = true;
    if (token) {
      fetchOrders(statusFilter).then(() => {
        if (!mounted) return;
      });
    }
    return () => {
      mounted = false;
    };
  }, [token, statusFilter]);
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-20", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" }) });
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Замовлення" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Керування замовленнями" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-yellow-400 rounded-full animate-pulse" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-widest", children: "Live Updates" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-5xl", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs text-gray-600 min-w-[800px]", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-32", children: "ID & Дата" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-44", children: "Клієнт" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Товари" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-24 text-center", children: "Сума" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-48 text-right", children: "Статус" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-12" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: orders.map((order) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "hover:bg-yellow-50/30 transition-all group cursor-pointer",
            onClick: () => setSelectedOrder(order),
            children: [
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "font-bold text-gray-900 text-sm", children: [
                  "#",
                  order.id
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider", children: formatDate(order.created_at) })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors", children: /* @__PURE__ */ jsx(FiUser, { className: "w-4 h-4 text-gray-400" }) }),
                /* @__PURE__ */ jsxs("div", { className: "overflow-hidden", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 leading-tight truncate", children: order.customer_name || "Гість" }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-tight", children: order.customer_phone || "-" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                order.items && order.items.slice(0, 2).map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1.5 max-w-xs", children: [
                  /* @__PURE__ */ jsx("div", { className: "mt-1.5 w-1 h-1 bg-yellow-400 rounded-full flex-shrink-0" }),
                  /* @__PURE__ */ jsxs("div", { className: "truncate font-bold text-gray-800 text-[11px] leading-tight", children: [
                    item.product?.name || `Дрова #${item.product_id}`,
                    /* @__PURE__ */ jsxs("span", { className: "text-gray-400 ml-1 font-medium italic", children: [
                      "×",
                      item.quantity
                    ] })
                  ] })
                ] }, idx)),
                order.items && order.items.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-antreme-red font-bold uppercase ml-2.5", children: [
                  "+ ще ",
                  order.items.length - 2,
                  " тов."
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-block px-1.5 py-0.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-yellow-200 transition-colors", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 text-[13px]", children: order.total_price }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-400 ml-0.5", children: "₴" })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs(
                "select",
                {
                  value: order.status,
                  onChange: (e) => handleStatusChange(order.id, e.target.value),
                  className: `px-2 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all cursor-pointer focus:outline-none w-full min-w-[120px] text-center ${order.status === "completed" ? "bg-green-50 text-green-600 border-green-200" : order.status === "processing" ? "bg-blue-50 text-blue-600 border-blue-200" : order.status === "cancelled" ? "bg-gray-50 text-gray-400 border-gray-200" : "bg-amber-50 text-amber-600 border-amber-200"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "pending", children: "Очікує" }),
                    /* @__PURE__ */ jsx("option", { value: "processing", children: "В роботі" }),
                    /* @__PURE__ */ jsx("option", { value: "completed", children: "Виконано" }),
                    /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Скасовано" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-right", children: /* @__PURE__ */ jsx(FiChevronRight, { className: "w-4 h-4 text-gray-300 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" }) })
            ]
          },
          order.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden divide-y divide-gray-100", children: orders.map((order) => /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white hover:bg-yellow-50/20 active:bg-yellow-50/50 cursor-pointer", onClick: () => setSelectedOrder(order), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-gray-900 text-sm", children: [
              "#",
              order.id
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5", children: formatDate(order.created_at) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-gray-900 text-sm", children: [
            order.total_price,
            " ₴"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mb-4", children: [
          order.items && order.items.slice(0, 2).map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gray-50 flex-shrink-0 relative overflow-hidden shadow-sm border border-gray-100", children: item.product?.image_url ? /* @__PURE__ */ jsx(
              "img",
              {
                src: getImageUrl(item.product.image_url, api.defaults.baseURL),
                alt: "product",
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-gray-400", children: "?" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-gray-900 truncate", children: item.product?.name || `Дрова #${item.product_id}` }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400 font-medium italic mt-0.5", children: [
                item.quantity,
                " шт."
              ] })
            ] })
          ] }, idx)),
          order.items && order.items.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-antreme-red font-bold uppercase tracking-wider pl-1.5 mt-1", children: [
            "+ ще ",
            order.items.length - 2,
            " тов."
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
          /* @__PURE__ */ jsx(FiUser, { className: "w-3.5 h-3.5 text-gray-400 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-700 truncate", children: order.customer_name || "Гість" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end items-center", children: /* @__PURE__ */ jsx("div", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: order.status,
            onChange: (e) => handleStatusChange(order.id, e.target.value),
            className: `px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer focus:outline-none min-w-[110px] text-center ${order.status === "completed" ? "bg-green-50 text-green-600 border-green-200" : order.status === "processing" ? "bg-blue-50 text-blue-600 border-blue-200" : order.status === "cancelled" ? "bg-gray-50 text-gray-400 border-gray-200" : "bg-amber-50 text-amber-600 border-amber-200"}`,
            children: [
              /* @__PURE__ */ jsx("option", { value: "pending", children: "Очікує" }),
              /* @__PURE__ */ jsx("option", { value: "processing", children: "В роботі" }),
              /* @__PURE__ */ jsx("option", { value: "completed", children: "Виконано" }),
              /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Скасовано" })
            ]
          }
        ) }) })
      ] }, order.id)) }),
      orders.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 md:p-20 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100", children: /* @__PURE__ */ jsx(FiPackage, { className: "w-6 h-6 md:w-8 md:h-8 text-gray-300" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-bold text-gray-900", children: "Замовлень поки немає" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-gray-400 mt-1", children: "Як тільки з'явиться перше замовлення, воно відобразиться тут" })
      ] })
    ] }),
    selectedOrder && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity", onClick: () => setSelectedOrder(null), children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "w-full max-w-2xl bg-white shadow-2xl rounded-3xl animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900", children: [
                "Замовлення #",
                selectedOrder.id
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5", children: formatDate(selectedOrder.created_at) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleCopyOrder(selectedOrder),
                  className: "p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-antreme-red transition-all",
                  title: "Скопіювати для Telegram",
                  children: /* @__PURE__ */ jsx(FiCopy, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedOrder(null),
                  className: "p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-900 transition-all",
                  children: /* @__PURE__ */ jsx(FiX, { className: "w-5 h-5" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-8", children: [
            /* @__PURE__ */ jsxs("section", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4", children: "Клієнт" }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 border border-gray-100", children: /* @__PURE__ */ jsx(FiUser, { className: "w-6 h-6" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-gray-900 leading-tight", children: selectedOrder.customer_name || "Гість" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-antreme-red font-bold text-sm mt-1", children: [
                    /* @__PURE__ */ jsx(FiPhone, { className: "w-3.5 h-3.5" }),
                    selectedOrder.customer_phone || "-"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]", children: "Товари" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedOrder.items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "group relative flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex-shrink-0", children: item.product?.image_url && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: getImageUrl(item.product.image_url, api.defaults.baseURL),
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 py-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 text-sm truncate uppercase tracking-tight", children: item.product?.name || "Дрова" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 mt-1", children: [
                    item.flavor && /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold uppercase tracking-wider bg-red-50 text-antreme-red px-1.5 py-0.5 rounded border border-red-100", children: item.flavor }),
                    item.weight && /* @__PURE__ */ jsxs("span", { className: "text-[8px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100", children: [
                      item.weight,
                      " ",
                      item.product?.category === "drova" ? "скл. м" : "кг"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-2 text-[10px] font-bold text-gray-400", children: [
                    item.quantity,
                    " шт. × ",
                    Math.round(selectedOrder.total_price / selectedOrder.items.reduce((sum, i) => sum + i.quantity, 0)),
                    " ₴"
                  ] })
                ] })
              ] }, idx)) })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-yellow-400 transform translate-x-16 -translate-y-16 rotate-45 opacity-20 blur-2xl" }),
              /* @__PURE__ */ jsxs("div", { className: "relative flex justify-between items-end", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1", children: "Разом" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-yellow-400 drop-shadow-sm", children: [
                    selectedOrder.total_price,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-lg", children: "₴" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1", children: "Статус" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: selectedOrder.status,
                      onChange: (e) => handleStatusChange(selectedOrder.id, e.target.value),
                      className: "bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white/20 transition-all cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "pending", className: "text-gray-900", children: "Очікує" }),
                        /* @__PURE__ */ jsx("option", { value: "processing", className: "text-gray-900", children: "В роботі" }),
                        /* @__PURE__ */ jsx("option", { value: "completed", className: "text-gray-900", children: "Виконано" }),
                        /* @__PURE__ */ jsx("option", { value: "cancelled", className: "text-gray-900", children: "Скасовано" })
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
export {
  Orders as default
};
//# sourceMappingURL=Orders-nmLca-74.js.map
