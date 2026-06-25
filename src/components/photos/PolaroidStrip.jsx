import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomInt } from './photoUtils';
import './photos.css';

export default function PolaroidStrip({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const maxPhotos = Math.min(images.length || 3, 4);
  const photoCount = images.length ? Math.min(images.length, 4) : randomInt(rng, 2, 4);

  const stripRotation = randomRotation(rng, 6);
  const curveAmount = randomRange(rng, 0, 3);
  const xShift = randomRange(rng, -10, 10);

  const photos = Array.from({ length: photoCount }, (_, i) => ({
    index: i,
    brightness: randomRange(rng, 0.97, 1.03),
  }));

  return (
    <motion.div
      className="photo-polaroid-strip"
      style={{
        transform: `rotate(${stripRotation}deg) translateX(${xShift}px)`,
      }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Strip body */}
      <div
        className="photo-polaroid-strip-body"
        style={{
          transform: `perspective(600px) rotateY(${curveAmount}deg)`,
        }}
      >
        {/* Perforation marks at top */}
        <div className="photo-polaroid-strip-perforations photo-polaroid-strip-perforations--top">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="photo-polaroid-strip-perf-hole" />
          ))}
        </div>

        {photos.map((p) => {
          const photoSrc = images[p.index] || '';
          const caption = captions[p.index] || '';
          return (
            <div key={p.index} className="photo-polaroid-strip-frame">
              <div className="photo-polaroid-strip-image">
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={caption || `Photo ${p.index + 1}`}
                    draggable={false}
                    style={{ filter: `brightness(${p.brightness})` }}
                  />
                ) : (
                  <div className="photo-placeholder photo-placeholder--strip" />
                )}
              </div>
              {caption && (
                <p className="photo-polaroid-strip-caption">{caption}</p>
              )}
            </div>
          );
        })}

        {/* Perforation marks at bottom */}
        <div className="photo-polaroid-strip-perforations photo-polaroid-strip-perforations--bottom">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="photo-polaroid-strip-perf-hole" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
