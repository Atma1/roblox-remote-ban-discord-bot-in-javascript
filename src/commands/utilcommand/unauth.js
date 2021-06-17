const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const {
	parseToRoleId,
	roleExists,
	removeRoleFromCache,
} = require('@util/util');

module.exports = class UnauthorzieCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'unauth',
			'unauthorize specific role to command that require permission assuming the role exists in the database',
			'<@role>', {
				aliases: ['revoke', 'ut'],
				example: 'unauthorizerole @joemama',
				cooldown: '5s',
				args: true,
				permission: true,
			});
	}
	async execute(message, args) {
		const [role] = args;
		const roleId = parseToRoleId(role);
		const {
			guildConfig,
			id: guildId,
			roles: guildRoles,
		} = message.guild;
		const cachedAuthorizedRoles = guildConfig.get('authorizedRoles');

		if (!roleId) {
			return message.reply('that is not a role Id!');
		}

		if (!roleExists(guildRoles.cache, roleId)) {
			return message.reply('make sure you input the role correctly.');
		}

		try {
			await this.removeAuthorizedRole(roleId, guildId);
		}
		catch (error) {
			console.error(error);
			return message.reply(`There was an error while removing the role!\n${error}`);
		}

		const updatedCachedRoles = removeRoleFromCache(roleId, cachedAuthorizedRoles);

		guildConfig.set('authorizedRoles', updatedCachedRoles);
		return message.channel.send(`\`${role}\` has been restricted to use permission restricted command!`);
	}
};