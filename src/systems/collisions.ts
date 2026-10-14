import * as THREE from 'three';
import type { Player } from '../entities/Player';
import type { Obstacle } from '../world/obstacles';

// Checks the player's hitbox against obstacles. Returns the obstacle hit this frame, if any.
export function checkCollisions(player: Player, obstacles: Obstacle[]): Obstacle | null {
  if (player.invulnerable) return null;
  const box = player.hitbox(scratch);
  for (const o of obstacles) {
    if (!o.hit && box.intersectsBox(o.box)) return o;
  }
  return null;
}

const scratch = new THREE.Box3();
