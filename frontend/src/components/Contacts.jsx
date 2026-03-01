import React from 'react';
import { ContactSection } from './new-home/ContactSection';
import SEOHead from './SEOHead';
import shopConfig from '../shop.config';

export default function Contacts() {
    return (
        <div className="new-home-scope" style={{ background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--font-outfit)" }}>
            <SEOHead
                title={`Контакти | ${shopConfig.name}`}
                description="Зв'яжіться з нами для замовлення дров, брикетів та вугілля. Телефон, email, адреса та графік роботи."
                canonicalUrl={`${shopConfig.domain}/contacts`}
            />
            <div style={{ paddingTop: 40 }}>
                <ContactSection />
            </div>
        </div>
    );
}
