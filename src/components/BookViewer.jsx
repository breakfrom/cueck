import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';
import { bookConfig, finalLetterText } from '../config/bookData';
import PageRenderer from './PageRenderer';
import referenceImage from '../assets/imagen_referencia.png';

/* ─────────── Clip-Path Page Flip Engine ─────────── 
   Instead of slicing the page into visible strips (which creates seams),
   we use a SINGLE continuous clip-path that sweeps across the page,
   combined with dynamic shadow gradients to create the illusion of a 
   curving page. The content remains as one unbroken DOM element.
*/

const PageFlipOverlay = ({ progress, direction, frontContent, backContent }) => {
  const isNext = direction === 'next';
  const pageRotate = useTransform(
    progress,
    [0, 0.28, 0.62, 1],
    isNext ? [0, -42, -124, -179] : [0, 42, 124, 179]
  );
  const pageLift = useTransform(progress, p => Math.sin(p * Math.PI) * (isNext ? -16 : 16));
  const pageRise = useTransform(progress, p => Math.sin(p * Math.PI) * 34);
  const pageTilt = useTransform(progress, p => Math.sin(p * Math.PI) * (isNext ? 2.4 : -2.4));
  const pageCurve = useTransform(progress, p => 1 - Math.sin(p * Math.PI) * 0.075);
  const pageShadow = useTransform(progress, p => {
    const intensity = Math.sin(p * Math.PI);
    return `
      ${isNext ? -24 : 24}px 14px ${28 + intensity * 42}px rgba(0,0,0,${0.16 + intensity * 0.28}),
      inset ${isNext ? 20 : -20}px 0 ${28 + intensity * 34}px rgba(0,0,0,${0.07 + intensity * 0.20}),
      inset ${isNext ? -7 : 7}px 0 8px rgba(255,255,255,${0.18 + intensity * 0.18})
    `;
  });
  const sheenOpacity = useTransform(progress, p => 0.08 + Math.sin(p * Math.PI) * 0.58);
  const castShadowOpacity = useTransform(progress, p => Math.sin(p * Math.PI) * 0.42);
  const castShadowX = useTransform(progress, [0, 0.5, 1], isNext ? [80, -12, -112] : [-80, 12, 112]);
  const castShadowScale = useTransform(progress, p => 0.72 + Math.sin(p * Math.PI) * 0.48);
  const frontOpacity = useTransform(progress, [0, 0.46, 0.52, 1], [1, 1, 0, 0]);
  const backOpacity = useTransform(progress, [0, 0.48, 0.54, 1], [0, 0, 1, 1]);

  return (
    <div className="book-flip-overlay">
      <motion.div
        className={`book-flip-cast-shadow ${isNext ? 'book-flip-cast-shadow-next' : 'book-flip-cast-shadow-prev'}`}
        style={{
          opacity: castShadowOpacity,
          x: castShadowX,
          scaleX: castShadowScale,
        }}
      />
      <motion.div
        className={`book-flip-sheet ${isNext ? 'book-flip-sheet-next' : 'book-flip-sheet-prev'}`}
        style={{
          rotateY: pageRotate,
          rotateX: pageTilt,
          x: pageLift,
          z: pageRise,
          scaleX: pageCurve,
          boxShadow: pageShadow,
          transformOrigin: isNext ? 'left center' : 'right center',
        }}
      >
        <motion.div className="book-flip-face book-flip-face-front" style={{ opacity: frontOpacity }}>
          {frontContent}
        </motion.div>
        <motion.div className="book-flip-face book-flip-face-back" style={{ opacity: backOpacity }}>
          {backContent || <div className="book-flip-blank-page" />}
        </motion.div>
        <div className="book-flip-paper-edge" />
        <motion.div className="book-flip-sheen" style={{ opacity: sheenOpacity }} />
      </motion.div>
      <motion.div
        className={`book-flip-readable-back ${isNext ? 'book-flip-readable-back-next' : 'book-flip-readable-back-prev'}`}
        style={{ opacity: backOpacity }}
      >
        {backContent || <div className="book-flip-blank-page" />}
      </motion.div>
    </div>
  );
};

const collectPageAssets = (page) => {
  if (!page) return [];

  return [
    page.background,
    page.imageUrl,
    page.hiddenImage,
    ...(Array.isArray(page.images) ? page.images : []),
  ].filter(Boolean);
};

