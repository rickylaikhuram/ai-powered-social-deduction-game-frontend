import React from "react";
import { Player } from "@/types/game";
import { Trophy, Home, Users, Skull, ShieldCheck, ZapOff } from "lucide-react";

interface GameOverPhaseProps {
  winner: string | null;
  players: Player[];
  onLeaveRoom: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  winner,
  players,
  onLeaveRoom,
}) => {
  // Determine if the winner category was a "Victory" for the user
  const isVictory =
    winner?.toLowerCase().includes("citizen") ||
    winner?.toLowerCase().includes("agent");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-1000">
      {/* WINNER ANNOUNCEMENT */}
      <div className="relative overflow-hidden bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl">
        {/* Ambient background glow based on winner */}
        <div
          className={`absolute -inset-24 opacity-20 blur-[100px] ${isVictory ? "bg-purple-600" : "bg-rose-600"}`}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`p-5 rounded-full mb-6 ${isVictory ? "bg-purple-500/10 text-purple-400" : "bg-rose-500/10 text-rose-400"}`}
          >
            <Trophy
              size={48}
              className="drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
          </div>

          <h2 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em] mb-2">
            Operation Concluded
          </h2>

          <h1
            className={`text-6xl font-black italic uppercase tracking-tighter mb-4 ${isVictory ? "text-white" : "text-rose-500"}`}
          >
            {winner}
          </h1>

          <p className="text-slate-400 text-sm max-w-xs font-medium leading-relaxed">
            The signal has been stabilized and all anomalies have been
            processed.
          </p>
        </div>
      </div>

      {/* MISSION DEBRIEF (FINAL STANDINGS) */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Users size={16} className="text-slate-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
            Mission Debrief
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {players.map((player) => {
            const isInfiltrator =
              player.role === "INFILTRATOR" || player.role === "SPY";

            return (
              <div
                key={player.guestId}
                className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      player.isAlive
                        ? "bg-slate-900 border-slate-800"
                        : "bg-rose-950/20 border-rose-900/30"
                    }`}
                  >
                    {player.isAlive ? (
                      <span className="text-white font-bold">
                        {player.name.charAt(0)}
                      </span>
                    ) : (
                      <Skull size={18} className="text-rose-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${player.isAlive ? "text-white" : "text-slate-500"}`}
                      >
                        {player.name}
                      </span>
                      {!player.isAlive && (
                        <span className="text-[8px] font-mono text-rose-500 uppercase border border-rose-500/30 px-1 rounded">
                          Terminated
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 uppercase">
                      ID: {player.guestId.substring(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isInfiltrator
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        : "bg-green-500/10 text-green-500 border border-green-500/20"
                    }`}
                  >
                    {isInfiltrator ? (
                      <ZapOff size={10} />
                    ) : (
                      <ShieldCheck size={10} />
                    )}
                    {player.role}
                  </div>
                  {player.word && (
                    <span className="text-[10px] text-slate-500 mt-1 italic">
                      Word: {player.word}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RETURN ACTION */}
      <button
        onClick={onLeaveRoom}
        className="group relative w-full overflow-hidden bg-white hover:bg-purple-500 text-slate-950 hover:text-white font-black py-5 rounded-2xl transition-all duration-300 uppercase tracking-[0.3em] text-xs shadow-2xl shadow-white/5"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Home size={16} />
          Return to Command Center
        </span>
        <div className="absolute inset-0 bg-slate-950 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
      </button>

      <div className="text-center">
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">
          Shadow Signal v1.0.4 • Encryption Resolved
        </p>
      </div>
    </div>
  );
};
