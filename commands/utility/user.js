const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		try {
			await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "channelCreate":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};
