import React from 'react';
import { PlayerData } from '../../lib/types';

interface StepPlayerProps {
  form: PlayerData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPositionToggle: (pos: string) => void;
  errors: Record<string, string>;
}

const positions = ['Pitcher', 'Catcher', 'Infield', 'Outfield'];
const jerseySizes = ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'];

const StepPlayer: React.FC<StepPlayerProps> = ({ form, onChange, onPositionToggle, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight border-l-4 border-red-700 pl-3 text-white">
        Player Information
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">First Name</label>
          <input 
            type="text" 
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="Jackie" 
            className={`bg-slate-900 border ${errors.firstName ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Robinson" 
            className={`bg-slate-900 border ${errors.lastName ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Date of Birth / Age</label>
          <input 
            type="text" 
            name="age"
            value={form.age}
            onChange={onChange}
            placeholder="12"
            className={`bg-slate-900 border ${errors.age ? 'border-red-500' : 'border-slate-800'} text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors`}
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Throws</label>
          <select 
            name="throws"
            value={form.throws}
            onChange={onChange}
            className="bg-slate-900 border border-slate-800 text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors appearance-none"
          >
            <option value="Right">Right</option>
            <option value="Left">Left</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Jersey Size</label>
          <select 
            name="jerseySize"
            value={form.jerseySize}
            onChange={onChange}
            className="bg-slate-900 border border-slate-800 text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors appearance-none"
          >
            <option value="">Select Size</option>
            {jerseySizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Jersey #</label>
          <input 
            type="text" 
            name="jerseyNumber"
            value={form.jerseyNumber}
            onChange={onChange}
            placeholder="42" 
            className="bg-slate-900 border border-slate-800 text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">School</label>
        <input 
          type="text" 
          name="school"
          value={form.school}
          onChange={onChange}
          placeholder="Brooklyn High" 
          className="bg-slate-900 border border-slate-800 text-white rounded-md p-4 w-full focus:outline-none focus:border-red-700 transition-colors"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Position(s)</label>
        <div className="flex flex-wrap gap-2">
          {positions.map(pos => (
            <button
              key={pos}
              type="button"
              onClick={() => onPositionToggle(pos)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                form.position.includes(pos) 
                  ? 'border-amber-400 text-amber-400 bg-amber-400/10' 
                  : 'border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepPlayer;
