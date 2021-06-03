const { EmbededTempBanInfoMessage } = require('@modules/EmbededBanMessage');
const DataBaseRelatedCommandClass = require('@util/DataBaseRelatedCommandClass');
const PlayerBanDocument = require('@util/PlayerBanDocumentClass');
const {
	seperateDurationAndBanReason,
	parseDurationArraytoMs,
	checkIfHasBanDuration,
} = require('@util/util');


module.exports = class TemporaryBanCommand extends DataBaseRelatedCommandClass {
	/**
	 * @param {Class} botClient;
	 */
	constructor(botClient) {
		super(
			botClient,
			'tempban',
			'temp ban the player. to edit the ban, just rerun the command',
			'playerName banDuration banReason', {
				aliases: ['tban', 'temppunish', 'tb', 'tbc', 'tp'],
				example: 'tempban joemama 720y 666w 420d 42h joemama is too fat',
				cooldown: 5,
				args: true,
				guildonly: true,
				permission: true,
				reqarglength: 3,
			},
		);
	}
	/**
	 * @param {Class} message
	 * @param {Array} args
	 * @returns Message Embed
	 */
	async execute(message, args) {
		const banDuration = checkIfHasBanDuration(args);

		if (!banDuration) {
			return message.channel.send('You need to specify the ban duration!');
		}

		const { tag: bannedBy } = message.author;
		const playerName = args.shift();
		const [banReason, ...banDurationArray] = seperateDurationAndBanReason(args);
		const bannedAt = Date.now();
		const bannedUntil = bannedAt + parseDurationArraytoMs(banDurationArray);
		const formattedUnbanDate = this.dateformat(bannedUntil);
		const formattedBanDate = this.dateformat(bannedAt);

		try {
			const playerId = await this.getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, 'tempBan', bannedAt, bannedUntil,
			);
			const [playerImage] = await Promise.all([
				this.getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc),
			])
				.catch(error => {
					throw (error);
				});
			const embed = new EmbededTempBanInfoMessage(
				formattedBanDate, bannedBy, playerName, playerId, banReason, playerImage, formattedUnbanDate,
			);
			return message.channel.send(`\`Player: ${playerName} has been banned.\``, embed);
		}
		catch (error) {
			console.error(error);
			return message.channel.send(`There was an error while banning the player!\n${error}`);
		}
	}
};