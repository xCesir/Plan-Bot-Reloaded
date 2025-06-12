const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { dbquery } = require('../../utils/dbquery');

module.exports = {
	category: 'channeldupe',
	data: new SlashCommandBuilder()
		.setName('channelduperemove')
		.setDescription('Remove channel from channel duplication.')
		.addStringOption(option =>
			option.setName('channelid')
				.setDescription('Enter a voice channel ID.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {

		try {
			const channelID = interaction.options.getString('channelid').toLowerCase();

			const channel = interaction.guild.channels.resolve(channelID);

			// const name = channel.name;

			if (channel.type == '2') {
				const rows = await dbquery('DELETE FROM channelDupe WHERE channelID = (?)', [channelID]);
				BigInt.prototype.toJSON = function() {
					return JSON.rawJSON(this.toString());
				};
				console.log(Date.now() + ': ' + JSON.stringify(rows));
				interaction.reply(JSON.stringify(rows, null, 2));
			}
			interaction.reply('Something went wrong!');

		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "channelduperemove":\n: ' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}

	},
};