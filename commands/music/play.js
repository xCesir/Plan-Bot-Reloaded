const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { connected2VC } = require('../../utils/connected2VC.js');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Name or YT url')
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
			const searchResult = await player.search(query);
			if (!searchResult.hasTracks()) return void interaction.followUp({ content: 'No results found!' });

			try {
				await player.play(interaction.member.voice.channel.id, searchResult, {
					nodeOptions: {
						metadata: {
							channel: interaction.channel,
							client: interaction.guild?.members.me,
							requestedBy: interaction.user.username,
						},
						leaveOnEmptyCooldown: 300000,
						leaveOnEmpty: true,
						leaveOnEnd: false,
						bufferingTimeout: 0,
						volume:  10,
					},
				});

				await interaction.followUp({
					content: `Fetching ${searchResult.playlist ? 'playlist' : 'track'}...`,
				});
			}
			catch (error) {
				await interaction.editReply({
					content: 'An error has occurred!',
				});
				return console.log(Date.now() + ': ' + error);
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "play":\n' + error);
			await interaction.reply({
				content: 'There was an error trying to execute that command: ' + error.message,
			});
		}
	},
};