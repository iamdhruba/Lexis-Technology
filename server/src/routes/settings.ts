import { Router } from 'express';
import Settings from '../models/Settings';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const doc = new Settings();
      await doc.save();
      settings = await Settings.findById(doc._id).lean();
    }
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', ...requireAdminAuth, async (req, res) => {
  try {
    const existing = await Settings.findOne();
    if (!existing) {
      const created = new Settings(req.body);
      await created.save();
      return res.json(created);
    }
    Object.assign(existing, req.body);
    await existing.save();
    res.json(existing);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
