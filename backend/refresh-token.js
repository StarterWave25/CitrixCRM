import { google } from 'googleapis';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI; // Must match the value you set in the Console

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.error("Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI in your .env file.");
    process.exit(1);
}

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

/**
 * Step A: Generates the consent URL and prompts the user to visit it.
 */
function generateAuthUrl() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // THIS IS CRITICAL: It tells Google you need a Refresh Token.
        scope: SCOPES,
        prompt: 'consent' // Forces consent, ensuring you get a new Refresh Token.
    });
    
    console.log('--- STEP A: Visit this URL to grant access ---');
    console.log('1. Open this URL in your browser and approve access (log in as the dedicated Google user):');
    console.log(authUrl);
}

/**
 * Step B: Takes the code from the redirected URL and exchanges it for tokens.
 * @param {string} code - The code parameter returned by Google.
 */
async function getTokensFromCode(code) {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        
        console.log('\n--- STEP B: SUCCESS ---');
        console.log('The following Refresh Token MUST be saved securely:');
        
        // This is the value you need to save in your .env file.
        console.log('YOUR REFRESH TOKEN:', tokens.refresh_token); 
        
        console.log('\n--- IMPORTANT ---');
        console.log('Copy this REFRESH TOKEN and place it in your .env file:');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log('You can now remove this temporary script.');

    } catch (error) {
        console.error('Error retrieving token:', error);
    }
}

// --- Main execution ---
generateAuthUrl();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('\n2. Paste the URL code fragment received after consent (e.g., 4/AbCdE...): ', (code) => {
    rl.close();
    getTokensFromCode(code.trim());
});
