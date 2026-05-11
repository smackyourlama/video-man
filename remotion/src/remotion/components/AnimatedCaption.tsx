import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { captionPlanner } from '../engine/captionPlanner';
import { GlitchText } from '../effects/GlitchText';

export const AnimatedCaption: React.FC<{ text: string; keywords?: string[]; channel: string; palette: any }> = ({ text, keywords = [], channel, palette }) => {
  const frame = useCurrentFrame();
  const captions = captionPlanner({ text, keywords });
  const segment = Math.max(18, Math.floor(70 / Math.max(captions.length, 1)));
  const activeIndex = Math.min(captions.length - 1, Math.floor(frame / segment));
  const active = captions[activeIndex];
  if (!active) return null;
  const local = frame % segment;
  const opacity = interpolate(local, [0, 4, segment - 4, segment], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(local, [0, segment], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const caption = <div style={{ color: palette.text, fontSize: channel === 'NullSignal' ? 42 : 46, lineHeight: 1.05, fontWeight: 800, textAlign: 'center', textTransform: channel === 'Operator Logic' ? 'uppercase' : 'none' }}>{active.text}</div>;
  return <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 160, pointerEvents: 'none' }}><div style={{ opacity, transform: `translateY(${y}px)`, maxWidth: '70%', background: 'rgba(0,0,0,0.42)', padding: '12px 18px', borderRadius: 14, border: `1px solid ${palette.border}` }}>{active.highlight && (channel === 'Terminalecho' || channel === 'NullSignal') ? <GlitchText text={active.text} color={palette.text} style={{ fontSize: channel === 'NullSignal' ? 42 : 46, fontWeight: 800, lineHeight: 1.05, textAlign: 'center' }} /> : caption}</div></AbsoluteFill>;
};
