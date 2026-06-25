/* ─────────────────────────────────────────────────────────
 *  Typography Configuration
 *  Google Fonts catalogue & harmonic pairing engine
 * ───────────────────────────────────────────────────────── */

/* ── Individual font definitions ─────────────────────── */

const FONT_REGISTRY = {
  /* Titles */
  'Playfair Display': {
    weights: [400, 700],
    italic: true,
    category: 'title',
    fallback: 'serif',
  },
  'Cormorant Garamond': {
    weights: [300, 400, 600, 700],
    italic: true,
    category: 'title',
    fallback: 'serif',
  },
  'Libre Baskerville': {
    weights: [400, 700],
    italic: true,
    category: 'title',
    fallback: 'serif',
  },

  /* Handwritten */
  'Caveat': {
    weights: [400, 700],
    italic: false,
    category: 'handwritten',
    fallback: 'cursive',
  },
  'Dancing Script': {
    weights: [400, 700],
    italic: false,
    category: 'handwritten',
    fallback: 'cursive',
  },
  'Indie Flower': {
    weights: [400],
    italic: false,
    category: 'handwritten',
    fallback: 'cursive',
  },
  'Shadows Into Light': {
    weights: [400],
    italic: false,
    category: 'handwritten',
    fallback: 'cursive',
  },
  'Amatic SC': {
    weights: [400, 700],
    italic: false,
    category: 'handwritten',
    fallback: 'cursive',
  },

  /* Elegant body */
  'Cormorant': {
    weights: [300, 400, 600, 700],
    italic: true,
    category: 'body',
    fallback: 'serif',
  },
  'Lora': {
    weights: [400, 700],
    italic: true,
    category: 'body',
    fallback: 'serif',
  },

  /* Decorative / accents */
  'Sacramento': {
    weights: [400],
    italic: false,
    category: 'accent',
    fallback: 'cursive',
  },
  'Great Vibes': {
    weights: [400],
    italic: false,
    category: 'accent',
    fallback: 'cursive',
  },
  'Pacifico': {
    weights: [400],
    italic: false,
    category: 'accent',
    fallback: 'cursive',
  },
};

/* ── Categorised lists ───────────────────────────────── */

function fontsByCategory(cat) {
  return Object.entries(FONT_REGISTRY)
    .filter(([, cfg]) => cfg.category === cat)
    .map(([name]) => name);
}

export const TITLE_FONTS       = fontsByCategory('title');
export const HANDWRITTEN_FONTS = fontsByCategory('handwritten');
export const BODY_FONTS        = fontsByCategory('body');
export const ACCENT_FONTS      = fontsByCategory('accent');

/* Quotes can draw from titles + body for variety */
export const QUOTE_FONTS = [...TITLE_FONTS, ...BODY_FONTS];

/* ── Google Fonts URL builder ────────────────────────── */

/**
 * Build a single Google Fonts CSS @import URL that loads
 * every font in the registry with all specified weights.
 *
 * Example output:
 *   https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=...&display=swap
 */
export function buildGoogleFontsUrl() {
  const families = Object.entries(FONT_REGISTRY).map(([name, cfg]) => {
    const encodedName = name.replace(/ /g, '+');

    /* Build axis tuples: ital,wght pairs */
    const tuples = [];
    for (const w of cfg.weights) {
      tuples.push(`0,${w}`);
      if (cfg.italic) tuples.push(`1,${w}`);
    }

    return `family=${encodedName}:ital,wght@${tuples.join(';')}`;
  });

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

/**
 * Returns a full CSS @import statement ready to paste
 * into a stylesheet.
 */
export function buildGoogleFontsImport() {
  return `@import url('${buildGoogleFontsUrl()}');`;
}

/* ── Harmonic pairing engine ─────────────────────────── */

/**
 * Pre-curated harmonic pairings.
 * Each set is hand-picked so the fonts complement each
 * other in rhythm, weight, and personality.
 */
const HARMONIC_PAIRINGS = [
  {
    title:       'Playfair Display',
    handwritten: 'Caveat',
    body:        'Lora',
    accent:      'Sacramento',
    quote:       'Cormorant Garamond',
  },
  {
    title:       'Cormorant Garamond',
    handwritten: 'Dancing Script',
    body:        'Cormorant',
    accent:      'Great Vibes',
    quote:       'Playfair Display',
  },
  {
    title:       'Libre Baskerville',
    handwritten: 'Shadows Into Light',
    body:        'Lora',
    accent:      'Pacifico',
    quote:       'Cormorant Garamond',
  },
  {
    title:       'Playfair Display',
    handwritten: 'Indie Flower',
    body:        'Cormorant',
    accent:      'Sacramento',
    quote:       'Libre Baskerville',
  },
  {
    title:       'Cormorant Garamond',
    handwritten: 'Amatic SC',
    body:        'Lora',
    accent:      'Great Vibes',
    quote:       'Playfair Display',
  },
  {
    title:       'Libre Baskerville',
    handwritten: 'Caveat',
    body:        'Cormorant',
    accent:      'Great Vibes',
    quote:       'Cormorant Garamond',
  },
  {
    title:       'Playfair Display',
    handwritten: 'Dancing Script',
    body:        'Lora',
    accent:      'Pacifico',
    quote:       'Cormorant',
  },
  {
    title:       'Cormorant Garamond',
    handwritten: 'Shadows Into Light',
    body:        'Cormorant',
    accent:      'Sacramento',
    quote:       'Libre Baskerville',
  },
];

/**
 * Given a seed engine, deterministically pick a harmonic
 * font pairing for the session.
 */
export function getHarmonicPairing(seed) {
  const index = seed.randomInt(0, HARMONIC_PAIRINGS.length - 1);
  return HARMONIC_PAIRINGS[index];
}

/**
 * Resolve a font name to its full CSS font-family value
 * including the fallback generic family.
 */
export function fontFamily(name) {
  const cfg = FONT_REGISTRY[name];
  if (!cfg) return `'${name}', serif`;
  return `'${name}', ${cfg.fallback}`;
}

export default FONT_REGISTRY;
