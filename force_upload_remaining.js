const { processVideoWorkflow } = require('./run');

const CHANNEL_PROFILES = {
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

async function forceRunRemaining() {
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
    console.log("\n✅ Force upload complete for remaining channels.");
}

forceRunRemaining();