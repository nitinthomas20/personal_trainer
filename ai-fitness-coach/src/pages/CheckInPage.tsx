import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveDailyCheckIn, getTodayString, getWorkoutPlanByDate, updateActualWeights } from '../services/database/index';
import { Button } from '../components/common/Button';
import { DailyCheckIn, WorkoutPlan } from '../types/index';
import { ArrowLeft, ClipboardCheck, Dumbbell } from 'lucide-react';

const inputClass =
  'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-300';

const Pill: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
      selected
        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200/50'
        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-500 border border-slate-100'
    }`}
  >
    {label}
  </button>
);

const RatingRow: React.FC<{ value: number; onChange: (v: number) => void; labels: string[] }> = ({ value, onChange, labels }) => (
  <div className="flex gap-1.5">
    {[1, 2, 3, 4, 5].map(v => {
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-green-500'];
      const shadowColors = ['shadow-red-200', 'shadow-orange-200', 'shadow-amber-200', 'shadow-emerald-200', 'shadow-green-200'];
      return (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 flex flex-col items-center py-2.5 rounded-xl text-xs transition-all ${
            value === v
              ? `${colors[v - 1]} text-white shadow-md ${shadowColors[v - 1]}`
              : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
          }`}
        >
          <span className="font-semibold">{v}</span>
          <span className="text-[10px] mt-0.5 opacity-80">{labels[v - 1]}</span>
        </button>
      );
    })}
  </div>
);

