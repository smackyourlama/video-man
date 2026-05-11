import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
export const FloatingCards: React.FC<{ color?: string }> = ({ color = 'rgba(255,255,255,0.08)' }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>{Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ position: 'absolute', width: 240, height: 140, border: `1px solid ${color}`, background: 'rgba(255,255,255,0.03)', left: 160 + i * 300, top: 150 + (i % 2) * 320 + interpolate((frame + i * 15) % 120, [0, 120], [0, 24]), transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 3}deg)` }} />)}</AbsoluteFill>;
};
