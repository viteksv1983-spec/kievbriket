import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const SiteSettingsContext = createContext({});

export function SiteSettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all settings in parallel
        Promise.allSettled([
            api.get('/admin/site-settings').catch(() => null),
            api.get('/api/reviews').catch(() => ({ data: [] })),
            api.get('/api/faqs').catch(() => ({ data: [] })),
        ]).then(([settingsRes, reviewsRes, faqsRes]) => {
            const siteSettings = settingsRes.status === 'fulfilled' && settingsRes.value?.data
                ? settingsRes.value.data
                : {};
            const reviews = reviewsRes.status === 'fulfilled' && reviewsRes.value?.data
                ? reviewsRes.value.data
                : [];
            const faqs = faqsRes.status === 'fulfilled' && faqsRes.value?.data
                ? faqsRes.value.data
                : [];

            setSettings({
                ...siteSettings,
                reviews,
                faqs,
            });
            setLoading(false);
        });
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}

export default SiteSettingsContext;
