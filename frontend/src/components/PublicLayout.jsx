import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { SiteHeader } from './new-home/SiteHeader';
import { SiteFooter } from './new-home/SiteFooter';
import { OrderFormModal } from './new-home/OrderFormModal';
import GoogleAnalytics from './GoogleAnalytics';

export default function PublicLayout() {
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    return (
        <div
            className="new-home-scope"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--c-text)',
                fontFamily: 'var(--font-outfit)',
            }}
        >
            <SiteHeader onQuickOrderClick={() => setIsOrderFormOpen(true)} />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <SiteFooter />
            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
            />
            <GoogleAnalytics />
        </div>
    );
}
