const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor() {
		super(
			'unban',
			'remove the player from the database assuming the player is in the database',
			{
				aliases: ['ub', 'forgive'],
				example: '!unban joemama',
				args: true,
				cooldown: 5,
				permission: true,
				guildonly: true,
			});
	}
	async execute(msg, args) {
		const [ playerName ] = args;
		const guildId = msg.guild.id;
		try {
			const playerId = await this.getUserId(playerName);
			await this.dataBase.collection(`Server: ${guildId}`).doc(`Player: ${playerId}`).delete();
			return msg.channel.send(`Player: ${playerName}, removed from Firebase Firestore.`);
		}
		catch (error) {
			console.error(error);
			return msg.channel.send(`There was an error while removing ${playerName}!\n${error}`);
		}
	}
};