import React from "react";
import { Users, Shield, Skull, Activity } from "lucide-react";
import { Player } from "@/types/game";

interface PlayersPanelProps {
  players: Player[];
}

export const PlayersPanel: React.FC<PlayersPanelProps> = ({ players }) => {
  return (
    <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 mt-6 shadow-xl transition-all duration-500">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
            Operative Roster
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-green-500 animate-pulse" />
          <span className="text-[9px] font-mono text-slate-500 uppercase">
            Live Feed
          </span>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {players.map((player) => {
          const isAlive = player.isAlive;

          return (
            <div
              key={player.guestId}
              className={`relative group flex flex-col p-3 rounded-xl border-2 transition-all duration-300 ${
                isAlive
                  ? "bg-slate-900/60 border-slate-800 hover:border-purple-500/30"
                  : "bg-rose-950/10 border-rose-900/20 grayscale opacity-60"
              }`}
            >
              {/* Status Icon Overlay */}
              <div className="absolute top-2 right-2">
                {isAlive ? (
                  <Shield size={10} className="text-purple-500/50" />
                ) : (
                  <Skull size={10} className="text-rose-600" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                {/* Mini Avatar or Initial */}
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    isAlive
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-slate-800 text-slate-600"
                  }`}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div
                  className={`text-xs font-bold truncate ${isAlive ? "text-slate-200" : "text-slate-500"}`}
                >
                  {player.name}
                </div>
              </div>

              <div className="mt-1 flex items-center gap-1">
                <div
                  className={`w-1 h-1 rounded-full ${isAlive ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-rose-600"}`}
                />
                <span
                  className={`text-[9px] font-mono uppercase tracking-tighter ${isAlive ? "text-slate-400" : "text-rose-500"}`}
                >
                  {isAlive ? "Active" : "Terminated"}
                </span>
              </div>

              {/* Voting Progress Sub-indicator (Useful for Speaking/Voting phases) */}
              {isAlive && player.hasVoted && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500/50 shadow-[0_-2px_4px_rgba(6,182,212,0.3)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
