const fs = require('fs');
const path = require('path');
const { 
    generateTTS,
    fetchStockVideos, 
    downloadFile, 
    stitchVideosWithAudio,
    createThumbnail,
    uploadYouTubeVideo, 
    authorizeYouTube
} = require('./video_processor');
const { generateScriptChunked, generateThumbnailAssets } = require('./ai_chunking');
const { saveVideoHistory } = require('./history_manager');

async function processVideoWorkflow(payloadString) {
    let payload;
    try {
        payload = JSON.parse(payloadString);
    } catch(e) {
        payload = { topic: payloadString };
    }

    if (!payload.topic) {
        throw new Error('Topic is required');
    }

    try {
        console.log(`\n--- Starting workflow for payload: "${payloadString}" ---`);
        await authorizeYouTube(); // Note: This might still default to Operator Logic for initial check, but upload forces the switch

        // 1. Generate Script and Title (Passing full payload for multi-channel using Chunking)
        const { title, script, description } = await generateScriptChunked(payload);
        const channelName = payload.channelName || "Operator Logic";
        console.log(`\nGenerated Title: ${title}`);
        console.log(`Target Channel: ${channelName}`);
        console.log(`Generated Script excerpt: ${script.substring(0, 100)}...`);

        // 2. Generate TTS Audio
        // const audioPath = await generateTTS(script);
        // FOR TESTING: Bypass TTS generation and use a dummy file
        const audioPath = path.join(__dirname, 'dummy_audio.mp3');
        if (!fs.existsSync(audioPath)) {
            // Create a 1-second silent mp3 using the bundled ffmpeg path instead of relying on global PATH
            const ffmpegStaticPath = require('@ffmpeg-installer/ffmpeg').path;
            require('child_process').execSync(`"${ffmpegStaticPath}" -f lavfi -i anullsrc=r=44100:cl=stereo -t 1 -q:a 9 -acodec libmp3lame ${audioPath}`);
            console.log("Created dummy audio file for testing.");
        }
        console.log("Using dummy audio for testing upload routing.");

        // 3. Fetch Stock Videos (Fetch ~15 videos to cover 7 minutes, since some are 30s+)
        const videos = await fetchStockVideos(payload.topic, 1); 
        if (videos.length === 0) {
            throw new Error('No stock videos found for the topic. Aborting.');
        }

        const downloadedVideoPaths = [];
        for (let i = 0; i < videos.length; i++) {
            const bestVideoUrl = videos[i].video_files.find(f => f.quality === 'hd')?.link || videos[i].video_files[0].link;
            try {
                const p = await downloadFile(bestVideoUrl, `raw-${i}-${Date.now()}.mp4`);
                downloadedVideoPaths.push(p);
            } catch(e) {
                console.error(`Error downloading video ${i}: ${e.message}`);
            }
        }

        if(downloadedVideoPaths.length === 0) throw new Error("Failed to download any video clips");

        // 4. Fetch Thumbnail Image & Create Thumbnail (using AI model)
        const { thumbnailText, thumbnailUrl } = await generateThumbnailAssets(payload, title);
        let finalThumbPath = null;
        if (thumbnailUrl) {
            const rawThumb = await downloadFile(thumbnailUrl, `raw-thumb-${Date.now()}.jpg`);
            finalThumbPath = await createThumbnail(rawThumb, thumbnailText);
        }

        // 5. Stitch Videos together with Audio
        const finalVideoPath = await stitchVideosWithAudio(downloadedVideoPaths, audioPath);

        // 6. Upload to YouTube
        const youtubeUrl = await uploadYouTubeVideo(finalVideoPath, title, description, finalThumbPath, channelName || "Operator Logic");
        console.log(`\n🎉 Video Man completed! Your video is uploaded at: ${youtubeUrl}`);

        // 7. Save to Channel History
        saveVideoHistory(channelName || "Operator Logic", {
            topic: payload.topic,
            title: title,
            url: youtubeUrl
        });
    } catch (error) {
        console.error('\n❌ Video Man encountered an error:', error.message);
    }
}

// Standalone execution support
if (require.main === module) {
    const topic = process.argv[2];
    if(!topic) {
        console.error('Usage: node run.js "Your Video Topic Here"');
        process.exit(1);
    }
    processVideoWorkflow(topic).then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { processVideoWorkflow };
