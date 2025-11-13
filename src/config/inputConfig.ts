export const InputConfig = {
  // Keyboard bindings
  KEYS: {
    UP: ['W', 'ArrowUp'],
    DOWN: ['S', 'ArrowDown'],
    LEFT: ['A', 'ArrowLeft'],
    RIGHT: ['D', 'ArrowRight'],
    INTERACT: ['E', 'Space'],
    INVENTORY: ['I'],
    MENU: ['Escape'],
  },
  
  // Gamepad settings
  GAMEPAD: {
    DEADZONE: 0.2,
    STICK_SENSITIVITY: 0.5,
  },
} as const;

