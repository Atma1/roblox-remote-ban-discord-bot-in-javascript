const DataBaseRelatedCommandClass = require('@util/DataBaseRelatedCommandClass');

module.exports = class UnauthorzieCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'unauthorizerole',
			'unauthorize specific role to command that require permission assuming the role exits in the database',
			'<@role>', {
				aliases: ['unauth', 'revoke', 'ut'],
				example: 'unauthorizerole @joemama',
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
					'guildConfig.authorizedRoles': this.firestore.FieldValue.arrayRemove(`${roleId}`),
				});
		}
		catch (error) {
			console.error(error);
			return msg.reply(`There was an error while removing the role!\n${error}`);
		}

		for (const cachedRole of cachedAuthorizedRoles) {
			if (cachedAuthorizedRoles[cachedRole] == roleId) {
				cachedAuthorizedRoles.splice(cachedRole, 1);
			}
		}

		guildConfig.set('authorizedRoles', cachedAuthorizedRoles);
		return msg.channel.send(`${role} has been restricted to use permission restricted command!`);
	}
};