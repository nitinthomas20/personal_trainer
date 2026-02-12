# AI Fitness Coach PWA - Comprehensive Build Prompt

## Overview
You are building a Progressive Web App (PWA) that acts as a proactive AI personal trainer and nutritionist. The app generates daily workout and meal plans automatically, requires minimal user input, and adapts based on nightly check-ins.

---

## CRITICAL INSTRUCTIONS FOR THE AI AGENT

**Working Style:**
- Complete ONE step at a time, then STOP
- After completing each step, show me what you built and explain the code
- Wait for my "continue" or "next step" before proceeding
- If I ask questions about the current step, answer them before moving forward
- Show me the full file contents after creating/modifying files
- Explain WHY you made specific technical decisions

**Code Quality Standards:**
- Use TypeScript for type safety
- Follow modern React best practices (functional components, hooks)
- Include detailed code comments explaining complex logic
- Use meaningful variable and function names
- Implement proper error handling
- Write clean, readable code with consistent formatting

**Testing & Validation:**
- After each step, tell me how to test/verify it works
- Provide clear instructions on what I should see
- Include console.log statements for debugging where helpful

---

## STEP-BY-STEP BUILD PROCESS

### PHASE 1: PROJECT SETUP & FOUNDATION

#### Step 1: Initialize React + TypeScript + Vite Project
**Task:** Set up the base project structure with modern tooling

**Instructions:**
1. Create a new React project using Vite with TypeScript template
2. Configure the project with these exact commands:
   ```bash
   npm create vite@latest ai-fitness-coach -- --template react-ts
   cd ai-fitness-coach
   npm install
   ```
3. Explain the project structure that was created
4. Show me the contents of `package.json`, `vite.config.ts`, and `tsconfig.json`
5. Start the dev server and confirm it works

**What I should see:** A running React app at localhost with the default Vite template

**Wait for confirmation before proceeding to Step 2**

---

#### Step 2: Install Core Dependencies
**Task:** Add all necessary packages for the project

**Instructions:**
1. Install these dependencies and explain what each one does:
   ```bash
   npm install @anthropic-ai/sdk
   npm install dexie dexie-react-hooks
   npm install react-router-dom
   npm install date-fns
   npm install recharts
   npm install lucide-react
   npm install -D tailwindcss postcss autoprefixer
   npm install -D @types/node
   ```

2. Initialize Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```

3. Configure Tailwind by updating `tailwind.config.js`:
   - Set up content paths to scan for classes
   - Configure theme extensions if needed

4. Create/update `src/index.css` with Tailwind directives

5. Show me the complete dependency list and explain the role of each package:
   - **@anthropic-ai/sdk**: Why we need it
   - **dexie**: Why we chose this over localStorage
   - **react-router-dom**: Even though it's a single-page app
   - **date-fns**: Date manipulation
   - **recharts**: For progress charts
   - **lucide-react**: Icon library

**What I should see:** All packages installed successfully, Tailwind working (test with a colored div)

**Wait for confirmation before proceeding to Step 3**

---

#### Step 3: Set Up Project Structure
**Task:** Create a well-organized folder structure following best practices

**Instructions:**
1. Create this exact folder structure in `src/`:
   ```
   src/
   ├── components/
   │   ├── layout/
   │   ├── workout/
   │   ├── nutrition/
   │   ├── checkin/
   │   └── common/
   ├── services/
   │   ├── api/
   │   ├── database/
   │   └── ai/
   ├── types/
   ├── hooks/
   ├── utils/
   ├── pages/
   └── constants/
   ```

2. Explain the purpose of each folder:
   - Why separate `services` from `hooks`?
   - What goes in `utils` vs `constants`?
   - Component organization strategy

3. Create a `README.md` in the root documenting:
   - Project overview
   - Folder structure explanation
   - How to run the project
   - Environment variables needed (we'll set these up later)

**What I should see:** Clean folder structure with empty folders ready for code

**Wait for confirmation before proceeding to Step 4**

---

### PHASE 2: DATABASE LAYER (IndexedDB with Dexie)

#### Step 4: Define TypeScript Types
**Task:** Create comprehensive type definitions for all data structures

**Instructions:**
1. Create `src/types/index.ts` with these interfaces (and explain each):

   ```typescript
   // User Profile
   export interface UserProfile {
     id: string;
     name: string;
     age: number;
     weight: number; // in lbs
     height: number; // in inches
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
   ```

2. Explain:
   - Why use string dates ('YYYY-MM-DD') vs Date objects?
   - The relationship between these types
   - How they'll be used together
   - Why certain fields are optional

**What I should see:** Complete type definitions with no TypeScript errors

**Wait for confirmation before proceeding to Step 5**

---

#### Step 5: Set Up Dexie Database Schema
**Task:** Create the IndexedDB database structure using Dexie

**Instructions:**
1. Create `src/services/database/db.ts`

2. Implement the database class:
   ```typescript
   import Dexie, { Table } from 'dexie';
   import {
     UserProfile,
     WorkoutPlan,
     MealPlan,
     DailyCheckIn,
     WeightEntry,
     BodyMeasurement,
   } from '../../types';

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
   ```

3. Explain in detail:
   - How Dexie version() works
   - What the index strings mean ('id, date, completed')
   - Why we index certain fields
   - Table<T> generic type usage
   - Singleton pattern with `export const db`

4. Create `src/services/database/index.ts` to export the db instance

**What I should see:** Database initialized, accessible in browser DevTools → Application → IndexedDB

**Testing instructions:** 
- Open browser DevTools
- Go to Application tab → IndexedDB
- You should see 'FitnessCoachDB' with the tables

**Wait for confirmation before proceeding to Step 6**

---

#### Step 6: Create Database Service Functions
**Task:** Build CRUD operations for each data type

**Instructions:**
1. Create `src/services/database/operations.ts`

2. Implement these functions with full error handling:

   ```typescript
   import { db } from './db';
   import { UserProfile, WorkoutPlan, MealPlan, DailyCheckIn } from '../../types';

   // ============================================
   // USER PROFILE OPERATIONS
   // ============================================

   export const getUserProfile = async (): Promise<UserProfile | undefined> => {
     try {
       // Since there's only one user, get the first profile
       const profile = await db.userProfile.toCollection().first();
       return profile;
     } catch (error) {
       console.error('Error fetching user profile:', error);
       throw error;
     }
   };

   export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
     try {
       const newProfile: UserProfile = {
         ...profile,
         id: crypto.randomUUID(),
         createdAt: new Date(),
         updatedAt: new Date(),
       };
       
       await db.userProfile.add(newProfile);
       return newProfile.id;
     } catch (error) {
       console.error('Error creating user profile:', error);
       throw error;
     }
   };

   export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
     try {
       const profile = await getUserProfile();
       if (!profile) {
         throw new Error('No user profile found');
       }
       
       await db.userProfile.update(profile.id, {
         ...updates,
         updatedAt: new Date(),
       });
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
       return await db.workoutPlans.where('date').equals(date).first();
     } catch (error) {
       console.error('Error fetching workout plan:', error);
       throw error;
     }
   };

   export const saveWorkoutPlan = async (plan: Omit<WorkoutPlan, 'id'>): Promise<string> => {
     try {
       const newPlan: WorkoutPlan = {
         ...plan,
         id: crypto.randomUUID(),
       };
       
       await db.workoutPlans.add(newPlan);
       return newPlan.id;
     } catch (error) {
       console.error('Error saving workout plan:', error);
       throw error;
     }
   };

   export const markWorkoutComplete = async (planId: string): Promise<void> => {
     try {
       await db.workoutPlans.update(planId, {
         completed: true,
         completedAt: new Date(),
       });
     } catch (error) {
       console.error('Error marking workout complete:', error);
       throw error;
     }
   };

   // ============================================
   // MEAL PLAN OPERATIONS
   // ============================================

   export const getMealPlanByDate = async (date: string): Promise<MealPlan | undefined> => {
     try {
       return await db.mealPlans.where('date').equals(date).first();
     } catch (error) {
       console.error('Error fetching meal plan:', error);
       throw error;
     }
   };

   export const saveMealPlan = async (plan: Omit<MealPlan, 'id'>): Promise<string> => {
     try {
       const newPlan: MealPlan = {
         ...plan,
         id: crypto.randomUUID(),
       };
       
       await db.mealPlans.add(newPlan);
       return newPlan.id;
     } catch (error) {
       console.error('Error saving meal plan:', error);
       throw error;
     }
   };

   // ============================================
   // CHECK-IN OPERATIONS
   // ============================================

   export const saveDailyCheckIn = async (checkIn: Omit<DailyCheckIn, 'id' | 'submittedAt'>): Promise<string> => {
     try {
       const newCheckIn: DailyCheckIn = {
         ...checkIn,
         id: crypto.randomUUID(),
         submittedAt: new Date(),
       };
       
       await db.dailyCheckIns.add(newCheckIn);
       return newCheckIn.id;
     } catch (error) {
       console.error('Error saving check-in:', error);
       throw error;
     }
   };

   export const getRecentCheckIns = async (limit: number = 7): Promise<DailyCheckIn[]> => {
     try {
       return await db.dailyCheckIns
         .orderBy('date')
         .reverse()
         .limit(limit)
         .toArray();
     } catch (error) {
       console.error('Error fetching recent check-ins:', error);
       throw error;
     }
   };

   // ============================================
   // WEIGHT TRACKING
   // ============================================

   export const addWeightEntry = async (weight: number, date: string): Promise<void> => {
     try {
       await db.weightHistory.add({
         id: crypto.randomUUID(),
         date,
         weight,
         createdAt: new Date(),
       });
     } catch (error) {
       console.error('Error adding weight entry:', error);
       throw error;
     }
   };

   export const getWeightHistory = async (days: number = 90): Promise<WeightEntry[]> => {
     try {
       const cutoffDate = new Date();
       cutoffDate.setDate(cutoffDate.getDate() - days);
       const cutoffString = cutoffDate.toISOString().split('T')[0];
       
       return await db.weightHistory
         .where('date')
         .aboveOrEqual(cutoffString)
         .toArray();
     } catch (error) {
       console.error('Error fetching weight history:', error);
       throw error;
     }
   };
   ```

3. Explain:
   - Why use `crypto.randomUUID()` for IDs
   - The `Omit<Type, 'field'>` utility type
   - Error handling strategy
   - Dexie query methods (.where(), .equals(), .first())
   - Date handling (why strings for dates in DB)

4. Add these helper functions at the end:

   ```typescript
   // ============================================
   // UTILITY FUNCTIONS
   // ============================================

   export const getTodayString = (): string => {
     return new Date().toISOString().split('T')[0];
   };

   export const clearAllData = async (): Promise<void> => {
     try {
       await db.transaction('rw', db.tables, async () => {
         for (const table of db.tables) {
           await table.clear();
         }
       });
       console.log('All data cleared successfully');
     } catch (error) {
       console.error('Error clearing data:', error);
       throw error;
     }
   };
   ```

5. Explain transactions and why we need clearAllData (for development/reset)

**What I should see:** All functions export properly, no TypeScript errors

**Testing instructions:**
You'll test these in the next step when we create a test component

**Wait for confirmation before proceeding to Step 7**

---

#### Step 7: Test Database Operations
**Task:** Create a temporary component to verify database operations work

**Instructions:**
1. Create `src/components/common/DatabaseTest.tsx`

2. Implement a test component with buttons to test each operation:

   ```typescript
   import React from 'react';
   import {
     createUserProfile,
     getUserProfile,
     saveWorkoutPlan,
     saveMealPlan,
     saveDailyCheckIn,
     addWeightEntry,
     getWeightHistory,
     clearAllData,
     getTodayString,
   } from '../../services/database/operations';

   export const DatabaseTest: React.FC = () => {
     const [logs, setLogs] = React.useState<string[]>([]);

     const addLog = (message: string) => {
       setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
     };

     const testCreateProfile = async () => {
       try {
         const profileId = await createUserProfile({
           name: 'Test User',
           age: 25,
           weight: 180,
           height: 72,
           gender: 'male',
           experienceLevel: 'intermediate',
           trainingDays: 4,
           trainingSplit: 'ppl',
           goal: 'muscle_gain',
           targetCalories: 3200,
           macros: { protein: 180, carbs: 350, fats: 90 },
           equipment: ['barbell', 'dumbbells', 'bench'],
           injuries: [],
           foodPreferences: { allergies: [], dislikedFoods: [] },
         });
         addLog(`✅ Created profile: ${profileId}`);
       } catch (error) {
         addLog(`❌ Error: ${error}`);
       }
     };

     const testGetProfile = async () => {
       try {
         const profile = await getUserProfile();
         addLog(`✅ Fetched profile: ${profile?.name || 'Not found'}`);
         console.log('Profile:', profile);
       } catch (error) {
         addLog(`❌ Error: ${error}`);
       }
     };

     const testSaveWorkout = async () => {
       try {
         const planId = await saveWorkoutPlan({
           date: getTodayString(),
           dayName: 'Push Day',
           exercises: [
             {
               id: crypto.randomUUID(),
               exerciseId: 'bench-press',
               exerciseName: 'Bench Press',
               sets: [
                 { setNumber: 1, reps: 8, weight: 185, completed: false },
                 { setNumber: 2, reps: 8, weight: 185, completed: false },
               ],
               order: 1,
             },
           ],
           estimatedDuration: 60,
           completed: false,
           aiInsight: 'Focus on form today',
           generatedAt: new Date(),
         });
         addLog(`✅ Saved workout plan: ${planId}`);
       } catch (error) {
         addLog(`❌ Error: ${error}`);
       }
     };

     const testAddWeight = async () => {
       try {
         await addWeightEntry(180.5, getTodayString());
         addLog(`✅ Added weight entry`);
       } catch (error) {
         addLog(`❌ Error: ${error}`);
       }
     };

     const testGetWeightHistory = async () => {
       try {
         const history = await getWeightHistory(30);
         addLog(`✅ Fetched ${history.length} weight entries`);
         console.log('Weight history:', history);
       } catch (error) {
         addLog(`❌ Error: ${error}`);
       }
     };

     const testClearAll = async () => {
       if (confirm('Clear all data?')) {
         try {
           await clearAllData();
           addLog(`✅ Cleared all data`);
         } catch (error) {
           addLog(`❌ Error: ${error}`);
         }
       }
     };

     return (
       <div className="p-8 max-w-4xl mx-auto">
         <h1 className="text-3xl font-bold mb-6">Database Test Suite</h1>
         
         <div className="grid grid-cols-2 gap-4 mb-8">
           <button
             onClick={testCreateProfile}
             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
           >
             Create Test Profile
           </button>
           
           <button
             onClick={testGetProfile}
             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
           >
             Get Profile
           </button>
           
           <button
             onClick={testSaveWorkout}
             className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
           >
             Save Test Workout
           </button>
           
           <button
             onClick={testAddWeight}
             className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
           >
             Add Weight Entry
           </button>
           
           <button
             onClick={testGetWeightHistory}
             className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
           >
             Get Weight History
           </button>
           
           <button
             onClick={testClearAll}
             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
           >
             Clear All Data
           </button>
         </div>

         <div className="bg-gray-100 p-4 rounded">
           <h2 className="font-bold mb-2">Activity Log:</h2>
           <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
             {logs.map((log, i) => (
               <div key={i}>{log}</div>
             ))}
           </div>
         </div>

         <div className="mt-4 text-sm text-gray-600">
           <p>Open DevTools Console to see full objects logged</p>
           <p>Check Application → IndexedDB → FitnessCoachDB to see stored data</p>
         </div>
       </div>
     );
   };
   ```

3. Temporarily update `src/App.tsx` to render the test component:
   ```typescript
   import { DatabaseTest } from './components/common/DatabaseTest';

   function App() {
     return <DatabaseTest />;
   }

   export default App;
   ```

4. Explain:
   - How to use React DevTools to inspect state
   - How to use Application tab to view IndexedDB
   - The async/await pattern used
   - Why we're logging to both UI and console

**What I should see:** 
- A page with test buttons
- Clicking each button should work without errors
- Data should appear in IndexedDB
- Logs should show success messages

**Testing instructions:**
1. Click "Create Test Profile" - check IndexedDB userProfile table
2. Click "Get Profile" - should log profile to console
3. Click "Save Test Workout" - check workoutPlans table
4. Click "Add Weight Entry" - check weightHistory table
5. Click "Clear All Data" - all tables should empty

**Wait for confirmation before proceeding to Step 8**

---

### PHASE 3: ANTHROPIC API INTEGRATION

#### Step 8: Set Up Environment Variables
**Task:** Configure API key management securely

**Instructions:**
1. Create `.env.local` file in project root:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

2. Add to `.gitignore`:
   ```
   # Environment variables
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

