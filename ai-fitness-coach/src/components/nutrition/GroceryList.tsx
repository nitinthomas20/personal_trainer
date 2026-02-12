import React, { useState, useMemo } from 'react';
import { MealPlan } from '../../types/index';
import { Check, ChevronDown, ShoppingCart } from 'lucide-react';

interface GroceryListProps {
  mealPlan: MealPlan;
  label?: string;
}

export const GroceryList: React.FC<GroceryListProps> = ({ mealPlan, label = 'Grocery' }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);

  const ingredients = useMemo(() => {
    const seen = new Map<string, string>();
    for (const meal of mealPlan.meals) {
      if (meal.ingredients) {
        for (const ing of meal.ingredients) {
          const key = ing.toLowerCase().trim();
          if (!seen.has(key)) seen.set(key, ing.trim());
        }
      }
    }
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }, [mealPlan]);

  const ingredientMeals = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const meal of mealPlan.meals) {
      if (meal.ingredients) {
        for (const ing of meal.ingredients) {
          const key = ing.toLowerCase().trim();
          if (!map.has(key)) map.set(key, []);
          const arr = map.get(key)!;
          if (!arr.includes(meal.mealType)) arr.push(meal.mealType);
        }
      }
    }
    return map;
  }, [mealPlan]);

  if (ingredients.length === 0) return null;

  const toggleItem = (item: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const checkedCount = checkedItems.size;
  const total = ingredients.length;
  const pct = Math.round((checkedCount / total) * 100);

  const mealColors: Record<string, string> = {
    breakfast: 'bg-amber-100 text-amber-600',
    lunch: 'bg-orange-100 text-orange-600',
    dinner: 'bg-indigo-100 text-indigo-600',
    snack: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
          <ShoppingCart className="text-white" size={16} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-700">{label} List</h3>
          <p className="text-xs text-slate-400 mt-0.5">{checkedCount}/{total} items &middot; {pct}%</p>
        </div>
        {/* Progress bar */}
        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <ChevronDown size={14} className={`text-slate-300 transition-transform duration-200 ml-1 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-3">
          <div className="space-y-0.5">
            {ingredients.map((item) => {
              const isChecked = checkedItems.has(item);
              const meals = ingredientMeals.get(item.toLowerCase().trim()) || [];
              return (
                <label key={item} className="flex items-center gap-3 py-2 cursor-pointer group rounded-lg hover:bg-slate-50 px-2 -mx-2 transition-colors">
                  <button
                    onClick={() => toggleItem(item)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      isChecked ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200' : 'border-slate-200 group-hover:border-emerald-300'
                    }`}
                  >
                    {isChecked && <Check size={11} className="text-white" />}
                  </button>
                  <span className={`flex-1 text-sm transition-all ${isChecked ? 'text-slate-300 line-through' : 'text-slate-600'}`}>
                    {item}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    {meals.map(mt => (
                      <span key={mt} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${mealColors[mt] || 'bg-slate-100 text-slate-400'}`}>
                        {mt}
                      </span>
                    ))}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
