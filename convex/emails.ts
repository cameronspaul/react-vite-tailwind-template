import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Resend } from "resend";
import {
  welcomeEmail,
  premiumWelcomeEmail,
  cancellationEmail,
} from "./emailTemplates";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email - MUST be from a verified domain in Resend for emails to not go to spam
// Set via: npx convex env set RESEND_FROM_EMAIL "Your App <noreply@yourdomain.com>"
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

// ============================================================================
// SCHEDULER MUTATIONS (called from webhooks)
// ============================================================================

/**
 * Mutation to schedule a premium welcome email (called from Polar webhook)
 */
export const schedulePremiumWelcomeEmail = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    productName: v.optional(v.string()),
    isLifetime: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, internal.emails.sendPremiumWelcomeEmail, args);
    console.log("Premium welcome email scheduled for:", args.email);
  },
});

/**
 * Mutation to schedule a cancellation email (called from Polar webhook)
 */
export const scheduleCancellationEmail = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    await ctx.scheduler.runAfter(0, internal.emails.sendCancellationEmail, {
      email,
    });
    console.log("Cancellation email scheduled for:", email);
  },
});

// ============================================================================
// EMAIL SENDING ACTIONS
// ============================================================================

/**
 * Send a welcome email to a new user
 */
export const sendWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { email, name }) => {
    const template = welcomeEmail({ name });

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: email,
        subject: template.subject,
        html: template.html,
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
 * Send a premium welcome email when user upgrades to premium
 */
export const sendPremiumWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    productName: v.optional(v.string()),
    isLifetime: v.optional(v.boolean()),
  },
  handler: async (ctx, { email, name, productName, isLifetime }) => {
    const template = premiumWelcomeEmail({ name, productName, isLifetime });

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Failed to send premium welcome email:", error);
        return { success: false, error: error.message };
      }

      console.log("Premium welcome email sent successfully:", data?.id);
      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Error sending premium welcome email:", error);
      return { success: false, error: String(error) };
    }
  },
});

/**
 * Send a cancellation email when user cancels subscription
 */
export const sendCancellationEmail = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const template = cancellationEmail();

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Failed to send cancellation email:", error);
        return { success: false, error: error.message };
      }

      console.log("Cancellation email sent successfully:", data?.id);
      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Error sending cancellation email:", error);
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
