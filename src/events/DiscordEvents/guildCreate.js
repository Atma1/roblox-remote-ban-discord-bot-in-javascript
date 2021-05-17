const admin = require('firebase-admin');
const DB = admin.firestore();
const EventClass = require('../../util/EventClass');

module.exports = class extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'guildCreate',
			'on',
		);
	}
	async execute(guildData) {
		try {
			const guildId = guildData.id;
			const ownerTag = await this.botClient.users.fetch(guildData.ownerID)
				.then(user => user.tag);
			const batch = DB.batch();
			batch.set(
				DB.collection('serverDataBase').doc('serverData'), {
					'guildID': guildId,
					'guildName': guildData.name,
					'guildOwnerID': guildData.ownerID,
					'guildOwnerTag': ownerTag,
					'authorizedRoles': [],
				},
			);
			batch.set(
				DB.collection('serverDataBase').doc('banList')
					.collection('bannedPlayerList'),
			);
			batch.commit();
		}
		catch (error) {
			console.error(error);
		}
	}
};