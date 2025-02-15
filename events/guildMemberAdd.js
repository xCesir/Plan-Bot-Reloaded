const { Events, EmbedBuilder } = require('discord.js');
const { welcomeMessageTitle, welcomeMessage, welcomeChannelId, autoRoleId, enableAutoRole } = require('../config.json');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		try {
			welcomenMessage(member);
			if (enableAutoRole == 'true') {
				autoRole(member, autoRoleId);
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "guildMemberAdd":\n' + error);
		}
	},
};

function autoRole(member, roleId) {
	const role = member.guild.roles.cache.find(roles => roles.id === roleId);
	member.roles.add(role);

}

function welcomenMessage(member) {
	const exampleEmbed = new EmbedBuilder()
		.setColor(0xe30825)
		.setTitle(welcomeMessageTitle.replace('$(member)', member.user.username))
		.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
		.setDescription(welcomeMessage.replace('$(member)', member.user.username));
	member.guild.channels.cache.get(welcomeChannelId).send({ embeds: [exampleEmbed] });

}