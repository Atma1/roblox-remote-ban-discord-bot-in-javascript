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
	async execute() {
		console.log(`${this.botClient.user.tag} is ready!`);

		const checkBan = async () => {
			// const now = Date.now();
			const playersToUnban = await fireStore
				.collection('serverDataBase')
				.doc('banList')
				.collection('bannedPlayerList')
				.where('banDetails.banReason', '==', 'tesuto')
				.get();
			return playersToUnban;
		};

		const unbanSnapShot = await checkBan();

		if (!unbanSnapShot.empty) {
			// IMPLEMENT STAGED DELETE IF SIZE >= 500
			console.log(unbanSnapShot.size);
			const unbanBatch = fireStore.batch();

			unbanSnapShot.forEach(doc => {
				console.log(`Unbanned ${doc.id}.`);
				unbanBatch.delete(doc.ref);
			});
			await unbanBatch.commit();
		}
	}
};