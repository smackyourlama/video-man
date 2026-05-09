const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, 'data', 'channel_history.json');

function initHistory() {
    if (!fs.existsSync(path.dirname(HISTORY_FILE))) {
        fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
    }
    if (!fs.existsSync(HISTORY_FILE)) {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify({}));
    }
}

function getChannelHistory(channelName) {
    initHistory();
    const data = JSON.parse(fs.readFileSync(HISTORY_FILE));
    return data[channelName] || [];
}

function saveVideoHistory(channelName, videoData) {
    initHistory();
    const data = JSON.parse(fs.readFileSync(HISTORY_FILE));
    if (!data[channelName]) data[channelName] = [];
    data[channelName].push({
        topic: videoData.topic,
        title: videoData.title,
        date: new Date().toISOString(),
        url: videoData.url
    });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
    console.log(`[History] Saved video history for ${channelName}. Total videos: ${data[channelName].length}`);
}

module.exports = { getChannelHistory, saveVideoHistory };