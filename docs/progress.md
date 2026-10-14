# Progress

## Done
- **Milestone 0: Setup.** Vite + Three.js + TypeScript, placeholder beast built from the character sheet colors, Training Ground preview (turf, yard lines, dummies, cones), character editor panel (name, species, jersey number, colors, body shape, gear toggles) saved in the browser, Vercel config.

- **Milestone 1: Core runner.** Endless 3-lane track built from recycled tiles, beast runs and speeds up over time, lane switch / jump / slide on keyboard and swipe, running animation, chase camera, garage screen (Esc or pause button) where the beast turns to face you and the editor opens, distance and speed HUD, live tuning panel (` key) backed by `src/config/tuning.ts`.

- **Milestone 2: Obstacles and collisions.** Five obstacle types (dummy and sled to dodge, hurdle and cone to jump, yellow low bar to slide under) spawn in rows that always leave a way through. Rows get closer and doubles get more common the farther you run. A hit knocks the obstacle flying, costs speed, shakes the camera and flashes the beast. Hits shown in the HUD, "New run" button in the garage. Obstacle sizes and difficulty live in `src/config/obstacles.ts`.

## Next: Milestone 3, pickups and power-ups
- XP footballs along the lanes (some up high to reward jumps)
- Power-ups: speed boost, shield (absorbs one hit), magnet
- HUD shows XP and the active power-up with its timer

## Fun ideas (parking lot)
- Celebration emote after a race
- Weather on the Training Ground (rain slows you, snow game)
