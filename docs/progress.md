# Progress

## Done
- **Milestone 0: Setup.** Vite + Three.js + TypeScript, placeholder beast built from the character sheet colors, Training Ground preview (turf, yard lines, dummies, cones), character editor panel (name, species, jersey number, colors, body shape, gear toggles) saved in the browser, Vercel config.

- **Milestone 1: Core runner.** Endless 3-lane track built from recycled tiles, beast runs and speeds up over time, lane switch / jump / slide on keyboard and swipe, running animation, chase camera, garage screen (Esc or pause button) where the beast turns to face you and the editor opens, distance and speed HUD, live tuning panel (` key) backed by `src/config/tuning.ts`.

## Next: Milestone 2, obstacles and collisions
- Obstacle patterns per tile: tackling dummies, cones, hurdles (jump), low bars (slide), sleds
- Hit = stumble (lose speed, short flash), not game over
- Speed ramps up with distance; pattern difficulty ramps too

## Fun ideas (parking lot)
- Celebration emote after a race
- Weather on the Training Ground (rain slows you, snow game)
