import * as THREE from 'three';
import { TUNING } from '../config/tuning';
import { STUMBLE } from '../config/obstacles';
import type { BeastConfig } from '../config/beast';
import type { Action } from '../core/input';
import { Beast } from './Beast';

// The player's runner: lane position, jump and slide. Owns a Beast for visuals.
export class Player {
  readonly root = new THREE.Group();
  readonly beast: Beast;

  speed = TUNING.startSpeed;
  distance = 0;
  hits = 0;

  private lane = 0; // -1, 0, 1
  private velocityY = 0;
  private slideTimer = 0;
  private invulnerableTimer = 0;

  constructor(config: BeastConfig) {
    this.beast = new Beast(config);
    this.beast.root.rotation.y = Math.PI; // face down the track (-z)
    this.root.add(this.beast.root);
  }

  get grounded(): boolean {
    return this.root.position.y <= 0 && this.velocityY <= 0;
  }

  get sliding(): boolean {
    return this.slideTimer > 0;
  }

  get invulnerable(): boolean {
    return this.invulnerableTimer > 0;
  }

  /** Axis-aligned hitbox: narrower than the model so near misses feel fair. */
  hitbox(out: THREE.Box3): THREE.Box3 {
    const p = this.root.position;
    const h = this.sliding ? TUNING.playerHeight * TUNING.slideHeightScale : TUNING.playerHeight;
    const w = TUNING.playerWidth / 2;
    return out.set(new THREE.Vector3(p.x - w, p.y, p.z - 0.3), new THREE.Vector3(p.x + w, p.y + h, p.z + 0.3));
  }

  /** Called when the player runs into something. */
  stumble(): void {
    this.hits++;
    this.speed = Math.max(TUNING.startSpeed * 0.6, this.speed * STUMBLE.speedMultiplier);
    this.invulnerableTimer = STUMBLE.invulnerableTime;
  }

  handle(action: Action): void {
    const maxLane = Math.floor(TUNING.laneCount / 2);
    if (action === 'left') this.lane = Math.max(-maxLane, this.lane - 1);
    if (action === 'right') this.lane = Math.min(maxLane, this.lane + 1);
    if (action === 'jump' && this.grounded) {
      this.velocityY = TUNING.jumpVelocity;
      this.slideTimer = 0;
    }
    if (action === 'slide') {
      if (!this.grounded) this.velocityY = -TUNING.jumpVelocity; // slam down, then slide
      this.slideTimer = TUNING.slideDuration;
    }
  }

  update(dt: number): void {
    // forward
    this.speed = Math.min(TUNING.maxSpeed, this.speed + TUNING.acceleration * dt);
    this.root.position.z -= this.speed * dt;
    this.distance += this.speed * dt;

    // sideways toward the target lane
    const targetX = this.lane * TUNING.laneWidth;
    const dx = targetX - this.root.position.x;
    const step = TUNING.laneSwitchSpeed * dt;
    this.root.position.x = Math.abs(dx) <= step ? targetX : this.root.position.x + Math.sign(dx) * step;

    // vertical
    this.velocityY -= TUNING.gravity * dt;
    this.root.position.y = Math.max(0, this.root.position.y + this.velocityY * dt);
    if (this.root.position.y === 0 && this.velocityY < 0) this.velocityY = 0;

    if (this.slideTimer > 0) this.slideTimer = Math.max(0, this.slideTimer - dt);
    if (this.invulnerableTimer > 0) this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    this.beast.root.visible = !this.invulnerable || Math.floor(this.invulnerableTimer * 12) % 2 === 0; // flash

    this.pose(dt, dx);
    this.beast.update(dt, this.speed / TUNING.startSpeed);
  }

  reset(): void {
    this.root.position.set(0, 0, 0);
    this.lane = 0;
    this.velocityY = 0;
    this.slideTimer = 0;
    this.speed = TUNING.startSpeed;
    this.distance = 0;
    this.hits = 0;
    this.invulnerableTimer = 0;
    this.beast.root.visible = true;
  }

  private pose(dt: number, dx: number): void {
    const b = this.beast.root;
    const targetScaleY = this.sliding ? TUNING.slideHeightScale : 1;
    b.scale.y = THREE.MathUtils.damp(b.scale.y, targetScaleY, 18, dt);
    b.rotation.x = THREE.MathUtils.damp(b.rotation.x, this.sliding ? -0.5 : -0.12, 12, dt); // lean into the run
    b.rotation.z = THREE.MathUtils.damp(b.rotation.z, THREE.MathUtils.clamp(dx * 0.25, -0.35, 0.35), 12, dt);
  }
}
