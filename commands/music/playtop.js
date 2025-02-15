/* eslint-disable no-empty-function */
const { SlashCommandBuilder } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');


module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('playtop')
		.setDescription('Play a song before the next in your channel!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('The song you want to play')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const isConnected2VC = connected2VC(interaction);
			if (!isConnected2VC) {
				return;
			}

			await interaction.deferReply();

			const player = useMainPlayer();
			const query = interaction.options.getString('query');
			const searchResult = await player
				.search(query, {
					requestedBy: interaction.user,
				})
				.catch(() => {
				});
			if (!searchResult || !searchResult.tracks.length) {return void interaction.followUp({ content: 'No results were found!' });}

			const queue = useQueue(interaction.guild.id);

			try {
				if (!queue.connection) await queue.connect(interaction.member.voice.channel);
			}
			catch {
				return void interaction.followUp({
					content: 'Could not join your voice channel!',
				});
			}

			await interaction.followUp({
				content: `Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
			});
			searchResult.playlist ? queue.node.insert(searchResult.tracks, 0) : queue.node.insert(searchResult.tracks[0], 0);
			if (!queue.currentTrack) await player.play();
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "playtop":\n' + error);
			await interaction.followUp({
				content: 'There was an error trying to execute that command: ' + error.message,
			});
		}
	},
};