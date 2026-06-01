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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
      <h2 className="text-lg font-bold text-white">Register Player</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">First Name *</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Last Name *</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Age *</label>
          <input name="age" type="number" min="4" max="18" value={form.age} onChange={handleChange} required
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Jersey #</label>
          <input name="jerseyNumber" value={form.jerseyNumber} onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">Position *</label>
        <select name="position" value={form.position} onChange={handleChange} required
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none">
          <option value="">Select position</option>
          {positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <details className="rounded-lg border border-slate-700">
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-slate-300">Parent / Guardian Info</summary>
        <div className="space-y-3 p-4 pt-2">
          <input name="parentName" placeholder="Parent Name" value={form.parentName} onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
          <input name="parentEmail" type="email" placeholder="Email" value={form.parentEmail} onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
          <input name="parentPhone" type="tel" placeholder="Phone" value={form.parentPhone} onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
        </div>
      </details>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">Medical Notes / Allergies</label>
        <textarea name="medicalNotes" rows={2} value={form.medicalNotes} onChange={handleChange}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none resize-none" />
      </div>

      <button type="submit"
        className="w-full rounded-xl bg-amber-600 py-3 font-bold text-white transition hover:bg-amber-500 active:scale-[0.98]">
        {saved ? "✅ Added!" : "➕ Add Player"}
      </button>
    </form>
  );
}