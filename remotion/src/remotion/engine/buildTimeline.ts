import { scenePlanner } from './scenePlanner';
import { normalizeChannel } from '../styles/channelThemes';

export const buildTimeline = (input: any) => {
  const channel = normalizeChannel(input?.channel || input?.channelName || input?.videoData?.channel || input?.videoData?.channelName);
  const videoType = input?.video_type || input?.videoData?.video_type || 'long_form';

  if (input?.timeline) return { ...input, channel, video_type: videoType, timeline: input.timeline };

  if (input?.videoData?.timeline) return { ...input.videoData, channel, video_type: videoType, timeline: input.videoData.timeline };

  const sections = input?.script_sections || input?.videoData?.script_sections || input?.videoData?.scenes?.map((scene: any) => ({
    section_type: 'explainer',
    text: scene.narrative,
    overlayText: scene.overlayText,
    visualTheme: scene.visualTheme,
    duration: scene.durationSeconds,
    audioFile: scene.audioFile,
    keywords: String(scene.overlayText || scene.narrative || '').toLowerCase().split(/\s+/).slice(0, 4),
  })) || [];

  const targetDuration = input?.duration_seconds || input?.videoData?.totalDurationSeconds || sections.reduce((sum: number, s: any) => sum + (s.duration || 0), 0) || 45;

  const timeline = scenePlanner({
    channel,
    videoTitle: input?.video_title || input?.videoData?.title || input?.title || 'VideoMan Preview',
    topic: input?.topic || input?.videoData?.topic || input?.videoData?.title || 'topic',
    scriptSections: sections,
    narrationTiming: sections.map((s: any) => s.duration).filter(Boolean),
    targetDuration,
    videoType,
    affiliateMentions: input?.affiliate_mentions || input?.videoData?.affiliate_mentions || [],
  });

  return {
    channel,
    video_title: input?.video_title || input?.videoData?.title || input?.title || 'VideoMan Preview',
    topic: input?.topic || input?.videoData?.topic || 'topic',
    video_type: videoType,
    duration_seconds: targetDuration,
    timeline,
  };
};
