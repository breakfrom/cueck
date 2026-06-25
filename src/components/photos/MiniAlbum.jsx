import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomPick, randomPastelColor } from './photoUtils';
import './photos.css';

const COVER_PATTERNS = ['dots', 'stripes', 'hearts'];

export default function MiniAlbum({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const rotation = randomRotation(rng, 4);
  const coverColor = randomPastelColor(rng);
  const coverPattern = randomPick(rng, COVER_PATTERNS);
  const spineColor = `hsl(${randomRange(rng, 0, 360)}, 35%, 55%)`;
  const photoCount = images.length || 3;

  const handleCoverClick = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
      setCurrentPage(0);
    } else {
      setIsOpen(false);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentPage < photoCount - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  function PatternOverlay() {
    if (coverPattern === 'dots') {
      return (
        <svg className="mini-album-pattern" width="100%" height="100%">
          <defs>
            <pattern id={`dots-${seed}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.35)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#dots-${seed})`} />
        </svg>
      );
    }
    if (coverPattern === 'stripes') {
      return (
        <svg className="mini-album-pattern" width="100%" height="100%">
          <defs>
            <pattern id={`stripes-${seed}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#stripes-${seed})`} />
        </svg>
      );
    }
    // hearts
    return (
      <svg className="mini-album-pattern" width="100%" height="100%">
        <defs>
          <pattern id={`hearts-${seed}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <text x="6" y="16" fontSize="12" fill="rgba(255,255,255,0.25)" fontFamily="serif">♥</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hearts-${seed})`} />
      </svg>
    );
  }

  return (
    <motion.div
      className="photo-mini-album-container"
      data-book-interactive="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Closed cover */}
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="cover"
            className="photo-mini-album-cover"
            data-book-interactive="true"
            style={{ backgroundColor: coverColor }}
            onClick={handleCoverClick}
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
          >
            <PatternOverlay />
            {/* Spine */}
            <div className="photo-mini-album-spine" style={{ backgroundColor: spineColor }} />
            {/* Title */}
            <div className="photo-mini-album-title">
              <span>memories</span>
              <svg width="40" height="2" style={{ marginTop: 4 }}>
                <line x1="0" y1="1" x2="40" y2="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              </svg>
            </div>
            <motion.span
              className="photo-mini-album-hint"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              tap to open
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="pages"
            className="photo-mini-album-pages"
            data-book-interactive="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {/* Page content */}
            <div className="photo-mini-album-page">
              <div className="photo-mini-album-page-inner photo-paper">
                {images[currentPage] ? (
                  <img
                    src={images[currentPage]}
                    alt={captions[currentPage] || `Page ${currentPage + 1}`}
                    draggable={false}
                  />
                ) : (
                  <div className="photo-placeholder" />
                )}
                {captions[currentPage] && (
                  <span className="photo-mini-album-page-caption">
                    {captions[currentPage]}
                  </span>
                )}
              </div>

              {/* Page indicator */}
              <div className="photo-mini-album-dots">
                {Array.from({ length: photoCount }, (_, i) => (
                  <div
                    key={i}
                    className={`photo-mini-album-dot ${i === currentPage ? 'active' : ''}`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="photo-mini-album-nav">
                <button
                  className="photo-mini-album-nav-btn"
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                >
                  ←
                </button>
                <button
                  className="photo-mini-album-close-btn"
                  onClick={handleCoverClick}
                >
                  ✕
                </button>
                <button
                  className="photo-mini-album-nav-btn"
                  onClick={handleNext}
                >
                  {currentPage < photoCount - 1 ? '→' : '✕'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
