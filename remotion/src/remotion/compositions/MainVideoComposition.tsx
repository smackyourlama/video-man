import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { buildTimeline } from '../engine/buildTimeline';
import { SceneRenderer } from '../scenes/SceneRenderer';

export const MainVideoComposition: React.FC<{ videoData: any }> = ({ videoData }) => {
  const built = buildTimeline(videoData || {});
  const { fps } = useVideoConfig();
  const total = built.timeline.reduce((sum: number, scene: any) => sum + scene.duration, 0);
  let start = 0;
  return <AbsoluteFill>{built.timeline.map((scene: any, index: number) => { const frames = Math.max(1, Math.round(scene.duration * fps)); const from = start; start += frames; return <Sequence key={scene.scene_id || index} from={from} durationInFrames={frames}><SceneRenderer channel={built.channel} scene={scene} progress={index / Math.max(1, built.timeline.length - 1)} /></Sequence>; })}</AbsoluteFill>;
};
