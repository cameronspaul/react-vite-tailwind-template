/**
 * Email Templates
 * 
 * All email templates for the application. These are styled to match
 * the dark theme aesthetic of the project with clean, modern design.
 */

/**
 * Brand configuration - update these for your project
 * 
 * These colors are aligned with the shadcn dark theme from index.css:
 * - background: oklch(0.145 0 0) → #1a1a1a
 * - card: oklch(0.205 0 0) → #262626  
 * - foreground: oklch(0.985 0 0) → #fafafa
 * - muted-foreground: oklch(0.708 0 0) → #a3a3a3
 * - border: oklch(1 0 0 / 10%) → rgba(255,255,255,0.1)
 * - primary: oklch(0.922 0 0) → #e5e5e5
 */
const BRAND = {
  name: "Your App Name",
  website: "https://yourapp.com",
  supportEmail: "support@yourapp.com",
  logo: "https://yourapp.com/logo.png", // Replace with your logo URL
  // Colors aligned with shadcn dark theme
  primaryColor: "#e5e5e5", // Dark theme primary (light gray for dark backgrounds)
  accentColor: "#d4d4d4", // Secondary accent  
  backgroundColor: "#1a1a1a", // Dark theme background
  cardBackground: "#262626", // Dark theme card
  textColor: "#fafafa", // Dark theme foreground
  mutedColor: "#a3a3a3", // Dark theme muted-foreground
  borderColor: "rgba(255, 255, 255, 0.1)", // Dark theme border
};

// Base email styles
const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: ${BRAND.backgroundColor};
    color: ${BRAND.textColor};
    line-height: 1.6;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .card {
    background-color: ${BRAND.cardBackground};
    border-radius: 12px;
    border: 1px solid ${BRAND.borderColor};
    padding: 40px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  }
  .header {
    text-align: center;
    margin-bottom: 32px;
  }
  .logo {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
  .brand-name {
    font-size: 24px;
    font-weight: 700;
    color: ${BRAND.textColor};
    margin: 0;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${BRAND.textColor};
    margin: 0 0 16px;
    text-align: center;
  }
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: ${BRAND.textColor};
    margin: 24px 0 12px;
  }
  p {
    color: ${BRAND.mutedColor};
    margin: 0 0 16px;
    font-size: 16px;
  }
  .highlight {
    color: ${BRAND.primaryColor};
    font-weight: 600;
  }
  .button {
    display: inline-block;
    background-color: ${BRAND.primaryColor};
    color: ${BRAND.backgroundColor} !important;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    margin: 24px 0;
    text-align: center;
  }
  .button-container {
    text-align: center;
  }
  .divider {
    border: none;
    border-top: 1px solid ${BRAND.borderColor};
    margin: 32px 0;
  }
  .footer {
    text-align: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid ${BRAND.borderColor};
  }
  .footer p {
    font-size: 14px;
    color: ${BRAND.mutedColor};
    margin: 8px 0;
  }
  .footer a {
    color: ${BRAND.primaryColor};
    text-decoration: none;
  }
  .feature-item {
    display: flex;
    align-items: center;
    margin: 12px 0;
    color: ${BRAND.mutedColor};
  }
  .feature-icon {
    color: ${BRAND.primaryColor};
    margin-right: 12px;
    font-size: 18px;
  }
  .emoji {
    font-size: 48px;
    text-align: center;
    margin-bottom: 16px;
  }
  .order-details {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid ${BRAND.borderColor};
    border-radius: 8px;
    padding: 20px;
    margin: 24px 0;
  }
  .order-table {
    width: 100%;
    border-collapse: collapse;
  }
  .order-table td {
    border-bottom: 1px solid ${BRAND.borderColor};
    padding: 12px 0;
    font-size: 14px;
    color: ${BRAND.textColor};
  }
  .order-table tr:last-child td {
    border-bottom: none;
  }
  .order-table td:first-child {
    color: ${BRAND.mutedColor};
    text-align: left;
    width: 40%;
  }
  .order-table td:last-child {
    text-align: right;
    font-weight: 500;
  }
  .feature-list {
    margin: 16px 0;
    padding: 0;
    list-style: none;
  }
