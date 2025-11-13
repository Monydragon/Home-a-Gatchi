export class AudioManager {
  private scene: Phaser.Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
  private music?: Phaser.Sound.BaseSound;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public playSound(key: string, volume: number = this.sfxVolume): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.play({ volume });
    } else {
      const newSound = this.scene.sound.add(key);
      this.sounds.set(key, newSound);
      newSound.play({ volume });
    }
  }

  public playMusic(key: string, loop: boolean = true, volume: number = this.musicVolume): void {
    this.stopMusic();
    const music = this.scene.sound.add(key, { loop, volume });
    this.music = music;
    music.play();
  }

  public stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music = undefined;
    }
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.setVolume(this.musicVolume);
    }
  }

  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

