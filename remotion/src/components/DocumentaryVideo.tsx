import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig, useCurrentFrame, interpolate, staticFile, spring } from 'remotion';

// --- Programmatic Visual Backgrounds ---

const DarkGradientBg: React.FC = () => {
    const frame = useCurrentFrame();
    const pos = interpolate(frame % 300, [0, 150, 300], [0, 50, 0]);
    return (
        <AbsoluteFill style={{ 
            background: `radial-gradient(circle at ${50 + pos}% 50%, #1a1a2e, #0f0c29)`
        }} />
    );
};

const GlitchBg: React.FC = () => {
    const frame = useCurrentFrame();
    const isGlitch = frame % 15 === 0;
    return (
        <AbsoluteFill style={{ 
            backgroundColor: isGlitch ? '#222' : '#000',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 3px, rgba(0,255,0,0.1) 4px)`
        }}>
            {isGlitch && (
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '80%', height: '10px', backgroundColor: 'red', opacity: 0.5 }} />
            )}
        </AbsoluteFill>
    );
};

const CodeRainBg: React.FC = () => {
    const frame = useCurrentFrame();
    const offset = (frame * 5) % 1080;
    return (
        <AbsoluteFill style={{ backgroundColor: '#000', color: '#0f0', fontFamily: 'monospace', fontSize: '20px', overflow: 'hidden', padding: 20 }}>
            {Array.from({length: 40}).map((_, i) => (
                <div key={i} style={{ position: 'absolute', left: `${(i / 40) * 100}%`, top: (i % 2 === 0 ? offset : -offset) + (i*50) }}>
                    01011001<br/>10100101<br/>11100011<br/>00011100
                </div>
            ))}
        </AbsoluteFill>
    );
};

const WireframeBg: React.FC = () => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame % 150, [0, 75, 150], [1, 1.1, 1]);
    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                width: '800px', height: '800px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: `scale(${scale})`,
                boxShadow: '0 0 50px rgba(0,255,255,0.1)'
            }} />
        </AbsoluteFill>
    );
};

const getBackground = (theme: string) => {
    if (theme.includes('glitch')) return <GlitchBg />;
    if (theme.includes('code')) return <CodeRainBg />;
    if (theme.includes('wireframe')) return <WireframeBg />;
    return <DarkGradientBg />; // fallback
};

const splitNarrativeIntoBursts = (scene: any): string[] => {
    const overlay = String(scene?.overlayText || '').trim();
    const narrative = String(scene?.narrative || '').replace(/[.,!?;:]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = narrative ? narrative.split(' ') : [];

    const bursts: string[] = [];
    if (overlay) bursts.push(overlay);

    for (let i = 0; i < words.length; i += 2) {
        const chunk = words.slice(i, i + 2).join(' ').trim();
        if (chunk && !bursts.includes(chunk)) bursts.push(chunk);
    }

    return bursts.slice(0, 6);
};

// --- Animated Kinetic Text ---
const AnimatedText: React.FC<{ scene: any; fontColor: string; fontFamily: string }> = ({ scene, fontColor, fontFamily }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const bursts = splitNarrativeIntoBursts(scene);
    const burstFrames = Math.max(10, Math.floor((scene.durationSeconds * fps) / Math.max(bursts.length, 1)));
    const activeIndex = Math.min(bursts.length - 1, Math.floor(frame / burstFrames));
    const text = bursts[Math.max(0, activeIndex)] || scene.overlayText || scene.narrative || '';
    const localFrame = frame % burstFrames;

    const scale = spring({ fps, frame: localFrame, config: { damping: 12 }, from: 0.7, to: 1 });
    const opacity = interpolate(localFrame, [0, 4, burstFrames - 6, burstFrames - 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const y = interpolate(localFrame, [0, burstFrames - 1], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '90px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', maxWidth: '88%' }}>
                <h1 style={{
                    color: fontColor,
                    fontSize: '110px',
                    lineHeight: 0.95,
                    fontFamily: fontFamily,
                    textAlign: 'center',
                    textShadow: '4px 4px 15px rgba(0,0,0,1)',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    letterSpacing: '0.04em',
                    transform: `translateY(${y}px) scale(${scale})`,
                    opacity: opacity,
                    margin: 0
                }}>
                    {text}
                </h1>
                {bursts.length > 1 && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', opacity: 0.75 }}>
                        {bursts.slice(Math.max(0, activeIndex - 1), Math.min(bursts.length, activeIndex + 2)).map((burst: string, idx: number) => (
                            <span
                                key={`${burst}-${idx}`}
                                style={{
                                    color: idx === 1 ? fontColor : 'rgba(255,255,255,0.55)',
                                    fontFamily,
                                    fontSize: '22px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.18em'
                                }}
                            >
                                {burst}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </AbsoluteFill>
    );
};


export const DocumentaryVideo: React.FC<{ videoData: any }> = ({ videoData }) => {
    const { fps } = useVideoConfig();

    if (!videoData || !videoData.scenes) {
        return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
    }

    const { scenes, channelTone } = videoData;

    let fontColor = "white";
    let fontFamily = "Arial, sans-serif";
    if (channelTone && channelTone.includes("ominous")) {
        fontColor = "#00FF41"; 
        fontFamily = "Courier New, monospace";
    }

    let currentStartFrame = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {scenes.map((scene: any, index: number) => {
                const durationFrames = Math.round(scene.durationSeconds * fps);
                const startFrame = currentStartFrame;
                currentStartFrame += durationFrames;

                return (
                    <Sequence key={index} from={startFrame} durationInFrames={durationFrames}>
                        {/* Audio specific to this ~5s scene chunk */}
                        {scene.audioFile && <Audio src={staticFile(scene.audioFile)} />}
                        
                        {/* Render Programmatic Background */}
                        {getBackground(scene.visualTheme || "")}
                        
                        {/* Dark Overlay to make text pop */}
                        <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />

                        {/* Faster animated text bursts inside each scene */}
                        <AnimatedText scene={scene} fontColor={fontColor} fontFamily={fontFamily} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
