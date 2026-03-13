import React, { useState } from "react";
import { MapPin, Clock, CheckCircle2, ArrowRight, Truck, Star } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const zones = [
    { name: "Київ", detail: "Доставка на протязі 24 годин", time: "24 год" },
    { name: "Передмістя", detail: "Бориспіль, Бровари, Вишневе, Ірпінь, Буча", time: "24 год" },
    { name: "Київська область", detail: "Фастів, Біла Церква, Обухів, Переяслав", time: "24–48 год" },
];

const OBLAST_PATH = "M467.3 101.9l0.1 0.7-0.1 0.3-0.1 0.2-0.2 0.2-0.3 0-1.1-0.1-0.3 0.1-0.2 0.2-0.1 0.4 0.1 0.5 0.7 1.7 0.1 0.6 0.1 0.7-0.1 0.7-1 4.9-0.1 0.8-0.1 5.4 0.2 2.6 0.1 0.4 0.1 0.2 0.3 0.2 0.6 0 0.3-0.2 0.5-0.4 0.2-0.2 0.3 0 0.7 0.4 0.6 0.5 0.7 0.2 0.5 0 0.3 0 0.5 0.1 0.5 0.3 1.4 1.3 0.3 0.4 0.2 0.5 0.2 0.9 0.1 0.7 0 0.7-0.3 1.5-0.3 1.5-0.1 0.4 0 0.7 0.1 0.6 0.1 0.3 0.4 0.3 0.5 0.3 3 1.1 0.5 0.3 1.8 1.4 0.5 0.5 0.2 0.4 0 0.2-0.3 1.9-0.1 0.7-0.4 1-0.5 1.2-0.8 1.4-0.2 0.5 0 0.4 0.2 0.2 0.3 0.2 0.6 0 1.6-0.5 0.4 0.1 0.5 0.2 0.6 0.6 0.3 0.4 0.4 0.5 0.2 0.2 0.3 0.1 0.5-0.1 0.3-0.2 0.3-0.2 0.4-0.9 0.2-0.1 0.3-0.1 2.6 0.7 0.7 0.1 0.4-0.1 0.8-0.8 0.6-0.2 0.7 0 3 0.2 0.6 0 0.6-0.2 0.3-0.1 0.6-0.5 0.5-0.3 0.3 0 0.4 0.1 0.2 0.3 0.2 0.5 0.5 0.7 0.4 0.5 0.1 0.3-0.1 0.3-0.2 0.7 0 0.3 0.2 0.3 0.3 0.2 0.8 0.1 0.8 0.1 0.4 0.1 0.2 0.2 0 0.4 0 0.8 0.2 0.3 1.3 1.1 0.7 0.8 0.4 0.5 0.2 0.5 0.2 0.5 0.3 1.2 0.1 0.9 0 0.7-0.1 0.4-0.2 0.6-0.4 0.5-0.2 0.2-0.2 0.1-0.6-0.1-0.2 0.1-0.2 0.3-0.1 0.7-0.1 0.3 0.1 0.3 0.3 0.5 1.6 1.6 0.3 0.2 0.3 0.2 1.1-0.1 0.4 0.1 0.3 0.2 0.2 0.4 0.1 0.4-0.1 1.2 0.2 0.5 0.3 0.5 0.2 0.2 0.3 0.1 0.4 0.1 0.6 0 0.5 0.2 0.5 0.4 0.3 0.1 0.4 0.2 0.6-0.2 0.3-0.1 0.3-0.2 0.8 0 1.1 0.1 4.3 1.1 0.6-0.5 0.6-0.7 0.4-0.3 0.5-0.1 3.4 0.8 0.3 0 0.5-0.2 0.5-0.4 0.2-0.1 0.3-0.1 0.8 0.1 0.3 0 0.2-0.2 0.2-0.2 0.6-0.7 0.4-0.3 0.3-0.1 0.6-0.1 0.3-0.1 0.2-0.2 0.3-0.5 0.4-0.4 0.5-0.3 0.6-0.1 2.2 0.2 0.4 0 0.2-0.1 0.4-0.5 0.7-1 0.2-0.2 0.5-0.2 0.2-0.2 0-0.2 0-0.6 0-0.3 0.1-0.3 0.3-0.4 0.1-0.3 0.1-0.9 0.1-0.3 0.5-0.3 1.1-0.4 1.2-0.1 0.5 0.2 0.6 0.4 1.6 1.6 0.7 0.5 2 2.7 0.5 0.6 0.5 0.4 0.3 0.1 0.7 0.1 2.3 0 0.3 0.3 0.3 0.5 0.1 1.2-0.1 1.2-0.1 0.6-0.2 0.2-0.3 0.2-1.2-0.2-0.3 0.1-0.2 0.1-0.6 0.9-0.3 0.5-0.1 0.3 0 0.4 0.2 0.5 1.3 1.1 0.2 0.2 0.2 0.3 0.1 0.6 0 0.8 0.1 0.6 0.2 0.5 0.3 0.3 0.4 0.3 0.8 0.4 0.5 0.1 0.4 0 0.7-0.1 0.6 0.1 0.3 0.2 0.1 0.2 0 0.4-0.1 0.3-0.8 0.8-0.3 0.4 0.3 0.5 0.3 0.4 3.4 2-1.4 3.8-0.9 1.3-0.2 0.3-0.1 0.2 0.1 0.4 0.3 0.5 0.1 0.3-0.3 0.7-1.5 2.2-0.7-0.3-0.5-0.3-0.5-0.3-0.4-0.2-0.7 0-0.3 0-0.5 0.2-0.3 0.2-0.2 0.3-0.6 0.7-0.3 0.5-0.2 0.4-0.1 0.7 0 0.6 0.2 0.4 0.8 1.1 0.2 0.5 0 0.6-0.1 0.3-0.3 0.6-0.4 0.5-1.1 1.2-0.7 0.3-0.7 0.1-0.4 0-0.5-0.3-0.3 0.1-0.2 0.5-0.3 0.8-0.3 0.6-0.3 0.3-1.8 1.4-0.4 0.5-0.3 0.4 0.1 0.3 0.4 1.1 0.1 0.6 0 0.7 0.3 1.2 0.3 1.1 0.2 0.5-0.1 0.7-0.3 0.3-0.5 0.2-2.1 0.7-0.3 0.1-0.2 0.2-0.2 0.4-0.1 0.2 0.2 1.2 0 0.7 0 0.7-0.1 0.7-0.3 0.6-0.5 1.2-1.4 1.9-0.2 0.5 0.1 0.9-0.2 0.7-0.1 0.2-1 1-0.6 1-0.6 1.2-0.2 0.4-0.5 0.2-5.2-1-0.3-0.2-0.1-0.2-0.1-0.3 0.1-1.8-0.1-0.5-0.2-0.3-0.3-0.1-0.3 0-0.2 0.2-0.2 0.4-0.3 1.6-0.1 0.3-0.3 0.5-0.3 0.2-0.4 0.1-0.7 0.1-0.4-0.1-0.3-0.2-0.5-0.4-0.2 0-0.3 0.1-0.3 0.5-0.2 0.4-0.1 0.8-0.1 0.3-0.3 0.2-0.3-0.2-0.4-0.6-0.4-0.5-0.3-0.5 0-0.7-0.2-0.5-0.6-0.6-0.3-0.5-0.1-0.3-0.1-0.9-0.2-0.2-0.2-0.1-0.6-0.1-0.4 0.1-1 0.3-0.6 0.1-2 0-0.6 0.1-0.6 0.2-4.3 3-1.9 0.2-0.3 0.2-0.4 0.3-0.4 0.5-0.5 1.1-0.7 0.9-0.2 0.3 0 0.2 0.1 0.3 0.2 0.2 0.7 0.5 0.1 0.2-0.1 0.6-0.6 1.3-0.2 0.4 0 0.7 0.1 0.2 0.5 0.4 0.1 0.2 0.1 0.3 0 0.3-0.5 3.1-0.1 0.3-0.8 1.3-0.1 0.3 0 0.3 0 0.2 0.3 0.8 0 0.3-0.1 0.7-0.6 1.1-0.7 1.9-0.2 0.3-0.6 0.6-0.3 0.4-0.1 0.3 0 1 0.1 0.6 0.2 0.2 0.2 0.1 0.7 0.2 0.2 0.2 0.2 0.2 0.1 0.3 0 0.6-0.1 1-0.1 0.6-0.3 0.3-1.7 1.2-0.5 0.5-0.3 0.4-0.9 2.3-0.3 0.4-0.3 0.5-2.4 1.6-0.3 0.3-0.3 0.5-1.4 1.3-0.6 0.6-0.5 0.8-0.2 0.2-1 0.8-0.6 0.7-1.3 2.4-0.2 0.7 0 0.3 0 1 0 0.3-0.2 0.4-0.4 0.4-0.7-0.2-0.4-0.2-0.2-0.3-0.3-0.5-0.2-0.1-0.4 0-0.5 0.4-0.6 0.6-0.3 0.1-0.6 0.1-0.9-0.4-0.3-0.1-0.5 0.3-0.3 0.3-0.6 0.7-0.2 0.2-1.8 0.5-1 0.7-0.3 0-0.3 0-0.3-0.2-0.2-0.3-1.1-1.9-0.4-0.4-0.3 0-0.5 0-0.8 0.3-0.7-0.1-0.4-0.1-0.4-0.4-0.2-0.1-0.3 0-0.2 0.3-0.7 1.5-0.3 0.5-0.2 0.1-0.3 0.1-1.6-0.9-0.2-0.1-0.3 0-0.6 0.6-0.3 0.2-1.8 0.6-0.4 0-0.4-0.4-0.5-0.8-0.6-0.6-0.5-0.3-0.3-0.1-0.4 0-0.4 0.2-0.6 0.3-0.2 0.4-0.2 0.3-0.2 0.7 0 0.7 0 1-0.1 0.3-0.3 1-1.1 4.6-0.1 0.3-0.3 0.2-0.5 0-0.5-0.3-0.3-0.4 0-0.3 0-0.7-0.1-0.2-0.4-0.3-9.7-2-0.3-0.2-0.2-0.2-0.1-0.2 0-0.3 0.1-0.4 0.3-0.5 0.6-1 0.1-0.3 0-0.2-0.2-0.2-1.2-0.5-0.3 0-0.3 0.1-0.6 0.7-0.4 0.5-0.8 0.4-0.4 0.4-0.2 0.3 0 0.2 0.2 0.4 0.3 0.7 0.2 0.5 0 0.3-0.3 0.1-0.5-0.1-0.2-0.1-0.6-0.3-0.3-0.1-1.6-0.1-0.4-0.1-0.4-0.1-0.4 0.2-0.4 0.5-0.6 0.9-0.4 0.2-0.5 0.1-1.9 0-0.5 0.2-1.2 0.9-0.7 0.3-0.3 0.5-0.3 0.9-0.1 0.4-0.5 0.8-0.4 0.4-0.8 0.8-0.3 0.4 0 0.3-0.1 0.3 0.2 0.9-0.2 0.3-0.4 0.2-1.4-0.1-3.3 0.4-0.9-0.4-1.1-0.8-0.4-0.5-0.2-0.4-0.1-0.6 0.1-0.3 0.3-0.2 0.4-0.2 0.1-0.3-0.5-0.5-2.1-0.6-0.5-1.2-0.6-0.3-0.9 0.1-0.7 0-0.4-0.2-0.2-0.2-0.1-0.4-0.4-0.8-1-1.5-0.7-1.7-0.3-0.3-0.2-0.3-0.2-0.1-1.6-0.2-0.6-0.2-0.8-0.4-0.3-0.4-0.2-0.3 0-0.7-0.2-0.5-0.2-0.6-0.8-1.6-0.1-0.8 0.1-0.6 0.2-0.4 0.4-0.4 2.7-1.8 0.2-0.2 0.3-0.6 0-0.7 0-1.1-0.2-0.7-1.2-2.6-0.2-0.5 0-0.3 0.1-0.3 0.3-0.3 0.4-0.2 0.4-0.3 0.2-0.4 0.1-1 0-0.6-0.1-0.4-0.2-0.3-2.2-1.1-0.3-0.2-0.4-0.4-0.4-0.6-0.2-0.5-0.1-0.4-0.1-0.9 0-0.7 0.1-0.7 0.1-0.3 0.6-1.1 0.2-0.8 0.1-0.6-0.1-0.3-0.1-0.3-0.5-0.3-0.3-0.2-2.8-0.4 0.2-1.3 0.5-0.4 0.8-0.4 0.2-0.4 0.2-0.4 0.1-0.4 0-0.7 0-0.5-0.1-0.3-0.1-0.2-0.6 0-1.3 0.2-0.7 0-0.7-0.1 0-0.4 0.4-0.5 0.3-0.5 0.4-0.8 0.3-1 0.2-1.1 0.1-0.6-0.1-0.5-0.3-0.6-0.1-0.4-0.2-0.7 0.1-0.4 0.1-0.3 0.5-0.3 0.2-0.1 0.3 0 0.7 0.1 0.4-0.2 0.3-0.3 0.3-0.6 0.3-0.2 0.3-0.1 0.5 0.1 0.5-0.1 2-1.5 1.8-0.8 0.4-0.3 0.6-0.7 0.3-0.1 0.8-0.3 0.3-0.2 0.4-0.4 0.9-1.2 0.4-0.9 0.3-0.4 0.2-0.2 1.5-0.8 0.4-0.3 1.3-1.4 0.3-0.5 0.1-0.5-0.1-0.6-3.2-5.2-0.2-0.7 0-0.6 0.2-0.3 0.3-0.4 0.2-0.5-0.8-3.2-0.1-0.8 0-0.5 0.1-0.4 0.2-0.3 0.3-0.1 1.8-0.5 0.4-0.2 0.4-0.4 0.4-0.9 0-0.4-0.1-0.4-0.3-0.5 0-1.1 0-0.6-0.2-0.4-0.2-0.2-0.8-0.5-0.4-0.3-0.1-0.3-0.2-0.5-0.1-0.3 0.1-1.9-0.1-1 0.3-3.4 0-0.8-0.2-0.4-0.7-0.3-0.2-0.1-0.4-0.4-0.5-0.9-0.6-1.6-0.4-0.5-0.2-0.2-0.7-0.1-0.7 0-0.2-0.2-0.3-0.5-0.2-1.3-0.7-1.9-0.3-2.4-0.2-0.4-0.6-0.9-0.7-0.9-0.4-0.4-0.3-0.1-0.3-0.1-2.4 0.1-0.3 0-2.1 0.9-0.3 0.1-0.3 0-0.4-0.3-0.3-0.6-0.1-0.4 0.2-0.3 1.2-0.1 0.3-0.1 0.3-0.2 0.3-0.6 0-0.3-0.2-0.2-0.9-0.5-0.2-0.3 0-0.3 0.1-0.3 0.2-0.1 0.3 0 1 0.2 0.3 0 0.2-0.1 0.2-0.2 0.3-0.6 0.5-1.7 0.1-0.7-0.1-0.2-0.3-0.5-0.6-0.3-0.3-0.3-0.2-0.7 0-0.4 0.2-0.2 0.6-0.1 0.3-0.1 0.3-0.5 0.5-1.6 0.3-1-0.1-0.3-0.1-0.3-1-0.7-0.4-0.5-0.3-0.5 0-0.3 0.1-0.4 0.5-1.2 0.6-0.9 1.5-2.4 0.5-1.2 0.4-0.5 1.7-0.9 0.3-0.3 0.3-0.4 0.3-0.8 0.1-0.5 0-0.4-0.8-3-0.2-1.3-0.2-0.8-0.2-0.3-0.4-0.4-0.6-0.2-0.7-0.1-2.1 0.2-0.2 0-0.3-0.2-0.1-0.4 0-0.3 1.1-6.2-0.1-0.6-0.1-0.4-0.1-0.2-1.3-1.5-3.1-4.9-0.2-0.2-0.3-0.1-0.3 0-0.3-0.2-0.3-0.5-0.3-1.2 0.1-0.5 0.2-0.3 1.8 0 0.3 0.1 0.3 0.1 0.7 0.6 0.2 0.1 0.3 0 0.2-0.6 0-0.6-0.2-2 0-0.6 0.1-1 0.1-0.4 0.3-0.6 0.7-1.1 0.3-0.6 0-0.4 0-0.4-0.1-0.2-0.3-0.6-0.4-0.4-0.2-0.2-0.5-0.3-1.4-0.4-0.2-0.2-0.3-0.2-0.1-0.3-0.1-0.6-0.2-0.5-0.2-0.3-0.3-0.4-1.7-1.6-1-0.7-0.6-0.2-0.3 0-0.3 0-0.1 0.2-1.2 1.9-0.1 0.2-0.2 0.1-0.2-0.4-0.2-0.6-0.3-1.2-0.6-4.6-1-3.8 0-0.4 0.3-0.1 0.7-0.1 0.6-0.1 1-0.6 1.7-1.3 0.7-0.7 0.7-0.9 0.6-1.2 0.1-0.7 0.1-1 0.2-3.3-0.1-0.7 0-0.2-0.2-0.3-0.2 0.1-0.5 0.3-0.2 0.1-0.3-0.1-0.3-0.4-0.4-0.8 1.5-1.3 1.3-0.4 2.4 1 1.1 0 0.8-1.5 0.8-2.1 0.6-1.1 0.7-0.4 1.5-0.1 1.2-0.6 0.9-0.9 0.8-1.2 1.1-1.1 1.1-0.4 1.3-0.2 1.2 0.1 0.9 0.7 0.9 1.6 0.5 1.4 0.7 0.9 5.1 0.9 1-0.3 0.5-0.6 0.9-1.7 0.7-0.5 0.6 0.1 0.9 0.6 0.7-0.1 3.4-1.8 1.2-0.3 7.8-0.2 1.6 0.4 1.5 1.1 2.1 2.9 0.8 0.8 2.8 1.4 0.7 0.7 0.3 0.6 0.2 0.6 0 0.7 0 0.9-0.1 0.7-0.4 1.8-0.2 0.1 0.4 1 1.7 2.2 0.7 0.6 0.9 0.4 1.6 0 0.8 0.2 0.9 0.7 1.2 1.9 0.9 0.3 0.7-0.1 0.8 0.2 0.7 0.4 0.6 0.7 0.4 0.9 0.6-0.2 0.3-0.5z";

