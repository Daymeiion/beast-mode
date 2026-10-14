import * as THREE from 'three';
import { Player } from './entities/Player';
import { Track } from './world/track';
import { Input } from './core/input';
import { snapChaseCamera, updateChaseCamera } from './core/chaseCamera';
import { createBeastEditor } from './ui/editor';
import { createDebugPanel } from './ui/debugPanel';
import { hud } from './ui/hud';
import { loadBeast, saveBeast } from './core/save';

type GameState = 'garage' | 'running';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#87b8e8');
scene.fog = new THREE.Fog('#87b8e8', 40, 140);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 250);

scene.add(new THREE.HemisphereLight('#ffffff', '#3a5a3a', 1.2));
const sun = new THREE.DirectionalLight('#ffffff', 2);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
scene.add(sun, sun.target);

const track = new Track();
scene.add(track.root);

const config = loadBeast();
const player = new Player(config);
scene.add(player.root);

const input = new Input(renderer.domElement);
const editor = createBeastEditor(config, (b) => {
  player.beast.setConfig(b);
  saveBeast(b);
});
const debug = createDebugPanel();

let state: GameState = 'garage';
let hasRun = false;

function enterGarage(): void {
  state = 'garage';
  editor.show();
  hud.showOverlay(
    hasRun ? 'Garage' : 'Training Ground',
    hasRun ? 'Tweak your beast, then get back out there.' : 'Edit your beast, then hit the field.',
    hasRun ? 'Resume' : 'Run',
  );
}

function startRunning(): void {
  state = 'running';
  hasRun = true;
  editor.hide();
  hud.hideOverlay();
}

hud.onRun(startRunning);
hud.onPause(enterGarage);
enterGarage();
snapChaseCamera(camera, player.root);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05); // avoid huge jumps after a tab switch

  for (const action of input.drain()) {
    if (action === 'debug') debug._hidden ? debug.show() : debug.hide();
    else if (action === 'pause') state === 'running' ? enterGarage() : startRunning();
    else if (state === 'running') player.handle(action);
    else if (action === 'jump') startRunning();
  }

  const facing = player.beast.root;
  if (state === 'running') {
    player.update(dt);
    facing.rotation.y = THREE.MathUtils.damp(facing.rotation.y, Math.PI, 10, dt);
  } else {
    player.beast.update(dt, 0);
    facing.rotation.y = THREE.MathUtils.damp(facing.rotation.y, 0, 6, dt); // turn to face you while editing
    facing.rotation.x = THREE.MathUtils.damp(facing.rotation.x, 0, 6, dt);
    facing.scale.y = THREE.MathUtils.damp(facing.scale.y, 1, 10, dt);
  }

  track.update(player.root.position.z);
  updateChaseCamera(camera, player.root, dt);
  sun.position.set(player.root.position.x + 5, 12, player.root.position.z + 6);
  sun.target.position.copy(player.root.position);
  hud.setStats(player.distance, state === 'running' ? player.speed : 0);

  renderer.render(scene, camera);
});
