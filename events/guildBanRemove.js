const { Events, EmbedBuilder } = require('discord.js');
const { logChannelId, logGuildBanRemove } = require('../config.json');

module.exports = {
	name: Events.GuildBanRemove,
	async execute(guildBan) {
		try {
			const auditLogs = await guildBan.guild.fetchAuditLogs({});

			const auditLogsFirtstEntry = auditLogs.entries.first();
			const { executor, target } = auditLogsFirtstEntry;

			let unbanReason = auditLogsFirtstEntry.reason;
			if (unbanReason === null) {unbanReason = 'No reason given';}

			const botname = guildBan.client.user.username;
			const botIcon = guildBan.client.user.displayAvatarURL();

			const Embed = new EmbedBuilder()
				.setColor(0xe30825)
				.setTitle('A user was unbanned')
				.setAuthor({ name: botname,
					iconURL: botIcon,
				})
				.setDescription(`\`${target.tag}\` with the id \`${target.id}\`
                            was unbanned from \`${executor.tag}\`
                            with the id \`${executor.id}\`.`)
				.setThumbnail()
				.setTimestamp()
				.setFooter({ text: 'Log message by Plan-Bot-Reloaded ' });

			if (logGuildBanRemove == 'true') {
				guildBan.guild.channels.cache.get(logChannelId).send({ embeds: [Embed] });
				console.log(Date.now() + ': ' + `'${target.tag}' with the id '${target.id}' was unbanned from '${executor.tag}' with the id '${executor.id}'.`);
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "guildBanRemove":\n' + error);
		}
	},
};
