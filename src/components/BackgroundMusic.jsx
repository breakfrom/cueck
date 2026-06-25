import React, { useEffect, useRef } from 'react';

const TRACKS = [
  '/sounds/sound_1.mp3',
  '/sounds/sound_2.mp3',
  '/sounds/sound_3.mp3',
    '/sounds/sound_4.mp3',
];

const TARGET_VOLUME = 0.16;
const FADE_SECONDS = 4;

function shuffleTracks(tracks) {
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function BackgroundMusic() {
  const orderRef = useRef(null);
  const audioRef = useRef(null);
  const trackIndexRef = useRef(0);
  const fadeFrameRef = useRef(null);
  const retryTimerRef = useRef(null);
  const playAttemptRef = useRef(false);
  const playRequestRef = useRef(0);
  const playbackStartedRef = useRef(false);
  const fadeOutStartedRef = useRef(false);
  const unavailableTracksRef = useRef(new Set());

  if (!orderRef.current) {
    orderRef.current = shuffleTracks(TRACKS);
  }

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0;
    audioRef.current = audio;

    let destroyed = false;

    if (typeof window !== 'undefined') {
      window.__gabrielaMusicOrder = [...orderRef.current];
      document.documentElement.dataset.musicOrder = orderRef.current.join('|');
    }

    const stopFade = () => {
      if (fadeFrameRef.current) {
        window.cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
    };

    const fadeTo = (targetVolume, durationMs) => {
      stopFade();
      const fromVolume = audio.volume;
      const startedAt = performance.now();

      const step = (now) => {
        if (destroyed) return;
        const progress = Math.min((now - startedAt) / durationMs, 1);
        audio.volume = fromVolume + (targetVolume - fromVolume) * progress;

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(step);
        } else {
          fadeFrameRef.current = null;
        }
      };

      fadeFrameRef.current = window.requestAnimationFrame(step);
    };

    const playCurrentTrack = () => {
      if (destroyed || playbackStartedRef.current || playAttemptRef.current) return;

      const order = orderRef.current;
      const currentTrack = order[trackIndexRef.current];
      const requestId = playRequestRef.current + 1;
      playRequestRef.current = requestId;

      playAttemptRef.current = true;
      playbackStartedRef.current = false;
      fadeOutStartedRef.current = false;
      stopFade();

      audio.pause();
      audio.src = currentTrack;
      audio.currentTime = 0;
      audio.volume = 0;
      audio.load();

      let playPromise;
      try {
        playPromise = audio.play();
      } catch {
        playAttemptRef.current = false;
        return;
      }

      const handlePlaybackReady = () => {
        if (destroyed || requestId !== playRequestRef.current) return;
        playAttemptRef.current = false;
        playbackStartedRef.current = true;
        unavailableTracksRef.current.delete(currentTrack);
        fadeTo(TARGET_VOLUME, FADE_SECONDS * 1000);
      };

      const handlePlaybackBlocked = () => {
        if (destroyed || requestId !== playRequestRef.current) return;
        playAttemptRef.current = false;
        playbackStartedRef.current = false;
      };

      if (playPromise?.then) {
        playPromise
          .then(handlePlaybackReady)
          .catch(handlePlaybackBlocked);
      } else {
        handlePlaybackReady();
      }
    };

    const playNextTrack = () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % orderRef.current.length;
      playAttemptRef.current = false;
      playbackStartedRef.current = false;
      playCurrentTrack();
    };

    const handleEnded = () => {
      playNextTrack();
    };

    const handleError = () => {
      const currentTrack = orderRef.current[trackIndexRef.current];
      unavailableTracksRef.current.add(currentTrack);
      playAttemptRef.current = false;
      playbackStartedRef.current = false;

      if (unavailableTracksRef.current.size >= orderRef.current.length) {
        if (!retryTimerRef.current) {
          retryTimerRef.current = window.setTimeout(() => {
            retryTimerRef.current = null;
            unavailableTracksRef.current.clear();
            playCurrentTrack();
          }, 5000);
        }
        return;
      }

      playNextTrack();
    };

    const handleTimeUpdate = () => {
      if (!Number.isFinite(audio.duration) || fadeOutStartedRef.current) return;

      const remaining = audio.duration - audio.currentTime;
      if (remaining <= FADE_SECONDS && audio.volume > 0.01) {
        fadeOutStartedRef.current = true;
        fadeTo(0, Math.max(remaining, 0.8) * 1000);
      }
    };

    const startFromInteraction = () => {
      if (playbackStartedRef.current) return;
      playAttemptRef.current = false;
      playCurrentTrack();
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    window.addEventListener('pointerdown', startFromInteraction, true);
    window.addEventListener('keydown', startFromInteraction, true);
    window.addEventListener('touchstart', startFromInteraction, true);

    const autoplayTimer = window.setTimeout(playCurrentTrack, 300);

    return () => {
      destroyed = true;
      window.clearTimeout(autoplayTimer);
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }
      stopFade();
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      window.removeEventListener('pointerdown', startFromInteraction, true);
      window.removeEventListener('keydown', startFromInteraction, true);
      window.removeEventListener('touchstart', startFromInteraction, true);
      delete document.documentElement.dataset.musicOrder;
      audioRef.current = null;
    };
  }, []);

  return null;
}
