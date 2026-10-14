// HUD text and the start/garage overlay.
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const UNITS_TO_MPH = 2.24 / 3; // feels right for a ~10 u/s start; tune freely

export const hud = {
  setStats(distance: number, speed: number, hits: number): void {
    $('distance').textContent = Math.floor(distance).toString();
    $('hits').textContent = hits.toString();
    $('speed').textContent = Math.round(speed * UNITS_TO_MPH * 3).toString();
  },
  setXp(runXp: number): void {
    $('xp').textContent = runXp.toString();
  },
  setPowerUps(items: { label: string; color: string; left: number }[]): void {
    $('powerups').innerHTML = items
      .map((p) => `<span class="chip" style="background:${p.color}">${p.label} ${Math.ceil(p.left)}s</span>`)
      .join('');
  },
  showOverlay(title: string, text: string, button: string, showNewRun: boolean): void {
    $('new-run-btn').style.display = showNewRun ? '' : 'none';
    $('overlay-title').textContent = title;
    $('overlay-text').textContent = text;
    $('run-btn').textContent = button;
    $('overlay').classList.remove('hidden');
    $('pause-btn').style.display = 'none';
  },
  hideOverlay(): void {
    $('overlay').classList.add('hidden');
    $('pause-btn').style.display = '';
  },
  onRun(cb: () => void): void {
    $('run-btn').addEventListener('click', cb);
  },
  onNewRun(cb: () => void): void {
    $('new-run-btn').addEventListener('click', cb);
  },
  onPause(cb: () => void): void {
    $('pause-btn').addEventListener('click', cb);
  },
};
