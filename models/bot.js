import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const BOT_TOKEN = process.env.BOT_TOKEN;
client.login(BOT_TOKEN);

client.once('ready', () => {
    console.log('Bot is online!');
});

export default client;