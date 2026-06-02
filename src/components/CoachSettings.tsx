"use client";

import { useState } from "react";
import { CoachSettings } from "@/lib/types";

interface Props {
  settings: CoachSettings;
  onSave: (s: CoachSettings) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: "Red", value: "#b91c1c" },
  { name: "Blue", value: "#1d4ed8" },
  { name: "Green", value: "#15803d" },
  { name: "Purple", value: "#7e22ce" },
  { name: "Orange", value: "#c2410c" },
  { name: "Teal", value: "#0f766e" },
];

export default function CoachSettingsModal({ settings, onSave, onClose }: Props) {
  const [form, setForm] = useState<CoachSettings>({
    ...settings,
    programName: settings.programName || "",
    programYear: settings.programYear || new Date().getFullYear().toString(),
    primaryColor: settings.primaryColor || "#b91c1c",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, logoDataUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-white">
            Coach Settings
          </h2>
          <button onClick={onClose} className="text-slate-500 transition-colors hover:text-amber-400">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo Upload */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Team Logo</label>
            <div className="rounded-lg border-2 border-dashed border-slate-700 p-6 text-center transition-colors hover:border-amber-400/50">
              {form.logoDataUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={form.logoDataUrl} alt="Logo" className="h-20 w-20 rounded-lg border border-slate-700 object-contain" />
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, logoDataUrl: "" }))}
                    className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-900/30">
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-xs font-medium text-slate-500">Drop your logo here or click to upload</p>
                  <input type="file" accept="image/*" onChange={handleLogoUpload}
                    className="text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-red-700 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white file:transition-colors hover:file:bg-red-600" />
                </>
              )}
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Organization Name</label>
            <input name="orgName" value={form.orgName} onChange={handleChange} placeholder="e.g. Eastside Eagles"
              className="w-full rounded-md border border-slate-800 bg-slate-950 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Program Name</label>
              <input name="programName" value={form.programName} onChange={handleChange} placeholder="e.g. Travel Baseball"
                className="w-full rounded-md border border-slate-800 bg-slate-950 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Year</label>
              <input name="programYear" value={form.programYear} onChange={handleChange} placeholder="e.g. 2025"
                className="w-full rounded-md border border-slate-800 bg-slate-950 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Team Name</label>
            <input name="teamName" value={form.teamName} onChange={handleChange} placeholder="e.g. 12U Travel"
              className="w-full rounded-md border border-slate-800 bg-slate-950 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
          </div>

          {/* Primary Color Picker */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Primary Color</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, primaryColor: c.value }))}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    form.primaryColor === c.value ? "border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-600">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  className="absolute -left-2 -top-2 h-12 w-12 cursor-pointer border-0 p-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border border-slate-600" style={{ backgroundColor: form.primaryColor }} />
              <span className="text-xs text-slate-400">{form.primaryColor}</span>
            </div>
          </div>

          {/* Coach Info */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Coach Name</label>
            <input name="coachName" value={form.coachName} onChange={handleChange}
              className="w-full rounded-md border border-slate-800 bg-slate-950 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</label>
              <input name="coachEmail" type="email" value={form.coachEmail} onChange={handleChange}
                className="w-full rounded-md border border-slate-800 bg-slate-950 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Phone</label>
              <input name="coachPhone" value={form.coachPhone} onChange={handleChange}
                className="w-full rounded-md border border-slate-800 bg-slate-950 p-4 text-white transition-colors placeholder:text-slate-600 focus:border-red-700 focus:outline-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 rounded-md py-4 font-black uppercase tracking-widest text-white shadow-lg transition-all hover:opacity-90"
              style={{ backgroundColor: form.primaryColor, boxShadow: `0 10px 15px -3px ${form.primaryColor}33` }}>
              Save
            </button>
            <button type="button" onClick={onClose}
              className="rounded-md border-2 border-slate-700 px-6 py-4 font-bold uppercase tracking-wider text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}