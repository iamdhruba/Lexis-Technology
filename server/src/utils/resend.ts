import { Resend } from 'resend';
import { config } from '../config';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

const DEFAULT_FALLBACK_FROM = 'Lexis Technology <onboarding@resend.dev>';

async function sendEmailWithFallback(payload: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  from?: string;
}) {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const configuredFrom = payload.from || config.resendFromEmail || DEFAULT_FALLBACK_FROM;

  const result = await resend.emails.send({
    from: configuredFrom,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  if (result.error) {
    const errorMsg = result.error.message || '';
    // If custom domain is not verified, automatically retry with verified onboarding address
    if (
      configuredFrom !== DEFAULT_FALLBACK_FROM &&
      (errorMsg.toLowerCase().includes('not verified') ||
        errorMsg.toLowerCase().includes('domain') ||
        result.error.name === 'validation_error')
    ) {
      console.warn(
        `[Resend] Domain for '${configuredFrom}' is unverified (${errorMsg}). Retrying with '${DEFAULT_FALLBACK_FROM}'...`
      );
      const fallbackResult = await resend.emails.send({
        from: DEFAULT_FALLBACK_FROM,
        to: payload.to,
        replyTo: payload.replyTo,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });

      if (fallbackResult.error) {
        throw new Error(`Resend rejected the email: ${fallbackResult.error.message}`);
      }
      return fallbackResult.data;
    }

    throw new Error(`Resend rejected the email: ${errorMsg}`);
  }

  if (!result.data) {
    throw new Error('Resend did not return an email ID');
  }

  return result.data;
}

export async function sendContactEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const text = `New contact form submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e3a8a; margin-top: 0;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p><strong>Message:</strong></p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: monospace;">${message}</div>
    </div>
  `;

  return sendEmailWithFallback({
    to: config.resendToEmail,
    replyTo: email,
    subject: subject ? `Contact: ${subject}` : 'New contact form submission',
    text,
    html,
  });
}

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  const text = [
    `Hello ${name},`,
    '',
    'Use the link below to reset your Lexis Technology password. It expires in one hour.',
    resetUrl,
    '',
    'If you did not request this change, you can ignore this email.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 24px; letter-spacing: -0.5px;">Lexis Technology</h1>
      </div>
      <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Reset Your Password</h2>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hello ${name},</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">We received a request to reset the password for your Lexis Technology account. Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
      <div style="margin: 32px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px; display: inline-block;">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="font-size: 13px; color: #2563eb; word-break: break-all;"><a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a></p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
    </div>
  `;

  return sendEmailWithFallback({
    to: email,
    subject: 'Reset your Lexis Technology password',
    text,
    html,
  });
}
