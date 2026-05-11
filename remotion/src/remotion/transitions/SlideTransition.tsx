import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
export const SlideTransition: React.FC<{ color?: string }> = ({ color = 'rgba(255,255,255,0.08)' }) => { const frame = useCurrentFrame(); const x = frame < 12 ? interpolate(frame,[0,12],[0,100]) : 100; return <AbsoluteFill style={{ pointerEvents: 'none' }}><div style={{ position: 'absolute', inset: 0, transform: `translateX(${x}%)`, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} /></AbsoluteFill>; };
