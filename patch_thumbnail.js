const fs = require('fs');
const path = '/data/.openclaw/workspace/video-man/ai_chunking.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /prompt: \`A cinematic YouTube thumbnail background.*?\`,/g,
    "prompt: `A highly simple, minimalist, and extremely eye-catching YouTube thumbnail background featuring a single massive, striking visual related to ${payload.topic}. High contrast, bold colors, uncluttered, no text, no words in the image.`, // Updated for simplicity and large visuals"
);

fs.writeFileSync(path, content);
console.log("Patched thumbnail prompt.");
