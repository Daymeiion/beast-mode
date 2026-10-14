// Everything about how a beast looks and plays lives here as plain data,
// so the character editor (and later, gear) only changes data, never logic.

export type BeastSpecies = 'bruiser' | 'bull' | 'panther';

export interface BeastConfig {
  name: string;
  species: BeastSpecies;
  number: number;
  colors: {
    jersey: string;
    trim: string;
    pants: string;
    pads: string;
    helmet: string;
    skin: string;
    cleats: string;
  };
  body: {
    height: number; // overall scale
    bulk: number; // width of torso and limbs
    shoulderPads: number; // size of the pads
  };
  gear: {
    helmet: boolean;
    gloves: boolean;
    cleats: boolean;
  };
}

// Defaults match the character design sheet (docs/art/beast-character-sheet.jpg):
// navy jersey with orange trim, #99, white pants, silver-rimmed pads.
export const DEFAULT_BEAST: BeastConfig = {
  name: 'Bruiser',
  species: 'bruiser',
  number: 99,
  colors: {
    jersey: '#1f3f8f',
    trim: '#ff6a13',
    pants: '#e8ecf2',
    pads: '#2a4fa8',
    helmet: '#1f3f8f',
    skin: '#c98a5a',
    cleats: '#1b2d5c',
  },
  body: { height: 1, bulk: 1.15, shoulderPads: 1.2 },
  gear: { helmet: true, gloves: true, cleats: true },
};
