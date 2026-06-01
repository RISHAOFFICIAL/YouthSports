'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { PlayerData, CoachSettings } from '../../lib/types';
import ProgressBar from './ProgressBar';
import StepPlayer from './StepPlayer';
import StepGuardian from './StepGuardian';
import StepEmergency from './StepEmergency';

interface RegistrationFormProps {
  onSubmit: (player: PlayerData) => void;
  settings: CoachSettings;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, settings }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PlayerData>({
    firstName: '',
    lastName: '',
    age: '',
    school: '',
    position: '',
    jerseyNumber: '',
    jerseySize: '',
    throws: 'Right',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyName: '',
    emergencyPhone: '',
    medicalNotes: '',
    paymentAmount: '150.00',
    paymentStatus: 'Pending'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const togglePosition = (pos: string) => {
    setForm(prev => ({
      ...prev,
      position: prev.position.includes(pos)
        ? prev.position.replace(pos, '').replace(',,', ',').trim()
        : prev.position ? `${prev.position}, ${pos}` : pos
    }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.firstName) newErrors.firstName = 'Required';
      if (!form.lastName) newErrors.lastName = 'Required';
      if (!form.age) newErrors.age = 'Required';
    } else if (step === 2) {
      if (!form.parentName) newErrors.parentName = 'Required';
      if (!form.parentEmail) newErrors.parentEmail = 'Required';
      if (!form.parentPhone) newErrors.parentPhone = 'Required';
    } else if (step === 3) {
      if (!form.emergencyName) newErrors.emergencyName = 'Required';
      if (!form.emergencyPhone) newErrors.emergencyPhone = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      onSubmit(form);
      // Reset form
      setForm({
        firstName: '',
        lastName: '',
        age: '',
        school: '',
        position: '',
        jerseyNumber: '',
        jerseySize: '',
        throws: 'Right',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        emergencyName: '',
        emergencyPhone: '',
        medicalNotes: '',
        paymentAmount: '150.00',
        paymentStatus: 'Pending'
      });
      setStep(1);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 shadow-xl">
      <div className="mb-4 text-center">
        {settings.orgName && <p className="text-xs font-bold uppercase tracking-widest text-amber-400">{settings.orgName}</p>}
        <h2 className="text-lg font-bold text-white">Player Registration</h2>
      </div>
      <ProgressBar step={step} totalSteps={3} />

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <StepPlayer 
            form={form} 
            onChange={handleInputChange} 
            onPositionToggle={togglePosition} 
            errors={errors} 
          />
        )}
        
        {step === 2 && (
          <StepGuardian 
            form={form} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        )}

        {step === 3 && (
          <StepEmergency 
            form={form} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        )}

        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button 
              type="button"
              onClick={prevStep}
              className="flex-1 border border-slate-700 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}
          
          {step < 3 ? (
            <button 
              type="button"
              onClick={nextStep}
              className="flex-[2] bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="submit"
              className="flex-[2] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Add Player
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
