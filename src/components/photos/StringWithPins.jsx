import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRange, randomRotation } from './photoUtils';
import './photos.css';

/**
 * StringWithPins — Photos hanging from a clothesline string
 * with wooden clothespins. Subtle swaying animation.
 */
export default function StringWithPins({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 3;

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 8);
    const yOffset = randomRange(rng, 0, 18);
    const swayDuration = randomRange(rng, 3, 5);
    const swayAmount = randomRange(rng, 0.5, 1.2);
    const delay = randomRange(rng, 0, 2);
    const pinXShift = randomRange(rng, -4, 4);
    return { rotation, yOffset, swayDuration, swayAmount, delay, pinXShift, index: i };
  });

  const totalWidth = photoCount * 180;
  const stringY = 18;

  return (
    <div className="photo-string-container" style={{ width: Math.max(totalWidth, 300) }}>
      {/* Clothesline string */}
      <svg
        className="photo-string-line"
        viewBox={`0 0 ${Math.max(totalWidth, 300)} 40`}
        preserveAspectRatio="none"
      >
        <path
          d={`M 0 ${stringY} Q ${totalWidth * 0.25} ${stringY + 14} ${totalWidth * 0.5} ${stringY + 8} Q ${totalWidth * 0.75} ${stringY + 2} ${Math.max(totalWidth, 300)} ${stringY + 10}`}
          fill="none"
          stroke="#8B7355"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Hanging photos */}
      <div className="photo-string-photos">
        {photos.map((p) => {
          const photoSrc = images[p.index] || '';
          const caption = captions[p.index] || '';
          return (
            <motion.div
              key={p.index}
              className="photo-string-item"
              style={{
                marginTop: p.yOffset + 20,
                transformOrigin: 'top center',
              }}
              animate={{
                rotateZ: [
                  p.rotation - p.swayAmount,
                  p.rotation + p.swayAmount,
                  p.rotation - p.swayAmount,
                ],
              }}
              transition={{
                duration: p.swayDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
            >
              {/* Clothespin SVG */}
              <svg
                className="photo-clothespin"
                width="20"
                height="48"
                viewBox="0 0 20 48"
                style={{ marginLeft: p.pinXShift }}
              >
                {/* Pin body */}
                <rect x="5" y="0" width="10" height="30" rx="2" ry="2" fill="url(#woodGrain)" />
                {/* Pin legs */}
                <rect x="5" y="28" width="4" height="18" rx="1" fill="#C4A46C" />
                <rect x="11" y="28" width="4" height="18" rx="1" fill="#C4A46C" />
                {/* Spring */}
                <circle cx="10" cy="22" r="3.5" fill="none" stroke="#999" strokeWidth="1.5" />
                {/* Wood grain gradient */}
                <defs>
                  <linearGradient id="woodGrain" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D4B37F" />
                    <stop offset="30%" stopColor="#C9A86C" />
                    <stop offset="60%" stopColor="#D6B882" />
                    <stop offset="100%" stopColor="#C4A265" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Photo */}
              <div className="photo-string-photo photo-paper">
                {photoSrc ? (
                  <img src={photoSrc} alt={caption || `Photo ${p.index + 1}`} draggable={false} />
                ) : (
                  <div className="photo-placeholder" />
                )}
                {caption && <span className="photo-string-caption">{caption}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
