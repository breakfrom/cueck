import React, { useState, useMemo } from 'react';
import Welcome from './components/Welcome';
import Quiz from './components/Quiz';
import BookViewer from './components/BookViewer';
import LivingBackground from './components/LivingBackground';
import BackgroundMusic from './components/BackgroundMusic';
import { createSeedEngine } from './engine/seed';
import { getArtDirection } from './engine/artDirection';
import './index.css';

export default function App() {
  const [phase, setPhase] = useState('welcome');

  // Generate seed engine once per session
  const seedEngine = useMemo(() => createSeedEngine(Date.now() & 0xffffffff), []);
  const seed = seedEngine.seed;

  // Pick art direction from seed deterministically
  const artDirection = useMemo(() => getArtDirection(seedEngine), [seedEngine]);

  // Expose current theme name for debugging
  if (typeof window !== 'undefined') {
    window.__gabrielaTheme = artDirection.name;
    window.__gabrielaSeed = seed;
  }

  return (
    <div className="app-container" style={{
      '--palette-primary': artDirection.palette.primary,
      '--palette-secondary': artDirection.palette.secondary,
      '--palette-accent': artDirection.palette.accent,
      '--palette-paper': artDirection.palette.paper,
      '--palette-ink': artDirection.palette.ink,
      '--palette-muted': artDirection.palette.muted,
      '--font-title': `'${artDirection.fontPairings.title}', serif`,
      '--font-handwritten': `'${artDirection.fontPairings.handwritten}', cursive`,
      '--font-body': `'${artDirection.fontPairings.body}', sans-serif`,
      '--font-accent': `'${artDirection.fontPairings.accent}', cursive`,
      '--font-quote': `'${artDirection.fontPairings.quote || artDirection.fontPairings.title}', serif`,
    }}>
      {/* Living background - always present, extremely subtle */}
      <LivingBackground seed={seed} palette={artDirection.palette} />
      <BackgroundMusic />

      {phase === 'welcome' && <Welcome onNext={() => setPhase('quiz')} artDirection={artDirection} />}
      {phase === 'quiz' && <Quiz onComplete={() => setPhase('book')} artDirection={artDirection} />}
      {phase === 'book' && <BookViewer seed={seed} artDirection={artDirection} />}
    </div>
  );
}
