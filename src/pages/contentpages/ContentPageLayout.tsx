import React from 'react';
import { Separator } from '@/components/ui/separator';

interface ContentPageLayoutProps {
    title: string;
    subtitle?: string;
    description?: string;
    keywords?: string; // Kept for compatibility but not strictly used in UI
    children: React.ReactNode;
}

const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({ title, subtitle, description, children }) => {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {title}
                </h1>
                {subtitle && <p className="text-xl text-muted-foreground font-medium">{subtitle}</p>}
                {description && <p className="mt-4 text-muted-foreground/80 max-w-2xl mx-auto">{description}</p>}
            </div>
            <Separator className="my-8 opacity-50" />
            <div className="space-y-6 text-foreground/90 leading-relaxed">
                {children}
            </div>
        </div>
    );
};

export default ContentPageLayout;
