import { Router } from 'express';
import AdminUser from '../models/AdminUser';
import {
  AuthRequest,
  requireAdmin,
  requireAuth,
} from '../middleware/auth';

const router = Router();
const roles = ['user', 'admin', 'superadmin'] as const;

router.use(requireAuth, requireAdmin);

router.get('/', async (_req, res) => {
  try {
    const users = await AdminUser.find()
      .select('name email role lastLoginAt createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json(
      users.map((user) => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    );
  } catch {
    res.status(500).json({ error: 'User records could not be loaded.' });
  }
});

router.patch('/:id/role', async (req: AuthRequest, res) => {
  try {
    const nextRole = String(req.body.role || '') as (typeof roles)[number];
    if (!roles.includes(nextRole)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    if (req.params.id === req.user?.id) {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    const target = await AdminUser.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (
      req.user?.role !== 'superadmin' &&
      (target.role === 'superadmin' || nextRole === 'superadmin')
    ) {
      return res.status(403).json({
        error: 'Only a super administrator can manage that role.',
      });
    }

    if (target.role === 'superadmin' && nextRole !== 'superadmin') {
      const superadminCount = await AdminUser.countDocuments({
        role: 'superadmin',
      });
      if (superadminCount <= 1) {
        return res.status(400).json({
          error: 'The final super administrator cannot be demoted.',
        });
      }
    }

    target.role = nextRole;
    await target.save();
    res.json({
      id: String(target._id),
      name: target.name,
      email: target.email,
      role: target.role,
      lastLoginAt: target.lastLoginAt,
      createdAt: target.createdAt,
      updatedAt: target.updatedAt,
    });
  } catch {
    res.status(500).json({ error: 'The user role could not be changed.' });
  }
});

export default router;
