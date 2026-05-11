import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
export const ParticleField: React.FC<{ color?: string }> = ({ color = 'rgba(255,255,255,0.35)' }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>{Array.from({ length: 26 }).map((_, i) => <div key={i} style={{ position: 'absolute', width: 4 + (i % 3), height: 4 + (i % 3), borderRadius: '50%', background: color, left: `${(i * 17) % 100}%`, top: `${(i * 23 + frame * (0.04 + (i % 5) * 0.01)) % 100}%`, opacity: 0.4 }} />)}</AbsoluteFill>;
};
