const { Events, EmbedBuilder } = require('discord.js');
const { logChannelId, logGuildBanAdd } = require('../config.json');

module.exports = {
	name: Events.GuildBanAdd,
	async execute(guildBan) {
		try {
			const auditLogs = await guildBan.guild.fetchAuditLogs({});

			const auditLogsFirtstEntry = auditLogs.entries.first();
			const { executor, target } = auditLogsFirtstEntry;

			let banReason = auditLogsFirtstEntry.reason;
			if (banReason === null) {banReason = 'No reason given';}

			const botname = guildBan.client.user.username;
			const botIcon = guildBan.client.user.displayAvatarURL();

			const Embed = new EmbedBuilder()
				.setColor(0xe30825)
				.setTitle('A user was banned')
				.setAuthor({ name: botname,
					iconURL: botIcon,
				})
				.setDescription(`\`${target.tag}\` with the id \`${target.id}\`
								was banned from \`${executor.tag}\` with the id \`${executor.id}\`.
								was banned with the reason 
								\`${banReason}\``)
				.setThumbnail()
				.setTimestamp()
				.setFooter({ text: 'Log message by Plan-Bot-Reloaded ' });

			if (logGuildBanAdd == 'true') {
				guildBan.guild.channels.cache.get(logChannelId).send({ embeds: [Embed] });
				console.log(Date.now() + ': ' + `'${target.tag}' with the id '${target.id}' was banned from '${executor.tag}' with the id '${executor.id}\\' was banned with the reason  '${banReason}'`);
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "guildBanAdd":\n' + error);
		}
	},
};