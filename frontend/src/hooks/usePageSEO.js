import { useState, useEffect } from 'react';
import api from '../api';

export function usePageSEO(route) {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/pages/by-route', { params: { route } })
            .then(res => setPageData(res.data))
            .catch(err => {
                console.error(`Error fetching SEO data for route ${route}:`, err);
                setPageData(null);
            })
            .finally(() => setLoading(false));
    }, [route]);

    return { pageData, loading };
}
