'use client';

import { useState, useEffect } from "react";
import CoachSettings from "@/components/CoachSettings";
import GeneratedPreview from "@/components/GeneratedPreview";
import Roster from "@/components/Roster";
import { PlayerData, CoachSettings as CoachSettingsType } from "@/lib/types";
import { Users, Settings, Link as LinkIcon, Check } from 'lucide-react';

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
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("diamondforms-settings");
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch {}
    }
    const savedPlayers = localStorage.getItem("diamondforms-players");
    if (savedPlayers) {
      try { setPlayers(JSON.parse(savedPlayers)); } catch {}
    }
  }, []);

  // Refresh players periodically to pick up new registrations
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("diamondforms-players");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (JSON.stringify(parsed) !== JSON.stringify(players)) {
            setPlayers(parsed);
          }
        } catch {}
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [players]);

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

  const persistPlayers = (newPlayers: PlayerData[]) => {
    setPlayers(newPlayers);
    localStorage.setItem("diamondforms-players", JSON.stringify(newPlayers));
  };

  const updatePlayer = (idx: number, updatedPlayer: PlayerData) => {
    const newPlayers = [...players];
    newPlayers[idx] = updatedPlayer;
    persistPlayers(newPlayers);
  };

  const removePlayer = (idx: number) => {
    persistPlayers(players.filter((_, i) => i !== idx));
  };

  const generateSinglePDF = (player: PlayerData) => {
    setSelectedPlayer(player);
    setShowPreview(true);
  };

  const copyRegistrationLink = async () => {
    const url = `${window.location.origin}/register`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const primaryGlow = { boxShadow: `0 10px 15px -3px ${settings.primaryColor}33`, backgroundColor: settings.primaryColor };

  return (
    <main className="mx-auto max-w-lg min-h-screen bg-slate-950 text-slate-50 px-4 py-6 pb-32">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 px-2 rounded-sm rotate-3">D</span>
            Diamond<span className="text-amber-400">Forms</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Coach Dashboard</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-all"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Coach Info Banner */}
      {settings.orgName && (
        <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-xl">
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

      {/* Share Registration Link */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Registration Link</p>
            <p className="mt-1 text-sm text-slate-500">Share this link with parents</p>
          </div>
          <button
            onClick={copyRegistrationLink}
            className="flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
            style={primaryGlow}
          >
            {linkCopied ? <><Check size={16} /> Copied!</> : <><LinkIcon size={16} /> Copy Link</>}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-600 break-all">
          {typeof window !== "undefined" ? `${window.location.origin}/register` : "/register"}
        </p>
      </div>

      {/* Section Title */}
      <div className="mb-4 flex items-center gap-2">
        <Users size={18} className="text-slate-400" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
          Roster {players.length > 0 && <span className="text-amber-400">({players.length})</span>}
        </h2>
      </div>

      {/* Roster */}
      <Roster
        players={players}
        onUpdatePlayer={updatePlayer}
        onRemovePlayer={removePlayer}
        onGeneratePDF={generateSinglePDF}
      />

      {/* Empty State */}
      {players.length === 0 && (
        <div className="mt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
            <Users size={28} className="text-slate-600" />
          </div>
          <p className="text-lg font-extrabold uppercase tracking-tight text-slate-400">No Players Yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Share the registration link above with parents to start building your roster.
          </p>
        </div>
      )}

      {/* Sticky Bulk Action */}
      {players.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-lg mx-auto">
          <button
            onClick={() => {
              setSelectedPlayer(null);
              setShowPreview(true);
            }}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-2xl shadow-amber-900/40 flex items-center justify-center gap-2"
          >
            Generate Full Roster PDF ({players.length})
          </button>
        </div>
      )}

      {/* Sticky footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-md text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">DiamondForms · Coach Dashboard</p>
        </div>
      </footer>

      {/* Modals */}
      {showSettings && (
        <CoachSettings settings={settings} onSave={saveSettings} onClose={() => setShowSettings(false)} />
      )}
      {showPreview && (
        <GeneratedPreview
          players={selectedPlayer ? [selectedPlayer] : players}
          settings={settings}
          onClose={() => setShowPreview(false)}
        />
      )}
    </main>
  );
}