const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Get the song that is currently playing.'),
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
					content: 'No music is being played!',
				});
			}
			const progress = queue.node.createProgressBar();
			const perc = queue.node.getTimestamp();

			return void interaction.followUp({
				embeds: [
					{
						title: 'Now Playing',
						description: `**${queue.currentTrack.title}**! (\`${perc.progress}%\`)`,
						fields: [
							{
								name: '\u200b',
								value: progress,
							},
						],
						color: 0xffffff,
					},
				],
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "nowplaying":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};