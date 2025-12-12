import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const CookiePolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Cookie Policy"
            subtitle="Last Updated: [Date]"
            description="Learn about our cookie usage, including essential cookies for authentication, security, and preferences, plus analytics cookies."
            keywords="cookies, cookie policy, browser cookies, privacy preferences, essential cookies, analytics cookies, tracking, data privacy"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. What Are Cookies?</h2>
                <p className="text-muted-foreground">
                    Cookies are small text files stored on your device. We use them to make the app work efficiently.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Essential Cookies</h2>
                <p className="mb-2 text-muted-foreground">We use these cookies to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Keep you logged in:</strong> Remembering your session information.</li>
                    <li><strong>Security:</strong> Preventing attacks and ensuring safe browsing.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Analytics Cookies</h2>
                <p className="text-muted-foreground">
                    We may use anonymous analytics to see which features are used most. This helps us improve the user experience.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Managing Cookies</h2>
                <p className="text-muted-foreground">
                    You can control cookies through your browser settings. However, disabling essential cookies will break the login functionality.
                </p>
            </section>

            <section className="border-t border-white/10 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact</h2>
                <p className="text-muted-foreground">
                    Questions? Email <a href="mailto:privacy@example.com" className="text-primary hover:underline">privacy@example.com</a>.
                </p>
            </section>
        </ContentPageLayout>
    );
};

export default CookiePolicy;
