import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function DynamicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        api.get(`/pages/by-route`, { params: { route: `/${slug}` } })
            .then(res => {
                setPage(res.data);
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    setNotFound(true);
                }
                console.error('Failed to load page', err);
            })
            .finally(() => setLoading(false));
    }, [slug]);

    // Set document title
    useEffect(() => {
        if (page?.meta_title) {
            document.title = page.meta_title;
        }
        return () => { document.title = 'КиївБрикет'; };
    }, [page]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
    );

    if (notFound || !page) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
            <p className="text-gray-500 text-lg mb-6">Сторінку не знайдено</p>
            <Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all">
                На головну
            </Link>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-[60vh]">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] py-12 md:py-16">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                        {page.h1_heading || page.name || page.meta_title}
                    </h1>
                    {page.meta_description && (
                        <p className="text-white/60 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
                            {page.meta_description}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
                {page.content ? (
                    <div
                        className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                ) : (
                    <p className="text-gray-400 text-center py-10">
                        Контент цієї сторінки ще не заповнено.
                    </p>
                )}

                {page.bottom_seo_text && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div
                            className="prose prose-sm prose-gray max-w-none text-gray-500"
                            dangerouslySetInnerHTML={{ __html: page.bottom_seo_text }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
