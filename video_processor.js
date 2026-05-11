require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const OpenAI = require('openai');
const { google } = require('googleapis');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// Configuration for directories
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROCESSED_DIR = path.join(__dirname, 'processed');
const REFRESH_TOKEN_PATH = path.join(__dirname, 'refresh_token.json');

// Ensure directories exist
[UPLOADS_DIR, PROCESSED_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Initialize OpenAI
console.log("Initializing OpenAI. OPENAI_API_KEY from video_processor.js:", process.env.OPENAI_API_KEY ? "Loaded" : "NOT Loaded");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// YouTube OAuth 2.0 Setup
const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    'http://localhost'
);

function loadTokens(channelName = "Operator Logic") {
    let tokenPath = REFRESH_TOKEN_PATH;
    if (channelName === "NULL SIGNAL") tokenPath = path.join(__dirname, 'refresh_token_null_signal.json');
    if (channelName === "BLACK LEDGER") tokenPath = path.join(__dirname, 'refresh_token_black_ledger.json');
    if (channelName === "TERMINAL ECHO") tokenPath = path.join(__dirname, 'refresh_token_terminal_echo.json');

    if (fs.existsSync(tokenPath)) {
        try {
            const rawData = fs.readFileSync(tokenPath);
            const tokens = JSON.parse(rawData);
            if (tokens && Object.keys(tokens).length > 0) {
                // FORCE update the global client with the new tokens
                oauth2Client.setCredentials(tokens);
                console.log(`YouTube tokens forcefully loaded for channel: ${channelName}.`);
                return true;
            }
        } catch (error) {
            console.error(`Error reading refresh token for ${channelName}:`, error);
        }
    } else {
        console.warn(`No token file found for ${channelName} at ${tokenPath}`);
    }
    return false;
}
// Initial load for default (Operator Logic)
loadTokens();

oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        fs.writeFileSync(REFRESH_TOKEN_PATH, JSON.stringify(tokens));
        console.log('New refresh token saved.');
    }
});

async function generateScriptAndTitle(workflowPayloadString) {
    let payload;
    try {
        payload = JSON.parse(workflowPayloadString);
    } catch(e) {
        // Fallback if passed a plain string topic
        payload = {
            topic: workflowPayloadString,
            channelName: "Operator Logic",
            niche: "breaking down boring businesses, practical acquisitions, smart systems, and the real mechanics of cash flow.",
            tone: "practical, logical, no hype"
        };
    }

    if (!payload.topic) throw new Error('Topic is required for script generation');
    try {
        console.log(`[VideoMan] Attempting OpenAI API for script generation. Channel: ${payload.channelName}`);
        
        const response = await openai.chat.completions.create({
            model: "gpt-5.4-mini", // Upgraded to newer, faster model
            messages: [
                {
                    role: "system",
                    content: `You are an expert scriptwriter for a YouTube channel called '${payload.channelName}'. The channel focuses on: ${payload.niche}. Tone required: ${payload.tone}. Always return output in valid JSON format. IMPORTANT: DO NOT include any scene styles, visual descriptions, stage directions, bracketed text (like [Intro Music] or [Visual]), or speaker labels. The script MUST contain ONLY the exact spoken words to be read by the narrator.`
                },
                {
                    role: "user",
                    content: `Generate a compelling YouTube video title (under 100 characters) and a detailed 7-minute video script (approx 900-1000 words) on the topic: "${payload.topic}". Return ONLY JSON format with keys "title" and "script".`
                }
            ],
            response_format: { type: "json_object" } // Guarantee JSON output
        });
        
        const data = JSON.parse(response.choices[0].message.content);
        
        console.log('[VideoMan] OpenAI generation successful.');
        return { title: data.title, script: data.script, channelName: payload.channelName };

    } catch (error) {
        console.error('[VideoMan] OpenAI API failed or timed out:', error.message);
        console.log('[VideoMan] ENGAGING AUTONOMOUS FALLBACK: Generating dynamic template script to prevent stall...');
        
        // Dynamic Fallback Script
        const fallbackTitle = `${payload.topic}: The ${payload.channelName} Breakdown`;
        const fallbackScript = `Welcome back to ${payload.channelName}. Today we are diving into ${payload.topic}. We explore the depths of ${payload.niche}. The details matter, and today we look closely at how ${payload.topic} fits into that landscape. Keep your eyes open and question everything. Stay tuned to ${payload.channelName} for more.`;

        return { title: fallbackTitle, script: fallbackScript, channelName: payload.channelName };
    }
}

