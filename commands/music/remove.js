const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('remove a song from the queue!')
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription('The queue number you want to remove')
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
			const number = interaction.options.getInteger('number') - 1;
			if (number > queue.tracks.size) {return void interaction.followUp({ content: 'Track number greater than queue depth!' });}
			const removedTrack = queue.node.remove(number);
			return void interaction.followUp({
				content: removedTrack ? `Removed **${removedTrack}**!` : 'Something went wrong!',
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "remove":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};