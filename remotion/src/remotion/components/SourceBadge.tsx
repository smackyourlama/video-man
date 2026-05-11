import React from 'react';
export const SourceBadge: React.FC<{ text: string; color: string }> = ({ text, color }) => <div style={{ position: 'absolute', right: 58, bottom: 56, color, fontSize: 16, padding: '10px 12px', border: `1px solid ${color}`, background: 'rgba(0,0,0,0.34)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{text}</div>;
