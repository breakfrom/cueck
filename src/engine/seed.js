/* ─────────────────────────────────────────────────────────
 *  Seed Engine  ·  Deterministic pseudo-random generator
 *  Algorithm: Mulberry32 (fast, 32-bit, full-period)
 * ───────────────────────────────────────────────────────── */

const STORAGE_KEY = '__gabriela_seed__';

/**
 * Retrieve or create the session seed.
 * Once generated the seed survives page refreshes inside
 * the same browser tab (sessionStorage).
 */
function getOrCreateSeed() {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored !== null) return parseInt(stored, 10);
    const fresh = Date.now() & 0xffffffff;          // 32-bit
    sessionStorage.setItem(STORAGE_KEY, String(fresh));
    return fresh;
  }
  return Date.now() & 0xffffffff;
}

/* ── Factory ─────────────────────────────────────────── */

export function createSeedEngine(seed) {
  let state = seed >>> 0;                            // unsigned 32-bit

  /* Mulberry32 core – returns float in [0, 1) */
  function mulberry32() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /* ── Public API ──────────────────────────────────── */

  /** Raw float in [0, 1) – deterministic */
  function random() {
    return mulberry32();
  }

  /** Integer in [min, max] inclusive */
  function randomInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  /** Float in [min, max) */
  function randomFloat(min, max) {
    return random() * (max - min) + min;
  }

  /** Pick a random element from an array */
  function pick(arr) {
    if (!arr || arr.length === 0) return undefined;
    return arr[randomInt(0, arr.length - 1)];
  }

  /** Fisher-Yates shuffle (returns new array) */
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = randomInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /** Small random rotation for scattered-paper aesthetics */
  function randomRotation(maxDeg = 6) {
    return randomFloat(-maxDeg, maxDeg);
  }

  /** Small random pixel offset for organic placement */
  function randomOffset(maxPx = 12) {
    return randomFloat(-maxPx, maxPx);
  }

  return {
    seed,
    random,
    randomInt,
    randomFloat,
    pick,
    shuffle,
    randomRotation,
    randomOffset,
  };
}

/* ── Singleton ───────────────────────────────────────── */

const sessionSeed = getOrCreateSeed();
const seedEngine  = createSeedEngine(sessionSeed);

export default seedEngine;
