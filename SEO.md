# SEO Implementation Guide

This document outlines the SEO optimization implemented in this React Vite template.

## Overview

The template includes comprehensive SEO support using React 19's built-in document metadata features, which automatically hoist `<meta>`, `<title>`, and `<link>` tags to the document `<head>`.

## Files Structure

```
├── public/
│   ├── og-image.png          # Social sharing image (1200x630)
│   ├── robots.txt            # Search engine crawler instructions
│   └── sitemap.xml           # XML sitemap for all public pages
├── src/
│   ├── components/
│   │   └── SEO.tsx           # Reusable SEO component
│   └── lib/
│       └── seoConfig.ts      # Centralized SEO configuration
└── index.html                # Base HTML with fallback meta tags
```

## Quick Start

### 1. Update Configuration

Edit `src/lib/seoConfig.ts` with your site details:

```typescript
export const SEO_CONFIG = {
  siteName: 'Your SaaS Name',
  siteUrl: 'https://yourdomain.com',
  twitterHandle: '@yourhandle',
  author: 'Your Company Name',
  organizationName: 'Your Company Name',
  // ...
};
```

### 2. Update Static Files

Update the domain in these files:
- `index.html` - Update all `https://yourdomain.com` references
- `public/robots.txt` - Update sitemap URL
- `public/sitemap.xml` - Update all page URLs

### 3. Replace OG Image

Replace `public/og-image.png` with your branded social sharing image:
- Recommended size: **1200 x 630 pixels**
- Format: PNG or JPG
- Keep file size under 1MB for fast loading

---

## Components

### SEO Component

The main SEO component (`src/components/SEO.tsx`) supports:

```tsx
import SEO from '@/components/SEO';

<SEO 
  title="Page Title"
  description="Page description for search engines"
  path="/current-path"
  keywords={['keyword1', 'keyword2']}
  image="/custom-og-image.png"
  type="website" // or 'article', 'product'
  noIndex={false}
  jsonLd={{ '@type': 'WebPage', ... }}
/>
```

### Pre-configured Page SEO

For common pages, use the pre-built configurations:

```tsx
import { PageSEO } from '@/components/SEO';

// In your component:
<PageSEO.Home />
<PageSEO.Pricing />
<PageSEO.Credits />
<PageSEO.Settings />  // Includes noIndex
<PageSEO.FAQ />
<PageSEO.About />
<PageSEO.Contact />
```

### Content Pages

Content pages using `ContentPageLayout` automatically get SEO:

```tsx
<ContentPageLayout
  title="Privacy Policy"
  subtitle="Your privacy matters"
  description="Learn how we protect your data..."
  keywords="privacy, data protection, GDPR"
>
  {/* Content */}
</ContentPageLayout>
```

---

## Meta Tags Generated

### Primary Meta Tags
- `<title>` - Page title
- `<meta name="description">` - Page description
- `<meta name="keywords">` - Page keywords
- `<link rel="canonical">` - Canonical URL

### Open Graph (Facebook, LinkedIn)
- `og:type` - Content type
- `og:url` - Page URL
- `og:title` - Title for sharing
- `og:description` - Description for sharing
- `og:image` - Social sharing image
- `og:site_name` - Site name

### Twitter Cards
- `twitter:card` - Card type (summary_large_image)
- `twitter:url` - Page URL
- `twitter:title` - Title
- `twitter:description` - Description
- `twitter:image` - Image URL
- `twitter:site` - Twitter handle

### JSON-LD Structured Data

The component supports custom JSON-LD for rich search results:

```tsx
<SEO
  jsonLd={{
    '@type': 'Product',
    name: 'Premium Plan',
    offers: {
      '@type': 'Offer',
      price: '9.99',
      priceCurrency: 'USD'
    }
  }}
/>
```

---

## Sitemap

The sitemap (`public/sitemap.xml`) includes:

| Page | Priority | Update Frequency |
|------|----------|------------------|
| `/` (Home) | 1.0 | Weekly |
| `/pricing` | 0.9 | Weekly |
| `/credits` | 0.8 | Monthly |
| `/about-us` | 0.7 | Monthly |
| `/faq` | 0.7 | Monthly |
| `/contact` | 0.7 | Monthly |
| Legal pages | 0.3-0.4 | Yearly |

### Adding New Pages

When adding new public pages, update `public/sitemap.xml`:

```xml
<url>
  <loc>https://yourdomain.com/new-page</loc>
  <lastmod>2025-12-14</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## Robots.txt

The `public/robots.txt` file:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### Blocking Pages

To prevent indexing of specific paths:

```
Disallow: /admin/
Disallow: /api/
Disallow: /private/
```

---

## Best Practices

### Page Titles
- Keep under 60 characters
- Include primary keyword
- Make each title unique
- Format: `Page Title | Site Name`

### Meta Descriptions
- Keep between 150-160 characters
- Include a call-to-action
- Make each description unique
- Include relevant keywords naturally

### Keywords
- Focus on 3-5 primary keywords per page
- Use long-tail keywords for specific pages
- Don't keyword stuff

### Images
- Use descriptive alt text
- Compress images for fast loading
- Use WebP format where possible

---

## Testing SEO

### Tools
- [Google Search Console](https://search.google.com/search-console) - Monitor search presence
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Test structured data
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - Test OG tags
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Test Twitter cards

### Manual Testing

1. View page source and verify meta tags
2. Use browser dev tools > Elements > `<head>`
3. Share URLs on social platforms to preview cards

---

## Limitations

Since this is a client-side rendered (CSR) React app:

1. **Initial HTML** - Search engines may not execute JavaScript fully
2. **Dynamic Content** - Meta tags are set after React hydration
3. **Social Crawlers** - Some may not wait for JavaScript

### Mitigations

- Fallback meta tags in `index.html`
- React 19's streaming SSR support (when using React Server Components)
- Consider migrating to Next.js for critical SEO needs

---

## Migration to Next.js (Optional)

For maximum SEO performance, consider Next.js migration:

```bash
npx create-next-app@latest --typescript
```

Benefits:
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Automatic sitemap generation
- Built-in image optimization
- Middleware for SEO redirects

---

## Checklist

Before going live:

- [ ] Update `seoConfig.ts` with real values
- [ ] Replace `og-image.png` with branded image
- [ ] Update all URLs in `sitemap.xml`
- [ ] Update sitemap URL in `robots.txt`
- [ ] Update canonical URLs in `index.html`
- [ ] Submit sitemap to Google Search Console
- [ ] Test social sharing previews
- [ ] Verify structured data with Google's tool
- [ ] Set up Google Analytics / Search Console
