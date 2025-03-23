const { Events, EmbedBuilder } = require('discord.js');
const { goodbyeMessageTitle, goodbyeMessage, goodbyeChannelId } = require('../config.json');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		try {
			console.log(`guildMemberRemove: ${member}`);
			const fetchedLogs = await member.guild.fetchAuditLogs();
			const kickLog = fetchedLogs.entries.first();
			const { executor, target } = kickLog;
			console.log(kickLog);

			if (kickLog.createdAt < member.joinedAt) {
				goodbye(member);
				return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
			}
			if (target.id === member.id) {
				kickgoodbye(member, executor);
				console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}`);
			} else {
				console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "guildMemberRemove":\n' + error);
		}
	},
};

function goodbye(member) {
	const exampleEmbed = new EmbedBuilder()
		.setColor(0xe30825)
		.setTitle(goodbyeMessageTitle.replace('$(member)', member.user.username))
		.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
		.setDescription(goodbyeMessage.replace('$(member)', member.user.username));
	member.guild.channels.cache.get(goodbyeChannelId).send({ embeds: [exampleEmbed] });

}

function kickgoodbye(member, executor) {
	const exampleEmbed = new EmbedBuilder()
		.setColor(0xe30825)
		.setTitle(`${member.user.tag} has been kicked from the server.`)
		.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
		.setDescription(`${member.user.tag} was kicked by ${executor.tag}.`);
	member.guild.channels.cache.get(goodbyeChannelId).send({ embeds: [exampleEmbed] });

}