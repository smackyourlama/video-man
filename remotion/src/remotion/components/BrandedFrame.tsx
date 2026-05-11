import React from 'react';
export const BrandedFrame: React.FC<{ border: string }> = ({ border }) => <><div style={{ position: 'absolute', inset: 36, border: `1px solid ${border}` }} /><div style={{ position: 'absolute', inset: 52, border: `1px solid rgba(255,255,255,0.04)` }} /></>;
