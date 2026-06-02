"use client";

import { useState, useEffect } from "react";
import RegistrationForm from "@/app/register/RegistrationForm";
import { CoachSettings } from "@/lib/types";

export default function RegisterPage() {
  const [settings, setSettings] = useState<CoachSettings | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("diamondforms-settings");
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleRegistration = (player: any) => {
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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 rotate-45 items-center justify-center rounded-sm bg-amber-400">
              <div className="h-3 w-3 rounded-full bg-white"></div>
            </div>
            <span className="text-xs font-black italic tracking-tighter uppercase">
              Diamond<span className="text-amber-500">Forms</span>
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Secure Registration</p>
        </div>
      </div>

      {/* Document Container */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        <RegistrationForm
          onSubmit={handleRegistration}
          settings={settings || {
            orgName: "", coachName: "", coachEmail: "", coachPhone: "",
            teamName: "", programName: "", programYear: "",
            logoDataUrl: "", primaryColor: "#b91c1c",
          }}
        />

        {/* Footer branding */}
        <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
          DiamondForms · Powered by {settings?.orgName || "your organization"}
        </p>
      </div>
    </main>
  );
}