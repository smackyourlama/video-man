import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
export const FadeTransition: React.FC<{ color?: string }> = ({ color = 'black' }) => { const frame = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); const opacity = frame < 10 ? interpolate(frame, [0,10],[1,0]) : frame > durationInFrames - 10 ? interpolate(frame,[durationInFrames - 10,durationInFrames],[0,1]) : 0; return <AbsoluteFill style={{ backgroundColor: color, opacity }} />; };
