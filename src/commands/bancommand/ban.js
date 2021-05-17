const EmbededBanInfoMessage = require('../../modules/CreateEmbededBanInfoMessage');
const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');
const { PlayerBanDocument } = require('../../util/util');
module.exports = class extends DataBaseRelatedCommandClass {
	constructor() {
		super(
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
	async execute(msg, args) {
		const playerName = args.shift();
		const banReason = args.join(' ');
		const bannedAt = this.dateformat(Date.now());
		const bannedBy = msg.author.tag;

		try {
			const playerId = await this.getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, bannedAt,
			);
			const [playerImage] = await Promise.all([
				this.getUserImg(playerId)
					.catch(error => {
						throw (error);
					}),
				this.dataBase.collection('serverDataBase')
					.doc('banList')
					.collection('bannedPlayerList')
					.doc(`Player:${playerId}`)
					.set(playerBanDoc, {
						merge: true,
					})
					.catch(error => {
						throw (error);
					}),
			]);
			const embed = new EmbededBanInfoMessage(
				bannedAt, bannedBy, playerName, playerId, banReason, playerImage,
			);
			return msg.channel.send(`\`Player: ${playerName} has been banned.\``, embed);
		}
		catch (error) {
			console.error(error);
			return msg.channel.send(`There was an error while banning the player!\n${error}`);
		}
	}
};