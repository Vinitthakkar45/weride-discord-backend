import { SlashCommandBuilder } from 'discord.js';
import supabase from '../../models/supabaseClient.js';

export default {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a user by their userId')
        .addStringOption(option =>
            option
                .setName('user_id')
                .setDescription('The ID of the user to delete')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');

        try {
            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (deleteError) {
                console.error('Error deleting user:', deleteError);
                await interaction.reply({
                    content: `Failed to delete user with ID ${userId}.`,
                    ephemeral: false,
                });
                return;
            }

            await interaction.reply({
                content: `Successfully deleted user with ID ${userId}.`,
                ephemeral: false,
            });
        } catch (error) {
            console.error('Error handling delete_user command:', error);
            await interaction.reply({
                content: 'An unexpected error occurred while processing your request.',
                ephemeral: false,
            });
        }
    },
};
