import React, { useState } from 'react';
import { MealPlan, Meal } from '../../types/index';
import { UtensilsCrossed, Coffee, Sun, Moon, Cookie, ChevronDown } from 'lucide-react';

interface MealPlanCardProps {
  mealPlan: MealPlan;
}

const mealIcon: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  breakfast: { icon: <Coffee size={14} />, color: 'text-amber-500', bg: 'bg-amber-50' },
  lunch:     { icon: <Sun size={14} />,    color: 'text-orange-500', bg: 'bg-orange-50' },
  dinner:    { icon: <Moon size={14} />,   color: 'text-indigo-500', bg: 'bg-indigo-50' },
  snack:     { icon: <Cookie size={14} />, color: 'text-pink-500',   bg: 'bg-pink-50' },
};

const MealItem: React.FC<{ meal: Meal }> = ({ meal }) => {
  const [open, setOpen] = useState(false);
  const cfg = mealIcon[meal.mealType] || mealIcon.snack;

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50/50 transition-colors" onClick={() => setOpen(!open)}>
        <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-700">{meal.name}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 capitalize">{meal.mealType}</div>
        </div>
        <div className="text-right shrink-0 mr-1">
          <div className="text-sm font-bold text-slate-700">{meal.calories}</div>
          <div className="text-[10px] text-slate-300 font-medium">cal</div>
        </div>
        <ChevronDown size={14} className={`text-slate-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-4 pt-1 ml-11">
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-500">{meal.protein}g protein</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-500">{meal.carbs}g carbs</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-500">{meal.fats}g fat</span>
          </div>

          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Ingredients</div>
              <div className="flex flex-wrap gap-1">
                {meal.ingredients.map((ing, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{ing}</span>
                ))}
              </div>
            </div>
          )}

          {meal.instructions && (
            <div className="mt-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Instructions</div>
              <p className="text-xs text-slate-500 leading-relaxed">{meal.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <UtensilsCrossed className="text-white" size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Meal Plan</h3>
        </div>

        {/* Macro summary */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold text-violet-600">{mealPlan.totalCalories}</div>
            <div className="text-[10px] text-violet-400 font-semibold">Calories</div>
          </div>
          <div className="bg-rose-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold text-rose-500">{mealPlan.totalProtein}g</div>
            <div className="text-[10px] text-rose-400 font-semibold">Protein</div>
          </div>
          <div className="bg-sky-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold text-sky-500">{mealPlan.totalCarbs}g</div>
            <div className="text-[10px] text-sky-400 font-semibold">Carbs</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold text-amber-500">{mealPlan.totalFats}g</div>
            <div className="text-[10px] text-amber-400 font-semibold">Fats</div>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="border-t border-slate-100">
        {mealPlan.meals.map(meal => (
          <MealItem key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
};
