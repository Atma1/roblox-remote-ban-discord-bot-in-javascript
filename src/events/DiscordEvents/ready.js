const EventClass = require('@util/EventClass');
const ms = require('ms');
const fireBaseAdmin = require('firebase-admin');
const fireStore = fireBaseAdmin.firestore();

module.exports = class ReadyEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'ready',
			'once',
		);
	}
	execute() {
		console.log(`${this.botClient.user.tag} is ready!`);

		const checkBan = async (guildId) => {
			const now = Date.now();
			const playersToUnban = await fireStore
				.collection(`guildDataBase:${guildId}`)
				.doc('banList')
				.collection('bannedPlayerList')
				.where('banDetails.bannedUntil', '<=', now)
				.get();
			return playersToUnban;
		};
		checkBan();
	}
};