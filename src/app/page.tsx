"use client";

import { useState, useEffect } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import CoachSettings from "@/components/CoachSettings";
import GeneratedPreview from "@/components/GeneratedPreview";
import { PlayerData, CoachSettings as CoachSettingsType } from "@/lib/types";

const defaultCoachSettings: CoachSettingsType = {
  orgName: "",
  coachName: "",
  coachEmail: "",
  coachPhone: "",
  teamName: "",
  logoDataUrl: "",
};

export default function Home() {
  const [settings, setSettings] = useState<CoachSettingsType>(defaultCoachSettings);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("diamondforms-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveSettings = (s: CoachSettingsType) => {
    setSettings(s);
    localStorage.setItem("diamondforms-settings", JSON.stringify(s));
    setShowSettings(false);
  };

  const addPlayer = (p: PlayerData) => {
    setPlayers((prev) => [...prev, p]);
  };

  const removePlayer = (idx: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            ⚾ DiamondForms
          </h1>
          <p className="text-sm text-slate-400">Youth Sports Registration</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        >
          ⚙️ Settings
        </button>
      </header>

      {/* Coach Info Banner */}
      {settings.orgName && (
        <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-center">
          <p className="text-lg font-bold text-amber-400">{settings.orgName}</p>
          {settings.teamName && (
            <p className="text-sm text-slate-300">{settings.teamName}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {settings.coachName} · {settings.coachEmail}
          </p>
        </div>
      )}

      {/* Registration Form */}
      <RegistrationForm onSubmit={addPlayer} settings={settings} />

      {/* Player List */}
      {players.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Registered Players ({players.length})
          </h2>
          <ul className="space-y-2">
            {players.map((p, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.age} yrs · {p.jerseyNumber && `#${p.jerseyNumber} · `}
                    {p.position}
                  </p>
                </div>
                <button
                  onClick={() => removePlayer(i)}
                  className="rounded-md bg-red-900/40 px-2 py-1 text-xs text-red-300 transition hover:bg-red-800/60"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowPreview(true)}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-bold text-white shadow-lg transition hover:from-amber-400 hover:to-orange-500"
          >
            📄 Generate Registration PDF
          </button>
        </section>
      )}

      {/* Empty State */}
      {players.length === 0 && !showPreview && (
        <div className="mt-12 text-center">
          <div className="text-5xl">📋</div>
          <p className="mt-4 text-slate-400">
            Add players above to generate your registration form.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Use Settings to add your organization logo and coach info.
          </p>
        </div>
      )}

      {/* Modals */}
      {showSettings && (
        <CoachSettings
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showPreview && (
        <GeneratedPreview
          players={players}
          settings={settings}
          onClose={() => setShowPreview(false)}
        />
      )}
    </main>
  );
}