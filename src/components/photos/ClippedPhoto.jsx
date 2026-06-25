import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRange, randomRotation, randomBool } from './photoUtils';
import './photos.css';

function MetalClip({ isGold = false, side = 'top', clipId }) {
  const baseColor = isGold ? '#C5A44E' : '#A8A8A8';
  const lightColor = isGold ? '#E8D48B' : '#D4D4D4';
  const darkColor = isGold ? '#8B7635' : '#787878';
  const gradId = `metalGrad-${clipId}`;

  const rotation = side === 'top' ? 0 : side === 'left' ? 90 : side === 'right' ? -90 : 180;

  return (
    <svg
      className={`photo-clip photo-clip--${side}`}
      width="32"
      height="52"
      viewBox="0 0 32 52"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darkColor} />
          <stop offset="25%" stopColor={lightColor} />
          <stop offset="50%" stopColor={baseColor} />
          <stop offset="75%" stopColor={lightColor} />
          <stop offset="100%" stopColor={darkColor} />
        </linearGradient>
      </defs>
      {/* Clip handle (top) */}
      <path
        d="M6 0 L26 0 L28 4 L26 8 L6 8 L4 4 Z"
        fill={`url(#${gradId})`}
        stroke={darkColor}
        strokeWidth="0.5"
      />
      {/* Clip arm left */}
      <rect x="7" y="8" width="3" height="40" rx="1" fill={`url(#${gradId})`} stroke={darkColor} strokeWidth="0.3" />
      {/* Clip arm right */}
      <rect x="22" y="8" width="3" height="40" rx="1" fill={`url(#${gradId})`} stroke={darkColor} strokeWidth="0.3" />
      {/* Spring coil */}
      <ellipse cx="16" cy="12" rx="6" ry="3" fill="none" stroke={darkColor} strokeWidth="1" />
      {/* Clip bottom join */}
      <path
        d="M7 44 Q16 52 25 44"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ClippedPhoto({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 2;

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 6);
    const isGold = randomBool(rng, 0.35);
    const clipSide = 'top';
    const xShift = randomRange(rng, -10, 10);
    const overlap = i > 0 ? randomRange(rng, -20, -5) : 0;
    return { rotation, isGold, clipSide, xShift, overlap, index: i };
  });

  return (
    <div className="photo-clipped-container">
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        return (
          <motion.div
            key={p.index}
            className="photo-clipped-item"
            style={{
              transform: `rotate(${p.rotation}deg) translateX(${p.xShift}px)`,
              marginLeft: p.overlap,
              zIndex: photoCount - p.index,
            }}
            whileHover={{ scale: 1.04, zIndex: 20, rotate: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <MetalClip isGold={p.isGold} side={p.clipSide} clipId={`${seed}-${p.index}`} />
            <div className="photo-clipped-photo photo-paper">
              {photoSrc ? (
                <img src={photoSrc} alt={caption || `Photo ${p.index + 1}`} draggable={false} />
              ) : (
                <div className="photo-placeholder" />
              )}
            </div>
            {caption && <span className="photo-clipped-caption">{caption}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
