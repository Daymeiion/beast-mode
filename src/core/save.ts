import { DEFAULT_BEAST, type BeastConfig } from '../config/beast';

const KEY = 'beast-mode:beast';

export function loadBeast(): BeastConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return mergeDeep(structuredClone(DEFAULT_BEAST), JSON.parse(raw));
  } catch {
    // storage blocked or corrupt; fall back to defaults
  }
  return structuredClone(DEFAULT_BEAST);
}

export function saveBeast(beast: BeastConfig): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(beast));
  } catch {
    // ignore
  }
}

const XP_KEY = 'beast-mode:xp';

/** Total XP across all runs. Spent on gear in milestone 4. */
export function loadXp(): number {
  try {
    return Number(localStorage.getItem(XP_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveXp(xp: number): void {
  try {
    localStorage.setItem(XP_KEY, String(xp));
  } catch {
    // ignore
  }
}

function mergeDeep<T>(base: T, patch: unknown): T {
  if (typeof patch !== 'object' || patch === null) return base;
  for (const [k, v] of Object.entries(patch)) {
    const cur = (base as Record<string, unknown>)[k];
    if (cur && typeof cur === 'object' && typeof v === 'object') mergeDeep(cur, v);
    else if (k in (base as object)) (base as Record<string, unknown>)[k] = v;
  }
  return base;
}
