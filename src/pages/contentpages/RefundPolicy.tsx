import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const RefundPolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Refund Policy"
            subtitle="Last Updated: [Date]"
            description="Understand our refund policy for purchases. Learn about refund eligibility, exceptions, and how to request a refund."
            keywords="refund, refund policy, money back, premium refund, chargeback policy, subscription refund"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. General Policy</h2>
                <p className="mb-4 text-muted-foreground">
                    Since our service offers immediate access to digital features, <strong>all purchases are final and non-refundable</strong>.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Exceptions</h2>
                <p className="mb-2 text-muted-foreground">We may offer a refund in limited cases:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Technical Error:</strong> You were charged due to a technical glitch.</li>
                    <li><strong>Fraud:</strong> The purchase was made without your authorization.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. How to Request a Refund</h2>
                <p className="mb-4 text-muted-foreground">All billing is handled by our payment provider.</p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                    <li>Contact <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a> with your Order ID.</li>
                    <li>Explain the reason for your request.</li>
                    <li>We will review it promptly.</li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Chargebacks</h2>
                <p className="text-muted-foreground">
                    Please contact us before filing a chargeback. We are happy to resolve legitimate issues.
                </p>
            </section>
        </ContentPageLayout>
    );
};

export default RefundPolicy;
