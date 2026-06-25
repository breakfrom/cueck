/* ─────────────────────────────────────────────────────────
 *  Art Direction System
 *  8 visual themes – the seed picks one per session
 * ───────────────────────────────────────────────────────── */

const THEMES = [

  /* 0 ─ Romantic Scrapbook ─────────────────────────────── */
  {
    name: 'romantic-scrapbook',
    palette: {
      primary:   '#c2727f',
      secondary: '#e8c4b8',
      accent:    '#d4916e',
      paper:     '#fdf6f0',
      ink:       '#3b2626',
      muted:     '#c4a99a',
    },
    paperTexture: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 29px,
        rgba(194,114,127,0.04) 29px,
        rgba(194,114,127,0.04) 30px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 29px,
        rgba(194,114,127,0.03) 29px,
        rgba(194,114,127,0.03) 30px
      ),
      radial-gradient(
        ellipse at 70% 30%,
        rgba(232,196,184,0.22) 0%,
        transparent 70%
      )
    `,
    fontPairings: {
      title:       'Playfair Display',
      handwritten: 'Caveat',
      body:        'Lora',
      accent:      'Sacramento',
      quote:       'Cormorant Garamond',
    },
    decorativeStyle: 'scattered',
    moodKeywords: ['warm', 'nostalgic', 'tender', 'blush', 'handmade'],
  },

  /* 1 ─ Vintage Diary ──────────────────────────────────── */
  {
    name: 'vintage-diary',
    palette: {
      primary:   '#8b6f47',
      secondary: '#d4c5a9',
      accent:    '#b8860b',
      paper:     '#f5eed6',
      ink:       '#2c2416',
      muted:     '#b8a88a',
    },
    paperTexture: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 23px,
        rgba(139,111,71,0.07) 23px,
        rgba(139,111,71,0.07) 24px
      ),
      radial-gradient(
        circle at 20% 80%,
        rgba(184,134,11,0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 85% 15%,
        rgba(139,111,71,0.06) 0%,
        transparent 40%
      )
    `,
    fontPairings: {
      title:       'Libre Baskerville',
      handwritten: 'Shadows Into Light',
      body:        'Cormorant',
      accent:      'Great Vibes',
      quote:       'Cormorant Garamond',
    },
    decorativeStyle: 'minimal',
    moodKeywords: ['sepia', 'aged', 'intimate', 'leather', 'penned'],
  },

  /* 2 ─ Love Letters ───────────────────────────────────── */
  {
    name: 'love-letters',
    palette: {
      primary:   '#9e4a5b',
      secondary: '#f2dede',
      accent:    '#c0392b',
      paper:     '#fef9f4',
      ink:       '#2d1f2f',
      muted:     '#cba4b1',
    },
    paperTexture: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 27px,
        rgba(158,74,91,0.06) 27px,
        rgba(158,74,91,0.06) 28px
      ),
      linear-gradient(
        135deg,
        rgba(242,222,222,0.18) 0%,
        transparent 60%
      )
    `,
    fontPairings: {
      title:       'Cormorant Garamond',
      handwritten: 'Dancing Script',
      body:        'Lora',
      accent:      'Great Vibes',
      quote:       'Playfair Display',
    },
    decorativeStyle: 'lush',
    moodKeywords: ['passionate', 'ink', 'sealed', 'crimson', 'heartfelt'],
  },

  /* 3 ─ Pressed Flowers ────────────────────────────────── */
  {
    name: 'pressed-flowers',
    palette: {
      primary:   '#7a8b6f',
      secondary: '#e8ddd0',
      accent:    '#c7956d',
      paper:     '#faf7f2',
      ink:       '#3a3a2e',
      muted:     '#b5c1a8',
    },
    paperTexture: `
      radial-gradient(
        ellipse at 30% 70%,
        rgba(122,139,111,0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 75% 25%,
        rgba(199,149,109,0.07) 0%,
        transparent 45%
      ),
      radial-gradient(
        circle at 50% 50%,
        transparent 60%,
        rgba(232,221,208,0.15) 100%
      )
    `,
    fontPairings: {
      title:       'Playfair Display',
      handwritten: 'Indie Flower',
      body:        'Cormorant',
      accent:      'Sacramento',
      quote:       'Libre Baskerville',
    },
    decorativeStyle: 'lush',
    moodKeywords: ['botanical', 'gentle', 'earthy', 'sun-dried', 'garden'],
  },

  /* 4 ─ Cinema Memories ────────────────────────────────── */
  {
    name: 'cinema-memories',
    palette: {
      primary:   '#4a4a5a',
      secondary: '#d1c7b7',
      accent:    '#c8a96e',
      paper:     '#f0ece4',
      ink:       '#1a1a24',
      muted:     '#9a9487',
    },
    paperTexture: `
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 3px,
        rgba(74,74,90,0.015) 3px,
        rgba(74,74,90,0.015) 4px
      ),
      linear-gradient(
        180deg,
        rgba(200,169,110,0.06) 0%,
        transparent 30%,
        transparent 70%,
        rgba(200,169,110,0.04) 100%
      )
    `,
    fontPairings: {
      title:       'Libre Baskerville',
      handwritten: 'Caveat',
      body:        'Lora',
      accent:      'Pacifico',
      quote:       'Cormorant Garamond',
    },
    decorativeStyle: 'minimal',
    moodKeywords: ['filmic', 'silver-screen', 'noir', 'golden', 'reel'],
  },

  /* 5 ─ Moonlit Journal ────────────────────────────────── */
  {
    name: 'moonlit-journal',
    palette: {
      primary:   '#6b7b99',
      secondary: '#d5dae6',
      accent:    '#b8a9c9',
      paper:     '#f4f2f7',
      ink:       '#1e1e2f',
      muted:     '#9a9eb5',
    },
    paperTexture: `
      radial-gradient(
        ellipse at 50% 0%,
        rgba(184,169,201,0.12) 0%,
        transparent 55%
      ),
      radial-gradient(
        circle at 80% 90%,
        rgba(107,123,153,0.08) 0%,
        transparent 40%
      ),
      linear-gradient(
        180deg,
        rgba(213,218,230,0.1) 0%,
        transparent 100%
      )
    `,
    fontPairings: {
      title:       'Cormorant Garamond',
      handwritten: 'Shadows Into Light',
      body:        'Cormorant',
      accent:      'Dancing Script',
      quote:       'Playfair Display',
    },
    decorativeStyle: 'scattered',
    moodKeywords: ['dreamy', 'twilight', 'soft', 'lavender', 'starlit'],
  },

  /* 6 ─ Watercolor Dreams ──────────────────────────────── */
  {
    name: 'watercolor-dreams',
    palette: {
      primary:   '#7ca5b8',
      secondary: '#f0d9c6',
      accent:    '#d4816b',
      paper:     '#fefcf8',
      ink:       '#2a2a35',
      muted:     '#b0c4ce',
    },
    paperTexture: `
      radial-gradient(
        ellipse at 15% 85%,
        rgba(124,165,184,0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 85% 20%,
        rgba(212,129,107,0.09) 0%,
        transparent 45%
      ),
      radial-gradient(
        ellipse at 50% 50%,
        rgba(240,217,198,0.12) 0%,
        transparent 60%
      )
    `,
    fontPairings: {
      title:       'Playfair Display',
      handwritten: 'Amatic SC',
      body:        'Lora',
      accent:      'Sacramento',
      quote:       'Cormorant Garamond',
    },
    decorativeStyle: 'lush',
    moodKeywords: ['flowing', 'pigment', 'translucent', 'wash', 'airy'],
  },

  /* 7 ─ Golden Afternoon ───────────────────────────────── */
  {
    name: 'golden-afternoon',
    palette: {
      primary:   '#b8860b',
      secondary: '#f5e6c8',
      accent:    '#c2544b',
      paper:     '#fefaf0',
      ink:       '#2c2410',
      muted:     '#cdb87c',
    },
    paperTexture: `
      radial-gradient(
        ellipse at 60% 0%,
        rgba(184,134,11,0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 30% 95%,
        rgba(194,84,75,0.06) 0%,
        transparent 40%
      ),
      linear-gradient(
        45deg,
        rgba(245,230,200,0.15) 0%,
        transparent 60%
      )
    `,
    fontPairings: {
      title:       'Libre Baskerville',
      handwritten: 'Caveat',
      body:        'Cormorant',
      accent:      'Great Vibes',
      quote:       'Cormorant Garamond',
    },
    decorativeStyle: 'geometric',
    moodKeywords: ['honey', 'sunlit', 'amber', 'languid', 'golden'],
  },
];

/* ── Public API ────────────────────────────────────────── */

/**
 * Given a seed engine, deterministically pick one of the
 * 8 art-direction themes for the session.
 */
export function getArtDirection(seed) {
  const index = seed.randomInt(0, THEMES.length - 1);
  return THEMES[index];
}

/** Return all themes (useful for previews / dev) */
export function getAllThemes() {
  return THEMES;
}

/** Look up a theme by name */
export function getThemeByName(name) {
  return THEMES.find((t) => t.name === name) || THEMES[0];
}

export default THEMES;
