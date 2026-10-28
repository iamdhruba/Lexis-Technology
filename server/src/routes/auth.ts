import { createHash, randomBytes } from 'crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models';
import { config } from '../config';
import { AuthRequest, requireAuth } from '../middleware/auth';
import { sendPasswordResetEmail } from '../utils/resend';

const router = Router();
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function authRateLimit(req: AuthRequest, res: any, next: any) {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const current = attempts.get(key);
  const entry =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + WINDOW_MS }
      : current;

  entry.count += 1;
  attempts.set(key, entry);

  if (entry.count > MAX_ATTEMPTS) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
    return res.status(429).json({
      error: 'Too many attempts. Please wait before trying again.',
    });
  }
  next();
}

function normalizedEmail(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordError(password: unknown) {
  const value = String(password || '');
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
    return 'Password must include uppercase, lowercase, and a number.';
  }
  return '';
}

function publicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function createSession(user: {
  _id: unknown;
  email: string;
  role: string;
}) {
  return jwt.sign(
    { id: String(user._id), email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '12h' }
  );
}

router.post('/signup', authRateLimit, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizedEmail(req.body.email);
    const password = String(req.body.password || '');
    const validationError = passwordError(password);

    if (name.length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!validEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    if (await AdminUser.exists({ email })) {
      return res.status(409).json({ error: 'An account already exists for this email.' });
    }

    const user = await AdminUser.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'user',
      lastLoginAt: new Date(),
    });
    const token = createSession(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'An account already exists for this email.' });
    }
    res.status(500).json({ error: 'Account creation failed.' });
  }
});

router.post('/login', authRateLimit, async (req, res) => {
  try {
    const email = normalizedEmail(req.body.email);
    const password = String(req.body.password || '');
    if (!validEmail(email) || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await AdminUser.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    user.lastLoginAt = new Date();
    await user.save();
    const token = createSession(user);
    res.json({ token, user: publicUser(user) });
  } catch {
    res.status(500).json({ error: 'Login failed.' });
  }
});

router.get('/me', requireAuth, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

router.post('/forgot-password', authRateLimit, async (req, res) => {
  try {
    if (!config.resendApiKey) {
      return res.status(503).json({
        error: 'Password reset email is not configured.',
      });
    }

    const email = normalizedEmail(req.body.email);
    if (!validEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const user = await AdminUser.findOne({ email }).select(
      '+resetPasswordTokenHash +resetPasswordExpires'
    );
    if (user) {
      const token = randomBytes(32).toString('hex');
      user.resetPasswordTokenHash = createHash('sha256').update(token).digest('hex');
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const resetUrl = `${
        config.frontendUrl || 'http://localhost:5173'
      }/reset-password?token=${encodeURIComponent(token)}`;

      try {
        await sendPasswordResetEmail({
          email: user.email,
          name: user.name,
          resetUrl,
        });
      } catch (error) {
        user.resetPasswordTokenHash = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        throw error;
      }
    }

    res.json({
      message: 'If that email is registered, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset email failed', error);
    res.status(503).json({
      error: 'Password reset email is temporarily unavailable.',
    });
  }
});

router.post('/reset-password', authRateLimit, async (req, res) => {
  try {
    const token = String(req.body.token || '');
    const password = String(req.body.password || '');
    const validationError = passwordError(password);

    if (!token) {
      return res.status(400).json({ error: 'Reset token is required.' });
    }
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const user = await AdminUser.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordTokenHash +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        error: 'This reset link is invalid or has expired.',
      });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch {
    res.status(500).json({ error: 'Password reset failed.' });
  }
});

export default router;
