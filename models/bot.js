import { Client, GatewayIntentBits, REST, Routes, Collection, Events } from 'discord.js';
import dotenv from 'dotenv';
import deleteUser from '../controllers/commands/deleteUser.js';
import pingpong from '../controllers/commands/pingpong.js';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
    ],
});

client.commands = new Collection();

const commands = [deleteUser.data,pingpong.data];
client.commands.set(deleteUser.data.name, deleteUser);
client.commands.set(pingpong.data.name, pingpong);

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands.map(command => command.toJSON()) }
        );

        console.log('Successfully registered application (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: false,
        });
    }
});

client.login(BOT_TOKEN);

export default client;
