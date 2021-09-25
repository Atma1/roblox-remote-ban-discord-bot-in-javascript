const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const { getUserId } = require('@modules/getUserId');

module.exports = class UnbanCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			{
				commandName: 'unban',
				description: 'Delete the player from the database.',
				usage: '<playerName>',
				example: 'unban joemama',
				defaultPermission: false,
				slashCommandOptions: [{
					name: 'playername',
					description: 'The player of the name to unban. Case sensitive!',
					type: 'STRING',
					required: true,
				}],
			});
	}
	async execute(interaction, interactionOptions) {
		const playerName = interactionOptions.getString('playername');
		const { guildId } = interaction;
		try {
			await interaction.deferReply();
			const playerId = await getUserId(playerName);
			await this.deletePlayerBanDocument(playerId, guildId);
			return interaction.editReply({ content:`Player: ${playerName}, removed from Firebase Firestore.` });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content: error })
				.catch(err => console.error(err));
		}
	}
};