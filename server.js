require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

// Create directories
['uploads', 'processed'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const REFRESH_TOKEN_PATH = path.join(__dirname, 'refresh_token.json');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-script', async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ error: 'Topic is required' });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate a short YouTube video script and a catchy title for the topic: "${topic}". Return it in JSON format with keys "title" and "script".`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        let data;
        try {
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            data = JSON.parse(cleanJson);
        } catch (e) {
            data = { title: `Amazing ${topic} Video`, script: responseText };
        }

        res.json({ script: data.script, title: data.title });
    } catch (error) {
        console.error('Gemini AI Error:', error);
        res.status(500).json({ error: 'Failed to generate script' });
    }
});

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// Fetch Stock Videos from Pexels
app.get('/api/fetch-stock-videos', async (req, res) => {
    try {
        const { query, per_page = 5 } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        const response = await axios.get('https://api.pexels.com/videos/search', {
            params: { query, per_page },
            headers: { Authorization: process.env.PEXELS_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Pexels API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock videos from Pexels' });
    }
});

// Process Video
app.post('/api/process-video', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No video provided' });
    
    const inputPath = req.file.path;
    const outputPath = `processed/output-${Date.now()}.mp4`;
    
    ffmpeg(inputPath)
        .size('640x480')
        .output(outputPath)
        .on('end', () => {
            fs.unlinkSync(inputPath); // Clean up uploaded file
            res.json({ success: true, processedVideo: outputPath, note: 'FFmpeg processing completed (scaled to 640x480)' });
        })
        .on('error', (err) => {
            console.error('FFmpeg Error:', err);
            res.status(500).json({ error: 'Video processing failed' });
        })
        .run();
});

// Actual YouTube Upload
app.post('/api/upload-youtube', async (req, res) => {
    const { videoPath, title, description } = req.body;
    
    if (!videoPath || !fs.existsSync(videoPath)) {
        return res.status(400).json({ error: 'Invalid or missing video path' });
    }

    try {
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const response = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: title || 'Generated Video',
                    description: description || 'Uploaded via VideoMan'
                },
                status: {
                    privacyStatus: 'private' // Defaulting to private for safety
                }
            },
            media: {
                body: fs.createReadStream(videoPath)
            }
        });
        res.json({ success: true, url: `https://youtube.com/watch?v=${response.data.id}` });
    } catch (error) {
        console.error('YouTube Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload to YouTube' });
    }
});

// YouTube OAuth 2.0 Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  'http://localhost' // Hardcoded for manual auth flow
);

// New endpoint to receive the authorization code directly
app.post('/api/youtube-receive-code', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required.' });
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(REFRESH_TOKEN_PATH, JSON.stringify(tokens));
    res.json({ success: true, message: 'Authentication successful! VideoMan is ready to upload.' });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).json({ error: 'Failed to exchange code for tokens.' });
  }
});

// Helper: load tokens from file
function loadTokens() {
    if (fs.existsSync(REFRESH_TOKEN_PATH)) {
        try {
            const rawData = fs.readFileSync(REFRESH_TOKEN_PATH);
            const tokens = JSON.parse(rawData);
            if (tokens && Object.keys(tokens).length > 0) {
                oauth2Client.setCredentials(tokens);
            }
        } catch (error) {
            console.error('Error reading refresh token:', error);
        }
    }
}
loadTokens();

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    fs.writeFileSync(REFRESH_TOKEN_PATH, JSON.stringify(tokens));
  }
});

// Helper: Generate Auth URL
app.get('/api/auth/youtube', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload']
  });
  res.redirect(url);
});

// Helper: OAuth Callback
app.get('/api/youtube-oauth-callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(REFRESH_TOKEN_PATH, JSON.stringify(tokens));
    res.send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Video Man running on port ${PORT}`);
});
