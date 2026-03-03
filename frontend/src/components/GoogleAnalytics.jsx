import { useEffect, useState } from 'react';
import api from '../api';

/**
 * GoogleAnalytics — loads GA4 gtag.js dynamically from the tracking ID stored in backend.
 * Renders nothing visible. Place once in App.jsx.
 */
export default function GoogleAnalytics() {
    const [gaId, setGaId] = useState(null);

    useEffect(() => {
        api.get('/api/site-settings/ga')
            .then(res => {
                const id = res.data?.ga_tracking_id;
                if (id && id.trim()) {
                    setGaId(id.trim());
                }
            })
            .catch(() => { }); // silently fail
    }, []);

    useEffect(() => {
        if (!gaId) return;

        // Don't inject twice
        if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return;

        // 1. Load gtag.js script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // 2. Initialize gtag
        const inlineScript = document.createElement('script');
        inlineScript.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScript);
    }, [gaId]);

    return null; // renders nothing
}
