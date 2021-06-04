const DataBaseRelatedCommandClass = require('@util/DataBaseRelatedCommandClass');

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
				guildonly: true,
				permission: true,
			});
	}
	async execute(msg, args) {
		const [role] = args;
		const roleId = role.match(/[0-9]\d+/g);
		const { guildConfig, id } = msg.guild;
		const cachedAuthorizedRoles = guildConfig.get('authorizedRoles');

		if (!roleId) {
			return msg.reply('That is not a role Id!');
		}

		if (!msg.guild.roles.cache.find(guildRole => guildRole.id == roleId)) {
			return msg.reply('Make sure you input the correct role.');
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
			return msg.reply(`There was an error while adding the role!\n${error}`);
		}

		cachedAuthorizedRoles.push(roleId);
		guildConfig.set('authorizedRoles', cachedAuthorizedRoles);
		return msg.channel.send(`${role} has been authorized to use permission restricted command!`);
	}
};