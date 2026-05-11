import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
export const LedgerFlipTransition: React.FC = () => { const frame = useCurrentFrame(); const rotateY = interpolate(frame, [0, 14], [90, 0]); return <AbsoluteFill style={{ pointerEvents: 'none', perspective: 1200 }}><div style={{ position: 'absolute', inset: 0, transform: `rotateY(${rotateY}deg)`, transformOrigin: 'left center', background: 'rgba(240,207,121,0.08)' }} /></AbsoluteFill>; };
