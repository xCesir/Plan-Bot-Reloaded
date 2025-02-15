const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'dice',
	data: new SlashCommandBuilder()
		.setName('xdy')
		.setDescription('Roll x y-sided die')
		.addIntegerOption(option =>
			option.setName('x')
				.setDescription('Number of die to roll')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('y')
				.setDescription('Number sides')
				.setRequired(true),
		),
	async execute(interaction) {
		try {
			const x = interaction.options.getInteger ('x');
			const y = interaction.options.getInteger('y');

			const arr = [];
			for (let index = 0; index < x; index++) {
				arr.push(Math.floor(Math.random() * y) + 1);
			}
			interaction.reply({ content: `You have rolled ${x}D${y}: ${arr}.` });
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "xDy":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};