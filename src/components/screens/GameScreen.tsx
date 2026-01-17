import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { GameHeader } from "@/components/ui/GameHeader";
import { PlayersPanel } from "@/components/game/PlayersPanel";
import { LobbyPhase } from "@/components/game/LobbyPhase";
import { RoleRevealPhase } from "@/components/game/RoleRevealPhase";
import { SpeakingPhase } from "@/components/game/SpeakingPhase";
import { VotingPhase } from "@/components/game/VotingPhase";
import { ResultPhase } from "@/components/game/ResultPhase";
import { GameOverPhase } from "@/components/game/GameOverPhase";
import { getSocket } from "@/services/socket";
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react";

interface GameScreenProps {
  onLeaveRoom: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onLeaveRoom }) => {
  const { currentRoom, guestId, username } = useSelector(
    (state: RootState) => state.game,
  );

  // Loading state with thematic styling
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        {/* Animated Loader */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="relative w-12 h-12 text-purple-500 animate-spin" />
        </div>

        <div className="space-y-2 mb-8">
          <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.3em]">
            Synchronizing Signal
          </p>
          <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
            Establishing secure handshake...
          </p>
        </div>

        {/* Recovery Action */}
        <button
          onClick={() => window.location.reload()}
          className="group flex items-center gap-2 px-6 py-2 bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all duration-300"
        >
          <RefreshCw
            size={14}
            className="text-slate-500 group-hover:text-purple-400 group-hover:rotate-180 transition-transform duration-500"
          />
          <span className="text-slate-400 group-hover:text-slate-200 font-mono text-[10px] uppercase tracking-widest">
            Reload Interface
          </span>
        </button>

        {/* Subtle background detail */}
        <div className="fixed bottom-8 opacity-20">
          <p className="text-[8px] font-mono text-slate-700 uppercase tracking-[1em]">
            Connection Timeout: 30s
          </p>
        </div>
      </div>
    );
  }

  const currentPlayer = currentRoom.players.find((p) => p.guestId === guestId);

  // Event Handlers
  const handleStartGame = () => {
    const socket = getSocket();
    socket.emit("START_GAME", { roomCode: currentRoom.roomCode });
  };

  const handleSendClue = (clue: string) => {
    const socket = getSocket();
    socket.emit("SEND_CLUE", {
      roomCode: currentRoom.roomCode,
      text: clue,
      sender: username,
      id: `clue_${Date.now()}`,
    });
  };

  const handleVote = (targetId: string) => {
    const socket = getSocket();
    socket.emit("SUBMIT_VOTE", {
      roomCode: currentRoom.roomCode,
      targetId,
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Persistent Header */}
        <div className="mb-6">
          <GameHeader
            roomCode={currentRoom.roomCode}
            mode={currentRoom.mode}
            onLeave={onLeaveRoom}
          />
        </div>

        {/* Phase Container: This is the "Stage" */}
        <main className="flex-grow flex flex-col justify-center transition-all duration-500">
          <div className="w-full max-w-2xl mx-auto">
            {currentRoom.phase === "LOBBY" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <LobbyPhase
                  players={currentRoom.players}
                  currentPlayerId={guestId}
                  isHost={currentPlayer?.isHost || false}
                  onStartGame={handleStartGame}
                />
              </div>
            )}

            {currentRoom.phase === "ROLE_REVEAL" && currentPlayer && (
              <RoleRevealPhase currentPlayer={currentPlayer} />
            )}

            {currentRoom.phase === "SPEAKING" && (
              <SpeakingPhase
                players={currentRoom.players}
                clues={currentRoom.clues}
                currentSpeakerIndex={currentRoom.currentSpeakerIndex}
                currentPlayerId={guestId}
                onSendClue={handleSendClue}
              />
            )}

            {currentRoom.phase === "VOTING" && (
              <VotingPhase
                players={currentRoom.players}
                currentPlayerId={guestId}
                onVote={handleVote}
              />
            )}

            {currentRoom.phase === "RESULT" && (
              <ResultPhase players={currentRoom.players} />
            )}

            {currentRoom.phase === "GAME_OVER" && (
              <GameOverPhase
                winner={currentRoom.winner}
                players={currentRoom.players}
                onLeaveRoom={onLeaveRoom}
              />
            )}
          </div>
        </main>

        {/* Footer Sidebar: Active Players 
            Shown only during active gameplay phases  */}
        {currentRoom.phase !== "LOBBY" && currentRoom.phase !== "GAME_OVER" && (
          <aside className="mt-8 border-t border-slate-800/50 pt-6 animate-in fade-in duration-1000">
            <div className="flex items-center gap-2 mb-4 px-2">
              <ShieldAlert size={14} className="text-slate-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Live Operative Status
              </h3>
            </div>
            <PlayersPanel players={currentRoom.players} />
          </aside>
        )}
      </div>
    </div>
  );
};
