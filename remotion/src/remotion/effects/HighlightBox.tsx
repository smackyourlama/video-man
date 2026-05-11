import React from 'react';
export const HighlightBox: React.FC<{ label: string; color: string }> = ({ label, color }) => <div style={{ padding: '10px 14px', border: `1px solid ${color}`, background: 'rgba(255,255,255,0.04)', borderRadius: 10, color, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>;
