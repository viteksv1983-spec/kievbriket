import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { b as api } from "../entry-server.js";
import { FiCheck, FiSave } from "react-icons/fi";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
function SiteSettingsPage() {
  const [gaId, setGaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    api.get("/admin/site-settings", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then((res) => {
      setGaId(res.data.ga_tracking_id || "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/site-settings", {
        ga_tracking_id: gaId.trim() || null
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage({ type: "success", text: "Збережено!" });
      setTimeout(() => setMessage(null), 3e3);
    } catch {
      setMessage({ type: "error", text: "Помилка збереження" });
    }
    setSaving(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", padding: "4rem" }, children: /* @__PURE__ */ jsx("div", { style: { width: 24, height: 24, border: "3px solid #e5e7eb", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.6s linear infinite" } }) });
  }
  return /* @__PURE__ */ jsxs("div", { style: { maxWidth: 640 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: "2rem" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: 4 }, children: "📊 Google Analytics" }),
      /* @__PURE__ */ jsx("p", { style: { color: "#6b7280", fontSize: "0.875rem" }, children: "Вставте код відстеження Google Analytics. Він буде працювати на всіх сторінках сайту." })
    ] }),
    message && /* @__PURE__ */ jsxs("div", { style: {
      padding: "12px 16px",
      borderRadius: 12,
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: "0.875rem",
      fontWeight: 500,
      background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
      color: message.type === "success" ? "#15803d" : "#dc2626",
      border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`
    }, children: [
      /* @__PURE__ */ jsx(FiCheck, { style: { flexShrink: 0 } }),
      message.text
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        padding: "1.5rem",
        marginBottom: "1.5rem"
      }, children: [
        /* @__PURE__ */ jsx("label", { style: {
          display: "block",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#374151",
          marginBottom: 8
        }, children: "Tracking ID (Measurement ID)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: gaId,
            onChange: (e) => setGaId(e.target.value),
            placeholder: "G-XXXXXXXXXX",
            style: {
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              fontSize: "0.9375rem",
              fontFamily: "monospace",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box"
            },
            onFocus: (e) => e.target.style.borderColor = "#f97316",
            onBlur: (e) => e.target.style.borderColor = "#d1d5db"
          }
        ),
        /* @__PURE__ */ jsx("p", { style: { color: "#9ca3af", fontSize: "0.75rem", marginTop: 6 }, children: "Знайдіть його в Google Analytics → Адмін → Потоки даних → Ідентифікатор" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#fffbeb",
        borderRadius: 12,
        border: "1px solid #fde68a",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        fontSize: "0.8125rem",
        color: "#92400e",
        lineHeight: 1.6
      }, children: [
        /* @__PURE__ */ jsx("strong", { children: "💡 Підказка:" }),
        " Вставте тільки Measurement ID (наприклад ",
        /* @__PURE__ */ jsx("code", { style: { background: "#fef3c7", padding: "1px 6px", borderRadius: 4 }, children: "G-ABC123XYZ" }),
        "). Скрипти gtag автоматично додадуться на всі сторінки сайту."
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: saving,
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            background: saving ? "#d1d5db" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
            fontFamily: "inherit"
          },
          children: [
            /* @__PURE__ */ jsx(FiSave, { size: 16 }),
            saving ? "Збереження..." : "Зберегти"
          ]
        }
      )
    ] })
  ] });
}
export {
  SiteSettingsPage as default
};
//# sourceMappingURL=SiteSettingsPage-BRMDvs2f.js.map
