const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const { dbquery } = require('../../utils/dbquery');

module.exports = {
	category: 'reprimand',
	data: new SlashCommandBuilder()
		.setName('reprimandlist')
		.setDescription('List reprimand from a user.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to reprimand')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		try {
            const target = await interaction.options.getMember('target');
            const targetId = target?.id;

            const rows = await dbquery('SELECT * FROM reprimand WHERe userID=(?)', [targetId]);
            BigInt.prototype.toJSON = function() {
                return JSON.rawJSON(this.toString());
            };
            console.log(JSON.stringify(rows));
			interaction.reply(`Listing reprimanding for ${target}, displayName: ${target.displayName}, id ${targetId}\n`+JSON.stringify(rows, null, 2));
        
		}
		catch (error) {
			console.log('An error occurred in module "reprimandlist":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};

