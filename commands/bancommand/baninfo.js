const EmbededBanInfoMessage = require('../../modules/CreateEmbededBanInfoMessage');
const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor() {
		super(
			'baninfo',
			'check ban information for the player specified assuming the player is in the database',
			'baninfo playerName', {
				aliases: ['checkban', 'cb', 'bi'],
				example: 'baninfo joemama',
				cooldown: 5,
				args: true,
				guildonly: true,
				permission: true,
			});
	}
	async execute(message, arg) {
		const [playername] = arg;
		const guildId = message.guild.id;
		try {
			const playerId = await this.getUserId(playername);
			const [playerImage, snapshot] = await Promise.all([
				this.getUserImg(playerId)
					.catch(error => {
						throw (error);
					}),
				this.dataBase.collection(`Server: ${guildId}`).doc(`Player: ${playerId}`).get()
					.catch(error => {
						throw (error);
					}),
			]);

			if (!snapshot.exists) {
				throw new Error(`No data exists for player ${playername}.`);
			}

			const data = snapshot.data();
			const { bannedAt } = data;
			const { bannedBy } = data;
			const { playerName } = data;
			const { playerID } = data;
			const { banReason } = data;
			const embed = new EmbededBanInfoMessage(
				bannedAt, bannedBy, playerName, playerID, banReason, playerImage,
			);
			return message.channel.send(embed);
		}
		catch (error) {
			console.error(error);
			return message.channel.send(`There was an error while attempting to retrive the data!\n${error}`);
		}
	}
};