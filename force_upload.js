const { processVideoWorkflow } = require('./run');

const CHANNEL_PROFILES = {
    "Operator Logic": {
        niche: "breaking down boring businesses, practical acquisitions, smart systems, and the real mechanics of cash flow. It targets laundromats, car washes, storage, service businesses, and other overlooked operations.",
        tone: "practical, logical, no hype, useful numbers",
        topic: "The Hidden Leverage in Laundromat Acquisitions"
    },
    "NULL SIGNAL": {
        niche: "Dark AI, cybersecurity, surveillance, automation, privacy, tech corruption, and hidden digital power systems.",
        tone: "dark, investigative, cyberpunk, ominous",
        topic: "The Invisible AI Profiling You Right Now"
    },
    "BLACK LEDGER": {
        niche: "Business collapses, corporate exposés, dark finance, financial manipulation, scams, economic power, and money-trail documentaries.",
        tone: "investigative, gritty, analytical, exposing",
        topic: "The Shadow Banking System Explained"
    },
    "TERMINAL ECHO": {
        niche: "Creepy internet mysteries, AI/cybersecurity horror, lost media, strange broadcasts, dark web stories, surveillance horror, and digital mystery documentaries.",
        tone: "creepy, suspenseful, mysterious, unsettling",
        topic: "The OSINT Traces Left Behind by Deleted Accounts"
    }
};

async function forceRunAll() {
    const channelNames = Object.keys(CHANNEL_PROFILES);
    for (const channelName of channelNames) {
        const profile = CHANNEL_PROFILES[channelName];
        console.log(`\n\n🚀 FORCING UPLOAD FOR: ${channelName} 🚀`);
        const payload = JSON.stringify({
            topic: profile.topic,
            channelName: channelName,
            niche: profile.niche,
            tone: profile.tone
        });
        await processVideoWorkflow(payload);
    }
    console.log("\n✅ Force upload complete for all channels.");
}

forceRunAll();