const { GuildMember } = require('discord.js');

const connected2VC = (interaction) => {
	if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
		interaction.reply({
			content: 'You\'re not in a voice channel!',
			ephemeral: true,
		});
		return false;
	}

	if (
		interaction.guild.members.me.voice.channelID &&
        interaction.member.voice.channelID !== interaction.guild.members.me.voice.channelID
	) {
		interaction.reply({
			content: 'You\'re not in the same voice channel!',
			ephemeral: true,
		});
		return false;
	}

	return true;
};

exports.connected2VC = connected2VC;