'use client';

import React from 'react';
import { PlayerData } from '@/lib/types';
import { User, DollarSign, FileText, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface RosterProps {
  players: PlayerData[];
  onUpdatePlayer: (idx: number, updatedPlayer: PlayerData) => void;
  onRemovePlayer: (idx: number) => void;
  onGeneratePDF: (player: PlayerData) => void;
}

const Roster: React.FC<RosterProps> = ({ players, onUpdatePlayer, onRemovePlayer, onGeneratePDF }) => {
  const togglePaymentStatus = (idx: number) => {
    const player = players[idx];
    onUpdatePlayer(idx, {
      ...player,
      paymentStatus: player.paymentStatus === 'Paid' ? 'Pending' : 'Paid'
    });
  };

  if (players.length === 0) {
    return (
      <div className="mt-12 text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl">
        <div className="text-5xl mb-4 opacity-50">📋</div>
        <p className="text-slate-400 font-medium">No players in roster yet.</p>
        <p className="text-slate-500 text-xs mt-1">Register players to build your team roster.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Team Roster ({players.length})
        </h2>
      </div>

      <div className="grid gap-3">
        {players.map((player, idx) => (
          <div 
            key={idx}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">
                    {player.firstName} {player.lastName}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      #{player.jerseyNumber || '??'}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {player.position || 'Utility'}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {player.age}U
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => togglePaymentStatus(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                  player.paymentStatus === 'Paid' 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}
              >
                {player.paymentStatus === 'Paid' ? (
                  <><CheckCircle size={12} /> Paid</>
                ) : (
                  <><DollarSign size={12} /> Pending</>
                )}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[10px] text-slate-500 italic">
                {player.parentName} · {player.parentPhone}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onRemovePlayer(idx)}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Remove Player"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => onGeneratePDF(player)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-all uppercase tracking-widest"
                >
                  <FileText size={14} /> Receipt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roster;
