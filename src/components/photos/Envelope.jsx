import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomPick } from './photoUtils';
import './photos.css';

const ENVELOPE_COLORS = ['#e8dcc8', '#f0e6d0', '#ddd4c0', '#efe3cd', '#e5d9c3'];

export default function Envelope({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const [isOpen, setIsOpen] = useState(false);

  const envelopeColor = randomPick(rng, ENVELOPE_COLORS);
  const rotation = randomRotation(rng, 4);
  const flapDarker = adjustBrightness(envelopeColor, -12);
  const innerColor = adjustBrightness(envelopeColor, -6);
  const photoRotations = images.map(() => randomRotation(rng, 8));
  const photoOffsets = images.map(() => ({
    x: randomRange(rng, -8, 8),
    y: randomRange(rng, -4, 4),
  }));

  function adjustBrightness(hex, amount) {
    // Simple brightness adjust for hex-like color strings
    return hex; // Keep same color, CSS handles the visual diff
  }

  const handleClick = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className="photo-envelope-container"
      data-book-interactive="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className="photo-envelope"
        data-book-interactive="true"
        style={{ backgroundColor: envelopeColor }}
        onClick={handleClick}
      >
        {/* Back flap (behind everything when closed, lifts when open) */}
        <motion.div
          className="photo-envelope-flap"
          style={{
            backgroundColor: flapDarker,
            borderBottomColor: innerColor,
          }}
          animate={{
            rotateX: isOpen ? -170 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Flap triangle */}
          <svg className="photo-envelope-flap-shape" viewBox="0 0 260 90" preserveAspectRatio="none">
            <polygon
              points="0,0 130,85 260,0"
              fill={flapDarker}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
          </svg>
          {/* Seal */}
          {!isOpen && (
            <div className="photo-envelope-seal">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="13" fill="#c0392b" opacity="0.85" />
                <text x="14" y="18" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="serif">♥</text>
              </svg>
            </div>
          )}
        </motion.div>

        {/* Envelope body */}
        <div
          className="photo-envelope-body"
          style={{ backgroundColor: envelopeColor }}
        >
          {/* Front fold lines */}
          <svg className="photo-envelope-folds" viewBox="0 0 260 170" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="130" y2="100" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            <line x1="260" y1="0" x2="130" y2="100" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </svg>

          {/* Photos that slide out */}
          <AnimatePresence>
            {isOpen && images.length > 0 && (
              <motion.div
                className="photo-envelope-photos"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: -160, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                }}
              >
                {images.map((src, i) => (
                  <motion.div
                    key={i}
                    className="photo-envelope-photo photo-paper"
                    style={{
                      transform: `rotate(${photoRotations[i] || 0}deg) translate(${photoOffsets[i]?.x || 0}px, ${photoOffsets[i]?.y || 0}px)`,
                      zIndex: images.length - i,
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.4,
                    }}
                  >
                    <img
                      src={src}
                      alt={captions[i] || `Photo ${i + 1}`}
                      draggable={false}
                    />
                    {captions[i] && (
                      <span className="photo-envelope-caption">{captions[i]}</span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tap hint */}
        {!isOpen && (
          <motion.span
            className="photo-envelope-hint"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            tap to open
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
