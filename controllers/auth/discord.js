import dotenv from "dotenv";
dotenv.config();
import supabase from '../../models/supabaseClient.js';

const discordAuth = (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const scope = 'identify';
    res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${scope}&state=${userId}`
    );
};

const discordCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('Authorization was denied.');
    }

    try {
        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to fetch access token');
        }

        const tokenData = await tokenResponse.json();

        // Fetch user details using the access token
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user details');
        }

        const userData = await userResponse.json();
        const discordId=userData.id;

        const userId = req.query.state; // Extract userId passed as `state`
        if (!userId) return res.status(400).json({ message: "User ID is missing." });

        const { error: insert_error } = await supabase
            .from('users')
            .update({ discordId : discordId })
            .eq('id', userId);
        if (insert_error)
        return res.status(500).json({ message: 'Error inserting data into database: ' + insert_error.message});

        res.status(200).json({ discordId:  discordId, message: "Added DiscordID corressponding to userId"});

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(`Error authenticating with Discord: ${error.message}`);
    }
};

export { discordAuth, discordCallback };
