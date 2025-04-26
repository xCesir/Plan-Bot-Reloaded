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

			const rows = await dbquery('SELECT * FROM reprimand WHERE userID=(?)', [targetId]);
			BigInt.prototype.toJSON = function() {
				return JSON.rawJSON(this.toString());
			};
			console.log(JSON.stringify(rows));
			// interaction.reply(JSON.stringify(rows, null, 2));
			let reply = '';
			const objs = JSON.parse(JSON.stringify(rows, null, 2));
			console.log(objs);
			for (const key in objs) {
				if (Object.prototype.hasOwnProperty.call(objs, key)) {
							  reply = reply + '## Reprimand: ' + (+key + 1) + '\n';
							  const obj = objs[key];
							  reply = reply + 'ID: ' + obj.ID + '\n';
							  reply = reply + 'userID: ' + obj.userID + '\n';
							  reply = reply + 'reason: ' + obj.reason + '\n';
							  reply = reply + 'creation date: ' + obj.createdAt + '\n';
							  reply = reply + 'creator name: ' + obj.creatorName + '\n';
							  reply = reply + 'creator id: ' + obj.creatorId + '\n';
				}
						  }
			if (reply === '') {
				return await interaction.reply(`Listing reprimanding for ${target}, displayName: "${target.displayName}", id: "${targetId}"\nNo reprimandings found`);
			}
			return interaction.reply(`# Listing reprimanding for ${target}, displayName: "${target.displayName}", id: "${targetId}"\n` + reply);


		}
		catch (error) {
			console.log('An error occurred in module "reprimandlist":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};

