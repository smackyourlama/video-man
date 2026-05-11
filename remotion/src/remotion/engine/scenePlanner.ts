import { transitionSelector } from './transitionSelector';
import { visualStyleSelector } from './visualStyleSelector';

export type ScriptSection = {
  section_type?: string;
  text?: string;
  emotional_intensity?: 'low'|'medium'|'high';
  keywords?: string[];
  duration?: number;
  overlayText?: string;
  visualTheme?: string;
  narrative?: string;
  audioFile?: string;
  title?: string;
};

export type TimelineScene = {
  scene_id: string;
  scene_type: string;
  start: number;
  duration: number;
  title: string;
  narration_text: string;
  visual_intent: string;
  transition_in: string;
  transition_out: string;
  effects: string[];
  sceneComponent: string;
  keywords: string[];
  emotionalIntensity: 'low'|'medium'|'high';
  audioFile?: string;
};

const inferSceneType = (text: string, keywords: string[], index: number, total: number) => {
  const joined = `${text} ${keywords.join(' ')}`.toLowerCase();
  if (index === 0) return 'hook';
  if (index === total - 1) return 'outro';
  if (/step|rule|checklist|must|never|avoid/.test(joined)) return 'checklist';
  if (/percent|million|billion|score|growth|increase|drop|cost|apr|rate/.test(joined)) return 'stats';
  if (/quote|said|remember this|the point is/.test(joined)) return 'quote';
  if (/because|pipeline|flow|path|how it works|through/.test(joined)) return 'diagram';
  return 'explainer';
};

export const scenePlanner = ({ channel, videoTitle, topic, scriptSections = [], narrationTiming = [], targetDuration = 60, videoType = 'long_form', affiliateMentions = [] }: any): TimelineScene[] => {
  const sections = scriptSections.length ? scriptSections : [];
  const lastTransitions: any[] = [];
  let current = 0;
  const scenes: TimelineScene[] = [];
  const minDur = videoType === 'short_form' ? 2 : 6;
  const maxDur = videoType === 'short_form' ? 5 : 14;

  sections.forEach((section: ScriptSection, index: number) => {
    const text = section.text || section.narrative || '';
    const keywords = section.keywords || [];
    const scene_type = section.section_type || inferSceneType(text, keywords, index, sections.length);
    const duration = Math.max(minDur, Math.min(maxDur, section.duration || narrationTiming[index] || (videoType === 'short_form' ? 3.5 : Math.max(minDur, Math.min(maxDur, text.split(/\s+/).length / 2.6)))));
    const visualPlan = visualStyleSelector({ channel, sceneType: scene_type, text, keywords, intensity: section.emotional_intensity || 'medium' });
    const transition_in = transitionSelector({ channel, keywords, index, lastTransitions });
    lastTransitions.push(transition_in as any);
    const transition_out = transitionSelector({ channel, keywords: [...keywords, topic], index: index + 1, lastTransitions });
    scenes.push({
      scene_id: `scene_${String(index + 1).padStart(3, '0')}`,
      scene_type,
      start: current,
      duration,
      title: section.title || section.overlayText || text.split(/[.!?]/)[0] || videoTitle,
      narration_text: text,
      visual_intent: section.visualTheme || `${channel} ${scene_type} for ${topic}`,
      transition_in,
      transition_out,
      effects: visualPlan.effects,
      sceneComponent: visualPlan.sceneComponent,
      keywords,
      emotionalIntensity: visualPlan.emotionalIntensity,
      audioFile: section.audioFile,
    });
    current += duration;
  });

  affiliateMentions.forEach((item: any, affiliateIndex: number) => {
    scenes.splice(Math.max(1, scenes.length - 1), 0, {
      scene_id: `scene_affiliate_${affiliateIndex + 1}`,
      scene_type: 'affiliate',
      start: 0,
      duration: videoType === 'short_form' ? 3 : 8,
      title: item.tool_name,
      narration_text: item.reason,
      visual_intent: 'premium affiliate tool recommendation',
      transition_in: 'fade',
      transition_out: 'slide',
      effects: ['floating_cards'],
      sceneComponent: 'AffiliateCardScene',
      keywords: [item.tool_name],
      emotionalIntensity: 'medium',
    });
  });

  if (!scenes.length) {
    scenes.push({
      scene_id: 'scene_001', scene_type: 'hook', start: 0, duration: targetDuration, title: videoTitle, narration_text: topic,
      visual_intent: `${channel} hook`, transition_in: 'fade', transition_out: 'fade', effects: ['particle_field'], sceneComponent: 'HookScene', keywords: [], emotionalIntensity: 'medium'
    });
  }

  return scenes.map((scene, idx) => ({ ...scene, start: scenes.slice(0, idx).reduce((sum, item) => sum + item.duration, 0) }));
};
