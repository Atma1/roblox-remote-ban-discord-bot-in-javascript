const { PermBanInfoEmbed } = require('@class/EmbedBanMessage');
const { MessageActionRow } = require('discord.js');
const DataBaseRelatedSlashCommandClass = require('@class/DataBaseRelatedSlashCommandClass');
const PlayerBanDocument = require('@class/PlayerBanDocumentClass');
const PlayerProfileButton = require('@class/PlayerProfileButton');
const { getUserId } = require('@modules/getUserId');
const { getUserImg } = require('@modules/getUserImg');
const { trimString:trim, formatToUTC } = require('@util/util');

module.exports = class PermBanCommand extends DataBaseRelatedSlashCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'ban',
			'Ban player permanently. To edit the ban, just rerun the command.',
			'<playerName> <banReason(Optional)>', {
				aliases: ['addban', 'banplayer', 'bn', 'permban', 'pb'],
				example: 'ban joemama joemama is too fat',
				cooldown: '5s',
				permission: true,
				slashCommandOptions: [{
					name: 'playername',
					description: 'The name of the player to ban. Case sensitive!',
					type: 'STRING',
					required: true,
				}, {
					name: 'reason',
					description: 'The reason why the player is banned. If longer than 1024 text it will be shortened',
					type: 'STRING',
					required: false,
				}],
			},
		);
	}
	async execute(interaction, interactionOptions) {
		const { guildId } = interaction;
		const { tag: bannedBy } = interaction.user;
		const playerName = interactionOptions.getString('playername');
		const banReason = interactionOptions.getString('reason') ?? 'No ban reason was specified';
		const bannedAt = Date.now();
		const formattedBanDate = formatToUTC(bannedAt);

		try {
			await interaction.defer();
			const playerId = await getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, trim(banReason, 1024), bannedBy, 'permaBan', bannedAt,
			);
			const [playerImage] = await Promise.all([
				getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);
			const banInfoEmbed = new PermBanInfoEmbed(
				formattedBanDate, bannedBy, playerName, playerId, trim(banReason, 1024), playerImage,
			);
			const playerProfileButton = new PlayerProfileButton(playerId);
			const messageRow = new MessageActionRow({ components: [playerProfileButton] });
			return interaction.editReply({ content:`\`${playerName} has been banned.\``, embeds: [banInfoEmbed], components: [messageRow] });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content:`There was an error while banning the player!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } });
		}
	}
};