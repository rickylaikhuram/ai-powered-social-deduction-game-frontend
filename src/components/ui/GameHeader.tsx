import React, { useState } from "react";
import { Eye, LogOut, Copy, Check } from "lucide-react";

interface GameHeaderProps {
  roomCode: string;
  mode: string;
  onLeave: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  roomCode,
  mode,
  onLeave,
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">{roomCode}</span>
              <button
                onClick={copyRoomCode}
                className="text-purple-400 hover:text-purple-300"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-purple-300 text-sm">{mode} Mode</div>
          </div>
        </div>
        <button
          onClick={onLeave}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Leave
        </button>
      </div>
    </div>
  );
};
