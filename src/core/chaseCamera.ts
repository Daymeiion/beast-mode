import * as THREE from 'three';
import { TUNING } from '../config/tuning';

// Third-person camera that sits behind and above the runner.
export function updateChaseCamera(camera: THREE.PerspectiveCamera, target: THREE.Object3D, dt: number): void {
  const c = TUNING.camera;
  const p = target.position;
  const desired = new THREE.Vector3(p.x * 0.6, c.height + p.y * 0.4, p.z + c.distance);
  const t = 1 - Math.exp(-c.followLerp * dt);
  camera.position.x += (desired.x - camera.position.x) * t;
  camera.position.y += (desired.y - camera.position.y) * t;
  camera.position.z = desired.z; // lock depth so speed reads clearly
  camera.lookAt(p.x * 0.6, 1.2, p.z - c.lookAhead);
}

export function snapChaseCamera(camera: THREE.PerspectiveCamera, target: THREE.Object3D): void {
  const c = TUNING.camera;
  camera.position.set(target.position.x, c.height, target.position.z + c.distance);
  camera.lookAt(target.position.x, 1.2, target.position.z - c.lookAhead);
}
