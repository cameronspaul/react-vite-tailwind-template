/**
 * SEO Configuration
 * 
 * Update these values for your site. This configuration is used by the SEO component
 * and should be updated before deploying to production.
 */

export const SEO_CONFIG = {
    // Site Information
    siteName: 'React Vite Tailwind Template',
    siteUrl: 'https://yourdomain.com', // UPDATE THIS for production

    // Default Meta Tags
    defaultTitle: 'React Vite Tailwind Template | Production-Ready SaaS Boilerplate',
    defaultDescription: 'A production-ready template featuring Vite, React, Tailwind CSS, Shadcn UI, Convex backend, and Polar.sh payments. Stop setting up, start building your SaaS today.',
    defaultKeywords: [
        'React',
        'Vite',
        'Tailwind CSS',
        'Shadcn UI',
        'Convex',
        'Polar',
        'SaaS boilerplate',
        'template',
        'TypeScript',
        'web development',
    ],

    // Open Graph / Social
    defaultImage: '/og-image.png',
    twitterHandle: '@yourhandle', // UPDATE THIS

    // Organization/Author Info
    author: 'Your Company Name', // UPDATE THIS
    organizationName: 'Your Company Name', // UPDATE THIS

    // Theme
    themeColor: '#000000',

    // Feature Flags
    enableJsonLd: true, // Enable structured data
    enableOpenGraph: true,
    enableTwitterCards: true,
};

/**
 * Page-specific SEO configurations
 * 
 * Add custom configurations for specific pages here.
 * These will be merged with defaults in the SEO component.
 */
export const PAGE_SEO = {
    home: {
        title: 'Build Faster with the Ultimate React Stack',
        description: 'A production-ready template featuring Vite, React, Tailwind CSS, Shadcn UI, Convex backend, and Polar.sh payments.',
        keywords: ['React', 'Vite', 'Tailwind CSS', 'SaaS boilerplate', 'Shadcn UI', 'Convex', 'Polar'],
    },
    pricing: {
        title: 'Pricing',
        description: 'Choose the perfect plan for your needs. We offer flexible subscription options and lifetime access.',
        keywords: ['pricing', 'subscription', 'plans', 'premium', 'lifetime access'],
    },
    credits: {
        title: 'Credits',
        description: 'Purchase credits to unlock special features. Flexible credit bundles available for every need.',
        keywords: ['credits', 'tokens', 'purchase', 'unlock features'],
    },
    faq: {
        title: 'Frequently Asked Questions',
        description: 'Find answers to common questions about our service, pricing, features, and support.',
        keywords: ['FAQ', 'help', 'questions', 'answers', 'support'],
    },
    about: {
        title: 'About Us',
        description: 'Learn about our mission, team, and the story behind building the ultimate React SaaS template.',
        keywords: ['about', 'team', 'company', 'mission'],
    },
    contact: {
        title: 'Contact Us',
        description: 'Get in touch with our team. We are here to help with any questions or feedback.',
        keywords: ['contact', 'support', 'help', 'email'],
    },
};

export default SEO_CONFIG;
