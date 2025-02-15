const { Events, EmbedBuilder } = require('discord.js');
const { logChannelId, logGuildRoleCreate } = require('../config.json');

module.exports = {
	name: Events.GuildRoleCreate,
	async execute(role) {
		try {
			const auditLogs = await role.guild.fetchAuditLogs({});

			const auditLogsFirtstEntry = auditLogs.entries.first();
			const { executor, target } = auditLogsFirtstEntry;

			const permissions = role.permissions.toArray();

			const botname = role.client.user.username;
			const boticon = role.client.user.displayAvatarURL();

			const Embed = new EmbedBuilder()
				.setColor(0xe30825)
				.setTitle('A role has been Created')
				.setAuthor({ name: botname,
					iconURL: boticon,
				})
				.setDescription(`\`${executor.tag}\` with the id \`${executor.id}\`
                            has created the role \`${target.name}\` with the id \`${target.id}\`,
                            with the color \`${target.color}\` and the permissons:
                            \` ${permissions} \`.`)
				.setTimestamp()
				.setFooter({ text: 'Log message by Plan-Bot-Reloaded ' });

			if (logGuildRoleCreate == 'true') {
				role.guild.channels.cache.get(logChannelId).send({ embeds: [Embed] });
				console.log(Date.now() + ': ' + `'${executor.tag}' with the id '${executor.id}' has created the role '${target.name}' with the id '${target.id}'`);

			}
        	}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "roleCreate":\n' + error);
		}
	},
};