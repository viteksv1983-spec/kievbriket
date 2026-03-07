import React, { useState, useRef, useEffect } from 'react';
import { Calculator, ArrowRight, Phone, Flame, Home, Thermometer, TreePine, Package, Loader2 } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import shopConfig from '../../shop.config';
import api from '../../api';

/* ─── Calculation constants ─────────────────────────── */
const BASE_FIREWOOD_PER_M2 = 0.07; // складометрів на м²

const HEATING_MULTIPLIER = {
    stove: 1.10,
    boiler: 0.90,
    fireplace: 1.20,
};
const HEATING_LABEL = {
    stove: 'Піч',
    boiler: 'Твердопаливний котел',
    fireplace: 'Камін',
};

const INSULATION_MULTIPLIER = {
    poor: 1.20,
    medium: 1.00,
    good: 0.80,
};
const INSULATION_LABEL = {
    poor: 'Слабке',
    medium: 'Середнє',
    good: 'Хороше',
};

const FUEL_CONVERSION = {
    drova: { unit: 'складометрів дров', shortUnit: 'м³ дров', pricePerUnit: 2400, factor: 1 },
    brikety: { unit: 'т паливних брикетів', shortUnit: 'т брикетів', pricePerUnit: 8000, factor: 0.45 },
    vugillya: { unit: 'т кам\'яного вугілля', shortUnit: 'т вугілля', pricePerUnit: 9000, factor: 0.35 },
};

/* ─── Calculation function ──────────────────────────── */
function calculate(area, heating, insulation, fuel, prices = FUEL_CONVERSION) {
    const base = area * BASE_FIREWOOD_PER_M2;
    const adjusted = base * HEATING_MULTIPLIER[heating] * INSULATION_MULTIPLIER[insulation];
    const fuelData = prices[fuel];
    const volume = adjusted * fuelData.factor;
    const cost = volume * fuelData.pricePerUnit;

    // Also compute alternatives
    const alternatives = Object.entries(prices)
        .filter(([key]) => key !== fuel)
        .map(([, data]) => ({
            volume: +(adjusted * data.factor).toFixed(1),
            unit: data.shortUnit,
        }));

    return {
        volume: fuel === 'drova' ? Math.round(volume) : +(volume.toFixed(1)),
        unit: fuelData.unit,
        cost: Math.round(cost / 100) * 100,
        area,
        heatingLabel: HEATING_LABEL[heating],
        insulationLabel: INSULATION_LABEL[insulation],
        alternatives,
    };
}

/* ─── Radio option data ─────────────────────────────── */
const HEATING_OPTIONS = [
    { value: 'stove', label: 'Піч', icon: <Flame size={15} /> },
    { value: 'boiler', label: 'Твердопаливний котел', icon: <Thermometer size={15} /> },
    { value: 'fireplace', label: 'Камін', icon: <Home size={15} /> },
];

const INSULATION_OPTIONS = [
    { value: 'poor', label: 'Слабке утеплення' },
    { value: 'medium', label: 'Середнє утеплення' },
    { value: 'good', label: 'Хороше утеплення' },
];

const FUEL_OPTIONS = [
    { value: 'drova', label: 'Дрова', icon: <TreePine size={15} /> },
    { value: 'brikety', label: 'Паливні брикети', icon: <Package size={15} /> },
    { value: 'vugillya', label: 'Кам\'яне вугілля', icon: <Flame size={15} /> },
];

/* ─── Panel states ──────────────────────────────────── */
const PANEL_PREVIEW = 'preview';
const PANEL_LOADING = 'loading';
const PANEL_RESULT = 'result';

