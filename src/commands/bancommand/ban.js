const { EmbededPermBanInfoMessage } = require('@modules/EmbededBanMessage');
const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const PlayerBanDocument = require('@class/PlayerBanDocumentClass');

module.exports = class PermBanCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'ban',
			'ban player until who know when. to edit the ban, just rerun the command',
			'<playerName> <banReason>', {
				aliases: ['addban', 'banplayer', 'bn', 'permban', 'pb'],
				example: 'ban joemama joemama is too fat',
				cooldown: 5,
				args: true,
				permission: true,
				reqarglength: 2,
			},
		);
	}
	async execute(message, args) {
		const { id:guildId } = message.channel.guild;
		const playerName = args.shift();
		const banReason = args.join(' ');
		const bannedAt = Date.now();
		const { tag: bannedBy } = message.author;
		const formattedBanDate = this.dateformat(bannedAt);

		try {
			const playerId = await this.getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, 'permaBan', bannedAt,
			);

			const [playerImage] = await Promise.all([
				this.getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);

			const embed = new EmbededPermBanInfoMessage(
				formattedBanDate, bannedBy, playerName, playerId, banReason, playerImage,
			);
			return message.channel.send(`\`${playerName} has been banned.\``, embed);
		}
		catch (error) {
			console.error(error);
			return message.channel.send(`There was an error while banning the player!\n${error}`);
		}
	}
};