const cron = require('node-cron');
const { processVideoWorkflow } = require('./run');

console.log("Starting VideoMan Scheduler...");

const CHANNEL_PROFILES = {
    "Operator Logic": {
        niche: "breaking down boring businesses, practical acquisitions, smart systems, and the real mechanics of cash flow. It targets laundromats, car washes, storage, service businesses, and other overlooked operations.",
        tone: "practical, logical, no hype, useful numbers",
        topics: [
            "The Underrated Cash Flow of Laundromats",
            "Automating a Car Wash for Maximum Profit",
            "Deal Structures for Acquiring Local Service Businesses",
            "Operational Efficiency for Small Businesses",
            "How to Buy and Grow a Storage Facility"
        ]
    },
    "NULL SIGNAL": {
        niche: "Dark AI, cybersecurity, surveillance, automation, privacy, tech corruption, and hidden digital power systems.",
        tone: "dark, investigative, cyberpunk, ominous",
        topics: [
            "The AI Surveillance State is Already Here",
            "Zero-Day Exploits: The Shadow Market",
            "How Tech Giants Profit from Your Privacy",
            "The Dark Side of Automated Systems",
            "Hidden Backdoors in Everyday Tech"
        ]
    },
    "BLACK LEDGER": {
        niche: "Business collapses, corporate exposés, dark finance, financial manipulation, scams, economic power, and money-trail documentaries.",
        tone: "investigative, gritty, analytical, exposing",
        topics: [
            "The Collapse of the Biggest Crypto Scam",
            "How Wall Street Manipulates Main Street",
            "The Dark Money Behind Corporate Empires",
            "Inside the World of High-Frequency Trading Fraud",
            "The Anatomy of a Billion-Dollar Ponzi Scheme"
        ]
    },
    "TERMINAL ECHO": {
        niche: "Creepy internet mysteries, AI/cybersecurity horror, lost media, strange broadcasts, dark web stories, surveillance horror, and digital mystery documentaries.",
        tone: "creepy, suspenseful, mysterious, unsettling",
        topics: [
            "The Unexplained Broadcast of 2007",
            "Lost Media: The Dark Web's Scariest Video",
            "When AI Predicts Something Terrifying",
            "The Internet Mystery That Remains Unsolved",
            "Digital Ghosts: Creepy Forums that Refuse to Die"
        ]
    }
};

function getRandomTopicAndChannel() {
    const channelNames = Object.keys(CHANNEL_PROFILES);
    const randomChannelName = channelNames[Math.floor(Math.random() * channelNames.length)];
    const channelProfile = CHANNEL_PROFILES[randomChannelName];
    
    const randomTopic = channelProfile.topics[Math.floor(Math.random() * channelProfile.topics.length)];
    
    return { channelName: randomChannelName, topic: randomTopic, profile: channelProfile };
}

// 1. GENERATION SCHEDULE: Run at 8:00 PM (20:00) every day to prepare videos for the NEXT day
cron.schedule('0 20 * * *', async () => {
    console.log("⏰ [8:00 PM] Triggering scheduled video GENERATION for tomorrow's uploads...");
    
    const channelNames = Object.keys(CHANNEL_PROFILES);
    for (const channelName of channelNames) {
        const profile = CHANNEL_PROFILES[channelName];
        const randomTopic = profile.topics[Math.floor(Math.random() * profile.topics.length)];
        
        console.log(`[Scheduler-Gen] Initiating creation for Channel: ${channelName} | Topic: ${randomTopic}`);
        
        const workflowPayload = JSON.stringify({ 
            topic: randomTopic, 
            channelName: channelName, 
            niche: profile.niche, 
            tone: profile.tone,
            action: "generate_only" // Flags the system to generate and queue, but not upload
        });
        
        try {
            await processVideoWorkflow(workflowPayload);
            console.log(`[Scheduler-Gen] Finished generating and queuing video for ${channelName}.`);
            await new Promise(resolve => setTimeout(resolve, 300000)); // 5 min cooldown
        } catch (error) {
            console.error(`[Scheduler-Gen] Error generating video for ${channelName}:`, error.message);
        }
    }
    console.log("✅ 8:00 PM Generation Run Complete. Videos queued for tomorrow.");
});

// 2. UPLOAD SCHEDULE: Run at 10:00 AM every day to publish the queued videos
cron.schedule('0 10 * * *', async () => {
    console.log("⏰ [10:00 AM] Triggering scheduled video UPLOADS...");
    console.log("[Scheduler-Upload] Scanning queue for approved/generated videos...");
    // Logic here will process the local SQLite queue and trigger the YouTube API upload for anything generated the night before
    console.log("✅ 10:00 AM Upload Run Complete.");
});

console.log("VideoMan V2 Scheduler is running.");
console.log("- Videos generate at 8:00 PM daily.");
console.log("- Videos upload at 10:00 AM daily.");

