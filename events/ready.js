const { Events } = require('discord.js');
const { readyChannel, readyMessage } = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(Date.now() + ': ' + `Ready! Logged in as ${client.user.tag}`);
		client.channels.cache.get(readyChannel).send(readyMessage);
	},
};
