// src/app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setGuestId,
  setUsername,
  setCurrentRoom,
  setConnected,
  setError,
  resetGame,
} from "@/store/gameSlice";
import { getSocket } from "@/services/socket";
import {
  getStoredGuestId,
  getStoredUsername,
  setStoredUsername,
} from "@/libs/getGuestId";
import { UsernameScreen } from "@/components/screens/UsernameScreen";
import { MenuScreen } from "@/components/screens/MenuScreen";
import { GameScreen } from "@/components/screens/GameScreen";
import { ErrorToast } from "@/components/ui/ErrorToast";
import { GameRoom, GameMode } from "@/types/game";

type Screen = "username" | "menu" | "game";

const ShadowSignalGame: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { guestId, username, error, isConnected } = useSelector(
    (state: RootState) => state.game,
  );
  const [screen, setScreen] = useState<Screen>("username");

  // Initialize guestId and username from localStorage
  useEffect(() => {
    const storedGuestId = getStoredGuestId();
    dispatch(setGuestId(storedGuestId));

    const storedUsername = getStoredUsername();
    if (storedUsername) {
      dispatch(setUsername(storedUsername));
      setScreen("menu");
    }
  }, [dispatch]);

  // Socket setup
  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      dispatch(setConnected(false));
    });

    socket.on("GAME_STATE_UPDATE", (room: GameRoom) => {
      dispatch(setCurrentRoom(room));
    });

    socket.on("ERROR", (message: string) => {
      dispatch(setError(message));
      setTimeout(() => dispatch(setError(null)), 3000);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("GAME_STATE_UPDATE");
      socket.off("ERROR");
    };
  }, [dispatch]);

  const handleSetUsername = (newUsername: string) => {
    setStoredUsername(newUsername);
    dispatch(setUsername(newUsername));
    setScreen("menu");
  };

  const handleCreateRoom = (mode: GameMode) => {
    if (!username || !guestId) return;
    const socket = getSocket();
    socket.emit("CREATE_ROOM", {
      hostName: username,
      guestId,
      mode,
    });
    setScreen("game");
  };

  const handleJoinRoom = (roomCode: string) => {
    if (!username || !guestId || !roomCode.trim()) return;
    const socket = getSocket();
    socket.emit("JOIN_ROOM", {
      roomCode: roomCode.toUpperCase(),
      name: username,
      guestId,
    });
    setScreen("game");
  };

  const handleLeaveRoom = () => {
    dispatch(resetGame());
    setScreen("menu");
  };

  if (screen === "username") {
    return (
      <UsernameScreen
        initialUsername={username || ""}
        onSubmit={handleSetUsername}
      />
    );
  }

  if (screen === "menu") {
    return (
      <>
        {error && <ErrorToast message={error} />}
        <MenuScreen
          username={username || ""}
          isConnected={isConnected}
          onChangeUsername={() => setScreen("username")}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      </>
    );
  }

  return (
    <>
      {error && <ErrorToast message={error} />}
      <GameScreen onLeaveRoom={handleLeaveRoom} />
    </>
  );
};

export default ShadowSignalGame;
