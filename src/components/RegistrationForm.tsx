"use client";

import { useState } from "react";
import { PlayerData, CoachSettings } from "@/lib/types";

interface Props {
  onSubmit: (p: PlayerData) => void;
  settings: CoachSettings;
}

const positions = [
  "Pitcher", "Catcher", "1st Base", "2nd Base", "3rd Base",
  "Shortstop", "Left Field", "Center Field", "Right Field", "Utility",
];

export default function RegistrationForm({ onSubmit, settings }: Props) {
  const [form, setForm] = useState<PlayerData>({
    firstName: "",
    lastName: "",
    age: "",
    position: "",
    jerseyNumber: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    medicalNotes: "",
  });
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.age || !form.position) return;
    onSubmit(form);
    setForm({
      firstName: "",
      lastName: "",
      age: "",
      position: "",
      jerseyNumber: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      medicalNotes: "",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {/* Step Indicator */}
      <div className="mb-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>{step === 1 ? "Player Details" : "Parent & Medical"}</span>
          <span>Step {step} of 2</span>
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full bg-red-700 transition-all ${step === 1 ? "w-1/2" : "w-full"}`}></div>
        </div>
      </div>

      {step === 1 && (
        <section className="space-y-4">
          <h2 className="border-l-4 border-red-700 pl-3 text-2xl font-extrabold uppercase tracking-tight">
            Player Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required
                className="w-full rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required
                className="w-full rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Age *</label>
              <input name="age" type="number" min="4" max="18" value={form.age} onChange={handleChange} required
                className="w-full rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Jersey #</label>
              <input name="jerseyNumber" value={form.jerseyNumber} onChange={handleChange}
                className="w-full rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Position *</label>
            <select name="position" value={form.position} onChange={handleChange} required
              className="w-full appearance-none rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors focus:border-red-700 focus:outline-none">
              <option value="">Select position</option>
              {positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button type="button" onClick={() => setStep(2)}
            className="w-full bg-red-700 py-4 font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-600 rounded-md">
            Continue to Contact
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h2 className="border-l-4 border-red-700 pl-3 text-2xl font-extrabold uppercase tracking-tight">
            Parent & Medical
          </h2>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Parent/Guardian Name</label>
            <input name="parentName" placeholder="e.g. Mallie Robinson" value={form.parentName} onChange={handleChange}
              className="w-full rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</label>
              <input name="parentEmail" type="email" placeholder="parent@example.com" value={form.parentEmail} onChange={handleChange}
                className="w-full rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Phone</label>
              <input name="parentPhone" type="tel" placeholder="(555) 123-4567" value={form.parentPhone} onChange={handleChange}
                className="w-full rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Medical Notes / Allergies</label>
            <textarea name="medicalNotes" rows={3} placeholder="Any allergies, medications, or medical conditions..." value={form.medicalNotes} onChange={handleChange}
              className="w-full resize-none rounded-md border border-slate-800 bg-slate-900 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 rounded-md border-2 border-amber-400 py-4 font-bold uppercase tracking-wider text-amber-400 transition-colors hover:bg-amber-400 hover:text-slate-950">
              Back
            </button>
            <button type="submit"
              className="flex-1 rounded-md bg-red-700 py-4 font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-600">
              {saved ? "✅ Added!" : "➕ Register Player"}
            </button>
          </div>
        </section>
      )}
    </form>
  );
}