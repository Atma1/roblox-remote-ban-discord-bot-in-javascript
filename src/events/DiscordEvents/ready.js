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


		// const checkBan = async () => {
		// 	// const now = Date.now();
		// 	const playersToUnbanDoc = await fireStore
		// 		.collection('serverDataBase')
		// 		.doc('banList')
		// 		.collection('bannedPlayerList')
		// 		.where('banDetails.banReason', '==', 'tesuto')
		// 		.get();
		// 	return playersToUnbanDoc;
		// };

		// const unbanDocSnapShot = await checkBan();

		// if (!unbanDocSnapShot.empty) {
		// 	// IMPLEMENT STAGED DELETE IF SIZE >= 500
		// 	console.log(unbanDocSnapShot.size);
		// 	const unbanBatch = fireStore.batch();

		// 	unbanDocSnapShot.forEach(doc => {
		// 		console.log(`Unbanned ${doc.id}.`);
		// 		unbanBatch.delete(doc.ref);
		// 	});
		// 	await unbanBatch.commit();
		// }
	}
};