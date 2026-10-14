import { POWER_UPS, type PowerUpKind } from '../config/pickups';

// Tracks which power-ups are active and for how long.
export class PowerUps {
  private timers: Record<PowerUpKind, number> = { speed: 0, shield: 0, magnet: 0 };

  activate(kind: PowerUpKind): void {
    this.timers[kind] = POWER_UPS[kind].duration;
  }

  isActive(kind: PowerUpKind): boolean {
    return this.timers[kind] > 0;
  }

  /** Uses up the shield. Returns true if there was one to absorb the hit. */
  consumeShield(): boolean {
    if (!this.isActive('shield')) return false;
    this.timers.shield = 0;
    return true;
  }

  update(dt: number): void {
    for (const k of Object.keys(this.timers) as PowerUpKind[]) this.timers[k] = Math.max(0, this.timers[k] - dt);
  }

  /** Active power-ups with seconds left, for the HUD. */
  list(): { kind: PowerUpKind; left: number }[] {
    return (Object.keys(this.timers) as PowerUpKind[]).filter((k) => this.timers[k] > 0).map((k) => ({ kind: k, left: this.timers[k] }));
  }

  reset(): void {
    this.timers = { speed: 0, shield: 0, magnet: 0 };
  }
}
