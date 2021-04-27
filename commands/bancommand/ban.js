const EmbededBanInfoMessage = require('../../modules/CreateEmbededBanInfoMessage');
const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor() {
		super(
			'ban',
			'ban player. as of now the ban is permanent',
			'username banreason',
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
			const playerID = await this.getUserId(playerName);
			const playerImage = await this.getUserImg(playerID);
			await this.dataBase.collection(`Server: ${guildId}`).doc(`Player: ${playerID}`)
				.set({
					'playerID': `${playerID}`,
					'playerName':`${playerName}`,
					'banReason': `${banReason}`,
					'bannedBy': `${bannedBy}`,
					'bannedAt': `${bannedAt}`,
				}, {
					merge: true,
				});
			const embed = new EmbededBanInfoMessage(
				bannedAt, bannedBy, playerName, playerID, banReason, playerImage,
			);
			msg.channel.send(`\`Player: ${playerName} has been banned\``, embed);
		}
		catch (error) {
			console.error(error);
			return msg.channel.send(`There was an error while banning the player!\n${error}`);
		}
	}
};