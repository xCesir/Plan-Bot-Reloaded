const { AuditLogEvent, Events, EmbedBuilder } = require('discord.js');
const { goodbyeMessageTitle, goodbyeMessage, goodbyeChannelId, logChannelId } = require('../config.json');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		try {
			console.log('guildMemberRemove:\n'+JSON.stringify(member));
			const fetchedLogs = await member.guild.fetchAuditLogs();
			const kickLog = fetchedLogs.entries.first();
			console.log('kickLog:\n'+JSON.stringify(kickLog))
			const { action, executor, target } = kickLog;
			console.log('executor:\n'+executor)
			console.log('target:\n'+target)
			
				// Check only for kicked users.
				if (action === AuditLogEvent.MemberKick && target.id === member.user.id){
					kickgoodbye(member, executor);
					return console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}`);
				}
				goodbye(member);
				return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
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
	member.guild.channels.cache.get(logChannelId).send({ embeds: [exampleEmbed] });
}

function kickgoodbye(member, executor) {
	const exampleEmbed = new EmbedBuilder()
		.setColor(0xe30825)
		.setTitle(`${member.user.tag} has been kicked from the server.`)
		.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
		.setDescription(`${member.user.tag} was kicked by ${executor.tag}.`);
	member.guild.channels.cache.get(goodbyeChannelId).send({ embeds: [exampleEmbed] });
	member.guild.channels.cache.get(logChannelId).send({ embeds: [exampleEmbed] });
}