`;

// Helper to wrap content in base layout
function wrapInLayout(content: string, previewText: string = ""): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${BRAND.name}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    ${baseStyles}
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#0a0a0a;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ""}
  <div class="container">
    <div class="card">
      <div class="header">
        <p class="brand-name">${BRAND.name}</p>
      </div>
      ${content}
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
        <p>
          <a href="${BRAND.website}">Website</a> • 
          <a href="mailto:${BRAND.supportEmail}">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ============================================
// WELCOME EMAIL
// ============================================
export interface WelcomeEmailParams {
  userName: string;
  email: string;
}

export function getWelcomeEmailSubject(): string {
  return `Welcome to ${BRAND.name}!`;
}

export function getWelcomeEmailHtml(params: WelcomeEmailParams): string {
  const { userName } = params;

  const content = `

    <h1>Welcome to ${BRAND.name}!</h1>
    <p style="text-align: center; font-size: 18px;">
      Hey <span class="highlight">${userName || "there"}</span>, we're thrilled to have you on board!
    </p>
    
    <hr class="divider">
    
    <h2>Here's what you can do next:</h2>
    <ul class="feature-list">
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Explore our premium features and tools</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Set up your profile and preferences</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Check out our getting started guide</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Connect with our community</span>
      </li>
    </ul>
    
    <div class="button-container">
      <a href="${BRAND.website}" class="button">Get Started →</a>
    </div>
    
    <p style="text-align: center;">
      If you have any questions, feel free to reach out to us at
      <a href="mailto:${BRAND.supportEmail}" style="color: ${BRAND.primaryColor};">${BRAND.supportEmail}</a>
    </p>
  `;

  return wrapInLayout(content, `Welcome to ${BRAND.name}! We're excited to have you.`);
}

// ============================================
// PURCHASE CONFIRMATION EMAILS
// ============================================
export interface PurchaseEmailParams {
  userName: string;
  email: string;
  productName: string;
  productDescription?: string;
  amount: string;
  currency: string;
  orderId?: string;
  purchaseDate?: string;
}

// --- Premium Monthly ---
export function getPremiumMonthlyEmailSubject(): string {
  return `Welcome to Premium!`;
}

export function getPremiumMonthlyEmailHtml(params: PurchaseEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate } = params;

  const content = `
    <h1>Welcome to Premium!</h1>
    <p style="text-align: center; font-size: 18px;">
      Hi <span class="highlight">${userName || "there"}</span>, your monthly subscription is now active!
    </p>
    
    <div class="order-details">
      <table class="order-table">
        <tr>
          <td>Plan</td>
          <td>${productName || "Premium Monthly"}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>${currency} ${amount}/month</td>
        </tr>
        ${orderId ? `
        <tr>
          <td>Order ID</td>
          <td>${orderId}</td>
        </tr>
        ` : ""}
        ${purchaseDate ? `
        <tr>
          <td>Date</td>
          <td>${purchaseDate}</td>
        </tr>
        ` : ""}
      </table>
    </div>
    
    <h2>Your Premium Benefits:</h2>
    <ul class="feature-list">
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Unlimited access to all features</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Priority customer support</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Exclusive member perks</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Early access to new features</span>
      </li>
    </ul>
    
    <div class="button-container">
      <a href="${BRAND.website}" class="button">Start Exploring →</a>
    </div>
  `;

  return wrapInLayout(content, "Your Premium subscription is now active!");
}

// --- Premium Quarterly ---
export function getPremiumQuarterlyEmailSubject(): string {
  return `Welcome to Premium Quarterly!`;
}

export function getPremiumQuarterlyEmailHtml(params: PurchaseEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate } = params;

  const content = `
    <h1>Welcome to Premium!</h1>
    <p style="text-align: center; font-size: 18px;">
      Hi <span class="highlight">${userName || "there"}</span>, your quarterly subscription is now active!
    </p>
    
    <div class="order-details">
      <table class="order-table">
        <tr>
          <td>Plan</td>
          <td>${productName || "Premium Quarterly"}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>${currency} ${amount}/quarter</td>
        </tr>
        ${orderId ? `
        <tr>
          <td>Order ID</td>
          <td>${orderId}</td>
        </tr>
        ` : ""}
        ${purchaseDate ? `
        <tr>
          <td>Date</td>
          <td>${purchaseDate}</td>
        </tr>
        ` : ""}
      </table>
    </div>
    
    <h2>Your Premium Benefits:</h2>
    <ul class="feature-list">
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Unlimited access to all features</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Priority customer support</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Exclusive member perks</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Save more with quarterly billing!</span>
      </li>
    </ul>
    
    <div class="button-container">
      <a href="${BRAND.website}" class="button">Start Exploring →</a>
    </div>
  `;

  return wrapInLayout(content, "Your Premium Quarterly subscription is now active!");
}

