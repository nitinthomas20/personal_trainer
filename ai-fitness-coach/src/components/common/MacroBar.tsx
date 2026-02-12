import React from 'react';

interface MacroBarProps {
  current: number;
  target: number;
  label: string;
  color: string;
  unit?: string;
}

export const MacroBar: React.FC<MacroBarProps> = ({ current, target, label, color, unit = 'g' }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-gray-500 tabular-nums">
          {current}{unit} / {target}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
