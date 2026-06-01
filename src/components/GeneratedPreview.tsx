"use client";

import { useCallback } from "react";
import { PlayerData, CoachSettings } from "@/lib/types";
import { generateRegistrationPDF } from "@/lib/pdfGenerator";

interface Props {
  players: PlayerData[];
  settings: CoachSettings;
  onClose: () => void;
}

export default function GeneratedPreview({ players, settings, onClose }: Props) {
  const handleDownload = useCallback(() => {
    generateRegistrationPDF(players, settings);
  }, [players, settings]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Registration Summary</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="mb-4 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          {settings.logoDataUrl && (
            <img src={settings.logoDataUrl} alt="Logo" className="mx-auto mb-3 h-16 w-16 rounded-lg object-contain" />
          )}
          <p className="text-center font-bold text-amber-400">{settings.orgName || "Your Organization"}</p>
          {settings.teamName && <p className="text-center text-sm text-slate-300">{settings.teamName}</p>}
        </div>

        <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
          {players.map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-700 bg-slate-800/30 px-3 py-2 text-sm">
              <p className="font-medium text-white">{p.firstName} {p.lastName} {p.jerseyNumber && <span className="text-slate-400">#{p.jerseyNumber}</span>}</p>
              <p className="text-xs text-slate-400">{p.age} yrs · {p.position}</p>
            </div>
          ))}
        </div>

        <p className="mb-4 text-center text-xs text-slate-500">
          {players.length} player{players.length !== 1 ? "s" : ""} registered
        </p>

        <div className="flex gap-3">
          <button onClick={handleDownload}
            className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-bold text-white shadow-lg transition hover:from-amber-400 hover:to-orange-500 active:scale-[0.98]">
            📥 Download PDF
          </button>
          <button onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-700">
            Close
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-slate-600">
          DiamondForms · Free tier includes branding
        </p>
      </div>
    </div>
  );
}