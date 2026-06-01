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
  programName: "",
  programYear: "",
  logoDataUrl: "",
  primaryColor: "#b91c1c",
};

export default function Home() {
  const [settings, setSettings] = useState<CoachSettingsType>(defaultCoachSettings);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("diamondforms-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Apply dynamic primary color as CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", settings.primaryColor);
    document.documentElement.style.setProperty("--primary-hover", settings.primaryColor + "dd");
    document.documentElement.style.setProperty("--primary-light", settings.primaryColor + "26");
    document.documentElement.style.setProperty("--primary-glow", settings.primaryColor + "4d");
  }, [settings.primaryColor]);

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

  // Dynamic primary style helper
  const primaryBg = { backgroundColor: settings.primaryColor };
  const primaryBorder = { borderColor: settings.primaryColor };
  const primaryGlow = { boxShadow: `0 10px 15px -3px ${settings.primaryColor}33`, backgroundColor: settings.primaryColor };

  return (
    <main className="mx-auto max-w-md px-4 pb-28">
      {/* Header — Diamond Logo + Menu */}
      <header className="flex items-center justify-between border-b border-slate-800 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 rotate-45 items-center justify-center rounded-sm bg-amber-400">
            <div className="h-4 w-4 rounded-full bg-slate-950"></div>
          </div>
          <h1 className="text-xl font-extrabold uppercase italic tracking-tighter">
            Diamond<span className="text-amber-400">Forms</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {settings.orgName && (
            <span className="hidden rounded-full bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 sm:inline-block">
              {settings.orgName}
            </span>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-400"
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      {/* Coach Info Banner */}
      {settings.orgName && (
        <div className="mb-6 mt-5 rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center gap-3">
            {settings.logoDataUrl && (
              <img src={settings.logoDataUrl} alt="Logo" className="h-12 w-12 rounded-lg border border-slate-700 object-contain" />
            )}
            <div>
              <p className="text-lg font-extrabold uppercase tracking-tight" style={{ color: settings.primaryColor }}>
                {settings.orgName}
              </p>
              {settings.teamName && <p className="text-sm font-medium text-slate-400">{settings.teamName}</p>}
              {settings.programName && (
                <p className="text-xs text-slate-500">{settings.programName}{settings.programYear ? ` · ${settings.programYear}` : ""}</p>
              )}
              <p className="mt-0.5 text-[11px] text-slate-500">
                {settings.coachName && `Coach ${settings.coachName}`}{settings.coachEmail && ` · ${settings.coachEmail}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      {players.length > 0 && (
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Registration</span>
            <span>{players.length} player{players.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full transition-all" style={{ ...primaryBg, width: `${Math.min(players.length * 25, 100)}%` }}></div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <RegistrationForm onSubmit={addPlayer} settings={settings} />

      {/* Player List */}
      {players.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Roster</h2>
          <ul className="space-y-2">
            {players.map((p, i) => (
              <li key={i}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-xl">
                <div>
                  <p className="font-bold text-white">{p.firstName} {p.lastName}</p>
                  <p className="text-xs font-medium text-slate-400">
                    {p.age} yrs · {p.position}{p.jerseyNumber && ` · #${p.jerseyNumber}`}
                  </p>
                </div>
                <button onClick={() => removePlayer(i)}
                  className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-red-900/30"
                  style={{ color: settings.primaryColor }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button onClick={() => setShowPreview(true)}
            className="mt-4 w-full py-4 font-black uppercase tracking-widest text-white shadow-lg transition-all hover:opacity-90 rounded-md"
            style={primaryGlow}>
            📄 Generate Registration PDF
          </button>
        </section>
      )}

      {/* Empty State */}
      {players.length === 0 && !showPreview && (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 rotate-45 items-center justify-center rounded-lg bg-amber-400/10">
            <div className="h-10 w-10 rounded-full bg-slate-950"></div>
          </div>
          <p className="text-lg font-extrabold uppercase tracking-tight text-slate-300">No Players Yet</p>
          <p className="mt-2 text-sm text-slate-500">Add your first player above to generate a registration form.</p>
          <p className="mt-1 text-xs text-slate-600">Use Settings to add your team logo and coach info.</p>
        </div>
      )}

      {/* Sticky footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-md">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
            DiamondForms · Free Tier
          </p>
        </div>
      </footer>

      {/* Modals */}
      {showSettings && (
        <CoachSettings settings={settings} onSave={saveSettings} onClose={() => setShowSettings(false)} />
      )}
      {showPreview && (
        <GeneratedPreview players={players} settings={settings} onClose={() => setShowPreview(false)} />
      )}
    </main>
  );
}