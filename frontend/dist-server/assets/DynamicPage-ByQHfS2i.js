import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { b as api } from "../entry-server.js";
import "react-dom/server";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/pages/by-route`, { params: { route: `/${slug}` } }).then((res) => {
      setPage(res.data);
    }).catch((err) => {
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      }
      console.error("Failed to load page", err);
    }).finally(() => setLoading(false));
  }, [slug]);
  useEffect(() => {
    if (page?.meta_title) {
      document.title = page.meta_title;
    }
    return () => {
      document.title = "КиївБрикет";
    };
  }, [page]);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" }) });
  if (notFound || !page) return /* @__PURE__ */ jsxs("div", { className: "min-h-[60vh] flex flex-col items-center justify-center text-center px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-6xl font-black text-gray-200 mb-4", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg mb-6", children: "Сторінку не знайдено" }),
    /* @__PURE__ */ jsx(Link, { to: "/", className: "px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all", children: "На головну" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 min-h-[60vh]", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-[#1A1A2E] to-[#16213E] py-12 md:py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-black text-white leading-tight", children: page.h1_heading || page.name || page.meta_title }),
      page.meta_description && /* @__PURE__ */ jsx("p", { className: "text-white/60 mt-3 max-w-2xl text-sm md:text-base leading-relaxed", children: page.meta_description })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14", children: [
      page.content ? /* @__PURE__ */ jsx(
        "div",
        {
          className: "prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg",
          dangerouslySetInnerHTML: { __html: page.content }
        }
      ) : /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-center py-10", children: "Контент цієї сторінки ще не заповнено." }),
      page.bottom_seo_text && /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "prose prose-sm prose-gray max-w-none text-gray-500",
          dangerouslySetInnerHTML: { __html: page.bottom_seo_text }
        }
      ) })
    ] })
  ] });
}
export {
  DynamicPage as default
};
//# sourceMappingURL=DynamicPage-ByQHfS2i.js.map
