const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('secretping')
		.setDescription('Replies with Pong but it\'s secret!'),
	async execute(interaction) {
		try {
			await interaction.reply({ content: 'Secret Pong!', flags: MessageFlags.Ephemeral });
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "secretping":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};
