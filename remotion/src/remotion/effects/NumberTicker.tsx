import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { motionPresets } from '../styles/motionPresets';
export const NumberTicker: React.FC<{ value: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ value, prefix = '', suffix = '', style = {} }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const current = motionPresets.numberTicker(frame, Math.min(durationInFrames, 48), value);
  return <div style={style}>{prefix}{current.toLocaleString()}{suffix}</div>;
};
