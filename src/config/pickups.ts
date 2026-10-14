// XP footballs and power-ups as plain data.
export type PowerUpKind = 'speed' | 'shield' | 'magnet';

export const FOOTBALLS = {
  xpEach: 1,
  trailLength: 6, // footballs per trail
  spacing: 2.2, // distance between footballs in a trail
  trailGapMin: 14, // distance between trails
  trailGapMax: 26,
  overJumpHeight: 2.0, // footballs over hurdles/cones float this high (reward the jump)
  underSlideHeight: 0.45, // footballs under low bars sit this low
  collectRadius: 1.1,
};

export interface PowerUpDef {
  label: string;
  color: string;
  duration: number; // seconds (shield lasts until it absorbs a hit or runs out)
}

export const POWER_UPS: Record<PowerUpKind, PowerUpDef> = {
  speed: { label: 'Speed Boost', color: '#ff6a13', duration: 4 },
  shield: { label: 'Shield', color: '#3fa9ff', duration: 15 },
  magnet: { label: 'Magnet', color: '#b05cff', duration: 8 },
};

export const POWER_UP_RULES = {
  firstAt: 80, // distance before the first power-up can appear
  gapMin: 110, // distance between power-ups
  gapMax: 180,
  speedMultiplier: 1.6, // speed boost: faster and smashes through obstacles
  magnetRadius: 7,
  magnetPull: 22, // units per second footballs fly toward you
};
