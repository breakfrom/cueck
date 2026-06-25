import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomInt } from './photoUtils';
import './photos.css';

export default function MosaicIrregular({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 4;

  // Generate varied sizes and positions for mosaic feel
  const sizeClasses = ['mosaic-sm', 'mosaic-md', 'mosaic-lg'];

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 12);
    const sizeClass = sizeClasses[randomInt(rng, 0, 2)];
    const xOffset = randomRange(rng, -15, 15);
    const yOffset = randomRange(rng, -10, 10);
    const zIndex = randomInt(rng, 1, photoCount + 1);
    return { rotation, sizeClass, xOffset, yOffset, zIndex, index: i };
  });

  return (
    <div className="photo-mosaic-container">
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        return (
          <motion.div
            key={p.index}
            className={`photo-mosaic-item photo-paper ${p.sizeClass}`}
            style={{
              transform: `rotate(${p.rotation}deg) translate(${p.xOffset}px, ${p.yOffset}px)`,
              zIndex: p.zIndex,
            }}
            whileHover={{ scale: 1.08, zIndex: 30, rotate: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {photoSrc ? (
              <img src={photoSrc} alt={caption || `Photo ${p.index + 1}`} draggable={false} />
            ) : (
              <div className="photo-placeholder" />
            )}
            {caption && <span className="photo-mosaic-caption">{caption}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
