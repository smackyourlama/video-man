const { OpenAI } = require('openai');
require('dotenv').config();
const { getChannelHistory } = require('./history_manager');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateScriptChunked(payload) {
    console.log(`[ScriptGen] Generating ultra-fast scene-by-scene script for: ${payload.topic}`);
    
    // Fetch History to prevent duplication
    const pastVideos = getChannelHistory(payload.channelName);
    let historyContext = "";
    if (pastVideos.length > 0) {
        const pastTopics = pastVideos.map(v => `"${v.title}" (${v.topic})`).join(", ");
        historyContext = `\n\nIMPORTANT AVOID DUPLICATION: You have already made videos about: ${pastTopics}. DO NOT repeat these exact topics or use the exact same core information.`;
    }

    // Generate Title, Description, and chunked Scenes in ONE API call
    const response = await openai.chat.completions.create({
        model: "gpt-5.4-mini",
        messages: [
            {
                role: "system",
                content: `You are an expert scriptwriter for the YouTube channel '${payload.channelName}'. Niche: ${payload.niche}. Tone: ${payload.tone}. Return ONLY valid JSON containing "title", "description", and an array "scenes". Each scene represents an ultra-fast visual chunk of the video, rendered entirely with motion graphics.${historyContext}`
            },
            {
                role: "user",
                content: `Generate a YouTube video package for the topic: "${payload.topic}".

REQUIREMENTS:
1. "title": A compelling YouTube title.
2. "description": A 3-paragraph YouTube description. At the top, include 3 Amazon book recommendations formatted exactly as requested previously.
3. "scenes": An array of VERY SHORT scene objects. To maintain a fast, high-retention pace, EACH scene must represent only about 3 to 4 seconds of spoken audio (approx 7-14 words, ideally one sharp idea). For a full 7-minute video, generate roughly 95 to 130 scenes.
   Each object MUST contain:
   - "narrative": The exact spoken text for this 3-4 second chunk. No brackets, no stage directions. Must flow smoothly into the next scene.
   - "visualTheme": A programmatic visual style (e.g. "dark_gradient", "kinetic_glitch", "code_rain", "wireframe"). Alternate these frequently.
   - "overlayText": A punchy 2-4 word phrase taken DIRECTLY from the narrative.
IMPORTANT PACING RULES:
- Keep the narration punchy and clipped.
- Change the core thought every scene.
- Avoid long sentences.
- Favor dramatic fragments over explanatory paragraphs.
- The on-screen words should feel like they are changing constantly, not sitting on one sentence for too long.`
            }
        ],
        response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    console.log(`[ScriptGen] Generated ${data.scenes.length} short fast-paced scenes.`);

    return {
        title: data.title,
        description: data.description,
        scenes: data.scenes
    };
}

async function generateThumbnailAssets(payload, title) {
    console.log(`[Chunker] Generating thumbnail assets for: ${title}`);
    const textResponse = await openai.chat.completions.create({
        model: "gpt-5.4-mini",
        messages: [
            { role: "system", content: `You write YouTube thumbnail text. Return ONLY valid JSON with a "thumbnail_text" key. Under 5 words.` },
            { role: "user", content: `Generate thumbnail text for: "${title}"` }
        ],
        response_format: { type: "json_object" }
    });
    const thumbTextData = JSON.parse(textResponse.choices[0].message.content);
    
    let imageUrl = null;
    try {
        const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `A highly simple, minimalist, and extremely eye-catching YouTube thumbnail background featuring a single massive, striking visual related to ${payload.topic}. High contrast, bold colors, uncluttered, no text, no words in the image.`, // Updated for simplicity and large visuals
            n: 1,
            size: "1792x1024"
        });
        imageUrl = imageResponse.data[0].url;
    } catch (error) {
        console.error('AI Image Generation Error:', error.message);
    }
    
    return {
        thumbnailText: thumbTextData.thumbnail_text,
        thumbnailUrl: imageUrl
    };
}

module.exports = { generateScriptChunked, generateThumbnailAssets };
