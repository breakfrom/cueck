import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNextMinuteTime } from '../utils/time';
import PhotoPresentation, { getRandomPhotoType } from './photos/PhotoRegistry';
import { createSeedEngine } from '../engine/seed';
import { getRandomDecorations } from './decoratives/Decoratives';

/**
 * PageRenderer — Renders any page from bookConfig based on its type.
 * Each page type has its own editorial treatment.
 * Decoratives and photo presentations are handled by their respective sub-systems.
 */

const PHOTO_PRESENTATION_ALIASES = {
  stacked: 'stacked-photos',
  taped: 'taped-photo',
  clipped: 'clipped-photo',
  sewn: 'sewn-photo',
  postcard: 'postcard-photo',
  found: 'found-photo',
  'folded-corner': 'folded-corner',
  'under-vellum': 'photo-under-vellum',
  mosaic: 'mosaic-irregular',
  chain: 'photo-chain',
};

function normalizePhotoPresentation(type) {
  return PHOTO_PRESENTATION_ALIASES[type] || type;
}

// Helper to render background scattered decorations
function PageDecorations({ seed, palette, count = 3 }) {
  const decorations = useMemo(() => {
    return getRandomDecorations(createSeedEngine(seed), count, palette);
  }, [seed, count, palette]);

  return (
    <>
      {decorations.map((deco, i) => {
        const { Component, props, position } = deco;
        const { key: decorationKey, ...componentProps } = props || {};
        return (
          <div key={decorationKey || i} style={{
            position: 'absolute',
            left: position.left,
            top: position.top,
            zIndex: 1, // Above page background, behind text/photos
            pointerEvents: 'auto'
          }}>
            <Component {...componentProps} />
          </div>
        );
      })}
    </>
  );
}

export default function PageRenderer({ page, index, seed, artDirection, side, animateIntro = false }) {
  const pageSeed = (seed || 42) * 1000 + (index || 0) * 7;
  const palette = artDirection?.palette || { primary: '#d4a373', secondary: '#8b6f47', accent: '#c9184a', paper: '#fdfbf7', ink: '#2c2c2c', muted: '#9a8c7a' };
  const fonts = artDirection?.fontPairings || { title: 'Playfair Display', handwritten: 'Caveat', body: 'Inter', accent: 'Sacramento', quote: 'Cormorant Garamond' };

  if (!page) return <div className="page-empty" />;

  const commonProps = { page, palette, fonts, seed: pageSeed, side, animateIntro };

  let content;
  switch (page.type) {
    case 'cover':
      content = <CoverPage {...commonProps} />;
      break;
    case 'text':
      content = <TextPage {...commonProps} />;
      break;
    case 'dynamic-time':
      content = <DynamicTimePage {...commonProps} />;
      break;
    case 'photo':
      content = <PhotoPage {...commonProps} />;
      break;
    case 'mixed':
      content = <MixedPage {...commonProps} />;
      break;
    case 'discovery':
      content = <DiscoveryPage {...commonProps} />;
      break;
    default:
      content = <TextPage {...commonProps} page={{ ...page, style: 'editorial', content: page.content || '' }} />;
      break;
  }

  // Determine decoration density based on page type
  let decoCount = 0;
  if (page.type === 'text') decoCount = 3;
  if (page.type === 'photo') decoCount = 2;
  if (page.type === 'mixed') decoCount = 4;
  if (page.type === 'cover') decoCount = 0;

  const showLetterMeta = index === 1;

  return (
    <div className="page-renderer">
      {page.background && (
        <img
          src={page.background}
          className="page-background"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      )}
      {decoCount > 0 && <PageDecorations seed={pageSeed} palette={palette} count={decoCount} />}
      {showLetterMeta && (
        <div className="letter-meta" aria-hidden="true">
          <div className="letter-meta-to">
            <span className="letter-meta-label">Para</span>
            <span className="letter-meta-name">Gabriela</span>
          </div>
          <div className="letter-meta-from">
            <span className="letter-meta-label">Por</span>
            <span className="letter-meta-name">Ernesto</span>
          </div>
        </div>
      )}
      <div className="page-content">
        {content}
      </div>
    </div>
  );
}

