import React, { useState } from "react";
import { GameMode } from "@/types/game";
import {
  Plus,
  Users,
  Settings2,
  UserCircle2,
  Radio,
  Target,
  Search,
} from "lucide-react";

interface MenuScreenProps {
  username: string;
  isConnected: boolean;
  onChangeUsername: () => void;
  onCreateRoom: (mode: GameMode) => void;
  onJoinRoom: (roomCode: string) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  username,
  isConnected,
  onChangeUsername,
  onCreateRoom,
  onJoinRoom,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>("INFILTRATOR");
  const [roomCodeInput, setRoomCodeInput] = useState("");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent opacity-50" />

      <div className="w-full max-w-2xl z-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Header - Full Width */}
        <div className="md:col-span-12 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6 mb-2">
          <div>
            <div className="flex items-center gap-2 text-purple-500 mb-1">
              <Radio size={16} className="animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
                Signal Active
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
              Dashboard
            </h1>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <UserCircle2 size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Operative
                </p>
                <p className="text-sm font-mono text-white leading-none">
                  {username}
                </p>
              </div>
            </div>
            <button
              onClick={onChangeUsername}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-purple-400"
              title="Change Alias"
            >
              <Settings2 size={18} />
            </button>
          </div>
        </div>

        {/* Left Column: Create Room */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
            <div className="flex items-center gap-2 mb-6">
              <Plus size={20} className="text-purple-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                Initialize New Session
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedMode("INFILTRATOR")}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedMode === "INFILTRATOR"
                      ? "border-purple-600 bg-purple-600/10 text-white"
                      : "border-slate-800 bg-slate-950/50 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <Target size={24} className="mb-2" />
                  <span className="text-xs font-bold uppercase">
                    Infiltrator
                  </span>
                </button>
                <button
                  onClick={() => setSelectedMode("SPY")}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedMode === "SPY"
                      ? "border-blue-600 bg-blue-600/10 text-white"
                      : "border-slate-800 bg-slate-950/50 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <Search size={24} className="mb-2" />
                  <span className="text-xs font-bold uppercase">Spy Mode</span>
                </button>
              </div>

              {/* Mode Description Box */}
              <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800/50">
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  {selectedMode === "INFILTRATOR"
                    ? "CITIZENS receive a word. One INFILTRATOR receives nothing. Identify the blank signal."
                    : "AGENTS receive a word. One SPY receives a similar but different word. Blend in."}
                </p>
              </div>

              <button
                onClick={() => onCreateRoom(selectedMode)}
                disabled={!isConnected}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 uppercase tracking-widest text-xs"
              >
                Create Secure Room
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Join Room */}
        <div className="md:col-span-5 flex flex-col">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex-grow flex flex-col justify-between hover:border-blue-500/30 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Users size={20} className="text-blue-500" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  Join Session
                </h2>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) =>
                    setRoomCodeInput(e.target.value.toUpperCase())
                  }
                  onKeyPress={(e) =>
                    e.key === "Enter" && onJoinRoom(roomCodeInput)
                  }
                  placeholder="CODE"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-center text-2xl font-mono font-bold tracking-[0.3em] text-blue-400 placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              onClick={() => onJoinRoom(roomCodeInput)}
              disabled={!isConnected || !roomCodeInput.trim()}
              className="w-full mt-6 bg-slate-100 hover:bg-white disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs"
            >
              Link to Signal
            </button>
          </div>

          {!isConnected && (
            <div className="mt-4 flex items-center justify-center gap-2 text-rose-500 font-mono text-[10px] uppercase tracking-tighter">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              Connecting to Mainframe...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
