import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products/categories');
            // Transform backend category metadata to match frontend expectations
            const mappedCategories = response.data.map(cat => ({
                id: cat.slug,
                slug: cat.slug,
                name: cat.name,
                title: cat.name, // Usually the same as name for firewood
                description: cat.description || '',
                seo_text: cat.seo_text || '',
                seo_h1: cat.seo_h1 || '',
                meta_title: cat.meta_title || '',
                meta_description: cat.meta_description || '',
                image_url: cat.image_url,
                imagePlaceholder: `🪵 ${cat.name}`
            }));
            setCategories(mappedCategories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            // Fallback to local if backend is unreachable during dev
            setCategories([
                { id: 'drova', slug: 'drova', name: 'Дрова', title: 'Дрова', description: '', imagePlaceholder: '🪵 Дрова' },
                { id: 'brikety', slug: 'brikety', name: 'Паливні брикети', title: 'Паливні брикети', description: '', imagePlaceholder: '🪵 Брикети' },
                { id: 'vugillya', slug: 'vugillya', name: 'Вугілля', title: 'Вугілля', description: '', imagePlaceholder: '🪵 Вугілля' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CategoryContext.Provider value={{ categories, loading, refreshCategories: fetchCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => useContext(CategoryContext);
