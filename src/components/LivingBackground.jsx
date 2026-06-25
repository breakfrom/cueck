/* ─────────────────────────────────────────────────────────
 *  LivingBackground
 *  8 ambient animated scenes selected by seed
 *  Each scene is extremely subtle—never distracts
 * ───────────────────────────────────────────────────────── */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { createSeedEngine } from '../engine/seed';
import './LivingBackground.css';

/* ── Helpers ─────────────────────────────────────────── */

function range(n) {
  return Array.from({ length: n }, (_, i) => i);
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Scene 0 : Floating Petals ───────────────────────── */

function FloatingPetals({ palette, seed }) {
  const rng = createSeedEngine(seed + 100);
  const petals = useMemo(() =>
    range(18).map((i) => {
      const s = createSeedEngine(seed + 100 + i);
      return {
        id: i,
        x: s.randomFloat(0, 100),
        y: s.randomFloat(-10, 110),
        size: s.randomFloat(10, 24),
        rotation: s.randomFloat(0, 360),
        duration: s.randomFloat(18, 35),
        delay: s.randomFloat(0, 12),
        color: s.pick([palette.primary, palette.secondary, palette.accent, '#f5e6e0', '#f0d4d4']),
      };
    }),
  [seed, palette]);

  return petals.map((p) => (
    <motion.div
      key={p.id}
      className="petal"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size * 1.2,
        backgroundColor: p.color,
        transform: `rotate(${p.rotation}deg)`,
      }}
      animate={{
        y: [0, -window.innerHeight * 0.3, -window.innerHeight * 0.7],
        x: [0, p.size * 3, -p.size * 2],
        rotate: [p.rotation, p.rotation + 120, p.rotation + 240],
        opacity: [0, 0.3, 0],
      }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  ));
}

/* ── Scene 1 : Warm Bokeh ────────────────────────────── */

