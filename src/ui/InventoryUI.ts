import { InventorySystem } from '@systems/InventorySystem';

export class InventoryUI {
  private container?: Phaser.GameObjects.Container;
  private isOpen: boolean = false;
  private inventorySlots: Phaser.GameObjects.Rectangle[] = [];
  private itemSprites: Map<number, Phaser.GameObjects.Text> = new Map();
  private slotContainers: Phaser.GameObjects.Container[] = [];
  private scene: Phaser.Scene;
  private inventory: InventorySystem;
  private overlay?: Phaser.GameObjects.Rectangle;
  private panelBg?: Phaser.GameObjects.Rectangle;
  private innerBorder?: Phaser.GameObjects.Rectangle;
  private titleUnderline?: Phaser.GameObjects.Rectangle;
  private title?: Phaser.GameObjects.Text;
  private closeBtn?: Phaser.GameObjects.Rectangle;
  private closeText?: Phaser.GameObjects.Text;
  private instructions?: Phaser.GameObjects.Text;
  private selectedSlot: number = 0;
  private escKeyHandler?: () => void;
  private iKeyHandler?: () => void;
  private arrowKeyHandlers?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene, inventory: InventorySystem) {
    this.scene = scene;
    this.inventory = inventory;
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;

    // Game will be paused by checking isInventoryOpen() in update loop

    const { width, height } = this.scene.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Main background (dark overlay) - much higher depth
    this.overlay = this.scene.add.rectangle(
      centerX,
      centerY,
      width * 2,
      height * 2,
      0x000000,
      0.85
    );
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(10000);
    this.overlay.setInteractive();
    this.overlay.setOrigin(0.5);

    // Inventory panel background (cleaner, more professional design)
    const panelWidth = 500;
    const panelHeight = 400;
    this.panelBg = this.scene.add.rectangle(
      centerX,
      centerY,
      panelWidth,
      panelHeight,
      0x2C2C2C,
      1
    );
    this.panelBg.setStrokeStyle(3, 0x4A4A4A, 1);
    this.panelBg.setScrollFactor(0);
    this.panelBg.setDepth(10001);
    
    // Inner border for depth
    this.innerBorder = this.scene.add.rectangle(
      centerX,
      centerY,
      panelWidth - 6,
      panelHeight - 6,
      0x1A1A1A,
      0
    );
    this.innerBorder.setStrokeStyle(1, 0x555555, 1);
    this.innerBorder.setScrollFactor(0);
    this.innerBorder.setDepth(10002);

    // Title with better styling
    this.title = this.scene.add.text(
      centerX,
      centerY - 170,
      'INVENTORY',
      {
        fontSize: '28px',
        color: '#FFFFFF',
        fontStyle: 'bold',
        letterSpacing: 2,
      }
    );
    this.title.setOrigin(0.5);
    this.title.setScrollFactor(0);
    this.title.setDepth(10002);
    
    // Title underline
    this.titleUnderline = this.scene.add.rectangle(
      centerX,
      centerY - 150,
      panelWidth - 40,
      2,
      0x4A4A4A,
      1
    );
    this.titleUnderline.setScrollFactor(0);
    this.titleUnderline.setDepth(10002);

    // Create inventory grid (9x3 = 27 slots, cleaner design)
    const slotSize = 48;
    const slotSpacing = 6;
    const startX = centerX - (9 * (slotSize + slotSpacing)) / 2 + slotSize / 2;
    const startY = centerY - 60;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        const x = startX + col * (slotSize + slotSpacing);
        const y = startY + row * (slotSize + slotSpacing);
        const slotIndex = row * 9 + col;

        // Slot background (cleaner design)
        const slotBg = this.scene.add.rectangle(
          x,
          y,
          slotSize,
          slotSize,
          0x1A1A1A,
          1
        );
        slotBg.setStrokeStyle(2, 0x3A3A3A, 1);
        slotBg.setScrollFactor(0);
        slotBg.setDepth(10002);
        slotBg.setInteractive({ useHandCursor: true });
        (slotBg as any).slotIndex = slotIndex; // Store index for reference
        
        // Hover effect
        slotBg.on('pointerover', () => {
          this.selectedSlot = slotIndex;
          this.updateSlotSelection(slotIndex);
        });
        slotBg.on('pointerout', () => {
          // Keep selection on keyboard navigation
        });
        slotBg.on('pointerdown', () => {
          this.selectedSlot = slotIndex;
          this.updateSlotSelection(slotIndex);
          // Could add item interaction here later
        });

        this.inventorySlots.push(slotBg);

        // Create container for slot items
        const slotContainer = this.scene.add.container(x, y);
        slotContainer.setScrollFactor(0);
        slotContainer.setDepth(10003);
        this.slotContainers.push(slotContainer);

        // Add item if exists
        this.updateSlot(slotIndex, x, y);
      }
    }

    // Close button (better design)
    this.closeBtn = this.scene.add.rectangle(
      centerX + panelWidth / 2 - 25,
      centerY - panelHeight / 2 + 25,
      35,
      35,
      0x3A3A3A,
      1
    );
    this.closeBtn.setStrokeStyle(2, 0x5A5A5A, 1);
    this.closeBtn.setScrollFactor(0);
    this.closeBtn.setDepth(10002);
    this.closeBtn.setInteractive({ useHandCursor: true });
    
    this.closeBtn.on('pointerover', () => {
      this.closeBtn?.setFillStyle(0x5A5A5A, 1);
    });
    this.closeBtn.on('pointerout', () => {
      this.closeBtn?.setFillStyle(0x3A3A3A, 1);
    });
    this.closeBtn.on('pointerdown', () => {
      this.close();
    });

    this.closeText = this.scene.add.text(
      centerX + panelWidth / 2 - 25,
      centerY - panelHeight / 2 + 25,
      '✕',
      {
        fontSize: '20px',
        color: '#FFFFFF',
        fontStyle: 'bold',
      }
    );
    this.closeText.setOrigin(0.5);
    this.closeText.setScrollFactor(0);
    this.closeText.setDepth(10003);

    // Instructions
    this.instructions = this.scene.add.text(
      centerX,
      centerY + 170,
      'Press I or ESC to close',
      {
        fontSize: '12px',
        color: '#888888',
        fontStyle: 'italic',
      }
    );
    this.instructions.setOrigin(0.5);
    this.instructions.setScrollFactor(0);
    this.instructions.setDepth(10002);

    // Close on ESC or I (reusable handlers)
    const escKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    const iKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    
    this.escKeyHandler = () => {
      this.close();
    };
    
    this.iKeyHandler = () => {
      this.close();
    };
    
    if (escKey) {
      escKey.on('down', this.escKeyHandler);
    }
    if (iKey) {
      iKey.on('down', this.iKeyHandler);
    }
    
    // Arrow key navigation
    this.arrowKeyHandlers = {
      up: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    };
    
    // Highlight first slot
    this.updateSlotSelection(0);
  }

  private updateSlot(slotIndex: number, x: number, y: number): void {
    // Remove old item sprites if exist
    const oldItemText = this.itemSprites.get(slotIndex * 2);
    const oldQtyText = this.itemSprites.get(slotIndex * 2 + 1);
    if (oldItemText) {
      oldItemText.destroy();
      this.itemSprites.delete(slotIndex * 2);
    }
    if (oldQtyText) {
      oldQtyText.destroy();
      this.itemSprites.delete(slotIndex * 2 + 1);
    }

    // Get all items from inventory
    const allItems = this.inventory.getAllItems();
    if (slotIndex < allItems.length && allItems[slotIndex] && allItems[slotIndex].quantity > 0) {
      const item = allItems[slotIndex];
      
      // Item name (truncated, better styling)
      const itemText = this.scene.add.text(
        x,
        y - 10,
        item.name.substring(0, 6),
        {
          fontSize: '11px',
          color: '#E0E0E0',
          fontStyle: 'bold',
        }
      );
      itemText.setOrigin(0.5);
      itemText.setScrollFactor(0);
      itemText.setDepth(10003);
      this.itemSprites.set(slotIndex * 2, itemText);

      // Quantity badge (if more than 1)
      if (item.quantity > 1) {
        const qtyText = this.scene.add.text(
          x + 18,
          y + 18,
          item.quantity.toString(),
          {
            fontSize: '14px',
            color: '#FFFFFF',
            fontStyle: 'bold',
            backgroundColor: '#4A90E2',
            padding: { x: 4, y: 2 },
          }
        );
        qtyText.setOrigin(0.5);
        qtyText.setScrollFactor(0);
        qtyText.setDepth(10004);
        this.itemSprites.set(slotIndex * 2 + 1, qtyText);
      }
    }
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;

    // Game will resume automatically when inventory closes

    // Destroy all individual elements
    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = undefined;
    }
    if (this.panelBg) {
      this.panelBg.destroy();
      this.panelBg = undefined;
    }
    if (this.title) {
      this.title.destroy();
      this.title = undefined;
    }
    if (this.closeBtn) {
      this.closeBtn.destroy();
      this.closeBtn = undefined;
    }
    if (this.closeText) {
      this.closeText.destroy();
      this.closeText = undefined;
    }
    if (this.instructions) {
      this.instructions.destroy();
      this.instructions = undefined;
    }
    if (this.innerBorder) {
      this.innerBorder.destroy();
      this.innerBorder = undefined;
    }
    if (this.titleUnderline) {
      this.titleUnderline.destroy();
      this.titleUnderline = undefined;
    }

    // Clean up slots
    this.inventorySlots.forEach(slot => {
      if (slot) {
        slot.destroy();
      }
    });
    this.inventorySlots = [];
    
    // Clean up slot containers
    this.slotContainers.forEach(container => {
      if (container) {
        container.destroy();
      }
    });
    this.slotContainers = [];
    
    // Clean up item sprites
    this.itemSprites.forEach(sprite => {
      if (sprite) {
        sprite.destroy();
      }
    });
    this.itemSprites.clear();

    // Destroy container if it exists
    if (this.container) {
      this.container.destroy(true);
      this.container = undefined;
    }
    
    // Clean up any remaining children that might be inventory-related
    const children = this.scene.children.getChildren();
    children.forEach(child => {
      if (child && (child as any).depth >= 10000 && (child as any).depth < 20000) {
        child.destroy();
      }
    });
    
    // Remove key handlers
    if (this.escKeyHandler) {
      const escKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      if (escKey) {
        escKey.off('down', this.escKeyHandler);
      }
      this.escKeyHandler = undefined;
    }
    
    if (this.iKeyHandler) {
      const iKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.I);
      if (iKey) {
        iKey.off('down', this.iKeyHandler);
      }
      this.iKeyHandler = undefined;
    }
    
    this.arrowKeyHandlers = undefined;
    this.selectedSlot = 0;
  }
  
  private updateSlotSelection(slotIndex: number): void {
    // Update all slot appearances
    this.inventorySlots.forEach((slot, index) => {
      if (index === slotIndex) {
        // Selected slot - highlight
        slot.setFillStyle(0x3A3A3A, 1);
        slot.setStrokeStyle(3, 0x5A90E2, 1);
      } else {
        // Unselected slot - normal
        slot.setFillStyle(0x1A1A1A, 1);
        slot.setStrokeStyle(2, 0x3A3A3A, 1);
      }
    });
  }
  
  public updateNavigation(): void {
    if (!this.isOpen || !this.arrowKeyHandlers) return;
    
    let moved = false;
    
    // Handle arrow key navigation
    if (Phaser.Input.Keyboard.JustDown(this.arrowKeyHandlers.up)) {
      if (this.selectedSlot >= 9) {
        this.selectedSlot -= 9;
        moved = true;
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.arrowKeyHandlers.down)) {
      if (this.selectedSlot < 18) {
        this.selectedSlot += 9;
        moved = true;
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.arrowKeyHandlers.left)) {
      if (this.selectedSlot % 9 > 0) {
        this.selectedSlot -= 1;
        moved = true;
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.arrowKeyHandlers.right)) {
      if (this.selectedSlot % 9 < 8) {
        this.selectedSlot += 1;
        moved = true;
      }
    }
    
    if (moved) {
      this.updateSlotSelection(this.selectedSlot);
    }
  }

  public isInventoryOpen(): boolean {
    return this.isOpen;
  }

  public refresh(): void {
    if (this.isOpen) {
      // Refresh all slots
      const { width, height } = this.scene.cameras.main;
      const centerX = width / 2;
      const centerY = height / 2;
      const slotSize = 48;
      const slotSpacing = 6;
      const startX = centerX - (9 * (slotSize + slotSpacing)) / 2 + slotSize / 2;
      const startY = centerY - 60;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          const x = startX + col * (slotSize + slotSpacing);
          const y = startY + row * (slotSize + slotSpacing);
          const slotIndex = row * 9 + col;
          this.updateSlot(slotIndex, x, y);
        }
      }
    }
  }
}

