const { TempBanInfoEmbed } = require('@class/Embed/EmbedBanMessage');
const { MessageActionRow } = require('discord.js');
const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const PlayerBanDocument = require('@class/Firestore Document/PlayerBanDocument');
const PlayerProfileButton = require('@class/Button/PlayerProfileButton');
const ms = require('ms');
const { getUserId } = require('@modules/getUserId');
const { getUserImg } = require('@modules/getUserImg');
const {
	isBanDuration,
	trimString:trim,
	formatToUTC,
} = require('@util/util');

module.exports = class TempBanCommand extends DatabaseSlashCommand {
	/**
	 * @param {Client} botClient;
	 */
	constructor(botClient) {
		super(
			botClient,
			'tempban',
			'Temporary ban the player. To edit the ban, just rerun the command.',
			'<playerName> <banDuration> <banReason(Optional)>', {
				example: 'tempban joemama 420d joemama is too fat',
				defaultPermission: false,
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
					description: 'Why the player is banned. If longer than 1024 text it will be trimmed.',
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
		const banReason = trim(interactionOptions.getString('reason') ?? 'No ban reason was specified', 1024);
		const banDuration = interactionOptions.getString('duration');
		if (!isBanDuration(banDuration)) {
			return interaction.reply('Make sure the ban duration is formatted correctly!');
		}
		const bannedAt = Date.now();
		const bannedUntil = bannedAt + ms(banDuration);
		const formattedUnbanDate = formatToUTC(bannedUntil);
		const formattedBanDate = formatToUTC(bannedAt);
		try {
			await interaction.deferReply();
			const playerId = await getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, 'tempBan', bannedAt, bannedUntil,
			);
			const [playerImage] = await Promise.all([
				getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);
			const banInfoEmbed = new TempBanInfoEmbed(
				formattedBanDate, bannedBy, playerName, playerId, banReason, playerImage, formattedUnbanDate,
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