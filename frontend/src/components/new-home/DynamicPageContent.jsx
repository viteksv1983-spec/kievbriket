import React, { useEffect, useState } from 'react';
import api from '../../api';

export function DynamicPageContent({ route, position = 'bottom' }) {
    const [page, setPage] = useState(null);

    useEffect(() => {
        api.get(`/pages/by-route`, { params: { route } })
            .then(res => setPage(res.data))
            .catch(err => console.error(`Failed to load dynamic page content for ${route}:`, err));
    }, [route]);

    if (!page) return null;

    if (position === 'top' && page.content) {
        return (
            <div className="layout-container py-10">
                <div
                    className="prose max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        );
    }

    if (position === 'bottom' && page.bottom_seo_text) {
        return (
            <section style={{ padding: '40px 0 80px', display: 'flex', justifyContent: 'center' }}>
                <div className="layout-container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="nh-card" style={{ width: '100%', padding: '4rem', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                        <div
                            className="prose prose-sm prose-gray max-w-none text-gray-400"
                            dangerouslySetInnerHTML={{ __html: page.bottom_seo_text }}
                        />
                    </div>
                </div>
            </section>
        );
    }

    return null;
}
