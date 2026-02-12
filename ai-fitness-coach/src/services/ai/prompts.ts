import { UserProfile, DailyCheckIn, WorkoutPlan } from '../../types/index';

/**
 * Generate the base system prompt with user context
 */
export const buildSystemPrompt = (profile: UserProfile): string => {
  return `You are an expert personal trainer and nutritionist AI. You generate personalized workout and meal plans.

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Weight: ${profile.weight} kg, Height: ${profile.height} cm
- Experience: ${profile.experienceLevel}
- Training Split: ${profile.trainingSplit.toUpperCase()} (${profile.trainingDays} days/week)
- Goal: ${profile.goal.replace('_', ' ')}
- Available Equipment: ${profile.equipment.join(', ')}
- Injuries/Limitations: ${profile.injuries.length > 0 ? profile.injuries.join(', ') : 'None'}

NUTRITION TARGETS:
- Daily Calories: ${profile.targetCalories}
- Macros: ${profile.macros.protein}g protein, ${profile.macros.carbs}g carbs, ${profile.macros.fats}g fats
- Food Preferences: ${profile.foodPreferences.vegetarian ? 'Vegetarian' : ''}${profile.foodPreferences.vegan ? 'Vegan' : ''}
- Allergies: ${profile.foodPreferences.allergies.join(', ') || 'None'}
- Dislikes: ${profile.foodPreferences.dislikedFoods.join(', ') || 'None'}

INSTRUCTIONS:
- Generate plans based on progressive overload principles
- Ensure adequate recovery between muscle groups
- Provide variety in exercises and meals
- Be specific with sets, reps, and weights
- Consider the user's experience level and limitations
- Return ONLY valid JSON with no markdown formatting or code blocks`;
};

/**
 * Build context from recent check-ins
 */
export const buildCheckInContext = (checkIns: DailyCheckIn[]): string => {
  if (checkIns.length === 0) {
    return 'No recent check-ins available.';
  }

  return checkIns
    .map(checkIn => {
      return `Date: ${checkIn.date}
- Workout: ${checkIn.workoutCompleted}
- Nutrition: ${checkIn.nutritionStatus}
- Sleep Quality: ${checkIn.sleepQuality}/5
- Soreness: ${checkIn.sorenessLevel}
- Energy: ${checkIn.energyLevel}/5
${checkIn.weight ? `- Weight: ${checkIn.weight} kg` : ''}
${checkIn.notes ? `- Notes: ${checkIn.notes}` : ''}`;
    })
    .join('\n\n');
};

/**
 * Build context from recent workout history
 */
export const buildWorkoutContext = (workouts: WorkoutPlan[]): string => {
  if (workouts.length === 0) {
    return 'No recent workouts available.';
  }

  return workouts
    .map(workout => {
      const exerciseDetails = workout.exercises.map(ex => {
        const setsInfo = ex.sets.map(set => {
          const planned = `${set.weight}kg x ${set.reps}`;
          const actual = set.actualWeight !== undefined
            ? `${set.actualWeight}kg x ${set.actualReps ?? set.reps}`
            : null;
          return actual ? `Planned: ${planned} → Actual: ${actual}` : `Planned: ${planned}`;
        }).join('; ');
        return `  • ${ex.exerciseName}: ${setsInfo}`;
      }).join('\n');

      return `${workout.date} - ${workout.dayName} (${workout.completed ? 'Completed' : 'Skipped'})
${exerciseDetails}`;
    })
    .join('\n\n');
};

/**
 * Get the next training day name based on split
 */
export const getNextDayName = (split: string, lastDayName?: string): string => {
  const splits = {
    ppl: ['Push Day', 'Pull Day', 'Legs Day'],
    upper_lower: ['Upper Body', 'Lower Body'],
    full_body: ['Full Body Workout'],
  };

  const days = splits[split as keyof typeof splits] || splits.ppl;

  if (!lastDayName) {
    return days[0];
  }

  const currentIndex = days.indexOf(lastDayName);
  return days[(currentIndex + 1) % days.length];
};

/**
 * Prompt for generating tomorrow's workout plan
 */
export const generateWorkoutPlanPrompt = (
  nextDayName: string,
  recentWorkouts: string,
  recentCheckIns: string
): string => {
  return `Generate tomorrow's ${nextDayName} workout plan.

RECENT WORKOUTS:
${recentWorkouts}

RECENT CHECK-INS:
${recentCheckIns}

REQUIREMENTS:
- Select 5-7 exercises appropriate for ${nextDayName}
- Include warm-up recommendations
- Provide specific sets, reps, and weight recommendations (in kg)
- Use the ACTUAL weights from recent workouts (not planned weights) as the baseline for progressive overload
- If the user completed all reps at the actual weight, increase weight by 1-2.5kg
- If the user did fewer reps than planned, keep the same weight or reduce slightly
- Adjust based on reported soreness and energy levels
- Include 1-2 sentence coaching insight referencing actual performance

Return a JSON object with this EXACT structure:
{
  "dayName": "${nextDayName}",
  "exercises": [
    {
      "exerciseName": "Bench Press",
      "muscleGroup": "Chest",
      "sets": [
        {"setNumber": 1, "reps": 8, "weight": 80, "completed": false},
        {"setNumber": 2, "reps": 8, "weight": 80, "completed": false},
        {"setNumber": 3, "reps": 8, "weight": 80, "completed": false}
      ],
      "notes": "Focus on controlled eccentric"
    }
  ],
  "estimatedDuration": 60,
  "aiInsight": "Last push day was strong. Adding 2.5kg to bench press."
}`;
};

/**
 * Prompt for generating tomorrow's meal plan
 */
export const generateMealPlanPrompt = (
  targetCalories: number,
  macros: { protein: number; carbs: number; fats: number },
  recentCheckIns: string
): string => {
  return `Generate tomorrow's meal plan.

NUTRITION TARGETS:
- Calories: ${targetCalories}
- Protein: ${macros.protein}g
- Carbs: ${macros.carbs}g
- Fats: ${macros.fats}g

RECENT CHECK-INS:
${recentCheckIns}

REQUIREMENTS:
- Create 3 main meals (breakfast, lunch, dinner) and 1-2 snacks
- Meals should be realistic and easy to prepare
- Include specific ingredients and portions
- Hit macro targets within 5% accuracy
- Provide variety from previous days
- Consider reported nutrition status

Return a JSON object with this EXACT structure:
{
  "meals": [
    {
      "name": "Protein Oatmeal Bowl",
      "mealType": "breakfast",
      "calories": 450,
      "protein": 35,
      "carbs": 55,
      "fats": 10,
      "ingredients": ["1 cup oats", "1 scoop protein powder", "1/2 banana", "1 tbsp peanut butter"],
      "instructions": "Cook oats, mix in protein powder, top with banana and peanut butter"
    }
  ],
  "totalCalories": ${targetCalories},
  "totalProtein": ${macros.protein},
  "totalCarbs": ${macros.carbs},
  "totalFats": ${macros.fats}
}`;
};
