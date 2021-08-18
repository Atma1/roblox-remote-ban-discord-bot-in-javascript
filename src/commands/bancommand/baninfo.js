const { createBanInfoEmbed } = require('@util/util');
const { MessageActionRow } = require('discord.js');
const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const { getUserImg } = require('@modules/getUserImg');
const PlayerProfileButton = require('@class/Button/PlayerProfileButton');

module.exports = class BanInfoCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			'baninfo',
			'Check ban information for the player specified if exists.',
			'<playerName>', {
				example: 'baninfo joemama',
				defaultPermission: false,
				slashCommandOptions: [{
					name: 'playername',
					description: 'The player of the name to search. Case sensitive!',
					type: 'STRING',
					required: true,
				}],
			});
	}
	async execute(interaction, interactionOptions) {
		const { guildId } = interaction;
		const playerName = interactionOptions.getString('playername');

		try {
			await interaction.deferReply();
			const querySnapshot = await this.retriveBanDocument(playerName, guildId);
			if (querySnapshot.empty) {
				return interaction.editReply({ content:`${playerName} is not found in the database.`,
					allowedMentions: { repliedUser: true } });
			}
			const documents = querySnapshot.docs;
			const [ banDocument ] = documents;
			const data = banDocument.data();
			const { playerID } = data;
			const userImage = await getUserImg(playerID);
			const playerProfileButton = new PlayerProfileButton(playerID);
			const messageRow = new MessageActionRow({ components: [playerProfileButton] });
			const banInfoEmbed = createBanInfoEmbed(data, userImage, playerName);
			return interaction.editReply({ embeds: [banInfoEmbed], components: [messageRow] });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content:`There was an error while attempting to retrive the document!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } });
		}
	}
};