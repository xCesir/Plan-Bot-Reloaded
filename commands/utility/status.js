const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Display bot status.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    	async execute(interaction) {

		exec('pm2 jlist', (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			// console.log(`stdout: ${stdout}`);
			try {
				const objs = JSON.parse(JSON.stringify(stdout, null, 2));
				const parsedData = JSON.parse(objs);
				let reply = '# Status:\n';
				reply = reply + '## ID: ' + parsedData[0].pm2_env.pm_id + '\n';
				reply = reply + '## pid: ' + parsedData[0].pid + '\n';
				reply = reply + '## user: ' + parsedData[0].pm2_env.username + '\n';
				reply = reply + '## name: ' + parsedData[0].pm2_env.name + '\n';
				reply = reply + '## namespace: ' + parsedData[0].pm2_env.namespace + '\n';
				reply = reply + '## status: ' + parsedData[0].pm2_env.status + '\n';
				reply = reply + '## pm_uptime: ' + (Date.now() - parsedData[0].pm2_env.pm_uptime) + ' ms\n';
				reply = reply + '## exec_mode: ' + parsedData[0].pm2_env.exec_mode + '\n';
				reply = reply + '## restarts ↺: ' + parsedData[0].pm2_env.restart_time + '\n';
				reply = reply + '## version: ' + parsedData[0].pm2_env.version + '\n';
				reply = reply + '## cpu: ' + parsedData[0].monit.cpu + '% \n';
				reply = reply + '## memory: ' + (parsedData[0].monit.memory / 1000000) + ' mb\n';
				reply = reply + '## watching: ' + parsedData[0].pm2_env.watch + '\n';
				interaction.reply(reply);
			  }
			catch (err) {
				console.error('Error parsing JSON:', err);
			  }
		});
	},
};