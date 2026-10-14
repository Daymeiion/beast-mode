# Progress

## Done
- **Milestone 0: Setup.** Vite + Three.js + TypeScript, placeholder beast built from the character sheet colors, Training Ground preview (turf, yard lines, dummies, cones), character editor panel (name, species, jersey number, colors, body shape, gear toggles) saved in the browser, Vercel config.

- **Milestone 1: Core runner.** Endless 3-lane track built from recycled tiles, beast runs and speeds up over time, lane switch / jump / slide on keyboard and swipe, running animation, chase camera, garage screen (Esc or pause button) where the beast turns to face you and the editor opens, distance and speed HUD, live tuning panel (` key) backed by `src/config/tuning.ts`.

- **Milestone 2: Obstacles and collisions.** Five obstacle types (dummy and sled to dodge, hurdle and cone to jump, yellow low bar to slide under) spawn in rows that always leave a way through. Rows get closer and doubles get more common the farther you run. A hit knocks the obstacle flying, costs speed, shakes the camera and flashes the beast. Hits shown in the HUD, "New run" button in the garage. Obstacle sizes and difficulty live in `src/config/obstacles.ts`.

- **Milestone 3: Pickups and power-ups.** Football trails give XP (floating over hurdles/cones to reward jumps, low under bars, never inside dodge-only obstacles). Power-up orbs: Speed Boost (faster, smash through obstacles), Shield (bubble that absorbs one hit), Magnet (pulls nearby footballs in). HUD shows run XP and active power-ups with timers; total XP is saved in the browser and shown in the garage. Debug panel (`) can hand out power-ups for testing. Values in `src/config/pickups.ts`.

## Next: Milestone 4, gear and leveling
- Garage screen with gear slots: helmet, gloves, cleats, skill move
- Spend total XP to unlock gear; each piece changes stats (helmet absorbs a hit, gloves widen pickup radius, cleats raise top speed and jump)
- Skill moves on a cooldown: spin, juke, stiff arm

## Fun ideas (parking lot)
- Celebration emote after a race
- Weather on the Training Ground (rain slows you, snow game)
