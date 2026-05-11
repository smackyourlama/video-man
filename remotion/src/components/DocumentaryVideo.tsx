import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig, useCurrentFrame, interpolate, staticFile, spring } from 'remotion';

const paletteForTone = (tone?: string) => {
    if (tone && tone.includes('ominous')) {
        return {
            primary: '#00FF85',
            secondary: '#6C5CE7',
            accent: '#00D1FF',
            text: '#F3F8FF',
            muted: 'rgba(243,248,255,0.45)',
            font: 'Inter, Arial, sans-serif',
            mono: 'Courier New, monospace',
        };
    }

    return {
        primary: '#FFFFFF',
        secondary: '#7F5AF0',
        accent: '#2CB67D',
        text: '#F8FAFC',
        muted: 'rgba(248,250,252,0.45)',
        font: 'Inter, Arial, sans-serif',
        mono: 'Courier New, monospace',
    };
};

const splitNarrativeIntoBursts = (scene: any): string[] => {
    const overlay = String(scene?.overlayText || '').trim();
    const narrative = String(scene?.narrative || '').replace(/[.,!?;:]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = narrative ? narrative.split(' ') : [];
    const bursts: string[] = [];

    if (overlay) bursts.push(overlay);

    for (let i = 0; i < words.length; i += 4) {
        const chunk = words.slice(i, i + 4).join(' ').trim();
        if (chunk && !bursts.includes(chunk)) bursts.push(chunk);
    }

    return bursts.slice(0, 4);
};

const DataGridBg: React.FC<{ palette: ReturnType<typeof paletteForTone> }> = ({ palette }) => {
    const frame = useCurrentFrame();
    const drift = interpolate(frame % 240, [0, 240], [0, 180]);
    return (
        <AbsoluteFill
            style={{
                background: `radial-gradient(circle at 20% 20%, rgba(108,92,231,0.35), transparent 35%), radial-gradient(circle at 80% 30%, rgba(0,209,255,0.22), transparent 30%), linear-gradient(135deg, #050816, #090B12 55%, #040507)`,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: -200,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '90px 90px',
                    transform: `translate3d(${-drift}px, ${drift * 0.35}px, 0) rotate(-8deg) scale(1.2)`,
                    opacity: 0.4,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.65))`,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    left: 110,
                    bottom: 110,
                    width: 380,
                    height: 220,
                    border: `1px solid ${palette.muted}`,
                    boxShadow: `0 0 40px rgba(0,209,255,0.12)`,
                    background: 'rgba(255,255,255,0.025)',
                    backdropFilter: 'blur(3px)',
                }}
            />
        </AbsoluteFill>
    );
};

const OrbitalBg: React.FC<{ palette: ReturnType<typeof paletteForTone> }> = ({ palette }) => {
    const frame = useCurrentFrame();
    const spin = frame * 0.7;
    const pulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.85, 1.15]);
    return (
        <AbsoluteFill style={{ background: 'linear-gradient(160deg, #03040A, #10131D 52%, #05070D)' }}>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at center, rgba(108,92,231,0.15), transparent 28%), radial-gradient(circle at center, rgba(0,255,133,0.08), transparent 45%)`,
                }}
            />
            {[0, 1, 2].map((ring) => (
                <div
                    key={ring}
                    style={{
                        position: 'absolute',
                        width: 420 + ring * 180,
                        height: 420 + ring * 180,
                        left: '50%',
                        top: '50%',
                        marginLeft: -(210 + ring * 90),
                        marginTop: -(210 + ring * 90),
                        borderRadius: '50%',
                        border: `1px solid ${ring === 1 ? palette.primary : palette.muted}`,
                        transform: `rotate(${spin * (ring % 2 === 0 ? 1 : -1)}deg) scale(${pulse})`,
                        opacity: 0.35 - ring * 0.08,
                        boxShadow: ring === 1 ? `0 0 50px rgba(0,255,133,0.12)` : 'none',
                    }}
                />
            ))}
            <div
                style={{
                    position: 'absolute',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: palette.primary,
                    boxShadow: `0 0 30px ${palette.primary}`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(${Math.cos(frame / 16) * 220}px, ${Math.sin(frame / 16) * 120}px)`,
                }}
            />
        </AbsoluteFill>
    );
};

const ScanlineBg: React.FC<{ palette: ReturnType<typeof paletteForTone> }> = ({ palette }) => {
    const frame = useCurrentFrame();
    const sweep = interpolate(frame % 180, [0, 180], [-180, 1080]);
    return (
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, #020303, #0C1116 58%, #020303)', overflow: 'hidden' }}>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 2px, transparent 2px, transparent 6px)`,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: sweep,
                    height: 140,
                    background: `linear-gradient(180deg, transparent, rgba(0,255,133,0.12), transparent)`,
                    filter: 'blur(8px)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 80,
                    border: `1px solid rgba(255,255,255,0.08)`,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    right: 120,
                    top: 120,
                    width: 340,
                    height: 340,
                    borderRadius: '50%',
                    border: `1px solid ${palette.muted}`,
                    boxShadow: `0 0 60px rgba(0,255,133,0.08)`,
                }}
            />
        </AbsoluteFill>
    );
};

const getBackground = (theme: string, index: number, palette: ReturnType<typeof paletteForTone>) => {
    const normalized = String(theme || '').toLowerCase();
    if (normalized.includes('wire') || normalized.includes('network')) return <OrbitalBg palette={palette} />;
    if (normalized.includes('glitch') || normalized.includes('scan') || normalized.includes('code')) return <ScanlineBg palette={palette} />;
    return index % 2 === 0 ? <DataGridBg palette={palette} /> : <OrbitalBg palette={palette} />;
};

