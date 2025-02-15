const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'coin',
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a coin'),
	async execute(interaction) {
		try {
			const num = Math.floor(Math.random() * 2);
			let coinVal;
			switch (num) {
			case 0:
				coinVal = 'Heads';
				break;
			case 1:
				coinVal = 'Tails';
				break;
			default:
				interaction.reply('Microschrott sagt nein');
				break;
			}
			interaction.reply({ content: `The coin landed on ${coinVal}!` });

		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "coinflip":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};
