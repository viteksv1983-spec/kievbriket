import { Truck, ShieldCheck, Wallet, Clock, Headphones, TreePine } from "lucide-react";

const items = [
  {
    icon: <Truck size={22} className="text-orange-600" />,
    title: "Доставка за 24 години",
    desc: "Власний автопарк. Доставляємо по місту та передмістю в обумовлений час.",
  },
  {
    icon: <ShieldCheck size={22} className="text-orange-600" />,
    title: "Гарантія якості",
    desc: "Сертифіковане паливо з перевірених джерел. Повернемо кошти, якщо щось не так.",
  },
  {
    icon: <Wallet size={22} className="text-orange-600" />,
    title: "Ціни без посередників",
    desc: "Працюємо напряму з виробниками. Великий обсяг — знижка від 5%.",
  },
  {
    icon: <Clock size={22} className="text-orange-600" />,
    title: "Зручний графік",
    desc: "Приймаємо замовлення 7 днів на тиждень з 8:00 до 20:00.",
  },
  {
    icon: <Headphones size={22} className="text-orange-600" />,
    title: "Консультація",
    desc: "Допоможемо підібрати оптимальне паливо під ваш котел або камін.",
  },
  {
    icon: <TreePine size={22} className="text-orange-600" />,
    title: "Легальна деревина",
    desc: "Тільки офіційні постачальники. Всі документи — ТТН та накладні.",
  },
];

export function Benefits() {
  return (
    <section id="about" className="bg-stone-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="mb-12">
          <p className="text-orange-600 text-sm mb-2" style={{ fontWeight: 600 }}>Чому обирають нас</p>
          <h2 className="text-stone-900" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Надійно. Вчасно. Якісно.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-6 border border-stone-100"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-stone-900 mb-2" style={{ fontWeight: 700 }}>
                {item.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
