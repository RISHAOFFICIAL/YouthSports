"use client";

import { useState, useEffect } from "react";
import RegistrationForm from "@/app/register/RegistrationForm";
import { CoachSettings } from "@/lib/types";

export default function RegisterPage() {
  const [settings, setSettings] = useState<CoachSettings | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);

  // Load coach settings from localStorage (shared across pages)
  useEffect(() => {
    const saved = localStorage.getItem("diamondforms-settings");
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleRegistration = (player: any) => {
    // Persist to localStorage so the coach dashboard can see it
    const existing = localStorage.getItem("diamondforms-players");
    let players: any[] = [];
    if (existing) {
      try { players = JSON.parse(existing); } catch {}
    }
    players.push(player);
    localStorage.setItem("diamondforms-players", JSON.stringify(players));
    setPlayerCount(players.length);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="mx-auto max-w-lg min-h-screen bg-slate-950 text-slate-50 px-4 py-12">
        <div className="mt-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 rotate-45 items-center justify-center rounded-xl bg-amber-400/20">
            <div className="h-12 w-12 rounded-full bg-amber-400"></div>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Registration<br/>Complete!</h1>
          <p className="mt-4 text-lg text-slate-300">
            {settings?.orgName && <><span className="text-amber-400">{settings.orgName}</span><br/></>}
            Your player has been registered successfully.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Total registrations: {playerCount}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-xl bg-amber-400 px-8 py-4 font-black uppercase tracking-widest text-slate-950 transition-all hover:bg-amber-300"
          >
            Register Another Player
          </button>
        </div>
      </main>
    );
  }

  const primaryColor = settings?.primaryColor || "#b91c1c";

  return (
    <main className="mx-auto max-w-lg min-h-screen bg-slate-950 text-slate-50 px-4 py-8 pb-32">
      {/* Header */}
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-8 w-8 rotate-45 items-center justify-center rounded-sm bg-amber-400">
            <div className="h-4 w-4 rounded-full bg-slate-950"></div>
          </div>
          <h1 className="text-xl font-extrabold uppercase italic tracking-tighter">
            Diamond<span className="text-amber-400">Forms</span>
          </h1>
        </div>
        {settings?.orgName && (
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            {settings.orgName}
          </p>
        )}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">Player Registration</p>
      </header>

      <RegistrationForm
        onSubmit={handleRegistration}
        settings={settings || { orgName: "", coachName: "", coachEmail: "", coachPhone: "", teamName: "", programName: "", programYear: "", logoDataUrl: "", primaryColor: "#b91c1c" }}
      />

      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-md text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            DiamondForms · Secure Registration
          </p>
        </div>
      </footer>
    </main>
  );
}