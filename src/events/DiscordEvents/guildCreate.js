const admin = require('firebase-admin');
const DB = admin.firestore();
const EventClass = require('@class/EventClass');
const { createNewGuildDataBase } = require('@util/util');

module.exports = class GuildCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'guildCreate',
			'on',
		);
	}
	async execute(guildData) {

		const { id, ownerID } = guildData;
		const guildOwner = await this.botClient.users.fetch(ownerID);

		const response = await createNewGuildDataBase(id, DB);
		guildOwner.send(response)
			.catch(err => console.error(err));
	}
};