import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const HelpSupport: React.FC = () => {
    return (
        <ContentPageLayout
            title="Help & Support"
            subtitle="Need help?"
            description="Browse help topics including getting started, discovery, subscriptions, and safety features."
            keywords="help, support, questions, guide, troubleshooting"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Getting Started</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Creating an Account</h3>
                        <p className="text-muted-foreground">Sign up with your preferred social provider to get started and create your profile.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Profile Setup</h3>
                        <p className="text-muted-foreground">Add your details, skills, and projects to complete your profile. A complete profile helps you find better matches.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Discovery & Matching</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Browsing</h3>
                        <p className="text-muted-foreground">View other members in the feed. Interact with those who share your interests.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Connects</h3>
                        <p className="text-muted-foreground">Send requests to chat. Manage your connections in the messages tab.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Subscriptions & Billing</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Premium Plans</h3>
                        <p className="text-muted-foreground">Upgrade for enhanced features. Check the pricing page for details on available plans.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Billing Support</h3>
                        <p className="text-muted-foreground">Manage your subscription and payment methods through the customer portal.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Safety & Privacy</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Reporting Issues</h3>
                        <p className="text-muted-foreground">Help keep the community safe. Report any toxic behavior or spam using the report feature.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Blocking Users</h3>
                        <p className="text-muted-foreground">You can block any user to prevent them from contacting you.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Data Protection</h3>
                        <p className="text-muted-foreground">We value your privacy. We only use your data to provide the service.</p>
                    </div>
                </div>
            </section>
        </ContentPageLayout>
    );
};

export default HelpSupport;
