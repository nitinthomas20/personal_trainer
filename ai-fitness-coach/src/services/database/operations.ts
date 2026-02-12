/**
 * Database operations – now backed by the Express / MongoDB API.
 * The function signatures stay the same so the rest of the app is unaffected.
 */
import { profileApi, workoutApi, mealApi, checkInApi } from '../api/backend';
import { UserProfile, WorkoutPlan, MealPlan, DailyCheckIn } from '../../types/index';

// ============================================
// USER PROFILE OPERATIONS
// ============================================

export const getUserProfile = async (): Promise<UserProfile | undefined> => {
  try {
    const data = await profileApi.get();
    return data ?? undefined;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (
  profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    await profileApi.save(profile);
    return 'saved';
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
  try {
    await profileApi.save(updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ============================================
// WORKOUT PLAN OPERATIONS
// ============================================

export const getWorkoutPlanByDate = async (date: string): Promise<WorkoutPlan | undefined> => {
  try {
    const plan = await workoutApi.getByDate(date);
    if (!plan) return undefined;
    // Normalise Mongo _id → id (plan + exercises)
    return {
      ...plan,
      id: plan._id ?? plan.id,
      exercises: plan.exercises?.map((ex: any) => ({ ...ex, id: ex._id ?? ex.id })) ?? [],
    };
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    throw error;
  }
};

export const saveWorkoutPlan = async (plan: Omit<WorkoutPlan, 'id'>): Promise<string> => {
  try {
    const saved = await workoutApi.save(plan);
    return saved._id ?? saved.id;
  } catch (error) {
    console.error('Error saving workout plan:', error);
    throw error;
  }
};

export const markWorkoutComplete = async (planId: string): Promise<void> => {
  try {
    await workoutApi.markComplete(planId);
  } catch (error) {
    console.error('Error marking workout complete:', error);
    throw error;
  }
};

export const updateActualWeights = async (
  planId: string,
  exercises: { exerciseIndex: number; sets: { setNumber: number; actualWeight: number; actualReps: number }[] }[]
): Promise<void> => {
  try {
    await workoutApi.updateActualWeights(planId, exercises);
  } catch (error) {
    console.error('Error updating actual weights:', error);
    throw error;
  }
};

export const getRecentWorkoutPlans = async (limit: number = 7): Promise<WorkoutPlan[]> => {
  try {
    const plans = await workoutApi.recent(limit);
    return plans.map((p: any) => ({
      ...p,
      id: p._id ?? p.id,
      exercises: p.exercises?.map((ex: any) => ({ ...ex, id: ex._id ?? ex.id })) ?? [],
    }));
  } catch (error) {
    console.error('Error fetching recent workout plans:', error);
    throw error;
  }
};

// ============================================
// MEAL PLAN OPERATIONS
// ============================================

export const getMealPlanByDate = async (date: string): Promise<MealPlan | undefined> => {
  try {
    const plan = await mealApi.getByDate(date);
    if (!plan) return undefined;
    return { ...plan, id: plan._id ?? plan.id };
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw error;
  }
};

export const saveMealPlan = async (plan: Omit<MealPlan, 'id'>): Promise<string> => {
  try {
    const saved = await mealApi.save(plan);
    return saved._id ?? saved.id;
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
};

// ============================================
// CHECK-IN OPERATIONS
// ============================================

export const saveDailyCheckIn = async (
  checkIn: Omit<DailyCheckIn, 'id' | 'submittedAt'>
): Promise<string> => {
  try {
    const saved = await checkInApi.save(checkIn);
    return saved._id ?? saved.id;
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw error;
  }
};

export const getRecentCheckIns = async (limit: number = 7): Promise<DailyCheckIn[]> => {
  try {
    const items = await checkInApi.recent(limit);
    return items.map((c: any) => ({ ...c, id: c._id ?? c.id }));
  } catch (error) {
    console.error('Error fetching recent check-ins:', error);
    throw error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTomorrowString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};