3. Create `.env.example` for documentation:
   ```
   # Anthropic API Key
   # Get yours at: https://console.anthropic.com/
   VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```

4. Update `README.md` with setup instructions:
   ```markdown
   ## Environment Setup

   1. Copy `.env.example` to `.env.local`
   2. Add your Anthropic API key
   3. Restart the dev server
   ```

5. Explain:
   - Why VITE_ prefix is required for Vite
   - Security implications of client-side API keys
   - Alternative: backend proxy (for production)
   - Why .env.local is gitignored

**What I should see:** Environment variables accessible via import.meta.env.VITE_ANTHROPIC_API_KEY

**Testing:** Add console.log in App.tsx to verify (then remove it)

**Wait for confirmation before proceeding to Step 9**

---

#### Step 9: Create Claude API Service
**Task:** Build the Claude API client with proper error handling

**Instructions:**
1. Create `src/services/api/claude.ts`

2. Implement the API client:

   ```typescript
   import Anthropic from '@anthropic-ai/sdk';

   // Initialize the Anthropic client
   const anthropic = new Anthropic({
     apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
     dangerouslyAllowBrowser: true, // Note: For personal use only!
   });

   export interface ClaudeMessage {
     role: 'user' | 'assistant';
     content: string;
   }

   export interface ClaudeResponse {
     content: string;
     usage?: {
       input_tokens: number;
       output_tokens: number;
     };
   }

   /**
    * Send a message to Claude and get a response
    * @param systemPrompt - The system instruction for Claude
    * @param messages - Conversation history
    * @param maxTokens - Maximum tokens in response (default: 2000)
    */
   export const sendMessageToClaude = async (
     systemPrompt: string,
     messages: ClaudeMessage[],
     maxTokens: number = 2000
   ): Promise<ClaudeResponse> => {
     try {
       const response = await anthropic.messages.create({
         model: 'claude-sonnet-4-20250514',
         max_tokens: maxTokens,
         system: systemPrompt,
         messages: messages.map(msg => ({
           role: msg.role,
           content: msg.content,
         })),
       });

       // Extract text content from response
       const textContent = response.content
         .filter(block => block.type === 'text')
         .map(block => block.type === 'text' ? block.text : '')
         .join('\n');

       return {
         content: textContent,
         usage: {
           input_tokens: response.usage.input_tokens,
           output_tokens: response.usage.output_tokens,
         },
       };
     } catch (error) {
       console.error('Error calling Claude API:', error);
       
       if (error instanceof Anthropic.APIError) {
         throw new Error(`Claude API Error: ${error.message}`);
       }
       
       throw new Error('Failed to communicate with Claude');
     }
   };

   /**
    * Test the API connection
    */
   export const testClaudeConnection = async (): Promise<boolean> => {
     try {
       const response = await sendMessageToClaude(
         'You are a helpful assistant.',
         [{ role: 'user', content: 'Say "Connection successful" if you can read this.' }],
         50
       );
       
       return response.content.includes('Connection successful');
     } catch (error) {
       console.error('Connection test failed:', error);
       return false;
     }
   };
   ```

3. Explain in detail:
   - The `dangerouslyAllowBrowser` flag and why it's okay for personal use
   - Why we shouldn't use this for a production multi-user app
   - How the Anthropic SDK handles requests
   - Response structure and content blocks
   - Error handling with Anthropic.APIError
   - Token usage tracking

4. Security discussion:
   - When would you need a backend proxy?
   - How to protect API keys in production
   - Rate limiting considerations

**What I should see:** No errors when importing the module

**Wait for confirmation before proceeding to Step 10**

---

#### Step 10: Test Claude API Connection
**Task:** Verify API integration works

**Instructions:**
1. Create `src/components/common/ClaudeTest.tsx`:

   ```typescript
   import React, { useState } from 'react';
   import { sendMessageToClaude, testClaudeConnection } from '../../services/api/claude';

   export const ClaudeTest: React.FC = () => {
     const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
     const [response, setResponse] = useState<string>('');
     const [userInput, setUserInput] = useState<string>('');
     const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

     const testConnection = async () => {
       setStatus('testing');
       try {
         const success = await testClaudeConnection();
         setStatus(success ? 'success' : 'error');
         setResponse(success ? '✅ Connection successful!' : '❌ Connection failed');
       } catch (error) {
         setStatus('error');
         setResponse(`❌ Error: ${error}`);
       }
     };

     const sendMessage = async () => {
       if (!userInput.trim()) return;

       const newMessage = { role: 'user' as const, content: userInput };
       const updatedHistory = [...chatHistory, newMessage];
       setChatHistory(updatedHistory);
       setUserInput('');
       setStatus('testing');

       try {
         const result = await sendMessageToClaude(
           'You are a fitness coach AI. Be helpful and motivating.',
           updatedHistory,
           500
         );

         setChatHistory([
           ...updatedHistory,
           { role: 'assistant', content: result.content }
         ]);
         
         setStatus('success');
         setResponse(`Tokens used: ${result.usage?.input_tokens} in / ${result.usage?.output_tokens} out`);
       } catch (error) {
         setStatus('error');
         setResponse(`❌ Error: ${error}`);
       }
     };

     return (
       <div className="p-8 max-w-4xl mx-auto">
         <h1 className="text-3xl font-bold mb-6">Claude API Test</h1>

         <div className="mb-6 space-y-4">
           <button
             onClick={testConnection}
             disabled={status === 'testing'}
             className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
           >
             {status === 'testing' ? 'Testing...' : 'Test Connection'}
           </button>

           {response && (
             <div className={`p-4 rounded ${
               status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
             }`}>
               {response}
             </div>
           )}
         </div>

         <div className="border-t pt-6">
           <h2 className="text-xl font-bold mb-4">Chat with Claude</h2>
           
           <div className="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
             {chatHistory.length === 0 ? (
               <p className="text-gray-500 text-center">No messages yet. Start chatting!</p>
             ) : (
               <div className="space-y-3">
                 {chatHistory.map((msg, i) => (
                   <div
                     key={i}
                     className={`p-3 rounded ${
                       msg.role === 'user'
                         ? 'bg-blue-500 text-white ml-12'
                         : 'bg-white mr-12'
                     }`}
                   >
                     <div className="font-bold text-sm mb-1">
                       {msg.role === 'user' ? 'You' : 'Claude'}
                     </div>
                     <div className="whitespace-pre-wrap">{msg.content}</div>
                   </div>
                 ))}
               </div>
             )}
           </div>

           <div className="flex gap-2">
             <input
               type="text"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
               placeholder="Ask Claude something..."
               className="flex-1 px-4 py-2 border rounded-lg"
               disabled={status === 'testing'}
             />
             <button
               onClick={sendMessage}
               disabled={status === 'testing' || !userInput.trim()}
               className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
             >
               Send
             </button>
           </div>
         </div>
       </div>
     );
   };
   ```

2. Update `src/App.tsx` to show both tests:
   ```typescript
   import { DatabaseTest } from './components/common/DatabaseTest';
   import { ClaudeTest } from './components/common/ClaudeTest';

   function App() {
     return (
       <div>
         <ClaudeTest />
         <hr className="my-8" />
         <DatabaseTest />
       </div>
     );
   }

   export default App;
   ```

3. Explain:
   - Chat interface implementation
   - Message history management
   - Disabled states during API calls
   - Cost monitoring (token usage display)

**What I should see:**
- "Test Connection" button works
- Can send messages and get responses
- Token usage displayed
- Chat history maintained

**Testing instructions:**
1. Click "Test Connection" - should show success
2. Type a message and send
3. Verify response appears
4. Send multiple messages - history should build up
5. Check console for any errors

**Wait for confirmation before proceeding to Step 11**

---

### PHASE 4: AI PLAN GENERATION

#### Step 11: Create AI Prompt Engineering Module
**Task:** Build the system prompts and plan generation logic

