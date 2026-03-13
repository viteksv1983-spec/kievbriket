import React, { useState, useEffect } from "react";
import { Star, Quote, Play, X } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import api from "../../api";

function getYouTubeInfo(url) {
    if (!url) return { id: null, isShort: false };
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return {
        id: (match && match[2].length === 11) ? match[2] : null,
        isShort: url.includes('/shorts/')
    };
}

function StarRow({ count, bright }) {
    return (
        <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2, 3, 4].map((i) => (
                <Star
                    key={i}
                    size={14}
                    fill={i < count ? "#F97316" : "transparent"}
                    color="#F97316"
                    style={{
                        opacity: bright ? 1 : 0.75,
                        transition: "opacity 0.2s",
                        filter: bright && i < count ? "drop-shadow(0 0 3px rgba(249,115,22,0.7))" : "none",
                    }}
                />
            ))}
        </div>
    );
}

function ReviewCard({ r, delay, onPlayVideo }) {
    const [hovered, setHovered] = useState(false);
    const ytInfo = getYouTubeInfo(r.youtube_url);
    const ytId = ytInfo.id;
    const isShort = ytInfo.isShort;

    const getInitials = (name) => {
        if (!name) return "І";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div
            className="nh-card review-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                border: `1px solid ${hovered ? "rgba(249,115,22,0.30)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: hovered
                    ? "0 20px 52px rgba(0,0,0,0.45), 0 0 0 1px rgba(249,115,22,0.10), 0 0 32px rgba(249,115,22,0.08)"
                    : "0 6px 24px rgba(0,0,0,0.22)",
                transition: "transform 0.25s ease, border-color 0.25s, box-shadow 0.25s",
                breakInside: "avoid",
                marginBottom: "1.25rem",
                animation: `fadeInUp 0.6s ease forwards`,
                animationDelay: delay,
                opacity: 0,
            }}
        >
            {ytId && (
                <div
                    onClick={() => onPlayVideo(ytId)}
                    style={{
                        position: "relative",
                        width: "100%",
                        height: isShort ? 380 : 250,
                        borderRadius: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                        marginBottom: 4,
                        background: "#0d1117"
                    }}
                >
                    <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt="Video Thumbnail"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: hovered ? 1 : 0.85,
                            transform: hovered
                                ? `scale(${isShort ? 1.85 : 1.25})`
                                : `scale(${isShort ? 1.8 : 1.2})`,
                            transition: "opacity 0.25s, transform 0.25s",
                            pointerEvents: "none"
                        }}
                    />
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: hovered ? "translate(-50%, -50%) scale(1.05)" : "translate(-50%, -50%) scale(1)",
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "rgba(249,115,22,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                        transition: "transform 0.2s",
                        pointerEvents: "none"
                    }}>
                        <Play fill="#fff" color="#fff" size={24} style={{ marginLeft: 3 }} />
                    </div>
                </div>
            )}

            <Quote size={28} style={{ color: hovered ? "rgba(249,115,22,0.45)" : "rgba(249,115,22,0.22)", transition: "color 0.25s" }} />
            <StarRow count={r.stars} bright={hovered} />
            <p style={{ fontSize: "0.9rem", color: "var(--c-text2)", lineHeight: 1.7, flex: 1, whiteSpace: "pre-wrap" }}>
                "{r.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--c-orange-dk), var(--c-orange))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800, color: "#fff", flexShrink: 0,
                    boxShadow: hovered ? "0 0 14px rgba(249,115,22,0.45)" : "none",
                    transition: "box-shadow 0.25s",
                }}>
                    {getInitials(r.name)}
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--c-text)" }}>{r.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--c-text3)" }}>{r.city}</p>
                </div>
                {r.date && <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", flexShrink: 0 }}>{r.date}</p>}
            </div>
        </div>
    );
}

