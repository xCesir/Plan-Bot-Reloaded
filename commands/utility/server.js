const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		try {
			await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "server":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};
