import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserProfile } from '../services/database/index';
import { Button } from '../components/common/Button';
import { UserProfile } from '../types/index';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

const steps = ['Personal', 'Training', 'Nutrition'];

const inputClass =
  'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-300';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOnboarded } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    weight: 180,
    height: 70,
    gender: 'male' as 'male' | 'female' | 'other',
    experienceLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    trainingDays: 4,
    trainingSplit: 'ppl' as 'ppl' | 'upper_lower' | 'full_body',
    goal: 'muscle_gain' as 'muscle_gain' | 'strength' | 'maintenance',
    targetCalories: 3000,
    protein: 180,
    carbs: 350,
    fats: 90,
    equipment: [] as string[],
    injuries: [] as string[],
    vegetarian: false,
    vegan: false,
    allergies: [] as string[],
    dislikedFoods: [] as string[],
  });

  const handleSubmit = async () => {
    try {
      const profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        gender: formData.gender,
        experienceLevel: formData.experienceLevel,
        trainingDays: formData.trainingDays,
        trainingSplit: formData.trainingSplit,
        goal: formData.goal,
        targetCalories: formData.targetCalories,
        macros: { protein: formData.protein, carbs: formData.carbs, fats: formData.fats },
        equipment: formData.equipment.length > 0 ? formData.equipment : ['barbell', 'dumbbells', 'bench', 'cables'],
        injuries: formData.injuries,
        foodPreferences: {
          vegetarian: formData.vegetarian,
          vegan: formData.vegan,
          allergies: formData.allergies,
          dislikedFoods: formData.dislikedFoods,
        },
      };
      await createUserProfile(profile);
      setOnboarded();
      navigate('/');
    } catch {
      alert('Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40 p-6 sm:p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Sparkles className="text-white" size={16} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">AI Fitness Coach</h1>
            <p className="text-xs text-slate-400 mt-0.5">Set up your profile</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-6">
          {steps.map((s, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <React.Fragment key={num}>
                {i > 0 && <div className={`flex-1 h-px transition-colors ${isDone ? 'bg-indigo-400' : 'bg-slate-200'}`} />}
                <button
                  onClick={() => isDone && setStep(num)}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200/50'
                      : isDone
                      ? 'text-indigo-600 cursor-pointer hover:bg-indigo-50'
                      : 'text-slate-300'
                  }`}
                >
                  {isDone && <Check size={10} />}
                  {s}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Your name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Age</label>
                <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className={inputClass}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: parseInt(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <Button fullWidth onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Experience Level</label>
              <select value={formData.experienceLevel} onChange={e => setFormData({ ...formData, experienceLevel: e.target.value as any })} className={inputClass}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Goal</label>
              <select value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value as any })} className={inputClass}>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="strength">Strength</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Training Split</label>
              <select value={formData.trainingSplit} onChange={e => setFormData({ ...formData, trainingSplit: e.target.value as any })} className={inputClass}>
                <option value="ppl">Push / Pull / Legs</option>
                <option value="upper_lower">Upper / Lower</option>
                <option value="full_body">Full Body</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Days per week</label>
              <input type="number" min="1" max="7" value={formData.trainingDays} onChange={e => setFormData({ ...formData, trainingDays: parseInt(e.target.value) })} className={inputClass} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft size={14} />}>Back</Button>
              <Button fullWidth onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Target Calories</label>
              <input type="number" value={formData.targetCalories} onChange={e => setFormData({ ...formData, targetCalories: parseInt(e.target.value) })} className={inputClass} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Protein (g)</label>
                <input type="number" value={formData.protein} onChange={e => setFormData({ ...formData, protein: parseInt(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Carbs (g)</label>
                <input type="number" value={formData.carbs} onChange={e => setFormData({ ...formData, carbs: parseInt(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Fats (g)</label>
                <input type="number" value={formData.fats} onChange={e => setFormData({ ...formData, fats: parseInt(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" onClick={() => setStep(2)} icon={<ArrowLeft size={14} />}>Back</Button>
              <Button fullWidth onClick={handleSubmit}>Complete Setup</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
