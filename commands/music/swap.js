const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('swap')
		.setDescription('swap song positions in the queue!')
		.addIntegerOption(option =>
			option.setName('track1')
				.setDescription('The track number you want to swa')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('track2')
				.setDescription('The track number you want to swa')
				.setRequired(true),
		),
	async execute(interaction) {
		try {
			const isConnected2VC = connected2VC(interaction);
			if (!isConnected2VC) {
				return;
			}

			await interaction.deferReply();
			const queue = useQueue(interaction.guild.id);
			if (!queue || !queue.currentTrack) return void interaction.followUp({ content: 'No music is being played!' });
			const queueNumbers = [interaction.options.getInteger('track1') - 1, interaction.options.getInteger('track2') - 1];
			// Sort so the lowest number is first for swap logic to work
			queueNumbers.sort(function(a, b) {
				return a - b;
			});
			if (queueNumbers[1] > queue.getSize()) {return void interaction.followUp({ content: 'Track number greater than queue depth!' });}

			try {
				// Remove higher track first to avoid list order issues
				const track2 = queue.node.remove(queueNumbers[1]);
				const track1 = queue.node.remove(queueNumbers[0]);
				// Add track in lowest position first to avoid list order issues
				queue.node.insert(track2, queueNumbers[0]);
				queue.node.insert(track1, queueNumbers[1]);
				return void interaction.followUp({
					content: `Swapped **${track1}** & **${track2}**!`,
				});
			}
			catch (error) {
				console.log(Date.now() + ': ' + error);
				return void interaction.followUp({
					content: 'Something went wrong!',
				});
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "swap":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};