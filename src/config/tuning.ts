// Runner feel. Tweak these live from the debug panel (press ` to toggle) and copy good values back here.
export const TUNING = {
  laneWidth: 2.2,
  laneCount: 3,
  laneSwitchSpeed: 14, // units per second sideways

  startSpeed: 10, // units per second forward
  maxSpeed: 26,
  acceleration: 0.35, // speed gained per second

  gravity: 38,
  jumpVelocity: 13,
  slideDuration: 0.65, // seconds
  slideHeightScale: 0.5,

  tileLength: 20,
  tilesAhead: 8,
  tilesBehind: 1,

  camera: { height: 4.2, distance: 7.5, lookAhead: 6, followLerp: 8 },
};

export type Tuning = typeof TUNING;
