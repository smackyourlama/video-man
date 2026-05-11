import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const AnimatedGrid: React.FC<{ color?: string; opacity?: number }> = ({ color = 'rgba(255,255,255,0.08)', opacity = 1 }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame % 240, [0, 240], [0, 120]);
  return <AbsoluteFill style={{ opacity, overflow: 'hidden' }}><div style={{ position: 'absolute', inset: -180, backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`, backgroundSize: '88px 88px', transform: `translate3d(${-drift}px, ${drift * 0.35}px, 0) rotate(-8deg)` }} /></AbsoluteFill>;
};
