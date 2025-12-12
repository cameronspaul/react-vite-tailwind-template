import React from 'react';
import { Link } from 'react-router-dom';
import ContentPageLayout from './ContentPageLayout';

const TermsOfService: React.FC = () => {
    return (
        <ContentPageLayout
            title="Terms of Service"
            subtitle="Last Updated: [Date]"
            description="Read our Terms of Service covering eligibility, account security, community rules, content ownership, subscriptions, billing, and user responsibilities."
            keywords="terms of service, user agreement, legal terms, community rules, account terms, subscription terms, platform rules"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                    Welcome to <strong>The Platform</strong> ("we," "us," "our"). This is a platform designed for connection and collaboration. By accessing our website or using our services, you agree to be bound by these Terms of Service ("Terms").
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Eligibility</h2>
                <p className="text-muted-foreground">
                    You must be at least 18 years old to use our services. By creating an account, you represent that you are capable of forming a binding contract and are not barred from using the Service under applicable laws.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Account & Security</h2>
                <p className="mb-4 text-muted-foreground">
                    You can sign up using your preferred authentication provider. You are responsible for maintaining the security of your account credentials.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Profile Content:</strong> You are responsible for the accuracy of your profile information.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Community Rules</h2>
                <p className="mb-4 text-muted-foreground">We expect all users to adhere to these standards:</p>

                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Dos:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Be Authentic:</strong> Share real information about yourself.</li>
                            <li><strong>Be Constructive:</strong> Engage positively with others.</li>
                            <li><strong>Respect Boundaries:</strong> Respect the decisions and privacy of others.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Don'ts:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>No Harassment:</strong> We have a zero-tolerance policy for harassment or bullying.</li>
                            <li><strong>No Spam:</strong> Automated messages or mass solicitation is prohibited.</li>
                            <li><strong>No Hate Speech:</strong> We do not tolerate any form of hate speech.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Content & Intellectual Property</h2>
                <h3 className="text-xl font-semibold text-foreground mb-2">Your Content</h3>
                <p className="mb-4 text-muted-foreground">
                    You retain ownership of the content you post. By posting, you grant us a license to display, distribute, and promote your content within the Service.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Subscriptions & Billing</h2>
                <h3 className="text-xl font-semibold text-foreground mb-2">Payments</h3>
                <p className="mb-4 text-muted-foreground">We may offer paid features or subscriptions.</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Billing:</strong> Payments are processed securely via our payment provider.</li>
                    <li><strong>Cancellation:</strong> You can manage your subscription settings in your account portal.</li>
                    <li><strong>Refunds:</strong> Please refer to our <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link> for details.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Termination</h2>
                <p className="text-muted-foreground">
                    We reserve the right to suspend or terminate your account if you violate these Terms.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Disclaimers</h2>
                <p className="text-muted-foreground">
                    The service is provided "AS IS." We do not guarantee specific results from using our platform.
                </p>
            </section>

            <section className="border-t border-white/10 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact</h2>
                <p>
                    For legal inquiries, please contact us at: <a href="mailto:legal@example.com" className="text-primary hover:underline">legal@example.com</a>
                </p>
            </section>
        </ContentPageLayout>
    );
};

export default TermsOfService;
