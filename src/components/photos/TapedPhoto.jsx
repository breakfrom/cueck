import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRange, randomRotation, randomPick, randomInt } from './photoUtils';
import './photos.css';

const TAPE_TYPES = ['transparent', 'masking', 'washi'];

const WASHI_PATTERNS = [
  'repeating-linear-gradient(45deg, #f8c4c4 0px, #f8c4c4 4px, #f9d4d4 4px, #f9d4d4 8px, #a8d8ea 8px, #a8d8ea 12px, #f9d4d4 12px, #f9d4d4 16px)',
  'repeating-linear-gradient(45deg, #d4e09b 0px, #d4e09b 5px, #f6f4d2 5px, #f6f4d2 10px, #cbdfbd 10px, #cbdfbd 15px)',
  'repeating-linear-gradient(60deg, #ffd6e0 0px, #ffd6e0 3px, #ffefcf 3px, #ffefcf 6px, #c1ffd7 6px, #c1ffd7 9px, #b5deff 9px, #b5deff 12px)',
  'repeating-linear-gradient(45deg, #e8d5b7 0px, #e8d5b7 4px, #f0e6d3 4px, #f0e6d3 8px)',
  'repeating-linear-gradient(30deg, #ffc8dd 0px, #ffc8dd 5px, #bde0fe 5px, #bde0fe 10px, #a2d2ff 10px, #a2d2ff 15px)',
];

function TapeStrip({ type, angle, xPos, yPos, width, washiPattern }) {
  const tapeClass = `photo-tape photo-tape--${type}`;
  const style = {
    transform: `rotate(${angle}deg)`,
    left: xPos,
    top: yPos,
    width: width || 70,
  };

  if (type === 'washi') {
    style.backgroundImage = washiPattern;
  }

  return <div className={tapeClass} style={style} />;
}

export default function TapedPhoto({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);

  const photoCount = images.length || 1;
  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 5);
    const tapeType = randomPick(rng, TAPE_TYPES);
    const tapeCount = randomInt(rng, 1, 3);
    const washiPattern = randomPick(rng, WASHI_PATTERNS);

    const tapes = Array.from({ length: tapeCount }, (_, ti) => {
      const positions = [
        { xPos: '-8%', yPos: '-6%' },
        { xPos: '62%', yPos: '-6%' },
        { xPos: '25%', yPos: '-8%' },
        { xPos: '-8%', yPos: '85%' },
        { xPos: '62%', yPos: '85%' },
      ];
      const pos = positions[(ti + Math.floor(rng() * 3)) % positions.length];
      return {
        angle: randomRotation(rng, 35),
        xPos: pos.xPos,
        yPos: pos.yPos,
        width: randomRange(rng, 55, 85),
        washiPattern,
      };
    });

    return { rotation, tapeType, tapes, index: i };
  });

  return (
    <div className="photo-taped-container">
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        return (
          <motion.div
            key={p.index}
            className="photo-taped-item"
            style={{ transform: `rotate(${p.rotation}deg)` }}
            whileHover={{ scale: 1.03, rotate: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Tape strips */}
            {p.tapes.map((t, ti) => (
              <TapeStrip key={ti} type={p.tapeType} {...t} />
            ))}

            {/* Photo */}
            <div className="photo-taped-photo photo-paper">
              {photoSrc ? (
                <img src={photoSrc} alt={caption || `Photo ${p.index + 1}`} draggable={false} />
              ) : (
                <div className="photo-placeholder" />
              )}
            </div>
            {caption && <span className="photo-taped-caption">{caption}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
