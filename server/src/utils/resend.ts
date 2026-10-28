import { Resend } from 'resend';
import { config } from '../config';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

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

  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const { data, error } = await resend.emails.send({
    from: config.resendFromEmail,
    to: config.resendToEmail,
    replyTo: email,
    subject: subject ? `Contact: ${subject}` : 'New contact form submission',
    text,
  });

  if (error) {
    throw new Error(`Resend rejected the email: ${error.message}`);
  }

  if (!data) {
    throw new Error('Resend did not return an email ID');
  }

  return data;
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
  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const { data, error } = await resend.emails.send({
    from: config.resendFromEmail,
    to: email,
    subject: 'Reset your Lexis Technology password',
    text: [
      `Hello ${name},`,
      '',
      'Use the link below to reset your Lexis Technology password. It expires in one hour.',
      resetUrl,
      '',
      'If you did not request this change, you can ignore this email.',
    ].join('\n'),
  });

  if (error) {
    throw new Error(`Resend rejected the password reset email: ${error.message}`);
  }

  if (!data) {
    throw new Error('Resend did not return an email ID');
  }

  return data;
}
