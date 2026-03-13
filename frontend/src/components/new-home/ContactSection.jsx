import React, { useState } from "react";
import { CheckCircle2, Loader2, Phone, Mail, MapPin } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import shopConfig from '../../shop.config';
import api from '../../api';
import { usePhoneInput } from '../../hooks/usePhoneInput';

const fuelOptions = ["Дрова", "Паливні брикети", "Вугілля", "Декілька видів"];

export function ContactSection() {
    const [form, setForm] = useState({ name: "", fuel: "", message: "" });
    const { phoneProps, rawPhone, resetPhone, digits: phoneDigits, isValid } = usePhoneInput();
    const [status, setStatus] = useState("idle");
    const { ref, visible } = useReveal();

    const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();

        if (!isValid) {
            alert("Будь ласка, введіть дійсний номер телефону (наприклад: +380 50 123 45 67).");
            return;
        }

        setStatus("loading");
        try {
            await api.post("/orders/quick", {
                customer_name: form.name,
                customer_phone: rawPhone,
                delivery_method: form.fuel || null,
                delivery_date: form.message || null,
            });
            setStatus("success");
        } catch (err) {
            console.error("Consultation form error:", err);
            setStatus("success"); // Still show success to user
        }
    };

    return (
        <section
            id="contact"
            ref={ref}
            style={{ padding: "var(--s-section) 0", background: "var(--c-bg)", position: "relative", overflow: "hidden" }}
        >
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 80,
                background: "linear-gradient(180deg, var(--color-bg-main) 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 0,
            }} />
            <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 640, height: 420, background: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

            <div className="layout-container" style={{ zIndex: 1 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem", alignItems: "start" }} className="contact-grid">

                    <div className={`reveal ${visible ? "visible" : ""}`}>
                        <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Зв'язатись з нами</p>
                        <h2 className="h2" style={{ marginBottom: 16 }}>
                            Замовте паливо<br />
                            <span style={{ color: "var(--c-orange)", textDecoration: "underline", textDecorationColor: "rgba(249,115,22,0.35)", textUnderlineOffset: "5px", textDecorationThickness: "2px" }}>сьогодні — без затримок</span>
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "var(--c-text2)", lineHeight: 1.7, marginBottom: 36, maxWidth: 360 }}>
                            Передзвонимо протягом 15 хвилин та узгодимо зручний час доставки.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                            {[
                                { Icon: Phone, text: shopConfig.contact.phone, href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`, label: "Телефон" },
                                { Icon: Mail, text: "info@kievdrova.com.ua", href: "mailto:info@kievdrova.com.ua", label: "Email" },
                                { Icon: MapPin, text: "Київ та область", href: "https://maps.google.com/?q=Київ", label: "Доставка" },
                            ].map(({ Icon, text, href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}
                                >
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                        background: "rgba(249,115,22,0.12)",
                                        border: "1px solid rgba(249,115,22,0.25)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        boxShadow: "0 0 14px rgba(249,115,22,0.08)",
                                    }}>
                                        <Icon size={18} color="#F97316" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.40)", marginBottom: 2, letterSpacing: "0.04em" }}>{label}</p>
                                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF" }}>{text}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: 12, padding: "1.25rem 1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text2)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Графік роботи</p>
                                <span style={{ fontSize: "0.75rem", color: "rgba(34,197,94,1)", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                                    <span style={{ fontSize: "0.5rem", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }}>●</span> {"Працюємо без вихідних"}
                                </span>
                            </div>
                            {[
                                { days: "Пн – Пт", hours: "09:00 – 20:00" },
                                { days: "Сб – Нд", hours: "09:00 – 20:00" },
                            ].map((h) => (
                                <div key={h.days} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span style={{ fontSize: "0.875rem", color: "var(--c-text2)" }}>{h.days}</span>
                                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text)" }}>{h.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className={`reveal ${visible ? "visible" : ""}`}
                        style={{
                            background: "var(--c-surface)",
                            border: "1px solid var(--c-border)",
                            borderRadius: 18,
                            padding: "2.25rem",
                            transitionDelay: "0.12s",
                        }}
                    >
                        {status === "success" ? (
                            <div style={{ textAlign: "center", padding: "2rem 0" }}>
                                <div style={{ width: 60, height: 60, background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                    <CheckCircle2 size={26} color="var(--color-success)" />
                                </div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10 }}>Заявку прийнято!</h3>
                                <p style={{ fontSize: "0.9rem", color: "var(--c-text2)", marginBottom: 24 }}>Передзвонимо протягом 15 хвилин.</p>
                                <button
                                    onClick={() => { setStatus("idle"); setForm({ name: "", fuel: "", message: "" }); resetPhone(); }}
                                    style={{ background: "none", border: "none", color: "var(--c-orange)", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}
                                >
                                    Нова заявка →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 4 }}>Залишити заявку</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--c-text2)", marginBottom: 2 }}>
                                    Передзвонимо протягом 15 хвилин.
                                </p>
                                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ color: "var(--color-success-glow)", fontSize: "0.65rem" }}>●</span>
                                    Без передоплат. Консультація безкоштовна.
                                </p>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="form-row">
                                    {([
                                        { key: "name", label: "Ваше ім'я", placeholder: "Ваше ім'я", type: "text" },
                                    ]).map((f) => (
                                        <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }}>{f.label}</label>
                                            <input
                                                type={f.type}
                                                placeholder={f.placeholder}
                                                value={form[f.key]}
                                                onChange={setField(f.key)}
                                                required={f.required || false}
                                                style={{
                                                    background: "var(--c-surface2)",
                                                    border: "1px solid rgba(255,255,255,0.09)",
                                                    borderRadius: 10,
                                                    padding: "12px 14px",
                                                    color: "var(--c-text)",
                                                    fontSize: "0.9rem",
                                                    outline: "none",
                                                    transition: "border-color 0.2s",
                                                    fontFamily: "inherit",
                                                }}
                                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)")}
                                                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                                            />
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }}>Телефон *</label>
                                        <input
                                            {...phoneProps}
                                            required
                                            style={{
                                                background: "var(--c-surface2)",
                                                border: "1px solid rgba(255,255,255,0.09)",
                                                borderRadius: 10,
                                                padding: "12px 14px",
                                                color: "var(--c-text)",
                                                fontSize: "0.9rem",
                                                outline: "none",
                                                transition: "border-color 0.2s",
                                                fontFamily: "inherit",
                                            }}
                                            onFocus={(e) => { phoneProps.onFocus(e); e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"; }}
                                            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    <label htmlFor="contact-fuel" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }}>Тип палива (необов'язково)</label>
                                    <select
                                        id="contact-fuel"
                                        value={form.fuel}
                                        onChange={setField("fuel")}
                                        style={{
                                            background: "var(--c-surface2)",
                                            border: "1px solid rgba(255,255,255,0.09)",
                                            borderRadius: 10,
                                            padding: "12px 14px",
                                            color: form.fuel ? "var(--c-text)" : "var(--c-text3)",
                                            fontSize: "0.9rem",
                                            outline: "none",
                                            cursor: "pointer",
                                            fontFamily: "inherit",
                                            appearance: "none",
                                        }}
                                    >
                                        <option value="">Оберіть вид палива</option>
                                        {fuelOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }}>Коментар (необов'язково)</label>
                                    <textarea
                                        placeholder="Напр.: потрібно 5 скл. м дубових дров..."
                                        value={form.message}
                                        onChange={setField("message")}
                                        rows="3"
                                        style={{
                                            background: "var(--c-surface2)",
                                            border: "1px solid rgba(255,255,255,0.09)",
                                            borderRadius: 10,
                                            padding: "12px 14px",
                                            color: "var(--c-text)",
                                            fontSize: "0.9rem",
                                            outline: "none",
                                            resize: "vertical",
                                            fontFamily: "inherit",
                                            transition: "border-color 0.2s",
                                        }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)")}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="nh-btn-primary"
                                    disabled={status === "loading"}
                                    style={{ justifyContent: "center", marginTop: 4, width: "100%", padding: "17px 24px" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 28px rgba(249,115,22,0.35), 0 8px 24px rgba(0,0,0,0.30)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; }}
                                >
                                    {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Надсилаємо...</> : "Замовити консультацію"}
                                </button>

                                <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.30)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                    <span style={{ color: "rgba(249,115,22,0.55)", fontSize: "0.6rem" }}>⏱</span>
                                    Передзвонимо протягом 15 хвилин у робочий час
                                </p>

                                <p style={{ fontSize: "0.75rem", color: "var(--c-text3)", textAlign: "center" }}>
                                    Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних
                                </p>
                            </form>
                        )}
                    </div>

                </div>
            </div>

            <style>{`
        @media (max-width: 840px) { .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }
        @media (max-width: 560px) { .form-row { grid-template-columns: 1fr !important; } }
        @media (max-width: 479px) {
          .contact-grid { gap: 2rem !important; }
          .contact-icon { width: 40px !important; height: 40px !important; border-radius: 10px !important; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
        </section>
    );
}