const SAT_PINS = [
    { label: "Бровари", cx: 272, cy: 100, beginAnim: "0s" },
    { label: "Ірпінь", cx: 104, cy: 116, beginAnim: "1.1s" },
    { label: "Бориспіль", cx: 298, cy: 192, beginAnim: "0.5s" },
    { label: "Вишневе", cx: 92, cy: 196, beginAnim: "1.7s" },
];

export function KyivMap({ hoveredZone }) {
    const oblastActive = hoveredZone === "Київська область";
    const suburbActive = hoveredZone === "Передмістя";
    const kyivActive = hoveredZone === "Київ";

    return (
        <svg
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
            className="kyiv-map-svg"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-label="Карта зони доставки Київ Дрова"
        >
            <defs>
                <radialGradient id="kb-zone3" cx="50%" cy="53%" r="50%">
                    <stop offset="0%" stopColor="rgba(249,115,22,0.08)" />
                    <stop offset="100%" stopColor="rgba(249,115,22,0.02)" />
                </radialGradient>
                <radialGradient id="kb-zone2" cx="50%" cy="53%" r="35%">
                    <stop offset="0%" stopColor="rgba(249,115,22,0.14)" />
                    <stop offset="100%" stopColor="rgba(249,115,22,0.04)" />
                </radialGradient>
                <radialGradient id="kb-zone1" cx="50%" cy="53%" r="20%">
                    <stop offset="0%" stopColor="rgba(249,115,22,0.30)" />
                    <stop offset="100%" stopColor="rgba(249,115,22,0.10)" />
                </radialGradient>
                <filter id="kb-glow2" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                </filter>
            </defs>

            {/* Background */}
            <rect width="400" height="300" rx="0" fill="#0c1810" />

            {/* Map Group - Shifted Up Slightly */}
            <g transform="translate(0, -5)">
                {/* Oblast zone */}
                <path
                    d={OBLAST_PATH}
                    transform="translate(-275.6, -22.5)"
                    fill={oblastActive ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.03)"}
                    stroke={oblastActive ? "rgba(249,115,22,0.5)" : "rgba(249,115,22,0.25)"}
                    strokeWidth={oblastActive ? "1.8" : "1.2"}
                    strokeLinejoin="round"
                    style={{ transition: "all 0.4s ease" }}
                />

                {/* Kyiv zone deleted per user request */}

                {SAT_PINS.map((pin) => (
                    <g key={pin.label}>
                        <circle cx={pin.cx} cy={pin.cy} r="6" fill="rgba(249,115,22,0.15)" />
                        <circle cx={pin.cx} cy={pin.cy} r="2.5" fill="#F97316" opacity="0.9" filter="url(#kb-pin-glow)" />
                        <text
                            x={pin.cx} y={pin.cy + 16}
                            textAnchor="middle"
                            style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, fill: "rgba(255,255,255,0.6)" }}
                        >
                            {pin.label}
                        </text>
                    </g>
                ))}

                <g filter="url(#kb-pin-glow)">
                    <circle cx="200" cy="158" r="6" fill="#F97316" />
                    <circle cx="200" cy="158" r="3" fill="#fff" />
                </g>
                <text
                    x="200" y="145"
                    textAnchor="middle"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, fill: "rgba(255,255,255,0.9)" }}
                >
                    Київ
                </text>
            </g>

            <text x="50%" y="278" textAnchor="middle"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, fill: "rgba(249,115,22,0.8)" }}>
                Працюємо по всій Київській області
            </text>
        </svg>
    );
}

