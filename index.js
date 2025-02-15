const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMembers ] });

client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(Date.now() + ': ' + `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


const player = new Player(client);

player.extractors.register(YoutubeiExtractor, {});

player.events.on('audioTrackAdd', (queue, song) => {
	queue.metadata.channel.send(`Song **${song.title}** added to the queue!`);
});

player.events.on('playerStart', (queue, track) => {
	queue.metadata.channel.send(`Playing: **${track.title}**!`);
});

player.events.on('audioTracksAdd', (queue, track) => {
	queue.metadata.channel.send('Tracks have been queued! ' + track);
});

player.events.on('disconnect', queue => {
	queue.metadata.channel.send('Disconnected from the voice channel!');
});


player.events.on('emptyQueue', queue => {
	queue.delete();
});

player.events.on('error', (queue, error) => {
	console.log(Date.now() + ': ' + `[${queue.guild.name}] Error: ${error.message}`);
});

client.login(token);
