# Game design

## Controls
Left/right (A/D, arrows, d-pad, swipe) switch lanes · Up/Space jump · Down/S slide · Shift/E skill move.

## Training Ground (demo level)
3 lanes, endless forward run. Obstacles: tackling dummies, cones, hurdles, sleds, low bars. Hitting one = stumble (lose speed), not game over. Pickups: XP footballs, speed boost, shield, magnet. 2 to 3 CPU racers.

## Obstacles
| Obstacle | How to beat it |
|---|---|
| Tackling dummy (red) | dodge to another lane |
| Sled | dodge |
| Hurdle (white) | jump |
| Cone | jump (or dodge) |
| Low bar (yellow) | slide under |

Every row leaves a way through. A hit costs speed (keep ~55%) and gives ~1.2s of flashing invulnerability.

## Pickups and power-ups
| Pickup | Effect |
|---|---|
| Football (brown) | +1 XP, saved across runs |
| Speed Boost (orange orb) | x1.6 speed for 4s, smash through obstacles |
| Shield (blue orb) | absorbs the next hit, up to 15s |
| Magnet (purple orb) | pulls footballs within 7 units for 8s |

## Gear (unlocked with XP)
| Gear | Effect |
|---|---|
| Helmet | absorbs one hit per run |
| Gloves | bigger pickup radius |
| Cleats | higher top speed, better jump |
| Skill moves | spin (dodge through), juke (instant lane change), stiff arm (smash a dummy) |

## Character editing
Every beast is a `BeastConfig` data object, so anything here is editable without code changes:
- **Identity:** name, species (bruiser, bull, panther), jersey number
- **Colors:** jersey, trim, pants, pads, helmet, skin, cleats (team color presets later)
- **Body:** height, bulk, shoulder pad size (cosmetic only; stats come from gear and species)
- **Gear slots:** helmet, gloves, cleats on/off now; later each slot picks a specific item with its own look and stats
- **Skill moves:** pick which skill move is equipped (milestone 4)
- **Later:** helmet decals, visor tint, face/expression, celebration emote, real models with swappable meshes and recolorable textures

Where it shows up: an in-game "Edit your beast" panel now; a proper garage screen between runs in milestone 4.
