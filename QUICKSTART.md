# Quick Start Guide

## Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   The game will automatically open at `http://localhost:3000`

## Current Features

### ✅ Implemented (Phase 1 - Core Foundation)

- **Player Movement**: WASD/Arrow keys or gamepad left stick
- **2D Top-Down World**: Procedurally generated tile-based map
- **Camera System**: Smooth camera following the player
- **Controller Support**: Full gamepad support (Xbox/PlayStation controllers)
- **Input System**: Unified input handling for keyboard, mouse, and gamepad
- **Scene Management**: Main menu and game scene
- **Save System**: LocalStorage-based save/load (ready for implementation)

### 🎮 Controls

- **Movement**: WASD or Arrow Keys
- **Gamepad**: Left stick or D-pad
- **Interact**: E key or Gamepad A button
- **Inventory**: I key or Gamepad X button
- **Menu**: ESC key or Gamepad Start button

## Project Structure

All core systems are in place:

- ✅ Core engine (Input, Scene, Save systems)
- ✅ Entity system (Player, Pet, NPC base classes)
- ✅ World system (Map, Camera, Areas)
- ✅ Game systems (Pet Care, Inventory, Quest, Dialogue)
- ✅ UI framework (HUD, Dialogue, Character Creator)
- ✅ Configuration system
- ✅ Utility classes (Asset Loader, Audio, Animation)

## Next Steps (Phase 2)

1. Integrate Pet entity into GameScene
2. Add mini-games
3. Implement NPC interactions
4. Create quest system integration
5. Add currency and shop system

## Testing Controller Support

1. Connect a gamepad (Xbox/PlayStation controller)
2. Press any button to activate
3. Use left stick or D-pad to move
4. Check browser console for "Gamepad connected" message

