import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { seedRandom, randomRotation, randomRange } from './photoUtils';
import './photos.css';

export default function PhotoUnderVellum({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const [isRevealed, setIsRevealed] = useState(false);
  const rotation = randomRotation(rng, 4);
  const vellumAngle = randomRange(rng, -2, 2);
  const vellumOverlap = randomRange(rng, 40, 65); // percentage of photo covered

  const photoSrc = images[0] || '';
  const caption = captions[0] || '';
  const handleClick = (event) => {
    event.stopPropagation();
    setIsRevealed(!isRevealed);
  };

  return (
    <motion.div
      className="photo-vellum-container"
      data-book-interactive="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
    >
      {/* Photo underneath */}
      <div className="photo-vellum-photo photo-paper">
        {photoSrc ? (
          <img src={photoSrc} alt={caption || 'Photo'} draggable={false} />
        ) : (
          <div className="photo-placeholder" />
        )}
      </div>

      {/* Vellum overlay */}
      <motion.div
        className="photo-vellum-overlay"
        style={{
          transform: `rotate(${vellumAngle}deg)`,
        }}
        animate={{
          x: isRevealed ? '105%' : '0%',
          opacity: isRevealed ? 0.6 : 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Subtle texture lines */}
        <svg className="photo-vellum-texture" width="100%" height="100%">
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={i}
              x1="0"
              y1={i * 12 + randomRange(seedRandom(seed + i), -1, 1)}
              x2="100%"
              y2={i * 12 + randomRange(seedRandom(seed + i + 50), -2, 2)}
              stroke="rgba(0,0,0,0.015)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </motion.div>

      {caption && <span className="photo-vellum-caption">{caption}</span>}

      {!isRevealed && (
        <motion.span
          className="photo-vellum-hint"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          tap to reveal
        </motion.span>
      )}
    </motion.div>
  );
}