export function ReviewsSection() {
    const { ref, visible } = useReveal();
    const [reviews, setReviews] = useState([]);
    const [playingVideoId, setPlayingVideoId] = useState(null);

    useEffect(() => {
        // Fetch reviews from API
        api.get('/api/reviews')
            .then(res => setReviews(res.data))
            .catch(err => console.error("Failed to load reviews:", err));
    }, []);

    // Also support closing modal on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setPlayingVideoId(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <section
            ref={ref}
            style={{
                padding: "var(--s-section) 0 5rem",
                background: "linear-gradient(180deg, #0D1117 0%, var(--c-green-bg) 30%, var(--c-green-bg) 100%)",
                position: "relative",
            }}
        >
            <div className="layout-container">
                {/* Header */}
                <div className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "var(--s-header)" }}>
                    <p className="section-label" style={{ marginBottom: "var(--s-tight)" }}>Відгуки клієнтів</p>
                    <h2 className="h2" style={{ marginBottom: 28 }}>
                        Що кажуть{" "}
                        <span style={{ color: "var(--c-orange)" }}>наші клієнти</span>
                    </h2>

                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 20,
                        background: "var(--color-bg-overlay)",
                        border: "1px solid rgba(249,115,22,0.26)",
                        borderRadius: 16,
                        padding: "18px 36px",
                        boxShadow: "0 0 48px rgba(249,115,22,0.10), 0 0 0 1px rgba(249,115,22,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}>
                        <div className={`rating-stars ${visible ? "stars-visible" : ""}`} style={{ display: "flex", gap: 5 }}>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    fill="#F97316"
                                    color="#F97316"
                                    className="rating-star"
                                    style={{
                                        filter: "drop-shadow(0 0 6px rgba(249,115,22,0.75))",
                                        animationDelay: `${i * 0.08}s`,
                                    }}
                                />
                            ))}
                        </div>

                        <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.10)" }} />

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 5, lineHeight: 1 }}>
                                <span style={{
                                    fontSize: "2.6rem",
                                    fontWeight: 900,
                                    color: "var(--color-accent-display)",
                                    letterSpacing: "-0.05em",
                                    lineHeight: 1,
                                    textShadow: "0 0 30px rgba(249,115,22,0.65), 0 0 60px rgba(249,115,22,0.25)",
                                }}>4.9</span>
                                <span style={{ fontSize: "1.05rem", color: "rgba(249,115,22,0.45)", fontWeight: 600 }}>/ 5</span>
                            </div>
                            <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.36)", fontWeight: 400, letterSpacing: "0.01em" }}>
                                на основі <span style={{ color: "rgba(255,255,255,0.62)", fontWeight: 600 }}>320+</span> відгуків
                            </span>
                        </div>
                    </div>
                </div>

                {reviews.length > 0 && (
                    <div className={`reviews-grid ${visible ? "visible" : ""}`}>
                        {reviews.map((r, i) => (
                            <ReviewCard key={r.id} r={r} delay={`${(i % 5) * 0.15}s`} onPlayVideo={setPlayingVideoId} />
                        ))}
                    </div>
                )}
            </div>

            {/* Video Modal */}
            {playingVideoId && (
                <div
                    style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.85)",
                        backdropFilter: "blur(8px)",
                        zIndex: 99999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "fadeIn 0.2s ease"
                    }}
                    onClick={() => setPlayingVideoId(null)}
                >
                    <button
                        onClick={() => setPlayingVideoId(null)}
                        style={{
                            position: "absolute",
                            top: 24, right: 24,
                            background: "rgba(255,255,255,0.1)",
                            border: "none",
                            borderRadius: "50%",
                            width: 48, height: 48,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                            color: "#fff",
                            transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    >
                        <X size={28} />
                    </button>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: "90%",
                            maxWidth: 400, // typical shorts aspect ratio width
                            height: "80vh",
                            maxHeight: 800,
                            borderRadius: 16,
                            overflow: "hidden",
                            background: "#000",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
                        }}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <style>{`
        /* Star shimmer animation */
        @keyframes starPop {
          0%   { opacity: 0; transform: scale(0.5); }
          60%  { opacity: 1; transform: scale(1.18); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .rating-star { opacity: 0; }
        .stars-visible .rating-star {
          animation: starPop 0.40s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        .reviews-grid {
            column-count: 3;
            column-gap: 1.25rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        @media (max-width: 900px) { 
            .reviews-grid { column-count: 2; } 
        }
        @media (max-width: 600px) { 
            .reviews-grid { column-count: 1; } 
        }
        @media (max-width: 479px) {
          .rating-pill {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 14px 20px !important;
            width: 100% !important;
            max-width: 280px !important;
          }
          .rating-pill-divider { display: none !important; }
          .review-card { padding: 1.25rem !important; }
        }
        .reviews-grid.visible .nh-card:hover { transform: translateY(-6px) !important; z-index: 10; position: relative; }
      `}</style>
        </section>
    );
}
