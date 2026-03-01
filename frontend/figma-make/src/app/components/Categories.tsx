import { ArrowRight } from "lucide-react";

const droviImg = "https://images.unsplash.com/photo-1768141117135-f0757c65dfaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJld29vZCUyMHN0YWNrJTIwd2FybSUyMHN1bmxpZ2h0JTIwcnVzdGljJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzIyMDk3MzR8MA&ixlib=rb-4.1.0&q=80&w=600";
const brykеtyImg = "https://images.unsplash.com/photo-1656260095692-a3e2fa81c104?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdWVsJTIwYnJpcXVldHRlcyUyMGNvbXByZXNzZWQlMjB3b29kJTIwYnJvd24lMjBibG9ja3N8ZW58MXx8fHwxNzcyMjA5NzM0fDA&ixlib=rb-4.1.0&q=80&w=600";
const vuhilliaImg = "https://images.unsplash.com/photo-1673498369434-0086d17874b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FsJTIwYmxhY2slMjBjaHVua3MlMjBzb2xpZCUyMGZ1ZWwlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzIyMDk3MzV8MA&ixlib=rb-4.1.0&q=80&w=600";

interface Category {
  id: string;
  anchor: string;
  img: string;
  label: string;
  title: string;
  desc: string;
  features: string[];
  cta: string;
}

const categories: Category[] = [
  {
    id: "drova",
    anchor: "#drova",
    img: droviImg,
    label: "Категорія 01",
    title: "Дрова",
    desc: "Сухі колоті дрова твердих порід: дуб, граб, акація, береза. Вологість до 20%. Ідеально для камінів, печей та котлів.",
    features: ["Дубові, грабові, акацієві", "Вологість до 20%", "Колоті та кругляк", "Від 1 складометра"],
    cta: "Дивитись дрова",
  },
  {
    id: "brykety",
    anchor: "#brykety",
    img: brykеtyImg,
    label: "Категорія 02",
    title: "Топливні брикети",
    desc: "Пресовані брикети RUF та Pini-Kay з деревини та агровідходів. Висока теплотворність, мінімум золи, довге горіння.",
    features: ["RUF / Pini-Kay", "Теплотворність 5 000 ккал/кг", "Зола до 1%", "Від 1 піддона"],
    cta: "Дивитись брикети",
  },
  {
    id: "vuhillia",
    anchor: "#vuhillia",
    img: vuhilliaImg,
    label: "Категорія 03",
    title: "Вугілля",
    desc: "Антрацит і кам'яне вугілля різних фракцій. Підходить для промислових котлів, печей і каміна. Стабільна поставка.",
    features: ["Антрацит / кам'яне", "Фракції: горіх, сім'янка", "Теплотворність 7 000 ккал/кг", "Від 1 тонни"],
    cta: "Дивитись вугілля",
  },
];

export function Categories() {
  return (
    <section id="categories" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="mb-12">
          <p className="text-orange-600 text-sm mb-2" style={{ fontWeight: 600 }}>Асортимент</p>
          <h2 className="text-stone-900" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Три категорії палива
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <article
              key={cat.id}
              id={cat.id}
              className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 hover:border-orange-200 transition-all duration-300 hover:shadow-md flex flex-col"
            >
              {/* Image */}
              <div className="h-52 overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: "brightness(1.05) saturate(1.15)" }}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className="text-stone-400 text-xs mb-2" style={{ fontWeight: 500 }}>
                  {cat.label}
                </span>
                <h3 className="text-stone-900 mb-3" style={{ fontWeight: 700, fontSize: "1.2rem" }}>
                  {cat.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-5">
                  {cat.desc}
                </p>

                {/* Features list */}
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {cat.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-stone-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={cat.anchor}
                  className="flex items-center gap-2 text-orange-600 text-sm group-hover:gap-3 transition-all"
                  style={{ fontWeight: 600 }}
                >
                  {cat.cta}
                  <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