function WarmBokeh({ palette, seed }) {
  const orbs = useMemo(() =>
    range(15).map((i) => {
      const s = createSeedEngine(seed + 200 + i);
      return {
        id: i,
        x: s.randomFloat(5, 95),
        y: s.randomFloat(5, 95),
        size: s.randomFloat(80, 260),
        color: s.pick([palette.primary, palette.accent, palette.secondary, '#ffecd2']),
        duration: s.randomFloat(8, 18),
        delay: s.randomFloat(0, 6),
      };
    }),
  [seed, palette]);

  return orbs.map((o) => (
    <motion.div
      key={o.id}
      className="bokeh-orb"
      style={{
        left: `${o.x}%`,
        top: `${o.y}%`,
        width: o.size,
        height: o.size,
        backgroundColor: o.color,
      }}
      animate={{
        scale: [1, 1.2, 0.9, 1],
        opacity: [0.06, 0.14, 0.08, 0.06],
      }}
      transition={{
        duration: o.duration,
        delay: o.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  ));
}

/* ── Scene 2 : Dust Motes ────────────────────────────── */

function DustMotes({ palette, seed }) {
  const motes = useMemo(() =>
    range(25).map((i) => {
      const s = createSeedEngine(seed + 300 + i);
      return {
        id: i,
        x: s.randomFloat(10, 90),
        y: s.randomFloat(60, 100),
        size: s.randomFloat(2, 5),
        duration: s.randomFloat(12, 28),
        delay: s.randomFloat(0, 15),
        drift: s.randomFloat(-40, 40),
      };
    }),
  [seed, palette]);

  return motes.map((m) => (
    <motion.div
      key={m.id}
      className="dust-mote"
      style={{
        left: `${m.x}%`,
        bottom: '0%',
        width: m.size,
        height: m.size,
        backgroundColor: hexToRgba(palette.accent, 0.7),
      }}
      animate={{
        y: [0, -window.innerHeight * 0.9],
        x: [0, m.drift, -m.drift * 0.5],
        opacity: [0, 0.5, 0.35, 0],
      }}
      transition={{
        duration: m.duration,
        delay: m.delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  ));
}

/* ── Scene 3 : Leaf Shadows ──────────────────────────── */

function LeafShadows({ palette, seed }) {
  const leaves = useMemo(() =>
    range(8).map((i) => {
      const s = createSeedEngine(seed + 400 + i);
      return {
        id: i,
        x: s.randomFloat(-5, 95),
        y: s.randomFloat(-5, 85),
        size: s.randomFloat(120, 320),
        rotation: s.randomFloat(-30, 30),
        duration: s.randomFloat(10, 20),
        delay: s.randomFloat(0, 5),
        scaleX: s.randomFloat(0.6, 1.4),
      };
    }),
  [seed, palette]);

  return leaves.map((l) => (
    <motion.div
      key={l.id}
      className="leaf-shadow"
      style={{
        left: `${l.x}%`,
        top: `${l.y}%`,
        width: l.size,
        height: l.size * 0.7,
      }}
      animate={{
        rotate: [l.rotation, l.rotation + 4, l.rotation - 3, l.rotation],
        scaleX: [l.scaleX, l.scaleX * 1.05, l.scaleX * 0.95, l.scaleX],
      }}
      transition={{
        duration: l.duration,
        delay: l.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 120 80" className="leaf-shadow-shape">
        <ellipse cx="60" cy="40" rx="55" ry="35" fill={palette.ink} />
        <ellipse cx="40" cy="25" rx="30" ry="20" fill={palette.ink} />
        <ellipse cx="80" cy="55" rx="25" ry="18" fill={palette.ink} />
      </svg>
    </motion.div>
  ));
}

/* ── Scene 4 : Rain on Glass ─────────────────────────── */

function SoftRain({ palette, seed }) {
  const streaks = useMemo(() =>
    range(20).map((i) => {
      const s = createSeedEngine(seed + 500 + i);
      return {
        id: i,
        x: s.randomFloat(0, 100),
        height: s.randomFloat(30, 80),
        duration: s.randomFloat(3, 8),
        delay: s.randomFloat(0, 10),
        opacity: s.randomFloat(0.03, 0.09),
      };
    }),
  [seed, palette]);

  return streaks.map((r) => (
    <motion.div
      key={r.id}
      className="rain-streak"
      style={{
        left: `${r.x}%`,
        top: '-5%',
        height: r.height,
        backgroundColor: hexToRgba(palette.muted, 0.5),
      }}
      animate={{
        y: [0, window.innerHeight + 100],
        opacity: [0, r.opacity, r.opacity, 0],
      }}
      transition={{
        duration: r.duration,
        delay: r.delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  ));
}

/* ── Scene 5 : Fireflies ─────────────────────────────── */

function Fireflies({ palette, seed }) {
  const flies = useMemo(() =>
    range(16).map((i) => {
      const s = createSeedEngine(seed + 600 + i);
      return {
        id: i,
        x: s.randomFloat(10, 90),
        y: s.randomFloat(10, 90),
        size: s.randomFloat(4, 9),
        duration: s.randomFloat(5, 12),
        delay: s.randomFloat(0, 8),
        driftX: s.randomFloat(-60, 60),
        driftY: s.randomFloat(-60, 60),
      };
    }),
  [seed, palette]);

  return flies.map((f) => (
    <motion.div
      key={f.id}
      className="firefly"
      style={{
        left: `${f.x}%`,
        top: `${f.y}%`,
        width: f.size,
        height: f.size,
      }}
      animate={{
        x: [0, f.driftX, -f.driftX * 0.6, 0],
        y: [0, f.driftY, -f.driftY * 0.4, 0],
        opacity: [0, 0.6, 0.8, 0.3, 0],
        scale: [0.5, 1, 1.1, 0.8, 0.5],
      }}
      transition={{
        duration: f.duration,
        delay: f.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="firefly-glow"
        style={{ backgroundColor: palette.accent }}
      />
    </motion.div>
  ));
}

/* ── Scene 6 : Watercolor Wash ───────────────────────── */

function WatercolorWash({ palette, seed }) {
  const blobs = useMemo(() =>
    range(6).map((i) => {
      const s = createSeedEngine(seed + 700 + i);
      return {
        id: i,
        x: s.randomFloat(-10, 90),
        y: s.randomFloat(-10, 90),
        size: s.randomFloat(200, 500),
        color: s.pick([palette.primary, palette.secondary, palette.accent, palette.muted]),
        duration: s.randomFloat(20, 40),
        delay: s.randomFloat(0, 10),
      };
    }),
  [seed, palette]);

  return blobs.map((b) => (
    <motion.div
      key={b.id}
      className="watercolor-blob"
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        width: b.size,
        height: b.size * 0.8,
        backgroundColor: b.color,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -20, 15, 0],
        scale: [1, 1.15, 0.9, 1],
        opacity: [0.04, 0.08, 0.05, 0.04],
        borderRadius: [
          '42% 58% 63% 37% / 45% 52% 48% 55%',
          '58% 42% 37% 63% / 52% 45% 55% 48%',
          '45% 55% 58% 42% / 48% 58% 42% 52%',
          '42% 58% 63% 37% / 45% 52% 48% 55%',
        ],
      }}
      transition={{
        duration: b.duration,
        delay: b.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  ));
}

/* ── Scene 7 : Candlelight Flicker ───────────────────── */

function CandlelightFlicker({ palette, seed }) {
  const s = createSeedEngine(seed + 800);
  const glows = useMemo(() =>
    range(4).map((i) => {
      const g = createSeedEngine(seed + 800 + i);
      return {
        id: i,
        x: g.randomFloat(20, 80),
        y: g.randomFloat(30, 70),
        size: g.randomFloat(200, 450),
        duration: g.randomFloat(3, 7),
        delay: g.randomFloat(0, 2),
      };
    }),
  [seed]);

  return (
    <>
      {/* Ambient warm wash */}
      <motion.div
        className="candle-ambient"
        style={{
          background: `radial-gradient(ellipse at 50% 65%, ${hexToRgba(palette.accent, 0.06)} 0%, transparent 70%)`,
        }}
        animate={{ opacity: [1, 0.85, 1, 0.9, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Individual glow points */}
      {glows.map((g) => (
        <motion.div
          key={g.id}
          className="candle-glow"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            width: g.size,
            height: g.size,
            backgroundColor: palette.accent,
          }}
          animate={{
            opacity: [0.04, 0.09, 0.05, 0.08, 0.04],
            scale: [1, 1.06, 0.97, 1.03, 1],
          }}
          transition={{
            duration: g.duration,
            delay: g.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

/* ── Scene registry ──────────────────────────────────── */

function AmbientColorSmoke({ seed }) {
  const wisps = useMemo(() => {
    return range(10).map((i) => {
      const s = createSeedEngine(seed + 1200 + i);
      const isGreen = i < 5;
      return {
        id: i,
        color: isGreen ? 'green' : 'blue',
        x: s.randomFloat(-12, 92),
        y: s.randomFloat(4, 92),
        size: s.randomFloat(isGreen ? 180 : 240, isGreen ? 420 : 560),
        driftX: s.randomFloat(-34, 38),
        driftY: s.randomFloat(-28, 24),
        duration: s.randomFloat(16, 30),
        delay: s.randomFloat(0, 10),
        rotation: s.randomFloat(-18, 18),
      };
    });
  }, [seed]);

  return (
    <div className="ambient-color-layer">
      {wisps.map((wisp) => (
        <motion.div
          key={wisp.id}
          className={`ambient-color-wisp ambient-color-wisp-${wisp.color}`}
          style={{
            left: `${wisp.x}%`,
            top: `${wisp.y}%`,
            width: wisp.size,
            height: wisp.size * 0.68,
            rotate: `${wisp.rotation}deg`,
          }}
          animate={{
            x: [0, wisp.driftX, -wisp.driftX * 0.55, 0],
            y: [0, wisp.driftY, -wisp.driftY * 0.4, 0],
            scale: [0.94, 1.08, 0.98, 0.94],
            opacity: wisp.color === 'green'
              ? [0.05, 0.16, 0.08, 0.05]
              : [0.04, 0.13, 0.07, 0.04],
          }}
          transition={{
            duration: wisp.duration,
            delay: wisp.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

const SCENES = [
  FloatingPetals,
  WarmBokeh,
  DustMotes,
  LeafShadows,
  SoftRain,
  Fireflies,
  WatercolorWash,
  CandlelightFlicker,
];

/* ── Main Component ──────────────────────────────────── */

export default function LivingBackground({ palette, seed }) {
  const sceneIndex = useMemo(() => {
    const s = createSeedEngine(seed + 999);
    return s.randomInt(0, SCENES.length - 1);
  }, [seed]);

  const SceneComponent = SCENES[sceneIndex];

  return (
    <div className="living-bg" aria-hidden="true">
      <SceneComponent palette={palette} seed={seed} />
      <AmbientColorSmoke seed={seed} />
    </div>
  );
}

/* Named exports for manual scene selection */
export {
  FloatingPetals,
  WarmBokeh,
  DustMotes,
  LeafShadows,
  SoftRain,
  Fireflies,
  WatercolorWash,
  CandlelightFlicker,
  SCENES,
};
