import { Router } from 'express';
import DailyCheckIn from '../models/DailyCheckIn.js';
import auth from '../middleware/auth.js';

const router = Router();

// Save check-in
router.post('/', auth, async (req, res) => {
  try {
    const checkIn = await DailyCheckIn.create({ ...req.body, userId: req.userId });
    res.status(201).json(checkIn);
  } catch (err) {
    console.error('Save check-in error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent check-ins
router.get('/recent', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 7;
    const checkIns = await DailyCheckIn.find({ userId: req.userId }).sort({ date: -1 }).limit(limit);
    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
