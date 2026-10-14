import * as THREE from 'three';
import { TUNING } from '../config/tuning';
import { DIFFICULTY, OBSTACLES, type ObstacleKind } from '../config/obstacles';

export interface Obstacle {
  kind: ObstacleKind;
  mesh: THREE.Object3D;
  box: THREE.Box3;
  hit: boolean;
  knock: THREE.Vector3; // fly-away velocity after being hit
}

// Spawns rows of obstacles ahead of the runner and removes the ones behind.
// Every row leaves a way through: at least one open lane, or only jump/slide obstacles.
export class ObstacleField {
  readonly root = new THREE.Group();
  readonly active: Obstacle[] = [];
  private nextRowZ = -DIFFICULTY.safeStart;
  private builders = createBuilders();

  update(dt: number, runnerZ: number, distance: number): void {
    while (this.nextRowZ > runnerZ - DIFFICULTY.spawnAhead) {
      this.spawnRow(this.nextRowZ, distance);
      this.nextRowZ -= rowGap(distance);
    }

    for (let i = this.active.length - 1; i >= 0; i--) {
      const o = this.active[i];
      if (o.hit) {
        o.knock.y -= TUNING.gravity * dt;
        o.mesh.position.addScaledVector(o.knock, dt);
        o.mesh.rotation.x += dt * 8;
      }
      if (o.mesh.position.z > runnerZ + 10 || o.mesh.position.y < -5) {
        this.root.remove(o.mesh);
        this.active.splice(i, 1);
      }
    }
  }

  reset(): void {
    for (const o of this.active) this.root.remove(o.mesh);
    this.active.length = 0;
    this.nextRowZ = -DIFFICULTY.safeStart;
  }

  private spawnRow(z: number, distance: number): void {
    const lanes = [-1, 0, 1];
    shuffle(lanes);
    const count = Math.random() < doubleChance(distance) ? 2 : 1;
    for (let i = 0; i < count; i++) {
      // With two obstacles, the second must be jumpable or slideable so the row stays fair
      // even if the remaining open lane is out of reach.
      const kind = pick<ObstacleKind>(i === 0 ? ['dummy', 'sled', 'hurdle', 'cone', 'lowBar'] : ['hurdle', 'cone', 'lowBar']);
      this.place(kind, lanes[i], z);
    }
  }

  private place(kind: ObstacleKind, lane: number, z: number): void {
    const def = OBSTACLES[kind];
    const mesh = this.builders[kind]();
    mesh.position.set(lane * TUNING.laneWidth, 0, z);
    this.root.add(mesh);
    const box = new THREE.Box3(
      new THREE.Vector3(mesh.position.x - def.width / 2, def.bottom, z - def.depth / 2),
      new THREE.Vector3(mesh.position.x + def.width / 2, def.bottom + def.height, z + def.depth / 2),
    );
    this.active.push({ kind, mesh, box, hit: false, knock: new THREE.Vector3() });
  }
}

function rowGap(distance: number): number {
  const d = DIFFICULTY;
  return Math.max(d.rowGapMin, d.rowGapStart - (distance / 100) * d.rowGapShrinkPer100);
}

function doubleChance(distance: number): number {
  const d = DIFFICULTY;
  return Math.min(d.doubleRowChanceMax, d.doubleRowChanceStart + distance / 2000);
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

// Placeholder meshes built from primitives, matching each hitbox.
function createBuilders(): Record<ObstacleKind, () => THREE.Object3D> {
  const mat = (c: string) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 });
  const m = {} as Record<ObstacleKind, THREE.Material>;
  for (const kind of Object.keys(OBSTACLES) as ObstacleKind[]) m[kind] = mat(OBSTACLES[kind].color);
  const post = mat('#c9ced6');
  const shadowed = (o: THREE.Mesh) => ((o.castShadow = true), o);

  return {
    dummy: () => {
      const d = OBSTACLES.dummy;
      const mesh = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(d.width / 2 - 0.05, d.width / 2, d.height, 16), m.dummy));
      mesh.position.y = d.height / 2;
      return group(mesh);
    },
    sled: () => {
      const d = OBSTACLES.sled;
      const g = new THREE.Group();
      const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(d.width, 0.2, d.depth), post));
      base.position.y = 0.1;
      const pad = shadowed(new THREE.Mesh(new THREE.BoxGeometry(d.width, d.height - 0.2, 0.4), m.sled));
      pad.position.set(0, 0.2 + (d.height - 0.2) / 2, -d.depth / 2 + 0.2);
      g.add(base, pad);
      return g;
    },
    hurdle: () => {
      const d = OBSTACLES.hurdle;
      const g = new THREE.Group();
      const bar = shadowed(new THREE.Mesh(new THREE.BoxGeometry(d.width, 0.15, d.depth), m.hurdle));
      bar.position.y = d.height - 0.075;
      g.add(bar);
      for (const side of [-1, 1]) {
        const leg = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.06, d.height, 0.06), post));
        leg.position.set((side * d.width) / 2, d.height / 2, 0);
        g.add(leg);
      }
      return g;
    },
    cone: () => {
      const d = OBSTACLES.cone;
      const mesh = shadowed(new THREE.Mesh(new THREE.ConeGeometry(d.width / 2, d.height, 14), m.cone));
      mesh.position.y = d.height / 2;
      return group(mesh);
    },
    lowBar: () => {
      const d = OBSTACLES.lowBar;
      const g = new THREE.Group();
      const bar = shadowed(new THREE.Mesh(new THREE.BoxGeometry(d.width, d.height, d.depth), m.lowBar));
      bar.position.y = d.bottom + d.height / 2;
      g.add(bar);
      for (const side of [-1, 1]) {
        const leg = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, d.bottom + d.height, 8), post));
        leg.position.set((side * d.width) / 2, (d.bottom + d.height) / 2, 0);
        g.add(leg);
      }
      return g;
    },
  };
}

function group(child: THREE.Object3D): THREE.Group {
  const g = new THREE.Group();
  g.add(child);
  return g;
}
