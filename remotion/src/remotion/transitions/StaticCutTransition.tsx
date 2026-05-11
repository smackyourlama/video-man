import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
export const StaticCutTransition: React.FC = () => { const frame = useCurrentFrame(); return frame < 6 ? <AbsoluteFill style={{ opacity: 0.2 + (frame % 2) * 0.35, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '4px 4px' }} /> : null; };
