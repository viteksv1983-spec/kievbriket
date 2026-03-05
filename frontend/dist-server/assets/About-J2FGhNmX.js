import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { FaTree, FaFire, FaTruck } from "react-icons/fa";
import { S as SEOHead, s as shopConfig } from "../entry-server.js";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
function About() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", style: { background: "linear-gradient(160deg, #111827 0%, #1f2937 40%, #111827 100%)" }, children: [
    /* @__PURE__ */ jsx(SEOHead, { title: `Про нас | Заготівля дров ${shopConfig.name}` }),
    /* @__PURE__ */ jsxs("header", { className: "relative h-[65vh] flex items-center justify-center overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/about/firewood-about-banner.jpg",
          alt: `${shopConfig.name} Banner`,
          className: "absolute inset-0 w-full h-full object-cover opacity-60"
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0",
          style: { background: "linear-gradient(to bottom, rgba(17,24,39,0.3) 0%, rgba(17,24,39,0.8) 100%)" }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-[0.3em] text-[#e67e22] mb-4", children: shopConfig.name }),
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "text-5xl md:text-8xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-2xl",
            style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
            children: "Про нас"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-[#e67e22] mx-auto mb-6 rounded-full" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/80 text-lg md:text-xl tracking-wide", children: "Тепло та затишок у вашому домі — наша головна мета" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-6 py-20 md:py-28", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center mb-20", children: [
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6",
            style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
            children: [
              "Якісні дрова від ",
              /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "надійного постачальника" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[#e67e22] mx-auto mb-8 rounded-full" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-white/70 leading-relaxed italic", children: '"Ми не просто продаємо дрова — ми забезпечуємо вас теплом на всю зиму, гарантуючи якість кожного поліна."' })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative rounded-3xl overflow-hidden shadow-2xl group border border-white/10",
            style: { boxShadow: "0 0 40px rgba(230,126,34,0.1)" },
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/about/firewood-pile-2.jpg",
                  alt: "Якісні та сухі дрова",
                  className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0",
                  style: { background: "linear-gradient(to top, rgba(17,24,39,0.6), transparent)" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(
            "h3",
            {
              className: "text-3xl font-black text-white uppercase tracking-tight",
              style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
              children: [
                "Гарантія якості та ",
                /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "Об'єму" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-white/70 text-lg leading-relaxed", children: [
            "Наша деревина проходить суворий відбір. Ми постачаємо дрова без гнилі та трухи, забезпечуючи оптимальну вологість для ефективного горіння. Головний наш принцип — ",
            /* @__PURE__ */ jsx("strong", { children: "чесний об'єм" }),
            '. Ви отримуєте рівно стільки складометрів, за скільки заплатили, без "коефіцієнтів укладання".'
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#e67e22]/30",
                style: { background: "rgba(230,126,34,0.1)" },
                children: [
                  /* @__PURE__ */ jsx(FaTree, { className: "text-[#e67e22]" }),
                  /* @__PURE__ */ jsx("span", { className: "font-black text-sm text-white uppercase tracking-wide", children: "Екологічна деревина" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10",
                style: { background: "rgba(255,255,255,0.05)" },
                children: [
                  /* @__PURE__ */ jsx(FaFire, { className: "text-[#e74c3c]" }),
                  /* @__PURE__ */ jsx("span", { className: "font-black text-sm text-white uppercase tracking-wide", children: "Висока тепловіддача" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "section",
      {
        className: "py-20 md:py-28 relative overflow-hidden",
        style: { background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none",
              style: { background: "radial-gradient(circle, #e67e22, transparent)" }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-[0.3em] text-[#e67e22] mb-4", children: "Наш підхід" }),
                /* @__PURE__ */ jsxs(
                  "h2",
                  {
                    className: "text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4",
                    style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
                    children: [
                      "Від лісгоспу до вашого ",
                      /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "каміна" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-[#e67e22] font-black italic text-lg", children: "— Прямі поставки без посередників" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-white/70 text-lg leading-relaxed", children: "Ми працюємо на ринку твердого палива вже понад 5 років. Починаючи з невеликих об'ємів, ми виросли до підприємства з власним автопарком та великим складом у Києві. Завдяки прямим контрактам з лісництвами, ми пропонуємо стабільні ціни та гарантуємо легальність кожної партії деревини." }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center gap-5 p-6 rounded-2xl border border-[#e67e22]/30",
                  style: { background: "rgba(230,126,34,0.1)" },
                  children: [
                    /* @__PURE__ */ jsx(FaTruck, { className: "text-4xl text-[#e67e22] flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-black text-white uppercase tracking-wide", children: "Власний автопарк" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-white/60 uppercase tracking-widest mt-1", children: "Доставка від 2 до 15 скл.м." })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute -inset-4 rounded-3xl opacity-20 blur-2xl",
                  style: { background: "linear-gradient(135deg, #e67e22, #d35400)" }
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative rounded-3xl overflow-hidden shadow-2xl border border-white/10",
                  style: { boxShadow: "0 0 50px rgba(230,126,34,0.15)" },
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: "/about/firewood-truck.jpg",
                        alt: "Доставка дров вантажівками",
                        className: "w-full h-full object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute inset-0",
                        style: { background: "linear-gradient(to top, rgba(17,24,39,0.7), transparent 50%)" }
                      }
                    )
                  ]
                }
              )
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-6 py-20 md:py-28", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tight",
            style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
            children: [
              shopConfig.name,
              " у ",
              /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "цифрах" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[#e67e22] mx-auto mt-5 rounded-full" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5", children: [
        { label: "Років на ринку", val: "5+", icon: "⏳" },
        { label: "Задоволених клієнтів", val: "3000+", icon: "🤝" },
        { label: "Машин у парку", val: "8", icon: "🚛" },
        { label: "Складометрів на рік", val: "10 000+", icon: "🪵" }
      ].map((stat, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#e67e22]/40",
          style: { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl mb-3", children: stat.icon }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-4xl font-black text-[#e67e22] mb-2",
                style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
                children: stat.val
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: stat.label })
          ]
        },
        i
      )) })
    ] })
  ] });
}
export {
  About as default
};
//# sourceMappingURL=About-J2FGhNmX.js.map
