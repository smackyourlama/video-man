const { OpenAI } = require('openai');
require('dotenv').config();
const { getChannelHistory } = require('./history_manager');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateScriptChunked(payload) {
    console.log(`[ScriptGen] Generating full script and metadata for: ${payload.topic}`);
    
    // Fetch History to prevent duplication
    const pastVideos = getChannelHistory(payload.channelName);
    let historyContext = "";
    if (pastVideos.length > 0) {
        const pastTopics = pastVideos.map(v => `"${v.title}" (${v.topic})`).join(", ");
        historyContext = `\n\nIMPORTANT AVOID DUPLICATION: You have already made videos about: ${pastTopics}. DO NOT repeat these exact topics or use the exact same core information. Make sure this new video is highly unique.`;
        console.log(`[ScriptGen] Loaded ${pastVideos.length} past videos for context to prevent duplication.`);
    }

    // Step 1: Generate Title, Full Script, and Description in ONE powerful API call
    const response = await openai.chat.completions.create({
        model: "gpt-5.4-mini",
        messages: [
            {
                role: "system",
                content: `You are an expert scriptwriter for the YouTube channel '${payload.channelName}'. Niche: ${payload.niche}. Tone: ${payload.tone}. Return ONLY valid JSON with three keys: "title", "script", and "description". No scene directions, no speaker labels, no bracketed text in the script.${historyContext}`
            },
            {
                role: "user",
                content: `Generate a complete YouTube video package for the topic: "${payload.topic}".

REQUIREMENTS:
1. "title": A compelling, highly clickable YouTube title (under 100 characters).
2. "script": A full, flowing documentary script (approx 1100-1200 words) designed for 7 minutes and 30 seconds of spoken narration. MUST contain ONLY the exact spoken words. Connect ideas smoothly.
3. "description": A compelling 3-paragraph YouTube description.
IMPORTANT FOR DESCRIPTION: At the VERY TOP of the description, recommend 3 real, highly-rated books related to the topic.
Format the recommendations exactly like this:
📚 Recommended Reading:
1. [Book 1 Title] by [Author 1] - https://www.amazon.com/s?k=[URL_ENCODED_BOOK_1_TITLE]&tag=${process.env.AMAZON_ASSOCIATE_TAG || 'nicco00a-20'}
2. [Book 2 Title] by [Author 2] - https://www.amazon.com/s?k=[URL_ENCODED_BOOK_2_TITLE]&tag=${process.env.AMAZON_ASSOCIATE_TAG || 'nicco00a-20'}
3. [Book 3 Title] by [Author 3] - https://www.amazon.com/s?k=[URL_ENCODED_BOOK_3_TITLE]&tag=${process.env.AMAZON_ASSOCIATE_TAG || 'nicco00a-20'}

Then, add the 3-paragraph description below it, followed by 3-5 relevant hashtags.`
            }
        ],
        response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    console.log(`[ScriptGen] Full script generated. Total script length: ${data.script.length} characters.`);

    return {
        title: data.title,
        script: data.script.trim(),
        description: data.description
    };
}

async function generateThumbnailAssets(payload, title) {
    console.log(`[Chunker] Generating thumbnail assets for: ${title}`);
    
    // 1. Generate short punchy thumbnail text
    const textResponse = await openai.chat.completions.create({
        model: "gpt-5.4-mini",
        messages: [
            {
                role: "system",
                content: `You write YouTube thumbnail text. Return ONLY valid JSON with a "thumbnail_text" key. The text must be extremely short, punchy, and click-worthy (under 5 words).`
            },
            {
                role: "user",
                content: `Generate thumbnail text for a video titled: "${title}"`
            }
        ],
        response_format: { type: "json_object" }
    });
    const thumbTextData = JSON.parse(textResponse.choices[0].message.content);
    
    // 2. Generate thumbnail image
    console.log(`[Chunker] Generating AI thumbnail image...`);
    let imageUrl = null;
    try {
        const imageResponse = await openai.images.generate({
            model: "gpt-image-1-mini",
            prompt: `A cinematic, highly detailed YouTube thumbnail background for a video about ${payload.topic}. Style: ${payload.tone}, ${payload.niche}. No text, no words in the image.`,
            n: 1,
            size: "1024x1024"
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