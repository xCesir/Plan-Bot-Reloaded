const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const { dbquery } = require('../../utils/dbquery');

module.exports = {
	category: 'reprimand',
	data: new SlashCommandBuilder()
		.setName('reprimandget')
		.setDescription('List reprimand.')

		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		try {
            const targetId = await interaction.user.id;

            const rows = await dbquery('SELECT * FROM reprimand WHERE userID=(?)', [targetId]);
            BigInt.prototype.toJSON = function() {
                return JSON.rawJSON(this.toString());
            };
            console.log(JSON.stringify(rows));
            //interaction.reply(JSON.stringify(rows, null, 2));
			var reply = ''
            const objs = JSON.parse(JSON.stringify(rows, null, 2));
            console.log(objs)
			for (var key in objs) {
				if (objs.hasOwnProperty(key)) {
				  reply = reply + '## Reprimand: '+(+key+1)+'\n';
				  var obj = objs[key];
				  reply = reply + 'reason: '+obj.reason+'\n';
				  reply = reply + 'creation date: '+obj.createdAt+'\n';
				  reply = reply + 'creator name: '+obj.creatorName+'\n';
				}
			  }
            await interaction.reply({content: `# Your reprimandings:\n${reply}`, flags: MessageFlags.Ephemeral });
        
		}
		catch (error) {
			console.log('An error occurred in module "reprimandget":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};

