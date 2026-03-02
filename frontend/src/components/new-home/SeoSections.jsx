import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronDown, ChevronRight,
    Truck, Ruler, Banknote, Clock,
    Flame, Package, TreePine,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Global styles — injected once, scoped with .seo- prefix
═══════════════════════════════════════════════════════════════ */
const SEO_STYLES = `
/* ── Outer section wrappers ─────────────────────────────── */
.seo-s1, .seo-s2 {
    padding: 80px 24px;
}

/* ── Premium glass container ────────────────────────────── */
.seo-box {
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow:
        0 12px 48px rgba(0,0,0,0.45),
        inset 0 1px 0 rgba(255,255,255,0.04),
        inset 0 -1px 0 rgba(255,255,255,0.02);
    padding: 64px 72px;
}
/* Section boxes — slightly lighter than page bg */
.seo-s1 .seo-box,
.seo-s2 .seo-box {
    background: linear-gradient(160deg, #101827 0%, #0c1520 100%);
}

/* ── Two-column layout ──────────────────────────────────── */
.seo-grid {
    display: grid;
    grid-template-columns: 55% 1fr;
    gap: 56px;
    align-items: start;
}

/* ── Section label above heading ── */
.seo-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(251,146,60,0.85);
    margin-bottom: 20px;
}
.seo-label::before {
    content: '';
    display: block;
    width: 20px;
    height: 2px;
    background: rgba(251,146,60,0.7);
    border-radius: 2px;
}

/* ── H2 ─────────────────────────────────────────────────── */
.seo-h2 {
    font-size: 41px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.5px;
    color: #f1f5f9;
    margin: 0 0 32px;
}

/* ── Text block ─────────────────────────────────────────── */
.seo-text {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 560px;
}
.seo-text p {
    font-size: 1rem;
    line-height: 1.75;
    color: rgba(241,245,249,0.60);
    margin: 0;
}

/* ── SEO links — soft orange with border-bottom ─────────── */
.seo-a {
    color: #fb923c;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,120,40,0.38);
    transition:
        color 0.18s ease,
        border-bottom-color 0.18s ease;
    padding-bottom: 1px;
}
.seo-a:hover {
    color: #fed7aa;
    border-bottom-color: rgba(254,186,96,0.75);
}

/* ── RIGHT COLUMN — Section 1: feature strips ──────────── */
.seo-strips {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.seo-strip {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-left: 2px solid rgba(251,146,60,0.35);
    transition: border-left-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}
.seo-strip:hover {
    background: rgba(255,255,255,0.04);
    border-left-color: rgba(251,146,60,0.75);
    transform: translateX(3px);
}

.seo-strip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(251,146,60,0.12);
    border: 1px solid rgba(251,146,60,0.28);
    box-shadow: 0 0 12px rgba(251,146,60,0.18);
    color: #fb923c;
}

.seo-strip-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.seo-strip-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
    line-height: 1.3;
}
.seo-strip-desc {
    font-size: 0.8125rem;
    color: rgba(241,245,249,0.5);
    margin: 0;
    line-height: 1.5;
}

/* ── RIGHT COLUMN — Section 2: nav category cards ──────── */
.seo-navcards {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Link wrapper resets */
.seo-navcard-link {
    display: block;
    text-decoration: none;
    border-radius: 16px;
}

.seo-navcard {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 16px;
    background: rgba(255,255,255,0.028);
    border: 1px solid rgba(255,255,255,0.055);
    cursor: pointer;
    transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
}
.seo-navcard-link:hover .seo-navcard {
    background: rgba(255,255,255,0.055);
    border-color: rgba(251,146,60,0.3);
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(0,0,0,0.38), 0 0 0 1px rgba(251,146,60,0.1);
}
.seo-navcard-link:hover .seo-navcard-arrow {
    color: #fb923c;
    transform: translateX(4px);
}

.seo-navcard-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(251,146,60,0.12);
    border: 1px solid rgba(251,146,60,0.28);
    box-shadow: 0 0 14px rgba(251,146,60,0.2);
    color: #fb923c;
    transition: box-shadow 0.22s ease;
}
.seo-navcard-link:hover .seo-navcard-icon {
    box-shadow: 0 0 22px rgba(251,146,60,0.38);
}

/* ── Checklist under text ───────────────────────────────── */
.seo-checklist {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
    padding: 0;
    list-style: none;
}
.seo-checklist li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: rgba(241,245,249,0.72);
    line-height: 1.4;
}
.seo-check-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(251,146,60,0.15);
    border: 1px solid rgba(251,146,60,0.3);
    color: #fb923c;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
}

.seo-s2-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    margin-top: 28px;
}
.seo-text-wide {
    max-width: 100%;
}
.seo-text-wide p + p {
    margin-top: 14px;
}
.seo-checklist-row {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px 24px;
    margin-top: 20px;
}
.seo-checklist-row li {
    font-size: 0.875rem;
}

/* ── CTA button ─────────────────────────────────────────── */
.seo-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    padding: 12px 24px;
    border-radius: 10px;
    background: rgba(251,146,60,0.12);
    border: 1px solid rgba(251,146,60,0.3);
    color: #fb923c;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.seo-cta-btn:hover {
    background: rgba(251,146,60,0.2);
    border-color: rgba(251,146,60,0.55);
    box-shadow: 0 0 24px rgba(251,146,60,0.18);
    transform: translateY(-2px);
    color: #fed7aa;
}

.seo-navcard-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.seo-navcard-title {
    font-size: 1rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
}
.seo-navcard-desc {
    font-size: 0.8125rem;
    color: rgba(241,245,249,0.5);
    margin: 0;
    line-height: 1.5;
}
.seo-navcard-arrow {
    color: rgba(251,146,60,0.5);
    flex-shrink: 0;
    transition: color 0.2s ease, transform 0.2s ease;
}
.seo-navcard:hover .seo-navcard-arrow {
    color: #fb923c;
    transform: translateX(4px);
}

/* ── Divider between the two sections ──────────────────── */
.seo-divider {
    max-width: 1200px;
    margin: 0 auto;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%);
    border: none;
}

/* ── Responsive: tablet ─────────────────────────────────── */
@media (max-width: 960px) {
    .seo-s1, .seo-s2 { padding: 60px 16px; }
    .seo-box  { padding: 40px 32px; }
    .seo-grid { grid-template-columns: 1fr; gap: 36px; }
    .seo-h2   { font-size: 32px; }
}

/* ── Responsive: mobile ─────────────────────────────────── */
@media (max-width: 540px) {
    .seo-s1, .seo-s2 { padding: 48px 12px; }
    .seo-box  { padding: 28px 20px; border-radius: 16px; }
    .seo-h2   { font-size: 26px; letter-spacing: -0.2px; }
    .seo-text p { font-size: 0.9375rem; }
    .seo-strip { flex-direction: column; }
}
`;

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — "Тверде паливо з доставкою по Києву та області"
═══════════════════════════════════════════════════════════════ */
export function SeoIntroSection() {
    return (
        <section className="seo-s1" style={{ background: 'var(--c-bg)' }}>
            <div className="seo-box">

                {/* ── Heading area ── */}
                <p className="seo-label">Про компанію</p>
                <h2 className="seo-h2">
                    Тверде паливо з доставкою<br />
                    по Києву та&nbsp;області
                </h2>

                <div className="seo-grid">

                    {/* ── LEFT: SEO text ── */}
                    <div className="seo-text">
                        <p>
                            Компанія «КиївБрикет» постачає тверде паливо для опалення будинків,
                            котлів та камінів.
                        </p>
                        <p>
                            У каталозі представлені{' '}
                            <Link to="/catalog/drova"
                                title="Купити колоті дрова з доставкою по Києву"
                                className="seo-a">колоті дрова</Link>{' '}
                            різних порід,{' '}
                            <Link to="/catalog/brikety"
                                title="Купити паливні брикети"
                                className="seo-a">паливні брикети</Link>{' '}
                            та{' '}
                            <Link to="/catalog/vugillya"
                                title="Купити кам'яне вугілля"
                                className="seo-a">кам'яне вугілля</Link>{' '}
                            з доставкою по Києву та Київській області.
                        </p>
                        <p>
                            Ми працюємо без посередників та доставляємо паливо власним транспортом.
                            Усі замовлення доставляються у погоджений час із чесним складометром
                            та можливістю оплати після отримання.
                        </p>
                        <p>
                            Ви можете замовити дубові, грабові, березові або соснові дрова, екологічні
                            паливні брикети типу RUF, Nestro або Pini-Kay, а також кам'яне вугілля для
                            котлів і печей.
                        </p>
                    </div>

                    {/* ── RIGHT: Feature strips ── */}
                    <div className="seo-strips">
                        <div className="seo-strip">
                            <div className="seo-strip-icon"><Truck size={18} /></div>
                            <div className="seo-strip-body">
                                <p className="seo-strip-title">Доставка по Києву</p>
                                <p className="seo-strip-desc">Власний транспорт, доставка в день замовлення</p>
                            </div>
                        </div>

                        <div className="seo-strip">
                            <div className="seo-strip-icon"><Ruler size={18} /></div>
                            <div className="seo-strip-body">
                                <p className="seo-strip-title">Чесний складометр</p>
                                <p className="seo-strip-desc">Об'єм перевіряється при вас під час розвантаження</p>
                            </div>
                        </div>

                        <div className="seo-strip">
                            <div className="seo-strip-icon"><Banknote size={18} /></div>
                            <div className="seo-strip-body">
                                <p className="seo-strip-title">Оплата після отримання</p>
                                <p className="seo-strip-desc">Без передоплати — ви платите лише після перевірки</p>
                            </div>
                        </div>

                        <div className="seo-strip">
                            <div className="seo-strip-icon"><Clock size={18} /></div>
                            <div className="seo-strip-body">
                                <p className="seo-strip-title">Зручний час доставки</p>
                                <p className="seo-strip-desc">Погоджуємо зручний для вас час приїзду</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — "Купити дрова, брикети та вугілля у Києві"
   (also owns the shared <style> block)
═══════════════════════════════════════════════════════════════ */
export function SeoFooterSection() {
    return (
        <>
            {/* Visual separator */}
            <div style={{ padding: '0 24px' }}>
                <hr className="seo-divider" aria-hidden="true" />
            </div>

            <section className="seo-s2" style={{ background: 'transparent' }}>
                <div className="seo-box">

                    {/* ── Heading ── */}
                    <p className="seo-label">Каталог</p>
                    <h2 className="seo-h2">
                        Купити дрова, брикети та вугілля у&nbsp;Києві
                    </h2>

                    <div className="seo-grid">

                        {/* ── LEFT: Text + checklist + CTA ── */}
                        <div>
                            <div className="seo-text seo-text-wide">
                                <p>
                                    Компанія «КиївБрикет» — надійний постачальник твердого палива
                                    з доставкою по Києву та Київській області.
                                </p>
                                <p>
                                    Ми пропонуємо широкий вибір{' '}
                                    <Link to="/catalog/drova"
                                        title="Купити дрова з доставкою по Києву"
                                        className="seo-a">дров</Link>,{' '}
                                    <Link to="/catalog/brikety"
                                        title="Купити паливні брикети"
                                        className="seo-a">паливних брикетів</Link>{' '}
                                    та{' '}
                                    <Link to="/catalog/vugillya"
                                        title="Купити кам'яне вугілля"
                                        className="seo-a">кам'яного вугілля</Link>{' '}
                                    для ефективного опалення приватних будинків, котлів та камінів.
                                </p>
                            </div>

                            {/* Checklist */}
                            <ul className="seo-checklist seo-checklist-row">
                                <li>
                                    <span className="seo-check-icon">✓</span>
                                    Доставка по Києву та Київській області
                                </li>
                                <li>
                                    <span className="seo-check-icon">✓</span>
                                    Чесний складометр — об'єм при вас
                                </li>
                                <li>
                                    <span className="seo-check-icon">✓</span>
                                    Оплата після отримання, без передоплат
                                </li>
                            </ul>

                            {/* CTA */}
                            <Link to="/catalog/drova" className="seo-cta-btn">
                                Обрати паливо
                                <ChevronRight size={16} />
                            </Link>
                        </div>

                        {/* ── RIGHT: Category nav cards ── */}
                        <div className="seo-navcards">
                            <Link to="/catalog/drova" className="seo-navcard-link">
                                <div className="seo-navcard">
                                    <div className="seo-navcard-icon"><TreePine size={20} /></div>
                                    <div className="seo-navcard-body">
                                        <p className="seo-navcard-title">Дрова колоті</p>
                                        <p className="seo-navcard-desc">Дуб, граб, береза, сосна — складометрами</p>
                                    </div>
                                    <ChevronRight size={18} className="seo-navcard-arrow" />
                                </div>
                            </Link>

                            <Link to="/catalog/brikety" className="seo-navcard-link">
                                <div className="seo-navcard">
                                    <div className="seo-navcard-icon"><Package size={20} /></div>
                                    <div className="seo-navcard-body">
                                        <p className="seo-navcard-title">Паливні брикети</p>
                                        <p className="seo-navcard-desc">RUF, Nestro, Pini-Kay — екологічне паливо</p>
                                    </div>
                                    <ChevronRight size={18} className="seo-navcard-arrow" />
                                </div>
                            </Link>

                            <Link to="/catalog/vugillya" className="seo-navcard-link">
                                <div className="seo-navcard">
                                    <div className="seo-navcard-icon"><Flame size={20} /></div>
                                    <div className="seo-navcard-body">
                                        <p className="seo-navcard-title">Кам'яне вугілля</p>
                                        <p className="seo-navcard-desc">Антрацит для котлів та печей</p>
                                    </div>
                                    <ChevronRight size={18} className="seo-navcard-arrow" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Shared styles — injected once */}
                <style>{SEO_STYLES}</style>
            </section>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ Section — unchanged
═══════════════════════════════════════════════════════════════ */
export function FaqSection({ faqs }) {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section style={{ padding: '4rem 0 6rem', background: 'var(--color-bg-main)', position: 'relative' }}>
            <div className="layout-container">
                <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'left', fontSize: '2rem' }}>
                    Поширені питання
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq, idx) => (
                        <div key={idx} style={{
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 16, overflow: 'hidden',
                        }}>
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                style={{
                                    width: '100%', padding: '1.5rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: 'transparent', border: 'none', color: 'var(--c-text)',
                                    fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {faq.name}
                                <ChevronDown size={20} color="var(--c-orange)" style={{
                                    transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }} />
                            </button>
                            <div style={{
                                maxHeight: openIndex === idx ? 300 : 0,
                                padding: openIndex === idx ? '0 1.5rem 1.5rem' : '0 1.5rem',
                                opacity: openIndex === idx ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                color: 'var(--c-text2)', fontSize: '1rem', lineHeight: 1.6,
                            }}>
                                {faq.acceptedAnswer.text}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
