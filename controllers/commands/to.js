import { SlashCommandBuilder } from 'discord.js';
import { generateImage } from '../invitation/generateImage.js';
import { sendInvite } from '../invitation/sendInvite.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('to') 
        .setDescription('Send Invitation Email to User')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The Name of the User')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('email')
                .setDescription('The Email of the User')
                .setRequired(true)
                .setMinLength(5)  
                .setMaxLength(320)
        ),
        
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const email = interaction.options.getString('email');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            await interaction.reply({
                content: '❌ Please provide a valid email address.',
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply();

        try {
            const outputPath = await generateImage('./controllers/invitation/template_to.png', name);
            await sendInvite(outputPath, name, email, true);
            
            fs.unlinkSync(outputPath);
            
            await interaction.editReply({
                content: `✉️ **Success!** 🎉\n\n` +
                        `📨 Invitation has been sent to \`${email}\`\n` +
                        `👤 Recipient: **${name}**\n\n` +
                        `*Your friend will receive the invite card shortly!* ✨`,
                ephemeral: false,
            });

        } catch (error) {
            console.error('Error handling "to" command:', error);
            await interaction.editReply({
                content: '❌ An error occurred while sending your invite card through email.\n' +
                        'Please try again later or contact support if the issue persists.',
                ephemeral: true,
            });
        }
    },
};