import React, { useEffect } from "react";
import { X } from "lucide-react";

const sections = [
    {
        title: "1. Загальні положення",
        text: `ТОВ «Київ Брикет» (далі — «Компанія») поважає конфіденційність своїх клієнтів і зобов'язується захищати персональні дані, які ви надаєте нам під час використання сайту kievbriket.com. Ця політика описує, які дані ми збираємо, як ми їх використовуємо та які маєте права.`,
    },
    {
        title: "2. Які дані ми збираємо",
        text: `При заповненні форми замовлення ми отримуємо: ваше ім'я, номер телефону та, за бажанням, коментар до замовлення. Ми не збираємо дані банківських карток, паролі або іншу чутливу фінансову інформацію.`,
    },
    {
        title: "3. Мета збору даних",
        text: `Зібрані дані використовуються виключно для: зв'язку з вами щодо замовлення, уточнення деталей доставки, покращення якості обслуговування. Ми не передаємо ваші дані третім особам без вашої згоди, за винятком випадків, передбачених законодавством України.`,
    },
    {
        title: "4. Зберігання даних",
        text: `Ваші дані зберігаються на захищених серверах протягом строку, необхідного для виконання замовлення та відповідно до вимог законодавства. Після закінчення цього строку дані видаляються або знеособлюються.`,
    },
    {
        title: "5. Cookies",
        text: `Сайт може використовувати файли cookie для поліпшення роботи та аналізу трафіку. Ви можете вимкнути cookies у налаштуваннях браузера, проте це може вплинути на функціональність сайту.`,
    },
    {
        title: "6. Ваші права",
        text: `Відповідно до Закону України «Про захист персональних даних» ви маєте право: дізнатися, які дані про вас зберігаються, вимагати їх виправлення або видалення, відкликати згоду на обробку. Для реалізації прав зв'яжіться з нами за телефоном +38 067 883 28 10.`,
    },
    {
        title: "7. Контакти",
        text: `З питань щодо обробки персональних даних: телефон +38 067 883 28 10, +38 099 665 74 77; адреса: вул. Колекторна, 19, Київ. ТОВ «Київ Брикет».`,
    },
];

export function PrivacyModal({ onClose }) {
    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", fn);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", fn);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "1.5rem",
            }}
        >
            <div style={{
                background: "var(--c-surface)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 18,
                width: "100%",
                maxWidth: 680,
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
                overflow: "hidden",
            }}>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.5rem 2rem",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    flexShrink: 0,
                }}>
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--c-text)" }}>
                        Політика конфіденційності
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: 8, width: 34, height: 34,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "var(--c-text2)", cursor: "pointer", transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div style={{ overflowY: "auto", padding: "2rem", lineHeight: 1.75 }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--c-text3)", marginBottom: 24 }}>
                        Останнє оновлення: лютий 2026 р.
                    </p>

                    {sections.map((s) => (
                        <section key={s.title} style={{ marginBottom: 28 }}>
                            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 8 }}>
                                {s.title}
                            </h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--c-text2)" }}>{s.text}</p>
                        </section>
                    ))}
                </div>

                <div style={{
                    padding: "1.25rem 2rem",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    flexShrink: 0,
                    display: "flex", justifyContent: "flex-end",
                }}>
                    <button onClick={onClose} className="nh-btn-primary" style={{ padding: "10px 28px" }}>
                        Зрозуміло
                    </button>
                </div>
            </div>
        </div>
    );
}
