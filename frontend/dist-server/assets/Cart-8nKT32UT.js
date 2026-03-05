import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { C as CartContext, A as AuthContext, f as usePhoneInput, S as SEOHead, b as api, g as getProductUrl } from "../entry-server.js";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { phoneProps, rawPhone, digits: phoneDigits } = usePhoneInput();
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    deliveryDate: "",
    // Added for checkout flow
    deliveryMethod: cartItems.length > 0 ? cartItems[0].deliveryMethod || "pickup" : "pickup"
  });
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!customerDetails.name || phoneDigits.length < 10 || !customerDetails.deliveryDate) {
      setError(
        "Будь ласка, вкажіть ваше ім'я, номер телефону та бажану дату отримання."
      );
      setIsCheckingOut(false);
      return;
    }
    if (phoneDigits.length < 10) {
      setError(
        "Будь ласка, введіть повний номер телефону (10 цифр після +38)."
      );
      setIsCheckingOut(false);
      return;
    }
    try {
      const firstItem = cartItems[0];
      const orderData = {
        customer_name: customerDetails.name,
        customer_phone: rawPhone,
        delivery_method: customerDetails.deliveryMethod,
        delivery_date: customerDetails.deliveryDate,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          flavor: item.flavor,
          weight: item.weight
        }))
      };
      console.log("Submitting order:", orderData);
      const response = await api.post("/orders/", orderData);
      console.log("Order submitted successfully:", response.data);
      clearCart();
      setIsSuccess(true);
    } catch (err) {
      console.error("Checkout failed:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
        setError(
          `Помилка сервера: ${JSON.stringify(err.response.data.detail || err.response.data)}`
        );
      } else {
        setError(
          "Не вдалося оформити замовлення. Будь ласка, перевірте підключення та спробуйте ще раз."
        );
      }
    } finally {
      setIsCheckingOut(false);
    }
  };
  if (isSuccess) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#F8F3EE] flex flex-col justify-center items-center p-4 text-center", children: [
      /* @__PURE__ */ jsx(
        SEOHead,
        {
          title: "Замовлення прийнято | Firewood",
          description: "Дякуємо за замовлення піддонів із дровами! Ваше замовлення успішно прийнято в обробку."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "bg-green-100 p-8 rounded-full shadow-lg mb-6 animate-bounce", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-16 h-16 text-green-600",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "3",
              d: "M5 13l4 4L19 7"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-gray-800 mb-2 font-serif uppercase tracking-widest", children: "Дякуємо за замовлення!" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-8 max-w-md mx-auto text-lg", children: "Ваше замовлення успішно прийнято в обробку. Наш менеджер зв'яжеться з вами найближчим часом для уточнення деталей доставки." }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "bg-amber-700 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1",
          children: "Продовжити покупки"
        }
      ) })
    ] });
  }
  if (cartItems.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#F8F3EE] flex flex-col justify-center items-center p-4 text-center", children: [
      /* @__PURE__ */ jsx(
        SEOHead,
        {
          title: "Кошик порожній | Firewood",
          description: "Ваш кошик поки що порожній. Перегляньте наш каталог і оберіть необхідні дрова."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "bg-white p-8 rounded-full shadow-lg mb-6", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-16 h-16 text-amber-700",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-2 font-serif uppercase tracking-wider", children: "Ваш Кошик Порожній" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-8 max-w-md mx-auto", children: "Схоже, ви ще не зробили свій вибір. Перегляньте наш каталог, щоб знайти потрібні вам дрова." }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "bg-amber-700 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-red-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1",
          children: "Перейти до каталогу"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#F8F3EE] py-12 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Оформлення замовлення | Кошик | Firewood",
        description: "Перевірте ваше замовлення та оформіть доставку дров."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-wide border-b-2 border-amber-600 pb-4 inline-block", children: "Кошик покупок" }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-xl overflow-hidden border-t-4 border-amber-700", children: [
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-100", children: cartItems.map((item) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "p-6 sm:flex sm:items-center hover:bg-gray-50 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "h-24 w-24 flex-shrink-0 overflow-hidden border border-gray-200 bg-white shadow-sm rounded-xl", children: /* @__PURE__ */ jsx(
                Link,
                {
                  to: getProductUrl(item),
                  state: { fromCategory: item.category },
                  className: "hover:opacity-80 transition-opacity block h-full w-full",
                  children: item.image_url && /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: item.image_url.startsWith("http") ? item.image_url : `${api.defaults.baseURL}${item.image_url}`,
                      alt: item.name,
                      className: "h-full w-full object-cover object-center"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "ml-4 flex-1 flex flex-col sm:ml-6", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-medium text-gray-900", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        Link,
                        {
                          to: getProductUrl(item),
                          state: { fromCategory: item.category },
                          className: "hover:text-amber-700 transition-colors inline-block text-gray-900",
                          children: /* @__PURE__ */ jsx("h3", { className: "uppercase tracking-wide font-bold text-lg", children: item.name })
                        }
                      ),
                      item.flavor && /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-700 font-bold mt-1 uppercase tracking-wider flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-amber-700 rounded-full" }),
                        "Начинка: ",
                        item.flavor
                      ] }),
                      item.weight && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 font-bold mt-1 uppercase tracking-wider flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full" }),
                        "Вага: ",
                        item.weight,
                        " кг"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "ml-4 text-amber-700 font-bold text-xl", children: [
                      item.price * item.quantity,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 font-normal", children: "грн" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-gray-500", children: [
                    item.price,
                    " грн / шт"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-end justify-between text-sm mt-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-gray-300 rounded-lg overflow-hidden", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => updateQuantity(
                          item.id,
                          item.flavor,
                          item.weight,
                          item.deliveryDate,
                          item.deliveryMethod,
                          item.quantity - 1
                        ),
                        className: "w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors",
                        children: "-"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "w-12 h-10 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200 bg-gray-50/50", children: item.quantity }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => updateQuantity(
                          item.id,
                          item.flavor,
                          item.weight,
                          item.deliveryDate,
                          item.deliveryMethod,
                          item.quantity + 1
                        ),
                        className: "w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors",
                        children: "+"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeFromCart(
                        item.id,
                        item.flavor,
                        item.weight,
                        item.deliveryDate,
                        item.deliveryMethod
                      ),
                      className: "font-bold text-gray-400 hover:text-amber-700 transition-colors uppercase tracking-widest text-[10px] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50",
                      children: [
                        /* @__PURE__ */ jsx(
                          "svg",
                          {
                            className: "w-4 h-4",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: "2",
                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              }
                            )
                          }
                        ),
                        "Видалити"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          `${item.id}-${item.flavor}-${item.weight}`
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "border-t-2 border-gray-100 p-8 bg-gray-50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-medium text-gray-900 mb-4", children: [
            /* @__PURE__ */ jsx("p", { className: "uppercase tracking-wide font-bold text-lg", children: "Підсумок" }),
            /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold text-amber-700", children: [
              cartTotal.toFixed(2),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-lg text-gray-500 font-normal", children: "грн" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-gray-500 mb-6", children: "Доставка оплачується окремо за тарифами служби таксі." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Ваше Ім'я" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "name",
                  value: customerDetails.name,
                  onChange: handleDetailsChange,
                  placeholder: "Введіть ваше ім'я",
                  className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Ваш Телефон" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ...phoneProps,
                  name: "phone",
                  className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Дата отримання" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  name: "deliveryDate",
                  value: customerDetails.deliveryDate,
                  onChange: handleDetailsChange,
                  onClick: (e) => e.target.showPicker(),
                  min: new Date(Date.now() + 2 * 864e5).toISOString().split("T")[0],
                  className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all outline-none text-gray-900 font-medium cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-1 italic", children: "* Мінімальний термін замовлення — 2-3 дні" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Спосіб отримання" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "deliveryMethod",
                    value: customerDetails.deliveryMethod,
                    onChange: handleDetailsChange,
                    className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all outline-none text-gray-900 font-medium appearance-none cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "pickup", children: "🏪 Самовивіз" }),
                      /* @__PURE__ */ jsx("option", { value: "uklon", children: "🚕 Доставка Uklon" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        d: "M19 9l-7 7-7-7"
                      }
                    )
                  }
                ) })
              ] })
            ] })
          ] }),
          error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-2 border-amber-700 rounded-xl p-4 mb-6 text-center animate-pulse", children: /* @__PURE__ */ jsx("p", { className: "text-red-700 font-bold", children: error }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleCheckout,
              disabled: isCheckingOut,
              className: `w-full flex justify-center items-center bg-amber-700 border border-transparent py-4 px-4 text-lg font-bold uppercase tracking-widest text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isCheckingOut ? "opacity-75 cursor-not-allowed" : ""}`,
              children: isCheckingOut ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
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
                ),
                "Обробка замовлення..."
              ] }) : "Оформити замовлення"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center text-center text-sm text-gray-500", children: /* @__PURE__ */ jsxs("p", { children: [
            "або",
            " ",
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/",
                className: "font-medium text-amber-700 hover:text-red-800 uppercase tracking-wide ml-1",
                children: [
                  "Продовжити покупки",
                  /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " →" })
                ]
              }
            )
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Cart as default
};
//# sourceMappingURL=Cart-8nKT32UT.js.map
