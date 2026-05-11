import React from 'react';
import { AbsoluteFill } from 'remotion';
export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => <AbsoluteFill style={{ opacity, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)' }} />;
