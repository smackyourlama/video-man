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

// Run at 10:00 AM every day - PROCESS ALL 4 CHANNELS
cron.schedule('0 10 * * *', async () => {
    console.log("⏰ Triggering 10:00 AM scheduled video creation for ALL channels...");
    
    const channelNames = Object.keys(CHANNEL_PROFILES);
    for (const channelName of channelNames) {
        const profile = CHANNEL_PROFILES[channelName];
        const randomTopic = profile.topics[Math.floor(Math.random() * profile.topics.length)];
        
        console.log(`[Scheduler] Initiating creation for Channel: ${channelName} | Topic: ${randomTopic}`);
        
        const workflowPayload = JSON.stringify({ 
            topic: randomTopic, 
            channelName: channelName, 
            niche: profile.niche, 
            tone: profile.tone 
        });
        
        try {
            await processVideoWorkflow(workflowPayload);
            console.log(`[Scheduler] Finished process for ${channelName}. Waiting 5 minutes before starting the next channel to avoid API rate limits...`);
            // Wait 5 minutes between channel generations
            await new Promise(resolve => setTimeout(resolve, 300000));
        } catch (error) {
            console.error(`[Scheduler] Error generating video for ${channelName}:`, error.message);
        }
    }
    console.log("✅ 10:00 AM Daily Run Complete for all channels.");
});

console.log("Scheduler is running. Videos will be generated sequentially for all 4 channels at 10:00 AM daily.");

