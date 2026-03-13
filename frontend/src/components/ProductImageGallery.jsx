import React, { useState, useCallback } from 'react';
import { getImageUrl } from '../utils/urls';
import api from '../api';

/**
 * ProductImageGallery — hover-to-switch image gallery for product cards.
 * Shows dots at the bottom if there are multiple images.
 * Falls back to a placeholder if no image available.
 */
export default function ProductImageGallery({ product, alt, style = {}, className = '' }) {
    const images = [
        product.image_url,
        product.image_url_2,
        product.image_url_3,
    ].filter(Boolean);

    const [activeIdx, setActiveIdx] = useState(0);

    const handleMouseMove = useCallback((e) => {
        if (images.length <= 1) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const fraction = x / rect.width;
        const idx = Math.min(Math.floor(fraction * images.length), images.length - 1);
        setActiveIdx(idx);
    }, [images.length]);

    const handleMouseLeave = useCallback(() => {
        setActiveIdx(0);
    }, []);

    const currentImg = images[activeIdx]
        ? (images[activeIdx].startsWith('http')
            ? images[activeIdx]
            : getImageUrl(images[activeIdx], api.defaults.baseURL))
        : `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(product.name || 'Product')}`;

    return (
        <div
            style={{ position: 'relative', width: '100%', height: '100%', ...style }}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={currentImg}
                alt={alt || product.name}
                loading="lazy"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(product.name || 'Product')}`;
                }}
                style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'opacity 0.2s ease',
                }}
            />
            {/* Dot indicators */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute', bottom: '10px', left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', gap: '6px', zIndex: 5,
                }}>
                    {images.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: activeIdx === i ? '18px' : '7px',
                                height: '7px',
                                borderRadius: '4px',
                                background: activeIdx === i ? 'var(--c-orange, #f97316)' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.25s ease',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            }}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIdx(i); }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
