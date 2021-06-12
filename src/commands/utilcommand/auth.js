const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const { checkIfRoleId } = require('@util/util');

module.exports = class AuthorizeCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'authorizerole',
			'authorize specific role to command that require permission',
			'<@role>', {
				aliases: ['auth', 'permit', 'authforrole'],
				example: 'auth @joemama',
				cooldown: 5,
				args: true,
				permission: true,
			});
	}
	async execute(message, args) {
		const [role] = args;
		const roleId = checkIfRoleId(role);
		const { guildConfig, id } = message.guild;
		const cachedAuthorizedRoles = guildConfig.get('authorizedRoles');

		if (!roleId) {
			return message.reply('That is not a role Id!');
		}

		if (!message.guild.roles.cache.find(guildRole => guildRole.id == roleId)) {
			return message.reply('Make sure you input the correct role.');
		}

		try {
			await this.dataBase
				.collection(`guildDataBase:${id}`)
				.doc('guildConfigurations')
				.update({
					'guildConfig.authorizedRoles': this.firestore.FieldValue.arrayUnion(`${roleId}`),
				});
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