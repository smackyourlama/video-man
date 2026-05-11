import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
export const GlitchTransition: React.FC = () => { const frame = useCurrentFrame(); const show = frame < 8 && frame % 2 === 0; return show ? <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(255,0,90,0.22), rgba(0,240,255,0.18))', mixBlendMode: 'screen' }} /> : null; };
