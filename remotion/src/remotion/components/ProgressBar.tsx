import React from 'react';
export const ProgressBar: React.FC<{ progress: number; color: string }> = ({ progress, color }) => <div style={{ position: 'absolute', left: 56, right: 56, top: 56, height: 4, background: 'rgba(255,255,255,0.12)' }}><div style={{ height: '100%', width: `${Math.max(0, Math.min(100, progress * 100))}%`, background: color }} /></div>;
