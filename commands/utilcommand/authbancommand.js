module.exports = {
	name : 'authorizebancommand',
	desc : 'authorize specific role to ban command',
	aliases : ['authban', 'permitban', 'authbanforrole', 'auth'],
	usage : 'roletobeauth',
	args: true,
	guildonly: true,
	permission: true,
	async execute(msg, args, DB, FV) {
		const roleId = args[0].toString().match(/[0-9]\d+/g);
		if (isNaN(roleId) || !msg.guild.roles.cache.find(guildRole => guildRole.id === `${roleId}`)) {
			return msg.channel.send('Make sure you input the correct role.');
		}
		try {
			const guildId = msg.guild.id;
			await DB.collection(`Server: ${guildId}`).doc(`Data for server: ${guildId}`)
				.update({
					'authorizedRoles' : FV.arrayUnion(`${roleId}`),
				});
			msg.channel.send(`${args} has been authorized to use the ban command!`);

		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while adding the role!\n${error}`);
		}

	},
};