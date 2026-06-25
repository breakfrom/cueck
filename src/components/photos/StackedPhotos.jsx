import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { seedRandom, randomRotation, randomRange } from './photoUtils';
import './photos.css';

export default function StackedPhotos({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const [isFanned, setIsFanned] = useState(false);
  const photoCount = images.length || 3;

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const stackRotation = randomRotation(rng, 8);
    const fanRotation = randomRange(rng, -15 + i * 10, -10 + i * 12);
    const fanX = randomRange(rng, -80 + i * 60, -60 + i * 65);
    const fanY = randomRange(rng, -20 + i * 8, -10 + i * 12);
    return { stackRotation, fanRotation, fanX, fanY, index: i };
  });

  const handleClick = (event) => {
    event.stopPropagation();
    setIsFanned(!isFanned);
  };

  return (
    <motion.div
      className="photo-stacked-container"
      data-book-interactive="true"
      onClick={handleClick}
      whileHover={{ scale: isFanned ? 1 : 1.02 }}
    >
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        const isTop = p.index === photoCount - 1;

        return (
          <motion.div
            key={p.index}
            className="photo-stacked-item photo-paper"
            style={{
              zIndex: isFanned ? p.index + 1 : photoCount - p.index,
            }}
            animate={{
              rotate: isFanned ? p.fanRotation : p.stackRotation,
              x: isFanned ? p.fanX : randomRange(seedRandom(seed + p.index + 99), -3, 3),
              y: isFanned ? p.fanY : p.index * -2,
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
              delay: isFanned ? p.index * 0.08 : (photoCount - p.index) * 0.06,
            }}
          >
            <div className="photo-stacked-image">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={caption || `Photo ${p.index + 1}`}
                  draggable={false}
                  style={{
                    opacity: !isFanned && !isTop ? 0.97 : 1,
                  }}
                />
              ) : (
                <div className="photo-placeholder" />
              )}
            </div>
            {isFanned && caption && (
              <motion.span
                className="photo-stacked-caption"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + p.index * 0.1 }}
              >
                {caption}
              </motion.span>
            )}
          </motion.div>
        );
      })}

      {!isFanned && (
        <motion.span
          className="photo-stacked-count"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {photoCount} photos
        </motion.span>
      )}
    </motion.div>
  );
}
