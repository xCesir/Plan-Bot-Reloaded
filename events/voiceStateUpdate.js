const { Events } = require('discord.js');
const { dbquery } = require('../utils/dbquery.js');


module.exports = {
	name: Events.VoiceStateUpdate,
	    async execute(oldState, newState) {
		try {
			if (!oldState.channel && newState.channel) {
				// User joined a voice channel
				console.log(Date.now() + ': ' + `${newState.member.user.tag} joined ${newState.channel.name} with id ${newState.channel.id}`);
				// checkForChannelDupe(newState.channel.id, newState)
				checkForChannelDupe(newState.channel.id, newState);
			}
			else if (oldState.channel && !newState.channel) {
				// User left a voice channel
				console.log(Date.now() + ': ' + `${oldState.member.user.tag} left ${oldState.channel.name} with id ${oldState.channel.id}`);
				checkForChannelDupe(oldState.channel.id, oldState);
			}
			else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
				// User switched a voice channel
				console.log(Date.now() + ': ' + `${oldState.member.user.tag} left ${oldState.channel.name} with id ${oldState.channel.id} and joined ${newState.channel.name} with id ${newState.channel.id}`);
				if (await checkForGroupId(oldState.channel.id, newState.channel.id)) {
					checkForChannelDupe(newState.channel.id, newState);
				}
				else {
					checkForChannelDupe(newState.channel.id, newState);
					checkForChannelDupe(oldState.channel.id, oldState);
				}
			}
			else if (oldState.serverMute !== newState.serverMute) {
				// User's mute status changed
				if (newState.serverMute) {
					console.log(Date.now() + ': ' + `${newState.member.user.tag} was muted`);
				}
				else {
					console.log(Date.now() + ': ' + `${newState.member.user.tag} was unmuted`);
				}
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "voiceStateUpdate":\n' + error);
		}
	},
};

function checkForGroupId(oldChannelID, newChannelID) {
	return dbquery('SELECT groupID FROM channelDupe where channelID = (?) OR channelID = (?)', [oldChannelID, newChannelID]).then(rows => {
		const obj = JSON.parse(JSON.stringify(rows));
		if (Object.entries(obj).length > 1) {
			return (obj[0].groupID.toString() == obj[1].groupID.toString());
		}
		return false;
	},
	);
}

function checkForChannelDupe(channelID, state) {
	dbquery('SELECT channelID,NAME,groupID FROM channelDupe where channelID = (?)', [channelID]).then(rows => {
		const obj = JSON.parse(JSON.stringify(rows));
		if (Object.entries(obj).length > 0) {
			obj.forEach(element => {
				duplicateChannelIfNecessary(state, element.groupID);
			});
		}
	},
	);
}


function duplicateChannelIfNecessary(state, groupID) {
	dbquery('SELECT channelID,NAME,groupID FROM channelDupe where groupID = (?)', [groupID]).then(rows => {
		const jsonobj = JSON.parse(JSON.stringify(rows));
		const emptyChannels = [];
		jsonobj.forEach(element => {
			const guild = state.guild;
			const voiceChannel = guild.channels.cache.get(element.channelID);
			if (voiceChannel.members.size == 0) {
				emptyChannels.push(element.channelID);
			}
		},
		);

		switch (true) {
		case emptyChannels.length == 0:
			state.channel.clone().then(respones => dbquery('INSERT INTO channelDupe VALUES(?, ?, ?)', [respones.id, respones.name, groupID]));
			break;
		case emptyChannels.length == 1:
			break;
		case emptyChannels.length > 1:
			for (let i = 1; i < emptyChannels.length; i++) {
				const guild = state.guild;
				const voiceChannel = guild.channels.cache.get(emptyChannels[i], { force: true });
				voiceChannel.delete();
				dbquery('DELETE FROM channelDupe where channelID = (?)', [emptyChannels[i]]);
			}
			break;
		default:
			console.log(Date.now() + ': ' + 'What?');
		}
	},
	);
}