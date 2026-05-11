import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
export const TerminalWipeTransition: React.FC = () => { const frame = useCurrentFrame(); const y = interpolate(frame, [0, 14], [-100, 100]); return <AbsoluteFill style={{ pointerEvents: 'none' }}><div style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 100, background: 'linear-gradient(180deg, transparent, rgba(88,246,192,0.4), transparent)' }} /></AbsoluteFill>; };
