const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'authorizerole',
			'authorize specific role to command that require permission',
			'authorizerole @role', {
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
		const { cachedAuthorizedRoles } = this.botClient;

		if (!msg.guild.roles.cache.find(guildRole => guildRole.id === `${roleId}`)) {
			return msg.channel.send('Make sure you input the correct role.');
		}

		try {
			await this.dataBase.collection('serverDataBase').doc('serverData')
				.update({
					authorizedRoles: this.firestore.FieldValue.arrayUnion(`${roleId}`),
				});
		}
		catch (error) {
			console.error(error);
			return msg.channel.send(`There was an error while adding the role!\n${error}`);
		}

		cachedAuthorizedRoles.push(roleId);
		return msg.channel.send(`${role} has been authorized to use permission restricted command!`);
	}
};