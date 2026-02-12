import Dexie, { Table } from 'dexie';
import {
  UserProfile,
  WorkoutPlan,
  MealPlan,
  DailyCheckIn,
  WeightEntry,
  BodyMeasurement,
} from '../../types/index';

export class FitnessDatabase extends Dexie {
  // Declare tables
  userProfile!: Table<UserProfile>;
  workoutPlans!: Table<WorkoutPlan>;
  mealPlans!: Table<MealPlan>;
  dailyCheckIns!: Table<DailyCheckIn>;
  weightHistory!: Table<WeightEntry>;
  bodyMeasurements!: Table<BodyMeasurement>;

  constructor() {
    super('FitnessCoachDB');

    this.version(1).stores({
      userProfile: 'id, updatedAt',
      workoutPlans: 'id, date, completed',
      mealPlans: 'id, date, logged',
      dailyCheckIns: 'id, date, submittedAt',
      weightHistory: 'id, date',
      bodyMeasurements: 'id, date',
    });
  }
}

export const db = new FitnessDatabase();
