import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { generateImage } from '../invitation/generateImage.js';

export default {
    data: new SlashCommandBuilder()
        .setName('from')
        .setDescription('Get Your Personalized Invite Card')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The Name of the User')
                .setRequired(true)
        ),
        
    async execute(interaction) {
        const name = interaction.options.getString('name');

        try {
            const outputPath = await generateImage('./controllers/invitation/template_from.png', name);
            const attachment = new AttachmentBuilder(outputPath);

            await interaction.reply({
                content: `✨ 🎉 ✨ 🎉 ✨ 🎉 ✨\n` +
                        `\n` +
                        `🌟 **CONGRATULATIONS ${name.toUpperCase()}!** 🌟\n` +
                        `Your exclusive WeRide invite card is here!\n` +
                        `\n` +
                        `🚲 **Share the Joy of WeRide!** 🚲\n` +
                        `>>> Save this special card and invite your friends\n` +
                        `to join our amazing community!\n` +
                        `\n` +
                        `*Together, we're not just riding...\n` +
                        `We're creating memories!* ✨\n` +
                        `\n` +
                        `✨ 🎉 ✨ 🎉 ✨ 🎉 ✨`,
                files: [attachment],
                ephemeral: false,
            });

            fs.unlinkSync(outputPath);
        } catch (error) {
            console.error('Error handling "from" command:', error);
            await interaction.reply({
                content: 'An error occurred while generating your invite card.',
                ephemeral: true,
            });
        }
    },
};  