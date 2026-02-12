import { Router } from 'express';
import MealPlan from '../models/MealPlan.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get meal plan by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ userId: req.userId, date: req.params.date });
    res.json(plan || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save meal plan
router.post('/', auth, async (req, res) => {
  try {
    const plan = await MealPlan.create({ ...req.body, userId: req.userId });
    res.status(201).json(plan);
  } catch (err) {
    console.error('Save meal plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent meal plans
router.get('/recent', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 7;
    const plans = await MealPlan.find({ userId: req.userId }).sort({ date: -1 }).limit(limit);
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
