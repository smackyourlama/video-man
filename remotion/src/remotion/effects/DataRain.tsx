import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
export const DataRain: React.FC<{ color?: string }> = ({ color = 'rgba(88,246,192,0.28)' }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ overflow: 'hidden' }}>{Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: `${i * 5}%`, top: ((frame * 6 + i * 70) % 1400) - 240, color, fontFamily: 'Courier New, monospace', fontSize: 18, lineHeight: 1.15 }}>1010110<br/>SYS.LOG<br/>AUTH.FAIL<br/>PORT 443</div>)}</AbsoluteFill>;
};
