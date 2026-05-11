const { processVideoWorkflow } = require('./run');

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
    }
};

async function run() {
    const channelName = "Operator Logic";
    const profile = CHANNEL_PROFILES[channelName];
    const topic = profile.topics[0];
    
    console.log(`[Manual Override] Initiating creation for Channel: ${channelName} | Topic: ${topic}`);
    
    const workflowPayload = JSON.stringify({ 
        topic: topic, 
        channelName: channelName, 
        niche: profile.niche, 
        tone: profile.tone
    });
    
    try {
        await processVideoWorkflow(workflowPayload);
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
