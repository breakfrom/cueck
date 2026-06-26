import React, { useCallback, useEffect, useMemo, useRef } from 'react';

const SOUND_BASE_URL = import.meta.env.BASE_URL || '/';
const TRACKS = [
  'sound_1.mp3',
  'sound_2.mp3',
  'sound_3.mp3',
].map((fileName) => `${SOUND_BASE_URL}sounds/${fileName}`);

const TARGET_VOLUME = 0.16;
const FADE_IN_MS = 2400;
const FADE_OUT_MS = 1200;
const END_FADE_SECONDS = 4;

function shuffleTracks(tracks) {
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

export default function BackgroundMusic() {
  const trackOrder = useMemo(() => shuffleTracks(TRACKS), []);
  const audioRef = useRef(null);
  const currentIndexRef = useRef(0);
  const fadeFrameRef = useRef(null);
  const fadeResolveRef = useRef(null);
  const retryTimerRef = useRef(null);
  const playRequestRef = useRef(0);
  const playbackStartedRef = useRef(false);
  const playAttemptRef = useRef(false);
  const endingFadeStartedRef = useRef(false);
  const transitionRef = useRef(false);
  const unavailableTracksRef = useRef(new Set());
  const needsUserInteractionRef = useRef(false);
  const destroyedRef = useRef(false);

  const publishMusicState = useCallback((status = 'idle') => {
    if (typeof window === 'undefined') return;

    const currentTrack = trackOrder[currentIndexRef.current] || null;
    window.__gabrielaMusicState = {
      currentIndex: currentIndexRef.current,
      currentTrack,
      order: [...trackOrder],
      playbackStarted: playbackStartedRef.current,
      needsUserInteraction: needsUserInteractionRef.current,
      status,
    };
    document.documentElement.dataset.musicTrack = currentTrack || '';
    document.documentElement.dataset.musicStatus = status;
    document.documentElement.dataset.musicNeedsUserInteraction = String(needsUserInteractionRef.current);
  }, [trackOrder]);

  const stopFade = useCallback(() => {
    if (fadeFrameRef.current) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    if (fadeResolveRef.current) {
      fadeResolveRef.current();
      fadeResolveRef.current = null;
    }
  }, []);

  const fadeTo = useCallback((targetVolume, durationMs) => new Promise((resolve) => {
    const audio = audioRef.current;
    stopFade();

    if (!audio || destroyedRef.current) {
      resolve();
      return;
    }

    const fromVolume = audio.volume;
    const startedAt = performance.now();
    fadeResolveRef.current = resolve;

    const step = (now) => {
      if (destroyedRef.current) return;

      const progress = Math.min((now - startedAt) / durationMs, 1);
      const nextVolume = fromVolume + (targetVolume - fromVolume) * progress;
      audio.volume = Math.max(0, Math.min(TARGET_VOLUME, nextVolume));

      if (progress < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      fadeFrameRef.current = null;
      fadeResolveRef.current = null;
      resolve();
    };

    fadeFrameRef.current = window.requestAnimationFrame(step);
  }), [stopFade]);

  const playTrackAt = useCallback(async (index) => {
    const audio = audioRef.current;
    if (!audio || destroyedRef.current || playAttemptRef.current) return false;

    const safeIndex = wrapIndex(index, trackOrder.length);
    const track = trackOrder[safeIndex];
    const requestId = playRequestRef.current + 1;
    playRequestRef.current = requestId;
    currentIndexRef.current = safeIndex;
    playAttemptRef.current = true;
    playbackStartedRef.current = false;
    endingFadeStartedRef.current = false;
    needsUserInteractionRef.current = false;
    publishMusicState('loading');

    stopFade();
    audio.pause();
    audio.src = track;
    audio.currentTime = 0;
    audio.volume = 0;
    audio.load();

    try {
      await audio.play();
    } catch (error) {
      if (requestId === playRequestRef.current) {
        console.warn('audio play blocked', error);
        playAttemptRef.current = false;
        playbackStartedRef.current = false;
        needsUserInteractionRef.current = true;
        publishMusicState('blocked');
      }
      return false;
    }

    if (destroyedRef.current || requestId !== playRequestRef.current) {
      return false;
    }

    playAttemptRef.current = false;
    playbackStartedRef.current = true;
    needsUserInteractionRef.current = false;
    unavailableTracksRef.current.delete(track);
    publishMusicState('playing');
    void fadeTo(TARGET_VOLUME, FADE_IN_MS);
    return true;
  }, [fadeTo, publishMusicState, stopFade, trackOrder]);

  const startPlayback = useCallback(() => {
    if (playbackStartedRef.current || playAttemptRef.current) return;
    void playTrackAt(currentIndexRef.current);
  }, [playTrackAt]);

  const nextTrack = useCallback(async () => {
    if (transitionRef.current) return;

    const audio = audioRef.current;
    const nextIndex = wrapIndex(currentIndexRef.current + 1, trackOrder.length);

    if (!audio || !playbackStartedRef.current) {
      playAttemptRef.current = false;
      currentIndexRef.current = nextIndex;
      void playTrackAt(nextIndex);
      return;
    }

    transitionRef.current = true;
    playRequestRef.current += 1;
    publishMusicState('fading');

    await fadeTo(0, FADE_OUT_MS);

    if (!destroyedRef.current) {
      audio.pause();
      playAttemptRef.current = false;
      playbackStartedRef.current = false;
      await playTrackAt(nextIndex);
    }

    transitionRef.current = false;
  }, [fadeTo, playTrackAt, publishMusicState, trackOrder.length]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0;
    audioRef.current = audio;
    destroyedRef.current = false;

    if (typeof window !== 'undefined') {
      window.__gabrielaMusicOrder = [...trackOrder];
      document.documentElement.dataset.musicOrder = trackOrder.join('|');
      publishMusicState('idle');
    }

    const playNextFromOrder = () => {
      const nextIndex = wrapIndex(currentIndexRef.current + 1, trackOrder.length);
      playAttemptRef.current = false;
      playbackStartedRef.current = false;
      void playTrackAt(nextIndex);
    };

    const handleEnded = () => {
      if (!transitionRef.current) {
        playNextFromOrder();
      }
    };

    const handleError = () => {
      const failedTrack = trackOrder[currentIndexRef.current];
      unavailableTracksRef.current.add(failedTrack);
      playAttemptRef.current = false;
      playbackStartedRef.current = false;
      needsUserInteractionRef.current = false;
      publishMusicState('error');

      if (unavailableTracksRef.current.size >= trackOrder.length) {
        if (!retryTimerRef.current) {
          retryTimerRef.current = window.setTimeout(() => {
            retryTimerRef.current = null;
            unavailableTracksRef.current.clear();
            startPlayback();
          }, 5000);
        }
        return;
      }

      playNextFromOrder();
    };

    const handleTimeUpdate = () => {
      if (!Number.isFinite(audio.duration) || endingFadeStartedRef.current || transitionRef.current) return;

      const remaining = audio.duration - audio.currentTime;
      if (remaining <= END_FADE_SECONDS && audio.volume > 0.01) {
        endingFadeStartedRef.current = true;
        void fadeTo(0, Math.max(remaining, 0.8) * 1000);
      }
    };

    const startFromInteraction = (event) => {
      if (event?.target?.closest?.('.background-music-button')) return;
      if (!needsUserInteractionRef.current && playbackStartedRef.current) return;
      startPlayback();
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    window.addEventListener('pointerdown', startFromInteraction, true);
    window.addEventListener('keydown', startFromInteraction, true);
    window.addEventListener('touchstart', startFromInteraction, true);

    startPlayback();

    return () => {
      destroyedRef.current = true;

      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
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
      delete document.documentElement.dataset.musicStatus;
      delete document.documentElement.dataset.musicTrack;
      delete document.documentElement.dataset.musicNeedsUserInteraction;
      delete window.__gabrielaMusicState;
      audioRef.current = null;
    };
  }, [fadeTo, playTrackAt, publishMusicState, startPlayback, stopFade, trackOrder]);

  const handleNextClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    void nextTrack();
  };

  const stopButtonPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <button
      type="button"
      className="background-music-button"
      data-book-interactive="true"
      onClick={handleNextClick}
      onPointerDown={stopButtonPropagation}
      onTouchStart={stopButtonPropagation}
      aria-label="Cambiar a la siguiente cancion"
    >
      <span className="background-music-note" aria-hidden="true">&#9834;</span>
      <span>Next</span>
    </button>
  );
}
