import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const CommunityGuidelines: React.FC = () => {
    return (
        <ContentPageLayout
            title="Community Guidelines"
            subtitle="Keeping our community safe and respectful."
            description="Read our community guidelines to understand expected behavior, code of conduct, prohibited content, reporting procedures, and consequences for violations."
            keywords="community guidelines, code of conduct, community rules, acceptable behavior, reporting violations, prohibited content, community standards, safe space"
        >
            <p className="text-lg text-muted-foreground mb-8">
                This platform is a community for professionals to connect. To keep this space healthy, we ask you to follow these guidelines.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Respect and Kindness</h2>
                <p className="text-muted-foreground">
                    Treat others with respect. Be kind, constructive, and empathetic in all your interactions.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Authentic Representation</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Be Real:</strong> Use your real name or established handle.</li>
                    <li><strong>Honest Skills:</strong> Accurately represent your skills and experience.</li>
                    <li><strong>Real Projects:</strong> Only showcase projects you have legitimately worked on.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Respect Boundaries</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>No Solicitation:</strong> Do not use the platform to spam users with unwanted offers.</li>
                    <li><strong>Unmatching:</strong> If someone disconnects, respect their decision and move on.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Prohibited Content</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Malware:</strong> Posting malicious links or software is strictly prohibited.</li>
                    <li><strong>Hate Speech:</strong> Any discrimination based on race, gender, sexual orientation, religion, or background is not allowed.</li>
                    <li><strong>NSFW:</strong> Keep content appropriate for a general audience.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Reporting</h2>
                <p className="text-muted-foreground">
                    If you see a violation, please report it. Our team reviews reports regularly.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Consequences</h2>
                <p className="mb-2 text-muted-foreground">Violating these guidelines may result in:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Content removal.</li>
                    <li>Temporary suspension.</li>
                    <li>Permanent ban from the platform.</li>
                </ul>
            </section>
        </ContentPageLayout>
    );
};

export default CommunityGuidelines;
