import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CategoryProvider } from './context/CategoryContext.jsx';
import App from './App.jsx';

export function render(url, helmetContext) {
    return renderToString(
        <React.StrictMode>
            <HelmetProvider context={helmetContext}>
                <CategoryProvider>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </CategoryProvider>
            </HelmetProvider>
        </React.StrictMode>
    );
}
