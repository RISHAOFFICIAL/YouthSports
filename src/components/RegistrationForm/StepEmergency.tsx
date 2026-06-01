import React from 'react';
import { PlayerData } from '../../lib/types';

interface StepEmergencyProps {
  form: PlayerData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const StepEmergency: React.FC<StepEmergencyProps> = ({ form, onChange, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight border-l-4 border-red-700 pl-3 text-white">
        Emergency & Payment
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Emergency Contact</label>
          <input 
            type="text" 
            name="emergencyName"
            value={form.emergencyName}
            onChange={onChange}
            className={`bg-slate-900 border ${errors.emergencyName ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Emergency Phone</label>
          <input 
            type="tel" 
            name="emergencyPhone"
            value={form.emergencyPhone}
            onChange={onChange}
            className={`bg-slate-900 border ${errors.emergencyPhone ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Payment Amount ($)</label>
        <input 
          type="text" 
          name="paymentAmount"
          value={form.paymentAmount}
          onChange={onChange}
          placeholder="150.00"
          className="bg-slate-900 border border-slate-800 text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Medical Notes / Allergies</label>
        <textarea 
          name="medicalNotes"
          value={form.medicalNotes}
          onChange={onChange}
          rows={3}
          placeholder="Any allergies or special requirements..."
          className="bg-slate-900 border border-slate-800 text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors resize-none"
        />
      </div>
    </div>
  );
};

export default StepEmergency;
