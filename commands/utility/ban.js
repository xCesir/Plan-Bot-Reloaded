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
			console.log(rep);
			interaction.reply(rep);
		}
		catch (error) {
			console.log('An error occurred in module "ban":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};