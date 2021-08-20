const PermissionData = require('@class/Permission Data/PermissionData');
const CommandPermission = require('@class/Permission Data/CommandPermission');

async function setupCommandPermission(guildConfig, guild) {
	const { ownerId } = guild;
	let authorizedPermission;
	const authorizedRolesArray = guildConfig.get('authorizedRoles');
	const slashCommandIds = guildConfig.get('guildSlashCommandIds');
	if (!authorizedRolesArray.length) {
		authorizedPermission = [new PermissionData(ownerId, 'USER', true)];
	}
	else {
		authorizedPermission = authorizedRolesArray.map(roleId => new PermissionData(roleId, 'ROLE', true));
		authorizedPermission.push(new PermissionData(ownerId, 'USER', true));
	}
	await updateSlashCommandPermission(guild, authorizedPermission, slashCommandIds);
}

async function updateSlashCommandPermission(guild, authorizedPermission, slashCommandIds) {
	const fullPermissions = slashCommandIds.map(commandId => new CommandPermission(commandId, authorizedPermission));
	await guild.commands?.permissions.set({ fullPermissions });
}

module.exports = {
	updateSlashCommandPermission: updateSlashCommandPermission,
	setupCommandPermission: setupCommandPermission,
};