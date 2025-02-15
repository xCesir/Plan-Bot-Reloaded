const { Events, EmbedBuilder } = require('discord.js');
const { goodbyeMessageTitle, goodbyeMessage, goodbyeChannelId } = require('../config.json');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		try {
			goodbye(member);
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