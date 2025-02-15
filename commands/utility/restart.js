const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Caution! This command will cause the bot to throw an error (and restart).')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    	async execute(interaction) {
		console.log(Date.now() + ': ' + `The Bot was restartet by ${interaction.user.username} with id ${interaction.user.id}`);
		    await interaction.reply('Bye! If properly setup I will restart immediatly after');
		    throw new Error('Bye!');
	},
};