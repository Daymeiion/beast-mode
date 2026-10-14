// Obstacle types and difficulty as plain data. Sizes are in world units;
// `bottom` is how high off the ground the obstacle's hitbox starts.
export type ObstacleKind = 'dummy' | 'hurdle' | 'lowBar' | 'cone' | 'sled';

/** How the player gets past it without changing lanes. */
export type Counter = 'dodge' | 'jump' | 'slide';

export interface ObstacleDef {
  width: number;
  height: number;
  depth: number;
  bottom: number;
  counter: Counter;
  color: string;
}

export const OBSTACLES: Record<ObstacleKind, ObstacleDef> = {
  dummy: { width: 0.8, height: 1.7, depth: 0.8, bottom: 0, counter: 'dodge', color: '#d43b2a' },
  sled: { width: 1.8, height: 1.4, depth: 1.2, bottom: 0, counter: 'dodge', color: '#3c4a5c' },
  hurdle: { width: 1.9, height: 0.8, depth: 0.2, bottom: 0, counter: 'jump', color: '#f2f2f2' },
  cone: { width: 0.5, height: 0.5, depth: 0.5, bottom: 0, counter: 'jump', color: '#ff8a1f' },
  lowBar: { width: 2.0, height: 0.25, depth: 0.25, bottom: 1.3, counter: 'slide', color: '#ffd23a' },
};

export const DIFFICULTY = {
  safeStart: 40, // distance with no obstacles at the start of a run
  rowGapStart: 20, // distance between obstacle rows at the start
  rowGapMin: 9, // closest rows ever get
  rowGapShrinkPer100: 1.2, // how fast rows get closer as you go
  doubleRowChanceStart: 0.1, // chance a row has two obstacles
  doubleRowChanceMax: 0.6,
  spawnAhead: 120, // how far ahead rows exist
};

export const STUMBLE = {
  speedMultiplier: 0.55, // speed kept after a hit
  invulnerableTime: 1.2, // seconds of flashing after a hit
};
