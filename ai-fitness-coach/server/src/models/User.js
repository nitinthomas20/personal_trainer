import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  // fitness profile (filled during onboarding)
  profile: {
    name:            { type: String, default: '' },
    age:             { type: Number },
    weight:          { type: Number },
    height:          { type: Number },
    gender:          { type: String, enum: ['male', 'female', 'other'] },
    experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    trainingDays:    { type: Number },
    trainingSplit:   { type: String, enum: ['ppl', 'upper_lower', 'full_body'] },
    goal:            { type: String, enum: ['muscle_gain', 'strength', 'maintenance'] },
    targetCalories:  { type: Number },
    macros: {
      protein: Number,
      carbs:   Number,
      fats:    Number,
    },
    equipment:  [String],
    injuries:   [String],
    foodPreferences: {
      vegetarian:   { type: Boolean, default: false },
      vegan:        { type: Boolean, default: false },
      allergies:    [String],
      dislikedFoods:[String],
    },
  },
  onboarded: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
