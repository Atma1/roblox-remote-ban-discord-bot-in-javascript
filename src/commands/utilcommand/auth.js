const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const {
	parseToRoleId,
	roleExists,
} = require('@util/util');
const { getGuildConfigCollection } = require('@modules/GuildConfig');

module.exports = class AuthorizeCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'auth',
			'authorize specific role to command that require permission',
			'<@role>', {
				aliases: ['permit', 'authforrole', 'at'],
				example: 'auth @joemama',
				cooldown: '5s',
				args: true,
				permission: true,
			});
	}
	async execute(message, args) {
		const [role] = args;
		const [roleId] = parseToRoleId(role);
		const { id: guildId, roles: guildRoles } = message.guild;
		const guildConfigCollection = getGuildConfigCollection(guildId, this.botClient);
		const cachedAuthorizedRoles = guildConfigCollection.get('authorizedRoles');

		if (!roleId) {
			return message.reply({ content:'that is not a role Id!', allowedMentions: { repliedUser: true } });
		}

		if (!roleExists(guildRoles.cache, roleId)) {
			return message.reply({ content: 'make sure you input the role correctly.', allowedMentions: { repliedUser: true } });
		}

		if (roleExists(guildRoles.cache, roleId)) {
			return message.reply({ content: 'that role is already authorized!', allowedMentions: { repliedUser: true } });
		}

		try {
			await this.addAuthorizedRole(roleId, guildId);
		}
		catch (error) {
			console.error(error);
			return message.reply({ content:`there was an error while adding the role!\n${error}`, allowedMentions: { repliedUser: true } });
		}

		cachedAuthorizedRoles.push(roleId);
		guildConfigCollection.set('authorizedRoles', cachedAuthorizedRoles);

		return message.channel.send({ content:`\`${role}\` has been authorized to use permission restricted command!` });
	}
};