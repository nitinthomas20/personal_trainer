import { Router } from 'express';
import WorkoutPlan from '../models/WorkoutPlan.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get workout plan by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.userId, date: req.params.date });
    res.json(plan || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save workout plan
router.post('/', auth, async (req, res) => {
  try {
    const plan = await WorkoutPlan.create({ ...req.body, userId: req.userId });
    res.status(201).json(plan);
  } catch (err) {
    console.error('Save workout error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark workout complete
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { completed: true, completedAt: new Date() },
      { new: true }
    );
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update actual weights used for exercises
router.patch('/:id/actual-weights', auth, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, userId: req.userId });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    // req.body.exercises: [{ exerciseIndex, sets: [{ setNumber, actualWeight, actualReps }] }]
    for (const entry of req.body.exercises) {
      const exercise = plan.exercises[entry.exerciseIndex];
      if (!exercise) continue;
      for (const setData of entry.sets) {
        const set = exercise.sets.find(s => s.setNumber === setData.setNumber);
        if (set) {
          if (setData.actualWeight !== undefined) set.actualWeight = setData.actualWeight;
          if (setData.actualReps !== undefined) set.actualReps = setData.actualReps;
          set.completed = true;
        }
      }
    }

    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error('Update actual weights error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent workout plans
router.get('/recent', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 7;
    const plans = await WorkoutPlan.find({ userId: req.userId }).sort({ date: -1 }).limit(limit);
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
