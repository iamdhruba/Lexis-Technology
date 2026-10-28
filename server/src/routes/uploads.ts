import { Router } from 'express';
import fs from 'fs';
import { upload } from '../middleware/upload';
import { requireAdminAuth } from '../middleware/auth';
import { uploadToCloud, isCloudinaryEnabled } from '../utils/cloudinary';
import { config } from '../config';

const router = Router();

router.post(
  '/',
  ...requireAdminAuth,
  (req, res, next) => {
    if (config.isProduction && !isCloudinaryEnabled) {
      return res.status(503).json({
        error: 'Image storage is not configured. Add the Cloudinary environment variables.',
      });
    }
    next();
  },
  upload.single('image'),
  async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    let url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    if (isCloudinaryEnabled) {
      try {
        const cloudUrl = await uploadToCloud(req.file.path);
        url = cloudUrl;
        fs.unlinkSync(req.file.path);
      } catch (cloudErr: any) {
        console.error('Cloudinary upload failed', cloudErr.message);
        if (config.isProduction) {
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          return res.status(502).json({ error: 'Image storage upload failed' });
        }
        console.warn('Using local image storage in development');
      }
    }

    res.json({ url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
  }
);

export default router;
