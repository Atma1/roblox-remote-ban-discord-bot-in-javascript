const EmbededBanInfoMessage = require('../../modules/CreateEmbededBanInfoMessage');
const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'baninfo',
			'check ban information for the player specified assuming the player is in the database',
			'baninfo playerName', {
				aliases: ['checkban', 'cb', 'bi', 'retrive'],
				example: 'baninfo joemama',
				cooldown: 5,
				args: true,
				guildonly: true,
				permission: true,
			});
	}
	async execute(message, arg) {
		const [playername] = arg;
		const msg = await message.channel.send('Attempting to retrive the document from the database...');
		try {
			const playerId = await this.getUserId(playername);
			const [snapshot, playerImage] = await Promise.all([
				this.retriveBanDocument(playerId),
				this.getUserImg(playerId),
			])
				.catch(err => {
					throw (err);
				});

			if (!snapshot.exists) {
				throw new Error(`${playername} is not found in the database.`);
			}

			const data = snapshot.data();

			const {
				playerID,
				playerName,
				banReason,
				bannedBy,
				bannedAt,
			} = data;

			const embed = new EmbededBanInfoMessage(
				bannedAt, bannedBy, playerName, playerID, banReason, playerImage,
			);
			return msg.edit(null, embed);
		}
		catch (error) {
			console.error(error);
			return msg.edit(`There was an error while attempting to retrive the document!\n${error}`);
		}
	}
};