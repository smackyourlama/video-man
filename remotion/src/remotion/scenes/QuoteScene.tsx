import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneBase } from './SceneBase';
import { channelThemes, normalizeChannel } from '../styles/channelThemes';
export const QuoteScene: React.FC<any> = ({ channel, scene, progress }) => { const theme = channelThemes[normalizeChannel(channel)]; const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const scale=interpolate(frame,[0,durationInFrames],[1,1.06]); return <SceneBase channel={channel} scene={scene} progress={progress}><AbsoluteFill style={{ justifyContent:'center', alignItems:'center', padding:180, transform:`scale(${scale})` }}><div style={{ maxWidth:'72%', textAlign:'center', fontSize:86, lineHeight:1.02, fontWeight:900 }}>“{scene.narration_text}”</div></AbsoluteFill></SceneBase>; };
