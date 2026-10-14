import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Beast } from './entities/Beast';
import { createTrainingGround } from './world/trainingGround';
import { createBeastEditor } from './ui/editor';
import { loadBeast, saveBeast } from './core/save';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#87b8e8');
scene.fog = new THREE.Fog('#87b8e8', 25, 60);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(2.5, 2.4, 4.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.2, 0);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight('#ffffff', '#3a5a3a', 1.2));
const sun = new THREE.DirectionalLight('#ffffff', 2);
sun.position.set(5, 10, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

scene.add(createTrainingGround());

const config = loadBeast();
const beast = new Beast(config);
scene.add(beast.root);

createBeastEditor(config, (b) => {
  beast.setConfig(b);
  saveBeast(b);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  beast.update(dt);
  controls.update();
  renderer.render(scene, camera);
});
