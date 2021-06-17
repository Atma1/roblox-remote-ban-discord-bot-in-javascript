const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const {
	parseToRoleId,
	checkIfRoleExists,
} = require('@util/util');

module.exports = class AuthorizeCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'authorizerole',
			'authorize specific role to command that require permission',
			'<@role>', {
				aliases: ['auth', 'permit', 'authforrole', 'at'],
				example: 'auth @joemama',
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
			roles,
		} = message.guild;
		const cachedAuthorizedRoles = guildConfig.get('authorizedRoles');

		if (!roleId) {
			return message.reply('that is not a role Id!');
		}
		const roleExists = checkIfRoleExists(roles.cache, roleId);

		if (!roleExists) {
			return message.reply('make sure you input the role correctly.');
		}

		try {
			await this.addAuthorizedRole(roleId, guildId);
		}
		catch (error) {
			console.error(error);
			return message.reply(`There was an error while adding the role!\n${error}`);
		}

		cachedAuthorizedRoles.push(roleId);
		guildConfig.set('authorizedRoles', cachedAuthorizedRoles);
		return message.channel.send(`${role} has been authorized to use permission restricted command!`);
	}
};