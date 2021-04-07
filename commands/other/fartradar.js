const { getUserID } = require('../../modules/getUserID');
const { newEmbedBanInfo } = require('../../modules/createEmbedMessage');

module.exports = {
	name: 'fartradar',
	desc: 'read gurment',
	usage: 'userName',
	aliases : ['checkban', 'baninfo'],
	cooldown: 5,
	args: true,
	guildonly: true,
	permission: true,
	async execute(message, arg, DB) {
		try {
			const [ userName ] = arg;
			const guildId = message.guild.id;
			const playerId = await getUserID(userName);
			const snap = await DB.collection(`Server: ${guildId}`).doc(`Player: ${playerId}`).get();
			if (!snap.exists) {
				throw new Error(`No data exists for player ${userName}.`);
			}
			const data = snap.data();
			const { bannedAt } = data;
			const { bannedBy } = data;
			const { playerName } = data;
			const { playerID } = data;
			const { banReason } = data;
			const banInfoEmbed = await newEmbedBanInfo(bannedAt, bannedBy, playerName, playerID, banReason);
			return message.channel.send(banInfoEmbed);
		}
		catch (error) {
			console.warn(error);
			return message.channel.send(`There was an error while attempting to retrive de deta!\n${error}`);
		}
	},
};