import React from 'react';
import { FaFire, FaStar, FaTree, FaTruck } from 'react-icons/fa';
import SEOHead from './SEOHead';
import shopConfig from '../shop.config';

function About() {
    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #111827 0%, #1f2937 40%, #111827 100%)' }}>
            <SEOHead title={`Про нас | Заготівля дров ${shopConfig.name}`} />

            {/* Hero Section */}
            <header className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <img
                    src="/about/firewood-about-banner.jpg"
                    alt={`${shopConfig.name} Banner`}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(17,24,39,0.3) 0%, rgba(17,24,39,0.8) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#e67e22] mb-4">{shopConfig.name}</div>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-2xl"
                        style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Про нас
                    </h1>
                    <div className="w-20 h-1 bg-[#e67e22] mx-auto mb-6 rounded-full" />
                    <p className="text-white/80 text-lg md:text-xl tracking-wide">
                        Тепло та затишок у вашому домі — наша головна мета
                    </p>
                </div>
            </header>

            {/* Introduction */}
            <section className="container mx-auto px-6 py-20 md:py-28">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                        style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Якісні дрова від <span style={{ color: '#e67e22' }}>надійного постачальника</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#e67e22] mx-auto mb-8 rounded-full" />
                    <p className="text-xl text-white/70 leading-relaxed italic">
                        "Ми не просто продаємо дрова — ми забезпечуємо вас теплом на всю зиму, гарантуючи якість кожного поліна."
                    </p>
                </div>

                {/* Text + Image 2-col */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-white/10"
                        style={{ boxShadow: '0 0 40px rgba(230,126,34,0.1)' }}>
                        <img
                            src="/about/firewood-pile-2.jpg"
                            alt="Якісні та сухі дрова"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(17,24,39,0.6), transparent)' }} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight"
                            style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Гарантія якості та <span style={{ color: '#e67e22' }}>Об'єму</span>
                        </h3>
                        <p className="text-white/70 text-lg leading-relaxed">
                            Наша деревина проходить суворий відбір. Ми постачаємо дрова без гнилі та трухи, забезпечуючи оптимальну вологість для ефективного горіння. Головний наш принцип — <strong>чесний об'єм</strong>. Ви отримуєте рівно стільки складометрів, за скільки заплатили, без "коефіцієнтів укладання".
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#e67e22]/30"
                                style={{ background: 'rgba(230,126,34,0.1)' }}>
                                <FaTree className="text-[#e67e22]" />
                                <span className="font-black text-sm text-white uppercase tracking-wide">Екологічна деревина</span>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10"
                                style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <FaFire className="text-[#e74c3c]" />
                                <span className="font-black text-sm text-white uppercase tracking-wide">Висока тепловіддача</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chef Section -> Supply Chain Section */}
            <section className="py-20 md:py-28 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Decorative glow */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #e67e22, transparent)' }} />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#e67e22] mb-4">Наш підхід</div>
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4"
                                    style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                    Від лісгоспу до вашого <span style={{ color: '#e67e22' }}>каміна</span>
                                </h2>
                                <p className="text-[#e67e22] font-black italic text-lg">
                                    — Прямі поставки без посередників
                                </p>
                            </div>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Ми працюємо на ринку твердого палива вже понад 5 років. Починаючи з невеликих об'ємів, ми виросли до підприємства з власним автопарком та великим складом у Києві. Завдяки прямим контрактам з лісництвами, ми пропонуємо стабільні ціни та гарантуємо легальність кожної партії деревини.
                            </p>
                            <div className="flex items-center gap-5 p-6 rounded-2xl border border-[#e67e22]/30"
                                style={{ background: 'rgba(230,126,34,0.1)' }}>
                                <FaTruck className="text-4xl text-[#e67e22] flex-shrink-0" />
                                <div>
                                    <h4 className="font-black text-white uppercase tracking-wide">Власний автопарк</h4>
                                    <p className="text-sm text-white/60 uppercase tracking-widest mt-1">Доставка від 2 до 15 скл.м.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                                style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)' }} />
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                                style={{ boxShadow: '0 0 50px rgba(230,126,34,0.15)' }}>
                                <img
                                    src="/about/firewood-truck.jpg"
                                    alt="Доставка дров вантажівками"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(to top, rgba(17,24,39,0.7), transparent 50%)' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-6 py-20 md:py-28">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight"
                        style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        {shopConfig.name} у <span style={{ color: '#e67e22' }}>цифрах</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#e67e22] mx-auto mt-5 rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                        { label: "Років на ринку", val: "5+", icon: "⏳" },
                        { label: "Задоволених клієнтів", val: "3000+", icon: "🤝" },
                        { label: "Машин у парку", val: "8", icon: "🚛" },
                        { label: "Складометрів на рік", val: "10 000+", icon: "🪵" }
                    ].map((stat, i) => (
                        <div key={i} className="group rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#e67e22]/40"
                            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
                            <div className="text-3xl mb-3">{stat.icon}</div>
                            <div className="text-4xl font-black text-[#e67e22] mb-2"
                                style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>{stat.val}</div>
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default About;
