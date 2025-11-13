export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type WeatherType = 'clear' | 'cloudy' | 'rainy' | 'stormy';

export class TimeWeatherSystem {
  private currentTime: number = 0; // 0-24000 (24 hours in minutes)
  private timeSpeed: number = 60; // Real seconds per game hour
  private currentWeather: WeatherType = 'clear';
  private weatherDuration: number = 0;
  private weatherChangeChance: number = 0.01; // Chance per update to change weather
  
  public getTimeOfDay(): TimeOfDay {
    const hour = (this.currentTime / 1000) % 24;
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 19) return 'day';
    if (hour >= 19 && hour < 21) return 'dusk';
    return 'night';
  }
  
  public getCurrentTime(): number {
    return this.currentTime;
  }
  
  public getHour(): number {
    return (this.currentTime / 1000) % 24;
  }
  
  public getMinute(): number {
    return ((this.currentTime / 1000) * 60) % 60;
  }
  
  public getWeather(): WeatherType {
    return this.currentWeather;
  }
  
  public getTimeProgress(): number {
    // Returns 0-1 representing progress through the day
    return (this.currentTime / 1000) % 24 / 24;
  }
  
  public getLightLevel(): number {
    // Returns 0-1 for light level (0 = darkest, 1 = brightest)
    const timeOfDay = this.getTimeOfDay();
    const hour = this.getHour();
    
    switch (timeOfDay) {
      case 'dawn':
        return 0.3 + ((hour - 5) / 2) * 0.7; // 5-7am: 0.3 to 1.0
      case 'day':
        return 1.0;
      case 'dusk':
        return 1.0 - ((hour - 19) / 2) * 0.7; // 7-9pm: 1.0 to 0.3
      case 'night':
        return 0.2;
      default:
        return 1.0;
    }
  }
  
  public update(delta: number): void {
    // Update time (delta is in milliseconds)
    const gameMinutes = (delta / 1000) * (60 / this.timeSpeed);
    this.currentTime += gameMinutes;
    
    // Update weather
    this.weatherDuration -= delta;
    if (this.weatherDuration <= 0 || Math.random() < this.weatherChangeChance) {
      this.changeWeather();
    }
  }
  
  private changeWeather(): void {
    const weathers: WeatherType[] = ['clear', 'cloudy', 'rainy', 'stormy'];
    const weights = [0.4, 0.3, 0.2, 0.1]; // Clear is most common
    
    let rand = Math.random();
    let sum = 0;
    for (let i = 0; i < weathers.length; i++) {
      sum += weights[i];
      if (rand <= sum) {
        this.currentWeather = weathers[i];
        this.weatherDuration = Phaser.Math.Between(30000, 120000); // 30s to 2min
        break;
      }
    }
  }
  
  public setTime(hour: number, minute: number = 0): void {
    this.currentTime = (hour * 1000) + (minute * 1000 / 60);
  }
  
  public setWeather(weather: WeatherType): void {
    this.currentWeather = weather;
    this.weatherDuration = Phaser.Math.Between(30000, 120000);
  }
}

