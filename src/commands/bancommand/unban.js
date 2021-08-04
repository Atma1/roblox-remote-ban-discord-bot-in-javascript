const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const { getUserId } = require('@modules/getUserId');

module.exports = class UnbanCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			'unban',
			'Delete the player from the database.',
			'<playerName>', {
				example: 'unban joemama',
				cooldown: '5s',
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
			await interaction.defer();
			const playerId = await getUserId(playerName);
			await this.deletePlayerBanDocument(playerId, guildId);
			return interaction.editReply({ content:`Player: ${playerName}, removed from Firebase Firestore.` });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content: `There was an error while banning the player!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } });
		}
	}
};