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

    // Fallback if baseURL is not provided directly
    const base = baseURL || (import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`);

    // Ensure no double slashes between base and path
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = encodedPath.startsWith('/') ? encodedPath : `/${encodedPath}`;

    return `${cleanBase}${cleanPath}`;
};
