/**
 * Email Templates
 * 
 * This file contains all email HTML templates used throughout the application.
 * Each template is a function that accepts dynamic data and returns the HTML string.
 */

// Site URL for links in emails
const getSiteUrl = () => process.env.SITE_URL || "https://yourapp.com";

/**
 * Base email wrapper with consistent styling
 */
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e4e4e7;">
            ${content}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

/**
 * Standard header component
 */
const standardHeader = (title: string) => `
<tr>
  <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #e4e4e7;">
    <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #18181b;">
      ${title}
    </h1>
  </td>
</tr>
`;

/**
 * Gradient header component (for premium/celebration emails)
 */
const gradientHeader = (emoji: string, title: string) => `
<tr>
  <td style="padding: 32px 32px 24px 32px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px 8px 0 0;">
    <div style="font-size: 48px; margin-bottom: 12px;">${emoji}</div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">
      ${title}
    </h1>
  </td>
</tr>
`;

/**
 * Standard footer component
 */
const standardFooter = (text: string = "Questions? Just reply to this email.") => `
<tr>
  <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
    <p style="margin: 0; font-size: 12px; color: #71717a;">
      ${text}
    </p>
  </td>
</tr>
`;

/**
 * Standard button component
 */
const standardButton = (text: string, href: string) => `
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center">
      <a href="${href}" style="display: inline-block; padding: 10px 24px; background-color: #18181b; color: #fafafa; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 6px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;

/**
 * Gradient button component (for premium emails)
 */
const gradientButton = (text: string, href: string) => `
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center">
      <a href="${href}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 6px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;

/**
 * Paragraph component
 */
const paragraph = (text: string) => `
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #3f3f46;">
  ${text}
</p>
`;

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Welcome email for new users
 */
export const welcomeEmail = (args: { name?: string }) => {
    const userName = args.name || "there";
    const siteUrl = getSiteUrl();

    const content = `
    ${standardHeader(`Welcome, ${userName}`)}
    <tr>
      <td style="padding: 32px;">
        ${paragraph("Thanks for signing up! Your account is ready to go.")}
        ${paragraph("Get started by exploring the app and checking out our features.")}
        ${standardButton("Open App", siteUrl)}
      </td>
    </tr>
    ${standardFooter()}
  `;

    return {
        subject: "Welcome aboard 👋",
        html: emailWrapper(content),
    };
};

/**
 * Premium welcome email when user upgrades to premium
 */
export const premiumWelcomeEmail = (args: {
    name?: string;
    productName?: string;
    isLifetime?: boolean;
}) => {
    const userName = args.name || "there";
    const planName = args.productName || "Premium";
    const siteUrl = getSiteUrl();
    const isLifetimePlan = args.isLifetime || false;

    const subscriptionText = isLifetimePlan
        ? "You now have lifetime access to all premium features!"
        : "Your subscription is now active and you have access to all premium features.";

    const content = `
    ${gradientHeader("🎉", `Welcome to ${planName}, ${userName}!`)}
    <tr>
      <td style="padding: 32px;">
        ${paragraph(`Thank you for upgrading! ${subscriptionText}`)}
        
        <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #18181b;">
            What's included:
          </h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #52525b;">
            <li>Access to all premium features</li>
            <li>Priority customer support</li>
            <li>Early access to new features</li>
            <li>Exclusive member benefits</li>
          </ul>
        </div>
        
        ${gradientButton("Start Exploring", siteUrl)}
      </td>
    </tr>
    ${standardFooter("Need help? Reply to this email and we'll be happy to assist.")}
  `;

    return {
        subject: `Welcome to ${planName}! 🎉`,
        html: emailWrapper(content),
    };
};

/**
 * Subscription cancellation email
 */
export const cancellationEmail = () => {
    const content = `
    ${standardHeader("Subscription Cancelled")}
    <tr>
      <td style="padding: 32px;">
        ${paragraph("We're sorry to see you go. Your subscription has been cancelled and will remain active until the end of your billing period.")}
        ${paragraph("If you change your mind, you can always resubscribe from your account settings.")}
      </td>
    </tr>
    ${standardFooter("Have feedback? Reply to this email and let us know how we can improve.")}
  `;

    return {
        subject: "Your subscription has been cancelled",
        html: emailWrapper(content),
    };
};

/**
 * Password reset email
 */
export const passwordResetEmail = (args: { resetLink: string }) => {
    const content = `
    ${standardHeader("Reset Your Password")}
    <tr>
      <td style="padding: 32px;">
        ${paragraph("We received a request to reset your password. Click the button below to choose a new password.")}
        ${standardButton("Reset Password", args.resetLink)}
        ${paragraph("If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.")}
      </td>
    </tr>
    ${standardFooter("Need help? Reply to this email.")}
  `;

    return {
        subject: "Reset your password",
        html: emailWrapper(content),
    };
};

/**
 * Email verification email
 */
export const verificationEmail = (args: { verificationLink: string }) => {
    const content = `
    ${standardHeader("Verify Your Email")}
    <tr>
      <td style="padding: 32px;">
        ${paragraph("Please verify your email address by clicking the button below.")}
        ${standardButton("Verify Email", args.verificationLink)}
        ${paragraph("If you didn't create an account, you can safely ignore this email.")}
      </td>
    </tr>
    ${standardFooter()}
  `;

    return {
        subject: "Verify your email address",
        html: emailWrapper(content),
    };
};

/**
 * Payment confirmation email
 */
export const paymentConfirmationEmail = (args: {
    name?: string;
    amount: string;
    productName: string;
    receiptUrl?: string;
}) => {
    const userName = args.name || "there";
    const siteUrl = getSiteUrl();

    const content = `
    ${gradientHeader("✅", "Payment Confirmed")}
    <tr>
      <td style="padding: 32px;">
        ${paragraph(`Hi ${userName}, your payment has been successfully processed!`)}
        
        <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table width="100%" style="font-size: 14px; color: #3f3f46;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">Product</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; text-align: right; font-weight: 600; color: #18181b;">${args.productName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Amount</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #18181b;">${args.amount}</td>
            </tr>
          </table>
        </div>
        
        ${args.receiptUrl ? standardButton("View Receipt", args.receiptUrl) : standardButton("Open App", siteUrl)}
      </td>
    </tr>
    ${standardFooter("Questions about your payment? Reply to this email.")}
  `;

    return {
        subject: `Payment confirmed for ${args.productName}`,
        html: emailWrapper(content),
    };
};