**Instructions:**
1. Create `src/services/ai/prompts.ts`:

   ```typescript
   import { UserProfile, DailyCheckIn, WorkoutPlan } from '../../types';

   /**
    * Generate the base system prompt with user context
    */
   export const buildSystemPrompt = (profile: UserProfile): string => {
     return `You are an expert personal trainer and nutritionist AI. You generate personalized workout and meal plans.

   USER PROFILE:
   - Name: ${profile.name}
   - Age: ${profile.age}, Gender: ${profile.gender}
   - Weight: ${profile.weight} lbs, Height: ${profile.height} inches
   - Experience: ${profile.experienceLevel}
   - Training Split: ${profile.trainingSplit.toUpperCase()} (${profile.trainingDays} days/week)
   - Goal: ${profile.goal.replace('_', ' ')}
   - Available Equipment: ${profile.equipment.join(', ')}
   - Injuries/Limitations: ${profile.injuries.length > 0 ? profile.injuries.join(', ') : 'None'}

   NUTRITION TARGETS:
   - Daily Calories: ${profile.targetCalories}
   - Macros: ${profile.macros.protein}g protein, ${profile.macros.carbs}g carbs, ${profile.macros.fats}g fats
   - Food Preferences: ${profile.foodPreferences.vegetarian ? 'Vegetarian' : ''}
   ${profile.foodPreferences.vegan ? 'Vegan' : ''}
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

     return checkIns.map(checkIn => {
       return `Date: ${checkIn.date}
   - Workout: ${checkIn.workoutCompleted}
   - Nutrition: ${checkIn.nutritionStatus}
   - Sleep Quality: ${checkIn.sleepQuality}/5
   - Soreness: ${checkIn.sorenessLevel}
   - Energy: ${checkIn.energyLevel}/5
   ${checkIn.weight ? `- Weight: ${checkIn.weight} lbs` : ''}
   ${checkIn.notes ? `- Notes: ${checkIn.notes}` : ''}`;
     }).join('\n\n');
   };

   /**
    * Build context from recent workout history
    */
   export const buildWorkoutContext = (workouts: WorkoutPlan[]): string => {
     if (workouts.length === 0) {
       return 'No recent workouts available.';
     }

     return workouts.map(workout => {
       const totalVolume = workout.exercises.reduce((sum, ex) => {
         const exVolume = ex.sets.reduce((s, set) => s + (set.reps * set.weight), 0);
         return sum + exVolume;
       }, 0);

       return `${workout.date} - ${workout.dayName} (${workout.completed ? 'Completed' : 'Skipped'})
   - Exercises: ${workout.exercises.length}
   - Total Volume: ${totalVolume} lbs
   - Key Lifts: ${workout.exercises.slice(0, 2).map(e => e.exerciseName).join(', ')}`;
     }).join('\n\n');
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
   - Provide specific sets, reps, and weight recommendations
   - Consider progressive overload (increase from last session if appropriate)
   - Adjust based on reported soreness and energy levels
   - Include 1-2 sentence coaching insight

   Return a JSON object with this EXACT structure:
   {
     "dayName": "${nextDayName}",
     "exercises": [
       {
         "exerciseName": "Bench Press",
         "muscleGroup": "Chest",
         "sets": [
           {"setNumber": 1, "reps": 8, "weight": 185, "completed": false},
           {"setNumber": 2, "reps": 8, "weight": 185, "completed": false}
         ],
         "notes": "Focus on controlled eccentric"
       }
     ],
     "estimatedDuration": 60,
     "aiInsight": "Last push day was strong. Adding 5lbs to bench press."
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
   - Hit macro targets within ±5%
   - Provide variety (don't repeat yesterday's meals if possible)
   - Include simple, practical meals
   - List key ingredients for each meal

   Return a JSON object with this EXACT structure:
   {
     "meals": [
       {
         "mealType": "breakfast",
         "name": "Oatmeal with Protein",
         "calories": 600,
         "protein": 40,
         "carbs": 70,
         "fats": 15,
         "ingredients": ["oats", "protein powder", "banana", "peanut butter"]
       }
     ],
     "totalCalories": ${targetCalories},
     "totalProtein": ${macros.protein},
     "totalCarbs": ${macros.carbs},
     "totalFats": ${macros.fats}
   }`;
   };
   ```

2. Explain each function:
   - Template literal usage for dynamic prompts
   - Why we specify JSON structure explicitly
   - How context affects AI responses
   - Progressive overload logic hints

3. Create `src/services/ai/index.ts` to export prompts

**What I should see:** All prompts export correctly, no errors

**Wait for confirmation before proceeding to Step 12**

---

#### Step 12: Create Plan Generator Service
**Task:** Build the service that calls Claude to generate plans

**Instructions:**
1. Create `src/services/ai/planGenerator.ts`:

   ```typescript
   import { sendMessageToClaude } from '../api/claude';
   import {
     buildSystemPrompt,
     buildCheckInContext,
     buildWorkoutContext,
     generateWorkoutPlanPrompt,
     generateMealPlanPrompt,
   } from './prompts';
   import {
     getUserProfile,
     getRecentCheckIns,
     saveWorkoutPlan,
     saveMealPlan,
   } from '../database/operations';
   import { WorkoutPlan, MealPlan, WorkoutExercise } from '../../types';
   import { db } from '../database/db';

   /**
    * Determine the next training day based on split
    */
   const getNextTrainingDay = async (): Promise<string> => {
     const profile = await getUserProfile();
     if (!profile) throw new Error('No user profile found');

     // Get recent completed workouts
     const recentWorkouts = await db.workoutPlans
       .where('completed')
       .equals(1) // 1 = true in IndexedDB
       .reverse()
       .limit(5)
       .toArray();

     if (profile.trainingSplit === 'ppl') {
       const lastDay = recentWorkouts[0]?.dayName || '';
       
       if (lastDay.includes('Push')) return 'Pull Day - Back & Biceps';
       if (lastDay.includes('Pull')) return 'Leg Day - Quads, Hamstrings, Calves';
       return 'Push Day - Chest, Shoulders, Triceps';
     }

     if (profile.trainingSplit === 'upper_lower') {
       const lastDay = recentWorkouts[0]?.dayName || '';
       return lastDay.includes('Upper') ? 'Lower Day' : 'Upper Day';
     }

     return 'Full Body Workout';
   };

   /**
    * Generate tomorrow's workout plan using AI
    */
   export const generateWorkoutPlan = async (targetDate: string): Promise<WorkoutPlan> => {
     console.log('🏋️ Generating workout plan for:', targetDate);

     // Gather context
     const profile = await getUserProfile();
     if (!profile) throw new Error('No user profile found');

     const recentCheckIns = await getRecentCheckIns(7);
     const recentWorkouts = await db.workoutPlans
       .orderBy('date')
       .reverse()
       .limit(5)
       .toArray();

     // Build prompts
     const systemPrompt = buildSystemPrompt(profile);
     const checkInContext = buildCheckInContext(recentCheckIns);
     const workoutContext = buildWorkoutContext(recentWorkouts);
     const nextDay = await getNextTrainingDay();

     const userPrompt = generateWorkoutPlanPrompt(
       nextDay,
       workoutContext,
       checkInContext
     );

     // Call Claude API
     console.log('📡 Calling Claude API...');
     const response = await sendMessageToClaude(
       systemPrompt,
       [{ role: 'user', content: userPrompt }],
       2000
     );

     console.log('✅ Received response from Claude');
     console.log('Token usage:', response.usage);

     // Parse JSON response
     let parsedPlan: any;
     try {
       // Remove markdown code blocks if present
       let cleanJson = response.content.trim();
       cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
       parsedPlan = JSON.parse(cleanJson);
     } catch (error) {
       console.error('Failed to parse Claude response:', response.content);
       throw new Error('Invalid JSON response from Claude');
     }

     // Transform to WorkoutPlan format
     const workoutPlan: Omit<WorkoutPlan, 'id'> = {
       date: targetDate,
       dayName: parsedPlan.dayName,
       exercises: parsedPlan.exercises.map((ex: any, index: number): WorkoutExercise => ({
         id: crypto.randomUUID(),
         exerciseId: ex.exerciseName.toLowerCase().replace(/\s+/g, '-'),
         exerciseName: ex.exerciseName,
         sets: ex.sets,
         notes: ex.notes,
         order: index + 1,
       })),
       estimatedDuration: parsedPlan.estimatedDuration,
       completed: false,
       aiInsight: parsedPlan.aiInsight,
       generatedAt: new Date(),
     };

     // Save to database
     const planId = await saveWorkoutPlan(workoutPlan);
     console.log('💾 Saved workout plan:', planId);

     return { ...workoutPlan, id: planId };
   };

   /**
    * Generate tomorrow's meal plan using AI
    */
   export const generateMealPlan = async (targetDate: string): Promise<MealPlan> => {
     console.log('🍽️ Generating meal plan for:', targetDate);

     // Gather context
     const profile = await getUserProfile();
     if (!profile) throw new Error('No user profile found');

     const recentCheckIns = await getRecentCheckIns(7);
     const checkInContext = buildCheckInContext(recentCheckIns);

     // Build prompts
     const systemPrompt = buildSystemPrompt(profile);
     const userPrompt = generateMealPlanPrompt(
       profile.targetCalories,
       profile.macros,
       checkInContext
     );

     // Call Claude API
     console.log('📡 Calling Claude API...');
     const response = await sendMessageToClaude(
       systemPrompt,
       [{ role: 'user', content: userPrompt }],
       2000
     );

     console.log('✅ Received response from Claude');
     console.log('Token usage:', response.usage);

     // Parse JSON response
     let parsedPlan: any;
     try {
       let cleanJson = response.content.trim();
       cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
       parsedPlan = JSON.parse(cleanJson);
     } catch (error) {
       console.error('Failed to parse Claude response:', response.content);
       throw new Error('Invalid JSON response from Claude');
     }

     // Transform to MealPlan format
     const mealPlan: Omit<MealPlan, 'id'> = {
       date: targetDate,
       meals: parsedPlan.meals.map((meal: any) => ({
         id: crypto.randomUUID(),
         ...meal,
       })),
       totalCalories: parsedPlan.totalCalories,
       totalProtein: parsedPlan.totalProtein,
       totalCarbs: parsedPlan.totalCarbs,
       totalFats: parsedPlan.totalFats,
       logged: false,
       generatedAt: new Date(),
     };

     // Save to database
     const planId = await saveMealPlan(mealPlan);
     console.log('💾 Saved meal plan:', planId);

     return { ...mealPlan, id: planId };
   };

   /**
    * Generate both workout and meal plans for tomorrow
    */
   export const generateTomorrowsPlans = async (): Promise<{
     workout: WorkoutPlan;
     meals: MealPlan;
   }> => {
     const tomorrow = new Date();
     tomorrow.setDate(tomorrow.getDate() + 1);
     const tomorrowString = tomorrow.toISOString().split('T')[0];

     console.log('🚀 Generating complete plan for:', tomorrowString);

     // Generate both plans
     const [workout, meals] = await Promise.all([
       generateWorkoutPlan(tomorrowString),
       generateMealPlan(tomorrowString),
     ]);

     console.log('✨ Complete plan generated successfully!');

     return { workout, meals };
   };
   ```

2. Explain in detail:
   - Async/await flow
   - Error handling strategy
   - JSON parsing with error recovery
   - Database integration
   - Progressive overload logic
   - Training split rotation
   - Parallel API calls with Promise.all()

3. Discuss:
   - Why we log extensively (debugging)
   - Token usage monitoring
   - Response validation

**What I should see:** Module exports without errors

**Wait for confirmation before proceeding to Step 13**

---

#### Step 13: Test Plan Generation
**Task:** Create UI to test the plan generation

**Instructions:**
1. Create `src/components/common/PlanGeneratorTest.tsx`:

   ```typescript
   import React, { useState } from 'react';
   import { generateTomorrowsPlans } from '../../services/ai/planGenerator';
   import { WorkoutPlan, MealPlan } from '../../types';

   export const PlanGeneratorTest: React.FC = () => {
     const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
     const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
     const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
     const [error, setError] = useState<string>('');

     const generatePlans = async () => {
       setStatus('generating');
       setError('');
       
       try {
         const { workout, meals } = await generateTomorrowsPlans();
         setWorkoutPlan(workout);
         setMealPlan(meals);
         setStatus('success');
       } catch (err) {
         setStatus('error');
         setError(err instanceof Error ? err.message : 'Unknown error');
       }
     };

     return (
       <div className="p-8 max-w-6xl mx-auto">
         <h1 className="text-3xl font-bold mb-6">AI Plan Generator Test</h1>

         <button
           onClick={generatePlans}
           disabled={status === 'generating'}
           className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 mb-6"
         >
           {status === 'generating' ? 'Generating Plans...' : 'Generate Tomorrow\'s Plans'}
         </button>

         {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
             {error}
           </div>
         )}

         {status === 'generating' && (
           <div className="text-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
             <p className="mt-4 text-gray-600">Consulting AI coach... This may take 10-20 seconds</p>
           </div>
         )}

         {workoutPlan && (
           <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
             <h2 className="text-2xl font-bold mb-4">🏋️ Workout Plan - {workoutPlan.date}</h2>
             <h3 className="text-xl font-semibold mb-2">{workoutPlan.dayName}</h3>
             <p className="text-gray-600 mb-4">⏱️ Estimated: {workoutPlan.estimatedDuration} minutes</p>
             
             <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
               <p className="font-semibold">💡 Coach Insight:</p>
               <p>{workoutPlan.aiInsight}</p>
             </div>

             <div className="space-y-4">
               {workoutPlan.exercises.map((exercise, idx) => (
                 <div key={exercise.id} className="border rounded-lg p-4">
                   <div className="font-bold text-lg mb-2">
                     {idx + 1}. {exercise.exerciseName}
                   </div>
                   {exercise.notes && (
                     <p className="text-sm text-gray-600 mb-2">📝 {exercise.notes}</p>
                   )}
                   <div className="grid grid-cols-3 gap-2 text-sm">
                     {exercise.sets.map((set) => (
                       <div key={set.setNumber} className="bg-gray-100 p-2 rounded">
                         Set {set.setNumber}: {set.reps} reps @ {set.weight} lbs
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {mealPlan && (
           <div className="bg-white rounded-lg shadow-lg p-6">
             <h2 className="text-2xl font-bold mb-4">🍽️ Meal Plan - {mealPlan.date}</h2>
             
             <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-100 rounded">
               <div>
                 <div className="text-sm text-gray-600">Calories</div>
                 <div className="text-xl font-bold">{mealPlan.totalCalories}</div>
               </div>
               <div>
                 <div className="text-sm text-gray-600">Protein</div>
                 <div className="text-xl font-bold">{mealPlan.totalProtein}g</div>
               </div>
               <div>
                 <div className="text-sm text-gray-600">Carbs</div>
                 <div className="text-xl font-bold">{mealPlan.totalCarbs}g</div>
               </div>
               <div>
                 <div className="text-sm text-gray-600">Fats</div>
                 <div className="text-xl font-bold">{mealPlan.totalFats}g</div>
               </div>
             </div>

             <div className="space-y-4">
               {mealPlan.meals.map((meal) => (
                 <div key={meal.id} className="border rounded-lg p-4">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <div className="font-bold text-lg">{meal.name}</div>
                       <div className="text-sm text-gray-500 uppercase">{meal.mealType}</div>
                     </div>
                     <div className="text-right">
                       <div className="text-lg font-semibold">{meal.calories} cal</div>
                       <div className="text-xs text-gray-600">
                         {meal.protein}p / {meal.carbs}c / {meal.fats}f
                       </div>
                     </div>
                   </div>
                   {meal.ingredients && (
                     <div className="text-sm text-gray-600">
                       🥘 {meal.ingredients.join(', ')}
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
         )}

         <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
           <p className="font-bold mb-2">💡 How to verify:</p>
           <ul className="list-disc list-inside space-y-1">
             <li>Check browser console for detailed logs</li>
             <li>Verify data in IndexedDB (DevTools → Application → IndexedDB)</li>
             <li>Plans should be saved for tomorrow's date</li>
             <li>Exercises should match your training split</li>
             <li>Macros should be close to your targets</li>
           </ul>
         </div>
       </div>
     );
   };
   ```

2. Update `App.tsx` to show the plan generator test:
   ```typescript
   import { PlanGeneratorTest } from './components/common/PlanGeneratorTest';

   function App() {
     return <PlanGeneratorTest />;
   }

   export default App;
   ```

3. Explain the UI:
   - Loading states
   - Error handling display
   - Plan visualization
   - Verification instructions

**What I should see:**
- Button to generate plans
- Loading spinner during generation
- Both plans displayed beautifully
- Data saved in IndexedDB

**Testing instructions:**
1. First, create a test profile using DatabaseTest component
2. Click "Generate Tomorrow's Plans"
3. Wait 10-20 seconds
4. Verify both workout and meal plans appear
5. Check IndexedDB for saved data
6. Check console for token usage
7. Generate again - should get different plans

**IMPORTANT:** Before proceeding, make sure:
- You have a user profile in the database
- Your API key is valid
- Plans are generated successfully
- Data is saved to IndexedDB

**Wait for confirmation before proceeding to Step 14**

---

---

### PHASE 5: USER INTERFACE - MORNING DASHBOARD

#### Step 14: Create Reusable UI Components
**Task:** Build common components used across the app

**Instructions:**
1. Create `src/components/common/Card.tsx`:

   ```typescript
   import React from 'react';

   interface CardProps {
     children: React.ReactNode;
     className?: string;
     onClick?: () => void;
   }

   export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
     return (
       <div
         onClick={onClick}
         className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
       >
         {children}
       </div>
     );
   };
   ```

2. Create `src/components/common/LoadingSpinner.tsx`:

   ```typescript
   import React from 'react';

   interface LoadingSpinnerProps {
     size?: 'sm' | 'md' | 'lg';
     message?: string;
   }

   export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
     size = 'md', 
     message 
   }) => {
     const sizeClasses = {
       sm: 'h-6 w-6',
       md: 'h-12 w-12',
       lg: 'h-16 w-16',
     };

     return (
       <div className="flex flex-col items-center justify-center py-12">
         <div className={`animate-spin rounded-full border-b-2 border-purple-500 ${sizeClasses[size]}`} />
         {message && <p className="mt-4 text-gray-600">{message}</p>}
       </div>
     );
   };
   ```

3. Create `src/components/common/Button.tsx`:

   ```typescript
   import React from 'react';

   interface ButtonProps {
     children: React.ReactNode;
     onClick?: () => void;
     variant?: 'primary' | 'secondary' | 'danger' | 'success';
     size?: 'sm' | 'md' | 'lg';
     disabled?: boolean;
     fullWidth?: boolean;
     type?: 'button' | 'submit';
   }

   export const Button: React.FC<ButtonProps> = ({
     children,
     onClick,
     variant = 'primary',
     size = 'md',
     disabled = false,
     fullWidth = false,
     type = 'button',
   }) => {
     const baseClasses = 'font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
     
     const variantClasses = {
       primary: 'bg-purple-500 text-white hover:bg-purple-600',
       secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
       danger: 'bg-red-500 text-white hover:bg-red-600',
       success: 'bg-green-500 text-white hover:bg-green-600',
     };

     const sizeClasses = {
       sm: 'px-3 py-1.5 text-sm',
       md: 'px-4 py-2',
       lg: 'px-6 py-3 text-lg',
     };

     const widthClass = fullWidth ? 'w-full' : '';

     return (
       <button
         type={type}
         onClick={onClick}
         disabled={disabled}
         className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
       >
         {children}
       </button>
     );
   };
   ```

4. Create `src/components/common/MacroBar.tsx`:

   ```typescript
   import React from 'react';

   interface MacroBarProps {
     protein: number;
     carbs: number;
     fats: number;
     total: number;
   }

   export const MacroBar: React.FC<MacroBarProps> = ({ protein, carbs, fats, total }) => {
     const proteinPercent = (protein * 4 / total) * 100;
     const carbsPercent = (carbs * 4 / total) * 100;
     const fatsPercent = (fats * 9 / total) * 100;

     return (
       <div>
         <div className="flex gap-2 mb-2">
           <div className="flex items-center gap-1">
             <div className="w-3 h-3 bg-blue-500 rounded" />
             <span className="text-sm">{protein}g protein</span>
           </div>
           <div className="flex items-center gap-1">
             <div className="w-3 h-3 bg-green-500 rounded" />
             <span className="text-sm">{carbs}g carbs</span>
           </div>
           <div className="flex items-center gap-1">
             <div className="w-3 h-3 bg-yellow-500 rounded" />
             <span className="text-sm">{fats}g fats</span>
           </div>
         </div>
         <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
           <div 
             className="bg-blue-500" 
             style={{ width: `${proteinPercent}%` }}
           />
           <div 
             className="bg-green-500" 
             style={{ width: `${carbsPercent}%` }}
           />
           <div 
             className="bg-yellow-500" 
             style={{ width: `${fatsPercent}%` }}
           />
         </div>
       </div>
     );
   };
   ```

5. Create `src/components/common/index.ts` to export all common components:

   ```typescript
   export { Card } from './Card';
   export { LoadingSpinner } from './LoadingSpinner';
   export { Button } from './Button';
   export { MacroBar } from './MacroBar';
   ```

6. Explain:
   - Component composition pattern
   - Props interface design
   - Tailwind utility classes
   - Conditional styling
   - Reusability benefits

**What I should see:** All components export without errors

**Wait for confirmation before proceeding to Step 15**

---

#### Step 15: Create Workout Display Components
**Task:** Build components to display workout plans

**Instructions:**
1. Create `src/components/workout/WorkoutCard.tsx`:

   ```typescript
   import React from 'react';
   import { WorkoutPlan } from '../../types';
   import { Card } from '../common';
   import { Dumbbell, Clock } from 'lucide-react';

   interface WorkoutCardProps {
     workout: WorkoutPlan;
     onStartWorkout: () => void;
   }

   export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStartWorkout }) => {
     return (
       <Card>
         <div className="flex items-start justify-between mb-4">
           <div>
             <h2 className="text-2xl font-bold text-gray-800 mb-1">
               💪 Today's Workout
             </h2>
             <h3 className="text-xl font-semibold text-purple-600">
               {workout.dayName}
             </h3>
           </div>
           <div className="flex items-center gap-2 text-gray-600">
             <Clock size={18} />
             <span>{workout.estimatedDuration} min</span>
           </div>
         </div>

         <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
           <p className="text-sm font-semibold text-gray-700">💡 Coach Insight:</p>
           <p className="text-sm text-gray-600">{workout.aiInsight}</p>
         </div>

         <div className="space-y-2 mb-4">
           {workout.exercises.slice(0, 3).map((exercise, idx) => (
             <div key={exercise.id} className="flex items-center gap-2">
               <Dumbbell size={16} className="text-purple-500" />
               <span className="text-sm text-gray-700">
                 {exercise.exerciseName} - {exercise.sets.length} sets
               </span>
             </div>
           ))}
           {workout.exercises.length > 3 && (
             <p className="text-sm text-gray-500 ml-6">
               + {workout.exercises.length - 3} more exercises
             </p>
           )}
         </div>

         <button
           onClick={onStartWorkout}
           className="w-full bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors"
         >
           Start Workout →
         </button>
       </Card>
     );
   };
   ```

2. Create `src/components/workout/ExerciseList.tsx`:

   ```typescript
   import React from 'react';
   import { WorkoutExercise } from '../../types';

   interface ExerciseListProps {
     exercises: WorkoutExercise[];
   }

   export const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
     return (
       <div className="space-y-4">
         {exercises.map((exercise, idx) => (
           <div key={exercise.id} className="border rounded-lg p-4 bg-white">
             <div className="flex items-start justify-between mb-3">
               <div>
                 <div className="font-bold text-lg text-gray-800">
                   {idx + 1}. {exercise.exerciseName}
                 </div>
                 {exercise.notes && (
                   <p className="text-sm text-gray-600 mt-1">📝 {exercise.notes}</p>
                 )}
               </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
               {exercise.sets.map((set) => (
                 <div
                   key={set.setNumber}
                   className="bg-gray-50 border border-gray-200 p-3 rounded text-center"
                 >
                   <div className="text-xs text-gray-500 mb-1">Set {set.setNumber}</div>
                   <div className="font-semibold">
                     {set.reps} × {set.weight} lbs
                   </div>
                 </div>
               ))}
             </div>
           </div>
         ))}
       </div>
     );
   };
   ```

3. Create `src/components/workout/index.ts`:

   ```typescript
   export { WorkoutCard } from './WorkoutCard';
   export { ExerciseList } from './ExerciseList';
   ```

4. Explain:
   - Icon usage with lucide-react
   - Responsive grid layout
   - Data slicing for preview
   - Props passing pattern

**What I should see:** Components render correctly with sample data

**Wait for confirmation before proceeding to Step 16**

---

#### Step 16: Create Nutrition Display Components
**Task:** Build components to display meal plans

**Instructions:**
1. Create `src/components/nutrition/NutritionCard.tsx`:

   ```typescript
   import React from 'react';
   import { MealPlan } from '../../types';
   import { Card, MacroBar } from '../common';
   import { Apple } from 'lucide-react';

   interface NutritionCardProps {
     mealPlan: MealPlan;
     onViewDetails: () => void;
   }

   export const NutritionCard: React.FC<NutritionCardProps> = ({ mealPlan, onViewDetails }) => {
     return (
       <Card>
         <div className="mb-4">
           <h2 className="text-2xl font-bold text-gray-800 mb-1">
             🍽️ Today's Nutrition
           </h2>
           <p className="text-lg text-gray-600">
             {mealPlan.totalCalories} calories
           </p>
         </div>

         <MacroBar
           protein={mealPlan.totalProtein}
           carbs={mealPlan.totalCarbs}
           fats={mealPlan.totalFats}
           total={mealPlan.totalCalories}
         />

         <div className="mt-4 space-y-2">
           {mealPlan.meals.map((meal) => (
             <div key={meal.id} className="flex items-center justify-between py-2 border-b last:border-0">
               <div className="flex items-center gap-2">
                 <Apple size={16} className="text-green-500" />
                 <div>
                   <div className="font-semibold text-sm text-gray-800">{meal.name}</div>
                   <div className="text-xs text-gray-500 capitalize">{meal.mealType}</div>
                 </div>
               </div>
               <div className="text-sm font-semibold text-gray-600">
                 {meal.calories} cal
               </div>
             </div>
           ))}
         </div>

         <button
           onClick={onViewDetails}
           className="w-full mt-4 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
         >
           View Meal Details →
         </button>
       </Card>
     );
   };
   ```

2. Create `src/components/nutrition/MealList.tsx`:

   ```typescript
   import React from 'react';
   import { Meal } from '../../types';

   interface MealListProps {
     meals: Meal[];
   }

   export const MealList: React.FC<MealListProps> = ({ meals }) => {
     return (
       <div className="space-y-4">
         {meals.map((meal) => (
           <div key={meal.id} className="border rounded-lg p-4 bg-white">
             <div className="flex justify-between items-start mb-3">
               <div>
                 <div className="font-bold text-lg text-gray-800">{meal.name}</div>
                 <div className="text-sm text-gray-500 uppercase tracking-wide">
                   {meal.mealType}
                 </div>
               </div>
               <div className="text-right">
                 <div className="text-xl font-bold text-gray-800">
                   {meal.calories} cal
                 </div>
                 <div className="text-xs text-gray-600">
                   {meal.protein}p / {meal.carbs}c / {meal.fats}f
                 </div>
               </div>
             </div>

             {meal.ingredients && meal.ingredients.length > 0 && (
               <div className="mb-2">
                 <div className="text-sm font-semibold text-gray-700 mb-1">Ingredients:</div>
                 <div className="text-sm text-gray-600">
                   {meal.ingredients.join(', ')}
                 </div>
               </div>
             )}

             {meal.instructions && (
               <div>
                 <div className="text-sm font-semibold text-gray-700 mb-1">Instructions:</div>
                 <div className="text-sm text-gray-600">{meal.instructions}</div>
               </div>
             )}
           </div>
         ))}
       </div>
     );
   };
   ```

3. Create `src/components/nutrition/index.ts`:

   ```typescript
   export { NutritionCard } from './NutritionCard';
   export { MealList } from './MealList';
   ```

4. Explain:
   - MacroBar component integration
   - Conditional rendering
   - Layout composition

**What I should see:** Nutrition components render with sample data

**Wait for confirmation before proceeding to Step 17**

---

#### Step 17: Create the Morning Dashboard Page
**Task:** Build the main morning view that shows today's plan

**Instructions:**
1. Create `src/pages/Dashboard.tsx`:

   ```typescript
   import React, { useState, useEffect } from 'react';
   import { WorkoutCard } from '../components/workout';
   import { NutritionCard } from '../components/nutrition';
   import { LoadingSpinner, Card } from '../components/common';
   import { WorkoutPlan, MealPlan } from '../types';
   import { getWorkoutPlanByDate, getMealPlanByDate, getTodayString } from '../services/database/operations';
   import { format } from 'date-fns';

   export const Dashboard: React.FC = () => {
     const [loading, setLoading] = useState(true);
     const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
     const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
     const [currentDate, setCurrentDate] = useState(new Date());

     useEffect(() => {
       loadTodaysPlans();
     }, []);

     const loadTodaysPlans = async () => {
       setLoading(true);
       try {
         const today = getTodayString();
         const [workout, meals] = await Promise.all([
           getWorkoutPlanByDate(today),
           getMealPlanByDate(today),
         ]);

         setWorkoutPlan(workout || null);
         setMealPlan(meals || null);
       } catch (error) {
         console.error('Error loading plans:', error);
       } finally {
         setLoading(false);
       }
     };

     const handleStartWorkout = () => {
       // Navigate to workout view (we'll implement routing later)
       console.log('Start workout clicked');
     };

     const handleViewMealDetails = () => {
       // Navigate to meal details (we'll implement routing later)
       console.log('View meal details clicked');
     };

     if (loading) {
       return <LoadingSpinner size="lg" message="Loading your daily plan..." />;
     }

     return (
       <div className="min-h-screen bg-gray-50 pb-20">
         {/* Header */}
         <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
           <div className="max-w-4xl mx-auto">
             <h1 className="text-3xl font-bold mb-1">
               {format(currentDate, 'EEEE, MMMM d')}
             </h1>
             <p className="text-purple-200">Your personalized training day</p>
           </div>
         </div>

         <div className="max-w-4xl mx-auto px-4 -mt-4">
           {/* No Plans Available */}
           {!workoutPlan && !mealPlan && (
             <Card className="text-center py-12">
               <div className="text-6xl mb-4">📅</div>
               <h2 className="text-2xl font-bold text-gray-800 mb-2">
                 No plan for today
               </h2>
               <p className="text-gray-600 mb-4">
                 Complete your evening check-in to generate tomorrow's plan
               </p>
             </Card>
           )}

           {/* Plans Available */}
           <div className="space-y-4">
             {workoutPlan && (
               <WorkoutCard 
                 workout={workoutPlan} 
                 onStartWorkout={handleStartWorkout}
               />
             )}

             {mealPlan && (
               <NutritionCard 
                 mealPlan={mealPlan}
                 onViewDetails={handleViewMealDetails}
               />
             )}

             {/* Quick Stats */}
             {(workoutPlan || mealPlan) && (
               <Card>
                 <h3 className="font-bold text-gray-800 mb-3">📊 Today's Summary</h3>
                 <div className="grid grid-cols-2 gap-4">
                   {workoutPlan && (
                     <div className="text-center p-3 bg-purple-50 rounded">
                       <div className="text-2xl font-bold text-purple-600">
                         {workoutPlan.exercises.length}
                       </div>
                       <div className="text-sm text-gray-600">Exercises</div>
                     </div>
                   )}
                   {mealPlan && (
                     <div className="text-center p-3 bg-green-50 rounded">
                       <div className="text-2xl font-bold text-green-600">
                         {mealPlan.meals.length}
                       </div>
                       <div className="text-sm text-gray-600">Meals</div>
                     </div>
                   )}
                 </div>
               </Card>
             )}
           </div>
         </div>
       </div>
     );
   };
   ```

2. Create `src/pages/index.ts`:

   ```typescript
   export { Dashboard } from './Dashboard';
   ```

3. Update `src/App.tsx` to show the dashboard:

   ```typescript
   import { Dashboard } from './pages';

   function App() {
     return <Dashboard />;
   }

   export default App;
   ```

4. Explain:
   - useEffect for data loading
   - Async state management
   - Conditional rendering patterns
   - date-fns for formatting
   - Layout composition

**What I should see:**
- Dashboard loads and shows "No plan for today" (if no data)
- OR shows workout and meal cards (if you generated test plans earlier)
- Gradient header with date
- Responsive layout

**Testing instructions:**
1. If you have test plans in the database, they should appear
2. If not, use the PlanGeneratorTest to create today's plans
3. Refresh the page - plans should persist

**Wait for confirmation before proceeding to Step 18**

---

### PHASE 6: CHECK-IN FLOW

#### Step 18: Create Check-In Form Components
**Task:** Build the evening check-in interface

**Instructions:**
1. Create `src/components/checkin/RatingSelector.tsx`:

   ```typescript
   import React from 'react';
   import { Star } from 'lucide-react';

   interface RatingSelectorProps {
     label: string;
     value: number;
     onChange: (value: number) => void;
     max?: number;
   }

   export const RatingSelector: React.FC<RatingSelectorProps> = ({ 
     label, 
     value, 
     onChange,
     max = 5 
   }) => {
     return (
       <div>
         <label className="block text-sm font-semibold text-gray-700 mb-2">
           {label}
         </label>
         <div className="flex gap-2">
           {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
             <button
               key={rating}
               type="button"
               onClick={() => onChange(rating)}
               className={`p-2 rounded-lg transition-colors ${
                 value >= rating
                   ? 'bg-yellow-400 text-white'
                   : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
               }`}
             >
               <Star size={24} fill={value >= rating ? 'currentColor' : 'none'} />
             </button>
           ))}
         </div>
       </div>
     );
   };
   ```

2. Create `src/components/checkin/OptionSelector.tsx`:

   ```typescript
   import React from 'react';

   interface Option {
     value: string;
     label: string;
     emoji?: string;
   }

   interface OptionSelectorProps {
     label: string;
     value: string;
     onChange: (value: string) => void;
     options: Option[];
   }

   export const OptionSelector: React.FC<OptionSelectorProps> = ({
     label,
     value,
     onChange,
     options,
   }) => {
     return (
       <div>
         <label className="block text-sm font-semibold text-gray-700 mb-2">
           {label}
         </label>
         <div className="grid grid-cols-3 gap-2">
           {options.map((option) => (
             <button
               key={option.value}
               type="button"
               onClick={() => onChange(option.value)}
               className={`p-3 rounded-lg border-2 transition-colors ${
                 value === option.value
                   ? 'border-purple-500 bg-purple-50 text-purple-700'
                   : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
               }`}
             >
               {option.emoji && <div className="text-2xl mb-1">{option.emoji}</div>}
               <div className="text-sm font-medium">{option.label}</div>
             </button>
           ))}
         </div>
       </div>
     );
   };
   ```

3. Create `src/components/checkin/index.ts`:

   ```typescript
   export { RatingSelector } from './RatingSelector';
   export { OptionSelector } from './OptionSelector';
   ```

4. Explain:
   - Controlled component pattern
   - Type-safe props
   - Visual feedback for selections
   - Reusable form components

**What I should see:** Components render without errors

**Wait for confirmation before proceeding to Step 19**

---

#### Step 19: Create Check-In Page
**Task:** Build the complete evening check-in flow

**Instructions:**
1. Create `src/pages/CheckIn.tsx`:

   ```typescript
   import React, { useState } from 'react';
   import { Card, Button, LoadingSpinner } from '../components/common';
   import { RatingSelector, OptionSelector } from '../components/checkin';
   import { saveDailyCheckIn, getTodayString } from '../services/database/operations';
   import { generateTomorrowsPlans } from '../services/ai/planGenerator';
   import { DailyCheckIn } from '../types';

   export const CheckIn: React.FC = () => {
     const [formData, setFormData] = useState({
       workoutCompleted: 'completed' as 'completed' | 'partial' | 'skipped',
       nutritionStatus: 'on_track' as 'on_track' | 'under' | 'over',
       weight: '',
       sleepQuality: 3 as 1 | 2 | 3 | 4 | 5,
       sorenessLevel: 'medium' as 'low' | 'medium' | 'high',
       energyLevel: 3 as 1 | 2 | 3 | 4 | 5,
       notes: '',
     });

     const [isSubmitting, setIsSubmitting] = useState(false);
     const [isGenerating, setIsGenerating] = useState(false);
     const [success, setSuccess] = useState(false);

     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setIsSubmitting(true);

       try {
         // Save check-in
         const checkInData: Omit<DailyCheckIn, 'id' | 'submittedAt'> = {
           date: getTodayString(),
           workoutCompleted: formData.workoutCompleted,
           nutritionStatus: formData.nutritionStatus,
           actualCalories: undefined, // Could add calorie tracking
           weight: formData.weight ? parseFloat(formData.weight) : undefined,
           sleepQuality: formData.sleepQuality,
           sorenessLevel: formData.sorenessLevel,
           energyLevel: formData.energyLevel,
           notes: formData.notes || undefined,
         };

         await saveDailyCheckIn(checkInData);
         console.log('✅ Check-in saved');

         // Generate tomorrow's plans
         setIsGenerating(true);
         await generateTomorrowsPlans();
         console.log('✅ Tomorrow\'s plans generated');

         setSuccess(true);
       } catch (error) {
         console.error('Error submitting check-in:', error);
         alert('Failed to save check-in. Please try again.');
       } finally {
         setIsSubmitting(false);
         setIsGenerating(false);
       }
     };

     if (success) {
       return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
           <Card className="max-w-md text-center">
             <div className="text-6xl mb-4">✅</div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">
               Check-in Complete!
             </h2>
             <p className="text-gray-600 mb-4">
               Your progress has been saved and tomorrow's plan is ready.
             </p>
             <Button variant="primary" fullWidth onClick={() => window.location.reload()}>
               View Tomorrow's Plan
             </Button>
           </Card>
         </div>
       );
     }

     if (isGenerating) {
       return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
           <LoadingSpinner 
             size="lg" 
             message="Generating tomorrow's personalized plan..." 
           />
         </div>
       );
     }

     return (
       <div className="min-h-screen bg-gray-50 py-8">
         <div className="max-w-2xl mx-auto px-4">
           <div className="mb-6">
             <h1 className="text-3xl font-bold text-gray-800 mb-2">
               Daily Check-In
             </h1>
             <p className="text-gray-600">
               Share how today went to personalize tomorrow's plan
             </p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             {/* Workout Status */}
             <Card>
               <OptionSelector
                 label="How was your workout?"
                 value={formData.workoutCompleted}
                 onChange={(value) => setFormData({ ...formData, workoutCompleted: value as any })}
                 options={[
                   { value: 'completed', label: 'Completed', emoji: '💪' },
                   { value: 'partial', label: 'Partial', emoji: '👍' },
                   { value: 'skipped', label: 'Skipped', emoji: '😴' },
                 ]}
               />
             </Card>

             {/* Nutrition Status */}
             <Card>
               <OptionSelector
                 label="How was your nutrition?"
                 value={formData.nutritionStatus}
                 onChange={(value) => setFormData({ ...formData, nutritionStatus: value as any })}
                 options={[
                   { value: 'on_track', label: 'On Track', emoji: '🎯' },
                   { value: 'under', label: 'Under', emoji: '📉' },
                   { value: 'over', label: 'Over', emoji: '📈' },
                 ]}
               />
             </Card>

             {/* Weight */}
             <Card>
               <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Weight (optional)
               </label>
               <input
                 type="number"
                 step="0.1"
                 value={formData.weight}
                 onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                 placeholder="180.5"
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
               />
             </Card>

             {/* Sleep Quality */}
             <Card>
               <RatingSelector
                 label="Sleep Quality"
                 value={formData.sleepQuality}
                 onChange={(value) => setFormData({ ...formData, sleepQuality: value as any })}
               />
             </Card>

             {/* Soreness Level */}
             <Card>
               <OptionSelector
                 label="Soreness Level"
                 value={formData.sorenessLevel}
                 onChange={(value) => setFormData({ ...formData, sorenessLevel: value as any })}
                 options={[
                   { value: 'low', label: 'Low', emoji: '😊' },
                   { value: 'medium', label: 'Medium', emoji: '😐' },
                   { value: 'high', label: 'High', emoji: '😣' },
                 ]}
               />
             </Card>

             {/* Energy Level */}
             <Card>
               <RatingSelector
                 label="Energy Level"
                 value={formData.energyLevel}
                 onChange={(value) => setFormData({ ...formData, energyLevel: value as any })}
               />
             </Card>

             {/* Notes */}
             <Card>
               <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Notes (optional)
               </label>
               <textarea
                 value={formData.notes}
                 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                 placeholder="How did you feel today? Any observations?"
                 rows={4}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
               />
             </Card>

             {/* Submit Button */}
             <Button
               type="submit"
               variant="primary"
               size="lg"
               fullWidth
               disabled={isSubmitting}
             >
               {isSubmitting ? 'Saving...' : 'Submit & Generate Tomorrow\'s Plan'}
             </Button>
           </form>
         </div>
       </div>
     );
   };
   ```

2. Update `src/pages/index.ts`:

   ```typescript
   export { Dashboard } from './Dashboard';
   export { CheckIn } from './CheckIn';
   ```

3. Temporarily test by updating `src/App.tsx`:

   ```typescript
   import { CheckIn } from './pages';

   function App() {
     return <CheckIn />;
   }

   export default App;
   ```

4. Explain:
   - Form state management
   - Multi-step flow (save → generate → success)
   - Loading states
   - Success screen
   - Form validation (implicit through types)

**What I should see:**
- Complete check-in form
- All inputs work properly
- Submit saves data and generates plans
- Success screen appears

**Testing instructions:**
1. Fill out the form
2. Click submit
3. Wait for generation (10-20 seconds)
4. See success screen
5. Check IndexedDB - should have new check-in and tomorrow's plans
6. Reload app with Dashboard - tomorrow's date should have plans

**Wait for confirmation before proceeding to Step 20**

---

### PHASE 7: ROUTING & NAVIGATION

#### Step 20: Set Up React Router
**Task:** Add navigation between pages

**Instructions:**
1. Create `src/components/layout/BottomNav.tsx`:

   ```typescript
   import React from 'react';
   import { Home, Dumbbell, Apple, ClipboardCheck } from 'lucide-react';
   import { useNavigate, useLocation } from 'react-router-dom';

   export const BottomNav: React.FC = () => {
     const navigate = useNavigate();
     const location = useLocation();

     const navItems = [
       { path: '/', icon: Home, label: 'Home' },
       { path: '/workout', icon: Dumbbell, label: 'Workout' },
       { path: '/nutrition', icon: Apple, label: 'Nutrition' },
       { path: '/checkin', icon: ClipboardCheck, label: 'Check-In' },
     ];

     return (
       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
         <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
           {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = location.pathname === item.path;

             return (
               <button
                 key={item.path}
                 onClick={() => navigate(item.path)}
                 className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                   isActive ? 'text-purple-600' : 'text-gray-500'
                 }`}
               >
                 <Icon size={24} />
                 <span className="text-xs mt-1">{item.label}</span>
               </button>
             );
           })}
         </div>
       </nav>
     );
   };
   ```

2. Create `src/pages/WorkoutView.tsx`:

   ```typescript
   import React, { useState, useEffect } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { ExerciseList } from '../components/workout';
   import { LoadingSpinner, Button } from '../components/common';
   import { WorkoutPlan } from '../types';
   import { getWorkoutPlanByDate, markWorkoutComplete, getTodayString } from '../services/database/operations';
   import { ArrowLeft } from 'lucide-react';

   export const WorkoutView: React.FC = () => {
     const navigate = useNavigate();
     const [loading, setLoading] = useState(true);
     const [workout, setWorkout] = useState<WorkoutPlan | null>(null);

     useEffect(() => {
       loadWorkout();
     }, []);

     const loadWorkout = async () => {
       setLoading(true);
       try {
         const today = getTodayString();
         const plan = await getWorkoutPlanByDate(today);
         setWorkout(plan || null);
       } catch (error) {
         console.error('Error loading workout:', error);
       } finally {
         setLoading(false);
       }
     };

     const handleCompleteWorkout = async () => {
       if (!workout) return;

       try {
         await markWorkoutComplete(workout.id);
         alert('Workout marked as complete! 💪');
         navigate('/');
       } catch (error) {
         console.error('Error completing workout:', error);
       }
     };

     if (loading) {
       return <LoadingSpinner size="lg" message="Loading workout..." />;
     }

     if (!workout) {
       return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
           <div className="text-center">
             <div className="text-6xl mb-4">🏋️</div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">
               No workout today
             </h2>
             <Button onClick={() => navigate('/')}>Go Back</Button>
           </div>
         </div>
       );
     }

     return (
       <div className="min-h-screen bg-gray-50 pb-24">
         {/* Header */}
         <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
           <button
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-purple-200 hover:text-white mb-4"
           >
             <ArrowLeft size={20} />
             Back
           </button>
           <h1 className="text-3xl font-bold mb-1">{workout.dayName}</h1>
           <p className="text-purple-200">
             {workout.exercises.length} exercises • {workout.estimatedDuration} min
           </p>
         </div>

         <div className="max-w-4xl mx-auto px-4 py-6">
           {/* Coach Insight */}
           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
             <p className="text-sm font-semibold text-gray-700">💡 Coach Insight:</p>
             <p className="text-sm text-gray-600">{workout.aiInsight}</p>
           </div>

           {/* Exercise List */}
           <ExerciseList exercises={workout.exercises} />

           {/* Complete Button */}
           {!workout.completed && (
             <div className="mt-6">
               <Button
                 variant="success"
                 size="lg"
                 fullWidth
                 onClick={handleCompleteWorkout}
               >
                 Mark Workout as Complete
               </Button>
             </div>
           )}

           {workout.completed && (
             <div className="mt-6 text-center p-4 bg-green-50 border border-green-200 rounded-lg">
               <p className="text-green-800 font-semibold">✅ Workout Completed!</p>
             </div>
           )}
         </div>
       </div>
     );
   };
   ```

3. Create `src/pages/NutritionView.tsx`:

   ```typescript
   import React, { useState, useEffect } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { MealList } from '../components/nutrition';
   import { LoadingSpinner, Button, MacroBar } from '../components/common';
   import { MealPlan } from '../types';
   import { getMealPlanByDate, getTodayString } from '../services/database/operations';
   import { ArrowLeft } from 'lucide-react';

   export const NutritionView: React.FC = () => {
     const navigate = useNavigate();
     const [loading, setLoading] = useState(true);
     const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

     useEffect(() => {
       loadMealPlan();
     }, []);

     const loadMealPlan = async () => {
       setLoading(true);
       try {
         const today = getTodayString();
         const plan = await getMealPlanByDate(today);
         setMealPlan(plan || null);
       } catch (error) {
         console.error('Error loading meal plan:', error);
       } finally {
         setLoading(false);
       }
     };

     if (loading) {
       return <LoadingSpinner size="lg" message="Loading meal plan..." />;
     }

     if (!mealPlan) {
       return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
           <div className="text-center">
             <div className="text-6xl mb-4">🍽️</div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">
               No meal plan today
             </h2>
             <Button onClick={() => navigate('/')}>Go Back</Button>
           </div>
         </div>
       );
     }

     return (
       <div className="min-h-screen bg-gray-50 pb-24">
         {/* Header */}
         <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
           <button
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-green-200 hover:text-white mb-4"
           >
             <ArrowLeft size={20} />
             Back
           </button>
           <h1 className="text-3xl font-bold mb-1">Today's Meals</h1>
           <p className="text-green-200">
             {mealPlan.totalCalories} calories • {mealPlan.meals.length} meals
           </p>
         </div>

         <div className="max-w-4xl mx-auto px-4 py-6">
           {/* Macro Summary */}
           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
             <h3 className="font-bold text-gray-800 mb-4">Daily Macros</h3>
             <MacroBar
               protein={mealPlan.totalProtein}
               carbs={mealPlan.totalCarbs}
               fats={mealPlan.totalFats}
               total={mealPlan.totalCalories}
             />
             <div className="grid grid-cols-3 gap-4 mt-4">
               <div className="text-center">
                 <div className="text-2xl font-bold text-blue-600">
                   {mealPlan.totalProtein}g
                 </div>
                 <div className="text-sm text-gray-600">Protein</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-green-600">
                   {mealPlan.totalCarbs}g
                 </div>
                 <div className="text-sm text-gray-600">Carbs</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-yellow-600">
                   {mealPlan.totalFats}g
                 </div>
                 <div className="text-sm text-gray-600">Fats</div>
               </div>
             </div>
           </div>

           {/* Meal List */}
           <MealList meals={mealPlan.meals} />
         </div>
       </div>
     );
   };
   ```

4. Update `src/pages/index.ts`:

   ```typescript
   export { Dashboard } from './Dashboard';
   export { CheckIn } from './CheckIn';
   export { WorkoutView } from './WorkoutView';
   export { NutritionView } from './NutritionView';
   ```

5. Create `src/App.tsx` with routing:

   ```typescript
   import React from 'react';
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import { Dashboard, CheckIn, WorkoutView, NutritionView } from './pages';
   import { BottomNav } from './components/layout/BottomNav';

   function App() {
     return (
       <BrowserRouter>
         <div className="app">
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/workout" element={<WorkoutView />} />
             <Route path="/nutrition" element={<NutritionView />} />
             <Route path="/checkin" element={<CheckIn />} />
           </Routes>
           <BottomNav />
         </div>
       </BrowserRouter>
     );
   }

   export default App;
   ```

6. Update `src/pages/Dashboard.tsx` to use navigation:

   ```typescript
   // Add this import at the top
   import { useNavigate } from 'react-router-dom';

   // Inside the component, add:
   const navigate = useNavigate();

   // Update the handlers:
   const handleStartWorkout = () => {
     navigate('/workout');
   };

   const handleViewMealDetails = () => {
     navigate('/nutrition');
   };
   ```

7. Explain:
   - React Router setup
   - Navigation hooks (useNavigate, useLocation)
   - Route configuration
   - Bottom navigation pattern
   - Deep linking support

**What I should see:**
- Bottom navigation bar appears
- Can navigate between all pages
- URL changes as you navigate
- Back button works

**Testing instructions:**
1. Click each nav item - should navigate properly
2. Browser back/forward buttons should work
3. Refresh on any page - should stay on that page
4. Try the card buttons on dashboard - should navigate

**Wait for confirmation before proceeding to Step 21**

---

### PHASE 8: PWA FEATURES

#### Step 21: Configure PWA Manifest
**Task:** Make the app installable on mobile devices

**Instructions:**
1. Create `public/manifest.json`:

   ```json
   {
     "name": "AI Fitness Coach",
     "short_name": "FitCoach",
     "description": "Your personal AI trainer and nutritionist",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#9333ea",
     "orientation": "portrait",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "any maskable"
       }
     ],
     "categories": ["health", "fitness", "lifestyle"],
     "screenshots": []
   }
   ```

2. Update `index.html` to include manifest:

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <link rel="icon" type="image/svg+xml" href="/vite.svg" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
       
       <!-- PWA Meta Tags -->
       <meta name="theme-color" content="#9333ea" />
       <meta name="description" content="Your personal AI trainer and nutritionist" />
       <link rel="manifest" href="/manifest.json" />
       <link rel="apple-touch-icon" href="/icon-192.png" />
       
       <!-- iOS Specific -->
       <meta name="apple-mobile-web-app-capable" content="yes" />
       <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
       <meta name="apple-mobile-web-app-title" content="FitCoach" />
       
       <title>AI Fitness Coach</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.tsx"></script>
     </body>
   </html>
   ```

