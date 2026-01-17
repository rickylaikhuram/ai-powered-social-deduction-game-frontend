import React, { useState } from "react";
import { Eye, Shield, Zap } from "lucide-react";

interface UsernameScreenProps {
  initialUsername: string;
  onSubmit: (username: string) => void;
}

export const UsernameScreen: React.FC<UsernameScreenProps> = ({
  initialUsername,
  onSubmit,
}) => {
  const [username, setUsername] = useState(initialUsername);

  const handleSubmit = () => {
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />

      {/* Scanline Effect overlay for "Authentic Game" feel */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="relative inline-block">
            {/* Pulsing Outer Glow */}
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl animate-pulse opacity-20" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-slate-900 border-2 border-purple-500/50 rounded-full mb-6">
              <Eye className="w-12 h-12 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            </div>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Shadow<span className="text-purple-500">Signal</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm tracking-widest mt-2 uppercase">
            Infiltrate. Detect. Survive.
          </p>
        </div>

        {/* Input Card with Tactical Borders */}
        <div className="bg-slate-900/80 backdrop-blur-xl border-t-2 border-purple-500/30 rounded-2xl p-8 shadow-2xl relative">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 p-2 opacity-30">
            <Zap size={16} className="text-purple-400" />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-3 ml-1">
                Establish Identity
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="OPERATIVE ALIAS..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white placeholder-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                maxLength={20}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!username.trim()}
              className="group relative w-full overflow-hidden rounded-xl bg-purple-600 px-8 py-4 font-bold text-white transition-all hover:bg-purple-500 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-600"
            >
              {/* Button "Shine" effect */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>

              <span className="relative flex items-center justify-center gap-2">
                <Shield size={20} />
                INITIALIZE CONNECTION
              </span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-[10px] font-mono uppercase tracking-widest">
          Secure Link Established
        </p>
      </div>
    </div>
  );
};
