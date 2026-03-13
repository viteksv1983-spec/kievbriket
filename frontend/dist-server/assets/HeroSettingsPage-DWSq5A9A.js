import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { a as api } from "../entry-server.js";
import { FiCheck, FiUpload, FiTrash2, FiPlus, FiSave } from "react-icons/fi";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
const DEFAULT_BADGES = [
  { emoji: "🔥", text: "Сухе паливо" },
  { emoji: "🚚", text: "Доставка по Києву сьогодні" },
  { emoji: "⭐", text: "1000+ клієнтів" }
];
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: "0.9375rem",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit"
};
const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  padding: "1.5rem",
  marginBottom: "1.5rem"
};
const labelStyle = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: 8
};
function HeroSettingsPage() {
  const [heroBadges, setHeroBadges] = useState(DEFAULT_BADGES);
  const [heroTrustText, setHeroTrustText] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    api.get("/admin/site-settings", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then((res) => {
      const d = res.data;
      setHeroTrustText(d.hero_trust_text || "");
      setHeroImageUrl(d.hero_image_url || "");
      if (d.hero_badges) {
        try {
          const parsed = JSON.parse(d.hero_badges);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHeroBadges(parsed);
          }
        } catch {
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/site-settings", {
        hero_badges: JSON.stringify(heroBadges.filter((b) => b.text.trim())),
        hero_trust_text: heroTrustText.trim() || null,
        hero_image_url: heroImageUrl.trim() || null
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
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setHeroImageUrl(res.data.image_url);
    } catch {
      setMessage({ type: "error", text: "Помилка завантаження зображення" });
    }
    setUploading(false);
  };
  const updateBadge = (index, field, value) => {
    setHeroBadges((prev) => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
  };
  const addBadge = () => {
    setHeroBadges((prev) => [...prev, { emoji: "✨", text: "" }]);
  };
  const removeBadge = (index) => {
    setHeroBadges((prev) => prev.filter((_, i) => i !== index));
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", padding: "4rem" }, children: /* @__PURE__ */ jsx("div", { style: { width: 24, height: 24, border: "3px solid #e5e7eb", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.6s linear infinite" } }) });
  }
  return /* @__PURE__ */ jsxs("div", { style: { maxWidth: 640 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: "2rem" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: 4 }, children: "🏠 Головна сторінка — Hero" }),
      /* @__PURE__ */ jsx("p", { style: { color: "#6b7280", fontSize: "0.875rem" }, children: "Бейджі на фото, рейтинг та банер головної сторінки." })
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
      /* @__PURE__ */ jsxs("div", { style: cardStyle, children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Фото банера" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [
          heroImageUrl && /* @__PURE__ */ jsx(
            "img",
            {
              src: heroImageUrl,
              alt: "Hero preview",
              style: {
                width: 120,
                height: 150,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                flexShrink: 0
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: heroImageUrl,
                onChange: (e) => setHeroImageUrl(e.target.value),
                placeholder: "/images/hero-bg.webp",
                style: { ...inputStyle, marginBottom: 8 },
                onFocus: (e) => e.target.style.borderColor = "#f97316",
                onBlur: (e) => e.target.style.borderColor = "#d1d5db"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                onChange: handleImageUpload,
                style: { display: "none" }
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                disabled: uploading,
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "#374151",
                  fontFamily: "inherit"
                },
                children: uploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { style: { width: 14, height: 14, border: "2px solid #d1d5db", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.6s linear infinite" } }),
                  " Завантаження..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(FiUpload, { size: 14 }),
                  " Завантажити нове фото"
                ] })
              }
            ),
            /* @__PURE__ */ jsx("p", { style: { color: "#9ca3af", fontSize: "0.7rem", marginTop: 6 }, children: "Рекомендований розмір: 600×750px, формат WebP або JPG" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: cardStyle, children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Бейджі на фото" }),
        /* @__PURE__ */ jsx("p", { style: { color: "#9ca3af", fontSize: "0.75rem", marginBottom: 12 }, children: "Плашки, що накладаються зверху на фото банера (емодзі + текст)." }),
        heroBadges.map((badge, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: badge.emoji,
              onChange: (e) => updateBadge(i, "emoji", e.target.value),
              placeholder: "🔥",
              style: { ...inputStyle, width: 56, textAlign: "center", fontSize: "1.1rem", padding: "8px 4px" },
              onFocus: (e) => e.target.style.borderColor = "#f97316",
              onBlur: (e) => e.target.style.borderColor = "#d1d5db"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: badge.text,
              onChange: (e) => updateBadge(i, "text", e.target.value),
              placeholder: "Текст бейджа...",
              style: { ...inputStyle, flex: 1 },
              onFocus: (e) => e.target.style.borderColor = "#f97316",
              onBlur: (e) => e.target.style.borderColor = "#d1d5db"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeBadge(i),
              style: {
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                color: "#dc2626"
              },
              title: "Видалити",
              children: /* @__PURE__ */ jsx(FiTrash2, { size: 14 })
            }
          )
        ] }, i)),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: addBadge,
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px dashed #d1d5db",
              background: "transparent",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
              color: "#6b7280",
              fontFamily: "inherit",
              marginTop: 4
            },
            children: [
              /* @__PURE__ */ jsx(FiPlus, { size: 14 }),
              " Додати бейдж"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: cardStyle, children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Текст рейтингу (плашка знизу фото)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: heroTrustText,
            onChange: (e) => setHeroTrustText(e.target.value),
            placeholder: "4.9 · 320+ відгуків",
            style: inputStyle,
            onFocus: (e) => e.target.style.borderColor = "#f97316",
            onBlur: (e) => e.target.style.borderColor = "#d1d5db"
          }
        ),
        /* @__PURE__ */ jsx("p", { style: { color: "#9ca3af", fontSize: "0.75rem", marginTop: 6 }, children: "Залиште порожнім, щоб використовувати значення за замовчуванням." })
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
            padding: "12px 28px",
            background: saving ? "#d1d5db" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "0.9375rem",
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
  HeroSettingsPage as default
};
//# sourceMappingURL=HeroSettingsPage-DWSq5A9A.js.map
