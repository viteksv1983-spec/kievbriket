import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { c as useAuth, a as api } from "../entry-server.js";
import { FiCheck, FiEdit2, FiPlus, FiVideo, FiTrash2 } from "react-icons/fi";
import "react-dom/server";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "axios";
import "lucide-react";
import "react-icons/fa";
function ReviewSettings() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    date: "",
    stars: 5,
    text: "",
    youtube_url: "",
    is_active: true,
    sort_order: 0
  });
  useEffect(() => {
    if (token) fetchReviews();
  }, [token]);
  const fetchReviews = async () => {
    try {
      const res = await api.get("/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  const handleEdit = (review) => {
    setEditingId(review.id);
    setFormData({
      name: review.name,
      city: review.city || "",
      date: review.date || "",
      stars: review.stars,
      text: review.text,
      youtube_url: review.youtube_url || "",
      is_active: review.is_active,
      sort_order: review.sort_order
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цей відгук?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/admin/reviews/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: "success", text: "Відгук оновлено!" });
      } else {
        await api.post("/admin/reviews", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: "success", text: "Відгук додано!" });
      }
      fetchReviews();
      resetForm();
      setTimeout(() => setMessage(null), 3e3);
    } catch (err) {
      setMessage({ type: "error", text: "Помилка збереження" });
    }
    setSaving(false);
  };
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      city: "",
      date: "",
      stars: 5,
      text: "",
      youtube_url: "",
      is_active: true,
      sort_order: 0
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", padding: "4rem" }, children: /* @__PURE__ */ jsx("div", { className: "spinner-border text-primary", role: "status" }) });
  }
  return /* @__PURE__ */ jsxs("div", { style: { maxWidth: 900 }, children: [
    /* @__PURE__ */ jsx("div", { style: { marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: 4 }, children: "💬 Відгуки" }),
      /* @__PURE__ */ jsx("p", { style: { color: "#6b7280", fontSize: "0.875rem" }, children: "Керування текстовими відгуками та відеовідгуками клієнтів." })
    ] }) }),
    message && /* @__PURE__ */ jsxs("div", { style: {
      padding: "12px 16px",
      borderRadius: 12,
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
      color: message.type === "success" ? "#15803d" : "#dc2626",
      border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`
    }, children: [
      /* @__PURE__ */ jsx(FiCheck, {}),
      " ",
      message.text
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "2rem" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }, children: editingId ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(FiEdit2, {}),
        " Редагувати відгук"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(FiPlus, {}),
        " Додати відгук"
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, style: { display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 2" }, children: [
          /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }, children: "Ім'я клієнта *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              required: true,
              type: "text",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: "form-input",
              placeholder: "Олена Ковальчук",
              style: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }, children: "Місто / Локація" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: formData.city,
              onChange: (e) => setFormData({ ...formData, city: e.target.value }),
              className: "form-input",
              placeholder: "Київ, Оболонь",
              style: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }, children: "Дата" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: formData.date,
              onChange: (e) => setFormData({ ...formData, date: e.target.value }),
              className: "form-input",
              placeholder: "Жовтень 2024",
              style: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }, children: "Оцінка (Зірки)" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: formData.stars,
              onChange: (e) => setFormData({ ...formData, stars: Number(e.target.value) }),
              style: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8 },
              children: [5, 4, 3, 2, 1].map((n) => /* @__PURE__ */ jsxs("option", { value: n, children: [
                n,
                " ⭐️"
              ] }, n))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }, children: "Сортування" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: formData.sort_order,
              onChange: (e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 }),
              className: "form-input",
              style: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 2" }, children: [
          /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }, children: "Текст відгуку *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              required: true,
              value: formData.text,
              onChange: (e) => setFormData({ ...formData, text: e.target.value }),
              rows: 4,
              className: "form-input",
              style: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 2" }, children: [
          /* @__PURE__ */ jsxs("label", { style: { fontSize: "0.875rem", fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsx(FiVideo, { color: "#f97316" }),
            " Посилання на відео YouTube (опціонально)"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              value: formData.youtube_url,
              onChange: (e) => setFormData({ ...formData, youtube_url: e.target.value }),
              className: "form-input",
              placeholder: "https://youtube.com/shorts/... або https://youtu.be/...",
              style: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8 }
            }
          ),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "#6b7280", marginTop: 4 }, children: "Якщо вказано посилання, над відгуком з'явиться відео." })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 2", display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", id: "isActive", checked: formData.is_active, onChange: (e) => setFormData({ ...formData, is_active: e.target.checked }) }),
          /* @__PURE__ */ jsx("label", { htmlFor: "isActive", style: { fontSize: "0.875rem", fontWeight: 500 }, children: "Показувати на сайті" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 2", display: "flex", gap: 12, marginTop: "1rem" }, children: [
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: saving, style: { background: "#f97316", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }, children: saving ? "Збереження..." : editingId ? "Оновити" : "Створити" }),
          editingId && /* @__PURE__ */ jsx("button", { type: "button", onClick: resetForm, style: { background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }, children: "Скасувати" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "1rem" }, children: reviews.map((r) => /* @__PURE__ */ jsxs("div", { style: { background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }, children: [
          /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontWeight: 700, fontSize: "1rem" }, children: r.name }),
          r.stars && /* @__PURE__ */ jsxs("span", { style: { color: "#f97316", fontSize: "0.875rem", fontWeight: 600 }, children: [
            r.stars,
            " ⭐️"
          ] }),
          !r.is_active && /* @__PURE__ */ jsx("span", { style: { background: "#fee2e2", color: "#dc2626", padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", fontWeight: 600 }, children: "Приховано" })
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { margin: 0, fontSize: "0.875rem", color: "#4b5563", marginBottom: 12, lineHeight: 1.5 }, children: [
          '"',
          r.text,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, fontSize: "0.8rem", color: "#6b7280" }, children: [
          r.city && /* @__PURE__ */ jsxs("span", { children: [
            "📍 ",
            r.city
          ] }),
          r.date && /* @__PURE__ */ jsxs("span", { children: [
            "📅 ",
            r.date
          ] }),
          r.youtube_url && /* @__PURE__ */ jsxs("span", { style: { color: "#2563eb", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }, children: [
            /* @__PURE__ */ jsx(FiVideo, {}),
            " Є відео"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(r), style: { background: "#f3f4f6", border: "none", padding: 8, borderRadius: 8, cursor: "pointer", color: "#4b5563" }, title: "Редагувати", children: /* @__PURE__ */ jsx(FiEdit2, {}) }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(r.id), style: { background: "#fee2e2", border: "none", padding: 8, borderRadius: 8, cursor: "pointer", color: "#dc2626" }, title: "Видалити", children: /* @__PURE__ */ jsx(FiTrash2, {}) })
      ] })
    ] }, r.id)) })
  ] });
}
export {
  ReviewSettings as default
};
//# sourceMappingURL=ReviewSettings-DRBVKOww.js.map
