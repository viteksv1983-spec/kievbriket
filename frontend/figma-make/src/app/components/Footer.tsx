import { Phone, Mail, MapPin } from "lucide-react";

const nav = [
  { label: "Дрова", href: "#drova" },
  { label: "Брикети", href: "#brykety" },
  { label: "Вугілля", href: "#vuhillia" },
  { label: "Про нас", href: "#about" },
  { label: "Замовити", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <span className="text-white" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
            ТеплоПостач
          </span>
          <p className="text-sm mt-3 leading-relaxed max-w-xs">
            Дрова, брикети та вугілля з доставкою по Україні. Працюємо з 2014 року.
          </p>
        </div>

        {/* Nav */}
        <div>
          <p className="text-stone-300 text-sm mb-4" style={{ fontWeight: 600 }}>
            Каталог
          </p>
          <ul className="flex flex-col gap-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <p className="text-stone-300 text-sm mb-4" style={{ fontWeight: 600 }}>
            Контакти
          </p>
          <ul className="flex flex-col gap-3">
            <li>
              <a href="tel:+380671234567" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Phone size={14} className="text-orange-500 shrink-0" />
                +38 (067) 123-45-67
              </a>
            </li>
            <li>
              <a href="mailto:info@teplpostach.ua" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail size={14} className="text-orange-500 shrink-0" />
                info@teplpostach.ua
              </a>
            </li>
            <li>
              <span className="flex items-start gap-2 text-sm">
                <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
                м. Київ, вул. Хрещатик 1
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            © 2026 ТеплоПостач. Всі права захищені.
          </p>
          <p className="text-xs text-stone-600">
            Політика конфіденційності
          </p>
        </div>
      </div>
    </footer>
  );
}
