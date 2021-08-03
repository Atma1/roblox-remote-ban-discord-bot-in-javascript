const { Collection } = require('discord.js');
const {
	guildConfigDocConverter,
	createNewGuildDataBase,
	setSlashCommands,
} = require('@util/util');
const { setupCommandPermission } = require('./guildCommandPermission');
const admin = require('firebase-admin');
const firestore = admin.firestore();

async function setupGuildConfig(guild, botClient) {
	try {
		const { guildConfigCollection, slashCommands } = botClient;
		const { id:guildId } = guild;
		guildConfigCollection.set(guildId, new Collection);
		const guildConfig = guildConfigCollection.get(guildId);
		const snapshot = await fetchGuildPrefixAndRole(guildId);
		if (!snapshot.exists) {
			const [response, guildOwner] = await Promise.all([
				createNewGuildDataBase(this.id, firestore),
				botClient.users.fetch(this.ownerID),
			]);
			guildConfig.set('authorizedRoles', []);
			directMessageGuildOwner(guildOwner, response);
		}
		else {
			const { authorizedRoles } = snapshot.data();
			guildConfig.set('authorizedRoles', authorizedRoles);
		}
		await setSlashCommands(guild, slashCommands, guildConfig);
		await setupCommandPermission(guildConfig, guild);
	}
	catch (error) {
		console.error(error);
	}
}

function directMessageGuildOwner(guildOwner, message) {
	guildOwner.send({ content: message });
}

function getGuildConfigCollection(guildId, botClient) {
	const { guildConfigCollection } = botClient;
	return guildConfigCollection.get(guildId);
}

function fetchGuildPrefixAndRole(guildId) {
	return firestore
		.collection(`guildDataBase:${guildId}`)
		.doc('guildConfigurations')
		.withConverter(guildConfigDocConverter)
		.get();
}

module.exports = {
	fetchGuildPrefixAndRole: fetchGuildPrefixAndRole,
	getGuildConfigCollection: getGuildConfigCollection,
	setupGuildConfig: setupGuildConfig,
};