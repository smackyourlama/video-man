import React from 'react';
import { Composition, getInputProps } from 'remotion';
import { MainVideoComposition } from './compositions/MainVideoComposition';
import { ShortVideoComposition } from './compositions/ShortVideoComposition';
import { buildTimeline } from './engine/buildTimeline';

export const VideoRoot = () => {
  const inputProps = getInputProps() as any;
  const built = buildTimeline(inputProps?.videoData || inputProps || {});
  const totalSeconds = built.timeline.reduce((sum: number, scene: any) => sum + scene.duration, 0) || built.duration_seconds || 45;
  const isShort = built.video_type === 'short_form';
  const width = isShort ? 1080 : 1920;
  const height = isShort ? 1920 : 1080;
  const durationInFrames = Math.max(30, Math.round(totalSeconds * 30));
  return <>
    <Composition id="Documentary" component={MainVideoComposition} durationInFrames={durationInFrames} fps={30} width={1920} height={1080} defaultProps={{ videoData: built }} />
    <Composition id="MainVideo" component={MainVideoComposition} durationInFrames={durationInFrames} fps={30} width={1920} height={1080} defaultProps={{ videoData: built }} />
    <Composition id="ShortVideo" component={ShortVideoComposition} durationInFrames={durationInFrames} fps={30} width={width} height={height} defaultProps={{ videoData: built }} />
  </>;
};