export function DeliverySection() {
    const { ref, visible } = useReveal();
    const [hoveredZone, setHoveredZone] = useState(null);

    return (
        <section
            id="delivery"
            ref={ref}
            className="delivery-section-wrap"
            style={{ padding: "100px 0", background: "var(--c-bg)", position: "relative" }}
        >
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 96,
                background: "var(--gradient-section-fade)",
                pointerEvents: "none",
                zIndex: 0,
            }} />

            <div className="layout-container" style={{ zIndex: 1 }}>

                <div className="delivery-header-wrap reveal visible" style={{ textAlign: "center", marginBottom: "var(--s-header)" }}>
                    <h2 className="h2" style={{ marginBottom: 12 }}>
                        Доставляємо по{" "}
                        <span style={{ color: "var(--c-orange)" }}>Києву та області</span>
                    </h2>
                    <p style={{ fontSize: "0.9375rem", color: "var(--c-text2)", maxWidth: 460, margin: "0 auto", marginBottom: "1.5rem" }}>
                        Власний автопарк дозволяє нам контролювати терміни і якість доставки без посередників.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text)' }}>
                            <CheckCircle2 size={14} color="var(--c-orange)" /> 1000+ доставок
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text)' }}>
                            <Star size={14} color="var(--c-orange)" /> працюємо з 2013 року
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text)' }}>
                            <Truck size={14} color="var(--c-orange)" /> власний автопарк
                        </span>
                    </div>
                </div>

                <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}
                    className="delivery-grid"
                >
                    <div
                        className={`reveal ${visible ? "visible" : ""}`}
                        style={{
                            background: "var(--color-bg-green-card)",
                            border: "1px solid var(--color-border-orange-lg)",
                            borderRadius: 16,
                            overflow: "hidden",
                            position: "relative",
                            aspectRatio: "4/3",
                        }}
                    >
                        <KyivMap hoveredZone={hoveredZone} />
                    </div>

                    <div
                        className={`reveal ${visible ? "visible" : ""}`}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem", transitionDelay: "0.12s" }}
                    >
                        {zones.map((z) => (
                            <div
                                key={z.name}
                                className="nh-card"
                                onMouseEnter={() => setHoveredZone(z.name)}
                                onMouseLeave={() => setHoveredZone(null)}
                                style={{
                                    padding: "1.5rem", display: "flex", justifyContent: "space-between",
                                    alignItems: "flex-start", gap: 16,
                                    cursor: "default",
                                    border: `1px solid ${hoveredZone === z.name ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"}`,
                                    transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                                    transform: hoveredZone === z.name ? "translateX(4px)" : "none",
                                    boxShadow: hoveredZone === z.name
                                        ? "0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(249,115,22,0.08)"
                                        : "none",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <MapPin size={15} color="var(--c-orange)" />
                                        <span style={{ fontWeight: 700, color: "var(--c-text)", fontSize: "0.9375rem" }}>{z.name}</span>
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "var(--c-text2)", lineHeight: 1.5 }}>{z.detail}</p>
                                </div>
                                <div style={{
                                    background: hoveredZone === z.name ? "rgba(249,115,22,0.18)" : "rgba(249,115,22,0.10)",
                                    border: "1px solid rgba(249,115,22,0.20)",
                                    borderRadius: 8,
                                    padding: "6px 12px",
                                    display: "flex", alignItems: "center", gap: 5,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    transition: "background 0.25s",
                                }}>
                                    <Clock size={12} color="var(--c-orange)" />
                                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--c-orange)" }}>{z.time}</span>
                                </div>
                            </div>
                        ))}

                        <div style={{
                            padding: "1.25rem",
                            background: "rgba(249,115,22,0.06)",
                            borderRadius: 12,
                            border: "1px solid rgba(249,115,22,0.15)",
                            display: "flex", flexDirection: "column", gap: 12,
                        }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <CheckCircle2 size={17} style={{ color: "var(--c-orange)", flexShrink: 0, marginTop: 2 }} />
                                <p style={{ fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.6 }}>
                                    Потрібна доставка за межі Київської обл.?{" "}
                                    <span style={{ color: "var(--c-text)", fontWeight: 600 }}>Зв'яжіться з нами</span> — знайдемо рішення.
                                </p>
                            </div>
                            <a
                                href="#contact"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 7,
                                    background: "#F97316",
                                    color: "#fff",
                                    borderRadius: 9,
                                    padding: "10px 18px",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    alignSelf: "flex-start",
                                    boxShadow: "0 2px 12px rgba(249,115,22,0.30)",
                                    transition: "background 0.2s, box-shadow 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#ea580c";
                                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.45)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#F97316";
                                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(249,115,22,0.30)";
                                }}
                            >
                                Уточнити доставку <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) { .delivery-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) {
            .delivery-section-wrap { padding: 40px 0 60px 0 !important; }
            .delivery-header-wrap { margin-bottom: 24px !important; }
        }
        @media (max-width: 479px) {
          .delivery-grid { gap: 0.875rem !important; }
          .delivery-grid .nh-card { padding: 1rem !important; }
        }
      `}</style>
        </section>
    );
}
