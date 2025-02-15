const { Events, EmbedBuilder } = require('discord.js');
const { logChannelId, logGuildRoleUpdate } = require('../config.json');

module.exports = {
	name: Events.GuildRoleUpdate,
	async execute(oldRole, newRole) {
		try {
			if (!oldRole.partial && !newRole.partial) {

				const auditLogs = await oldRole.guild.fetchAuditLogs({});

				const auditLogsFirtstEntry = auditLogs.entries.first();
				const { executor, target } = auditLogsFirtstEntry;

				if (oldRole.rawPosition === newRole.rawPosition && (oldRole.permissions !== newRole.permissions || oldRole.name !== newRole.name)) {

					const oldPermissions = oldRole.permissions.toArray();
					const newPermissions = newRole.permissions.toArray();


					const newRolename = newRole.name;
					const oldRolename = oldRole.name;
					let rolename;
					if (newRolename === oldRolename) {
						rolename = oldRolename;
					}
					else {
						rolename = oldRolename.concat(' => ', newRolename);
					}


					const botname = oldRole.client.user.username;
					const botIcon = oldRole.client.user.displayAvatarURL();

					const Embed = new EmbedBuilder()
						.setColor(0xe30825)
						.setTitle('A role has bin Updated')
						.setAuthor({ name: botname,
							iconURL: botIcon,
						})
						.setDescription(`\`${executor.tag}\` with the id \`${executor.id}\`
                                has edited the role \`${rolename}\` with the id \`${target.id}\`,
                                the following permissons from:
                                \` ${oldPermissions} \`
                                to:
                                \` ${newPermissions} \`.`)
						.setTimestamp()
						.setFooter({ text: 'Log message by Plan-Bot-Reloaded ' });

					if (logGuildRoleUpdate == 'true') {
						newRole.guild.channels.cache.get(logChannelId).send({ embeds: [Embed] });
						console.log(Date.now() + ': ' + `'${executor.tag}' with the id '${executor.id}' has edited the role '${rolename}' with the id '${target.id}'`);
					}
				}
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "roleUpdate":\n' + error);
		}
	},
};