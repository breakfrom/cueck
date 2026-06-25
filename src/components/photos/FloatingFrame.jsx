import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomPick } from './photoUtils';
import './photos.css';

const FRAME_COLORS = ['#2c2c2c', '#1a1a1a', '#3d3021', '#f5f0e8', '#c9b99a'];

export default function FloatingFrame({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 1;

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 3);
    const floatDuration = randomRange(rng, 3, 5);
    const floatAmount = randomRange(rng, 3, 7);
    const delay = randomRange(rng, 0, 2);
    const frameColor = randomPick(rng, FRAME_COLORS);
    const borderWidth = randomRange(rng, 3, 6);
    return { rotation, floatDuration, floatAmount, delay, frameColor, borderWidth, index: i };
  });

  return (
    <div className="photo-floating-container">
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        return (
          <motion.div
            key={p.index}
            className="photo-floating-item"
            style={{
              transform: `rotate(${p.rotation}deg)`,
            }}
            animate={{
              y: [-p.floatAmount, p.floatAmount, -p.floatAmount],
            }}
            transition={{
              duration: p.floatDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          >
            <div
              className="photo-floating-frame"
              style={{
                borderColor: p.frameColor,
                borderWidth: p.borderWidth,
              }}
            >
              <div className="photo-floating-mat">
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
            </div>
            {caption && <span className="photo-floating-caption">{caption}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
