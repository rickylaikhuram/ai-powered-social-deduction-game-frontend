import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GameRoom } from '@/types/game';

const initialState: GameState = {
  guestId: null,
  username: null,
  currentRoom: null,
  isConnected: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGuestId: (state, action: PayloadAction<string>) => {
      state.guestId = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<GameRoom | null>) => {
      state.currentRoom = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetGame: (state) => {
      state.currentRoom = null;
      state.error = null;
    },
  },
});

export const {
  setGuestId,
  setUsername,
  setCurrentRoom,
  setConnected,
  setError,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;