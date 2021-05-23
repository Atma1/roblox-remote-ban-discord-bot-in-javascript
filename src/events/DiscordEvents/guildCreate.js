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
			DB.collection('serverDataBase').doc('serverData').create({
				'guildID': guildId,
				'guildName': guildData.name,
				'guildOwnerID': guildData.ownerID,
				'guildOwnerTag': ownerTag,
				'authorizedRoles': [],
			});
			console.log('Database created.');
		}
		catch (error) {
			console.error(error);
		}
	}
};