/* ─── Cover Page ─── */
function CoverPage({ page, palette, fonts, side, animateIntro }) {
  const isFront = page.style !== 'back';

  return (
    <div className="page-cover-premium" style={{ '--cover-accent': palette.primary, '--cover-ink': palette.ink }}>
      <div className="cover-border" style={{ borderColor: palette.primary + '40' }}>
        {['tl', 'tr', 'bl', 'br'].map(corner => (
          <svg key={corner} className={`cover-ornament cover-ornament-${corner}`} width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M2 38C2 20 20 2 38 2" stroke={palette.primary} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 38C8 22 22 8 38 8" stroke={palette.primary} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            <circle cx="5" cy="35" r="2" fill={palette.primary} opacity="0.3" />
          </svg>
        ))}

        <motion.div 
          className="cover-content"
          initial={animateIntro ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2 }}
        >
          {isFront && <div className="cover-ornament-line" style={{ backgroundColor: palette.primary + '30' }} />}
          <h1 className="cover-title" style={{ fontFamily: `'${fonts.title}', serif`, color: palette.ink }}>
            {page.title}
          </h1>
          <p className="cover-subtitle" style={{ fontFamily: `'${fonts.handwritten}', cursive`, color: palette.muted }}>
            {page.subtitle}
          </p>
          {isFront && <div className="cover-ornament-line" style={{ backgroundColor: palette.primary + '30' }} />}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Text Page ─── */
function TextPage({ page, palette, fonts, seed, animateIntro }) {
  const style = page.style || 'editorial';
  // Use seed to deterministically offset handwritten text
  const rotation = ((seed % 100) / 100 - 0.5) * 3;

  switch (style) {
    case 'quote':
      return (
        <div className="page-text-quote">
          <motion.div initial={animateIntro ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <span className="quote-mark" style={{ color: palette.primary + '25', fontFamily: `'${fonts.accent}', cursive` }}>"</span>
            <h2 className="quote-text" style={{ fontFamily: `'${fonts.quote || fonts.title}', serif`, color: palette.ink }}>
              {page.content}
            </h2>
            {page.accent && <span className="quote-accent">{page.accent}</span>}
          </motion.div>
        </div>
      );

    case 'handwritten':
      return (
        <div className="page-text-handwritten" style={{ transform: `rotate(${rotation}deg)` }}>
          <motion.p
            className="handwritten-text"
            style={{ fontFamily: `'${fonts.handwritten}', cursive`, color: palette.ink }}
            initial={animateIntro ? { opacity: 0, y: 15 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          >
            {page.content}
          </motion.p>
          <svg className="handwritten-swoosh" viewBox="0 0 200 20" fill="none">
            <path d="M5 15 Q50 5 100 12 T195 8" stroke={palette.primary} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      );

    case 'poem':
      const lines = (page.content || '').split('\n');
      return (
        <div className="page-text-poem">
          {lines.map((line, i) => (
            <motion.p
              key={i} className="poem-line"
              style={{
                fontFamily: `'${fonts.quote || fonts.title}', serif`, color: palette.ink,
                marginLeft: `${((seed * (i+1)) % 30) + 10}px`
              }}
              initial={animateIntro ? { opacity: 0, x: -10 } : false} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      );

    case 'giant-word':
      return (
        <div className="page-text-giant">
          <motion.h1
            className="giant-word"
            style={{ fontFamily: `'${fonts.title}', serif`, color: palette.primary + '15', WebkitTextStroke: `1px ${palette.primary}30` }}
            initial={animateIntro ? { opacity: 0, scale: 1.3 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}
          >
            {page.content}
          </motion.h1>
        </div>
      );

    case 'diagonal':
      return (
        <div className="page-text-diagonal">
          <motion.h2
            style={{ fontFamily: `'${fonts.handwritten}', cursive`, color: palette.ink, transform: 'rotate(-12deg)', transformOrigin: 'center center' }}
            initial={animateIntro ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          >
            {page.content}
          </motion.h2>
        </div>
      );

    default: // editorial
      return (
        <div className="page-text-editorial">
          <motion.div initial={animateIntro ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h2 style={{ fontFamily: `'${fonts.title}', serif`, color: palette.ink }}>{page.content}</h2>
          </motion.div>
        </div>
      );
  }
}

/* ─── Dynamic Time Page ─── */
function DynamicTimePage({ page, palette, fonts, animateIntro }) {
  const time = getNextMinuteTime();
  return (
    <div className="page-text-quote">
      <motion.div initial={animateIntro ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <h2 className="quote-text" style={{ fontFamily: `'${fonts.handwritten}', cursive`, color: palette.ink }}>
          {page.prefix} <span style={{ color: palette.primary, fontFamily: `'${fonts.title}', serif` }}>{time}</span>{page.suffix}
        </h2>
      </motion.div>
    </div>
  );
}

/* ─── Photo Page ─── */
function PhotoPage({ page, seed }) {
  const type = (page.presentation && page.presentation !== 'auto') 
    ? normalizePhotoPresentation(page.presentation)
    : getRandomPhotoType(seed);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <PhotoPresentation 
        type={type} 
        images={page.images || []} 
        captions={page.captions || []} 
        seed={seed} 
      />
    </div>
  );
}

/* ─── Mixed Page ─── */
function MixedPage({ page, palette, fonts, seed, animateIntro }) {
  return (
    <div className="page-mixed">
      {page.content && (
        <motion.p
          className="mixed-text"
          style={{ fontFamily: `'${fonts.handwritten}', cursive`, color: palette.ink }}
          initial={animateIntro ? { opacity: 0 } : false} animate={{ opacity: 1 }}
        >
          {page.content}
        </motion.p>
      )}
      {page.images && (
        <div style={{ flex: 1, width: '100%', position: 'relative' }}>
          <PhotoPage page={{ ...page, presentation: page.presentation }} seed={seed} />
        </div>
      )}
    </div>
  );
}

/* ─── Discovery Page ─── */
function DiscoveryPage({ page, palette, fonts, seed }) {
  const [revealed, setRevealed] = React.useState(false);

  const handleReveal = (event) => {
    event.stopPropagation();
    setRevealed(true);
  };

  return (
    <div className="page-discovery" data-book-interactive="true" onClick={(event) => event.stopPropagation()}>
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="cover"
            className="discovery-cover"
            data-book-interactive="true"
            onClick={handleReveal}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            style={{ cursor: 'pointer' }}
          >
            <div className="discovery-prompt" style={{ fontFamily: `'${fonts.handwritten}', cursive`, color: palette.muted }}>
              {page.prompt || 'Toca para descubrir...'}
            </div>
            <svg className="discovery-seal" width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="25" fill={palette.primary + '20'} stroke={palette.primary + '40'} strokeWidth="1" />
              <text x="30" y="35" textAnchor="middle" fontSize="18" fill={palette.primary + '60'}>♥</text>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="discovery-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {page.hiddenContent && (
              <p style={{ fontFamily: `'${fonts.handwritten}', cursive`, color: palette.ink }}>{page.hiddenContent}</p>
            )}
            {page.hiddenImage && (
              <div style={{ marginTop: 20 }}>
                 <PhotoPresentation type="polaroid-strip" images={[page.hiddenImage]} seed={seed} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
