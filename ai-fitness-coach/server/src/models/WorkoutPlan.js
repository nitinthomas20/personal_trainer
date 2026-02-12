import mongoose from 'mongoose';

const workoutSetSchema = new mongoose.Schema({
  setNumber:    Number,
  reps:         Number,
  weight:       Number,
  actualWeight: Number,
  actualReps:   Number,
  rpe:          Number,
  completed:    { type: Boolean, default: false },
}, { _id: false });

const exerciseSchema = new mongoose.Schema({
  exerciseId:   String,
  exerciseName: String,
  sets:         [workoutSetSchema],
  notes:        String,
  order:        Number,
});

const workoutPlanSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date:              { type: String, required: true },
  dayName:           String,
  exercises:         [exerciseSchema],
  estimatedDuration: Number,
  completed:         { type: Boolean, default: false },
  completedAt:       Date,
  aiInsight:         String,
  generatedAt:       { type: Date, default: Date.now },
});

workoutPlanSchema.index({ userId: 1, date: 1 });

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
