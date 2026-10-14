# Beast Mode

A 3D football-themed infinite runner/racer in the browser. You train a "beast" on the Training Ground, gear it up (helmet, gloves, cleats, skill moves) and race CPU runners. Fun side project: keep it small and playable.

**Current milestone:** see `docs/progress.md`. Game rules and tuning live in `docs/game-design.md`.
**Character design reference:** `docs/art/beast-character-sheet.jpg` (navy jersey, orange trim, #99, white pants, silver-rimmed pads).

## Stack and commands

- TypeScript + Vite + Three.js, lil-gui for editor/debug panels. Deployed on Vercel (`vercel.json`).
- `npm run dev` (local dev server), `npm run build` (typecheck + production build), `npm run typecheck`.

## Folder map

- `src/main.ts` boot, scene, game loop
- `src/core/` input, camera, time, save/load (localStorage)
- `src/world/` track, obstacles, pickups, Training Ground
- `src/entities/` player beast, CPU racers
- `src/systems/` collisions, power-ups, gear/stats, scoring
- `src/ui/` HUD, character editor, menus (HTML/CSS + lil-gui)
- `src/config/` tuning values and character data as plain data
- `public/assets/` models, textures, sounds

## Rules for the AI

- One system per file, keep files under ~300 lines.
- Characters are data: a beast is a `BeastConfig` (`src/config/beast.ts`). The editor, gear and saves change that data; rendering reads it. Never hard-code a beast's look or stats in logic.
- Tuning numbers (speeds, gravity, gear stats) go in `src/config/`, not inline.
- Placeholder primitives until milestone 6; don't add model files before then.
- Don't add libraries without asking. Don't touch multiplayer, accounts or real brands yet.
- Run `npm run build` before calling work done, then update `docs/progress.md`.