/* ─── Component ─────────────────────────────────────── */
export function FuelCalculatorSection({ onQuickOrderClick, defaultFuelType = 'drova' }) {
    const { ref, visible } = useReveal();

    const [area, setArea] = useState('');
    const [heating, setHeating] = useState('boiler');
    const [insulation, setInsulation] = useState('medium');
    const [fuel, setFuel] = useState(defaultFuelType);
    const [result, setResult] = useState(null);
    const [panelState, setPanelState] = useState(PANEL_PREVIEW);
    const [currentPrices, setCurrentPrices] = useState(FUEL_CONVERSION);
    const resultRef = useRef(null);

    useEffect(() => {
        api.get('/products/')
            .then(res => {
                const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
                if (items.length === 0) return;

                setCurrentPrices(prev => {
                    const newPrices = JSON.parse(JSON.stringify(prev));
                    ['drova', 'brikety', 'vugillya'].forEach(cat => {
                        const catItems = items.filter(i => i.category === cat && i.price > 0);
                        if (catItems.length > 0) {
                            newPrices[cat].pricePerUnit = Math.min(...catItems.map(i => i.price));
                        }
                    });
                    return newPrices;
                });
            })
            .catch(err => console.error("Calculator prices fetch error:", err));
    }, []);

    const handleCalculate = () => {
        const numArea = parseInt(area, 10);
        if (!numArea || numArea < 10 || numArea > 1000) return;

        // Phase 1: Loading
        setPanelState(PANEL_LOADING);

        // Phase 2: Result after delay
        setTimeout(() => {
            const res = calculate(numArea, heating, insulation, fuel, currentPrices);
            setResult(res);
            setPanelState(PANEL_RESULT);

            // On mobile, scroll to result
            if (window.innerWidth < 900 && resultRef.current) {
                setTimeout(() => {
                    resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 150);
            }
        }, 700);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleCalculate();
    };

    return (
        <section
            ref={ref}
            style={{ padding: '100px 0', background: 'transparent' }}
        >
            <div className="layout-container">

                {/* ── Header ── */}
                <div className={`reveal ${visible ? 'visible' : ''}`} style={{ marginBottom: 'var(--s-header)' }}>
                    <p className="section-label" style={{ marginBottom: 'var(--s-tight)' }}>
                        Калькулятор палива
                    </p>
                    <h2 className="h2" style={{ maxWidth: 640 }}>
                        Розрахуйте скільки палива потрібно{' '}
                        <span style={{ color: 'var(--c-orange)' }}>для вашого будинку</span>
                    </h2>
                    <p className="body-sm" style={{ marginTop: 12, maxWidth: 540, color: 'var(--c-text2)' }}>
                        Онлайн калькулятор допоможе приблизно визначити об'єм дров, брикетів або вугілля
                        для опалення вашого дому.
                    </p>
                    <p style={{
                        fontSize: '0.75rem', color: 'var(--c-text3)', marginTop: 8,
                        fontStyle: 'italic',
                    }}>
                        Середній розрахунок для опалення будинку в кліматі Київської області.
                    </p>
                </div>

                {/* ── Calculator card ── */}
                <div className={`calc-card reveal ${visible ? 'visible' : ''}`}>
                    <div className="calc-grid">

                        {/* ─── LEFT: Inputs ─── */}
                        <div className="calc-inputs">

                            {/* Area input */}
                            <div className="calc-field">
                                <label className="calc-label" htmlFor="calc-area">
                                    Площа будинку (м²)
                                </label>
                                <input
                                    id="calc-area"
                                    type="number"
                                    className="calc-input"
                                    placeholder="120"
                                    min="10"
                                    max="1000"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <span className="calc-hint">Від 30 до 500 м²</span>
                            </div>

                            {/* Heating type */}
                            <div className="calc-field">
                                <p className="calc-label">Тип опалення</p>
                                <div className="calc-radio-group">
                                    {HEATING_OPTIONS.map((opt) => (
                                        <label key={opt.value} className={`calc-radio ${heating === opt.value ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="heating"
                                                value={opt.value}
                                                checked={heating === opt.value}
                                                onChange={() => setHeating(opt.value)}
                                            />
                                            {opt.icon}
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Insulation */}
                            <div className="calc-field">
                                <p className="calc-label">Рівень утеплення</p>
                                <div className="calc-radio-group">
                                    {INSULATION_OPTIONS.map((opt) => (
                                        <label key={opt.value} className={`calc-radio ${insulation === opt.value ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="insulation"
                                                value={opt.value}
                                                checked={insulation === opt.value}
                                                onChange={() => setInsulation(opt.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Fuel type */}
                            <div className="calc-field">
                                <p className="calc-label">Тип палива</p>
                                <div className="calc-radio-group">
                                    {FUEL_OPTIONS.map((opt) => (
                                        <label key={opt.value} className={`calc-radio ${fuel === opt.value ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="fuel"
                                                value={opt.value}
                                                checked={fuel === opt.value}
                                                onChange={() => setFuel(opt.value)}
                                            />
                                            {opt.icon}
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Calculate button */}
                            <button
                                className="nh-btn-primary calc-btn"
                                onClick={handleCalculate}
                                disabled={panelState === PANEL_LOADING}
                            >
                                <Calculator size={16} />
                                Розрахувати
                            </button>
                        </div>

                        {/* ─── RIGHT: Panel (3 states) ─── */}
                        <div className="calc-panel" ref={resultRef}>

                            {/* ── STATE 1: Preview ── */}
                            {panelState === PANEL_PREVIEW && (
                                <div className="calc-panel-state calc-preview">
                                    {/* Icon */}
                                    <div className="calc-preview-icon">
                                        <Calculator size={28} />
                                    </div>

                                    <p className="calc-preview-title">Приклад розрахунку</p>

                                    {/* Example params */}
                                    <div className="calc-preview-params">
                                        <div className="calc-preview-param">
                                            <span className="calc-preview-param-label">Будинок</span>
                                            <span className="calc-preview-param-value">120 м²</span>
                                        </div>
                                        <div className="calc-preview-param">
                                            <span className="calc-preview-param-label">Опалення</span>
                                            <span className="calc-preview-param-value">Твердопаливний котел</span>
                                        </div>
                                        <div className="calc-preview-param">
                                            <span className="calc-preview-param-label">Утеплення</span>
                                            <span className="calc-preview-param-value">Середнє</span>
                                        </div>
                                    </div>

                                    {/* Example result */}
                                    <div className="calc-preview-result">
                                        <p className="calc-preview-result-line">
                                            <span className="calc-preview-approx">≈</span>
                                            <span className="calc-preview-num">7–8</span>
                                            <span className="calc-preview-unit">м³ дров</span>
                                        </p>
                                        <p className="calc-preview-or">або</p>
                                        <p className="calc-preview-result-line">
                                            <span className="calc-preview-approx">≈</span>
                                            <span className="calc-preview-num">3–4</span>
                                            <span className="calc-preview-unit">т паливних брикетів</span>
                                        </p>
                                    </div>

                                    {/* Helper text */}
                                    <p className="calc-preview-helper">
                                        Заповніть параметри зліва та натисніть «Розрахувати» —
                                        система порахує точний об'єм палива для вашого будинку.
                                    </p>
                                </div>
                            )}

                            {/* ── STATE 2: Loading ── */}
                            {panelState === PANEL_LOADING && (
                                <div className="calc-panel-state calc-loading">
                                    <div className="calc-loading-spinner">
                                        <Loader2 size={28} />
                                    </div>
                                    <p className="calc-loading-text">Розраховуємо...</p>
                                </div>
                            )}

                            {/* ── STATE 3: Result ── */}
                            {panelState === PANEL_RESULT && result && (
                                <div className="calc-panel-state calc-result-state">
                                    {/* Header */}
                                    <p className="calc-res-header">Ваш результат</p>

                                    {/* Input summary */}
                                    <div className="calc-res-summary">
                                        <div className="calc-res-summary-row">
                                            <span>Площа будинку</span>
                                            <span className="calc-res-summary-val">{result.area} м²</span>
                                        </div>
                                        <div className="calc-res-summary-row">
                                            <span>Тип опалення</span>
                                            <span className="calc-res-summary-val">{result.heatingLabel}</span>
                                        </div>
                                        <div className="calc-res-summary-row">
                                            <span>Утеплення</span>
                                            <span className="calc-res-summary-val">{result.insulationLabel}</span>
                                        </div>
                                    </div>

                                    {/* Main result */}
                                    <div className="calc-res-main">
                                        <p className="calc-res-main-label">Необхідний об'єм палива:</p>
                                        <div className="calc-res-main-value">
                                            <span className="calc-res-approx">≈</span>
                                            <span className="calc-res-number">{result.volume}</span>
                                            <span className="calc-res-unit">{result.unit}</span>
                                        </div>
                                        {result.alternatives.length > 0 && (
                                            <div className="calc-res-alts">
                                                {result.alternatives.map((alt, i) => (
                                                    <p key={i} className="calc-res-alt-line">
                                                        <span className="calc-res-alt-or">{i === 0 ? 'або' : ''}</span>
                                                        <span className="calc-res-alt-num">≈ {alt.volume}</span>
                                                        <span className="calc-res-alt-unit">{alt.unit}</span>
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Cost */}
                                    <div className="calc-res-cost">
                                        <p className="calc-res-cost-label">Орієнтовна вартість:</p>
                                        <p className="calc-res-cost-value">
                                            ≈ {result.cost.toLocaleString('uk-UA')} грн
                                        </p>
                                    </div>

                                    {/* CTAs */}
                                    <div className="calc-res-actions">
                                        <button
                                            className="nh-btn-primary"
                                            onClick={() => onQuickOrderClick({
                                                type: fuel,
                                                volume: result.volume,
                                                unit: result.unit,
                                                cost: result.cost,
                                                isFromCalculator: true
                                            })}
                                            style={{ width: '100%', justifyContent: 'center' }}
                                        >
                                            Замовити доставку цього об'єму <ArrowRight size={16} />
                                        </button>
                                        <a
                                            href={`tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                                            className="nh-btn-ghost"
                                            style={{
                                                width: '100%', justifyContent: 'center',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                            }}
                                        >
                                            <Phone size={15} /> Зателефонувати
                                        </a>
                                    </div>

                                    {/* Helper Text */}
                                    <div style={{ marginTop: '0.5rem', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>💡</span>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--c-text2)', margin: 0, lineHeight: 1.5 }}>
                                            <strong style={{ color: 'var(--c-text)' }}>Підказка:</strong><br /> Будинок 100м² зазвичай потребує 6–8 складометрів дров на сезон.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── SEO hidden text ── */}
                <div
                    className={`reveal ${visible ? 'visible' : ''}`}
                    style={{ marginTop: 'var(--s-block)', maxWidth: 840 }}
                >
                    <h3 className="h3" style={{ marginBottom: 12, fontSize: '1rem' }}>
                        Скільки дров потрібно на опалення будинку
                    </h3>
                    <p className="body-sm" style={{ lineHeight: 1.75 }}>
                        Для опалення будинку 100 м² в Київській області зазвичай потрібно 6–8 складометрів дров
                        за сезон. Будинок 120 м² потребує приблизно 8–10 складометрів, а для 150 м² — близько
                        10–12 складометрів. Витрати залежать від типу котла, рівня утеплення та породи дерева.
                        Паливні брикети мають вищу теплотворність: для аналогічного будинку витрати брикетів
                        становлять приблизно 3–5 тонн за сезон. Кам'яне вугілля ще ефективніше — 2–4 тонни
                        забезпечать тепло на весь опалювальний період.
                    </p>
                </div>

            </div>

            <style>{`
                /* ── Calculator card ──────────────────────── */
                .calc-card {
                    background: linear-gradient(160deg, #101827 0%, #0c1520 100%);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 24px;
                    box-shadow:
                        0 12px 48px rgba(0,0,0,0.45),
                        inset 0 1px 0 rgba(255,255,255,0.04);
                    padding: 48px;
                    overflow: hidden;
                }

                .calc-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: start;
                }

                /* ── Inputs ───────────────────────────────── */
                .calc-inputs {
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                }

                .calc-field {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .calc-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--c-text);
                    margin: 0;
                }

                .calc-input {
                    width: 100%;
                    max-width: 280px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                    color: var(--c-text);
                    font-size: 1rem;
                    font-family: inherit;
                    font-weight: 600;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    -moz-appearance: textfield;
                }
                .calc-input::-webkit-outer-spin-button,
                .calc-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .calc-input::placeholder {
                    color: rgba(255,255,255,0.25);
                    font-weight: 400;
                }
                .calc-input:focus {
                    border-color: rgba(249,115,22,0.50);
                    box-shadow: 0 0 0 3px rgba(249,115,22,0.12), 0 0 20px rgba(249,115,22,0.08);
                }

                .calc-hint {
                    font-size: 0.72rem;
                    color: var(--c-text3);
                }

                /* ── Radio buttons ────────────────────────── */
                .calc-radio-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .calc-radio {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 16px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.025);
                    color: var(--c-text2);
                    font-size: 0.8125rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .calc-radio input {
                    display: none;
                }
                .calc-radio:hover {
                    border-color: rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.04);
                }
                .calc-radio.active {
                    border-color: rgba(249,115,22,0.45);
                    background: rgba(249,115,22,0.10);
                    color: var(--c-orange-lt);
                    box-shadow: 0 0 16px rgba(249,115,22,0.10);
                }

                /* ── Calculate button ─────────────────────── */
                .calc-btn {
                    align-self: flex-start;
                    padding: 14px 32px !important;
                }
                .calc-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* ══════════════════════════════════════════
                   RIGHT PANEL — shared wrapper
                   ══════════════════════════════════════════ */
                .calc-panel {
                    border: 1px solid rgba(249,115,22,0.15);
                    border-radius: 20px;
                    padding: 40px 28px;
                    min-height: 460px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    background:
                        radial-gradient(
                            600px circle at center,
                            rgba(249,115,22,0.05),
                            transparent 70%
                        ),
                        rgba(255,255,255,0.015);
                    box-shadow:
                        0 0 0 1px rgba(249,115,22,0.08),
                        0 0 30px rgba(249,115,22,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.03);
                }

                /* ── State transition ── */
                .calc-panel-state {
                    width: 100%;
                    animation: calcPanelIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes calcPanelIn {
                    from { opacity: 0; transform: scale(0.97) translateY(8px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }

                /* ══════════════════════════════════════════
                   PREVIEW state
                   ══════════════════════════════════════════ */
                .calc-preview-icon {
                    width: 64px; height: 64px;
                    border-radius: 18px;
                    background: rgba(249,115,22,0.12);
                    border: 1px solid rgba(249,115,22,0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--c-orange);
                    margin-bottom: 20px;
                    box-shadow: 0 0 24px rgba(249,115,22,0.10);
                }

                .calc-preview-title {
                    font-size: 1.25rem;
                    font-weight: 650;
                    color: var(--c-text);
                    margin: 0 0 20px;
                }

                .calc-preview-params {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 24px;
                    padding: 16px;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                }
                .calc-preview-param {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8125rem;
                }
                .calc-preview-param-label {
                    color: var(--c-text3);
                }
                .calc-preview-param-value {
                    color: var(--c-text);
                    font-weight: 600;
                }

                .calc-preview-result {
                    margin-bottom: 22px;
                    padding: 16px;
                    background: rgba(249,115,22,0.05);
                    border: 1px solid rgba(249,115,22,0.12);
                    border-radius: 12px;
                }
                .calc-preview-result-line {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                    margin: 0;
                    line-height: 1.4;
                }
                .calc-preview-approx {
                    font-size: 1rem;
                    color: var(--c-orange);
                    font-weight: 700;
                }
                .calc-preview-num {
                    font-size: 1.25rem;
                    color: var(--c-orange);
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }
                .calc-preview-unit {
                    font-size: 0.8125rem;
                    color: var(--c-text2);
                    font-weight: 500;
                }
                .calc-preview-or {
                    font-size: 0.75rem;
                    color: var(--c-text3);
                    margin: 4px 0 4px 24px;
                }

                .calc-preview-helper {
                    font-size: 0.8125rem;
                    color: rgba(255,255,255,0.50);
                    line-height: 1.65;
                    margin: 0;
                }

                /* ══════════════════════════════════════════
                   LOADING state
                   ══════════════════════════════════════════ */
                .calc-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    min-height: 200px;
                }
                .calc-loading-spinner {
                    width: 56px; height: 56px;
                    border-radius: 16px;
                    background: rgba(249,115,22,0.10);
                    border: 1px solid rgba(249,115,22,0.22);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--c-orange);
                    animation: calcSpin 0.8s linear infinite;
                }
                .calc-loading-spinner svg {
                    animation: calcSpin 0.8s linear infinite;
                }
                @keyframes calcSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .calc-loading-text {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--c-text2);
                    margin: 0;
                }

                /* ══════════════════════════════════════════
                   RESULT state
                   ══════════════════════════════════════════ */
                .calc-result-state {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .calc-res-header {
                    font-size: 1.125rem;
                    font-weight: 650;
                    color: var(--c-text);
                    margin: 0 0 2px;
                }

                /* Summary rows */
                .calc-res-summary {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 14px 16px;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 10px;
                    font-size: 0.8125rem;
                }
                .calc-res-summary-row {
                    display: flex;
                    justify-content: space-between;
                    color: var(--c-text3);
                }
                .calc-res-summary-val {
                    color: var(--c-text);
                    font-weight: 600;
                }

                /* Main volume */
                .calc-res-main {
                    padding: 16px;
                    background: rgba(249,115,22,0.05);
                    border: 1px solid rgba(249,115,22,0.12);
                    border-radius: 12px;
                }
                .calc-res-main-label {
                    font-size: 0.78rem;
                    color: var(--c-text3);
                    margin: 0 0 8px;
                }
                .calc-res-main-value {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .calc-res-approx {
                    font-size: 1.375rem;
                    color: var(--c-orange);
                    font-weight: 700;
                }
                .calc-res-number {
                    font-size: 1.75rem;
                    font-weight: 900;
                    color: var(--c-text);
                    letter-spacing: -0.03em;
                    line-height: 1;
                }
                .calc-res-unit {
                    font-size: 0.875rem;
                    color: var(--c-text2);
                    font-weight: 500;
                }

                /* Alternative fuels */
                .calc-res-alts {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid rgba(249,115,22,0.10);
                }
                .calc-res-alt-line {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    margin: 0;
                    font-size: 0.875rem;
                    line-height: 1.8;
                }
                .calc-res-alt-or {
                    font-size: 0.72rem;
                    color: var(--c-text3);
                    min-width: 24px;
                }
                .calc-res-alt-num {
                    color: var(--c-orange);
                    font-weight: 700;
                }
                .calc-res-alt-unit {
                    color: var(--c-text2);
                    font-weight: 500;
                }

                /* Cost */
                .calc-res-cost {
                    padding: 14px 16px;
                    background: rgba(249,115,22,0.06);
                    border: 1px solid rgba(249,115,22,0.15);
                    border-radius: 12px;
                }
                .calc-res-cost-label {
                    font-size: 0.78rem;
                    color: var(--c-text3);
                    margin: 0 0 4px;
                }
                .calc-res-cost-value {
                    font-size: 1.375rem;
                    font-weight: 800;
                    color: var(--c-orange);
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                /* Actions */
                .calc-res-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 2px;
                }

                /* ══════════════════════════════════════════
                   Responsive
                   ══════════════════════════════════════════ */
                @media (max-width: 900px) {
                    .calc-card { padding: 32px 24px; }
                    .calc-grid {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                    .calc-panel { min-height: auto; }
                }

                @media (max-width: 479px) {
                    .calc-card { padding: 24px 16px; border-radius: 16px; }
                    .calc-input { max-width: 100%; }
                    .calc-btn { width: 100%; justify-content: center; }
                    .calc-panel { padding: 28px 20px; border-radius: 14px; }
                    .calc-res-number { font-size: 1.5rem; }
                    .calc-preview-title { font-size: 1.125rem; }
                }
            `}</style>
        </section>
    );
}
