const { guildConfigDocConverter, createNewGuildDataBase } = require('@util/util');
const admin = require('firebase-admin');
const RolePermissionData = require('@class/bar');
const UserPermissionData = require('@class/foo');
const CommandPermission = require('@class/foobar');
const firestore = admin.firestore();

function setupCommandPermission(slashCommands, guilds, botClient) {
	const slashCommandIds = slashCommands.map(cmd => cmd.id);
	guilds.forEach(async guild => {
		try {
			const { id:guildId, ownerId } = guild;
			const snapshot = await fetchGuildPrefixAndRole(guildId);
			let fullPermissions;
			if (!snapshot.exists) {
				const [response, guildOwner] = await Promise.all([
					createNewGuildDataBase(guildId, firestore),
					botClient.users.fetch(this.ownerID),
				]);
				const userPermissionData = new UserPermissionData(ownerId);
				fullPermissions = slashCommandIds.map(commandId => new CommandPermission(commandId, userPermissionData));
				directMessageGuildOwner(guildOwner, response);
			}
			else {
				const { authorizedRoles } = snapshot.data();
				if (authorizedRoles.length) {
					const authorizedRolesDatas = authorizedRoles.map(role => new RolePermissionData(role));
					fullPermissions = slashCommandIds.map(commandId => new CommandPermission(commandId, authorizedRolesDatas));
				}
				else {
					const userPermissionData = new UserPermissionData(ownerId);
					fullPermissions = slashCommandIds.map(commandId => new CommandPermission(commandId, userPermissionData));
				}
				await guild.commands?.permission.set({ fullPermissions });
			}
		}
		catch (error) {
			console.error;
		}
	});
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
	setupGuildConfig: setupCommandPermission,
};