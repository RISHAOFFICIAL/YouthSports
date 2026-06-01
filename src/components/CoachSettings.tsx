"use client";

import { useState } from "react";
import { CoachSettings } from "@/lib/types";

interface Props {
  settings: CoachSettings;
  onSave: (s: CoachSettings) => void;
  onClose: () => void;
}

export default function CoachSettingsModal({ settings, onSave, onClose }: Props) {
  const [form, setForm] = useState<CoachSettings>({ ...settings });
  const [tab, setTab] = useState<"details" | "logo">("details");

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
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Coach Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab("details")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === "details" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-300"}`}>
            Details
          </button>
          <button onClick={() => setTab("logo")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === "logo" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-300"}`}>
            Logo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "details" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Organization Name</label>
                <input name="orgName" value={form.orgName} onChange={handleChange} placeholder="e.g. Eastside Eagles"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Team Name</label>
                <input name="teamName" value={form.teamName} onChange={handleChange} placeholder="e.g. 12U Travel"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Coach Name</label>
                  <input name="coachName" value={form.coachName} onChange={handleChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Coach Phone</label>
                  <input name="coachPhone" value={form.coachPhone} onChange={handleChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Coach Email</label>
                <input name="coachEmail" type="email" value={form.coachEmail} onChange={handleChange}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none" />
              </div>
            </>
          )}

          {tab === "logo" && (
            <div className="space-y-4 text-center">
              {form.logoDataUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={form.logoDataUrl} alt="Logo preview" className="h-24 w-24 rounded-xl border border-slate-600 object-contain" />
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, logoDataUrl: "" }))}
                    className="text-xs text-red-400 hover:text-red-300">Remove logo</button>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-600 p-8">
                  <p className="text-sm text-slate-400">Upload your organization logo</p>
                  <input type="file" accept="image/*" onChange={handleLogoUpload}
                    className="mt-3 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-amber-500" />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 rounded-xl bg-amber-600 py-2.5 font-bold text-white transition hover:bg-amber-500">
              Save Settings
            </button>
            <button type="button" onClick={onClose}
              className="rounded-xl bg-slate-800 px-5 py-2.5 font-medium text-slate-300 transition hover:bg-slate-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}