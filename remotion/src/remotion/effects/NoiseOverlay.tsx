import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
export const NoiseOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  const flicker = opacity + ((frame % 7) / 7) * 0.03;
  return <AbsoluteFill style={{ opacity: flicker, mixBlendMode: 'screen', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '5px 5px' }} />;
};