3. Create simple placeholder icons (we'll improve these later):
   - Create `public/icon-192.png` - a 192x192 purple circle with "FC"
   - Create `public/icon-512.png` - a 512x512 purple circle with "FC"

   You can use an online tool or create them programmatically later.

4. Update `vite.config.ts` to handle PWA:

   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     server: {
       host: true, // Allows access from mobile on same network
     },
   })
   ```

5. Explain:
   - Manifest fields and their purposes
   - Icon requirements (192x192 minimum, 512x512 recommended)
   - viewport-fit=cover for notched displays
   - iOS-specific meta tags
   - Standalone display mode

**What I should see:**
- Manifest loads without errors (check DevTools → Application → Manifest)
- Theme color appears in browser chrome
- App can be "installed" on mobile (Add to Home Screen)

**Testing on mobile:**
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from phone: `http://YOUR_IP:5173`
3. Look for "Add to Home Screen" option
4. Install and open - should feel like native app

**Wait for confirmation before proceeding to Step 22**

---

#### Step 22: Add Service Worker for Offline Support
**Task:** Enable offline functionality

**Instructions:**
1. Install Vite PWA plugin:

   ```bash
   npm install vite-plugin-pwa -D
   ```

2. Update `vite.config.ts`:

   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { VitePWA } from 'vite-plugin-pwa'

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         includeAssets: ['icon-192.png', 'icon-512.png'],
         manifest: {
           name: 'AI Fitness Coach',
           short_name: 'FitCoach',
           description: 'Your personal AI trainer and nutritionist',
           theme_color: '#9333ea',
           background_color: '#ffffff',
           display: 'standalone',
           icons: [
             {
               src: 'icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: 'icon-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         },
         workbox: {
           globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
           runtimeCaching: [
             {
               urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
               handler: 'NetworkFirst',
               options: {
                 cacheName: 'anthropic-api-cache',
                 networkTimeoutSeconds: 10,
                 expiration: {
                   maxEntries: 50,
                   maxAgeSeconds: 60 * 60 * 24 // 24 hours
                 }
               }
             }
           ]
         }
       })
     ],
     server: {
       host: true,
     },
   })
   ```

3. Update `src/main.tsx` to register service worker:

   ```typescript
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App from './App.tsx'
   import './index.css'

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
   )

   // Register service worker
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/sw.js').then(
         (registration) => {
           console.log('SW registered:', registration);
         },
         (error) => {
           console.log('SW registration failed:', error);
         }
       );
     });
   }
   ```

4. Create `src/components/common/OfflineIndicator.tsx`:

   ```typescript
   import React, { useState, useEffect } from 'react';
   import { WifiOff } from 'lucide-react';

   export const OfflineIndicator: React.FC = () => {
     const [isOnline, setIsOnline] = useState(navigator.onLine);

     useEffect(() => {
       const handleOnline = () => setIsOnline(true);
       const handleOffline = () => setIsOnline(false);

       window.addEventListener('online', handleOnline);
       window.addEventListener('offline', handleOffline);

       return () => {
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('offline', handleOffline);
       };
     }, []);

     if (isOnline) return null;

     return (
       <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white py-2 px-4 text-center z-50">
         <div className="flex items-center justify-center gap-2">
           <WifiOff size={20} />
           <span className="font-semibold">You're offline</span>
         </div>
       </div>
     );
   };
   ```

5. Add OfflineIndicator to `src/App.tsx`:

   ```typescript
   import { OfflineIndicator } from './components/common/OfflineIndicator';

   function App() {
     return (
       <BrowserRouter>
         <OfflineIndicator />
         <div className="app">
           {/* ... rest of routes */}
         </div>
       </BrowserRouter>
     );
   }
   ```

6. Explain:
   - Service Worker lifecycle
   - Cache strategies (NetworkFirst vs CacheFirst)
   - Workbox configuration
   - Offline detection
   - Auto-update mechanism

**What I should see:**
- Service worker registers (check DevTools → Application → Service Workers)
- App works offline for static content
- Offline indicator appears when disconnected

**Testing offline mode:**
1. Open DevTools → Network tab
2. Check "Offline" throttling
3. Refresh page - should still work (cached)
4. Try navigating - should work
5. Try generating plans - will fail (needs API), but UI stays functional

**Wait for confirmation before proceeding to Step 23**

---

### PHASE 9: ONBOARDING & SETUP

#### Step 23: Create User Profile Setup
**Task:** Build initial onboarding flow for new users

**Instructions:**
1. Create `src/pages/Onboarding.tsx`:

   ```typescript
   import React, { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { Card, Button } from '../components/common';
   import { createUserProfile } from '../services/database/operations';
   import { UserProfile } from '../types';

   export const Onboarding: React.FC = () => {
     const navigate = useNavigate();
     const [step, setStep] = useState(1);
     const [formData, setFormData] = useState({
       name: '',
       age: '',
       weight: '',
       height: '',
       gender: 'male' as 'male' | 'female' | 'other',
       experienceLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
       trainingDays: 4,
       trainingSplit: 'ppl' as 'ppl' | 'upper_lower' | 'full_body',
       goal: 'muscle_gain' as 'muscle_gain' | 'strength' | 'maintenance',
       targetCalories: 3000,
       protein: 180,
       carbs: 350,
       fats: 80,
     });

     const handleSubmit = async () => {
       try {
         await createUserProfile({
           name: formData.name,
           age: parseInt(formData.age),
           weight: parseFloat(formData.weight),
           height: parseFloat(formData.height),
           gender: formData.gender,
           experienceLevel: formData.experienceLevel,
           trainingDays: formData.trainingDays,
           trainingSplit: formData.trainingSplit,
           goal: formData.goal,
           targetCalories: formData.targetCalories,
           macros: {
             protein: formData.protein,
             carbs: formData.carbs,
             fats: formData.fats,
           },
           equipment: ['barbell', 'dumbbells', 'bench', 'rack'],
           injuries: [],
           foodPreferences: {
             allergies: [],
             dislikedFoods: [],
           },
         });

         navigate('/');
       } catch (error) {
         console.error('Error creating profile:', error);
         alert('Failed to create profile');
       }
     };

     return (
       <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-800 py-8 px-4">
         <div className="max-w-2xl mx-auto">
           <div className="text-center text-white mb-8">
             <h1 className="text-4xl font-bold mb-2">Welcome to FitCoach</h1>
             <p className="text-purple-200">Let's personalize your fitness journey</p>
           </div>

           <Card>
             {step === 1 && (
               <div>
                 <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-semibold mb-2">Name</label>
                     <input
                       type="text"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className="w-full px-4 py-2 border rounded-lg"
                       placeholder="Your name"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2">Age</label>
                       <input
                         type="number"
                         value={formData.age}
                         onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                         className="w-full px-4 py-2 border rounded-lg"
                         placeholder="25"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2">Gender</label>
                       <select
                         value={formData.gender}
                         onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                         className="w-full px-4 py-2 border rounded-lg"
                       >
                         <option value="male">Male</option>
                         <option value="female">Female</option>
                         <option value="other">Other</option>
                       </select>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2">Weight (lbs)</label>
                       <input
                         type="number"
                         value={formData.weight}
                         onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                         className="w-full px-4 py-2 border rounded-lg"
                         placeholder="180"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2">Height (inches)</label>
                       <input
                         type="number"
                         value={formData.height}
                         onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                         className="w-full px-4 py-2 border rounded-lg"
                         placeholder="72"
                       />
                     </div>
                   </div>
                 </div>

                 <Button
                   onClick={() => setStep(2)}
                   variant="primary"
                   size="lg"
                   fullWidth
                   className="mt-6"
                 >
                   Continue
                 </Button>
               </div>
             )}

             {step === 2 && (
               <div>
                 <h2 className="text-2xl font-bold mb-6">Training Preferences</h2>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-semibold mb-2">Experience Level</label>
                     <div className="grid grid-cols-3 gap-2">
                       {['beginner', 'intermediate', 'advanced'].map((level) => (
                         <button
                           key={level}
                           type="button"
                           onClick={() => setFormData({ ...formData, experienceLevel: level as any })}
                           className={`p-3 rounded-lg border-2 ${
                             formData.experienceLevel === level
                               ? 'border-purple-500 bg-purple-50'
                               : 'border-gray-200'
                           }`}
                         >
                           {level.charAt(0).toUpperCase() + level.slice(1)}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2">Training Split</label>
                     <div className="space-y-2">
                       {[
                         { value: 'ppl', label: 'Push/Pull/Legs (6 days)' },
                         { value: 'upper_lower', label: 'Upper/Lower (4 days)' },
                         { value: 'full_body', label: 'Full Body (3 days)' },
                       ].map((split) => (
                         <button
                           key={split.value}
                           type="button"
                           onClick={() => setFormData({ ...formData, trainingSplit: split.value as any })}
                           className={`w-full p-3 rounded-lg border-2 text-left ${
                             formData.trainingSplit === split.value
                               ? 'border-purple-500 bg-purple-50'
                               : 'border-gray-200'
                           }`}
                         >
                           {split.label}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2">Primary Goal</label>
                     <div className="grid grid-cols-3 gap-2">
                       {[
                         { value: 'muscle_gain', label: 'Build Muscle' },
                         { value: 'strength', label: 'Get Stronger' },
                         { value: 'maintenance', label: 'Maintain' },
                       ].map((goal) => (
                         <button
                           key={goal.value}
                           type="button"
                           onClick={() => setFormData({ ...formData, goal: goal.value as any })}
                           className={`p-3 rounded-lg border-2 ${
                             formData.goal === goal.value
                               ? 'border-purple-500 bg-purple-50'
                               : 'border-gray-200'
                           }`}
                         >
                           {goal.label}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="flex gap-3 mt-6">
                   <Button onClick={() => setStep(1)} variant="secondary" fullWidth>
                     Back
                   </Button>
                   <Button onClick={handleSubmit} variant="primary" fullWidth>
                     Complete Setup
                   </Button>
                 </div>
               </div>
             )}
           </Card>
         </div>
       </div>
     );
   };
   ```

2. Update `src/pages/index.ts`:

   ```typescript
   export { Dashboard } from './Dashboard';
   export { CheckIn } from './CheckIn';
   export { WorkoutView } from './WorkoutView';
   export { NutritionView } from './NutritionView';
   export { Onboarding } from './Onboarding';
   ```

3. Create `src/App.tsx` with profile check:

   ```typescript
   import React, { useEffect, useState } from 'react';
   import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
   import { Dashboard, CheckIn, WorkoutView, NutritionView, Onboarding } from './pages';
   import { BottomNav } from './components/layout/BottomNav';
   import { OfflineIndicator } from './components/common/OfflineIndicator';
   import { LoadingSpinner } from './components/common';
   import { getUserProfile } from './services/database/operations';

   function App() {
     const [hasProfile, setHasProfile] = useState<boolean | null>(null);

     useEffect(() => {
       checkProfile();
     }, []);

     const checkProfile = async () => {
       const profile = await getUserProfile();
       setHasProfile(!!profile);
     };

     if (hasProfile === null) {
       return <LoadingSpinner size="lg" message="Loading..." />;
     }

     if (!hasProfile) {
       return (
         <BrowserRouter>
           <Routes>
             <Route path="/onboarding" element={<Onboarding />} />
             <Route path="*" element={<Navigate to="/onboarding" replace />} />
           </Routes>
         </BrowserRouter>
       );
     }

     return (
       <BrowserRouter>
         <OfflineIndicator />
         <div className="app">
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/workout" element={<WorkoutView />} />
             <Route path="/nutrition" element={<NutritionView />} />
             <Route path="/checkin" element={<CheckIn />} />
           </Routes>
           <BottomNav />
         </div>
       </BrowserRouter>
     );
   }

   export default App;
   ```

4. Explain:
   - Multi-step form pattern
   - Profile check on app load
   - Conditional routing
   - Form state management
   - Validation (basic)

**What I should see:**
- New users see onboarding flow
- Existing users go straight to dashboard
- Can complete onboarding in 2 steps
- Profile saves to database

**Testing:**
1. Clear IndexedDB (Application → IndexedDB → Delete)
2. Reload - should see onboarding
3. Complete form
4. Should redirect to dashboard
5. Reload - should stay on dashboard (profile exists)

**Wait for confirmation before proceeding to Step 24**

---

### PHASE 10: POLISH & DEPLOYMENT

#### Step 24: Add Loading States and Error Handling
**Task:** Improve UX with better feedback

**Instructions:**
1. Create `src/hooks/useAsync.ts`:

   ```typescript
   import { useState, useEffect } from 'react';

   interface AsyncState<T> {
     data: T | null;
     loading: boolean;
     error: Error | null;
   }

   export function useAsync<T>(
     asyncFunction: () => Promise<T>,
     dependencies: any[] = []
   ): AsyncState<T> {
     const [state, setState] = useState<AsyncState<T>>({
       data: null,
       loading: true,
       error: null,
     });

     useEffect(() => {
       let isMounted = true;

       setState({ data: null, loading: true, error: null });

       asyncFunction()
         .then((data) => {
           if (isMounted) {
             setState({ data, loading: false, error: null });
           }
         })
         .catch((error) => {
           if (isMounted) {
             setState({ data: null, loading: false, error });
           }
         });

       return () => {
         isMounted = false;
       };
     }, dependencies);

     return state;
   }
   ```

2. Create `src/components/common/ErrorBoundary.tsx`:

   ```typescript
   import React, { Component, ErrorInfo, ReactNode } from 'react';
   import { Button } from './Button';

   interface Props {
     children: ReactNode;
   }

   interface State {
     hasError: boolean;
     error: Error | null;
   }

   export class ErrorBoundary extends Component<Props, State> {
     public state: State = {
       hasError: false,
       error: null,
     };

     public static getDerivedStateFromError(error: Error): State {
       return { hasError: true, error };
     }

     public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
       console.error('Uncaught error:', error, errorInfo);
     }

     public render() {
       if (this.state.hasError) {
         return (
           <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
             <div className="max-w-md text-center">
               <div className="text-6xl mb-4">⚠️</div>
               <h2 className="text-2xl font-bold text-gray-800 mb-2">
                 Something went wrong
               </h2>
               <p className="text-gray-600 mb-4">
                 {this.state.error?.message || 'An unexpected error occurred'}
               </p>
               <Button
                 onClick={() => window.location.reload()}
                 variant="primary"
               >
                 Reload App
               </Button>
             </div>
           </div>
         );
       }

       return this.props.children;
     }
   }
   ```

3. Update `src/main.tsx` to wrap app in ErrorBoundary:

   ```typescript
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App from './App.tsx'
   import './index.css'
   import { ErrorBoundary } from './components/common/ErrorBoundary'

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <ErrorBoundary>
         <App />
       </ErrorBoundary>
     </React.StrictMode>,
   )

   // Service worker registration...
   ```

4. Create `src/utils/errorHandling.ts`:

   ```typescript
   export const handleApiError = (error: unknown): string => {
     if (error instanceof Error) {
       if (error.message.includes('API')) {
         return 'Unable to connect to AI service. Please check your internet connection.';
       }
       return error.message;
     }
     return 'An unexpected error occurred';
   };

   export const logError = (context: string, error: unknown) => {
     console.error(`[${context}]`, error);
     // In production, you might send this to an error tracking service
   };
   ```

5. Add toast notifications - create `src/components/common/Toast.tsx`:

   ```typescript
   import React, { useEffect } from 'react';
   import { CheckCircle, XCircle, Info } from 'lucide-react';

   interface ToastProps {
     message: string;
     type: 'success' | 'error' | 'info';
     onClose: () => void;
     duration?: number;
   }

   export const Toast: React.FC<ToastProps> = ({ 
     message, 
     type, 
     onClose, 
     duration = 3000 
   }) => {
     useEffect(() => {
       const timer = setTimeout(onClose, duration);
       return () => clearTimeout(timer);
     }, [duration, onClose]);

     const icons = {
       success: <CheckCircle className="text-green-500" />,
       error: <XCircle className="text-red-500" />,
       info: <Info className="text-blue-500" />,
     };

     const backgrounds = {
       success: 'bg-green-50 border-green-200',
       error: 'bg-red-50 border-red-200',
       info: 'bg-blue-50 border-blue-200',
     };

     return (
       <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border-2 shadow-lg ${backgrounds[type]} animate-slide-in`}>
         <div className="flex items-start gap-3">
           {icons[type]}
           <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             ×
           </button>
         </div>
       </div>
     );
   };
   ```

6. Add animation to `src/index.css`:

   ```css
   @keyframes slide-in {
     from {
       transform: translateX(100%);
       opacity: 0;
     }
     to {
       transform: translateX(0);
       opacity: 1;
     }
   }

   .animate-slide-in {
     animation: slide-in 0.3s ease-out;
   }
   ```

7. Explain:
   - Custom hooks for async operations
   - Error boundaries
   - Error handling patterns
   - Toast notifications
   - User feedback mechanisms

**What I should see:**
- Errors caught gracefully
- Better loading states
- User-friendly error messages

**Wait for confirmation before proceeding to Step 25**

---

#### Step 25: Build and Deploy
**Task:** Prepare for production deployment

**Instructions:**
1. Update `package.json` with build scripts:

   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview",
       "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
     }
   }
   ```

2. Create production build:

   ```bash
   npm run build
   ```

3. Test production build locally:

   ```bash
   npm run preview
   ```

4. Create deployment guide in `DEPLOYMENT.md`:

   ```markdown
   # Deployment Guide

   ## Prerequisites
   - Node.js 18+
   - Your Anthropic API key

   ## Local Development
   ```bash
   npm install
   cp .env.example .env.local
   # Add your API key to .env.local
   npm run dev
   ```

   ## Production Build
   ```bash
   npm run build
   ```

   ## Deployment Options

   ### Option 1: Vercel (Recommended for personal use)
   1. Install Vercel CLI: `npm i -g vercel`
   2. Run: `vercel`
   3. Add environment variable: `VITE_ANTHROPIC_API_KEY`
   4. Deploy: `vercel --prod`

   ### Option 2: Netlify
   1. Build command: `npm run build`
   2. Publish directory: `dist`
   3. Add environment variable in Netlify dashboard

   ### Option 3: Static Hosting (GitHub Pages, etc.)
   1. Build the app: `npm run build`
   2. Upload `dist` folder contents
   3. Note: API key will be exposed (okay for personal use only)

   ## Security Note
   ⚠️ This app includes the Anthropic API key in the client-side code.
   This is acceptable for personal use but NOT for production apps with multiple users.

   For production:
   - Create a backend API proxy
   - Store API key server-side
   - Add authentication
   ```

5. Update `README.md`:

   ```markdown
   # AI Fitness Coach

   A progressive web app that acts as your personal AI trainer and nutritionist.

   ## Features
   - 🏋️ Personalized daily workout plans
   - 🍽️ Custom meal plans with macro tracking
   - 📊 Progress tracking and analytics
   - 🤖 AI-powered adaptive training
   - 📱 Works offline as a PWA
   - 💾 All data stored locally

   ## Tech Stack
   - React + TypeScript
   - Tailwind CSS
   - IndexedDB (Dexie)
   - Anthropic Claude API
   - Vite + PWA

   ## Getting Started
   See [DEPLOYMENT.md](./DEPLOYMENT.md)

   ## Development
   ```bash
   npm install
   npm run dev
   ```

   ## Building
   ```bash
   npm run build
   npm run preview
   ```

   ## Project Structure
   ```
   src/
   ├── components/     # React components
   ├── pages/          # Page components
   ├── services/       # API and database services
   ├── types/          # TypeScript definitions
   ├── hooks/          # Custom React hooks
   └── utils/          # Utility functions
   ```

   ## License
   Personal use only
   ```

6. Create `.gitignore` if not exists:

   ```
   # Dependencies
   node_modules/

   # Build output
   dist/
   dist-ssr/

   # Environment variables
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local

   # Editor
   .vscode/
   .idea/

   # OS
   .DS_Store
   Thumbs.db

   # Logs
   *.log
   npm-debug.log*
   ```

7. Final checklist before deployment:

   ```markdown
   ## Pre-Deployment Checklist

   - [ ] All features working locally
   - [ ] No console errors
   - [ ] API key configured
   - [ ] Build succeeds without errors
   - [ ] PWA installable
   - [ ] Works offline (static content)
   - [ ] Responsive on mobile
   - [ ] Icons and manifest configured
   - [ ] Error handling in place
   - [ ] Loading states implemented
   ```

8. Explain:
   - Build process
   - Environment variables in production
   - Deployment options
   - Security considerations
   - Testing production build

**What I should see:**
- Successful production build in `dist/` folder
- Preview works identically to dev
- All features functional in production build

**Testing:**
1. Run `npm run build` - should complete without errors
2. Run `npm run preview` - open the localhost URL
3. Test all features in preview mode
4. Test on mobile (using local IP)
5. Verify PWA install works
6. Test offline functionality

---

## 🎉 PROJECT COMPLETE!

You've built a fully functional AI-powered fitness coach PWA with:

✅ Modern React + TypeScript architecture
✅ Local-first data storage with IndexedDB
✅ AI plan generation using Claude API
✅ Progressive Web App capabilities
✅ Offline support
✅ Mobile-responsive design
✅ Complete user flow (onboarding → daily plans → check-ins)

### Next Steps (Optional Enhancements)

**Phase 11 - Advanced Features:**
- Voice logging during workouts
- Progress photos with AI analysis
- Export data to CSV/PDF
- Workout timer with rest periods
- Exercise video library
- Meal photo logging with AI calorie estimation

**Phase 12 - Backend (if scaling beyond personal use):**
- Node.js API proxy for Claude
- User authentication
- Cloud data sync
- Share plans with friends
- Community features

**Phase 13 - Analytics:**
- Weekly/monthly progress reports
- Volume tracking charts
- Strength progression graphs
- Body composition trends
- AI insights on progress

### What You've Learned

- Modern React development with TypeScript
- Progressive Web App architecture
- Local-first data patterns
- AI API integration
- Service workers and offline functionality
- Component-driven design
- State management
- Routing and navigation
- Form handling and validation
- Error handling and UX polish

### Deployment

Follow the `DEPLOYMENT.md` guide to deploy your app to:
- Vercel (easiest, free tier available)
- Netlify (great for static sites)
- Your own hosting (any static host works)

**Congratulations on building your AI Fitness Coach! 💪🎉**
