const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(messageCreate) {
		try {

			if (messageCreate.author.id !== messageCreate.client.user.id) {console.log(Date.now() + ': ' + `${messageCreate.author.username} with id ${messageCreate.author.id} created a message in channel with id ${messageCreate.channelId}  -> ${messageCreate.content}`);};

			if (messageCreate.content.startsWith('Ping!')) {
				return messageCreate.reply('Pong!');
			}
			else if (messageCreate.content.startsWith('Pong!') && messageCreate.author.id !== messageCreate.client.user.id) {
				return messageCreate.reply('Ping!');
				// console.log(Date.now() + ': ' + 'Bot: Pong!')
			}
		}
		catch (error) {
			console.log(Date.now() + ': ' + 'An error occurred in module "messageCreate":\n' + error);
		}
	},
};