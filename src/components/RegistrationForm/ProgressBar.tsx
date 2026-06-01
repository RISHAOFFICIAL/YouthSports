import React from 'react';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  const steps = [
    { id: 1, label: 'Player' },
    { id: 2, label: 'Guardian' },
    { id: 3, label: 'Final' },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
        <span>{steps.find(s => s.id === step)?.label || 'Registration'}</span>
        <span>Step {step} of {totalSteps}</span>
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-700 transition-all duration-300" 
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
