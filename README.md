# Shadow Signal - Frontend

> Real-time multiplayer social deduction game client built with Next.js, TypeScript, and Socket.io.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Screen Flow](#screen-flow)
- [State Management](#state-management)
- [Real-time Communication](#real-time-communication)
- [Game Components](#game-components)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

The Shadow Signal frontend is a responsive, real-time multiplayer game client that provides:
- Seamless username and room management
- Real-time game state synchronization
- Phase-based UI transitions (Lobby → Role Reveal → Speaking → Voting → Result)
- Mobile-friendly design with intuitive controls
- Toast notifications for errors and events
- Persistent user identity across sessions

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Redux Toolkit** | Client-side state management |
| **Socket.io Client** | Real-time WebSocket communication |
| **Tailwind CSS** | Utility-first styling |
| **localStorage** | Persistent user identity |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── favicon.ico         # Game icon
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main game orchestrator
│   │   └── providers.tsx       # Redux provider wrapper
│   ├── components/
│   │   ├── game/               # Game phase components
│   │   │   ├── GameOverPhase.tsx
│   │   │   ├── LobbyPhase.tsx
│   │   │   ├── PlayersPanel.tsx
│   │   │   ├── ResultPhase.tsx
│   │   │   ├── RoleRevealPhase.tsx
│   │   │   ├── SpeakingPhase.tsx
│   │   │   └── VotingPhase.tsx
│   │   ├── screens/            # Top-level screens
│   │   │   ├── GameScreen.tsx
│   │   │   ├── MenuScreen.tsx
│   │   │   └── UsernameScreen.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── ErrorToast.tsx
│   │       └── GameHeader.tsx
│   ├── libs/
│   │   └── getGuestId.ts       # localStorage utilities
│   ├── services/
│   │   └── socket.ts           # Socket.io singleton
│   ├── store/
│   │   ├── gameSlice.ts        # Redux game state
│   │   └── index.ts            # Redux store config
│   └── types/
│       └── game.ts             # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local
```

---

## Architecture

### **Screen-Based Architecture**

The app uses a **3-screen pattern** controlled by `page.tsx`:

```
UsernameScreen → MenuScreen → GameScreen
      ↓              ↓            ↓
   Set name    Create/Join    Play game
```

Each screen is a self-contained component that handles its own UI logic.

### **Component Hierarchy**

```
page.tsx 
├── UsernameScreen
├── MenuScreen
│   ├── Connection Status
│   ├── Create Room (Mode Selector)
│   └── Join Room (Code Input)
└── GameScreen
    ├── GameHeader (Room Code, Leave Button)
    └── Phase Components (Dynamic)
        ├── LobbyPhase
        ├── RoleRevealPhase
        ├── SpeakingPhase
        ├── VotingPhase
        ├── ResultPhase
        └── GameOverPhase
```

### **State Management Strategy**

```
Redux Store (Client State)
├── guestId: Unique user identifier
├── username: Display name
├── currentRoom: Full game state from server
├── isConnected: Socket connection status
└── error: Error messages

Socket.io (Real-time Sync)
└── Receives GAME_STATE_UPDATE → Updates Redux
```

**Data Flow:**
```
User Action → Socket Emit → Server Processing → 
Server Broadcast → Socket Receive → Redux Update → UI Re-render
```

---

## 🎮 Screen Flow

### **1. Username Screen**

**Purpose:** First-time user onboarding or username change.

**Features:**
- Input validation (min 2 characters)
- Stores username in `localStorage`
- Auto-skip if username exists
- Clean, centered design

**Flow:**
```typescript
User enters name → setStoredUsername() → 
dispatch(setUsername()) → Navigate to Menu
```

---

### **2. Menu Screen**

**Purpose:** Main hub for creating or joining games.

**Features:**
- **Connection Status Indicator** 
- **Create Room:** Choose Infiltrator or Spy mode
- **Join Room:** Enter 4-character room code
- **Change Username:** Return to username screen

**Socket Events:**
```typescript
// Create Room
socket.emit("CREATE_ROOM", { 
  hostName, 
  guestId, 
  mode: "INFILTRATOR" | "SPY" 
});

// Join Room
socket.emit("JOIN_ROOM", { 
  roomCode, 
  name, 
  guestId 
});
```

---

### **3. Game Screen**

**Purpose:** Main gameplay interface with phase-based rendering.

**Features:**
- **Dynamic Phase Rendering:** Shows appropriate UI for current game phase
- **Game Header:** Displays room code and leave button
- **Players Panel:** Live player list with status indicators
- **Phase Transitions:** Smooth animations between phases

**Phase Rendering Logic:**
```typescript
switch (currentRoom.phase) {
  case "LOBBY": return <LobbyPhase />;
  case "ROLE_REVEAL": return <RoleRevealPhase />;
  case "SPEAKING": return <SpeakingPhase />;
  case "VOTING": return <VotingPhase />;
  case "RESULT": return <ResultPhase />;
  case "GAME_OVER": return <GameOverPhase />;
}
```

---

## 🧩 Game Components

### **LobbyPhase**

**Features:**
- Waiting room with player list
- "Start Game" button (host only)
- Real-time player join notifications
- Mode indicator (Infiltrator/Spy)

**Validation:**
```typescript
// Only host can start
// Minimum 3 players required
const canStart = isHost && players.length >= 3;
```

---

### **RoleRevealPhase**

**Features:**
- Dramatic role and word reveal
- Private information display (only you see your role)
- 5-second countdown to speaking phase
- Role-specific styling (Infiltrator/Spy gets red theme)

**Display Logic:**
```typescript
// Citizens/Agents see the secret word
// Infiltrator sees "NO WORD - BLEND IN!"
// Spy sees their decoy word
```

---

### **SpeakingPhase**

**Features:**
- **Turn Indicator:** Shows whose turn it is
- **30-Second Timer:** Countdown per speaker
- **Clue Input:** Text area for current speaker
- **Clue Feed:** Live scrolling list of all clues
- **AI Hints:** "SHADOW_SIGNAL_AI" provides subtle hints

**Turn Management:**
```typescript
const alivePlayers = players.filter(p => p.isAlive);
const currentSpeaker = alivePlayers[currentSpeakerIndex];

// Only current speaker can submit clue
const isMyTurn = currentSpeaker?.guestId === myGuestId;
```

**Submit Clue:**
```typescript
socket.emit("SEND_CLUE", { 
  roomCode, 
  text: clueText 
});
```

---

### **VotingPhase**

**Features:**
- Grid of alive player cards
- Click to vote
- Vote count displayed after voting
- "Waiting for others..." state

**Voting Logic:**
```typescript
// Can only vote once
// Cannot vote for yourself
socket.emit("SUBMIT_VOTE", { 
  roomCode, 
  targetId: selectedPlayer.guestId 
});
```

---

### **ResultPhase**

**Features:**
- Shows eliminated player (or "TIE - No elimination")
- Vote breakdown
- 5-second pause before next round or game over

---

### **GameOverPhase**

**Features:**
- Winner announcement
- Final player status (alive/eliminated)
- Role reveals for all players
- "Back to Menu" button

**Winner Display:**
```typescript
winner === "CITIZENS" || winner === "AGENTS" 
  ? "The majority wins!"
  : "The shadow prevails!";
```

---

## 🔄 State Management

### **Redux Slice: `gameSlice.ts`**

**State Shape:**
```typescript
interface GameState {
  guestId: string | null;          // Unique user ID
  username: string | null;          // Display name
  currentRoom: GameRoom | null;     // Full game state
  isConnected: boolean;             // Socket status
  error: string | null;             // Error messages
}
```

**Actions:**
```typescript
setGuestId(id)           // Set user identity
setUsername(name)        // Set display name
setCurrentRoom(room)     // Update game state
setConnected(status)     // Update connection status
setError(message)        // Show error toast
resetGame()              // Leave room, clear state
```

---

## Real-time Communication

### **Socket Service: `socket.ts`**

**Singleton Pattern:**
```typescript
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(backendUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};
```

**Why Singleton?**
- Prevents multiple socket connections
- Ensures consistent socket instance across components
- Efficient resource management

### **Event Listeners (in `page.tsx`)**

```typescript
socket.on("connect", () => {
  dispatch(setConnected(true));
});

socket.on("GAME_STATE_UPDATE", (room: GameRoom) => {
  dispatch(setCurrentRoom(room));
});

socket.on("ERROR", (message: string) => {
  dispatch(setError(message));
  setTimeout(() => dispatch(setError(null)), 3000);
});
```

---

## Persistent Identity

### **localStorage Strategy**

**Keys:**
- `shadowSignal_guestId`: Unique identifier (never changes)
- `shadowSignal_username`: Last used display name

**Guest ID Generation:**
```typescript
const generateGuestId = () => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
```

**Benefits:**
- Users can refresh without losing identity
- Reconnection to same room on disconnect
- Username remembered for future sessions

---

## Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm/yarn/pnpm
- Running backend server

### **Installation Steps**

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
touch .env.local

# 4. Add backend URL
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000" > .env.local

# 5. Run development server
npm run dev

# 6. Open browser
# Navigate to http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file in the frontend root:

```env
# Backend WebSocket URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# Production example:
# NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

**Important:**
- Variables must start with `NEXT_PUBLIC_` to be exposed to the browser
- Never commit `.env.local` to version control
- Update this URL when deploying to production

---

## Deployment

### **Vercel (Recommended for Next.js)**

#### **Step-by-Step Deployment:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Set Environment Variables**
   ```
   Key: NEXT_PUBLIC_BACKEND_URL
   Value: https://your-backend-url.com
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your game is live! 

---

### **Alternative Platforms**

| Platform | Next.js Support | Deployment Time |
|----------|-----------------|-----------------|
| **Vercel** | ✅ Native | ~2 min |
| **Netlify** | ✅ Good | ~3 min |
| **Cloudflare Pages** | ✅ Good | ~3 min |
| **Railway** | ✅ Docker | ~5 min |

---

## Styling Approach

### **Tailwind CSS Utility Classes**

The frontend uses Tailwind for all styling:


## 📱 Mobile Responsiveness

The UI is fully mobile-friendly:

---

## Key Technical Decisions

### **Why Next.js App Router?**
- Server and Client Components separation
- Built-in routing
- Optimized production builds
- Great developer experience

### **Why Redux Instead of Context API?**
- DevTools for debugging
- Predictable state updates
- Better performance for frequent updates

### **Why Singleton Socket Pattern?**
- Prevents multiple connections
- Easy to access from any component
- Clean disconnection handling

### **Why localStorage for Identity?**
- Simple persistence without backend
- Works offline
- No database needed for user sessions

---

## Scripts

```bash
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm start            # Start production server
```

---

## Common Issues & Solutions

### **Socket Not Connecting**
```bash
# Check if backend is running
curl http://localhost:4000

# Verify NEXT_PUBLIC_BACKEND_URL is set
echo $NEXT_PUBLIC_BACKEND_URL
```

### **Username Not Persisting**
```javascript
// Clear localStorage and try again
localStorage.clear();
window.location.reload();
```

### **Build Errors on Vercel**
- Ensure `NEXT_PUBLIC_BACKEND_URL` is set in Vercel environment variables
- Check TypeScript errors: `npm run build` locally first

---

## Performance Optimizations

1. **Socket Singleton:** Reuses connection across components
2. **Redux Selectors:** Only re-render when relevant state changes
3. **Next.js Image:** Optimized image loading (if used)
4. **Code Splitting:** Automatic by Next.js App Router

---

## Future Enhancements

- [ ] Add sound effects for game events
- [ ] Implement chat between rounds
- [ ] Add player avatars
- [ ] Game history and statistics
- [ ] Spectator mode
- [ ] Custom room settings (timer duration, etc.)

---

## License

This project is part of the Classy Endeavors assessment.

---

## Contributing

This is an assessment project, but feedback is welcome!
