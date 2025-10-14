// quick_oauth_server.js
import express from 'express';
import open from 'open';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import fs from 'fs/promises';
dotenv.config();

const {
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
} = process.env;

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_FILE = './new_refresh_token.json';

const app = express();

function createClient() {
    return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
}

app.get('/auth', async (req, res) => {
    const oauth2 = createClient();
    const url = oauth2.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES });
    await open(url);
    res.send(`Opened consent page. After consenting you'll be redirected to ${GOOGLE_REDIRECT_URI}`);
});

app.get('/oauth2callback', async (req, res) => {
    try {
        const code = req.query.code;
        const oauth2 = createClient();
        const { tokens } = await oauth2.getToken(code);
        await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2), 'utf8');
        res.send('Tokens saved to ' + TOKEN_FILE + '. Look inside for refresh_token.');
    } catch (err) {
        console.error('Exchange error:', err.response?.data || err.message || err);
        res.status(500).send('Error exchanging code. Check server logs.');
    }
});

app.listen(3000, () => console.log('Open http://localhost:3000/auth to re-authorize'));
