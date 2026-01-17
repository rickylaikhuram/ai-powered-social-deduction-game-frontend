import React, { useState } from "react";
import { Player } from "@/types/game";
import { Target, CheckCircle2, AlertTriangle, UserX } from "lucide-react";

interface VotingPhaseProps {
  players: Player[];
  currentPlayerId: string | null;
  onVote: (targetId: string) => void;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({
  players,
  currentPlayerId,
  onVote,
}) => {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  const alivePlayers = players.filter((p) => p.isAlive);
  const currentPlayer = players.find((p) => p.guestId === currentPlayerId);
  const votesCast = alivePlayers.filter((p) => p.hasVoted).length;

  const handleVote = () => {
    if (selectedVote) {
      onVote(selectedVote);
      setSelectedVote(null);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-3">
          <AlertTriangle size={14} className="text-rose-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
            Elimination Protocol Active
          </span>
        </div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Identify the <span className="text-rose-500">Anomaly</span>
        </h2>
        <p className="text-slate-500 text-xs font-mono mt-2 uppercase tracking-widest">
          Select an operative to disconnect from the signal
        </p>
      </div>

      {/* Voting Grid */}
      <div className="grid grid-cols-1 gap-3">
        {alivePlayers.map((player) => {
          const isMe = player.guestId === currentPlayerId;
          const isSelected = selectedVote === player.guestId;
          const hasVoted = player.hasVoted;

          return (
            <button
              key={player.guestId}
              onClick={() =>
                !isMe &&
                !currentPlayer?.hasVoted &&
                setSelectedVote(player.guestId)
              }
              disabled={isMe || currentPlayer?.hasVoted}
              className={`group relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? "bg-rose-500/10 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              } ${isMe ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"}`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-colors ${
                    isSelected
                      ? "bg-rose-500 border-rose-400 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  {isSelected ? (
                    <Target size={24} className="animate-pulse" />
                  ) : (
                    <span className="font-bold">{player.name.charAt(0)}</span>
                  )}
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold uppercase tracking-tight ${isSelected ? "text-rose-500" : "text-white"}`}
                    >
                      {player.name}
                    </span>
                    {isMe && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        (YOU)
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">
                    Status: Secure
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                {hasVoted ? (
                  <div className="flex items-center gap-1 text-green-500 font-mono text-[10px] bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                    <CheckCircle2 size={12} />
                    LOCKED
                  </div>
                ) : (
                  !isMe && (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-800 group-hover:border-slate-600 transition-colors" />
                  )
                )}
              </div>

              {/* Selection Glitch Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Global Status
            </span>
            <span className="text-white font-mono font-bold">
              {votesCast} / {alivePlayers.length} Confirmed
            </span>
          </div>
          <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${(votesCast / alivePlayers.length) * 100}%` }}
            />
          </div>
        </div>

        {!currentPlayer?.hasVoted ? (
          <button
            onClick={handleVote}
            disabled={!selectedVote}
            className="group relative w-full overflow-hidden bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-xl transition-all uppercase tracking-[0.2em] shadow-lg shadow-rose-900/20"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <UserX size={18} />
              Terminate Signal
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="flex items-center gap-2 text-cyan-400 animate-pulse font-mono text-xs uppercase">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              Awaiting Remaining Votes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