// --- Premium Semiannual ---
export function getPremiumSemiannualEmailSubject(): string {
  return `Welcome to Premium Semiannual!`;
}

export function getPremiumSemiannualEmailHtml(params: PurchaseEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate } = params;

  const content = `
    <h1>Welcome to Premium!</h1>
    <p style="text-align: center; font-size: 18px;">
      Hi <span class="highlight">${userName || "there"}</span>, your 6-month subscription is now active!
    </p>
    
    <div class="order-details">
      <table class="order-table">
        <tr>
          <td>Plan</td>
          <td>${productName || "Premium Semiannual"}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>${currency} ${amount}/6 months</td>
        </tr>
        ${orderId ? `
        <tr>
          <td>Order ID</td>
          <td>${orderId}</td>
        </tr>
        ` : ""}
        ${purchaseDate ? `
        <tr>
          <td>Date</td>
          <td>${purchaseDate}</td>
        </tr>
        ` : ""}
      </table>
    </div>
    
    <h2>Your Premium Benefits:</h2>
    <ul class="feature-list">
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Unlimited access to all features</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Priority customer support</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Exclusive member perks</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Maximum savings with semiannual billing!</span>
      </li>
    </ul>
    
    <div class="button-container">
      <a href="${BRAND.website}" class="button">Start Exploring →</a>
    </div>
  `;

  return wrapInLayout(content, "Your Premium Semiannual subscription is now active!");
}

// --- Premium Lifetime ---
export function getPremiumLifetimeEmailSubject(): string {
  return `Welcome to Premium Lifetime!`;
}

export function getPremiumLifetimeEmailHtml(params: PurchaseEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate } = params;

  const content = `
    <h1>Welcome to Premium Forever!</h1>
    <p style="text-align: center; font-size: 18px;">
      Hi <span class="highlight">${userName || "there"}</span>, you now have lifetime access!
    </p>
    
    <div class="order-details">
      <table class="order-table">
        <tr>
          <td>Plan</td>
          <td>${productName || "Premium Lifetime"}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>${currency} ${amount} (one-time)</td>
        </tr>
        ${orderId ? `
        <tr>
          <td>Order ID</td>
          <td>${orderId}</td>
        </tr>
        ` : ""}
        ${purchaseDate ? `
        <tr>
          <td>Date</td>
          <td>${purchaseDate}</td>
        </tr>
        ` : ""}
      </table>
    </div>
    
    <h2>Your Lifetime Benefits:</h2>
    <ul class="feature-list">
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span><strong>Forever access</strong> - no recurring payments!</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Unlimited access to all features</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Priority customer support</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>All future updates included</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Exclusive lifetime member perks</span>
      </li>
    </ul>
    
    <div class="button-container">
      <a href="${BRAND.website}" class="button">Start Exploring →</a>
    </div>
    
    <p style="text-align: center; font-size: 14px;">
      Thank you for believing in us! We're honored to have you as a lifetime member.
    </p>
  `;

  return wrapInLayout(content, "Congratulations! You now have lifetime access!");
}

// ============================================
// CREDIT BUNDLE PURCHASE EMAIL
// ============================================
export interface CreditBundleEmailParams extends PurchaseEmailParams {
  credits?: number;
  bundleName?: string;
}

export function getCreditBundleEmailSubject(credits: number = 0): string {
  return `Your ${credits} Credits Have Been Added!`;
}

