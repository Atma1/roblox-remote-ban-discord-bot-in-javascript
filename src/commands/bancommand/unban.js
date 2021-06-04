const DataBaseRelatedCommandClass = require('@util/DataBaseRelatedCommandClass');

module.exports = class UnbanCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'unban',
			'remove the player from the database assuming the player is in the database',
			'<playerName>', {
				aliases: ['ub', 'forgive', 'amnesty', 'remove'],
				example: 'unban joemama',
				args: true,
				cooldown: 5,
				permission: true,
				guildonly: true,
			});
	}
	async execute(message, args) {
		const [playerName] = args;
		const { id:guildId } = message.channel.guild;
		try {
			const playerId = await this.getUserId(playerName);
			this.deletePlayerBanDocument(playerId, guildId);
		}
		catch (error) {
			console.error(error);
			return message.channel.send(`There was an error while removing ${playerName}!\n${error}`);
		}
		return message.channel.send(`Player: ${playerName}, removed from Firebase Firestore.`);
	}
};