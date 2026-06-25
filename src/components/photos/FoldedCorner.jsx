import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomPick } from './photoUtils';
import './photos.css';

const FOLD_CORNERS = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

export default function FoldedCorner({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const photoCount = images.length || 1;

  const photos = Array.from({ length: photoCount }, (_, i) => {
    const rotation = randomRotation(rng, 4);
    const foldCorner = randomPick(rng, FOLD_CORNERS);
    const foldSize = randomRange(rng, 22, 40);
    return { rotation, foldCorner, foldSize, index: i };
  });

  function getFoldStyles(corner, size) {
    const s = size;
    const positions = {
      'top-right': {
        clipPath: `polygon(0 0, calc(100% - ${s}px) 0, 100% ${s}px, 100% 100%, 0 100%)`,
        foldTransform: 'rotate(0deg)',
        foldTop: '0',
        foldRight: '0',
        foldLeft: 'auto',
        foldBottom: 'auto',
        trianglePoints: `0,0 ${s},0 0,${s}`,
        shadowPoints: `0,${s} ${s * 0.1},${s * 0.7} ${s * 0.3},${s * 0.3} ${s * 0.7},${s * 0.1} ${s},0`,
      },
      'top-left': {
        clipPath: `polygon(${s}px 0, 100% 0, 100% 100%, 0 100%, 0 ${s}px)`,
        foldTransform: 'scaleX(-1)',
        foldTop: '0',
        foldLeft: '0',
        foldRight: 'auto',
        foldBottom: 'auto',
        trianglePoints: `0,0 ${s},0 0,${s}`,
        shadowPoints: `0,${s} ${s * 0.1},${s * 0.7} ${s * 0.3},${s * 0.3} ${s * 0.7},${s * 0.1} ${s},0`,
      },
      'bottom-right': {
        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${s}px), calc(100% - ${s}px) 100%, 0 100%)`,
        foldTransform: 'scaleY(-1)',
        foldBottom: '0',
        foldRight: '0',
        foldTop: 'auto',
        foldLeft: 'auto',
        trianglePoints: `0,0 ${s},0 0,${s}`,
        shadowPoints: `0,${s} ${s * 0.1},${s * 0.7} ${s * 0.3},${s * 0.3} ${s * 0.7},${s * 0.1} ${s},0`,
      },
      'bottom-left': {
        clipPath: `polygon(0 0, 100% 0, 100% 100%, ${s}px 100%, 0 calc(100% - ${s}px))`,
        foldTransform: 'scale(-1, -1)',
        foldBottom: '0',
        foldLeft: '0',
        foldTop: 'auto',
        foldRight: 'auto',
        trianglePoints: `0,0 ${s},0 0,${s}`,
        shadowPoints: `0,${s} ${s * 0.1},${s * 0.7} ${s * 0.3},${s * 0.3} ${s * 0.7},${s * 0.1} ${s},0`,
      },
    };
    return positions[corner];
  }

  return (
    <div className="photo-folded-container">
      {photos.map((p) => {
        const photoSrc = images[p.index] || '';
        const caption = captions[p.index] || '';
        const fold = getFoldStyles(p.foldCorner, p.foldSize);

        return (
          <motion.div
            key={p.index}
            className="photo-folded-item"
            style={{ transform: `rotate(${p.rotation}deg)` }}
            whileHover={{ scale: 1.03, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Photo with clipped corner */}
            <div
              className="photo-folded-photo photo-paper"
              style={{ clipPath: fold.clipPath }}
            >
              {photoSrc ? (
                <img src={photoSrc} alt={caption || `Photo ${p.index + 1}`} draggable={false} />
              ) : (
                <div className="photo-placeholder" />
              )}
            </div>

            {/* Fold triangle overlay */}
            <div
              className="photo-folded-fold"
              style={{
                position: 'absolute',
                top: fold.foldTop,
                right: fold.foldRight,
                left: fold.foldLeft,
                bottom: fold.foldBottom,
                width: p.foldSize,
                height: p.foldSize,
                transform: fold.foldTransform,
                pointerEvents: 'none',
              }}
            >
              <svg
                width={p.foldSize}
                height={p.foldSize}
                viewBox={`0 0 ${p.foldSize} ${p.foldSize}`}
              >
                {/* Fold shadow */}
                <polygon
                  points={fold.shadowPoints}
                  fill="rgba(0,0,0,0.08)"
                />
                {/* Fold triangle (the paper underside) */}
                <polygon
                  points={fold.trianglePoints}
                  fill="#e8e2d6"
                />
                {/* Fold crease line */}
                <line
                  x1={p.foldSize}
                  y1="0"
                  x2="0"
                  y2={p.foldSize}
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="0.8"
                />
              </svg>
            </div>

            {caption && <span className="photo-folded-caption">{caption}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
