const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Change the volume!')
		.addIntegerOption(option =>
			option.setName('volume')
				.setDescription('Number between 0-200')
				.setRequired(true),
		),
	async execute(interaction) {
		try {
			await interaction.deferReply();

			let volume = interaction.options.getInteger('volume');
			volume = Math.max(0, volume);
			volume = Math.min(200, volume);

			// Set the volume of the current queue
			const queue = useQueue(interaction.guild.id);
			const isConnected2VC = connected2VC(interaction);
			if (isConnected2VC && queue && queue.currentTrack) queue.node.setVolume(volume);

			return void interaction.followUp({
				content: `Volume set to ${volume}!`,
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "volume":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};