import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const SafetyAndSecurity: React.FC = () => {
    return (
        <ContentPageLayout
            title="Safety & Security"
            subtitle="Protecting you and your data"
            description="Learn about our security measures including authentication, encryption, and reporting tools."
            keywords="security, platform safety, authentication, encryption, data protection, safe platform"
        >
            <p className="text-lg text-muted-foreground mb-8">
                Your data should be secure. Here is how we protect you.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Authentication Security</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Secure Login</h3>
                        <p className="text-muted-foreground">We use secure authentication providers. We do not store your passwords.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Data Protection</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Encryption</h3>
                        <p className="text-muted-foreground">All data is encrypted in transit using TLS/SSL.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Payment Security</h3>
                        <p className="text-muted-foreground">We do not store your credit card details. All billing is handled by a dedicated payment provider.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Community Safety</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Reporting Tools</h3>
                        <p className="text-muted-foreground">You can report any user directly from their profile. Our moderation team reviews these reports.</p>
                    </div>
                </div>
            </section>

            <section className="border-t border-white/10 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Responsible Disclosure</h2>
                <p className="mb-4 text-muted-foreground">
                    If you find a bug, please let us know.
                </p>
                <p>
                    <strong>Contact:</strong> <a href="mailto:security@example.com" className="text-primary hover:underline">security@example.com</a>
                </p>
            </section>
        </ContentPageLayout>
    );
};

export default SafetyAndSecurity;
