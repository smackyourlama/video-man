const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { execSync } = require('child_process');

async function runDemo() {
    console.log("Creating dummy video...");
    execSync(`${ffmpegPath} -y -f lavfi -i color=c=blue:s=320x240:d=1 dummy.mp4`, { stdio: 'ignore' });

    console.log("1. Generating Script...");
    const scriptRes = await axios.post('http://localhost:3000/api/generate-script', { topic: 'Artificial Intelligence' });
    console.log("Script Result:", scriptRes.data);

    console.log("2. Processing Video...");
    const form = new FormData();
    form.append('video', fs.createReadStream('dummy.mp4'));
    
    const processRes = await axios.post('http://localhost:3000/api/process-video', form, {
        headers: form.getHeaders()
    });
    console.log("Process Result:", processRes.data);
    
    console.log("\nDemo Job Completed. (YouTube upload skipped as requested)");
    
    process.exit(0);
}

runDemo().catch(err => {
    console.error(err);
    process.exit(1);
});
