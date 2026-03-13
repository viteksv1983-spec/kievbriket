/**
 * Get the category URL path for any category slug.
 */
export const getCategoryUrl = (slug) => {
    if (!slug) return `/catalog/drova`;
    return `/catalog/${slug}`;
};

/**
 * Get the product detail URL for a given product object.
 */
export const getProductUrl = (product) => {
    if (!product || !product.slug) return null;
    const catSegment = product.category || 'drova';
    return `/catalog/${catSegment}/${product.slug}`;
};

/**
 * Get the fully qualified image URL, safely encoding URI components
 * to fix broken images with non-ASCII characters in the filename.
 */
export const getImageUrl = (imagePath, baseURL) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('blob')) return imagePath;

    // Split and encode only the filename part to prevent encoding the slashes
    const parts = imagePath.split('/');
    const encodedPath = parts.map((part, index) => {
        // Don't encode empty strings (from leading slashes)
        if (!part) return '';
        // Only encode the actual filename to handle cyrillic/spaces, leave 'media' etc alone
        return index === parts.length - 1 ? encodeURIComponent(part) : part;
    }).join('/');

    // Safely access env vars which might be undefined in raw Node/SSG
    let envApiUrl = '';
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            envApiUrl = import.meta.env.VITE_API_URL || '';
        } else if (typeof process !== 'undefined' && process.env) {
            envApiUrl = process.env.VITE_API_URL || '';
        }
    } catch (e) { /* ignore */ }

    // Safely get window hostname
    let hostFallback = 'localhost';
    try {
        if (typeof window !== 'undefined' && window.location) {
            hostFallback = window.location.hostname;
        }
    } catch (e) { /* ignore */ }

    // If baseURL is just '/api' (local Vite proxy), we need the real host for images
    // In production, envApiUrl (e.g. https://kievbriket-api.onrender.com) is the real backend URL.
    // On shared hosting, images are served from the same origin (no separate port).
    let base = baseURL;
    if (!base || base === '/api' || base === '/api/v1') {
        if (envApiUrl) {
            base = envApiUrl;
        } else if (typeof window !== 'undefined' && window.location) {
            // On production hosting, use same origin (no port 8000!)
            base = window.location.origin;
        } else {
            base = `http://${hostFallback}:8000`;
        }
    }

    // Ensure no double slashes between base and path
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = encodedPath.startsWith('/') ? encodedPath : `/${encodedPath}`;

    return `${cleanBase}${cleanPath}`;
};
