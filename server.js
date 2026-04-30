require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

// Create directories
['uploads', 'processed'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Mock AI Integration
app.post('/api/generate-script', (req, res) => {
    const { topic } = req.body;
    res.json({ script: `Generated script for: ${topic}\n\nWelcome to our channel! Today we're talking about ${topic}. Subscribe for more!`, title: `Amazing ${topic} Video` });
});

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

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

// YouTube Upload Mock
app.post('/api/upload-youtube', (req, res) => {
    const { videoPath, title, description } = req.body;
    res.json({ success: true, url: 'https://youtube.com/watch?v=mock_video_id' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Video Man running on port ${PORT}`);
});
