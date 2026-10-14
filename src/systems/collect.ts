import * as THREE from 'three';
import { FOOTBALLS, POWER_UP_RULES } from '../config/pickups';
import type { Player } from '../entities/Player';
import type { Pickup } from '../world/pickups';
import type { PowerUps } from './powerUps';

const center = new THREE.Vector3();
const toPlayer = new THREE.Vector3();

// Picks up anything close to the player and pulls footballs in while the magnet is on.
// Returns what was collected this frame.
export function collectPickups(dt: number, player: Player, pickups: Pickup[], powerUps: PowerUps): Pickup[] {
  center.copy(player.root.position);
  center.y += 1;
  const magnet = powerUps.isActive('magnet');
  const got: Pickup[] = [];

  for (const p of pickups) {
    if (p.collected) continue;
    toPlayer.subVectors(center, p.mesh.position);
    const dist = toPlayer.length();
    if (magnet && p.type === 'football' && dist < POWER_UP_RULES.magnetRadius) {
      p.mesh.position.addScaledVector(toPlayer.normalize(), Math.min(dist, POWER_UP_RULES.magnetPull * dt));
    }
    if (dist < FOOTBALLS.collectRadius) {
      p.collected = true;
      got.push(p);
    }
  }
  return got;
}
