/**
 * Get the category URL path for any category slug.
 */
export const getCategoryUrl = (slug) => {
    if (!slug) return `/catalog/firewood`;
    return `/catalog/${slug}`;
};

/**
 * Get the product detail URL for a given product object.
 */
export const getProductUrl = (product) => {
    if (!product || !product.slug) return null;
    const catSegment = product.category || 'firewood';
    return `/catalog/${catSegment}/${product.slug}`;
};

/**
 * Get the fully qualified image URL, safely encoding URI components
 * to fix broken images with non-ASCII characters in the filename.
 */
export const getImageUrl = (imagePath, baseURL) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('blob')) return imagePath;

    // Properly encode the path parts (e.g. /media/Кирилична_Назва.webp -> /media/%...webp)
    const encodedPath = imagePath.split('/').map(part => encodeURIComponent(part)).join('/');

    // Fallback if baseURL is not provided directly
    const base = baseURL || (import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`);

    // Ensure no double slashes between base and path
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = encodedPath.startsWith('/') ? encodedPath : `/${encodedPath}`;

    return `${cleanBase}${cleanPath}`;
};
