const { Collection } = require('discord.js');
const {
	guildConfigDocConverter,
	createNewGuildDataBase,
} = require('@util/util');
const admin = require('firebase-admin');
const firestore = admin.firestore();

async function setupGuildConfig(guildId, botClient) {
	try {
		const { guildConfig } = botClient;
		guildConfig.set(guildId, new Collection);
		const guildConfigCollection = guildConfig.get(guildId);
		const snapshot = await fetchGuildPrefixAndRole(guildId);
		if (!snapshot.exists) {
			const [response, guildOwner] = await Promise.all([
				createNewGuildDataBase(this.id, firestore),
				botClient.users.fetch(this.ownerID),
			]);
			guildConfigCollection.set(guildId, 'prefix', '!');
			guildConfigCollection.set(guildId, 'authorizedRoles', []);
			directMessageGuildOwner(guildOwner, response);
		}
		else {
			const { defaultPrefix, authorizedRoles } = snapshot.data();
			guildConfigCollection.set('prefix', defaultPrefix || '!');
			guildConfigCollection.set('authorizedRoles', authorizedRoles);
		}
	}
	catch (error) {
		console.error(error);
	}
}

function directMessageGuildOwner(guildOwner, message) {
	guildOwner.send({ content:message });
}

function getGuildConfigCollection(guildId, botClient) {
	const { guildConfig } = botClient;
	return guildConfig.get(guildId);
}

function fetchGuildPrefixAndRole(guildId) {
	return firestore
		.collection(`guildDataBase:${guildId}`)
		.doc('guildConfigurations')
		.withConverter(guildConfigDocConverter)
		.get();
}

module.exports = {
	getGuildConfigCollection: getGuildConfigCollection,
	setupGuildConfig: setupGuildConfig,
};