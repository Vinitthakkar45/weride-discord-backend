import dotenv from "dotenv";
dotenv.config();
import supabase from '../../models/supabaseClient.js';
import client from "../../models/bot.js";

async function sendMessageToUser(discordId, messageContent) {
    try {
        const user = await client.users.fetch(String(discordId)); 
        await user.send(messageContent);
        console.log(`Message sent to ${discordId}: ${messageContent}`);
    } catch (error) {
        console.error(`Error sending message to ${discordId}:`, error);
    }
}

const rentMessage = async (req, res) => {
    const userId=req.body.userId;
    const messageContent = req.body.message;

    const { data, error: select_error } = await supabase
        .from('users')
        .select('discord_id')
        .eq('id',userId)
    if (select_error || !(data[0].discord_id))
    return res.status(500).json({ message: 'NO DiscordId found: ' + select_error.message});

    const userDiscordId = String(data[0].discord_id);
    sendMessageToUser(userDiscordId, messageContent);
    res.status(200).send('Rental processed!');
};

export { rentMessage };