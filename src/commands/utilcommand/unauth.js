const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'unauthorizerole',
			'unauthorize specific role to command that require permission assuming the role exits in the database',
			'unauthorizerole @role', {
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
		const { cachedAuthorizedRoles } = this.botClient;

		if (!msg.guild.roles.cache.find(guildRole => guildRole.id == roleId)) {
			return msg.channel.send('Make sure you input the correct role.');
		}

		try {
			await this.dataBase.collection('serverDataBase').doc('serverData')
				.update({
					authorizedRoles: this.firestore.FieldValue.arrayRemove(`${roleId}`),
				});
		}
		catch (error) {
			console.error(error);
			return msg.channel.send(`There was an error while removing the role!\n${error}`);
		}

		for (const storedRoleIdKey of cachedAuthorizedRoles) {
			if (cachedAuthorizedRoles[storedRoleIdKey] == roleId) {
				cachedAuthorizedRoles.splice(storedRoleIdKey, 1);
			}
		}
		return msg.channel.send(`${role} has been restricted to use permission restricted command!`);
	}
};