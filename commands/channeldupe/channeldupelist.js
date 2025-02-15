const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { dbquery } = require('../../utils/dbquery');

module.exports = {
	category: 'channeldupe',
	data: new SlashCommandBuilder()
		.setName('channeldupelist')
		.setDescription('List voice channel to duplicate.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		try {
			const rows = await dbquery('SELECT * FROM channelDupe');
			interaction.reply(JSON.stringify(rows, null, 2));
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "channeldupelist":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}

	},
};