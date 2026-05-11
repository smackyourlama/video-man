import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneBase } from './SceneBase';
import { NumberTicker } from '../effects/NumberTicker';
import { channelThemes, normalizeChannel } from '../styles/channelThemes';
export const FinanceLedgerScene: React.FC<any> = ({ channel, scene, progress }) => { const theme = channelThemes[normalizeChannel(channel)]; const rows=[['Revenue',42000],['Debt',13000],['Margin',38],['APR',12]]; return <SceneBase channel={channel} scene={scene} progress={progress}><AbsoluteFill style={{ justifyContent:'center', padding:'120px 150px' }}><div style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${theme.palette.border}` }}>{rows.map((r,i)=><div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto', padding:'22px 28px', borderTop:i?`1px solid ${theme.palette.border}`:'none' }}><div style={{ fontSize:30 }}>{r[0]}</div><NumberTicker value={Number(r[1])} prefix={i<2?'$':''} suffix={i===2||i===3?'%':''} style={{ fontSize:34, fontWeight:800, color:i===1?theme.palette.danger:theme.palette.primary }} /></div>)}</div></AbsoluteFill></SceneBase>; };
