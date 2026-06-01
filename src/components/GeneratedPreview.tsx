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
    const filename = `registration_${settings.orgName?.replace(/\s+/g, "_") || "team"}_${Date.now()}.pdf`;
    generateRegistrationPDF(players, settings, filename);
  }, [players, settings]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 rotate-45 items-center justify-center rounded-sm bg-amber-400">
              <div className="h-3 w-3 rounded-full bg-white"></div>
            </div>
            <span className="text-base font-black italic tracking-tighter uppercase">
              Diamond<span className="text-amber-400">Forms</span>
            </span>
          </div>
          <button onClick={onClose} className="text-slate-500 transition-colors hover:text-amber-400">✕</button>
        </div>

        {/* Preview Card */}
        <div className="mb-4 rounded-lg border border-slate-700 bg-white p-6 shadow-sm">
          {/* Simulated Gold Border */}
          <div className="border-2 border-amber-400 p-4">
            {/* Receipt Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-4 w-4 rotate-45 items-center justify-center rounded-sm bg-amber-400">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-xs font-black italic tracking-tighter">DIAMOND<span className="text-amber-500">FORMS</span></span>
                </div>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-gray-400">Registration Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black uppercase text-red-700 leading-none">Paid</p>
                <p className="text-[8px] font-bold text-gray-400">#DF-{String(Date.now()).slice(-6)}</p>
              </div>
            </div>

            {/* Player Info */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b pb-1">Player Roster</p>
                <div className="space-y-2">
                  {players.slice(0, 3).map((p, i) => (
                    <div key={i} className="text-[10px]">
                      <p className="font-bold text-gray-800">{p.firstName} {p.lastName}</p>
                      <p className="text-[8px] text-gray-500">{p.age} yrs · {p.position}{p.jerseyNumber && ` · #${p.jerseyNumber}`}</p>
                    </div>
                  ))}
                  {players.length > 3 && (
                    <p className="text-[8px] font-bold text-amber-600">+{players.length - 3} more players</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b pb-1">Organization</p>
                <p className="text-xs font-bold text-gray-800">{settings.orgName || "—"}</p>
                {settings.teamName && <p className="text-[10px] font-medium text-gray-500">{settings.teamName}</p>}
                <p className="mt-1 text-[8px] text-gray-400">{settings.coachName && `Coach: ${settings.coachName}`}</p>
              </div>
            </div>

            {/* Watermark */}
            <div className="flex items-center justify-center opacity-[0.03]">
              <span className="text-4xl font-black">DIAMOND</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
          {players.length} player{players.length !== 1 ? "s" : ""} registered
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleDownload}
            className="flex-1 rounded-md bg-red-700 py-4 font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-600">
            📥 Download PDF
          </button>
          <button onClick={onClose}
            className="rounded-md border-2 border-slate-700 px-6 py-4 font-bold uppercase tracking-wider text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-400">
            Close
          </button>
        </div>

        <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-widest text-slate-700">
          DiamondForms · Free Tier Registration
        </p>
      </div>
    </div>
  );
}