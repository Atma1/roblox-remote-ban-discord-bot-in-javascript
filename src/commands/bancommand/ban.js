const EmbededBanInfoMessage = require('../../modules/CreateEmbededBanInfoMessage');
const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');
const {
	PlayerBanDocument,
} = require('../../util/util');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'ban',
			'ban player. as of now the ban is permanent. to edit the ban, just rerun the command',
			'playerName banReason', {
				aliases: ['addban', 'banplayer', 'bn'],
				example: 'ban joemama joemama is too fat',
				cooldown: 5,
				args: true,
				guildonly: true,
				permission: true,
				reqarglength: 2,
			},
		);
	}
	async execute(message, args) {
		const playerName = args.shift();
		const banReason = args.join(' ');
		const bannedAt = Date.now();
		const bannedBy = message.author.tag;
		const formattedDate = this.dateformat(bannedAt);

		try {
			const playerId = await this.getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, bannedAt,
			);
			const [playerImage] = await Promise.all([
				this.getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc),
			])
				.catch(error => {
					throw (error);
				});
			const embed = new EmbededBanInfoMessage(
				formattedDate, bannedBy, playerName, playerId, banReason, playerImage,
			);
			return message.channel.send(`\`Player: ${playerName} has been banned.\``, embed);
		}
		catch (error) {
			console.error(error);
			return message.channel.send(`There was an error while banning the player!\n${error}`);
		}
	}
};