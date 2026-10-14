// Turns keyboard and touch swipes into runner actions.
export type Action = 'left' | 'right' | 'jump' | 'slide' | 'pause' | 'debug';

const KEYS: Record<string, Action> = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'jump', KeyW: 'jump', Space: 'jump',
  ArrowDown: 'slide', KeyS: 'slide',
  Escape: 'pause', KeyP: 'pause',
  Backquote: 'debug',
};

const SWIPE_MIN = 30; // pixels

export class Input {
  private queue: Action[] = [];
  private touchStart: { x: number; y: number } | null = null;

  constructor(target: HTMLElement) {
    window.addEventListener('keydown', (e) => {
      const action = KEYS[e.code];
      if (!action || e.repeat) return;
      if (isTyping(e.target)) return;
      e.preventDefault();
      this.queue.push(action);
    });

    target.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      this.touchStart = { x: t.clientX, y: t.clientY };
    }, { passive: true });

    target.addEventListener('touchend', (e) => {
      if (!this.touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - this.touchStart.x;
      const dy = t.clientY - this.touchStart.y;
      this.touchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) {
        this.queue.push('jump'); // tap = jump
      } else if (Math.abs(dx) > Math.abs(dy)) {
        this.queue.push(dx < 0 ? 'left' : 'right');
      } else {
        this.queue.push(dy < 0 ? 'jump' : 'slide');
      }
    }, { passive: true });
  }

  /** Returns and clears the actions pressed since the last call. */
  drain(): Action[] {
    const out = this.queue;
    this.queue = [];
    return out;
  }
}

function isTyping(el: EventTarget | null): boolean {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
}
