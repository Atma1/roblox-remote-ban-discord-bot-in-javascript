const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const { getUserId } = require('@modules/getUserId');

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
				cooldown: '5s',
				permission: true,
			});
	}
	async execute(message, args) {
		const [playerName] = args;
		const { id:guildId } = message.channel.guild;
		try {
			const playerId = await getUserId(playerName);
			await this.deletePlayerBanDocument(playerId, guildId);
		}
		catch (error) {
			console.error(error);
			return message.reply({ content: `There was an error while banning the player!\n${error}`, allowedMentions: { repliedUser: true } });
		}
		return message.channel.send({ content:`Player: ${playerName}, removed from Firebase Firestore.` });
	}
};