const seededUnit = (seed, index, salt = 0) => {
  const value = Math.sin((seed + 17) * 12.9898 + index * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

function buildFinalParticles(seed, count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    driftX: (seededUnit(seed, index, 1) - 0.5) * 84,
    driftY: -80 - seededUnit(seed, index, 2) * 260,
    settleX: (seededUnit(seed, index, 3) - 0.5) * 620,
    settleY: (seededUnit(seed, index, 4) - 0.5) * 520,
    z: seededUnit(seed, index, 3),
    size: 3 + seededUnit(seed, index, 5) * 5,
    delay: seededUnit(seed, index, 6) * 1.1,
    duration: 2.4 + seededUnit(seed, index, 7) * 1.4,
  }));
}

function buildAmbientLights(seed, count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: 8 + seededUnit(seed, index, 11) * 84,
    top: 8 + seededUnit(seed, index, 12) * 84,
    size: 55 + seededUnit(seed, index, 13) * 120,
    delay: seededUnit(seed, index, 14) * 1.8,
    duration: 4 + seededUnit(seed, index, 15) * 2.5,
  }));
}

function FinalRevealScene({ active, palette, seed }) {
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const lights = useMemo(() => buildAmbientLights(seed || 42, 5), [seed]);
  const particles = useMemo(() => buildFinalParticles(seed || 42, 64), [seed]);
  const primary = palette.primary || '#c9184a';
  const accent = palette.accent || '#d4a373';
  const ink = palette.ink || '#2c2c2c';

  useEffect(() => {
    if (!active) {
      setShowEnvelope(false);
      setLetterOpened(false);
      return undefined;
    }

    setShowEnvelope(false);
    setLetterOpened(false);
    const envelopeTimer = window.setTimeout(() => {
      setShowEnvelope(true);
    }, 5200);

    return () => window.clearTimeout(envelopeTimer);
  }, [active]);

  const handleOpenLetter = (event) => {
    event.stopPropagation();
    setLetterOpened(true);
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="final-reveal-scene"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="final-depth-field">
            {lights.map((light) => (
              <motion.span
                key={light.id}
                className="final-depth-light"
                style={{
                  left: `${light.left}%`,
                  top: `${light.top}%`,
                  width: light.size,
                  height: light.size,
                  '--light-color': light.id % 2 === 0 ? primary : accent,
                }}
                animate={{
                  y: [0, -6, 0],
                  scale: [0.82, 1.02, 0.94],
                  opacity: [0, 0.16, 0.08],
                }}
                transition={{
                  duration: light.duration,
                  delay: light.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          <div className="final-spark-field">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="final-spark"
                style={{
                  width: particle.size,
                  height: particle.size,
                  '--spark-color': particle.id % 3 === 0 ? primary : accent,
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                animate={{
                  x: [0, particle.driftX, particle.settleX],
                  y: [0, particle.driftY, particle.settleY],
                  opacity: [0, 0.9, 0.5, 0],
                  scale: [0.2, 1.15 + particle.z * 0.45, 0.82, 0],
                }}
                transition={{
                  duration: particle.duration,
                  delay: 0.62 + particle.delay,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.28, 0.72, 1],
                }}
              />
            ))}
          </div>
          <div className="final-memory-shell">
            <motion.div
              className="final-memory-frame"
              initial={{ opacity: 0, scale: 0.92, y: 34, filter: 'blur(18px)' }}
              animate={{
                opacity: showEnvelope ? 0 : 1,
                scale: showEnvelope ? 0.93 : 1,
                y: showEnvelope ? -10 : 0,
                filter: showEnvelope ? 'blur(14px)' : 'blur(0px)',
              }}
              transition={{
                duration: showEnvelope ? 1.15 : 1.8,
                delay: showEnvelope ? 0 : 3.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.img
                className="final-memory-image"
                src={referenceImage}
                alt=""
                draggable="false"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 3.25, ease: 'easeOut' }}
              />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {showEnvelope && !letterOpened && (
              <motion.button
                key="final-envelope"
                type="button"
                className="final-letter-envelope"
                onClick={handleOpenLetter}
                initial={{ opacity: 0, x: '-50%', y: '-38%', scale: 0.86, rotateX: -12 }}
                animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, x: '-50%', y: '-58%', scale: 0.92, filter: 'blur(10px)' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Tocar para abrir la carta"
              >
                <span className="final-letter-envelope-flap" />
                <span className="final-letter-envelope-body">
                  <span className="final-letter-envelope-seal">♥</span>
                  <span className="final-letter-envelope-text">tocar para abrir</span>
                </span>
              </motion.button>
            )}

            {letterOpened && (
              <motion.div
                key="final-poem"
                className="final-letter-poem"
                style={{ '--final-letter-ink': ink }}
                initial={{ opacity: 0, x: '-50%', y: '-44%', scale: 0.97, filter: 'blur(12px)' }}
                animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: '-50%', y: '-52%' }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
  <div className="final-letter-meta">
    <div className="final-letter-meta-to">
      <span>Para:</span> Gabriela
    </div>

    <div className="final-letter-meta-from">
      <span>De:</span> Ernesto
    </div>
  </div>

  <div className="final-letter-body">
    {finalLetterText}
  </div>
</motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BookViewer({ seed, artDirection }) {
  const [currentSpread, setCurrentSpread] = useState(0); // Index into spreads (pairs of pages)
  const [targetSpread, setTargetSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [flipSnapshot, setFlipSnapshot] = useState(null);
  const [showFinalReveal, setShowFinalReveal] = useState(false);
  const flipProgress = useMotionValue(0);
  const isFlippingRef = useRef(false);
  const flipControlsRef = useRef(null);
  const flipFallbackRef = useRef(null);
  const preloadedAssetsRef = useRef(new Set());
  const containerRef = useRef(null);
  const panGestureRef = useRef({
    startX: 0,
    startY: 0,
    didPan: false,
    ignoreClick: false,
  });
  const panClickResetRef = useRef(null);

  const pages = bookConfig.pages;
  // Build spreads: pair pages into left/right
  const spreads = useMemo(() => {
    const result = [];
    for (let i = 0; i < pages.length; i += 2) {
      result.push({
        left: pages[i] || null,
        right: pages[i + 1] || null,
        leftIndex: i,
        rightIndex: i + 1
      });
    }
    return result;
  }, [pages]);

  const totalSpreads = spreads.length;
  const interactiveSelector = '[data-book-interactive="true"], button, a, input, textarea, select, [role="button"]';

  const shouldSkipPageNavigation = (event) => {
    if (panGestureRef.current.ignoreClick) {
      panGestureRef.current.ignoreClick = false;
      return true;
    }

    return event?.target?.closest?.(interactiveSelector);
  };

  const preloadAsset = (src) => {
    if (!src || preloadedAssetsRef.current.has(src) || typeof window === 'undefined') return;
    preloadedAssetsRef.current.add(src);
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  };

  const preloadSpreadAssets = (spread) => {
    if (!spread) return;
    [...collectPageAssets(spread.left), ...collectPageAssets(spread.right)].forEach(preloadAsset);
  };

  useEffect(() => {
    [currentSpread - 1, currentSpread, currentSpread + 1]
      .filter((spreadIndex) => spreadIndex >= 0 && spreadIndex < totalSpreads)
      .forEach((spreadIndex) => preloadSpreadAssets(spreads[spreadIndex]));
  }, [currentSpread, spreads, totalSpreads]);

  const startFlip = (nextSpread) => {
    if (isFlippingRef.current) return;

    const clampedSpread = Math.max(0, Math.min(nextSpread, totalSpreads - 1));
    if (clampedSpread === currentSpread) return;

    const dir = clampedSpread > currentSpread ? 'next' : 'prev';
    const fromSpread = spreads[currentSpread];
    const toSpread = spreads[clampedSpread];
    if (!fromSpread || !toSpread) return;

    const snapshot = dir === 'next'
      ? {
          direction: dir,
          fromSpread: currentSpread,
          toSpread: clampedSpread,
          underLeft: fromSpread.left,
          underLeftIndex: fromSpread.leftIndex,
          underRight: toSpread.right,
          underRightIndex: toSpread.rightIndex,
          flipFront: fromSpread.right,
          flipFrontIndex: fromSpread.rightIndex,
          flipFrontSide: 'right',
          flipBack: toSpread.left,
          flipBackIndex: toSpread.leftIndex,
          flipBackSide: 'left',
        }
      : {
          direction: dir,
          fromSpread: currentSpread,
          toSpread: clampedSpread,
          underLeft: toSpread.left,
          underLeftIndex: toSpread.leftIndex,
          underRight: fromSpread.right,
          underRightIndex: fromSpread.rightIndex,
          flipFront: fromSpread.left,
          flipFrontIndex: fromSpread.leftIndex,
          flipFrontSide: 'left',
          flipBack: toSpread.right,
          flipBackIndex: toSpread.rightIndex,
          flipBackSide: 'right',
        };

    let completed = false;

    if (flipControlsRef.current) {
      flipControlsRef.current.stop();
    }
    if (flipFallbackRef.current) {
      window.clearTimeout(flipFallbackRef.current);
    }

    setShowFinalReveal(false);
    setTargetSpread(clampedSpread);
    setFlipDirection(dir);
    setFlipSnapshot(snapshot);
    setIsFlipping(true);
    isFlippingRef.current = true;
    flipProgress.set(0);
    preloadSpreadAssets(fromSpread);
    preloadSpreadAssets(toSpread);

    const completeFlip = () => {
      if (completed) return;
      completed = true;

      if (flipFallbackRef.current) {
        window.clearTimeout(flipFallbackRef.current);
        flipFallbackRef.current = null;
      }

      setCurrentSpread(clampedSpread);
      setTargetSpread(clampedSpread);
      setIsFlipping(false);
      setFlipDirection(null);
      setFlipSnapshot(null);
      isFlippingRef.current = false;
      flipProgress.set(0);
    };

    const isFast = Math.abs(clampedSpread - currentSpread) > 1;

    flipControlsRef.current = animate(flipProgress, 1, {
      type: 'spring',
      stiffness: isFast ? 200 : 55,
      damping: isFast ? 28 : 18,
      mass: 0.8,
      restDelta: 0.005,
      onComplete: completeFlip,
    });

    flipFallbackRef.current = window.setTimeout(completeFlip, isFast ? 1200 : 2200);
  };

  // Navigate
  const goNext = () => {
    if (isFlippingRef.current) return;

    if (currentSpread < totalSpreads - 1) {
      startFlip(currentSpread + 1);
      return;
    }

    if (currentSpread === totalSpreads - 1) {
      setShowFinalReveal(true);
    }
  };

  const goPrev = () => {
    if (isFlippingRef.current) return;

    if (currentSpread > 0) {
      startFlip(currentSpread - 1);
    }
  };

  const handleLeftPageClick = (event) => {
    if (shouldSkipPageNavigation(event)) return;
    goPrev();
  };

  const handleRightPageClick = (event) => {
    if (shouldSkipPageNavigation(event)) return;
    goNext();
  };

  const handlePrevButtonClick = (event) => {
    event.stopPropagation();
    goPrev();
  };

  const handleNextButtonClick = (event) => {
    event.stopPropagation();
    goNext();
  };

  const clearPanClickReset = () => {
    if (panClickResetRef.current) {
      window.clearTimeout(panClickResetRef.current);
      panClickResetRef.current = null;
    }
  };

  const schedulePanClickReset = () => {
    clearPanClickReset();
    panClickResetRef.current = window.setTimeout(() => {
      panGestureRef.current.ignoreClick = false;
      panClickResetRef.current = null;
    }, 160);
  };

  const handlePanPointerDown = (event) => {
    if (event.pointerType && event.isPrimary === false) return;

    clearPanClickReset();
    panGestureRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      didPan: false,
      ignoreClick: false,
    };
  };

  const handlePanPointerMove = (event) => {
    const gesture = panGestureRef.current;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (Math.hypot(deltaX, deltaY) > 10) {
      gesture.didPan = true;
      gesture.ignoreClick = true;
    }
  };

  const handlePanPointerEnd = () => {
    if (panGestureRef.current.didPan) {
      schedulePanClickReset();
      return;
    }

    panGestureRef.current.ignoreClick = false;
  };

  // Clean up running flip animation only when the viewer unmounts.
  useEffect(() => {
    return () => {
      if (flipControlsRef.current) {
        flipControlsRef.current.stop();
      }
      if (flipFallbackRef.current) {
        window.clearTimeout(flipFallbackRef.current);
      }
      clearPanClickReset();
    };
  }, []);

  const currentSpreadData = spreads[currentSpread];
  const underLeft = flipSnapshot?.underLeft ?? currentSpreadData?.left;
  const underRight = flipSnapshot?.underRight ?? currentSpreadData?.right;
  const underLeftIndex = flipSnapshot?.underLeftIndex ?? currentSpreadData?.leftIndex;
  const underRightIndex = flipSnapshot?.underRightIndex ?? currentSpreadData?.rightIndex;
  const flipFront = flipSnapshot?.flipFront ?? null;

  // Cinematic entrance
  const entranceVariants = {
    hidden: { opacity: 0, scale: 0.75, y: 120, rotateX: 15 },
    visible: {
      opacity: 1, scale: 1, y: 0, rotateX: 0,
      transition: { type: 'spring', stiffness: 25, damping: 12, mass: 2, delay: 0.3 }
    }
  };

  // Idle floating
  const floatingAnimation = {
    y: [0, -4, 0, -2, 0],
    rotateZ: [0, 0.15, 0, -0.1, 0],
  };

  const palette = artDirection?.palette || {};
  const paperBg = palette.paper || '#fdfbf7';
  const finalRevealActive = showFinalReveal && currentSpread === totalSpreads - 1 && targetSpread === currentSpread && !isFlipping;
  const finalBookAnimation = {
    opacity: [1, 1, 0.88, 0.28, 0],
    scale: [1, 0.96, 0.92, 0.78, 0.64],
    y: [0, -8, 18, 170, 330],
    rotateX: [0, 8, 4, 1, 0],
    rotateZ: [0, -1.1, 0.8, 0.2, 0],
    transition: { duration: 5.1, times: [0, 0.2, 0.43, 0.72, 1], ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className={`book-viewer-wrapper ${finalRevealActive ? 'book-viewer-wrapper-final' : ''}`} style={{ perspective: '2000px' }}>
      <FinalRevealScene active={finalRevealActive} palette={palette} seed={seed} />

      {/* Navigation arrows */}
      <motion.button
        className="book-nav book-nav-prev"
        onClick={handlePrevButtonClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ opacity: currentSpread > 0 ? 1 : 0.2 }}
        disabled={currentSpread === 0}
      >
        ‹
      </motion.button>

      <motion.button
        className="book-nav book-nav-next"
        onClick={handleNextButtonClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ opacity: finalRevealActive ? 0.2 : 1 }}
        disabled={finalRevealActive}
      >
        ›
      </motion.button>

      <div
        className="book-mobile-pan-area"
        onPointerDown={handlePanPointerDown}
        onPointerMove={handlePanPointerMove}
        onPointerUp={handlePanPointerEnd}
        onPointerCancel={handlePanPointerEnd}
      >
        <motion.div
          className={`book-body ${isFlipping ? 'book-body-flipping' : ''} ${finalRevealActive ? 'book-body-final' : ''}`}
          ref={containerRef}
          variants={entranceVariants}
          initial="hidden"
          animate={finalRevealActive ? finalBookAnimation : 'visible'}
        >
          {/* Spine shadow */}
          <div className="book-spine" />

          {/* Left page */}
          <div className="book-page book-page-left" onClick={handleLeftPageClick} style={{ backgroundColor: paperBg }}>
            {underLeft && (
              <PageRenderer
                key={`left-${underLeftIndex}`}
                page={underLeft}
                index={underLeftIndex}
                seed={seed}
                artDirection={artDirection}
                side="left"
                animateIntro={false}
              />
            )}
          </div>

          {/* Right page */}
          <div className="book-page book-page-right" onClick={handleRightPageClick} style={{ backgroundColor: paperBg }}>
            {underRight && (
              <PageRenderer
                key={`right-${underRightIndex}`}
                page={underRight}
                index={underRightIndex}
                seed={seed}
                artDirection={artDirection}
                side="right"
                animateIntro={false}
              />
            )}
          </div>

          {/* Flip animation overlay */}
          {isFlipping && flipSnapshot && flipFront && (
            <PageFlipOverlay
              progress={flipProgress}
              direction={flipDirection}
              frontContent={
                <div className={`book-page ${flipSnapshot.flipFrontSide === 'right' ? 'book-page-right' : 'book-page-left'}`} style={{ backgroundColor: paperBg }}>
                  <PageRenderer
                    page={flipFront}
                    index={flipSnapshot.flipFrontIndex}
                    seed={seed}
                    artDirection={artDirection}
                    side={flipSnapshot.flipFrontSide}
                    animateIntro={false}
                  />
                </div>
              }
              backContent={
                <div className={`book-page ${flipSnapshot.flipBackSide === 'left' ? 'book-page-left' : 'book-page-right'}`} style={{ backgroundColor: paperBg }}>
                  <PageRenderer
                    page={flipSnapshot.flipBack}
                    index={flipSnapshot.flipBackIndex}
                    seed={seed}
                    artDirection={artDirection}
                    side={flipSnapshot.flipBackSide}
                    animateIntro={false}
                  />
                </div>
              }
            />
          )}

          {/* Page edge lines (subtle) */}
          <div className="book-page-edges" />

        </motion.div>
      </div>

      {/* Page counter */}
      <motion.div className="book-page-counter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        {currentSpread + 1} / {totalSpreads}
      </motion.div>
    </div>
  );
}
