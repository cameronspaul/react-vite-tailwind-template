import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const PrivacyPolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Privacy Policy"
            subtitle="Last Updated: [Date]"
            description="Our privacy policy explains how we collect, use, and protect your data. Learn about data sharing, user rights, cookies, and privacy practices."
            keywords="privacy policy, data protection, user data, data collection, user rights, information security"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <p>
                    <strong>Our Platform</strong> respects your privacy. This policy explains how we handle your data when you use our social network.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Account Data</h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Identity:</strong> Name, email, and profile photo (from your login provider).</li>
                            <li><strong>Profile Data:</strong> Information you provide in your profile.</li>
                            <li><strong>Content:</strong> Content you create or post on the platform.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Usage Data</h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Interactions:</strong> Likes, messages, and other interactions on the platform.</li>
                        </ul>
                    </div>

                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Data</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Service Delivery:</strong> To display your profile to others and facilitate messaging.</li>
                    <li><strong>Security:</strong> To detect bot activity and ensure platform safety.</li>
                    <li><strong>Billing:</strong> To process payments via our payment provider.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Sharing</h2>
                <p className="mb-4">We do not sell your personal data. We share data only in these limited circumstances:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Service Providers:</strong> With hosting, analytics, and payment processors.</li>
                    <li><strong>Public Profile:</strong> Your profile information (excluding email/phone) is visible to other users on the platform.</li>
                    <li><strong>Legal:</strong> If required by law.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Access & Edit:</strong> You can edit your profile directly in the app.</li>
                    <li><strong>Delete:</strong> You can delete your account from the Settings menu.</li>
                    <li><strong>Export:</strong> You can request a copy of your data by contacting support.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies</h2>
                <p>
                    We use cookies for authentication and to remember your preferences (like theme settings).
                </p>
            </section>

            <section className="border-t border-white/10 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
                <p>
                    For privacy concerns, email: <a href="mailto:privacy@example.com" className="text-primary hover:underline">privacy@example.com</a>
                </p>
            </section>
        </ContentPageLayout>
    );
};

export default PrivacyPolicy;
