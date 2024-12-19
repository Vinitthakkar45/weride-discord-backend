import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with "pong"'),

    async execute(interaction) {

        try {
            await interaction.reply({
                content: "pong",
                ephemeral: false,
            });
        } catch (error) {
            console.error('Error handling "ping" command:', error);
            await interaction.reply({
                content: 'An unexpected error occurred while processing "ping" command.',
                ephemeral: false,
            });
        }
    },
};