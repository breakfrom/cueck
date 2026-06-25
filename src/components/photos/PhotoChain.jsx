import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomBool, randomPick } from './photoUtils';
import './photos.css';

const CHAIN_COLORS = ['#c0392b', '#e84393', '#d63031', '#e17055', '#fd79a8'];

function HeartIcon({ x, y, size, color, delay }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      animate={{ scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
    >
      <path
        d={`M0,${size * 0.35} 
            C0,${size * 0.15} ${size * 0.25},0 ${size * 0.5},${size * 0.2}
            C${size * 0.75},0 ${size},${size * 0.15} ${size},${size * 0.35}
            C${size},${size * 0.6} ${size * 0.5},${size * 0.85} ${size * 0.5},${size}
            C${size * 0.5},${size * 0.85} 0,${size * 0.6} 0,${size * 0.35}Z`}
        fill={color}
        opacity="0.7"
      />
    </motion.g>
  );
}

function FlowerIcon({ x, y, size, color, delay }) {
  const petalCount = 5;
  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay }}
    >
      {Array.from({ length: petalCount }, (_, i) => {
        const angle = (360 / petalCount) * i;
        return (
          <ellipse
            key={i}
            cx="0"
            cy={-size * 0.4}
            rx={size * 0.2}
            ry={size * 0.35}
            fill={color}
            opacity="0.6"
            transform={`rotate(${angle})`}
          />
        );
      })}
      <circle cx="0" cy="0" r={size * 0.15} fill="#f9ca24" opacity="0.8" />
    </motion.g>
  );
}

export default function PhotoChain({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 3;
  const chainColor = randomPick(rng, CHAIN_COLORS);

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 6);
    const yOffset = randomRange(rng, 0, 40);
    const useHeart = randomBool(rng, 0.6);
    return { rotation, yOffset, useHeart, index: i };
  });

  const itemWidth = 200;
  const totalWidth = photoCount * itemWidth;

  return (
    <div className="photo-chain-container" style={{ width: totalWidth }}>
      {/* Connecting chain SVG */}
      <svg
        className="photo-chain-line"
        width={totalWidth}
        height="300"
        viewBox={`0 0 ${totalWidth} 300`}
      >
        {/* Chain line */}
        {photos.map((p, i) => {
          if (i === photoCount - 1) return null;
          const x1 = i * itemWidth + itemWidth / 2;
          const y1 = 30 + p.yOffset;
          const x2 = (i + 1) * itemWidth + itemWidth / 2;
          const y2 = 30 + photos[i + 1].yOffset;
          const midX = (x1 + x2) / 2;
          const midY = Math.max(y1, y2) + 30;

          return (
            <g key={`chain-${i}`}>
              <path
                d={`M${x1},${y1} Q${midX},${midY} ${x2},${y2}`}
                fill="none"
                stroke={chainColor}
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.5"
              />
              {/* Decoration along chain */}
              {p.useHeart ? (
                <HeartIcon
                  x={midX - 6}
                  y={midY - 8}
                  size={12}
                  color={chainColor}
                  delay={i * 0.5}
                />
              ) : (
                <FlowerIcon
                  x={midX}
                  y={midY - 4}
                  size={10}
                  color={chainColor}
                  delay={i * 0.5}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Photos */}
      <div className="photo-chain-photos">
        {photos.map((p) => {
          const photoSrc = images[p.index] || '';
          const caption = captions[p.index] || '';
          return (
            <motion.div
              key={p.index}
              className="photo-chain-item"
              style={{
                transform: `rotate(${p.rotation}deg)`,
                marginTop: p.yOffset,
              }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="photo-chain-photo photo-paper">
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={caption || `Photo ${p.index + 1}`}
                    draggable={false}
                  />
                ) : (
                  <div className="photo-placeholder" />
                )}
              </div>
              {caption && <span className="photo-chain-caption">{caption}</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
