const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user.')
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('Enter a userId.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
		try {
			const userId = interaction.options.getString('userid').toLowerCase();
			const rep = await interaction.guild.members.ban(userId);
			console.log(`User banned: ${rep}`);
			if (rep === userId) {
				return interaction.reply(`User with id ${userId} banned successfully!`);
			}
			interaction.reply('Something went wrong!');
		}
		catch (error) {
			if (error == 'DiscordAPIError[10013]: Unknown User') {
				interaction.reply('Not a valid userId');
			}
			else {
				console.log('An error occurred in module "ban":\n' + error);
				interaction.reply('Something went wrong!');
			}
		}
	},
};