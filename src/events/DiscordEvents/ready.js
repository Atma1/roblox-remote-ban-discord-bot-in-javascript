const EventClass = require('@class/EventClass');
const admin = require('firebase-admin');
const readableToMs = require('readable-to-ms');
const firestore = admin.firestore();

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

		function runAutoUnban(client) {
			const clientGuild = client.guilds.cache;
			clientGuild.forEach(async guild => {
				await checkBan(guild.id);
			});

			setTimeout(() => {
				runAutoUnban(client);
			}, readableToMs('10m'));
		}

		async function checkBan(guildId) {
			try {
				const querySnapshot = await fetchBanDocument(guildId);

				if (querySnapshot.empty) return;

				await batchDelete(querySnapshot);

				process.nextTick(() => {
					checkBan(guildId);
				});
			}
			catch (error) {
				console.error(error);
			}
		}

		function fetchBanDocument(guildId) {
			const now = Date.now();
			return firestore
				.collection(`guildDataBase:${guildId}`)
				.doc('banList')
				.collection('bannedPlayerList')
				.where('banDetails.bannedUntil', '<=', now)
				.limit(500)
				.get();
		}

		async function batchDelete(snapshot) {
			const batch = firestore.batch();
			snapshot.forEach(doc => {
				console.log(`Deleted ${doc.id}.`);
				batch.delete(doc.ref);
			});
			await batch.commit();
		}

		runAutoUnban(this.botClient);
	}
};