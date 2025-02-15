const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		try {
			await interaction.reply('Pong!');
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "ping":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};
