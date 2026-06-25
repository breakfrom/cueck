import React from 'react';
import { motion } from 'framer-motion';
import { seedRandom, randomRotation, randomRange, randomPick } from './photoUtils';
import './photos.css';

const MESSAGES = [
  'Wish you were here!',
  'Missing you always ♥',
  'Thinking of you...',
  'Sent with love',
  'Forever yours',
  'Un beso grande',
  'Te quiero mucho',
  'With all my heart',
];

const STAMP_COLORS = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#d35400'];

export default function PostcardPhoto({ images = [], seed = 42, captions = [] }) {
  const rng = seedRandom(seed);
  const rotation = randomRotation(rng, 4);
  const message = captions[0] || randomPick(rng, MESSAGES);
  const stampColor = randomPick(rng, STAMP_COLORS);
  const photoSrc = images[0] || '';
  const dateSeed = Math.floor(randomRange(rng, 1, 28));
  const monthSeed = Math.floor(randomRange(rng, 1, 12));
  const yearSeed = Math.floor(randomRange(rng, 2020, 2026));
  const dateStr = `${monthSeed}/${dateSeed}/${yearSeed}`;

  return (
    <motion.div
      className="photo-postcard-container"
      style={{ transform: `rotate(${rotation}deg)` }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      transition={{ duration: 0.4 }}
    >
      <div className="photo-postcard">
        {/* Left side: photo */}
        <div className="photo-postcard-left">
          <div className="photo-postcard-image">
            {photoSrc ? (
              <img src={photoSrc} alt={message} draggable={false} />
            ) : (
              <div className="photo-placeholder photo-placeholder--postcard" />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="photo-postcard-divider" />

        {/* Right side: postcard details */}
        <div className="photo-postcard-right">
          {/* Stamp */}
          <div className="photo-postcard-stamp" style={{ backgroundColor: stampColor }}>
            <svg width="42" height="50" viewBox="0 0 42 50">
              {/* Perforated border */}
              {Array.from({ length: 12 }, (_, i) => (
                <circle key={`t${i}`} cx={3 + i * 3.3} cy="1.5" r="1" fill="#fdfbf7" />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <circle key={`b${i}`} cx={3 + i * 3.3} cy="48.5" r="1" fill="#fdfbf7" />
              ))}
              {Array.from({ length: 14 }, (_, i) => (
                <circle key={`l${i}`} cx="1.5" cy={3 + i * 3.3} r="1" fill="#fdfbf7" />
              ))}
              {Array.from({ length: 14 }, (_, i) => (
                <circle key={`r${i}`} cx="40.5" cy={3 + i * 3.3} r="1" fill="#fdfbf7" />
              ))}
              {/* Heart in stamp */}
              <text x="21" y="32" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="20" fontFamily="serif">♥</text>
              <text x="21" y="44" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="serif">AMOR</text>
            </svg>
          </div>

          {/* Postmark */}
          <svg className="photo-postcard-postmark" width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
            <circle cx="30" cy="30" r="18" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
            <line x1="2" y1="30" x2="58" y2="30" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
            <text x="30" y="28" textAnchor="middle" fill="rgba(0,0,0,0.15)" fontSize="6" fontFamily="monospace">{dateStr}</text>
            <text x="30" y="36" textAnchor="middle" fill="rgba(0,0,0,0.12)" fontSize="5" fontFamily="monospace">CORREO</text>
          </svg>

          {/* Message area */}
          <div className="photo-postcard-message">
            <p className="photo-postcard-text">{message}</p>
          </div>

          {/* Address lines */}
          <div className="photo-postcard-address">
            <div className="photo-postcard-line" />
            <div className="photo-postcard-line" />
            <div className="photo-postcard-line photo-postcard-line--short" />
          </div>

          {/* Date */}
          <span className="photo-postcard-date">{dateStr}</span>
        </div>
      </div>
    </motion.div>
  );
}
