import React from "react";
import { Player } from "@/types/game";
import { EyeOff, ShieldCheck, ZapOff, LockOpen } from "lucide-react";

interface RoleRevealPhaseProps {
  currentPlayer: Player;
}

export const RoleRevealPhase: React.FC<RoleRevealPhaseProps> = ({
  currentPlayer,
}) => {
  const isInfiltrator = !currentPlayer.word;

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-sm font-mono text-purple-500 uppercase tracking-[0.4em]">
          Mission Briefing
        </h2>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
          Security <span className="text-purple-500">Clearance</span>
        </h1>
      </div>

      <div className="relative group">
        {/* Decorative background glow based on role */}
        <div
          className={`absolute -inset-1 rounded-3xl blur opacity-20 transition-colors duration-1000 ${
            isInfiltrator ? "bg-rose-600" : "bg-purple-600"
          }`}
        />

        <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Role Icon */}
            <div
              className={`p-4 rounded-full mb-6 ${isInfiltrator ? "bg-rose-500/10" : "bg-green-500/10"}`}
            >
              {isInfiltrator ? (
                <ZapOff size={40} className="text-rose-500" />
              ) : (
                <ShieldCheck size={40} className="text-green-500" />
              )}
            </div>

            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-1">
              Your Assigned Identity
            </p>
            <h3
              className={`text-3xl font-black uppercase italic mb-8 ${isInfiltrator ? "text-rose-500" : "text-green-500"}`}
            >
              {currentPlayer.role}
            </h3>

            {/* Secret Word Card */}
            <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <LockOpen size={12} className="text-slate-400" />
              </div>

              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-3">
                Secret Word
              </p>

              {currentPlayer.word ? (
                <div className="text-4xl font-mono font-black text-white tracking-[0.2em] drop-shadow-sm">
                  {currentPlayer.word.toUpperCase()}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-mono font-bold text-rose-500/50 line-through decoration-rose-500">
                    NULL_SIGNAL
                  </div>
                  <p className="text-[10px] text-rose-400 font-mono italic">
                    SYSTEM ERROR: Word packet not found. Blend in at all costs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Prompt */}
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <EyeOff size={14} />
        <p className="text-[10px] font-mono uppercase tracking-widest">
          Memorize your word and role now
        </p>
      </div>
    </div>
  );
};
