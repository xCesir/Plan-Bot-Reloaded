const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('move song position in the queue!')
		.addIntegerOption(option =>
			option.setName('track')
				.setDescription('The track number you want to move')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('position')
				.setDescription('The position to move it to')
				.setRequired(true),
		),
	async execute(interaction) {
		const isConnected2VC = connected2VC(interaction);
		if (!isConnected2VC) {
			return;
		}

		await interaction.deferReply();
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.currentTrack) {return void interaction.followUp({ content: 'No music is being played!' });}

		const queueNumbers = [interaction.options.getInteger('track') - 1, interaction.options.getInteger('position') - 1];

		if (queueNumbers[0] > queue.tracks.size || queueNumbers[1] > queue.tracks.size) {return void interaction.followUp({ content: 'Track number greater than queue depth!' });}

		try {
			const track = queue.node.remove(queueNumbers[0]);
			queue.node.insert(track, queueNumbers[1]);
			return void interaction.followUp({
				content: `Moved **${track}**!`,
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "move":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};