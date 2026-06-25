/**
 * Seeded random utilities for photo presentation components.
 * All randomness is deterministic given the same seed, ensuring
 * consistent layouts across re-renders.
 */

/**
 * Creates a seeded pseudo-random number generator (mulberry32).
 * @param {number|string} seed - Numeric or string seed
 * @returns {function} A function that returns a random float in [0, 1)
 */
export function seedRandom(seed) {
  let h = typeof seed === 'string' ? hashString(seed) : Math.abs(seed | 0);
  return function () {
    h |= 0;
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simple string hash (djb2).
 */
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a random number in [min, max].
 */
export function randomRange(rng, min, max) {
  return min + rng() * (max - min);
}

/**
 * Returns a random rotation in degrees in [-max, +max].
 */
export function randomRotation(rng, max = 5) {
  return randomRange(rng, -max, max);
}

/**
 * Picks a random element from an array.
 */
export function randomPick(rng, array) {
  return array[Math.floor(rng() * array.length)];
}

/**
 * Returns a random boolean with the given probability of true.
 */
export function randomBool(rng, probability = 0.5) {
  return rng() < probability;
}

/**
 * Returns a random integer in [min, max] inclusive.
 */
export function randomInt(rng, min, max) {
  return Math.floor(randomRange(rng, min, max + 1));
}

/**
 * Generates a random muted/warm color suitable for scrapbook elements.
 */
export function randomWarmColor(rng) {
  const hue = randomRange(rng, 0, 360);
  const sat = randomRange(rng, 30, 60);
  const lit = randomRange(rng, 45, 65);
  return `hsl(${hue}, ${sat}%, ${lit}%)`;
}

/**
 * Generates a random pastel color.
 */
export function randomPastelColor(rng) {
  const hue = randomRange(rng, 0, 360);
  const sat = randomRange(rng, 40, 70);
  const lit = randomRange(rng, 75, 88);
  return `hsl(${hue}, ${sat}%, ${lit}%)`;
}
