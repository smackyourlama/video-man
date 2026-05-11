import React from 'react';
import { useCurrentFrame } from 'remotion';
export const GlitchText: React.FC<{ text: string; color: string; style?: React.CSSProperties }> = ({ text, color, style = {} }) => {
  const frame = useCurrentFrame();
  const glitch = frame % 17 === 0;
  return <div style={{ position: 'relative', color, ...style }}>
    <span>{text}</span>
    {glitch ? <span style={{ position: 'absolute', left: 2, top: 0, color: '#ff476f', opacity: 0.55 }}>{text}</span> : null}
    {glitch ? <span style={{ position: 'absolute', left: -2, top: 0, color: '#3cf2ff', opacity: 0.55 }}>{text}</span> : null}
  </div>;
};
