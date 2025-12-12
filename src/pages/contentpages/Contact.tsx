import React from 'react';
import ContentPageLayout from './ContentPageLayout';

const Contact: React.FC = () => {
    return (
        <ContentPageLayout
            title="Contact Us"
            subtitle="We'd love to hear from you"
            description="Contact support for help with your account, billing questions, legal inquiries, security reports, or press inquiries."
            keywords="contact, support email, customer service, help desk, technical support, legal contact, security contact"
        >
            <p className="text-lg text-muted-foreground mb-8">
                Whether you have a bug report, a feature request, or just want to say hi.
            </p>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Support</h2>
                    <p className="text-muted-foreground mb-4">For account issues, billing questions, or technical support:</p>
                    <a href="mailto:support@example.com" className="text-primary hover:underline font-semibold">support@example.com</a>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Legal</h2>
                    <p className="text-muted-foreground mb-4">For questions about our Terms of Service or Privacy Policy:</p>
                    <a href="mailto:legal@example.com" className="text-primary hover:underline font-semibold">legal@example.com</a>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Security</h2>
                    <p className="text-muted-foreground mb-4">To report a vulnerability or security concern:</p>
                    <a href="mailto:security@example.com" className="text-primary hover:underline font-semibold">security@example.com</a>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Press</h2>
                    <p className="text-muted-foreground mb-4">For media inquiries:</p>
                    <a href="mailto:press@example.com" className="text-primary hover:underline font-semibold">press@example.com</a>
                </div>
            </div>
        </ContentPageLayout>
    );
};

export default Contact;
