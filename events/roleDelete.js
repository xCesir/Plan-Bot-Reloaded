const { Events, EmbedBuilder } = require('discord.js');
const { logChannelId, logGuildRoleDelete } = require('../config.json');

module.exports = {
	name: Events.GuildRoleDelete,
	async execute(role) {
		try {
			const auditLogs = await role.guild.fetchAuditLogs({});

			const auditLogsFirtstEntry = auditLogs.entries.first();
			const { executor, target } = auditLogsFirtstEntry;
			// const { executor, target, changes} = auditLogsFirtstEntry;

			const botname = role.client.user.username;
			const boticon = role.client.user.displayAvatarURL();

			const Embed = new EmbedBuilder()
				.setColor(0xe30825)
				.setTitle('A role has been deleted')
				.setAuthor({ name: botname,
					iconURL: boticon,
				})
				.setDescription(`\`${executor.tag}\` with the id \`${executor.id}\`
                            has deleated the role \`${role.name}\` with the id \`${target.id}\`.`)
				.setTimestamp()
				.setFooter({ text: 'Log message by Plan-Bot-Reloaded ' });

			if (logGuildRoleDelete == 'true') {
				role.guild.channels.cache.get(logChannelId).send({ embeds: [Embed] });
				console.log(Date.now() + ': ' + `'${executor.tag}' with the id '${executor.id}' has deleated the role '${role.name}' with the id '${target.id}'`);
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "roleDelete":\n' + error);
		}
	},
};