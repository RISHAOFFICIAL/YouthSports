'use client';

import { useState, useEffect } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import CoachSettings from "@/components/CoachSettings";
import GeneratedPreview from "@/components/GeneratedPreview";
import Roster from "@/components/Roster";
import { PlayerData, CoachSettings as CoachSettingsType } from "@/lib/types";
import { Users, UserPlus, Settings } from 'lucide-react';

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
  const [view, setView] = useState<'register' | 'roster'>('register');
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);

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

  const saveSettings = (s: CoachSettingsType) => {
    setSettings(s);
    localStorage.setItem("diamondforms-settings", JSON.stringify(s));
    setShowSettings(false);
  };

  const persistPlayers = (newPlayers: PlayerData[]) => {
    setPlayers(newPlayers);
    localStorage.setItem("diamondforms-players", JSON.stringify(newPlayers));
  };

  const addPlayer = (p: PlayerData) => {
    persistPlayers([...players, p]);
    setView('roster');
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

  return (
    <main className="mx-auto max-w-lg min-h-screen bg-slate-950 text-slate-50 px-4 py-6 pb-32">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 px-2 rounded-sm rotate-3">D</span>
            Diamond<span className="text-amber-400">Forms</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Elite Coach Toolkit</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-all"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
        <button 
          onClick={() => setView('register')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            view === 'register' ? 'bg-red-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <UserPlus size={16} /> Register
        </button>
        <button 
          onClick={() => setView('roster')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            view === 'roster' ? 'bg-red-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Users size={16} /> Roster
        </button>
      </div>

      {/* Main Content */}
      <div className="animate-in fade-in duration-500">
        {view === 'register' ? (
          <RegistrationForm onSubmit={addPlayer} settings={settings} />
        ) : (
          <Roster 
            players={players} 
            onUpdatePlayer={updatePlayer}
            onRemovePlayer={removePlayer}
            onGeneratePDF={generateSinglePDF}
          />
        )}
      </div>

      {/* Sticky Bulk Action (only on Roster with players) */}
      {view === 'roster' && players.length > 0 && (
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
          players={selectedPlayer ? [selectedPlayer] : players}
          settings={settings}
          onClose={() => setShowPreview(false)}
        />
      )}
    </main>
  );
}
