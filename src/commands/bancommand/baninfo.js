const { createBanInfoEmbed } = require('@util/util');
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
				cooldown: '5s',
				args: true,
				permission: true,
			});
	}
	async execute(message, arg) {
		const { id:guildId } = message.channel.guild;
		const [playerName] = arg;

		try {
			const querySnapshot = await this.retriveBanDocument(playerName, guildId);

			if (querySnapshot.empty) {
				return message.reply({ content:`${playerName} is not found in the database.`, allowedMentions: { repliedUser: true } });
			}

			const documents = querySnapshot.docs;
			const [ banDocument ] = documents;
			const data = banDocument.data();
			const { playerID } = data;
			const userImage = await this.getUserImg(playerID);
			const banInfoEmbed = createBanInfoEmbed(data, userImage, playerName);

			return message.channel.send({ embed: banInfoEmbed });
		}
		catch (error) {
			console.error(error);
			return message.reply({ content:`there was an error while attempting to retrive the document!\n${error}`, allowedMentions: { repliedUser: true } });
		}
	}
};