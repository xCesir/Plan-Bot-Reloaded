const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Caution! This command will restart the bot.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    	async execute(interaction) {
		await interaction.reply('Bye! If properly setup, I will restart immediately after.');
		exec('pm2 restart 0', (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
		});
	},
};