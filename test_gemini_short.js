require('dotenv').config();
const { generateScriptAndTitle } = require('./video_processor');

async function testGemini() {
    try {
        console.log("Environment GEMINI_API_KEY from test_gemini_short.js:", process.env.GEMINI_API_KEY ? "Loaded" : "NOT Loaded");
        console.log("Attempting a short Gemini content generation...");
        const result = await generateScriptAndTitle("brief test topic");
        console.log("Short Gemini content generation SUCCESS:", result.title);
    } catch (error) {
        console.error("Short Gemini content generation FAILED:", error.message);
    }
}

testGemini();