async function fetchStockVideos(query, per_page = 30) {
    if (!query) throw new Error('Query is required for fetching stock videos');
    try {
        console.log(`Fetching ${per_page} stock video(s) from Pexels for "${query}"...`);
        const response = await axios.get('https://api.pexels.com/videos/search', {
            params: { query, per_page, orientation: 'landscape', size: 'large' },
            headers: { Authorization: process.env.PEXELS_API_KEY }
        });
        if (!response.data.videos || response.data.videos.length === 0) {
            console.warn('No videos found for query:', query);
            return [];
        }
        console.log(`Found ${response.data.videos.length} video(s) from Pexels.`);
        return response.data.videos;
    } catch (error) {
        console.error('Pexels API Error:', error.message);
        throw new Error('Failed to fetch stock videos from Pexels');
    }
}

async function fetchStockImage(query) {
    try {
        console.log(`Fetching stock image from Pexels for thumbnail: "${query}"...`);
        const response = await axios.get('https://api.pexels.com/v1/search', {
            params: { query, per_page: 1, orientation: 'landscape' },
            headers: { Authorization: process.env.PEXELS_API_KEY }
        });
        if (!response.data.photos || response.data.photos.length === 0) return null;
        return response.data.photos[0].src.original;
    } catch (error) {
        console.error('Pexels Image API Error:', error.message);
        return null;
    }
}

async function downloadFile(url, filename) {
    const outputPath = path.join(UPLOADS_DIR, filename);
    console.log(`Downloading ${url} to ${outputPath}...`);
    const writer = fs.createWriteStream(outputPath);
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(outputPath));
        writer.on('error', reject);
    });
}

function processIntermediateVideo(inputPath, index) {
    const outputPath = path.join(PROCESSED_DIR, `temp-${index}-${Date.now()}.ts`);
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264',
                '-preset ultrafast',
                '-s 1920x1080',
                '-r 30',
                '-an', // remove audio
                '-f mpegts'
            ])
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .run();
    });
}

async function stitchVideosWithAudio(videoPaths, audioPath) {
    const finalVideoPath = path.join(PROCESSED_DIR, `final-${Date.now()}.mp4`);
    console.log('Scaling and formatting individual clips...');
    
    const tsPaths = [];
    for (let i = 0; i < videoPaths.length; i++) {
        try {
            const tsPath = await processIntermediateVideo(videoPaths[i], i);
            tsPaths.push(tsPath);
        } catch(e) {
            console.error(`Failed to process video ${videoPaths[i]}, skipping...`, e.message);
        }
    }

    if(tsPaths.length === 0) throw new Error("No video clips processed successfully");

    const concatListPath = path.join(PROCESSED_DIR, `concat-list-${Date.now()}.txt`);
    const concatContent = tsPaths.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
    fs.writeFileSync(concatListPath, concatContent);

    console.log('Concatenating clips and adding TTS audio...');
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(concatListPath)
            .inputOptions(['-f concat', '-safe 0'])
            .input(audioPath)
            .outputOptions([
                '-c:v copy',
                '-c:a aac',
                '-shortest' // ends when the shortest stream (usually audio) ends
            ])
            .output(finalVideoPath)
            .on('end', () => {
                console.log('Final video stitched successfully.');
                resolve(finalVideoPath);
            })
            .on('error', (err) => {
                console.error('Stitching error:', err);
                reject(err);
            })
            .run();
    });
}

