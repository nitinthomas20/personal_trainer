import { Router } from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user || !user.onboarded) return res.json(null);
    // Map to the shape the frontend expects
    const p = user.profile;
    res.json({
      id: user._id,
      name: p.name,
      age: p.age,
      weight: p.weight,
      height: p.height,
      gender: p.gender,
      experienceLevel: p.experienceLevel,
      trainingDays: p.trainingDays,
      trainingSplit: p.trainingSplit,
      goal: p.goal,
      targetCalories: p.targetCalories,
      macros: p.macros,
      equipment: p.equipment,
      injuries: p.injuries,
      foodPreferences: p.foodPreferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create / update profile (onboarding)
router.put('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profile = req.body;
    user.onboarded = true;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
