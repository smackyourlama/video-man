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

// --- Animated Kinetic Text ---
const AnimatedText: React.FC<{ text: string; fontColor: string; fontFamily: string }> = ({ text, fontColor, fontFamily }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // Quick pop-in animation when the text changes
    const scale = spring({ fps, frame, config: { damping: 12 }, from: 0.5, to: 1 });
    
    // Smooth fade in
    const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
            <h1 style={{
                color: fontColor,
                fontSize: '110px',
                fontFamily: fontFamily,
                textAlign: 'center',
                textShadow: '4px 4px 15px rgba(0,0,0,1)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                transform: `scale(${scale})`,
                opacity: opacity
            }}>
                {text}
            </h1>
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

                        {/* Fast-paced animated text changing every 5 seconds */}
                        <AnimatedText text={scene.overlayText} fontColor={fontColor} fontFamily={fontFamily} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