async function createThumbnail(imagePath, titleText) {
    const finalThumb = path.join(PROCESSED_DIR, `thumb-${Date.now()}.jpg`);
    return new Promise((resolve, reject) => {
        // Simple overlay: draw text in center using ffmpeg
        // Also compress the image to ensure it's under YouTube's 2MB limit (set qscale:v 5)
        // And pad/scale to exactly 1280x720 so YouTube gets a perfect 16:9 thumbnail
        ffmpeg(imagePath)
            .outputOptions([
                '-vf', `scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,drawtext=text='${titleText.replace(/['":\\]/g, "")}':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.5:boxborderw=10`,
                '-qscale:v', '5'
            ])
            .output(finalThumb)
            .on('end', () => resolve(finalThumb))
            .on('error', (err) => {
                console.warn('Thumbnail text overlay failed, using original image.', err.message);
                resolve(imagePath); // fallback
            })
            .run();
    });
}

async function uploadYouTubeVideo(videoPath, title, description, thumbnailPath, channelName, options = {}) {
    // 1. Force clear the credentials object entirely before loading new ones
    oauth2Client.credentials = {};
    console.log(`[Upload] Credentials cleared for channel switch.`);

    // 2. Dynamically load the correct token
    const tokenLoaded = loadTokens(channelName);
    if (!tokenLoaded) {
        throw new Error(`Failed to load tokens for channel: ${channelName}. Upload aborted.`);
    }

    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
        throw new Error(`YouTube authentication token is empty after load for ${channelName}.`);
    }
    
    try {
        console.log(`[Upload] Authenticating and uploading video to YouTube channel: ${channelName}...`);
        
        // Clean description to remove unallowed chars. YouTube description has strict limits on < and > chars.
        const safeDescription = description.replace(/[<>]/g, "");
        
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const publishAt = options.publishAt ? new Date(options.publishAt).toISOString() : null;
        const status = publishAt
            ? {
                privacyStatus: 'private',
                publishAt,
                selfDeclaredMadeForKids: false,
              }
            : {
                privacyStatus: options.privacyStatus || 'public',
              };
        const response = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: { title: title.substring(0, 100), description: safeDescription },
                status
            },
            media: { body: fs.createReadStream(videoPath) }
        });
        const videoId = response.data.id;
        const videoUrl = `https://youtube.com/watch?v=${videoId}`;
        console.log(`Video uploaded: ${videoUrl}`);

        if (thumbnailPath && fs.existsSync(thumbnailPath)) {
            console.log('Uploading thumbnail...');
            await youtube.thumbnails.set({
                videoId: videoId,
                media: { body: fs.createReadStream(thumbnailPath) }
            });
            console.log('Thumbnail uploaded successfully.');
        }

        return videoUrl;
    } catch (error) {
        console.error('YouTube Upload Error:', error.message);
        throw new Error('Failed to upload to YouTube');
    }
}

async function authorizeYouTube() {
    return new Promise((resolve, reject) => {
        if (oauth2Client.credentials && oauth2Client.credentials.refresh_token) {
            console.log('YouTube already authorized. Loading tokens...');
            resolve();
            return;
        }

        console.log('YouTube not authorized. Please follow the link to authorize:');
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube.upload']
        });
        console.log(authUrl);

        process.stdin.once('data', async (data) => {
            const code = data.toString().trim();
            try {
                const { tokens } = await oauth2Client.getToken(code);
                oauth2Client.setCredentials(tokens);
                fs.writeFileSync(REFRESH_TOKEN_PATH, JSON.stringify(tokens));
                console.log('YouTube authorization successful!');
                resolve();
            } catch (error) {
                console.error('Error exchanging code for tokens:', error);
                reject(new Error('YouTube authorization failed'));
            }
        });
    });
}

module.exports = {
    generateScriptAndTitle,
    fetchStockVideos,
    fetchStockImage,
    downloadFile,
    stitchVideosWithAudio,
    createThumbnail,
    uploadYouTubeVideo,
    authorizeYouTube
};