export function getCreditBundleEmailHtml(params: CreditBundleEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate, credits, bundleName } = params;

  const content = `
    <h1>Credits Added to Your Account!</h1>
    <p style="text-align: center; font-size: 18px;">
      Hi <span class="highlight">${userName || "there"}</span>, your credits have been added!
    </p>
    
    <div class="order-details">
      <table class="order-table">
        <tr>
          <td>Bundle</td>
          <td>${bundleName || productName || "Credit Bundle"}</td>
        </tr>
        <tr>
          <td>Credits Added</td>
          <td><strong>${credits || "N/A"} Credits</strong></td>
        </tr>
        <tr>
          <td>Amount Paid</td>
          <td>${currency} ${amount}</td>
        </tr>
        ${orderId ? `
        <tr>
          <td>Order ID</td>
          <td>${orderId}</td>
        </tr>
        ` : ""}
        ${purchaseDate ? `
        <tr>
          <td style="border-bottom: none;">Date</td>
          <td style="border-bottom: none;">${purchaseDate}</td>
        </tr>
        ` : (orderId ? `` : ``)}
      </table>
    </div>
    
    <h2>How to Use Your Credits:</h2>
    <ul class="feature-list">
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Credits are available immediately in your account</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Use credits for premium features and actions</span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Your credits <strong>never expire</strong></span>
      </li>
      <li class="feature-item">
        <span class="feature-icon">✓</span>
        <span>Check your balance anytime in your dashboard</span>
      </li>
    </ul>
    
    <div class="button-container">
      <a href="${BRAND.website}" class="button">Go to Dashboard →</a>
    </div>
  `;

  return wrapInLayout(content, `${credits || "Your"} credits have been added to your account!`);
}

// ============================================
// GENERIC PURCHASE EMAIL (Fallback)
// ============================================
export function getGenericPurchaseEmailSubject(productName: string): string {
  return `Thank you for your purchase!`;
}

export function getGenericPurchaseEmailHtml(params: PurchaseEmailParams): string {
  const { userName, productName, amount, currency, orderId, purchaseDate } = params;

  const content = `
    <h1>Thank You for Your Purchase!</h1>
    <p style="text-align: center; font-size: 18px;">
      Hi <span class="highlight">${userName || "there"}</span>, your purchase has been confirmed!
    </p>
    
    <div class="order-details">
      <table class="order-table">
        <tr>
          <td>Product</td>
          <td>${productName || "Product"}</td>
        </tr>
        <tr>
          <td>Amount Paid</td>
          <td>${currency} ${amount}</td>
        </tr>
        ${orderId ? `
        <tr>
          <td>Order ID</td>
          <td>${orderId}</td>
        </tr>
        ` : ""}
        ${purchaseDate ? `
        <tr>
          <td>Date</td>
          <td>${purchaseDate}</td>
        </tr>
        ` : ""}
      </table>
    </div>
    
    <p style="text-align: center;">
      Your purchase is now available in your account. If you have any questions, 
      please don't hesitate to contact us.
    </p>
    
    <div class="button-container">
      <a href="${BRAND.website}" class="button">Go to Dashboard →</a>
    </div>
  `;

  return wrapInLayout(content, "Your purchase has been confirmed!");
}

// ============================================
// EXPORT ALL EMAIL TYPES
// ============================================
export type EmailType =
  | "welcome"
  | "premium_monthly"
  | "premium_quarterly"
  | "premium_semiannual"
  | "premium_lifetime"
  | "credit_bundle"
  | "generic_purchase";

export function getEmailContent(
  type: EmailType,
  params: WelcomeEmailParams | PurchaseEmailParams
): { subject: string; html: string } {
  switch (type) {
    case "welcome":
      return {
        subject: getWelcomeEmailSubject(),
        html: getWelcomeEmailHtml(params as WelcomeEmailParams),
      };
    case "premium_monthly":
      return {
        subject: getPremiumMonthlyEmailSubject(),
        html: getPremiumMonthlyEmailHtml(params as PurchaseEmailParams),
      };
    case "premium_quarterly":
      return {
        subject: getPremiumQuarterlyEmailSubject(),
        html: getPremiumQuarterlyEmailHtml(params as PurchaseEmailParams),
      };
    case "premium_semiannual":
      return {
        subject: getPremiumSemiannualEmailSubject(),
        html: getPremiumSemiannualEmailHtml(params as PurchaseEmailParams),
      };
    case "premium_lifetime":
      return {
        subject: getPremiumLifetimeEmailSubject(),
        html: getPremiumLifetimeEmailHtml(params as PurchaseEmailParams),
      };
    case "credit_bundle":
      const creditParams = params as CreditBundleEmailParams;
      return {
        subject: getCreditBundleEmailSubject(creditParams.credits),
        html: getCreditBundleEmailHtml(creditParams),
      };
    case "generic_purchase":
    default:
      return {
        subject: getGenericPurchaseEmailSubject((params as PurchaseEmailParams).productName),
        html: getGenericPurchaseEmailHtml(params as PurchaseEmailParams),
      };
  }
}
