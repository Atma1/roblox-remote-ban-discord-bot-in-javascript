const DataBaseRelatedCommandClass = require('../../util/DataBaseRelatedCommandClass');

module.exports = class extends DataBaseRelatedCommandClass {
	constructor() {
		super(
			'authorizerole',
			'authorize specific role to ban command',
			'@roletobeauth',
			{
				aliases: ['authban', 'permitban', 'authbanforrole', 'auth'],
				example: '!auth @joemama',
				args: true,
				guildonly: true,
				permission: true,
			});
	}

	async execute(msg, args) {
		const roleId = args[0].toString().match(/[0-9]\d+/g);
		if (!msg.guild.roles.cache.find(guildRole => guildRole.id === `${roleId}`)) {
			return msg.channel.send('Make sure you input the correct role.');
		}
		try {
			const guildId = msg.guild.id;
			await this.dataBase.collection(`Server: ${guildId}`).doc(`Data for server: ${guildId}`)
				.update({
					'authorizedRoles': this.FieldValue.arrayUnion(`${roleId}`),
				});
			msg.channel.send(`${args} has been authorized to use the ban command!`);
		}
		catch (error) {
			console.error(error);
			return msg.channel.send(`There was an error while adding the role!\n${error}`);
		}

	}
};