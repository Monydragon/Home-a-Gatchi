# Home-a-Gatchi

A 2D top-down Tamagotchi-style open world game combining elements from Sims, Grand Theft Auto, and Tamagotchi.

## Game Overview

Home-a-Gatchi is an open-world game where you care for a virtual pet while exploring a vast world, completing quests, collecting monsters through a gacha system, and interacting with NPCs. The game features AI-generated content including art, music, and story elements.

## Features

- **2D Top-Down Gameplay**: Explore an open world from above
- **Tamagotchi Pet Care**: Manage your pet's hunger, happiness, health, energy, and cleanliness
- **Open World Exploration**: Discover new areas and unlock content
- **NPC Interactions**: Meet unique characters and complete quests
- **Gacha System**: Collect monsters of varying rarities (Common, Uncommon, Rare, Legendary, Mythic)
- **Mini-Games**: Play games to earn rewards and care for your pet
- **Controller Support**: Full keyboard, mouse, and gamepad support
- **AI-Generated Content**: Art, music, and story elements managed by AI

## Tech Stack

- **Phaser 3**: 2D game framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Zustand**: State management

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Home-a-Gatchi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Controls

- **Movement**: WASD or Arrow Keys
- **Gamepad**: Left stick or D-pad for movement
- **Interact**: E key or Gamepad A button
- **Inventory**: I key or Gamepad X button
- **Menu**: ESC key or Gamepad Start button

## Project Structure

```
Home-a-Gatchi/
├── src/
│   ├── core/           # Core game systems
│   ├── entities/       # Game entities (Player, Pet, NPCs)
│   ├── systems/        # Game systems (Pet care, inventory, quests)
│   ├── world/          # World and map management
│   ├── ui/             # User interface components
│   ├── config/         # Configuration files
│   ├── scenes/         # Phaser scenes
│   └── utils/          # Utility functions
├── assets/             # Game assets (sprites, tiles, audio)
└── public/             # Static files
```

## Development Roadmap

### Phase 1: Core Foundation ✅
- [x] Project setup with Phaser 3 + TypeScript
- [x] Player movement and controls
- [x] Basic world map display
- [x] Controller support
- [x] Core game engine structure

### Phase 2: Core Gameplay (In Progress)
- [ ] Pet entity with stat system
- [ ] Mini-games
- [ ] NPC system
- [ ] Quest system
- [ ] Currency and inventory

### Phase 3: Gacha & Expansion
- [ ] Gacha system
- [ ] Monster collection
- [ ] World expansion
- [ ] Area unlock system

### Phase 4: AI Integration & Polish
- [ ] AI content generation
- [ ] Dynamic quest generation
- [ ] Sound effects and music
- [ ] UI/UX polish

## License

[Your License Here]

## Contributing

[Contributing Guidelines Here]
