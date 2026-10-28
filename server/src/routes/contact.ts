import { Router } from 'express';
import { ContactSubmission } from '../models';
import { sendContactEmail } from '../utils/resend';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const submission = new ContactSubmission({ name, email, phone, subject, message });
    await submission.save();

    let emailSent = false;
    try {
      await sendContactEmail({ name, email, phone, subject, message });
      emailSent = true;
    } catch (emailErr) {
      const message = emailErr instanceof Error ? emailErr.message : String(emailErr);
      console.error('Resend email failed:', message);
    }

    res.status(201).json({ success: true, emailSent, submission });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
