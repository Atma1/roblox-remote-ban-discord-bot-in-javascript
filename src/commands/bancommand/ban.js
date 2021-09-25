const { PermBanInfoEmbed } = require('@class/Embed/EmbedBanMessage');
const { MessageActionRow } = require('discord.js');
const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const PlayerBanDocument = require('@class/Firestore Document/PlayerBanDocument');
const PlayerProfileButton = require('@class/Button/PlayerProfileButton');
const { getUserId } = require('@modules/getUserId');
const { getUserImg } = require('@modules/getUserImg');
const { trimString:trim, formatToUTC } = require('@util/util');

module.exports = class PermBanCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			'ban',
			'Ban player permanently. To edit the ban, just rerun the command.',
			'<playerName> <banReason(Optional)>', {
				example: 'ban joemama joemama is too fat',
				defaultPermission: false,
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
		const banReason = trim(interactionOptions.getString('reason') ?? 'No ban reason was specified', 1024);
		const bannedAt = Date.now();
		const bannedUntil = bannedAt + ms('100y');
		const formattedUnbanDate = formatToUTC(bannedUntil);
		const formattedBanDate = formatToUTC(bannedAt);

		try {
			await interaction.deferReply();
			const playerId = await getUserId(playerName);
			if (!playerId) {
				return interaction.reply('That user is not found in Roblox!');
			}
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, 'permaBan', bannedAt, formattedUnbanDate,
			);
			const [playerImage] = await Promise.all([
				getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);
			const banInfoEmbed = new PermBanInfoEmbed(
				formattedBanDate, bannedBy, playerName, playerId, banReason, playerImage,
			);
			const playerProfileButton = new PlayerProfileButton(playerId);
			const messageRow = new MessageActionRow({ components: [playerProfileButton] });
			return interaction.editReply({ content:`\`${playerName} has been banned.\``,
				embeds: [banInfoEmbed], components: [messageRow] });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content: error })
				.catch(err => console.error(err));
		}
	}
};