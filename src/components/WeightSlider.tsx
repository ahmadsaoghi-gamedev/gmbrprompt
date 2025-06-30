import React from 'react';
import { motion } from 'framer-motion';

interface WeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const WeightSlider: React.FC<WeightSliderProps> = ({
  label,
  value,
  onChange,
  min = 0.5,
  max = 2.0,
  step = 0.1
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm text-purple-400 font-medium">{value.toFixed(1)}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${percentage}%, rgb(51, 65, 85) ${percentage}%, rgb(51, 65, 85) 100%)`
          }}
        />
        <motion.div
          className="absolute top-1/2 w-4 h-4 bg-purple-500 rounded-full transform -translate-y-1/2 pointer-events-none shadow-lg"
          style={{ left: `calc(${percentage}% - 8px)` }}
          whileHover={{ scale: 1.2 }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};