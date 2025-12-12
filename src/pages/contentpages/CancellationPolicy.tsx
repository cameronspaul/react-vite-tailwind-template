import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const CancellationPolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Cancellation Policy"
            subtitle="Last Updated: [Date]"
            description="Learn how to cancel your subscription. Understand the cancellation process, billing cycle effects, and how to manage your subscription."
            keywords="cancellation, cancel subscription, billing policy, cancel premium, refund policy"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. How to Cancel</h2>
                <p className="mb-4 text-muted-foreground">You can cancel your subscription at any time.</p>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Via the App</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                            <li>Go to <strong>Settings</strong>.</li>
                            <li>Tap <strong>Manage Subscription</strong>.</li>
                            <li>You will be redirected to the customer portal.</li>
                            <li>Select your active subscription and click <strong>Cancel</strong>.</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Via Email</h3>
                        <p className="text-muted-foreground">
                            If you cannot access the app, you can contact us at <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a> with your account email.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Effect of Cancellation</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Access Continues:</strong> You will retain access to Premium features until the end of your current billing cycle.</li>
                    <li><strong>No Future Charges:</strong> You will not be charged again unless you restart your subscription.</li>
                    <li><strong>Downgrade:</strong> After the period ends, your account will revert to the free plan.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Lifetime Access</h2>
                <p className="text-muted-foreground">
                    Lifetime purchases are one-time payments and do not need to be canceled.
                </p>
            </section>
        </ContentPageLayout>
    );
};

export default CancellationPolicy;
