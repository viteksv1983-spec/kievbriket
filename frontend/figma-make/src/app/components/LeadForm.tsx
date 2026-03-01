import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success";

const fuelOptions = ["Дрова", "Топливні брикети", "Вугілля", "Не визначились"];

export function LeadForm() {
  const [form, setForm] = useState({ name: "", phone: "", fuel: "", volume: "" });
  const [status, setStatus] = useState<Status>("idle");

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // TODO: replace with real API call (e.g. POST /api/orders)
    setTimeout(() => setStatus("success"), 1200);
  };

  return (
    <section id="contact" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-orange-600 text-sm mb-2" style={{ fontWeight: 600 }}>
              Замовлення
            </p>
            <h2
              className="text-stone-900 mb-3"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Залиште заявку — передзвонимо
            </h2>
            <p className="text-stone-500 text-sm">
              Менеджер зв'яжеться з вами протягом 15 хвилин і узгодить деталі доставки.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
            {status === "success" ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <h3 className="text-stone-900 mb-2" style={{ fontWeight: 700 }}>
                  Заявку прийнято!
                </h3>
                <p className="text-stone-500 text-sm">
                  Очікуйте дзвінка від нашого менеджера.
                </p>
                <button
                  onClick={() => { setStatus("idle"); setForm({ name: "", phone: "", fuel: "", volume: "" }); }}
                  className="mt-6 text-orange-600 text-sm hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  Надіслати ще одну
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-stone-700 text-sm" style={{ fontWeight: 500 }}>
                      Ваше ім'я
                    </label>
                    <input
                      type="text"
                      placeholder="Іван Петренко"
                      value={form.name}
                      onChange={set("name")}
                      className="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 bg-white outline-none focus:border-orange-400 transition-colors placeholder:text-stone-300"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-stone-700 text-sm" style={{ fontWeight: 500 }}>
                      Номер телефону *
                    </label>
                    <input
                      type="tel"
                      placeholder="+38 (067) 000-00-00"
                      value={form.phone}
                      onChange={set("phone")}
                      required
                      className="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 bg-white outline-none focus:border-orange-400 transition-colors placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fuel type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-stone-700 text-sm" style={{ fontWeight: 500 }}>
                      Тип палива
                    </label>
                    <select
                      value={form.fuel}
                      onChange={set("fuel")}
                      className="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 bg-white outline-none focus:border-orange-400 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Оберіть тип</option>
                      {fuelOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Volume */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-stone-700 text-sm" style={{ fontWeight: 500 }}>
                      Орієнтовний обсяг
                    </label>
                    <input
                      type="text"
                      placeholder="напр. 5 складометрів"
                      value={form.volume}
                      onChange={set("volume")}
                      className="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 bg-white outline-none focus:border-orange-400 transition-colors placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-1"
                  style={{ fontWeight: 600 }}
                >
                  {status === "loading" ? (
                    <><Loader2 size={16} className="animate-spin" /> Надсилаємо...</>
                  ) : (
                    "Замовити дзвінок"
                  )}
                </button>

                <p className="text-center text-stone-400 text-xs">
                  Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
