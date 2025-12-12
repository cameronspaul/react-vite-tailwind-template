import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const ReportBlockFunctionality: React.FC = () => {
    return (
        <ContentPageLayout
            title="Report & Block Functionality"
            subtitle="Keeping the platform safe"
            description="Learn how to report spam, harassment, or toxic behavior. Understand the reporting process, blocking users, and how we review violations."
            keywords="report, block user, report harassment, spam reporting, user safety, moderation, report abuse, safety tools"
        >
            <p className="text-lg text-muted-foreground mb-8">
                We want this to be a safe space. If you encounter spam, harassment, or toxic behavior, please use our reporting tools.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. How to Report a User</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">From a Profile</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                            <li>Navigate to the user's profile.</li>
                            <li>Tap the <strong>Report Icon</strong> (usually in the top corner).</li>
                            <li>Select <strong>Report</strong>.</li>
                            <li>Choose the reason (e.g., Spam, Harassment).</li>
                            <li>Add any details that will help our moderators.</li>
                            <li>Tap <strong>Submit</strong>.</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">From a Chat</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                            <li>Open the conversation.</li>
                            <li>Tap the options menu.</li>
                            <li>Select <strong>Report</strong>.</li>
                        </ol>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. How to Block a User</h2>
                <p className="mb-4 text-muted-foreground">Blocking prevents a user from seeing your profile or messaging you.</p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                    <li>Tap the menu icon on their profile.</li>
                    <li>Select <strong>Block</strong>.</li>
                    <li>Confirm your choice.</li>
                </ol>
            </section>
        </ContentPageLayout>
    );
};

export default ReportBlockFunctionality;
