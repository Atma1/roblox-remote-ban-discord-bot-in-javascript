const admin = require('firebase-admin');
const DB = admin.firestore();

module.exports = {
	async execute(client, guildData) {
		try {
			const guildId = guildData.id;
			const ownerTag = await client.users.fetch(guildData.ownerID).then(user => user.tag);
			DB.collection(`Server: ${guildId}`).doc(`Data for server: ${guildId}`).set({
				'guildID': guildId,
				'guildName': guildData.name,
				'guildOwnerID': guildData.ownerID,
				'guildOwnerTag' : ownerTag,
				'authorizedRoles' : [],
			});
		}
		catch (error) {
			console.error(error);
		}
	},
};