import GUI from 'lil-gui';
import { TUNING } from '../config/tuning';

// Live tuning panel for runner feel. Toggle with the ` key.
export function createDebugPanel(): GUI {
  const gui = new GUI({ title: 'Tuning (`)' });
  gui.domElement.style.left = '0';
  gui.domElement.style.right = 'auto';
  gui.add(TUNING, 'startSpeed', 4, 30, 0.5);
  gui.add(TUNING, 'maxSpeed', 10, 50, 0.5);
  gui.add(TUNING, 'acceleration', 0, 2, 0.05);
  gui.add(TUNING, 'laneSwitchSpeed', 4, 30, 0.5);
  gui.add(TUNING, 'gravity', 10, 80, 1);
  gui.add(TUNING, 'jumpVelocity', 5, 25, 0.5);
  gui.add(TUNING, 'slideDuration', 0.2, 1.5, 0.05);
  const cam = gui.addFolder('Camera');
  cam.add(TUNING.camera, 'height', 1, 10, 0.1);
  cam.add(TUNING.camera, 'distance', 3, 15, 0.1);
  cam.add(TUNING.camera, 'lookAhead', 0, 15, 0.5);
  gui.hide();
  return gui;
}
