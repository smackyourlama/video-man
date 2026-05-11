const { processVideoWorkflow } = require('./run');

const CHANNEL_PROFILES = {
    "Operator Logic": {
        niche: "breaking down boring businesses, practical acquisitions, smart systems, and the real mechanics of cash flow. It targets laundromats, car washes, storage, service businesses, and other overlooked operations.",
        tone: "practical, logical, no hype, useful numbers",
        topics: ["Automating a Car Wash for Maximum Profit"]
    },
    "NULL SIGNAL": {
        niche: "Dark AI, cybersecurity, surveillance, automation, privacy, tech corruption, and hidden digital power systems.",
        tone: "dark, investigative, cyberpunk, ominous",
        topics: ["The AI Surveillance State is Already Here"]
    },
    "BLACK LEDGER": {
        niche: "Business collapses, corporate exposés, dark finance, financial manipulation, scams, economic power, and money-trail documentaries.",
        tone: "investigative, gritty, analytical, exposing",
        topics: ["The Collapse of the Biggest Crypto Scam"]
    },
    "TERMINAL ECHO": {
        niche: "Creepy internet mysteries, AI/cybersecurity horror, lost media, strange broadcasts, dark web stories, surveillance horror, and digital mystery documentaries.",
        tone: "creepy, suspenseful, mysterious, unsettling",
        topics: ["When AI Predicts Something Terrifying"]
    }
};

async function run() {
    const channels = Object.keys(CHANNEL_PROFILES);
    for (const channelName of channels) {
        const profile = CHANNEL_PROFILES[channelName];
        const topic = profile.topics[0];
        
        console.log(`\n\n[Batch V2 Override] Initiating FULL flow for Channel: ${channelName} | Topic: ${topic}`);
        
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
    console.log('\n\n✅ ALL MANUALLY FORCED V2 UPLOADS COMPLETE.');
}

run();
