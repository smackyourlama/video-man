import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
export const RadarSweep: React.FC<{ color?: string }> = ({ color = 'rgba(148,225,255,0.22)' }) => {
  const frame = useCurrentFrame();
  const deg = interpolate(frame % 180, [0, 180], [0, 360]);
  return <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 460, height: 460, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', position: 'relative' }}><div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${deg}deg, ${color}, transparent 42deg)` }} /></div></AbsoluteFill>;
};
