import GUI from 'lil-gui';
import { DEFAULT_BEAST, type BeastConfig } from '../config/beast';

// Character editor panel. Edits the BeastConfig data and reports every change.
export function createBeastEditor(beast: BeastConfig, onChange: (b: BeastConfig) => void): GUI {
  const gui = new GUI({ title: 'Edit your beast' });
  const changed = () => onChange(beast);

  gui.add(beast, 'name').name('Name').onFinishChange(changed);
  gui.add(beast, 'species', ['bruiser', 'bull', 'panther']).name('Species').onChange(changed);
  gui.add(beast, 'number', 0, 99, 1).name('Jersey #').onFinishChange(changed);

  const colors = gui.addFolder('Colors');
  for (const key of Object.keys(beast.colors) as (keyof BeastConfig['colors'])[]) {
    colors.addColor(beast.colors, key).name(key).onFinishChange(changed);
  }

  const body = gui.addFolder('Body');
  body.add(beast.body, 'height', 0.8, 1.3, 0.01).name('Height').onFinishChange(changed);
  body.add(beast.body, 'bulk', 0.8, 1.5, 0.01).name('Bulk').onFinishChange(changed);
  body.add(beast.body, 'shoulderPads', 0.8, 1.6, 0.01).name('Shoulder pads').onFinishChange(changed);

  const gear = gui.addFolder('Gear');
  gear.add(beast.gear, 'helmet').name('Helmet').onChange(changed);
  gear.add(beast.gear, 'gloves').name('Gloves').onChange(changed);
  gear.add(beast.gear, 'cleats').name('Cleats').onChange(changed);

  gui.add({ reset: () => { Object.assign(beast, structuredClone(DEFAULT_BEAST)); gui.controllersRecursive().forEach((c) => c.updateDisplay()); changed(); } }, 'reset').name('Reset to default');

  if (window.innerWidth < 600) gui.close();
  return gui;
}
