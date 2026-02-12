import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { MealPlanCard } from '../components/nutrition/MealPlanCard';
import { GroceryList } from '../components/nutrition/GroceryList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { getUserProfile, getWorkoutPlanByDate, getMealPlanByDate, getTodayString, getTomorrowString } from '../services/database/index';
import { generateTodaysPlans, generateTomorrowsPlans } from '../services/ai/planGenerator';
import { WorkoutPlan, MealPlan, UserProfile } from '../types/index';
import { Sparkles, Dumbbell, UtensilsCrossed, ClipboardCheck, RefreshCw, ChevronDown, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingTarget, setGeneratingTarget] = useState<'today' | 'tomorrow' | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [tomorrowWorkout, setTomorrowWorkout] = useState<WorkoutPlan | null>(null);
  const [tomorrowMealPlan, setTomorrowMealPlan] = useState<MealPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
  const [tomorrowOpen, setTomorrowOpen] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const userProfile = await getUserProfile();
      if (!userProfile) { navigate('/onboarding'); return; }
      setProfile(userProfile);
      const today = getTodayString();
      const tomorrow = getTomorrowString();
      const [todayWorkout, todayMeals, tmrwWorkout, tmrwMeals] = await Promise.all([
        getWorkoutPlanByDate(today), getMealPlanByDate(today),
        getWorkoutPlanByDate(tomorrow), getMealPlanByDate(tomorrow),
      ]);
      setWorkout(todayWorkout || null);
      setMealPlan(todayMeals || null);
      setTomorrowWorkout(tmrwWorkout || null);
      setTomorrowMealPlan(tmrwMeals || null);
    } catch (error) { console.error('Error loading data:', error); }
    finally { setLoading(false); }
  };

  const handleGenerateTodaysPlans = async () => {
    setGenerating(true); setGeneratingTarget('today');
    try {
      const { workoutPlan, mealPlan: gm } = await generateTodaysPlans();
      setWorkout(workoutPlan); setMealPlan(gm);
    } catch { alert('Failed to generate plans. Check your API key.'); }
    finally { setGenerating(false); setGeneratingTarget(null); }
  };

  const handleGenerateTomorrowsPlans = async () => {
    setGenerating(true); setGeneratingTarget('tomorrow');
    try {
      const { workoutPlan, mealPlan: gm } = await generateTomorrowsPlans();
      setTomorrowWorkout(workoutPlan); setTomorrowMealPlan(gm);
    } catch { alert('Failed to generate plans. Check your API key.'); }
    finally { setGenerating(false); setGeneratingTarget(null); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    );
  }

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  };

  const hasTodayPlans = workout || mealPlan;
  const hasTomorrowPlans = tomorrowWorkout || tomorrowMealPlan;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30">
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              <h1 className="text-xl font-bold text-slate-800 mt-0.5">
                {getGreeting()}, {profile?.name} 👋
              </h1>
            </div>
            <button
              onClick={() => navigate('/checkin')}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full px-4 py-2 transition-colors"
            >
              <ClipboardCheck size={14} />
              Check-in
            </button>
          </div>

          {/* Quick stats row */}
          {hasTodayPlans && (
            <div className="flex gap-3 mt-4">
              <div className="flex-1 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl px-4 py-3 text-white">
                <div className="text-lg font-bold">{workout?.exercises.length || 0}</div>
                <div className="text-[11px] text-white/70 font-medium">Exercises</div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl px-4 py-3 text-white">
                <div className="text-lg font-bold">{mealPlan?.totalCalories || 0}</div>
                <div className="text-[11px] text-white/70 font-medium">Calories</div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl px-4 py-3 text-white">
                <div className="text-lg font-bold">{mealPlan?.totalProtein || 0}g</div>
                <div className="text-[11px] text-white/70 font-medium">Protein</div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-8 pb-12">
        {/* ── Empty state ── */}
        {!hasTodayPlans && (
          <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl mb-5">
              <Sparkles className="text-indigo-500" size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to crush today?</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
              Generate a personalized workout and meal plan tailored to your goals.
            </p>
            <Button onClick={handleGenerateTodaysPlans} disabled={generating} icon={<Sparkles size={15} />}>
              {generating && generatingTarget === 'today' ? 'Generating...' : "Generate Today's Plans"}
            </Button>
            {generating && generatingTarget === 'today' && (
              <div className="mt-6"><LoadingSpinner message="AI is crafting your plans..." /></div>
            )}
          </section>
        )}

        {/* ── Today's plans ── */}
        {hasTodayPlans && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Plan</h2>
              <button
                onClick={handleGenerateTodaysPlans}
                disabled={generating}
                className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-40"
              >
                <RefreshCw size={12} className={generating && generatingTarget === 'today' ? 'animate-spin' : ''} />
                Regenerate
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
              <button
                onClick={() => setActiveTab('workout')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'workout'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Dumbbell size={14} />
                Workout
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'nutrition'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <UtensilsCrossed size={14} />
                Nutrition
              </button>
            </div>

            {activeTab === 'workout' && workout && <WorkoutCard workout={workout} />}
            {activeTab === 'nutrition' && mealPlan && <MealPlanCard mealPlan={mealPlan} />}

            {generating && generatingTarget === 'today' && (
              <div className="mt-4"><LoadingSpinner size="sm" message="Regenerating..." /></div>
            )}
          </section>
        )}

        {/* ── Tomorrow (collapsible) ── */}
        <section>
          <button
            onClick={() => setTomorrowOpen(!tomorrowOpen)}
            className="w-full flex items-center justify-between group mb-4"
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-300" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tomorrow</h2>
              {hasTomorrowPlans && (
                <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-300 group-hover:text-slate-400 transition-transform duration-200 ${tomorrowOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {tomorrowOpen && (
            <div className="space-y-4 animate-in slide-in-from-top-2">
              {!hasTomorrowPlans ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <Calendar className="mx-auto text-slate-300 mb-3" size={24} />
                  <p className="text-sm text-slate-400 mb-4">Plan ahead for tomorrow</p>
                  <Button
                    onClick={handleGenerateTomorrowsPlans}
                    disabled={generating}
                    variant="secondary"
                    size="sm"
                    icon={<Sparkles size={13} />}
                  >
                    {generating && generatingTarget === 'tomorrow' ? 'Generating...' : 'Generate Plans'}
                  </Button>
                  {generating && generatingTarget === 'tomorrow' && (
                    <div className="mt-4"><LoadingSpinner size="sm" message="Creating plans..." /></div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {tomorrowWorkout && <WorkoutCard workout={tomorrowWorkout} />}
                  {tomorrowMealPlan && <MealPlanCard mealPlan={tomorrowMealPlan} />}
                  {tomorrowMealPlan && <GroceryList mealPlan={tomorrowMealPlan} label="Grocery" />}
                  <div className="text-center pt-1">
                    <button
                      onClick={handleGenerateTomorrowsPlans}
                      disabled={generating}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-40"
                    >
                      <RefreshCw size={11} className={generating && generatingTarget === 'tomorrow' ? 'animate-spin' : ''} />
                      {generating && generatingTarget === 'tomorrow' ? 'Regenerating...' : 'Regenerate'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
