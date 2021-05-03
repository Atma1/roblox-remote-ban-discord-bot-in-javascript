const EmbededBanInfoMessage = require('../../modules/CreateEmbededBanInfoMessage');
const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor() {
		super(
			'ban',
			'ban player. as of now the ban is permanent. to edit the ban, just rerun the command',
			{
				aliases: ['addban', 'banplayer', 'bn'],
				example: '!ban joemama joemama is too fat',
				cooldown: 5,
				args: true,
				guildonly: true,
				permission: true,
				reqarglength: 2,
			},
		);
	}
	async execute(msg, args) {
		const guildId = msg.guild.id;
		const playerName = args.shift();
		const banReason = args.join(' ');
		const bannedAt = this.dateformat(new Date);
		const bannedBy = msg.author.tag;
		try {
			const playerId = await this.getUserId(playerName);
			const playerBanDocument = {
				playerID: `${playerId}`,
				playerName:`${playerName}`,
				banReason: `${banReason}`,
				bannedBy: `${bannedBy}`,
				bannedAt: `${bannedAt}`,
			};
			const [ playerImage ] = await Promise.all([
				this.getUserImg(playerId)
					.catch(error => { throw(error);}),
				this.dataBase.collection(`Server: ${guildId}`).doc(`Player: ${playerId}`)
					.set(playerBanDocument, { merge: true })
					.catch(error => { throw(error);}),
			]);
			const embed = new EmbededBanInfoMessage(
				bannedAt, bannedBy, playerName, playerId, banReason, playerImage,
			);
			return msg.channel.send(`\`Player: ${playerName} has been banned\``, embed);
		}
		catch (error) {
			console.error(error);
			return msg.channel.send(`There was an error while banning the player!\n${error}`);
		}
	}
};