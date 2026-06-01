import React from 'react';
import { PlayerData } from '../../lib/types';

interface StepGuardianProps {
  form: PlayerData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

const StepGuardian: React.FC<StepGuardianProps> = ({ form, onChange, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight border-l-4 border-red-700 pl-3 text-white">
        Guardian Details
      </h2>
      
      <div>
        <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Parent/Guardian Name</label>
        <input 
          type="text" 
          name="parentName"
          value={form.parentName}
          onChange={onChange}
          placeholder="Mallie Robinson"
          className={`bg-slate-900 border ${errors.parentName ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Phone Number</label>
        <input 
          type="tel" 
          name="parentPhone"
          value={form.parentPhone}
          onChange={onChange}
          placeholder="(555) 000-0000"
          className={`bg-slate-900 border ${errors.parentPhone ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Email Address</label>
        <input 
          type="email" 
          name="parentEmail"
          value={form.parentEmail}
          onChange={onChange}
          placeholder="guardian@example.com"
          className={`bg-slate-900 border ${errors.parentEmail ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
        />
      </div>
    </div>
  );
};

export default StepGuardian;
