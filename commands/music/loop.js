const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode, useQueue } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Sets loop mode')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('loop variant')
				.setRequired(true)
				.addChoices(
					{
						name: 'Off',
						value: 'Off',
					},
					{
						name: 'Track',
						value: 'Track',
					},
					{
						name: 'Queue',
						value: 'Queue',
					},
					{
						name: 'Autoplay',
						value: 'Autoplay',
					},
				)),
	async execute(interaction) {
		try {
			const isConnected2VC = connected2VC(interaction);
			if (!isConnected2VC) {
				return;
			}

			await interaction.deferReply();


			const queue = useQueue(interaction.guild.id);
			if (!queue || !queue.currentTrack) {
				return void interaction.followUp({ content: 'No music is being played!' });
			}

			const category = interaction.options.getString('category');
			if (category == 'Off') {
				queue.setRepeatMode(QueueRepeatMode.OFF);
			}
			else if (category == 'Track') {
				queue.setRepeatMode(QueueRepeatMode.TRACK);
			}
			else if (category == 'Queue') {
				queue.setRepeatMode(QueueRepeatMode.QUEUE);
			}
			else if (category == 'Autoplay') {
				queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
			}
			else {
				console.log(Date.now() + ': ' + 'Fehler bei loop.js');
			}

			const loopMode = interaction.options.getString('category');

			return void interaction.followUp({
				content: `Updated loop mode ${loopMode}!`,
			});
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "loop":\n' + error);
			return void interaction.followUp({
				content: 'There was an error trying to execute that command: ' + error.message,
			});
		}
	},
};