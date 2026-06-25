import React from 'react';
import { motion } from 'framer-motion';

export default function Welcome({ onNext, artDirection }) {
  const palette = artDirection?.palette || {};
  const fonts = artDirection?.fontPairings || {};

  return (
    <div className="welcome-screen">
      {/* Ambient particles */}
      <div className="welcome-particles">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0 ? (palette.primary || '#c9184a') + '30' : 'rgba(255,255,255,0.25)',
            }}
            animate={{
              y: [0, -(30 + Math.random() * 80)],
              x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="welcome-overlay">
        <motion.div
          className="welcome-card"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top ornament */}
          <motion.svg
            className="welcome-ornament"
            viewBox="0 0 120 30"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <motion.path
              d="M10 15 Q30 5 60 15 Q90 25 110 15"
              stroke={palette.primary || '#c9184a'}
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
            <motion.circle cx="60" cy="15" r="3" fill={palette.primary || '#c9184a'} opacity="0.4"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
            />
          </motion.svg>

          <motion.h1
            className="welcome-title"
            style={{ fontFamily: `'${fonts.title || 'Playfair Display'}', serif` }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
          >
            Princesa, ¿deseas iniciar?
          </motion.h1>

          <motion.p
            className="welcome-subtitle"
            style={{ fontFamily: `'${fonts.handwritten || 'Caveat'}', cursive` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 1 }}
          >
          Desde el corazòn
          </motion.p>

          <motion.button
            className="welcome-btn"
            onClick={onNext}
            style={{ '--btn-color': palette.primary || '#c9184a' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Continuar
          </motion.button>

          {/* Bottom ornament */}
          <motion.svg
            className="welcome-ornament welcome-ornament-bottom"
            viewBox="0 0 120 30"
            fill="none"
          >
            <motion.path
              d="M10 15 Q30 25 60 15 Q90 5 110 15"
              stroke={palette.primary || '#c9184a'}
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}
