const fs = require('fs');
const path = require('path');
const { createThumbnail, uploadYouTubeVideo, authorizeYouTube } = require('./video_processor');
const { generateScriptChunked, generateThumbnailAssets } = require('./ai_chunking');
const { saveVideoHistory } = require('./history_manager');
const { execSync } = require('child_process');
const { renderRemotionVideo } = require('./render_remotion');

const getAudioDuration = (file) => {
    try {
        const ffmpegPath = '/data/.openclaw/workspace/video-man/node_modules/@ffmpeg-installer/linux-x64/ffmpeg';
        const out = execSync(`${ffmpegPath} -i "${file}" 2>&1 | grep "Duration"`, {encoding: 'utf8'});
        const match = out.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
        if(match) {
            return parseInt(match[1])*3600 + parseInt(match[2])*60 + parseFloat(match[3]);
        }
    } catch(e) {
        console.error("FFmpeg duration parsing failed:", e.message);
    }
    return 10; // Fallback 10 seconds
};

async function processVideoWorkflow(payloadString) {
    let payload;
    try {
        payload = JSON.parse(payloadString);
    } catch(e) {
        payload = { topic: payloadString };
    }

    if (!payload.topic) throw new Error('Topic is required');

    try {
        console.log(`\n--- Starting workflow for payload: "${payloadString}" ---`);
        await authorizeYouTube();

        // 1. Generate Chunked Scenes
        const { title, description, scenes } = await generateScriptChunked(payload);
        const channelName = payload.channelName || "Operator Logic";
        console.log(`\nGenerated Title: ${title}`);
        console.log(`Target Channel: ${channelName}`);
        console.log(`Generated ${scenes.length} programmatic scenes.`);

        // Move assets to public directory for Remotion to access
        const remotionPublicDir = path.join(__dirname, 'remotion', 'public');
        if (!fs.existsSync(remotionPublicDir)) fs.mkdirSync(remotionPublicDir, { recursive: true });

        // 2. Generate TTS Audio per Scene
        console.log("[Pipeline] Invoking locked Chatterbox voice service for each scene...");
        let totalDuration = 0;
        const processedScenes = [];

        for (let i = 0; i < scenes.length; i++) {
            const scene = scenes[i];
            const textPath = path.join(__dirname, 'uploads', `scene-${i}-${Date.now()}.txt`);
            fs.writeFileSync(textPath, scene.narrative);
            
            const audioFilename = `audio-scene-${i}-${Date.now()}.wav`;
            const audioPath = path.join(__dirname, 'uploads', audioFilename);
            
            console.log(`[TTS] Generating locked audio for ${channelName} Scene ${i+1}/${scenes.length}...`);
            execSync(
                `python3 src/audio/chatterbox_voice_service.py --channel ${JSON.stringify(channelName)} --text-file ${JSON.stringify(textPath)} --output ${JSON.stringify(audioPath)} --segment-label ${JSON.stringify(`scene_${i + 1}`)}`,
                { stdio: 'pipe' }
            );

            const durationSecs = getAudioDuration(audioPath);
            console.log(`[TTS] Scene ${i+1} duration: ${durationSecs}s`);

            // Copy to Remotion public dir
            fs.copyFileSync(audioPath, path.join(remotionPublicDir, audioFilename));

            processedScenes.push({
                index: i,
                audioFile: audioFilename, // Relative to public/ for Remotion
                durationSeconds: durationSecs,
                visualTheme: scene.visualTheme,
                overlayText: scene.overlayText,
                narrative: scene.narrative // Pass narrative for kinetic typography
            });

            totalDuration += durationSecs;
        }

        console.log(`[Pipeline] All scenes generated. Total video length: ${totalDuration}s`);

        // 3. Generate Thumbnail
        const { thumbnailText, thumbnailUrl } = await generateThumbnailAssets(payload, title);
        let finalThumbPath = null;
        if (thumbnailUrl) {
            const { downloadFile } = require('./video_processor');
            const rawThumb = await downloadFile(thumbnailUrl, `raw-thumb-${Date.now()}.jpg`);
            finalThumbPath = await createThumbnail(rawThumb, thumbnailText);
        }

        // 4. Render Remotion Video (Programmatic)
        const videoDataPayload = {
            channelTone: payload.tone,
            totalDurationSeconds: totalDuration,
            scenes: processedScenes
        };

        const finalVideoPath = path.join(__dirname, 'uploads', `final-remotion-${Date.now()}.mp4`);
        await renderRemotionVideo(videoDataPayload, finalVideoPath);

        // 5. Upload to YouTube
        if (payload.action === "generate_only") {
            console.log("Flag 'generate_only' detected. Skipping YouTube upload. Video saved locally.");
            return;
        }

        const youtubeUrl = await uploadYouTubeVideo(finalVideoPath, title, description, finalThumbPath, channelName);
        console.log(`\n🎉 Video Man completed! Your video is uploaded at: ${youtubeUrl}`);

        saveVideoHistory(channelName, { topic: payload.topic, title: title, url: youtubeUrl });
    } catch (error) {
        console.error('\n❌ Video Man encountered an error:', error.message);
    }
}

if (require.main === module) {
    const topic = process.argv[2];
    if(!topic) {
        console.error('Usage: node run.js "Your Video Topic Here"');
        process.exit(1);
    }
    processVideoWorkflow(topic).then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { processVideoWorkflow };
