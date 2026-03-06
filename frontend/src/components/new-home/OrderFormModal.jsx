import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import api from "../../api";
import { usePhoneInput } from "../../hooks/usePhoneInput";

const fuelOptions = ["Дрова", "Паливні брикети", "Вугілля", "Декілька видів"];

export function OrderFormModal({ isOpen, onClose, product, variant }) {
    const [form, setForm] = useState({ name: "", fuel: "", message: "", quantity: 1 });
    const { phoneValue, phoneProps, rawPhone, resetPhone } = usePhoneInput();
    const [status, setStatus] = useState("idle");

    const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            // Reset form when closed
            setTimeout(() => {
                setStatus("idle");
                setForm({ name: "", fuel: "", message: "", quantity: 1 });
                resetPhone();
            }, 300);
        }
    }, [isOpen]);

    const submit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const payload = {
                customer_name: form.name.trim() || 'Клієнт',
                customer_phone: rawPhone,
                cake_id: product ? product.id : null,
                quantity: form.quantity || 1,
                flavor: variant ? variant.name : form.fuel,
                weight: product ? product.weight : null
            };

            // Append optional message to flavor if there's no dedicated message field, 
            // but we have a comment field. Let's send the message in flavor for now
            if (form.message) {
                payload.flavor = (payload.flavor ? payload.flavor + ' | ' : '') + 'Коментар: ' + form.message;
            }

            await api.post('/orders/quick', payload);
            setStatus("success");
            setForm({ name: "", fuel: "", message: "", quantity: 1 });
            resetPhone();
        } catch (error) {
            console.error("Order submission failed:", error);
            alert("Сталася помилка при відправці. Спробуйте ще раз або зателефонуйте нам.");
            setStatus("idle");
        }
    };

    if (!isOpen) return null;

    const inputStyle = {
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 10,
        padding: "13px 16px",
        color: "#fff",
        fontSize: "0.9rem",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        fontFamily: "inherit",
        width: "100%",
        boxSizing: "border-box",
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 9998,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(6px)",
                    animation: "ofm-fade-in 0.25s ease",
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: "fixed",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    width: "100%",
                    maxWidth: 520,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "linear-gradient(165deg, #181c24 0%, #12151b 100%)",
                    border: "1px solid rgba(249,115,22,0.12)",
                    borderRadius: 20,
                    padding: "2rem 2rem 1.75rem",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(249,115,22,0.06)",
                    animation: "ofm-slide-up 0.3s ease",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: 16, right: 16,
                        width: 36, height: 36, borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "rgba(255,255,255,0.5)",
                        transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                >
                    <X size={18} />
                </button>

                {status === "success" ? (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <div style={{
                            width: 64, height: 64,
                            background: "rgba(34,197,94,0.12)",
                            border: "1px solid rgba(34,197,94,0.25)",
                            borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 20px",
                        }}>
                            <CheckCircle2 size={28} color="#22C55E" />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", marginBottom: 10 }}>Заявку прийнято!</h3>
                        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>Передзвонимо протягом 15 хвилин.</p>
                        <button
                            onClick={onClose}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "1rem",
                                border: "none",
                                borderRadius: 12,
                                padding: "14px 32px",
                                margin: "0 auto",
                                cursor: "pointer",
                                boxShadow: "0 4px 18px rgba(249,115,22,0.25)",
                            }}
                        >
                            Закрити
                        </button>
                    </div>
                ) : (
                    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: 2, paddingRight: 32 }}>
                            Залишити заявку
                        </h3>
                        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.50)", marginBottom: 0 }}>
                            Передзвонимо протягом 15 хвилин.
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: "#22C55E", fontSize: "0.65rem" }}>●</span>
                            Без передоплат. Консультація безкоштовна.
                        </p>

                        {/* Name + Phone row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="ofm-row">
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Ваше ім'я</label>
                                <input
                                    type="text"
                                    placeholder="Іван"
                                    value={form.name}
                                    onChange={setField("name")}
                                    style={inputStyle}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.50)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.10)"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.boxShadow = "none"; }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Телефон *</label>
                                <input
                                    {...phoneProps}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => { phoneProps.onFocus(e); e.currentTarget.style.borderColor = "rgba(249,115,22,0.50)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.10)"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.boxShadow = "none"; }}
                                />
                            </div>
                        </div>

                        {/* Product Info or Fuel select */}
                        {product ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Обраний товар</label>
                                <div style={{ ...inputStyle, background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.2)" }}>
                                    <span style={{ fontWeight: 800, color: "#fff" }}>{product.name}</span>
                                    {variant && <span style={{ color: "#22c55e", ml: 2, marginLeft: '8px' }}>({variant.name})</span>}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label htmlFor="ofm-fuel" style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Тип палива</label>
                                <select
                                    id="ofm-fuel"
                                    value={form.fuel}
                                    onChange={setField("fuel")}
                                    style={{
                                        ...inputStyle,
                                        color: form.fuel ? "#fff" : "rgba(255,255,255,0.35)",
                                        cursor: "pointer",
                                        appearance: "none",
                                    }}
                                >
                                    <option value="" style={{ background: "#1e1e1e", color: "#ccc" }}>Оберіть вид палива</option>
                                    {fuelOptions.map((o) => <option key={o} value={o} style={{ background: "#1e1e1e", color: "#fff" }}>{o}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Quantity */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                            <label htmlFor="ofm-quantity" style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Кількість (складометрів / шт)</label>
                            <div style={{ display: "flex", alignItems: "center", ...inputStyle, padding: "4px" }}>
                                <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))} style={{ background: "transparent", border: "none", color: "#fff", padding: "10px 15px", cursor: "pointer", fontSize: "1.2rem", fontWeight: 800 }}>-</button>
                                <input
                                    id="ofm-quantity"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={form.quantity}
                                    onChange={(e) => setForm(f => ({ ...f, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                                    style={{ flex: 1, background: "transparent", border: "none", color: "#fff", textAlign: "center", fontSize: "1rem", fontWeight: 700, outline: "none", width: "100%", padding: 0 }}
                                />
                                <button type="button" onClick={() => setForm(f => ({ ...f, quantity: f.quantity + 1 }))} style={{ background: "transparent", border: "none", color: "#fff", padding: "10px 15px", cursor: "pointer", fontSize: "1.2rem", fontWeight: 800 }}>+</button>
                            </div>
                        </div>

                        {/* Comment */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Коментар (необов'язково)</label>
                            <textarea
                                placeholder="Напр.: потрібно 5 скл. м дубових дров..."
                                value={form.message}
                                onChange={setField("message")}
                                rows="3"
                                style={{
                                    ...inputStyle,
                                    resize: "vertical",
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.50)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.10)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.boxShadow = "none"; }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "1rem",
                                border: "none",
                                borderRadius: 12,
                                padding: "17px 24px",
                                width: "100%",
                                marginTop: 4,
                                cursor: "pointer",
                                boxShadow: "0 4px 18px rgba(249,115,22,0.25)",
                                letterSpacing: "0.01em",
                                transition: "opacity 0.2s",
                                opacity: status === "loading" ? 0.7 : 1,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 28px rgba(249,115,22,0.45), 0 8px 24px rgba(0,0,0,0.30)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(249,115,22,0.25)"; }}
                        >
                            {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Надсилаємо...</> : "Замовити"}
                        </button>

                        <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.30)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <span style={{ color: "rgba(249,115,22,0.55)", fontSize: "0.6rem" }}>⏱</span>
                            Передзвонимо протягом 15 хвилин у робочий час
                        </p>

                        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                            Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних
                        </p>
                    </form>
                )}
            </div>

            <style>{`
                @keyframes ofm-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ofm-slide-up {
                    from { opacity: 0; transform: translate(-50%, -46%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
                @media (max-width: 560px) {
                    .ofm-row { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}
