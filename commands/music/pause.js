const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pause playback!'),
	async execute(interaction) {
		try {
			const isConnected2VC = connected2VC(interaction);
			if (!isConnected2VC) {
				return;
			}

			await interaction.deferReply();
			const queue = useQueue(interaction.guild.id);
			if (!queue || !queue.currentTrack) {
				return void interaction.followUp({
					content: 'Music stopped!',
				});
			}
			const success = queue.node.pause();
			return void interaction.followUp({
				content: success ? 'Paused!' : 'Ups... something went wrong!',
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "pause":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};