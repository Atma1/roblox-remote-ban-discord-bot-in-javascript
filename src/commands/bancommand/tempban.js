const { EmbededTempBanInfoMessage } = require('@class/EmbededBanMessage');
const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const PlayerBanDocument = require('@class/PlayerBanDocumentClass');
const { getUserId } = require('@modules/getUserId');
const { getUserImg } = require('@modules/getUserImg');
const {
	getBanDurationAndBanReason,
	hasBanDuration,
	trimString:trim,
	formatToUTC,
} = require('@util/util');


module.exports = class TempBanCommand extends DataBaseRelatedCommandClass {
	/**
	 * @param {Class} botClient;
	 */
	constructor(botClient) {
		super(
			botClient,
			'tempban',
			'temp ban the player. to edit the ban, just rerun the command',
			'<playerName> <banDuration> <banReason(Optional)>', {
				aliases: ['tban', 'temppunish', 'tb', 'tbc', 'tp'],
				example: 'tempban joemama 720y 666w 420d 42h joemama is too fat',
				cooldown: '5s',
				args: true,
				permission: true,
				reqarglength: 2,
			},
		);
	}
	/**
	 * @param {Class} message
	 * @param {Array} args
	 * @returns Promise
	 */
	async execute(message, args) {
		if (!hasBanDuration(args)) {
			return message.reply({ content:'you need to specify the ban duration!', allowedMentions: { repliedUser: true } });
		}
		const { id:guildId } = message.channel.guild;
		const { tag: bannedBy } = message.author;
		const playerName = args.shift();
		const [banDuration, banReason] = getBanDurationAndBanReason(args);
		const bannedAt = Date.now();
		const bannedUntil = bannedAt + banDuration;
		const formattedUnbanDate = formatToUTC(bannedUntil);
		const formattedBanDate = formatToUTC(bannedAt);
		try {
			const playerId = await getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, 'tempBan', bannedAt, bannedUntil,
			);
			const [playerImage] = await Promise.all([
				getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);

			const banInfoEmbed = new EmbededTempBanInfoMessage(
				formattedBanDate, bannedBy, playerName, playerId, trim(banReason, 1024), playerImage, formattedUnbanDate,
			);
			return message.channel.send({ content:`\`${playerName} has been banned.\``, embeds: [banInfoEmbed] });
		}
		catch (error) {
			console.error(error);
			return message.reply({ content:`there was an error while banning the player!\n${error}`, allowedMentions: { repliedUser: true } });
		}
	}
};