const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip a song!'),
	async execute(interaction) {
		try {
			const isConnected2VC = connected2VC(interaction);
			if (!isConnected2VC) {
				return;
			}

			await interaction.deferReply();

			const queue = useQueue(interaction.guild.id);
			if (!queue || !queue.currentTrack) return void interaction.followUp({ content: 'No music is being played!' });
			const currentTrack = queue.currentTrack;

			const success = queue.node.skip();
			return void interaction.followUp({
				content: success ? `Skipped **${currentTrack}**!` : 'Something went wrong!',
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "skip":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};