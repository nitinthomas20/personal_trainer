import { sendMessageToClaude } from '../api/claude';
import {
  getUserProfile,
  getRecentCheckIns,
  getRecentWorkoutPlans,
  saveWorkoutPlan,
  saveMealPlan,
  getTodayString,
  getTomorrowString,
} from '../database';
import {
  buildSystemPrompt,
  buildCheckInContext,
  buildWorkoutContext,
  generateWorkoutPlanPrompt,
  generateMealPlanPrompt,
  getNextDayName,
} from './prompts';
import { WorkoutPlan, MealPlan, WorkoutExercise } from '../../types/index';

/**
 * Generate a workout plan using AI for a given date (defaults to tomorrow)
 */
export const generateWorkoutPlanForDate = async (date?: string): Promise<WorkoutPlan> => {
  try {
    // Get user profile and context
    const profile = await getUserProfile();
    if (!profile) {
      throw new Error('No user profile found. Please complete onboarding first.');
    }

    const recentCheckIns = await getRecentCheckIns(7);
    const recentWorkouts = await getRecentWorkoutPlans(5);

    // Determine next day name
    const lastWorkout = recentWorkouts[0];
    const nextDayName = getNextDayName(profile.trainingSplit, lastWorkout?.dayName);

    // Build prompts
    const systemPrompt = buildSystemPrompt(profile);
    const checkInContext = buildCheckInContext(recentCheckIns);
    const workoutContext = buildWorkoutContext(recentWorkouts);
    const userPrompt = generateWorkoutPlanPrompt(nextDayName, workoutContext, checkInContext);

    console.log('Generating workout plan with Claude...');

    // Call Claude API
    const response = await sendMessageToClaude(systemPrompt, [{ role: 'user', content: userPrompt }], 3000);

    // Parse JSON response
    let workoutData;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = response.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      workoutData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse workout plan JSON:', response.content);
      throw new Error('Invalid response format from AI');
    }

    // Create workout plan object
    const targetDate = date ?? getTomorrowString();
    const workoutPlan: Omit<WorkoutPlan, 'id'> = {
      date: targetDate,
      dayName: workoutData.dayName,
      exercises: workoutData.exercises.map((ex: any, index: number): WorkoutExercise => ({
        id: crypto.randomUUID(),
        exerciseId: ex.exerciseName.toLowerCase().replace(/\s+/g, '-'),
        exerciseName: ex.exerciseName,
        sets: ex.sets,
        notes: ex.notes,
        order: index + 1,
      })),
      estimatedDuration: workoutData.estimatedDuration,
      completed: false,
      aiInsight: workoutData.aiInsight,
      generatedAt: new Date(),
    };

    // Save to database
    const planId = await saveWorkoutPlan(workoutPlan);
    console.log('Workout plan saved:', planId);

    return { ...workoutPlan, id: planId };
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw error;
  }
};

/**
 * Generate a meal plan using AI for a given date (defaults to tomorrow)
 */
export const generateMealPlanForDate = async (date?: string): Promise<MealPlan> => {
  try {
    // Get user profile and context
    const profile = await getUserProfile();
    if (!profile) {
      throw new Error('No user profile found. Please complete onboarding first.');
    }

    const recentCheckIns = await getRecentCheckIns(7);

    // Build prompts
    const systemPrompt = buildSystemPrompt(profile);
    const checkInContext = buildCheckInContext(recentCheckIns);
    const userPrompt = generateMealPlanPrompt(profile.targetCalories, profile.macros, checkInContext);

    console.log('Generating meal plan with Claude...');

    // Call Claude API
    const response = await sendMessageToClaude(systemPrompt, [{ role: 'user', content: userPrompt }], 3000);

    // Parse JSON response
    let mealData;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = response.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      mealData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse meal plan JSON:', response.content);
      throw new Error('Invalid response format from AI');
    }

    // Create meal plan object
    const targetDate = date ?? getTomorrowString();
    const mealPlan: Omit<MealPlan, 'id'> = {
      date: targetDate,
      meals: mealData.meals.map((meal: any) => ({
        id: crypto.randomUUID(),
        name: meal.name,
        mealType: meal.mealType,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
      })),
      totalCalories: mealData.totalCalories,
      totalProtein: mealData.totalProtein,
      totalCarbs: mealData.totalCarbs,
      totalFats: mealData.totalFats,
      logged: false,
      generatedAt: new Date(),
    };

    // Save to database
    const planId = await saveMealPlan(mealPlan);
    console.log('Meal plan saved:', planId);

    return { ...mealPlan, id: planId };
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

/**
 * Generate both workout and meal plans for a given date (defaults to tomorrow)
 */
export const generateBothPlans = async (date?: string): Promise<{
  workoutPlan: WorkoutPlan;
  mealPlan: MealPlan;
}> => {
  const targetDate = date ?? getTomorrowString();
  console.log(`Generating both plans for ${targetDate}...`);

  const [workoutPlan, mealPlan] = await Promise.all([
    generateWorkoutPlanForDate(targetDate),
    generateMealPlanForDate(targetDate),
  ]);

  return { workoutPlan, mealPlan };
};

/**
 * Generate both plans for today
 */
export const generateTodaysPlans = async (): Promise<{
  workoutPlan: WorkoutPlan;
  mealPlan: MealPlan;
}> => {
  return generateBothPlans(getTodayString());
};

/**
 * Generate both plans for tomorrow
 */
export const generateTomorrowsPlans = async (): Promise<{
  workoutPlan: WorkoutPlan;
  mealPlan: MealPlan;
}> => {
  return generateBothPlans(getTomorrowString());
};
