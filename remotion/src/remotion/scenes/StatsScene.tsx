import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneBase } from './SceneBase';
import { NumberTicker } from '../effects/NumberTicker';
import { channelThemes, normalizeChannel } from '../styles/channelThemes';
export const StatsScene: React.FC<any> = ({ channel, scene, progress }) => { const theme = channelThemes[normalizeChannel(channel)]; return <SceneBase channel={channel} scene={scene} progress={progress}><AbsoluteFill style={{ justifyContent:'center', padding:'120px 100px' }}><div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24 }}>{[72,38,4].map((v,i)=><div key={i} style={{ padding:'30px', background:'rgba(255,255,255,0.04)', border:`1px solid ${theme.palette.border}` }}><div style={{ color: theme.palette.muted, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:18 }}>{scene.keywords?.[i] || `Metric ${i+1}`}</div><NumberTicker value={v * (i===2 ? 10 : 1)} suffix={i===1?'%':''} style={{ fontSize:74, fontWeight:900, color: i===1 ? theme.palette.secondary : theme.palette.primary }} /></div>)}</div></AbsoluteFill></SceneBase>; };
