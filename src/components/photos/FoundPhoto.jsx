import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomBool } from './photoUtils';
import './photos.css';

export default function FoundPhoto({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 1;

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 5);
    const sepiaAmount = randomRange(rng, 0.15, 0.4);
    const saturation = randomRange(rng, 0.7, 0.9);
    const brightness = randomRange(rng, 0.93, 1.0);
    const hasCrease = randomBool(rng, 0.5);
    const creaseAngle = randomRange(rng, 20, 70);
    const creasePos = randomRange(rng, 25, 75);
    const cornerVariance = [
      randomRange(rng, 3, 8),
      randomRange(rng, 2, 6),
      randomRange(rng, 3, 9),
      randomRange(rng, 2, 7),
    ];
    const yellowing = randomRange(rng, 0.03, 0.1);
    return {
      rotation, sepiaAmount, saturation, brightness,
      hasCrease, creaseAngle, creasePos, cornerVariance,
      yellowing, index: i,
    };
  });

  return (
    <div className="photo-found-container">
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        return (
          <motion.div
            key={p.index}
            className="photo-found-item"
            style={{
              transform: `rotate(${p.rotation}deg)`,
            }}
            whileHover={{ scale: 1.04, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="photo-found-photo photo-paper"
              style={{
                borderRadius: `${p.cornerVariance[0]}px ${p.cornerVariance[1]}px ${p.cornerVariance[2]}px ${p.cornerVariance[3]}px`,
              }}
            >
              {/* Yellowed overlay */}
              <div
                className="photo-found-aging"
                style={{
                  background: `radial-gradient(ellipse at 60% 40%, rgba(180,155,100,${p.yellowing}), rgba(160,130,80,${p.yellowing * 1.8}) 70%, rgba(140,110,60,${p.yellowing * 2.5}))`,
                  borderRadius: `${p.cornerVariance[0]}px ${p.cornerVariance[1]}px ${p.cornerVariance[2]}px ${p.cornerVariance[3]}px`,
                }}
              />

              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={caption || `Photo ${p.index + 1}`}
                  draggable={false}
                  style={{
                    filter: `sepia(${p.sepiaAmount}) saturate(${p.saturation}) brightness(${p.brightness})`,
                    borderRadius: `${p.cornerVariance[0]}px ${p.cornerVariance[1]}px ${p.cornerVariance[2]}px ${p.cornerVariance[3]}px`,
                  }}
                />
              ) : (
                <div className="photo-placeholder" />
              )}

              {/* Crease mark */}
              {p.hasCrease && (
                <div
                  className="photo-found-crease"
                  style={{
                    transform: `rotate(${p.creaseAngle}deg)`,
                    left: `${p.creasePos}%`,
                    top: '10%',
                  }}
                />
              )}

              {/* Edge wear */}
              <div className="photo-found-edge-wear" style={{
                borderRadius: `${p.cornerVariance[0]}px ${p.cornerVariance[1]}px ${p.cornerVariance[2]}px ${p.cornerVariance[3]}px`,
              }} />
            </div>

            {caption && <span className="photo-found-caption">{caption}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
