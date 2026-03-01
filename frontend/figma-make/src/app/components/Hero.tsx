const heroImg = "https://images.unsplash.com/photo-1768141117135-f0757c65dfaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJld29vZCUyMHN0YWNrJTIwd2FybSUyMHN1bmxpZ2h0JTIwcnVzdGljJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzIyMDk3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080";

const stats = [
  { value: "10+", label: "років на ринку" },
  { value: "5 000+", label: "задоволених клієнтів" },
  { value: "24 год", label: "доставка по місту" },
];

export function Hero() {
  return (
    <section className="relative bg-stone-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">

        {/* Left: text */}
        <div className="md:w-1/2 flex flex-col items-start">
          <span className="inline-block bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full mb-5" style={{ fontWeight: 600 }}>
            Тверде паливо з доставкою
          </span>

          <h1
            className="text-stone-900 mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}
          >
            Дрова, брикети<br />та вугілля<br />
            <span className="text-orange-600">з доставкою додому</span>
          </h1>

          <p className="text-stone-500 mb-8 text-base leading-relaxed max-w-sm">
            Постачаємо якісне тверде паливо для опалення будинків, котеджів та підприємств по всій Україні.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#categories"
              className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3 rounded transition-colors text-sm"
              style={{ fontWeight: 600 }}
            >
              Обрати паливо
            </a>
            <a
              href="tel:+380671234567"
              className="border border-stone-200 hover:border-orange-300 text-stone-700 px-7 py-3 rounded transition-colors text-sm bg-white"
              style={{ fontWeight: 500 }}
            >
              Подзвонити
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-stone-900" style={{ fontWeight: 800, fontSize: "1.4rem", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p className="text-stone-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image */}
        <div className="md:w-1/2 w-full">
          <div
            className="rounded-2xl overflow-hidden shadow-xl"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={heroImg}
              alt="Тверде паливо — дрова, брикети, вугілля"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(1.05) saturate(1.1)" }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
