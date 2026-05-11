import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneBase } from './SceneBase';
import { CalloutBox } from '../components/CalloutBox';
import { channelThemes, normalizeChannel } from '../styles/channelThemes';
export const ExplainerScene: React.FC<any> = ({ channel, scene, progress }) => { const theme = channelThemes[normalizeChannel(channel)]; return <SceneBase channel={channel} scene={scene} progress={progress}><AbsoluteFill style={{ justifyContent: 'center', padding: '0 100px' }}><div style={{ display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'space-between' }}><div style={{ maxWidth: 760 }}><div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1 }}>{scene.title}</div><div style={{ fontSize: 34, color: theme.palette.muted, marginTop: 24, lineHeight: 1.25 }}>{scene.narration_text}</div></div><CalloutBox title="why it matters" body={scene.keywords?.[0] || 'Core insight'} color={theme.palette.primary} /></div></AbsoluteFill></SceneBase>; };
