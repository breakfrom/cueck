/* ─────────────────────────────────────────────────────────
 *  Decoratives Library
 *  15 inline-SVG physical objects for page scattering
 * ───────────────────────────────────────────────────────── */

import React from 'react';
import { createSeedEngine } from '../../engine/seed';
import './Decoratives.css';

/* ── Helpers ─────────────────────────────────────────── */

function hexShift(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  let r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  let b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/* ── 1. DriedFlower ──────────────────────────────────── */

export function DriedFlower({ seed = 0, palette, size = 48, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(25);
  const c1 = palette?.muted || '#c4a99a';
  const c2 = palette?.secondary || '#e8c4b8';
  const c3 = hexShift(c1, -20);

  return (
    <span className="deco-wrapper deco-dried-flower" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 1.3} viewBox="0 0 48 62" fill="none">
        {/* stem */}
        <path d="M24 62 C24 42, 22 35, 24 28" stroke={c3} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M24 45 C18 40, 14 38, 12 35" stroke={c3} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        {/* petals */}
        <ellipse cx="24" cy="18" rx="8" ry="14" fill={c1} opacity="0.55" transform="rotate(-15 24 18)" />
        <ellipse cx="24" cy="18" rx="8" ry="14" fill={c2} opacity="0.45" transform="rotate(20 24 18)" />
        <ellipse cx="24" cy="18" rx="7" ry="12" fill={c1} opacity="0.4" transform="rotate(55 24 18)" />
        <ellipse cx="24" cy="18" rx="7" ry="13" fill={c2} opacity="0.35" transform="rotate(-50 24 18)" />
        {/* center */}
        <circle cx="24" cy="18" r="4" fill={c3} opacity="0.6" />
        <circle cx="24" cy="18" r="2" fill={c1} opacity="0.4" />
      </svg>
    </span>
  );
}

/* ── 2. Petal ────────────────────────────────────────── */

export function Petal({ seed = 0, palette, size = 28, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(45);
  const c = palette?.primary || '#c2727f';

  return (
    <span className="deco-wrapper deco-petal" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 1.4} viewBox="0 0 28 40" fill="none">
        <path
          d="M14 2 C6 8, 2 18, 4 28 C6 34, 10 38, 14 38 C18 38, 22 34, 24 28 C26 18, 22 8, 14 2Z"
          fill={c}
          opacity="0.4"
        />
        <path
          d="M14 6 C14 14, 13 22, 14 32"
          stroke={hexShift(c, -30)}
          strokeWidth="0.6"
          opacity="0.3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/* ── 3. LeafSprig ────────────────────────────────────── */

export function LeafSprig({ seed = 0, palette, size = 52, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(30);
  const c = palette?.muted || '#7a8b6f';
  const c2 = hexShift(c, 15);

  return (
    <span className="deco-wrapper deco-leaf-sprig" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 0.7} viewBox="0 0 60 42" fill="none">
        {/* main stem */}
        <path d="M5 38 C15 30, 35 18, 55 8" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
        {/* leaves */}
        <ellipse cx="18" cy="30" rx="6" ry="10" fill={c2} opacity="0.35" transform="rotate(-35 18 30)" />
        <ellipse cx="30" cy="22" rx="5" ry="9" fill={c} opacity="0.3" transform="rotate(-25 30 22)" />
        <ellipse cx="42" cy="15" rx="5" ry="8" fill={c2} opacity="0.35" transform="rotate(-40 42 15)" />
        <ellipse cx="25" cy="28" rx="4" ry="7" fill={c} opacity="0.25" transform="rotate(30 25 28)" />
        <ellipse cx="38" cy="19" rx="4" ry="7" fill={c2} opacity="0.28" transform="rotate(25 38 19)" />
      </svg>
    </span>
  );
}

/* ── 4. DrawnHeart ───────────────────────────────────── */

export function DrawnHeart({ seed = 0, palette, size = 32, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(15);
  const c = palette?.primary || '#c2727f';

  return (
    <span className="deco-wrapper deco-drawn-heart" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path
          d="M16 28 C12 24, 3 18, 3 11 C3 6, 7 3, 11 3 C13 3, 15 5, 16 7 C17 5, 19 3, 21 3 C25 3, 29 6, 29 11 C29 18, 20 24, 16 28Z"
          fill={c}
          opacity="0.35"
        />
        {/* hand-drawn outline - slightly wobbly */}
        <path
          d="M16 27 C12 23, 4 17, 4 11 C4 7, 7.5 4, 11 4 C13.5 4, 15 5.5, 16 7.5 C17 5.5, 18.5 4, 21 4 C24.5 4, 28 7, 28 11 C28 17, 20 23, 16 27Z"
          stroke={c}
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="2 1"
        />
      </svg>
    </span>
  );
}

/* ── 5. DrawnStar ────────────────────────────────────── */

export function DrawnStar({ seed = 0, palette, size = 28, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(20);
  const c = palette?.accent || '#d4916e';

  return (
    <span className="deco-wrapper deco-drawn-star" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path
          d="M14 2 L16.5 10 L25 10.5 L18.5 15.5 L20.5 24 L14 19 L7.5 24 L9.5 15.5 L3 10.5 L11.5 10Z"
          fill={c}
          opacity="0.3"
        />
        <path
          d="M14 3 L16 10.5 L24 11 L18 15.5 L20 23 L14 18.5 L8 23 L10 15.5 L4 11 L12 10.5Z"
          stroke={c}
          strokeWidth="0.9"
          opacity="0.45"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* ── 6. Doodle ───────────────────────────────────────── */

export function Doodle({ seed = 0, palette, size = 40, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(35);
  const c = palette?.ink || '#3b2626';
  const variant = s.randomInt(0, 2);

  const paths = [
    // squiggle
    'M5 20 C10 10, 15 30, 20 15 C25 5, 30 25, 35 18',
    // arrow
    'M8 30 C12 18, 18 10, 32 6 M26 4 L32 6 L28 12',
    // spiral
    'M20 20 C20 16, 24 14, 26 16 C28 18, 26 22, 22 22 C18 22, 14 18, 14 14 C14 10, 18 6, 24 6',
  ];

  return (
    <span className="deco-wrapper deco-doodle" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path
          d={paths[variant]}
          stroke={c}
          strokeWidth="1.1"
          opacity="0.25"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

/* ── 7. StickyNote ───────────────────────────────────── */

export function StickyNote({ seed = 0, palette, size = 70, text = '', style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(8);
  const colors = ['#fef3a7', '#fde2e4', '#d4f0c4', '#c9e4f6', '#fdd9b5'];
  const bg = s.pick(colors);

  return (
    <span className="deco-wrapper deco-sticky-note" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <div
        className="deco-sticky-note__body"
        style={{
          width: size,
          height: size * 0.85,
          backgroundColor: bg,
          borderRadius: '1px 1px 3px 1px',
        }}
      >
        {text && <span className="deco-sticky-note__text">{text}</span>}
      </div>
    </span>
  );
}

/* ── 8. PostalStamp ──────────────────────────────────── */

export function PostalStamp({ seed = 0, palette, size = 52, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(12);
  const c1 = palette?.primary || '#9e4a5b';
  const c2 = palette?.paper || '#fef9f4';

  return (
    <span className="deco-wrapper deco-postal-stamp" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 52 62" fill="none">
        {/* perforated edge */}
        <rect x="4" y="4" width="44" height="54" rx="1" fill={c2} stroke={c1} strokeWidth="0.8" opacity="0.8" />
        {/* perforations */}
        {Array.from({ length: 10 }).map((_, i) => (
          <React.Fragment key={i}>
            <circle cx={7 + i * 4.2} cy="2" r="1.2" fill="white" />
            <circle cx={7 + i * 4.2} cy="60" r="1.2" fill="white" />
          </React.Fragment>
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <React.Fragment key={`v${i}`}>
            <circle cx="2" cy={6 + i * 4.2} r="1.2" fill="white" />
            <circle cx="50" cy={6 + i * 4.2} r="1.2" fill="white" />
          </React.Fragment>
        ))}
        {/* inner design */}
        <rect x="9" y="9" width="34" height="28" rx="1" fill={c1} opacity="0.15" />
        <text x="26" y="46" textAnchor="middle" fontSize="5" fill={c1} opacity="0.6" fontFamily="serif">
          CORREO
        </text>
        <text x="26" y="53" textAnchor="middle" fontSize="4" fill={c1} opacity="0.4" fontFamily="serif">
          2024
        </text>
        {/* small heart in stamp */}
        <path d="M26 20 C24 17, 20 16, 20 19 C20 22, 26 26, 26 26 C26 26, 32 22, 32 19 C32 16, 28 17, 26 20Z" fill={c1} opacity="0.35" />
      </svg>
    </span>
  );
}

/* ── 9. Label ────────────────────────────────────────── */

export function Label({ seed = 0, palette, size = 60, text = '', style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(10);
  const c = palette?.secondary || '#e8c4b8';
  const ink = palette?.ink || '#3b2626';

  return (
    <span className="deco-wrapper deco-label" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 0.5} viewBox="0 0 80 40" fill="none">
        {/* tag shape */}
        <path
          d="M5 5 L65 5 L75 20 L65 35 L5 35 Z"
          fill={c}
          opacity="0.6"
          stroke={ink}
          strokeWidth="0.5"
          strokeOpacity="0.15"
        />
        {/* hole */}
        <circle cx="11" cy="20" r="2.5" fill="white" opacity="0.6" />
        {/* string */}
        <path d="M2 15 C5 18, 8 17, 8.5 20" stroke={ink} strokeWidth="0.5" opacity="0.3" fill="none" />
        {text && (
          <text x="38" y="23" textAnchor="middle" fontSize="7" fill={ink} opacity="0.5" fontFamily="'Caveat', cursive">
            {text}
          </text>
        )}
      </svg>
    </span>
  );
}

/* ── 10. TornPaper ───────────────────────────────────── */

export function TornPaper({ seed = 0, palette, size = 60, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(15);
  const c = palette?.paper || '#fdf6f0';
  const edge = hexShift(c, -15);

  // generate a jagged top edge
  const points = [];
  for (let i = 0; i <= 10; i++) {
    const x = i * 8;
    const y = 4 + s.randomFloat(-3, 3);
    points.push(`${x},${y}`);
  }
  const topEdge = points.join(' ');

  return (
    <span className="deco-wrapper deco-torn-paper" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 0.65} viewBox="0 0 80 52" fill="none">
        <polygon
          points={`${topEdge} 80,52 0,52`}
          fill={c}
          stroke={edge}
          strokeWidth="0.4"
          opacity="0.85"
        />
        {/* faint ruled lines */}
        <line x1="8" y1="18" x2="72" y2="18" stroke={edge} strokeWidth="0.3" opacity="0.3" />
        <line x1="8" y1="26" x2="72" y2="26" stroke={edge} strokeWidth="0.3" opacity="0.3" />
        <line x1="8" y1="34" x2="72" y2="34" stroke={edge} strokeWidth="0.3" opacity="0.3" />
        <line x1="8" y1="42" x2="72" y2="42" stroke={edge} strokeWidth="0.3" opacity="0.3" />
      </svg>
    </span>
  );
}

/* ── 11. Ribbon ──────────────────────────────────────── */

export function Ribbon({ seed = 0, palette, size = 50, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(20);
  const c = palette?.accent || '#d4916e';
  const c2 = hexShift(c, -25);

  return (
    <span className="deco-wrapper deco-ribbon" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 0.7} viewBox="0 0 60 42" fill="none">
        {/* ribbon tails */}
        <path d="M10 38 L22 22 L16 22 L28 6" stroke={c} strokeWidth="5" strokeLinecap="round" opacity="0.4" fill="none" />
        <path d="M50 38 L38 22 L44 22 L32 6" stroke={c} strokeWidth="5" strokeLinecap="round" opacity="0.4" fill="none" />
        {/* bow loops */}
        <ellipse cx="22" cy="12" rx="10" ry="8" fill={c} opacity="0.45" transform="rotate(-15 22 12)" />
        <ellipse cx="38" cy="12" rx="10" ry="8" fill={c} opacity="0.45" transform="rotate(15 38 12)" />
        {/* center knot */}
        <ellipse cx="30" cy="14" rx="4" ry="5" fill={c2} opacity="0.5" />
      </svg>
    </span>
  );
}

/* ── 12. Button ──────────────────────────────────────── */

export function Button({ seed = 0, palette, size = 24, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(40);
  const colors = ['#d4a373', '#b5838d', '#8b9474', '#a8b5c4', '#cdb4db'];
  const c = s.pick(colors);

  return (
    <span className="deco-wrapper deco-button" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={c} opacity="0.6" />
        <circle cx="12" cy="12" r="10" fill="none" stroke={hexShift(c, -30)} strokeWidth="0.8" opacity="0.4" />
        <circle cx="12" cy="12" r="7" fill="none" stroke={hexShift(c, -20)} strokeWidth="0.4" opacity="0.3" />
        {/* thread holes */}
        <circle cx="9" cy="9" r="1.2" fill="white" opacity="0.5" />
        <circle cx="15" cy="9" r="1.2" fill="white" opacity="0.5" />
        <circle cx="9" cy="15" r="1.2" fill="white" opacity="0.5" />
        <circle cx="15" cy="15" r="1.2" fill="white" opacity="0.5" />
        {/* thread */}
        <line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="0.5" opacity="0.35" />
        <line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="0.5" opacity="0.35" />
      </svg>
    </span>
  );
}

/* ── 13. CinemaTicket ────────────────────────────────── */

export function CinemaTicket({ seed = 0, palette, size = 80, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(10);
  const c1 = palette?.accent || '#c8a96e';
  const c2 = palette?.paper || '#f0ece4';
  const ink = palette?.ink || '#1a1a24';

  return (
    <span className="deco-wrapper deco-cinema-ticket" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 0.42} viewBox="0 0 100 42" fill="none">
        {/* ticket body with notch */}
        <path
          d="M2 2 L70 2 L70 8 C73 8, 75 12, 75 14 C75 16, 73 20, 70 20 L70 22 C73 22, 75 26, 75 28 C75 30, 73 34, 70 34 L70 40 L2 40 Z"
          fill={c2}
          stroke={c1}
          strokeWidth="0.6"
          opacity="0.85"
        />
        {/* stub */}
        <path
          d="M70 2 L98 2 L98 40 L70 40 L70 34 C67 34, 65 30, 65 28 C65 26, 67 22, 70 22 L70 20 C67 20, 65 16, 65 14 C65 12, 67 8, 70 8 Z"
          fill={c2}
          stroke={c1}
          strokeWidth="0.6"
          opacity="0.75"
        />
        {/* perforation line */}
        <line x1="70" y1="4" x2="70" y2="8" stroke={c1} strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.4" />
        <line x1="70" y1="20" x2="70" y2="22" stroke={c1} strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.4" />
        <line x1="70" y1="34" x2="70" y2="40" stroke={c1} strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.4" />
        {/* text */}
        <text x="36" y="16" textAnchor="middle" fontSize="5.5" fill={ink} opacity="0.5" fontFamily="serif" fontWeight="600">
          CINEMA
        </text>
        <text x="36" y="25" textAnchor="middle" fontSize="3.5" fill={ink} opacity="0.35" fontFamily="sans-serif">
          ADMIT ONE
        </text>
        <text x="36" y="35" textAnchor="middle" fontSize="3" fill={c1} opacity="0.4" fontFamily="serif">
          ★ ★ ★
        </text>
        {/* stub number */}
        <text x="84" y="24" textAnchor="middle" fontSize="5" fill={ink} opacity="0.4" fontFamily="monospace">
          {s.randomInt(100, 999)}
        </text>
      </svg>
    </span>
  );
}

/* ── 14. WaxSeal ─────────────────────────────────────── */

export function WaxSeal({ seed = 0, palette, size = 38, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(15);
  const c = palette?.primary || '#9e4a5b';
  const c2 = hexShift(c, 20);

  // irregular circle for wax blob
  const blobPoints = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const r = 14 + s.randomFloat(-2, 2.5);
    const x = 19 + Math.cos(angle) * r;
    const y = 19 + Math.sin(angle) * r;
    return `${x},${y}`;
  }).join(' ');

  return (
    <span className="deco-wrapper deco-wax-seal" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
        {/* wax blob */}
        <polygon points={blobPoints} fill={c} opacity="0.65" />
        {/* highlight */}
        <circle cx="16" cy="15" r="5" fill={c2} opacity="0.2" />
        {/* inner ring */}
        <circle cx="19" cy="19" r="8" fill="none" stroke={hexShift(c, -20)} strokeWidth="0.8" opacity="0.35" />
        {/* embossed initial */}
        <text x="19" y="23" textAnchor="middle" fontSize="10" fill={hexShift(c, -35)} opacity="0.4" fontFamily="serif" fontWeight="700">
          G
        </text>
      </svg>
    </span>
  );
}

/* ── 15. PaperClipDeco ───────────────────────────────── */

export function PaperClipDeco({ seed = 0, palette, size = 20, style }) {
  const s = createSeedEngine(seed);
  const rot = s.randomRotation(30);
  const colors = ['#b0b0b0', '#c9a87c', '#d4a373', '#8e8e8e', '#c4956a'];
  const c = s.pick(colors);

  return (
    <span className="deco-wrapper deco-paper-clip" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size * 2.4} viewBox="0 0 16 38" fill="none">
        <path
          d="M5 35 L5 8 C5 4, 11 4, 11 8 L11 30 C11 33, 7 33, 7 30 L7 12"
          stroke={c}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
          fill="none"
        />
      </svg>
    </span>
  );
}

/* ── Decoration Registry ─────────────────────────────── */

const ALL_DECORATIVES = [
  { Component: DriedFlower,   weight: 3 },
  { Component: Petal,         weight: 4 },
  { Component: LeafSprig,     weight: 3 },
  { Component: DrawnHeart,    weight: 4 },
  { Component: DrawnStar,     weight: 2 },
  { Component: Doodle,        weight: 3 },
  { Component: StickyNote,    weight: 1 },
  { Component: PostalStamp,   weight: 2 },
  { Component: Label,         weight: 1 },
  { Component: TornPaper,     weight: 2 },
  { Component: Ribbon,        weight: 2 },
  { Component: Button,        weight: 3 },
  { Component: CinemaTicket,  weight: 1 },
  { Component: WaxSeal,       weight: 2 },
  { Component: PaperClipDeco, weight: 3 },
];

/* ── getRandomDecorations ────────────────────────────── */

/**
 * Returns an array of { Component, props, position } objects
 * for scattering decoratives across a page.
 *
 * @param {object}  seedEngine  - a seed engine instance
 * @param {number}  count       - how many decoratives to place
 * @param {object}  palette     - art direction palette
 * @returns {Array}
 */
export function getRandomDecorations(seedEngine, count = 6, palette = {}) {
  // Build a weighted pool
  const pool = [];
  for (const entry of ALL_DECORATIVES) {
    for (let w = 0; w < entry.weight; w++) {
      pool.push(entry.Component);
    }
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    const Component = seedEngine.pick(pool);
    const childSeed = seedEngine.randomInt(0, 999999);

    result.push({
      Component,
      props: {
        seed: childSeed,
        palette,
        key: `deco-${i}-${childSeed}`,
      },
      position: {
        top:  `${seedEngine.randomFloat(5, 90)}%`,
        left: `${seedEngine.randomFloat(5, 90)}%`,
        position: 'absolute',
        zIndex: seedEngine.randomInt(1, 5),
      },
    });
  }

  return result;
}

export default {
  DriedFlower,
  Petal,
  LeafSprig,
  DrawnHeart,
  DrawnStar,
  Doodle,
  StickyNote,
  PostalStamp,
  Label,
  TornPaper,
  Ribbon,
  Button,
  CinemaTicket,
  WaxSeal,
  PaperClipDeco,
  getRandomDecorations,
};
