import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email - MUST be from a verified domain in Resend for emails to not go to spam
// Set via: npx convex env set RESEND_FROM_EMAIL "Your App <noreply@yourdomain.com>"
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

/**
 * Send a welcome email to a new user
 */
export const sendWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { email, name }) => {
    const userName = name || "there";
    const siteUrl = process.env.SITE_URL || "https://yourapp.com";

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: email,
        subject: "Welcome aboard 👋",
        html: `
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
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #e4e4e7;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #18181b;">
                  Welcome, ${userName}
                </h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding: 32px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #3f3f46;">
                  Thanks for signing up! Your account is ready to go.
                </p>
                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #3f3f46;">
                  Get started by exploring the app and checking out our features.
                </p>
                <!-- Button -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="${siteUrl}" style="display: inline-block; padding: 10px 24px; background-color: #18181b; color: #fafafa; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 6px;">
                        Open App
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #71717a;">
                  Questions? Just reply to this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
        `,
      });

      if (error) {
        console.error("Failed to send welcome email:", error);
        return { success: false, error: error.message };
      }

      console.log("Welcome email sent successfully:", data?.id);
      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error: String(error) };
    }
  },
});

/**
 * Generic email sending action for various use cases
 */
export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    from: v.optional(v.string()),
  },
  handler: async (ctx, { to, subject, html, from }) => {
    try {
      const { data, error } = await resend.emails.send({
        from: from || DEFAULT_FROM,
        to,
        subject,
        html,
      });

      if (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message };
      }

      console.log("Email sent successfully:", data?.id);
      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: String(error) };
    }
  },
});
