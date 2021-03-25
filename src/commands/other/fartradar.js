const { getUserID } = require('../../../modules/getUserID');
const { newEmbedBanInfo } = require('../../../modules/createEmbedMessage');

module.exports = {
	name: 'fartradar',
	desc: 'read gurment',
	usage: 'check player',
	cooldown: 5,
	args: true,
	guildonly: true,
	async execute(message, arg, DB) {
		try {
			const [ userName ] = arg;
			const playerId = await getUserID(userName);
			DB.collection('Guilds-Server').doc(`Player: ${playerId}`).get().then(async snap => {
				if (!snap.exists) {
					throw(`No data exists for playerID: ${userName}.`);
				}
				const data = snap.data();
				const { bannedAt } = data;
				const { bannedBy } = data;
				const { playerName } = data;
				const { playerID } = data;
				const { banReason } = data;
				const banInfoEmbed = await newEmbedBanInfo(bannedAt, bannedBy, playerName, playerID, banReason);
				return message.channel.send(banInfoEmbed);
			});
		}
		catch (error) {
			console.warn(error);
			return message.channel.send('There was an error while attempting to retrive deta!', error);
		}
	},
};