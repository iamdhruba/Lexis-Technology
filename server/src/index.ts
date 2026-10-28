import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { config } from './config';
import { connectDB } from './db';

import authRoutes from './routes/auth';
import pagesRoutes from './routes/pages';
import uploadsRoutes from './routes/uploads';
import contactRoutes from './routes/contact';
import settingsRoutes from './routes/settings';
import usersRoutes from './routes/users';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        config.corsOrigins.length === 0 ||
        config.corsOrigins.includes(origin.replace(/\/$/, ''))
      ) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(config.uploadsDir));

app.get('/', (_req, res) => {
  if (config.frontendUrl) {
    res.redirect(302, config.frontendUrl);
    return;
  }
  res.json({
    service: 'Lexis Technology API',
    health: '/api/health',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', environment: config.nodeEnv });
});

// Serve the compiled React application when client/dist is present. Keeping the
// site and API on one origin makes /api and local /uploads work in production.
const clientIndex = path.join(config.clientDistDir, 'index.html');
if (fs.existsSync(clientIndex)) {
  app.use(express.static(config.clientDistDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      next();
      return;
    }
    res.sendFile(clientIndex);
  });
}

async function main() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port} (${config.nodeEnv})`);
  });
}

main().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
