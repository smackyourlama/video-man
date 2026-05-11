const { processVideoWorkflow } = require('./run');

const CHANNEL_PROFILES = {
    "NULL SIGNAL": {
        niche: "Dark AI, cybersecurity, surveillance, automation, privacy, tech corruption, and hidden digital power systems.",
        tone: "dark, investigative, cyberpunk, ominous",
        topics: ["Zero-Day Exploits: The Shadow Market"]
    },
    "BLACK LEDGER": {
        niche: "Business collapses, corporate exposés, dark finance, financial manipulation, scams, economic power, and money-trail documentaries.",
        tone: "investigative, gritty, analytical, exposing",
        topics: ["Inside the World of High-Frequency Trading Fraud"]
    },
    "TERMINAL ECHO": {
        niche: "Creepy internet mysteries, AI/cybersecurity horror, lost media, strange broadcasts, dark web stories, surveillance horror, and digital mystery documentaries.",
        tone: "creepy, suspenseful, mysterious, unsettling",
        topics: ["The Internet Mystery That Remains Unsolved"]
    }
};

async function run() {
    const channels = Object.keys(CHANNEL_PROFILES);
    for (const channelName of channels) {
        const profile = CHANNEL_PROFILES[channelName];
        const topic = profile.topics[0];
        
        console.log(`\n\n[Manual Override] Initiating FULL flow for Channel: ${channelName} | Topic: ${topic}`);
        
        const workflowPayload = JSON.stringify({ 
            topic: topic, 
            channelName: channelName, 
            niche: profile.niche, 
            tone: profile.tone
        });
        
        try {
            await processVideoWorkflow(workflowPayload);
            console.log(`Waiting 60 seconds before starting next channel...`);
            await new Promise(r => setTimeout(r, 60000));
        } catch (e) {
            console.error(`Error processing ${channelName}:`, e);
        }
    }
    console.log('\n\n✅ ALL MANUALLY FORCED UPLOADS COMPLETE.');
}

run();
