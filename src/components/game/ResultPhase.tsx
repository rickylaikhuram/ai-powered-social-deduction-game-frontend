import React from "react";
import { Player } from "@/types/game";
import { ShieldAlert, UserX, Info, Loader2, Zap } from "lucide-react";

interface ResultPhaseProps {
  players: Player[];
}

export const ResultPhase: React.FC<ResultPhaseProps> = ({ players }) => {
  // Find the player with the most votes who was just eliminated
  const eliminatedPlayer = [...players]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .find((p) => p.votes && p.votes > 0);

  const isInfiltrator = eliminatedPlayer?.role === "INFILTRATOR";

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-700">
      {/* ⚠️ SYSTEM LOG HEADER */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="h-[1px] w-12 bg-slate-800" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
          Analysis Complete
        </span>
        <div className="h-[1px] w-12 bg-slate-800" />
      </div>

      {eliminatedPlayer ? (
        <div className="relative group">
          {/* Glow Effect based on result */}
          <div
            className={`absolute -inset-1 rounded-3xl blur opacity-25 transition duration-1000 group-hover:opacity-50 ${
              isInfiltrator ? "bg-green-500" : "bg-rose-600"
            }`}
          />

          <div className="relative bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 overflow-hidden">
            {/* Background Icon */}
            <UserX
              className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-5 ${
                isInfiltrator ? "text-green-500" : "text-rose-500"
              }`}
            />

            <div className="flex flex-col items-center text-center relative z-10">
              <div
                className={`p-4 rounded-full mb-6 ${
                  isInfiltrator
                    ? "bg-green-500/10 text-green-500"
                    : "bg-rose-500/10 text-rose-500"
                }`}
              >
                {isInfiltrator ? <Zap size={40} /> : <ShieldAlert size={40} />}
              </div>

              <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.4em] mb-2">
                Operative Terminated
              </h2>

              <div className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
                {eliminatedPlayer.name}
              </div>

              <div className="flex gap-4 mb-8">
                <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    Role Identity
                  </p>
                  <p
                    className={`font-mono font-bold ${isInfiltrator ? "text-green-400" : "text-rose-400"}`}
                  >
                    {eliminatedPlayer.role}
                  </p>
                </div>
                <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    Votes Against
                  </p>
                  <p className="text-white font-mono font-bold">
                    {eliminatedPlayer.votes}
                  </p>
                </div>
              </div>

              <div
                className={`w-full p-4 rounded-2xl border ${
                  isInfiltrator
                    ? "bg-green-500/5 border-green-500/20 text-green-200"
                    : "bg-rose-500/5 border-rose-500/20 text-rose-200"
                }`}
              >
                <p className="text-xs font-medium italic">
                  {isInfiltrator
                    ? "The Signal has been purified. The Infiltrator has been disconnected."
                    : "A fatal error has occurred. An innocent Citizen was removed from the signal."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-12 flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
            Calculating Vote Weight...
          </p>
        </div>
      )}

      {/* FOOTER AUTO-PROGRESS */}
      <div className="flex items-center justify-center gap-3 py-4">
        <Info size={14} className="text-purple-400" />
        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
          Systems rebooting for next sequence...
        </p>
      </div>
    </div>
  );
};
