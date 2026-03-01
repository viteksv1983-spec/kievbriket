export const ALL_CATEGORIES = [];

export const CATEGORIES = ALL_CATEGORIES;
export const HOLIDAY_SUB_CATEGORIES = [];

export const formatCategoryName = (slug) => {
    if (!slug) return 'Усі дрова';
    const category = ALL_CATEGORIES.find(c => c.slug === slug);
    return category ? category.name : slug;
};
