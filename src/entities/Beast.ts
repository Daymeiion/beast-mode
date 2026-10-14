import * as THREE from 'three';
import type { BeastConfig } from '../config/beast';

// Placeholder beast built from primitives. Swapped for a real model in milestone 6;
// the BeastConfig it reads stays the same.
export class Beast {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private time = 0;
  private legs: THREE.Object3D[] = [];
  private arms: THREE.Object3D[] = [];

  constructor(private config: BeastConfig) {
    this.root.add(this.body);
    this.rebuild();
  }

  setConfig(config: BeastConfig): void {
    this.config = config;
    this.rebuild();
  }

  /** runPace 0 = idle stance, 1+ = running (higher is faster strides). */
  update(dt: number, runPace = 0): void {
    this.time += dt;
    if (runPace <= 0) {
      this.body.position.y = Math.abs(Math.sin(this.time * 3)) * 0.05; // idle "ready stance" bounce
      for (const limb of [...this.legs, ...this.arms]) limb.rotation.x = 0;
      return;
    }
    const phase = this.time * 9 * runPace;
    this.body.position.y = Math.abs(Math.sin(phase)) * 0.12;
    this.legs.forEach((leg, i) => (leg.rotation.x = Math.sin(phase + i * Math.PI) * 0.8));
    this.arms.forEach((arm, i) => (arm.rotation.x = -Math.sin(phase + i * Math.PI) * 0.7));
  }

  private rebuild(): void {
    disposeChildren(this.body);
    const { colors, body, gear, number } = this.config;
    const b = body.bulk;
    const mat = (c: string, rough = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: rough });
    const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = this.body) => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // legs (each in a hip pivot so it can swing)
    this.legs = [];
    for (const side of [-1, 1]) {
      const hip = this.pivot(side * 0.22 * b, 1.0, 0);
      this.legs.push(hip);
      add(new THREE.CapsuleGeometry(0.17 * b, 0.55, 4, 10), mat(colors.pants), 0, -0.38, 0, hip);
      add(new THREE.BoxGeometry(0.22 * b, 0.08, 0.04), mat(colors.trim), 0, -0.45, 0.17 * b, hip);
      if (gear.cleats) add(new THREE.BoxGeometry(0.24 * b, 0.14, 0.38), mat(colors.cleats, 0.4), 0, -0.9, 0.06, hip);
    }

    // torso with jersey number front and back
    const torso = add(new THREE.BoxGeometry(0.8 * b, 0.75, 0.45 * b), mat(colors.jersey), 0, 1.35, 0);
    const numTex = numberTexture(number, colors.trim);
    for (const z of [1, -1]) {
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.42), new THREE.MeshBasicMaterial({ map: numTex, transparent: true }));
      plate.position.set(0, -0.02, z * (0.225 * b + 0.002));
      if (z < 0) plate.rotation.y = Math.PI;
      torso.add(plate);
    }

    // shoulder pads
    const p = body.shoulderPads;
    for (const side of [-1, 1]) {
      add(new THREE.SphereGeometry(0.26 * p, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(colors.pads, 0.3), side * 0.42 * b, 1.62, 0);
    }

    // arms + gloves (each in a shoulder pivot)
    this.arms = [];
    for (const side of [-1, 1]) {
      const shoulder = this.pivot(side * 0.58 * b, 1.55, 0);
      this.arms.push(shoulder);
      add(new THREE.CapsuleGeometry(0.13 * b, 0.45, 4, 10), mat(colors.skin), 0, -0.33, 0, shoulder);
      add(new THREE.SphereGeometry(0.13 * b, 12, 10), mat(gear.gloves ? colors.cleats : colors.skin), 0, -0.67, 0, shoulder);
    }

    // head / helmet
    if (gear.helmet) {
      add(new THREE.SphereGeometry(0.28, 20, 16), mat(colors.helmet, 0.25), 0, 1.98, 0);
      add(new THREE.BoxGeometry(0.06, 0.04, 0.56), mat(colors.trim), 0, 2.24, 0); // stripe
      add(new THREE.TorusGeometry(0.17, 0.02, 6, 16, Math.PI), mat('#c9ced6', 0.3), 0, 1.92, 0.24).rotation.z = Math.PI;
    } else {
      add(new THREE.SphereGeometry(0.24, 20, 16), mat(colors.skin), 0, 1.98, 0);
    }

    this.body.scale.setScalar(body.height);
  }

  private pivot(x: number, y: number, z: number): THREE.Group {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    this.body.add(g);
    return g;
  }
}

function numberTexture(n: number, color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.font = 'bold 190px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 14;
  ctx.strokeStyle = color;
  ctx.strokeText(String(n), 128, 136);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(String(n), 128, 136);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function disposeChildren(group: THREE.Object3D): void {
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      const m = o.material as THREE.MeshStandardMaterial;
      m.map?.dispose();
      m.dispose();
    }
  });
  group.clear();
}
