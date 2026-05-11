import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneBase } from './SceneBase';
import { channelThemes, normalizeChannel } from '../styles/channelThemes';
export const HookScene: React.FC<any> = ({ channel, scene, progress }) => {
  const theme = channelThemes[normalizeChannel(channel)];
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1]);
  return <SceneBase channel={channel} scene={scene} progress={progress}><AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 120, transform: `scale(${scale})` }}><div style={{ maxWidth: '78%', textAlign: 'center' }}><div style={{ color: theme.palette.primary, fontSize: 24, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 18 }}>{theme.introLabel}</div><div style={{ fontSize: 110, lineHeight: 0.92, fontWeight: 900, textTransform: 'uppercase' }}>{scene.title}</div><div style={{ marginTop: 24, color: theme.palette.muted, fontSize: 34, lineHeight: 1.2 }}>{scene.narration_text}</div></div></AbsoluteFill></SceneBase>;
};
