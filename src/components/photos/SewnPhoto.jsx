import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomWarmColor } from './photoUtils';
import './photos.css';

export default function SewnPhoto({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 1;

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 4);
    const threadColor = randomWarmColor(rng);
    const dashLength = randomRange(rng, 6, 10);
    const gapLength = randomRange(rng, 4, 7);
    const stitchOffset = randomRange(rng, 6, 10);
    return { rotation, threadColor, dashLength, gapLength, stitchOffset, index: i };
  });

  return (
    <div className="photo-sewn-container">
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        const w = 220;
        const h = 180;
        const off = p.stitchOffset;

        return (
          <motion.div
            key={p.index}
            className="photo-sewn-item"
            style={{ transform: `rotate(${p.rotation}deg)` }}
            whileHover={{ scale: 1.03, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="photo-sewn-photo photo-paper">
              {photoSrc ? (
                <img src={photoSrc} alt={caption || `Photo ${p.index + 1}`} draggable={false} />
              ) : (
                <div className="photo-placeholder" />
              )}
            </div>

            {/* Stitching overlay */}
            <svg
              className="photo-sewn-stitches"
              width={w + off * 2}
              height={h + off * 2 + 30}
              viewBox={`0 0 ${w + off * 2} ${h + off * 2 + 30}`}
            >
              {/* Stitch path around photo */}
              <rect
                x={off / 2}
                y={off / 2}
                width={w + off}
                height={h + off}
                rx="3"
                fill="none"
                stroke={p.threadColor}
                strokeWidth="1.8"
                strokeDasharray={`${p.dashLength} ${p.gapLength}`}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0.5px 0.5px rgba(0,0,0,0.15))' }}
              />

              {/* Needle at end of stitch */}
              <g transform={`translate(${w + off + 2}, ${off / 2 + 4}) rotate(45)`}>
                {/* Needle body */}
                <rect x="0" y="-1" width="14" height="2" rx="0.5" fill="#B0B0B0" />
                {/* Needle point */}
                <polygon points="14,-1.5 18,0 14,1.5" fill="#999" />
                {/* Needle eye */}
                <ellipse cx="4" cy="0" rx="1.2" ry="0.8" fill="none" stroke="#888" strokeWidth="0.5" />
                {/* Thread from needle */}
                <path
                  d={`M4,0 Q-4,6 -10,2 Q-16,-2 -22,4`}
                  fill="none"
                  stroke={p.threadColor}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </g>
            </svg>

            {caption && <span className="photo-sewn-caption">{caption}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
