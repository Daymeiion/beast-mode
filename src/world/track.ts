import * as THREE from 'three';
import { TUNING } from '../config/tuning';

// Endless Training Ground track. A fixed pool of tiles is recycled from behind the
// runner to the front, so the world never ends and memory stays flat.
// The runner moves toward -z.
export class Track {
  readonly root = new THREE.Group();
  private tiles: THREE.Group[] = [];
  private shared = createSharedAssets();

  constructor() {
    const count = TUNING.tilesAhead + TUNING.tilesBehind + 1;
    for (let i = 0; i < count; i++) {
      const tile = this.buildTile(i);
      tile.position.z = -(i - TUNING.tilesBehind) * TUNING.tileLength;
      this.tiles.push(tile);
      this.root.add(tile);
    }
  }

  /** Recycle tiles that fell behind the runner. */
  update(runnerZ: number): void {
    const len = TUNING.tileLength;
    for (const tile of this.tiles) {
      if (tile.position.z - len / 2 > runnerZ + TUNING.tilesBehind * len) {
        tile.position.z -= this.tiles.length * len;
      }
    }
  }

  private buildTile(index: number): THREE.Group {
    const { laneWidth, laneCount, tileLength } = TUNING;
    const tile = new THREE.Group();
    const trackWidth = laneWidth * laneCount;

    const turf = new THREE.Mesh(this.shared.turfGeo, index % 2 ? this.shared.turfA : this.shared.turfB);
    turf.rotation.x = -Math.PI / 2;
    turf.receiveShadow = true;
    tile.add(turf);

    // lane dividers
    for (let i = 1; i < laneCount; i++) {
      const x = -trackWidth / 2 + i * laneWidth;
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.08, tileLength), this.shared.laneMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.011, 0);
      tile.add(line);
    }

    // yard lines across the track every 5 units
    for (let z = -tileLength / 2; z < tileLength / 2; z += 5) {
      const yard = new THREE.Mesh(new THREE.PlaneGeometry(trackWidth + 2, 0.15), this.shared.whiteMat);
      yard.rotation.x = -Math.PI / 2;
      yard.position.set(0, 0.012, z);
      tile.add(yard);
    }

    // sidelines and a few cones off the track for a sense of speed
    for (const side of [-1, 1]) {
      const sideline = new THREE.Mesh(new THREE.PlaneGeometry(0.3, tileLength), this.shared.whiteMat);
      sideline.rotation.x = -Math.PI / 2;
      sideline.position.set(side * (trackWidth / 2 + 1), 0.012, 0);
      tile.add(sideline);
      for (let z = -tileLength / 2 + 2.5; z < tileLength / 2; z += 5) {
        const cone = new THREE.Mesh(this.shared.coneGeo, this.shared.coneMat);
        cone.position.set(side * (trackWidth / 2 + 2.2), 0.225, z);
        cone.castShadow = true;
        tile.add(cone);
      }
    }
    return tile;
  }
}

function createSharedAssets() {
  return {
    turfGeo: new THREE.PlaneGeometry(60, TUNING.tileLength),
    turfA: new THREE.MeshStandardMaterial({ color: '#2f7a3a', roughness: 0.9 }),
    turfB: new THREE.MeshStandardMaterial({ color: '#2a6f35', roughness: 0.9 }),
    laneMat: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 }),
    whiteMat: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    coneGeo: new THREE.ConeGeometry(0.2, 0.45, 12),
    coneMat: new THREE.MeshStandardMaterial({ color: '#ff8a1f' }),
  };
}
