import React from 'react';
import { seedRandom } from './photoUtils';

import StringWithPins from './StringWithPins';
import TapedPhoto from './TapedPhoto';
import ClippedPhoto from './ClippedPhoto';
import SewnPhoto from './SewnPhoto';
import PolaroidStrip from './PolaroidStrip';
import Envelope from './Envelope';
import PostcardPhoto from './PostcardPhoto';
import FoundPhoto from './FoundPhoto';
import FloatingFrame from './FloatingFrame';
import FoldedCorner from './FoldedCorner';
import StackedPhotos from './StackedPhotos';
import PhotoUnderVellum from './PhotoUnderVellum';
import MosaicIrregular from './MosaicIrregular';
import PhotoChain from './PhotoChain';
import MiniAlbum from './MiniAlbum';

/**
 * All available photo presentation types.
 */
export const PHOTO_TYPES = [
  'string-with-pins',
  'taped-photo',
  'clipped-photo',
  'sewn-photo',
  'polaroid-strip',
  'envelope',
  'postcard-photo',
  'found-photo',
  'floating-frame',
  'folded-corner',
  'stacked-photos',
  'photo-under-vellum',
  'mosaic-irregular',
  'photo-chain',
  'mini-album',
];

/**
 * Map of type string to component.
 */
const COMPONENT_MAP = {
  'string-with-pins': StringWithPins,
  'taped-photo': TapedPhoto,
  'clipped-photo': ClippedPhoto,
  'sewn-photo': SewnPhoto,
  'polaroid-strip': PolaroidStrip,
  'envelope': Envelope,
  'postcard-photo': PostcardPhoto,
  'found-photo': FoundPhoto,
  'floating-frame': FloatingFrame,
  'folded-corner': FoldedCorner,
  'stacked-photos': StackedPhotos,
  'photo-under-vellum': PhotoUnderVellum,
  'mosaic-irregular': MosaicIrregular,
  'photo-chain': PhotoChain,
  'mini-album': MiniAlbum,
};

/**
 * Pick a random photo presentation type based on seed.
 * @param {number|string} seed
 * @returns {string} A type from PHOTO_TYPES
 */
export function getRandomPhotoType(seed) {
  const rng = seedRandom(seed);
  return PHOTO_TYPES[Math.floor(rng() * PHOTO_TYPES.length)];
}

/**
 * Render a photo presentation component by type.
 * @param {string} type - One of PHOTO_TYPES
 * @param {{ images: string[], seed: number, captions?: string[] }} props
 * @returns {React.ReactElement|null}
 */
export function renderPhotoPresentation(type, { images = [], seed = 42, captions = [] }) {
  const Component = COMPONENT_MAP[type];
  if (!Component) {
    console.warn(`[PhotoRegistry] Unknown photo type: "${type}". Available: ${PHOTO_TYPES.join(', ')}`);
    return null;
  }
  return <Component images={images} seed={seed} captions={captions} />;
}

/**
 * React component wrapper for declarative usage.
 * <PhotoPresentation type="taped-photo" images={[...]} seed={42} captions={[...]} />
 */
export default function PhotoPresentation({ type, images = [], seed = 42, captions = [] }) {
  return renderPhotoPresentation(type, { images, seed, captions });
}
