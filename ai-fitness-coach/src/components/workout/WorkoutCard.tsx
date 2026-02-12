import React, { useState } from 'react';
import { WorkoutPlan } from '../../types/index';
import { Clock, CheckCircle2, ChevronDown, ChevronUp, Dumbbell, Lightbulb } from 'lucide-react';

interface WorkoutCardProps {
  workout: WorkoutPlan;
  onStartWorkout?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStartWorkout }) => {
  const [expanded, setExpanded] = useState(false);
  const displayExercises = expanded ? workout.exercises : workout.exercises.slice(0, 4);
  const hasMore = workout.exercises.length > 4;

  return (
    <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <Dumbbell className="text-white" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{workout.dayName}</h3>
              <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><Clock size={11} /> {workout.estimatedDuration} min</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>{workout.exercises.length} exercises</span>
              </div>
            </div>
          </div>
          {workout.completed && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} /> Done
            </span>
          )}
        </div>
      </div>

      {/* AI Insight */}
      {workout.aiInsight && (
        <div className="mx-5 mb-4 bg-amber-50/60 border border-amber-100 rounded-xl p-3.5 flex items-start gap-2.5">
          <Lightbulb size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800/80 leading-relaxed">{workout.aiInsight}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="border-t border-slate-50">
        {displayExercises.map((exercise, index) => (
          <div key={exercise.id} className="flex items-center gap-3.5 px-5 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-400">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-700">{exercise.exerciseName}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {exercise.sets.length} sets &times; {exercise.sets[0]?.reps} reps
                {exercise.sets[0]?.weight > 0 && (
                  <span className="text-slate-300"> &middot; {exercise.sets[0]?.weight} kg</span>
                )}
              </div>
            </div>
            {exercise.notes && (
              <span className="text-[11px] text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-md max-w-[100px] truncate" title={exercise.notes}>
                {exercise.notes}
              </span>
            )}
          </div>
        ))}

        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-semibold py-3 transition-colors bg-slate-50/30"
          >
            {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> {workout.exercises.length - 4} more exercises</>}
          </button>
        )}
      </div>

      {/* Start CTA */}
      {onStartWorkout && !workout.completed && (
        <div className="p-5 pt-3">
          <button
            onClick={onStartWorkout}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-200/40 transition-all active:scale-[0.98]"
          >
            Start Workout
          </button>
        </div>
      )}
    </div>
  );
};
