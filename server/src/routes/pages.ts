import { Router } from 'express';
import { Page } from '../models';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const category =
      typeof _req.query.category === 'string' ? _req.query.category.trim() : '';
    const pages = await Page.find(category ? { category } : {})
      .sort({ order: 1, title: 1 })
      .lean();
    res.json(pages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug }).lean();
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', ...requireAdminAuth, async (req, res) => {
  try {
    const page = new Page(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', ...requireAdminAuth, async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', ...requireAdminAuth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const isStudyAbroadPage =
      page.category === 'study-abroad' || /^Study in\s+/i.test(page.title);
    if (isStudyAbroadPage) {
      const countryName =
        page.countryName || page.title.replace(/^Study in\s+/i, '');
      const aliases = new Set(
        [...(page.countryAliases || []), countryName].map((alias) =>
          alias.trim().toLowerCase()
        )
      );
      const universitiesPage = await Page.findOne({ slug: 'universities' });
      let changed = false;

      if (universitiesPage) {
        for (const section of universitiesPage.sections) {
          if (
            section.type !== 'universityList' &&
            section.type !== 'universities'
          ) {
            continue;
          }
          const items = Array.isArray(section.data?.items)
            ? section.data.items
            : [];
          const remainingItems = items.filter(
            (item: { country?: string }) =>
              !aliases.has(String(item.country || '').trim().toLowerCase())
          );
          if (remainingItems.length !== items.length) {
            section.data.items = remainingItems;
            changed = true;
          }
        }

        if (changed) {
          universitiesPage.markModified('sections');
          await universitiesPage.save();
        }
      }
    }

    await page.deleteOne();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
