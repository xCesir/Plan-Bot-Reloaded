const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const { dbquery } = require('../../utils/dbquery');

module.exports = {
	category: 'reprimand',
	data: new SlashCommandBuilder()
		.setName('reprimand')
		.setDescription('Reprimand a user.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to reprimand')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for banning'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		try {
			const target = await interaction.options.getMember('target');
			const targetId = target?.id;
			const reason = await interaction.options.getString('reason') ?? 'No reason provided';
			const creatorId = await interaction.user.id;
			const creatorName = await interaction.user.username;
			const d = new Date();

			console.log(`Reprimanding ${target}, displayName ${target.displayName} and id ${targetId} for reason: ${reason}`);

			const rows = await dbquery('INSERT INTO reprimand(userID,reason,createdAt,creatorId,creatorName) value (?,?,?,?,?)', [targetId, reason, d, creatorId, creatorName]);
			BigInt.prototype.toJSON = function() {
				return JSON.rawJSON(this.toString());
			};
			const response = JSON.parse(JSON.stringify(rows));
			console.log(response);
			if (response.affectedRows === 1 && response.warningStatus === 0) {
				return await interaction.reply(`Reprimanding ${target}, displayName: "${target.displayName}" and id: "${targetId}" for reason: "${reason}"\ncreated from ${creatorName}, id ${creatorId}\n`);
			}
			return await interaction.reply('Somethins went wrong! Check reprimand status with "reprimandlist"');

		}
		catch (error) {
			console.log('An error occurred in module "reprimand":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};

