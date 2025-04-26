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
            const reply = JSON.stringify(rows, null, 2);
            console.log(reply)
            await interaction.reply({content: `Your reprimandings:\n${reply}`, flags: MessageFlags.Ephemeral });
        
		}
		catch (error) {
			console.log('An error occurred in module "reprimandlist":\n' + error);
			return void interaction.followUp({
				content: 'Something went wrong!',
			});
		}
	},
};

