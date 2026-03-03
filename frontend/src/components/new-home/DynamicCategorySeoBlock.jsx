import React from 'react';

/**
 * DynamicCategorySeoBlock — renders seo_text from CategoryMetadata (DB).
 * Replaces hardcoded FirewoodSeoBlock, BriquettesSeoBlock, CoalSeoBlock.
 *
 * Props:
 *   - activeCategory: object from CategoryMetadata with { seo_text, seo_h1, name }
 */
export function DynamicCategorySeoBlock({ activeCategory }) {
    if (!activeCategory?.seo_text) return null;

    const heading = activeCategory.seo_h1
        || `Купити ${activeCategory.name?.toLowerCase() || 'тверде паливо'} у Києві`;

    return (
        <section style={{ padding: '100px 0', display: 'flex', justifyContent: 'center' }}>
            <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nh-card" style={{
                    width: '100%',
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '24px',
                }}>
                    <h2 className="h2" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        {heading}
                    </h2>
                    <div
                        style={{
                            maxWidth: '100%',
                            color: 'var(--c-text2)',
                            lineHeight: 1.8,
                            fontSize: '1.05rem',
                            textAlign: 'left',
                        }}
                        dangerouslySetInnerHTML={{ __html: activeCategory.seo_text }}
                    />
                </div>
            </div>
        </section>
    );
}
