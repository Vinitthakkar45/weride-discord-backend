import dotenv from "dotenv";
import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios'; 
const { post, get } = axios; 

dotenv.config();

const app = express();
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const BOT_TOKEN = process.env.BOT_TOKEN;

client.login(BOT_TOKEN);

app.use(express.json()); 

app.get('/auth/discord', (req, res) => {
    const redirectUri = process.env.REDIRECT_URI;
    const scope = 'identify';
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`);
});

app.get('/auth/discord/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('Authorization was denied by the user.');
    }

    try {
        const tokenResponse = await post('https://discord.com/api/oauth2/token', new URLSearchParams({
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.REDIRECT_URI,
            'scope': 'identify'
        }));

        const userResponse = await get('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${tokenResponse.data.access_token}`
            }
        });

        const discordId = userResponse.data.id;
        console.log(`User Discord ID: ${discordId}`);
        res.status(200).send(`You are now linked with Discord! Your ID: ${discordId}`);
    } catch (error) {
        console.error('Error during OAuth callback:', error.response ? error.response.data : error.message);
        res.status(500).send('An error occurred while processing the authorization.');
    }
});

async function sendMessageToUser(discordId, messageContent) {
    try {
        const user = await client.users.fetch(discordId);
        await user.send(messageContent);
        console.log(`Message sent to ${discordId}: ${messageContent}`);
    } catch (error) {
        console.error(`Error sending message to ${discordId}:`, error);
    }
}

app.post('/rent', (req, res) => {
    const userDiscordId = req.body.discordId;
    const messageContent = 'Your vehicle has been rented successfully!';
    sendMessageToUser(userDiscordId, messageContent);
    res.status(200).send('Rental processed!');
});

client.once('ready', () => {
    console.log('Bot is online!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
