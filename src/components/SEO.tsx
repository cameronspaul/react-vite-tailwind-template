/**
 * SEO Component
 * 
 * Uses React 19's built-in document metadata support to manage
 * page-specific SEO meta tags. React automatically hoists these
 * to the <head> element.
 * 
 * @example
 * <SEO 
 *   title="Pricing"
 *   description="Choose the perfect plan for your needs"
 *   path="/pricing"
 * />
 */

import { SEO_CONFIG as SITE_CONFIG, PAGE_SEO } from '@/lib/seoConfig';

interface SEOProps {
    /** Page title - will be appended with site name */
    title?: string;
    /** Meta description for the page */
    description?: string;
    /** Canonical path (e.g., "/pricing") */
    path?: string;
    /** Custom OG image URL */
    image?: string;
    /** Article published date for blog posts */
    publishedTime?: string;
    /** Article modified date */
    modifiedTime?: string;
    /** Article author */
    author?: string;
    /** Page type for Open Graph (default: "website") */
    type?: 'website' | 'article' | 'product';
    /** Prevent indexing this page */
    noIndex?: boolean;
    /** Keywords for the page */
    keywords?: string[];
    /** JSON-LD structured data object */
    jsonLd?: Record<string, unknown>;
}

export function SEO({
    title,
    description = SITE_CONFIG.defaultDescription,
    path = '/',
    image = SITE_CONFIG.defaultImage,
    publishedTime,
    modifiedTime,
    author,
    type = 'website',
    noIndex = false,
    keywords = [],
    jsonLd,
}: SEOProps) {
    const fullTitle = title
        ? `${title} | ${SITE_CONFIG.siteName}`
        : SITE_CONFIG.defaultTitle;

    const canonicalUrl = `${SITE_CONFIG.siteUrl}${path}`;
    const imageUrl = image.startsWith('http') ? image : `${SITE_CONFIG.siteUrl}${image}`;

    return (
        <>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords.length > 0 && (
                <meta name="keywords" content={keywords.join(', ')} />
            )}
            <link rel="canonical" href={canonicalUrl} />

            {/* Robots */}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph / Facebook */}
            {SITE_CONFIG.enableOpenGraph && (
                <>
                    <meta property="og:type" content={type} />
                    <meta property="og:url" content={canonicalUrl} />
                    <meta property="og:title" content={fullTitle} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={imageUrl} />
                    <meta property="og:site_name" content={SITE_CONFIG.siteName} />
                </>
            )}

            {/* Twitter */}
            {SITE_CONFIG.enableTwitterCards && (
                <>
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content={canonicalUrl} />
                    <meta name="twitter:title" content={fullTitle} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content={imageUrl} />
                    <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
                </>
            )}

            {/* Article specific meta tags */}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}

            {/* JSON-LD Structured Data */}
            {SITE_CONFIG.enableJsonLd && jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        ...jsonLd,
                    })}
                </script>
            )}
        </>
    );
}

/**
 * Pre-configured SEO for common page types
 */
export const PageSEO = {
    /** Home page SEO */
    Home: () => (
        <SEO
            title={PAGE_SEO.home.title}
            description={PAGE_SEO.home.description}
            path="/"
            keywords={PAGE_SEO.home.keywords}
            jsonLd={{
                '@type': 'WebSite',
                name: SITE_CONFIG.siteName,
                url: SITE_CONFIG.siteUrl,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${SITE_CONFIG.siteUrl}/search?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            }}
        />
    ),

    /** Pricing page SEO */
    Pricing: () => (
        <SEO
            title={PAGE_SEO.pricing.title}
            description={PAGE_SEO.pricing.description}
            path="/pricing"
            keywords={PAGE_SEO.pricing.keywords}
            jsonLd={{
                '@type': 'Product',
                name: `${SITE_CONFIG.siteName} Premium`,
                description: 'Premium access to all features',
                offers: {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'USD',
                    lowPrice: '9.99',
                    highPrice: '99.99',
                    offerCount: '3',
                },
            }}
        />
    ),

    /** Credits page SEO */
    Credits: () => (
        <SEO
            title={PAGE_SEO.credits.title}
            description={PAGE_SEO.credits.description}
            path="/credits"
            keywords={PAGE_SEO.credits.keywords}
        />
    ),

    /** Settings page SEO - noIndex since it's user-specific */
    Settings: () => (
        <SEO
            title="Settings"
            description="Manage your account settings and preferences."
            path="/settings"
            noIndex={true}
        />
    ),

    /** FAQ page SEO with FAQPage structured data */
    FAQ: (faqs?: Array<{ question: string; answer: string }>) => (
        <SEO
            title={PAGE_SEO.faq.title}
            description={PAGE_SEO.faq.description}
            path="/faq"
            keywords={PAGE_SEO.faq.keywords}
            jsonLd={faqs ? {
                '@type': 'FAQPage',
                mainEntity: faqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer,
                    },
                })),
            } : undefined}
        />
    ),

    /** About page SEO */
    About: () => (
        <SEO
            title={PAGE_SEO.about.title}
            description={PAGE_SEO.about.description}
            path="/about-us"
            keywords={PAGE_SEO.about.keywords}
            jsonLd={{
                '@type': 'Organization',
                name: SITE_CONFIG.organizationName,
                url: SITE_CONFIG.siteUrl,
                logo: `${SITE_CONFIG.siteUrl}/logo.png`,
            }}
        />
    ),

    /** Contact page SEO */
    Contact: () => (
        <SEO
            title={PAGE_SEO.contact.title}
            description={PAGE_SEO.contact.description}
            path="/contact"
            keywords={PAGE_SEO.contact.keywords}
            jsonLd={{
                '@type': 'ContactPage',
                name: 'Contact Us',
                url: `${SITE_CONFIG.siteUrl}/contact`,
            }}
        />
    ),
};

export default SEO;
