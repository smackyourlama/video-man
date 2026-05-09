require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const REFRESH_TOKEN_PATH = path.join(__dirname, 'refresh_token.json');

const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    'http://localhost'
);

async function saveToken() {
    const code = process.argv[2];
    if (!code) {
        console.error('Please provide the authorization code as an argument.');
        process.exit(1);
    }

    try {
        console.log('Exchanging code for tokens...');
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync(REFRESH_TOKEN_PATH, JSON.stringify(tokens));
        console.log('Successfully saved refresh_token.json!');
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.message);
        process.exit(1);
    }
}

saveToken();
