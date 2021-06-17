const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const {
	parseToRoleId,
	checkIfRoleExists,
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
			await this.removeAuthorizedRole(roleId, guildId);
		}
		catch (error) {
			console.error(error);
			return message.reply(`There was an error while removing the role!\n${error}`);
		}

		for (const cachedRole of cachedAuthorizedRoles) {
			if (cachedAuthorizedRoles[cachedRole] == roleId) {
				cachedAuthorizedRoles.splice(cachedRole, 1);
			}
		}

		guildConfig.set('authorizedRoles', cachedAuthorizedRoles);
		return message.channel.send(`\`${role}\` has been restricted to use permission restricted command!`);
	}
};