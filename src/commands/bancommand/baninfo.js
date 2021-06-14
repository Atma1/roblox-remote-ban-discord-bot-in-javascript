const {
	EmbededPermBanInfoMessage,
	EmbededTempBanInfoMessage,
} = require('@modules/EmbededBanMessage');
const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');

module.exports = class BanInfoCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'baninfo',
			'check ban information for the player specified assuming the player is in the database',
			'<playerName>', {
				aliases: ['checkban', 'cb', 'bi', 'retrive'],
				example: 'baninfo joemama',
				cooldown: 5,
				args: true,
				permission: true,
			});
	}
	async execute(message, arg) {
		const { id:guildId } = message.channel.guild;
		const [playerName] = arg;

		try {
			const querySnapShot = await this.retriveBanDocument(playerName, guildId);

			if (querySnapShot.empty) {
				throw new Error(`${playerName} is not found in the database.`);
			}

			const documents = querySnapShot.docs;
			const [ banDocument ] = documents;
			const data = banDocument.data();

			const {
				playerID,
				banReason,
				bannedBy,
				bannedAt,
				banType,
			} = data;

			const formattedBanDate = this.dateformat(bannedAt);
			const userImage = await this.getUserImg(playerID);
			let banInfoEmbed;

			if (banType == 'permaBan') {
				banInfoEmbed = new EmbededPermBanInfoMessage(
					formattedBanDate, bannedBy, playerName, playerID, banReason, userImage,
				);
			}
			else {
				const { bannedUntil } = data;
				const formattedUnbanDate = this.dateformat(bannedUntil);
				banInfoEmbed = new EmbededTempBanInfoMessage(
					formattedBanDate, bannedBy, playerName, playerID, banReason, userImage, formattedUnbanDate,
				);
			}

			return message.channel.send(banInfoEmbed);
		}
		catch (error) {
			console.error(error);
			return message.reply(`there was an error while attempting to retrive the document!\n${error}`);
		}
	}
};