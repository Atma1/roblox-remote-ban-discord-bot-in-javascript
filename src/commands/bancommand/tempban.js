const { TempBanInfoEmbed } = require('@class/EmbedBanMessage');
const { MessageActionRow } = require('discord.js');
const DataBaseRelatedSlashCommandClass = require('@class/DataBaseRelatedSlashCommandClass');
const PlayerBanDocument = require('@class/PlayerBanDocumentClass');
const PlayerProfileButton = require('@class/PlayerProfileButton');
const ms = require('ms');
const { getUserId } = require('@modules/getUserId');
const { getUserImg } = require('@modules/getUserImg');
const {
	isBanDuration,
	trimString:trim,
	formatToUTC,
} = require('@util/util');

module.exports = class TempBanCommand extends DataBaseRelatedSlashCommandClass {
	/**
	 * @param {Client} botClient;
	 */
	constructor(botClient) {
		super(
			botClient,
			'tempban',
			'Temporary ban the player. To edit the ban, just rerun the command.',
			'<playerName> <banDuration> <banReason(Optional)>', {
				aliases: ['tban', 'temppunish', 'tb', 'tbc', 'tp'],
				example: 'tempban joemama 720y 666w 420d 42h joemama is too fat',
				cooldown: '5s',
				permission: true,
				slashCommandOptions: [{
					name: 'playername',
					description: 'The name of the player to ban. Case sensitive!',
					type: 'STRING',
					required: true,
				}, {
					name: 'duration',
					description: 'The duration of the ban. e.g 720y or 69h or 420w. Only one duration is allowed.',
					type: 'STRING',
					required: true,
				}, {
					name: 'reason',
					description: 'Why the player is banned. If longer than 1024 text it will be shortened.',
					type: 'STRING',
					required: false,
				}],
			},
		);
	}
	/**
	 * @param {Class} interaction
	 * @param {CommandInteraction} interactionOptions
	 * @returns Promise
	 */
	async execute(interaction, interactionOptions) {
		const { guildId } = interaction;
		const { tag: bannedBy } = interaction.user;
		const playerName = interactionOptions.getString('playername');
		const banReason = interactionOptions.getString('reason') ?? 'No ban reason was specified.';
		const banDuration = interactionOptions.getString('duration');
		if (!isBanDuration(banDuration)) {
			return interaction.reply('Make sure the ban duration is formatted correctly!');
		}
		const bannedAt = Date.now();
		const bannedUntil = bannedAt + ms(banDuration);
		const formattedUnbanDate = formatToUTC(bannedUntil);
		const formattedBanDate = formatToUTC(bannedAt);
		try {
			await interaction.defer();
			const playerId = await getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, trim(banReason, 1024), bannedBy, 'tempBan', bannedAt, bannedUntil,
			);
			const [playerImage] = await Promise.all([
				getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);
			const banInfoEmbed = new TempBanInfoEmbed(
				formattedBanDate, bannedBy, playerName, playerId, trim(banReason, 1024), playerImage, formattedUnbanDate,
			);
			const playerProfileButton = new PlayerProfileButton(playerId);
			const messageRow = new MessageActionRow({ components: [playerProfileButton] });
			return interaction.editReply({ content:`${playerName} has been banned.`, embeds: [banInfoEmbed], components: [messageRow] });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content:`There was an error while banning the player!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } });
		}
	}
};