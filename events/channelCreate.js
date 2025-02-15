const { Events, EmbedBuilder } = require('discord.js');
const { logChannelCreate, logChannelId } = require('../config.json');

module.exports = {
	name: Events.ChannelCreate,
	async execute(channel) {
		try {
			const auditLogs = await channel.guild.fetchAuditLogs();
			const auditLogsFirtstEntry = auditLogs.entries.first();
			if (auditLogsFirtstEntry.executor.id !== channel.client.user.id) {
				if (!channel.partial) {
					const channelName = channel.name;
					const channelId = channel.id;

					const username = auditLogsFirtstEntry.executor.username;
					// const userdiscriminator = auditLogsFirtstEntry.executor.discriminator;
					const userId = auditLogsFirtstEntry.executor.id;

					const botname = channel.client.user.username;
					const botIcon = channel.client.user.displayAvatarURL();

					const Embed = new EmbedBuilder()
						.setColor(0xe30825)
						.setTitle('A Channel was created')
						.setAuthor({ name: botname,
							iconURL: botIcon,
						})
						.setDescription(`\`${username}\` with the id \`${userId}\`\n has created the channel \`${channelName}\` with the id \`${channelId}\` `)
						.setThumbnail(botIcon)
						.setTimestamp()
						.setFooter({ text: 'Log message by Plan-Bot-Reloaded ' });


					if (logChannelCreate == 'true') {
						channel.guild.channels.cache.get(logChannelId).send({ embeds: [Embed] });
						console.log(Date.now() + ': ' + `${username} with the id ${userId} has created the channel ${channelName} with the id ${channelId}`);
					}
				}
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "nowplaying":\n' + error);
		}
	},
};