import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig } from 'remotion';
import { channelThemes, normalizeChannel } from '../styles/channelThemes';
import { AnimatedGrid } from '../effects/AnimatedGrid';
import { NoiseOverlay } from '../effects/NoiseOverlay';
import { Scanlines } from '../effects/Scanlines';
import { ParticleField } from '../effects/ParticleField';
import { DataRain } from '../effects/DataRain';
import { FloatingCards } from '../effects/FloatingCards';
import { RadarSweep } from '../effects/RadarSweep';
import { ProgressBar } from '../components/ProgressBar';
import { LogoBug } from '../components/LogoBug';
import { LowerThird } from '../components/LowerThird';
import { BrandedFrame } from '../components/BrandedFrame';
import { SourceBadge } from '../components/SourceBadge';
import { AnimatedCaption } from '../components/AnimatedCaption';
import { FadeTransition } from '../transitions/FadeTransition';
import { SlideTransition } from '../transitions/SlideTransition';
import { GlitchTransition } from '../transitions/GlitchTransition';
import { TerminalWipeTransition } from '../transitions/TerminalWipeTransition';
import { DataStreamTransition } from '../transitions/DataStreamTransition';
import { LedgerFlipTransition } from '../transitions/LedgerFlipTransition';
import { StaticCutTransition } from '../transitions/StaticCutTransition';

const transitionMap: Record<string, React.FC<any>> = {
  fade: FadeTransition,
  slide: SlideTransition,
  glitch: GlitchTransition,
  terminalWipe: TerminalWipeTransition,
  dataStream: DataStreamTransition,
  ledgerFlip: LedgerFlipTransition,
  staticCut: StaticCutTransition,
};

export const SceneBase: React.FC<any> = ({ channel, scene, progress = 0, children }) => {
  const normalized = normalizeChannel(channel);
  const theme = channelThemes[normalized];
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const TransitionIn = transitionMap[scene.transition_in] || FadeTransition;
  const TransitionOut = transitionMap[scene.transition_out] || FadeTransition;

  return <AbsoluteFill style={{ background: `linear-gradient(160deg, ${theme.palette.background}, ${theme.palette.surface} 55%, ${theme.palette.surfaceAlt})`, color: theme.palette.text, fontFamily: theme.typography.body }}>
    {scene.audioFile ? <Audio src={scene.audioFile.startsWith('/') ? scene.audioFile : `/` + scene.audioFile} /> : null}
    <AnimatedGrid color={theme.palette.border} opacity={0.85} />
    {theme.id === 'nullsignal' ? <NoiseOverlay opacity={0.09} /> : null}
    {theme.id === 'nullsignal' || theme.id === 'terminal' ? <Scanlines opacity={0.07} /> : null}
    {scene.effects?.includes('particle_field') ? <ParticleField color={theme.palette.primary} /> : null}
    {scene.effects?.includes('data_rain') ? <DataRain color={theme.palette.primary} /> : null}
    {scene.effects?.includes('floating_cards') ? <FloatingCards color={theme.palette.border} /> : null}
    {scene.effects?.includes('noise_overlay') ? <NoiseOverlay opacity={0.08} /> : null}
    {theme.id === 'nullsignal' && scene.scene_type !== 'outro' ? <RadarSweep color={theme.palette.primary} /> : null}
    <BrandedFrame border={theme.palette.border} />
    <ProgressBar progress={progress} color={theme.palette.primary} />
    <LogoBug text={theme.logoText} color={theme.palette.primary} />
    {children}
    <LowerThird label={theme.introLabel} subtitle={scene.title} color={theme.palette.primary} muted={theme.palette.muted} />
    <SourceBadge text={scene.scene_type} color={theme.palette.muted} />
    <AnimatedCaption text={scene.narration_text} keywords={scene.keywords} channel={normalized} palette={theme.palette} />
    {frame < 14 ? <TransitionIn /> : null}
    {frame > durationInFrames - 14 ? <TransitionOut /> : null}
  </AbsoluteFill>;
};
