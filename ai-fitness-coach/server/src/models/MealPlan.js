import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name:         String,
  mealType:     { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
  calories:     Number,
  protein:      Number,
  carbs:        Number,
  fats:         Number,
  ingredients:  [String],
  instructions: String,
});

const mealPlanSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date:          { type: String, required: true },
  meals:         [mealSchema],
  totalCalories: Number,
  totalProtein:  Number,
  totalCarbs:    Number,
  totalFats:     Number,
  logged:        { type: Boolean, default: false },
  generatedAt:   { type: Date, default: Date.now },
});

mealPlanSchema.index({ userId: 1, date: 1 });

export default mongoose.model('MealPlan', mealPlanSchema);
