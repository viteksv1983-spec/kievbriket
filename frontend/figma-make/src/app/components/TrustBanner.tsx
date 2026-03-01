const fireplaceImg = "https://images.unsplash.com/photo-1765758917834-473fc14d6d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwZmlyZXBsYWNlJTIwZmlyZSUyMGJ1cm5pbmclMjB3b29kJTIwY296eSUyMGhvbWV8ZW58MXx8fHwxNzcyMjA5NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function TrustBanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* BG image */}
      <div className="absolute inset-0">
        <img
          src={fireplaceImg}
          alt="Тепло у вашому домі"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.38) saturate(0.9)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-orange-400 text-sm mb-3" style={{ fontWeight: 600 }}>
          Наша місія
        </p>
        <h2
          className="text-white mb-5 mx-auto max-w-2xl"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
        >
          Щоб у вашому домі<br />завжди було тепло
        </h2>
        <p className="text-stone-300 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          Ми знаємо, як важливо не залишитися без опалення взимку. Тому забезпечуємо надійне постачання палива — вчасно і без зайвих клопотів.
        </p>
        <a
          href="#contact"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded transition-colors text-sm"
          style={{ fontWeight: 600 }}
        >
          Замовити паливо
        </a>
      </div>
    </section>
  );
}
