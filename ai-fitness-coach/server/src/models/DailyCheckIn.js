import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date:             { type: String, required: true },
  workoutCompleted: { type: String, enum: ['completed', 'partial', 'skipped'] },
  nutritionStatus:  { type: String, enum: ['on_track', 'under', 'over'] },
  actualCalories:   Number,
  weight:           Number,
  sleepQuality:     { type: Number, min: 1, max: 5 },
  sorenessLevel:    { type: String, enum: ['low', 'medium', 'high'] },
  energyLevel:      { type: Number, min: 1, max: 5 },
  notes:            String,
  submittedAt:      { type: Date, default: Date.now },
});

checkInSchema.index({ userId: 1, date: 1 });

export default mongoose.model('DailyCheckIn', checkInSchema);
