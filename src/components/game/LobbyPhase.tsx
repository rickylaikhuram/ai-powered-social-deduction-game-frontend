import React from "react";
import { Crown, Users, Loader2, PlayCircle, Fingerprint } from "lucide-react";
import { Player } from "@/types/game";

interface LobbyPhaseProps {
  players: Player[];
  currentPlayerId: string | null;
  isHost: boolean;
  onStartGame: () => void;
}

export const LobbyPhase: React.FC<LobbyPhaseProps> = ({
  players,
  currentPlayerId,
  isHost,
  onStartGame,
}) => {
  const MIN_PLAYERS = 3;
  const canStart = players.length >= MIN_PLAYERS;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-bold uppercase tracking-widest text-sm">
              Operatives Joined
            </h2>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-tighter">
              Awaiting full squad authorization
            </p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`text-2xl font-black font-mono ${canStart ? "text-green-500" : "text-slate-600"}`}
          >
            {players.length}
          </span>
          <span className="text-slate-600 font-mono text-xs">
            / {MIN_PLAYERS}+
          </span>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {players.map((player) => (
          <div
            key={player.guestId}
            className={`relative group overflow-hidden flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
              player.guestId === currentPlayerId
                ? "bg-purple-900/20 border-purple-500/40"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
            }`}
          >
            {/* Background identity "Fingerprint" icon for flavor */}
            <Fingerprint className="absolute -right-2 -bottom-2 w-12 h-12 text-white/5 rotate-12" />

            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  player.isHost
                    ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>
              {player.isHost && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 shadow-lg shadow-yellow-500/50">
                  <Crown className="w-2.5 h-2.5 text-slate-900" />
                </div>
              )}
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium truncate">
                  {player.name}
                </span>
                {player.guestId === currentPlayerId && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                    You
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-mono truncate">
                {player.isHost ? "System Admin" : "Field Agent"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Area */}
      <div className="mt-8">
        {isHost ? (
          <div className="space-y-4">
            {!canStart && (
              <p className="text-center text-slate-500 text-xs font-mono uppercase">
                Need {MIN_PLAYERS - players.length} more operative(s) to
                initialize
              </p>
            )}
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className={`group relative w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                canStart
                  ? "bg-white text-slate-950 hover:bg-purple-400 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  : "bg-slate-800 text-slate-600 grayscale cursor-not-allowed"
              }`}
            >
              <PlayCircle
                className={`w-5 h-5 ${canStart ? "animate-pulse" : ""}`}
              />
              Commence Operation
            </button>
          </div>
        ) : (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin mx-auto mb-3" />
            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-1">
              Waiting for Authorization
            </p>
            <p className="text-slate-500 text-[10px] uppercase">
              The host will begin the signal shortly
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
