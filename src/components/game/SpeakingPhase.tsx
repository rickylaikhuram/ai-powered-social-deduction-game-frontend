import React, { useState, useEffect } from "react";
import {
  Clock,
  Zap,
  Send,
  MessageSquare,
  Mic2,
  AlertCircle,
} from "lucide-react";
import { Player } from "@/types/game";

interface SpeakingPhaseProps {
  players: Player[];
  clues: Array<{ sender: string; text: string; id: string }>;
  currentSpeakerIndex: number;
  currentPlayerId: string | null;
  onSendClue: (clue: string) => void;
}

export const SpeakingPhase: React.FC<SpeakingPhaseProps> = ({
  players,
  clues,
  currentSpeakerIndex,
  currentPlayerId,
  onSendClue,
}) => {
  const [clueInput, setClueInput] = useState("");
  const [speakerTimer, setSpeakerTimer] = useState(30);

  const alivePlayers = players.filter((p) => p.isAlive);
  const currentSpeaker =
    alivePlayers[currentSpeakerIndex % alivePlayers.length];
  const currentPlayer = players.find((p) => p.guestId === currentPlayerId);
  const isMyTurn = currentSpeaker?.guestId === currentPlayerId;
  const hasGivenClue = clues.some((c) => c.sender === currentPlayer?.name);

  useEffect(() => {
    setSpeakerTimer(31);
    const interval = setInterval(() => {
      setSpeakerTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSpeakerIndex]);

  const handleSendClue = () => {
    if (clueInput.trim()) {
      onSendClue(clueInput.trim());
      setClueInput("");
    }
  };

  // Calculate timer color based on urgency
  const timerColor =
    speakerTimer <= 5
      ? "text-rose-500"
      : speakerTimer <= 10
        ? "text-amber-500"
        : "text-cyan-400";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* ACTIVE SPEAKER STAGE */}
      <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border-2 border-slate-800 rounded-3xl p-6 shadow-2xl">
        {/* Animated Background Pulse for Active Turn */}
        {isMyTurn && (
          <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
        )}

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`p-1.5 rounded-full ${isMyTurn ? "bg-purple-500 animate-bounce" : "bg-slate-700"}`}
            >
              <Mic2 size={14} className="text-white" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
              Broadcasting Signal
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 mb-2">
            {/* Visual Timer Ring (Simplified for React) */}
            <div
              className={`relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-slate-800 ${speakerTimer <= 5 ? "animate-pulse" : ""}`}
            >
              <div
                className={`absolute inset-0 rounded-full border-t-4 border-purple-500 transition-all duration-1000`}
                style={{ transform: `rotate(${(30 - speakerTimer) * 12}deg)` }}
              />
              <span className={`text-3xl font-black font-mono ${timerColor}`}>
                {speakerTimer}
              </span>
            </div>

            <div className="text-left">
              <h2
                className={`text-3xl font-black italic uppercase tracking-tighter ${isMyTurn ? "text-white" : "text-slate-400"}`}
              >
                {currentSpeaker?.name}
              </h2>
              <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                {isMyTurn
                  ? "Your turn to transmit"
                  : "Currently transmitting..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSMISSION LOG (CLUES) */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col h-80">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-slate-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Signal History
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {clues.length} PACKETS RECEIVED
          </span>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide">
          {clues.map((clue) => (
            <div
              key={clue.id}
              className={`flex flex-col animate-in slide-in-from-left-2 duration-300 ${
                clue.sender === "SHADOW_SIGNAL_AI"
                  ? "items-center"
                  : "items-start"
              }`}
            >
              <div className={`flex items-center gap-2 mb-1 px-1`}>
                {clue.sender === "SHADOW_SIGNAL_AI" && (
                  <Zap size={12} className="text-purple-400 fill-purple-400" />
                )}
                <span
                  className={`text-[10px] font-bold uppercase tracking-tighter ${
                    clue.sender === "SHADOW_SIGNAL_AI"
                      ? "text-purple-400"
                      : "text-slate-500"
                  }`}
                >
                  {clue.sender}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[90%] shadow-sm ${
                  clue.sender === "SHADOW_SIGNAL_AI"
                    ? "bg-purple-600/20 border border-purple-500/30 text-purple-100 italic text-center"
                    : "bg-slate-800 border border-slate-700 text-white"
                }`}
              >
                {clue.text}
              </div>
            </div>
          ))}
          {clues.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
              <AlertCircle size={32} className="mb-2" />
              <p className="text-[10px] uppercase font-mono tracking-[0.2em]">
                Awaiting first transmission...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* INPUT INTERFACE */}
      <div className="min-h-[100px]">
        {isMyTurn && currentPlayer?.isAlive && !hasGivenClue ? (
          <div className="bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-2 flex gap-2 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-in slide-in-from-bottom-4">
            <input
              autoFocus
              type="text"
              value={clueInput}
              onChange={(e) => setClueInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendClue()}
              placeholder="Enter encrypted clue..."
              className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-0 font-mono"
            />
            <button
              onClick={handleSendClue}
              disabled={!clueInput.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 rounded-xl transition-all font-bold flex items-center justify-center gap-2"
            >
              <span className="hidden sm:inline text-xs uppercase tracking-widest">
                Transmit
              </span>
              <Send size={18} />
            </button>
          </div>
        ) : (
          !isMyTurn && (
            <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
              <p className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.3em]">
                Listening for incoming signal from {currentSpeaker?.name}...
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
