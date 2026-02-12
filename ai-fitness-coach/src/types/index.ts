// User Profile
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  trainingDays: number; // per week
  trainingSplit: 'ppl' | 'upper_lower' | 'full_body';
  goal: 'muscle_gain' | 'strength' | 'maintenance';
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  equipment: string[]; // available equipment
  injuries: string[];
  foodPreferences: {
    vegetarian?: boolean;
    vegan?: boolean;
    allergies: string[];
    dislikedFoods: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Exercise
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Workout Set
export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
  actualWeight?: number; // weight actually used
  actualReps?: number;   // reps actually completed
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

// Workout Exercise (for a specific workout)
export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
  order: number; // exercise order in workout
}

// Daily Workout Plan
export interface WorkoutPlan {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // e.g., "Push Day", "Pull Day"
  exercises: WorkoutExercise[];
  estimatedDuration: number; // minutes
  completed: boolean;
  completedAt?: Date;
  aiInsight: string;
  generatedAt: Date;
}

// Meal
export interface Meal {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients?: string[];
  instructions?: string;
}

// Daily Meal Plan
export interface MealPlan {
  id: string;
  date: string; // YYYY-MM-DD
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  logged: boolean;
  generatedAt: Date;
}

// Daily Check-in (evening log)
export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  workoutCompleted: 'completed' | 'partial' | 'skipped';
  nutritionStatus: 'on_track' | 'under' | 'over';
  actualCalories?: number;
  weight?: number;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  sorenessLevel: 'low' | 'medium' | 'high';
  energyLevel: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  submittedAt: Date;
}

// Weight History Entry
export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  createdAt: Date;
}

// Body Measurements
export interface BodyMeasurement {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
  createdAt: Date;
}
