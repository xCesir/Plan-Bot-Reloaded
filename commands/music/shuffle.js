const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('shuffle the queue!'),
	async execute(interaction) {
		try {
			const isConnected2VC = connected2VC(interaction);
			if (!isConnected2VC) {
				return;
			}
			await interaction.deferReply();
			const queue = useQueue(interaction.guild.id);
			if (!queue || !queue.currentTrack) return void interaction.followUp({ content: 'No music is being played!' });
			queue.tracks.shuffle();
			const trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
			return void interaction.followUp({
				embeds: [
					{
						title: 'Now Playing',
						description: trimString(
							`The Current song playing is **${queue.currentTrack.title}**! \n | ${queue}! `,
							4095,
						),
					},
				],
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "shuffle":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};