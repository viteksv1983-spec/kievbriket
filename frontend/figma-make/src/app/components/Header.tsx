import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";

const nav = [
  { label: "Дрова", href: "#drova" },
  { label: "Брикети", href: "#brykety" },
  { label: "Вугілля", href: "#vuhillia" },
  { label: "Про нас", href: "#about" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-orange-600" style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
            ТеплоПостач
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-stone-600 hover:text-orange-600 transition-colors text-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: phone + CTA */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="tel:+380671234567"
            className="flex items-center gap-2 text-stone-700 hover:text-orange-600 transition-colors text-sm"
          >
            <Phone size={15} className="text-orange-600" />
            +38 (067) 123-45-67
          </a>
          <a
            href="#contact"
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            Замовити
          </a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-stone-700" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-5 flex flex-col gap-5">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-stone-700 text-sm"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:+380671234567"
            className="flex items-center gap-2 text-stone-700 text-sm"
          >
            <Phone size={15} className="text-orange-600" />
            +38 (067) 123-45-67
          </a>
          <a
            href="#contact"
            className="bg-orange-600 text-white px-5 py-2.5 rounded text-sm self-start"
            style={{ fontWeight: 600 }}
            onClick={() => setOpen(false)}
          >
            Замовити
          </a>
        </div>
      )}
    </header>
  );
}
