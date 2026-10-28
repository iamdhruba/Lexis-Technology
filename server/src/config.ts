import dotenv from 'dotenv';
import path from 'path';

export const serverRoot = path.resolve(__dirname, '..');

// Hosting platforms commonly launch from the repository root, so resolve the
// environment file from the server package instead of process.cwd().
dotenv.config({ path: path.join(serverRoot, '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const mongodbUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  (isProduction ? '' : 'mongodb://127.0.0.1:27017/edujung');
const jwtSecret =
  process.env.JWT_SECRET || (isProduction ? '' : 'dev-secret-change-me');
const adminPassword =
  process.env.ADMIN_PASSWORD || (isProduction ? '' : 'Admin1234');
const port = Number.parseInt(process.env.PORT || '5000', 10);
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
const frontendUrl = (
  process.env.FRONTEND_URL ||
  corsOrigins[0] ||
  ''
).replace(/\/$/, '');

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid number between 1 and 65535');
}

if (!mongodbUri) {
  throw new Error('MONGODB_URI is required in production');
}

if (mongodbUri.includes('<db_password>')) {
  throw new Error(
    'MONGODB_URI still contains <db_password>; replace it with the MongoDB user password'
  );
}

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required in production');
}

if (isProduction && jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production');
}

if (isProduction && corsOrigins.length === 0) {
  throw new Error(
    'CORS_ORIGIN is required in production; set it to the Vercel frontend URL'
  );
}

if (frontendUrl && !/^https?:\/\//.test(frontendUrl)) {
  throw new Error('FRONTEND_URL must start with http:// or https://');
}

export const config = {
  nodeEnv,
  isProduction,
  port,
  mongodbUri,
  mongodbDb: process.env.MONGODB_DB || 'edujung',
  jwtSecret,
  corsOrigins,
  frontendUrl,
  uploadsDir: path.join(serverRoot, 'uploads'),
  clientDistDir: path.resolve(serverRoot, '..', 'client', 'dist'),
  adminEmail: process.env.ADMIN_EMAIL || 'admin@edujung.com',
  adminPassword,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail:
    process.env.RESEND_FROM_EMAIL || 'noreply@hansoltechnology.com.np',
  resendToEmail: process.env.RESEND_TO_EMAIL || 'info@edujung.com',
};
