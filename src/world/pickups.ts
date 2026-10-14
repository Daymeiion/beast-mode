import * as THREE from 'three';
import { TUNING } from '../config/tuning';
import { OBSTACLES } from '../config/obstacles';
import { FOOTBALLS, POWER_UP_RULES, POWER_UPS, type PowerUpKind } from '../config/pickups';
import type { Obstacle } from './obstacles';

export interface Pickup {
  type: 'football' | PowerUpKind;
  mesh: THREE.Object3D;
  collected: boolean;
}

const SPAWN_AHEAD = 100; // obstacles exist further ahead than this, so pickups can avoid them

// Spawns football trails and the odd power-up ahead of the runner, working around obstacles:
// footballs float over jumpable obstacles, sit low under slide bars, and skip dodge-only ones.
export class PickupField {
  readonly root = new THREE.Group();
  readonly active: Pickup[] = [];
  private nextTrailZ = -30;
  private nextPowerUpZ = -POWER_UP_RULES.firstAt;
  private assets = createAssets();
  private time = 0;

  update(dt: number, runnerZ: number, obstacles: Obstacle[]): void {
    this.time += dt;
    while (this.nextTrailZ > runnerZ - SPAWN_AHEAD) {
      this.spawnTrail(this.nextTrailZ, obstacles);
      this.nextTrailZ -= FOOTBALLS.trailLength * FOOTBALLS.spacing + randRange(FOOTBALLS.trailGapMin, FOOTBALLS.trailGapMax);
    }
    while (this.nextPowerUpZ > runnerZ - SPAWN_AHEAD) {
      this.spawnPowerUp(this.nextPowerUpZ, obstacles);
      this.nextPowerUpZ -= randRange(POWER_UP_RULES.gapMin, POWER_UP_RULES.gapMax);
    }

    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      p.mesh.rotation.y = this.time * 3;
      if (p.collected || p.mesh.position.z > runnerZ + 10) {
        this.root.remove(p.mesh);
        this.active.splice(i, 1);
      }
    }
  }

  reset(): void {
    for (const p of this.active) this.root.remove(p.mesh);
    this.active.length = 0;
    this.nextTrailZ = -30;
    this.nextPowerUpZ = -POWER_UP_RULES.firstAt;
  }

  private spawnTrail(startZ: number, obstacles: Obstacle[]): void {
    const lane = Math.floor(Math.random() * 3) - 1;
    for (let i = 0; i < FOOTBALLS.trailLength; i++) {
      const z = startZ - i * FOOTBALLS.spacing;
      const y = heightAt(lane, z, obstacles);
      if (y === null) continue;
      this.add('football', lane, y, z);
    }
  }

  private spawnPowerUp(z: number, obstacles: Obstacle[]): void {
    const lanes = shuffle([-1, 0, 1]);
    const lane = lanes.find((l) => heightAt(l, z, obstacles) === 1);
    if (lane === undefined) return;
    const kinds = Object.keys(POWER_UPS) as PowerUpKind[];
    this.add(kinds[Math.floor(Math.random() * kinds.length)], lane, 1.2, z);
  }

  private add(type: Pickup['type'], lane: number, y: number, z: number): void {
    const mesh = type === 'football' ? this.assets.football() : this.assets.powerUp(type);
    mesh.position.set(lane * TUNING.laneWidth, y, z);
    this.root.add(mesh);
    this.active.push({ type, mesh, collected: false });
  }
}

/** Where a pickup can sit in this lane at this z: 1 when clear, higher/lower around obstacles, null to skip. */
function heightAt(lane: number, z: number, obstacles: Obstacle[]): number | null {
  const x = lane * TUNING.laneWidth;
  for (const o of obstacles) {
    const near = Math.abs(o.mesh.position.z - z) < 2.5 && Math.abs(o.mesh.position.x - x) < 0.5;
    if (!near || o.hit) continue;
    const counter = OBSTACLES[o.kind].counter;
    if (counter === 'jump') return FOOTBALLS.overJumpHeight;
    if (counter === 'slide') return FOOTBALLS.underSlideHeight;
    return null;
  }
  return 1;
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function shuffle<T>(items: T[]): T[] {
  return items.sort(() => Math.random() - 0.5);
}

function createAssets() {
  const leather = new THREE.MeshStandardMaterial({ color: '#8a4a22', roughness: 0.5 });
  const lace = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const ballGeo = new THREE.SphereGeometry(0.22, 16, 12);
  const laceGeo = new THREE.BoxGeometry(0.03, 0.02, 0.2);
  const orbGeo = new THREE.OctahedronGeometry(0.4);
  const ringGeo = new THREE.TorusGeometry(0.6, 0.04, 8, 32);

  return {
    football(): THREE.Object3D {
      const g = new THREE.Group();
      const ball = new THREE.Mesh(ballGeo, leather);
      ball.scale.set(1, 1, 1.7); // prolate football shape
      ball.castShadow = true;
      const laces = new THREE.Mesh(laceGeo, lace);
      laces.position.y = 0.21;
      ball.rotation.x = 0.4;
      g.add(ball, laces);
      return g;
    },
    powerUp(kind: PowerUpKind): THREE.Object3D {
      const color = POWER_UPS[kind].color;
      const g = new THREE.Group();
      const orb = new THREE.Mesh(orbGeo, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 }));
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color }));
      ring.rotation.x = Math.PI / 2;
      g.add(orb, ring);
      return g;
    },
  };
}
