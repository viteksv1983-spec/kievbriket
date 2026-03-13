import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import api from '../api';

export default function FaqSection({ pageId, defaultTitle = "Поширені запитання", className = "" }) {
    const [faqs, setFaqs] = useState([]);
    const [openIdx, setOpenIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await api.get(`/api/faqs?page=${pageId}`);
                setFaqs(response.data);
            } catch (error) {
                console.error(`Failed to fetch FAQs for page ${pageId}:`, error);
            } finally {
                setLoading(false);
            }
        };

        if (pageId) {
            fetchFaqs();
        }
    }, [pageId]);

    console.log("FaqSection faqs array:", faqs);

    if (loading || faqs.length === 0) {
        return null; // Return null if no FAQs are active
    }

    return (
        <section className={`faq-section-wrapper ${className}`} style={{ padding: 'clamp(40px, 10vw, 100px) 0', backgroundColor: 'transparent', minHeight: '300px' }}>
            {/* SEO Script */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map(f => ({
                        "@type": "Question",
                        "name": f.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": f.answer
                        }
                    }))
                })
            }} />
            <div className="layout-container" style={{ margin: '0 auto' }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 className="h2 faq-mobile-h2" style={{ margin: '0', color: '#ffffff' }}>{defaultTitle}</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div key={idx} style={{
                                backgroundColor: '#1A1E29', // Stylish dark rounded card
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                                <button
                                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                                    style={{
                                        width: '100%', textAlign: 'left', background: 'none', border: 'none',
                                        padding: '1.5rem', display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', cursor: 'pointer',
                                        fontFamily: 'inherit', fontSize: '1.125rem', fontWeight: 600, gap: '1rem',
                                        color: '#ffffff'
                                    }}
                                >
                                    <span style={{ flex: 1 }}>{faq.question}</span>
                                    <ChevronRight
                                        size={20}
                                        style={{
                                            flexShrink: 0,
                                            color: '#f97316',
                                            transform: isOpen ? 'rotate(90deg)' : 'none',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                </button>
                                {isOpen && (
                                    <div style={{ color: '#a0aec0', lineHeight: 1.6, padding: '0 1.5rem 1.5rem 1.5rem' }}>
                                        <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
