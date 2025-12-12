import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const AboutUs: React.FC = () => {
    return (
        <ContentPageLayout
            title="About Us"
            subtitle="Building the future of connection"
            description="Learn about our mission to help people find collaborators, partners, and friends. Discover our story, values, and commitment to authenticity."
            keywords="about us, mission, values, story, connection, community"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="mb-4 text-muted-foreground">
                    At <strong className="text-primary">Our Platform</strong>, our mission is to help you find your next great connection. We believe that relationships are the foundation of success. We're building a space where you can connect based on shared interests, goals, and values.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
                <p className="mb-4 text-muted-foreground">
                    This platform was born from a simple observation: traditional networks are often too sterile or disconnected. We wanted to create a space that combines the ease of modern discovery with the depth of real professional and personal connection.
                </p>
                <p className="mb-4 text-muted-foreground">
                    We focus on what matters: your <strong>Work</strong>, your <strong>Interests</strong>, and your <strong>Personality</strong>. Whether you're looking for a partner, a mentor, or just someone to chat with, this is the place to be.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Values</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Transparency</h3>
                        <p className="text-muted-foreground">We encourage our users to be open and honest. Your profile is a showcase of who you truly are.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Authentic Connection</h3>
                        <p className="text-muted-foreground">We prioritize genuine interactions over transactional networking. No spam, just real people.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Safety & Respect</h3>
                        <p className="text-muted-foreground">We are committed to maintaining a safe, inclusive environment where everyone feels welcome and respected.</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">The Team</h2>
                <p className="mb-4 text-muted-foreground">
                    We are a dedicated team building tools we believe in. We use modern technology to create seamless experiences, and we're constantly improving based on your feedback.
                </p>
            </section>
        </ContentPageLayout>
    );
};

export default AboutUs;