const CinematicFrame: React.FC<{ title: string; sceneIndex: number; palette: ReturnType<typeof paletteForTone> }> = ({ title, sceneIndex, palette }) => {
    const frame = useCurrentFrame();
    const reveal = spring({ fps: 30, frame, config: { damping: 18, stiffness: 120 } });

    return (
        <AbsoluteFill>
            <div style={{ position: 'absolute', inset: 42, border: '1px solid rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', top: 44, left: 56, color: palette.muted, fontFamily: palette.mono, fontSize: 20, letterSpacing: '0.25em' }}>
                NULL SIGNAL // SEGMENT {String(sceneIndex + 1).padStart(2, '0')}
            </div>
            <div style={{ position: 'absolute', top: 44, right: 56, color: palette.muted, fontFamily: palette.mono, fontSize: 18, letterSpacing: '0.18em' }}>
                ANALYSIS FEED
            </div>
            <div
                style={{
                    position: 'absolute',
                    left: 72,
                    bottom: 70,
                    width: 520,
                    padding: '18px 22px',
                    background: 'rgba(4,8,18,0.6)',
                    borderLeft: `4px solid ${palette.primary}`,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.28)',
                    transform: `translateY(${interpolate(reveal, [0, 1], [18, 0])}px)`,
                    opacity: interpolate(reveal, [0, 1], [0, 1]),
                }}
            >
                <div style={{ color: palette.muted, fontSize: 17, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: palette.mono, marginBottom: 10 }}>
                    topic focus
                </div>
                <div style={{ color: palette.text, fontSize: 36, lineHeight: 1.1, fontWeight: 700, fontFamily: palette.font }}>
                    {title}
                </div>
            </div>
        </AbsoluteFill>
    );
};

const BurstText: React.FC<{ scene: any; palette: ReturnType<typeof paletteForTone> }> = ({ scene, palette }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const bursts = splitNarrativeIntoBursts(scene);
    const totalFrames = Math.max(1, Math.round(scene.durationSeconds * fps));
    const showWindow = Math.floor(totalFrames * 0.42);

    if (!bursts.length || frame > showWindow) return null;

    const burstFrames = Math.max(12, Math.floor(showWindow / bursts.length));
    const activeIndex = Math.min(bursts.length - 1, Math.floor(frame / burstFrames));
    const localFrame = frame % burstFrames;
    const text = bursts[activeIndex] || '';
    const opacity = interpolate(localFrame, [0, 4, burstFrames - 5, burstFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const y = interpolate(localFrame, [0, burstFrames], [20, -6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const scale = spring({ fps, frame: localFrame, config: { damping: 14, stiffness: 160 }, from: 0.94, to: 1 });

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
            <div
                style={{
                    maxWidth: '74%',
                    padding: '14px 22px',
                    background: 'rgba(0,0,0,0.34)',
                    border: `1px solid rgba(255,255,255,0.12)`,
                    backdropFilter: 'blur(6px)',
                    transform: `translateY(${y}px) scale(${scale})`,
                    opacity,
                }}
            >
                <div
                    style={{
                        color: palette.text,
                        textAlign: 'center',
                        fontSize: 74,
                        lineHeight: 0.98,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 800,
                        fontFamily: palette.font,
                        textShadow: '0 6px 24px rgba(0,0,0,0.6)',
                    }}
                >
                    {text}
                </div>
            </div>
        </AbsoluteFill>
    );
};

const AmbientDetails: React.FC<{ palette: ReturnType<typeof paletteForTone>; scene: any }> = ({ palette, scene }) => {
    const frame = useCurrentFrame();
    const bars = new Array(12).fill(0);

    return (
        <AbsoluteFill>
            <div style={{ position: 'absolute', right: 84, bottom: 72, width: 330, padding: '16px 18px', background: 'rgba(5,10,20,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: palette.muted, fontFamily: palette.mono, fontSize: 16, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>signal map</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 74 }}>
                    {bars.map((_, i) => {
                        const value = 24 + Math.abs(Math.sin((frame + i * 7) / 11)) * 48;
                        return <div key={i} style={{ width: 14, height: value, background: i % 3 === 0 ? palette.primary : 'rgba(255,255,255,0.24)' }} />;
                    })}
                </div>
            </div>
            <div style={{ position: 'absolute', left: 76, top: 110, color: palette.muted, fontFamily: palette.mono, fontSize: 18, letterSpacing: '0.18em' }}>
                {String(scene.visualTheme || 'VISUAL MODE').toUpperCase()}
            </div>
        </AbsoluteFill>
    );
};

export const DocumentaryVideo: React.FC<{ videoData: any }> = ({ videoData }) => {
    const { fps } = useVideoConfig();

    if (!videoData || !videoData.scenes) {
        return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
    }

    const { scenes, channelTone, title } = videoData;
    const palette = paletteForTone(channelTone);
    let currentStartFrame = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {scenes.map((scene: any, index: number) => {
                const durationFrames = Math.max(1, Math.round(scene.durationSeconds * fps));
                const startFrame = currentStartFrame;
                currentStartFrame += durationFrames;

                return (
                    <Sequence key={index} from={startFrame} durationInFrames={durationFrames}>
                        {scene.audioFile && <Audio src={staticFile(scene.audioFile)} />}
                        {getBackground(scene.visualTheme || '', index, palette)}
                        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.52))' }} />
                        <CinematicFrame title={scene.overlayText || title || scene.narrative || 'Null Signal'} sceneIndex={index} palette={palette} />
                        <AmbientDetails palette={palette} scene={scene} />
                        <BurstText scene={scene} palette={palette} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
