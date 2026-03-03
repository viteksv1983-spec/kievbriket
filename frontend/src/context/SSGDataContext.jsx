import React, { createContext, useContext } from 'react';

/**
 * SSGDataContext — provides pre-fetched data during SSG build.
 * During client-side rendering, this will be empty (null).
 * During SSG, generate-seo-pages.js passes products/categories data here
 * so that components can render with real data instead of showing spinners.
 */
const SSGDataContext = createContext(null);

export function SSGDataProvider({ data, children }) {
    return (
        <SSGDataContext.Provider value={data}>
            {children}
        </SSGDataContext.Provider>
    );
}

/**
 * Hook to access SSG pre-fetched data.
 * Returns null during client-side rendering.
 * Returns { products, categories } during SSG.
 */
export function useSSGData() {
    return useContext(SSGDataContext);
}

export default SSGDataContext;
