import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const FAQ: React.FC = () => {
    return (
        <ContentPageLayout
            title="Frequently Asked Questions"
            subtitle="Common questions"
            description="Find answers to common questions about the platform. Learn how to sign up, use features, and manage subscriptions."
            keywords="FAQ, help, support, questions, guide"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Account & Profile</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">How do I sign up?</h3>
                        <p className="text-muted-foreground">You can sign up using your social accounts. This helps us verify that you are a real person.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Can I change my profile details?</h3>
                        <p className="text-muted-foreground">Yes! Go to your profile to edit your information, interests, and showcase your skills.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Matching & Discovery</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">How does discovery work?</h3>
                        <p className="text-muted-foreground">Our feed shows you active members in the community based on your preferences.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">What are "Connects"?</h3>
                        <p className="text-muted-foreground">A "Connect" is a request to chat. Free users may have limits on daily requests, while Premium users typically enjoy more or unlimited access.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Subscriptions & Billing</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">How do I upgrade to Premium?</h3>
                        <p className="text-muted-foreground">Go to the Subscription or Premium tab in the app to view available plans.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Who handles the billing?</h3>
                        <p className="text-muted-foreground">We use a secure third-party payment provider. All payments are managed securely.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Can I get a refund?</h3>
                        <p className="text-muted-foreground">Generally, purchases are non-refundable. However, if you have a technical issue, please contact support.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Safety</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">How do I report a bad actor?</h3>
                        <p className="text-muted-foreground">If someone is spamming or harassing, use the report button on their profile.</p>
                    </div>
                </div>
            </section>
        </ContentPageLayout>
    );
};

export default FAQ;