export const CheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const [todayWorkout, setTodayWorkout] = useState<WorkoutPlan | null>(null);
  const [actualWeights, setActualWeights] = useState<Record<string, Record<number, { weight: number; reps: number }>>>({});
  const [formData, setFormData] = useState({
    workoutCompleted: 'completed' as 'completed' | 'partial' | 'skipped',
    nutritionStatus: 'on_track' as 'on_track' | 'under' | 'over',
    actualCalories: 0,
    weight: 0,
    sleepQuality: 3 as 1 | 2 | 3 | 4 | 5,
    sorenessLevel: 'medium' as 'low' | 'medium' | 'high',
    energyLevel: 3 as 1 | 2 | 3 | 4 | 5,
    notes: '',
  });

  // Load today's workout to show exercises for weight entry
  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const workout = await getWorkoutPlanByDate(getTodayString());
        if (workout) {
          setTodayWorkout(workout);
          // Pre-fill with suggested weights
          const initial: Record<string, Record<number, { weight: number; reps: number }>> = {};
          workout.exercises.forEach((ex) => {
            initial[ex.id] = {};
            ex.sets.forEach((set) => {
              initial[ex.id][set.setNumber] = {
                weight: set.actualWeight ?? set.weight,
                reps: set.actualReps ?? set.reps,
              };
            });
          });
          setActualWeights(initial);
        }
      } catch (err) {
        console.error('Failed to load workout:', err);
      }
    };
    loadWorkout();
  }, []);

  const updateWeight = (exerciseId: string, setNumber: number, field: 'weight' | 'reps', value: number) => {
    setActualWeights((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setNumber]: {
          ...prev[exerciseId]?.[setNumber],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save actual weights to workout if available
      if (todayWorkout && formData.workoutCompleted !== 'skipped') {
        const exerciseUpdates = todayWorkout.exercises.map((ex, exerciseIndex) => ({
          exerciseIndex,
          sets: ex.sets.map((set) => ({
            setNumber: set.setNumber,
            actualWeight: actualWeights[ex.id]?.[set.setNumber]?.weight ?? set.weight,
            actualReps: actualWeights[ex.id]?.[set.setNumber]?.reps ?? set.reps,
          })),
        }));
        await updateActualWeights(todayWorkout.id, exerciseUpdates);
      }

      const checkIn: Omit<DailyCheckIn, 'id' | 'submittedAt'> = {
        date: getTodayString(),
        workoutCompleted: formData.workoutCompleted,
        nutritionStatus: formData.nutritionStatus,
        actualCalories: formData.actualCalories || undefined,
        weight: formData.weight || undefined,
        sleepQuality: formData.sleepQuality,
        sorenessLevel: formData.sorenessLevel,
        energyLevel: formData.energyLevel,
        notes: formData.notes || undefined,
      };
      await saveDailyCheckIn(checkIn);
      alert('Check-in saved!');
      navigate('/');
    } catch {
      alert('Failed to save check-in.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 -ml-1 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft size={18} className="text-slate-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-slate-800">Daily Check-in</h1>
            <p className="text-[11px] text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200/50">
            <ClipboardCheck size={14} className="text-white" />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workout */}
          <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
            <label className="block text-xs font-bold text-slate-600 mb-3">Workout</label>
            <div className="flex gap-2">
              <Pill label="Completed" selected={formData.workoutCompleted === 'completed'} onClick={() => setFormData({ ...formData, workoutCompleted: 'completed' })} />
              <Pill label="Partial" selected={formData.workoutCompleted === 'partial'} onClick={() => setFormData({ ...formData, workoutCompleted: 'partial' })} />
              <Pill label="Skipped" selected={formData.workoutCompleted === 'skipped'} onClick={() => setFormData({ ...formData, workoutCompleted: 'skipped' })} />
            </div>
          </section>

          {/* Actual Weights Used */}
          {todayWorkout && formData.workoutCompleted !== 'skipped' && (
            <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Dumbbell size={12} className="text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600">Weights Used</label>
                  <p className="text-[10px] text-slate-400">Log what you actually lifted today</p>
                </div>
              </div>

              <div className="space-y-4">
                {todayWorkout.exercises.map((exercise) => (
                  <div key={exercise.id} className="border border-slate-100 rounded-xl p-3.5">
                    <p className="text-xs font-semibold text-slate-700 mb-2.5">{exercise.exerciseName}</p>
                    <div className="space-y-1.5">
                      {/* Header */}
                      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-2 items-center text-[10px] text-slate-400 font-medium px-0.5">
                        <span className="w-5"></span>
                        <span className="text-center">Planned</span>
                        <span className="text-center">Actual kg</span>
                        <span className="text-center">Plan reps</span>
                        <span className="text-center">Actual reps</span>
                      </div>
                      {exercise.sets.map((set) => (
                        <div key={set.setNumber} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-2 items-center">
                          <span className="text-[10px] text-slate-400 font-semibold w-5 text-center">S{set.setNumber}</span>
                          <span className="text-xs text-slate-400 text-center">{set.weight} kg</span>
                          <input
                            type="number"
                            step="0.5"
                            value={actualWeights[exercise.id]?.[set.setNumber]?.weight ?? ''}
                            onChange={(e) => updateWeight(exercise.id, set.setNumber, 'weight', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 text-xs text-center bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none"
                          />
                          <span className="text-xs text-slate-400 text-center">{set.reps}</span>
                          <input
                            type="number"
                            value={actualWeights[exercise.id]?.[set.setNumber]?.reps ?? ''}
                            onChange={(e) => updateWeight(exercise.id, set.setNumber, 'reps', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 text-xs text-center bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Nutrition */}
          <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
            <label className="block text-xs font-bold text-slate-600 mb-3">Nutrition</label>
            <div className="flex gap-2 mb-4">
              <Pill label="On Track" selected={formData.nutritionStatus === 'on_track'} onClick={() => setFormData({ ...formData, nutritionStatus: 'on_track' })} />
              <Pill label="Under" selected={formData.nutritionStatus === 'under'} onClick={() => setFormData({ ...formData, nutritionStatus: 'under' })} />
              <Pill label="Over" selected={formData.nutritionStatus === 'over'} onClick={() => setFormData({ ...formData, nutritionStatus: 'over' })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Actual Calories</label>
                <input type="number" value={formData.actualCalories || ''} onChange={e => setFormData({ ...formData, actualCalories: parseInt(e.target.value) || 0 })} className={inputClass} placeholder="2800" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Weight (kg)</label>
                <input type="number" step="0.1" value={formData.weight || ''} onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })} className={inputClass} placeholder="180" />
              </div>
            </div>
          </section>

          {/* Sleep */}
          <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
            <label className="block text-xs font-bold text-slate-600 mb-3">Sleep Quality</label>
            <RatingRow value={formData.sleepQuality} onChange={v => setFormData({ ...formData, sleepQuality: v as any })} labels={['Awful', 'Poor', 'OK', 'Good', 'Great']} />
          </section>

          {/* Energy */}
          <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
            <label className="block text-xs font-bold text-slate-600 mb-3">Energy Level</label>
            <RatingRow value={formData.energyLevel} onChange={v => setFormData({ ...formData, energyLevel: v as any })} labels={['Empty', 'Low', 'OK', 'Good', 'High']} />
          </section>

          {/* Soreness */}
          <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
            <label className="block text-xs font-bold text-slate-600 mb-3">Soreness</label>
            <div className="flex gap-2">
              <Pill label="Low" selected={formData.sorenessLevel === 'low'} onClick={() => setFormData({ ...formData, sorenessLevel: 'low' })} />
              <Pill label="Medium" selected={formData.sorenessLevel === 'medium'} onClick={() => setFormData({ ...formData, sorenessLevel: 'medium' })} />
              <Pill label="High" selected={formData.sorenessLevel === 'high'} onClick={() => setFormData({ ...formData, sorenessLevel: 'high' })} />
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
            <label className="block text-xs font-bold text-slate-600 mb-3">Notes <span className="text-slate-300 font-normal">(optional)</span></label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Anything notable about today?"
            />
          </section>

          {/* Submit */}
          <div className="flex gap-2 pb-4">
            <Button variant="ghost" onClick={() => navigate('/')} icon={<ArrowLeft size={14} />}>Cancel</Button>
            <Button type="submit" fullWidth icon={<ClipboardCheck size={14} />}>Save Check-in</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
