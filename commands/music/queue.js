const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('View the queue of current songs!'),
	async execute(interaction) {
		try {
			const isConnected2VC = connected2VC(interaction);
			if (!isConnected2VC) {
				return;
			}

			const queue = useQueue(interaction.guild.id);
			if (queue != null) {
				const trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

				let queueStr = '**Upcoming Songs:**\n';

				// Build queue list
				queue.tracks.data.forEach((track, index) => {
					queueStr += `${index + 1}. ${track.title} - ${track.author}\n`;
				});

				return void interaction.reply({
					embeds: [
						{
							title: `Now Playing **${queue.currentTrack.title}**`,
							description: trimString(queueStr, 4095),
						},
					],
				});
			}
			else {
				return void interaction.reply({
					content: 'There are no songs in the queue!',
				});
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "queue":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};