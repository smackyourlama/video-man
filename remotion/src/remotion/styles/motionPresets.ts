import { interpolate, spring } from 'remotion';

export const motionPresets = {
  fadeIn: (frame: number, duration = 18) => interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' }),
  fadeOut: (frame: number, total: number, duration = 18) => interpolate(frame, [total - duration, total], [1, 0], { extrapolateLeft: 'clamp' }),
  slideUp: (frame: number, from = 32, duration = 18) => interpolate(frame, [0, duration], [from, 0], { extrapolateRight: 'clamp' }),
  slideDown: (frame: number, from = -32, duration = 18) => interpolate(frame, [0, duration], [from, 0], { extrapolateRight: 'clamp' }),
  slideLeft: (frame: number, from = 42, duration = 18) => interpolate(frame, [0, duration], [from, 0], { extrapolateRight: 'clamp' }),
  slideRight: (frame: number, from = -42, duration = 18) => interpolate(frame, [0, duration], [from, 0], { extrapolateRight: 'clamp' }),
  slowZoomIn: (frame: number, total: number) => interpolate(frame, [0, total], [1, 1.08]),
  slowZoomOut: (frame: number, total: number) => interpolate(frame, [0, total], [1.08, 1]),
  cardReveal: (frame: number, fps: number) => spring({ frame, fps, config: { damping: 16, stiffness: 120 } }),
  staggeredListReveal: (frame: number, index: number, gap = 5) => Math.max(0, frame - index * gap),
  typewriter: (frame: number, text: string, charsPerFrame = 1.4) => text.slice(0, Math.floor(frame * charsPerFrame)),
  glitchPulse: (frame: number) => (frame % 19 === 0 ? 1 : 0),
  staticFlicker: (frame: number) => 0.08 + ((frame % 11) / 11) * 0.08,
  dataStreamReveal: (frame: number, total: number) => interpolate(frame, [0, total], [0, 1]),
  ledgerFlip: (frame: number, total: number) => interpolate(frame, [0, total], [90, 0]),
  terminalBlink: (frame: number) => (Math.floor(frame / 12) % 2 === 0 ? 1 : 0),
  numberTicker: (frame: number, total: number, target: number) => Math.round(interpolate(frame, [0, total], [0, target], { extrapolateRight: 'clamp' })),
  diagramPathDraw: (frame: number, total: number) => interpolate(frame, [0, total], [0, 1], { extrapolateRight: 'clamp' }),
};
