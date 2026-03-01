/**
 * SEO URL Architecture — Strict Whitelist Configuration
 *
 * Group A: Occasion-based (nested under /torty-na-zamovlennya/)
 * Group B: Type-based (standalone at root /)
 *
 * IMPORTANT: Generic catch-all routes are FORBIDDEN.
 * All category slugs must be validated against these explicit arrays.
 */

// ─── Group A: Nested under /torty-na-zamovlennya/ (Not used for firewood) ───
export const GROUP_A_CATEGORIES = {};

// ─── Group B: Standalone at root level ───
export const GROUP_B_CATEGORIES = {
    'pine': { dbCategory: 'pine', label: 'Дрова сосна' },
    'alder': { dbCategory: 'alder', label: 'Дрова вільха' },
    'birch': { dbCategory: 'birch', label: 'Дрова березові' },
    'apple': { dbCategory: 'apple', label: 'Дрова яблуні' },
    'cherry': { dbCategory: 'cherry', label: 'Дрова вишня' },
    'mix-hardwood': { dbCategory: 'mix-hardwood', label: 'Дуб, граб, береза' },
    'acacia': { dbCategory: 'acacia', label: 'Дрова акація' },
    'oak': { dbCategory: 'oak', label: 'Дрова дубові' },
    'box-oak': { dbCategory: 'box-oak', label: 'Купить дрова [ящик]' }
};

export const GROUP_A_SLUGS = Object.keys(GROUP_A_CATEGORIES);
export const GROUP_B_SLUGS = Object.keys(GROUP_B_CATEGORIES);

/**
 * Check if a slug belongs to Group A
 */
export function isGroupA(slug) {
    return slug in GROUP_A_CATEGORIES;
}

/**
 * Check if a slug belongs to Group B
 */
export function isGroupB(slug) {
    return slug in GROUP_B_CATEGORIES;
}

/**
 * Get the DB category key for a given URL slug (from either group)
 */
export function getDbCategory(slug) {
    if (GROUP_A_CATEGORIES[slug]) return GROUP_A_CATEGORIES[slug].dbCategory;
    if (GROUP_B_CATEGORIES[slug]) return GROUP_B_CATEGORIES[slug].dbCategory;
    return null;
}

/**
 * Get the canonical URL for a category
 * Group A: /torty-na-zamovlennya/{slug}/
 * Group B: /{slug}/
 */
export function getCategoryCanonicalUrl(slug) {
    if (isGroupA(slug)) return `/torty-na-zamovlennya/${slug}/`;
    if (isGroupB(slug)) return `/${slug}/`;
    return null;
}

/**
 * Get the product URL given its category slug and product slug
 * Group A: /torty-na-zamovlennya/{categorySlug}/{productSlug}
 * Group B: /{categorySlug}/{productSlug}
 */
export function getProductUrl(categorySlug, productSlug) {
    if (isGroupA(categorySlug)) return `/torty-na-zamovlennya/${categorySlug}/${productSlug}/`;
    if (isGroupB(categorySlug)) return `/${categorySlug}/${productSlug}/`;
    return null; // NO FALLBACK TO GENERIC ROUTES
}

/**
 * Legacy DB category -> URL slug reverse map (for internal linking)
 */
export function dbCategoryToSlug(dbCategory) {
    for (const [slug, meta] of Object.entries(GROUP_A_CATEGORIES)) {
        if (meta.dbCategory === dbCategory) return slug;
    }
    for (const [slug, meta] of Object.entries(GROUP_B_CATEGORIES)) {
        if (meta.dbCategory === dbCategory) return slug;
    }
    return null;
}

/**
 * Get the URL path for a DB category (used in internal links)
 */
export function getCategoryUrlByDbKey(dbCategory) {
    const slug = dbCategoryToSlug(dbCategory);
    if (!slug) return null;
    return getCategoryCanonicalUrl(slug);
}
