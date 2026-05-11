import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
export const DataStreamTransition: React.FC = () => { const frame = useCurrentFrame(); return <AbsoluteFill style={{ opacity: frame < 14 ? 0.6 : 0 }}><div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(78,168,255,0.4) 50%, transparent 100%)', transform: `translateX(${(frame * 8) % 120 - 20}%)` }} /></AbsoluteFill>; };
