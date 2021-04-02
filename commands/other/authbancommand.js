module.exports = {
	name : 'authorizebancommand',
	desc : 'authorize specific role to ban command',
	aliases : ['authban', 'permitban', 'authbanforrole', 'auth'],
	usage : 'roletobeauth',
	args: true,
	guildonly: true,
	permission: ['BAN_MEMBERS'],
	execute(msg, args, DB, FV) {
		const roleId = args[0].toString().match(/[0-9]\d+/g);
		if (isNaN(roleId) || !msg.guild.roles.cache.find(guildRole => guildRole.id === `${roleId}`)) {
			return msg.channel.send('Make sure you input the correct role.');
		}
		try {
			DB.collection('Guilds-Server').doc('Server: 347291257665486858').update({
				'roleAuthBanCommand' : FV.arrayUnion(`${roleId}`),
			})
				.then(() => {
					msg.channel.send(`${args} has been authorized to use the ban command!`);
				})
				.catch(err => {
					throw (err);
				});
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while adding the role!\n${error}`);
		}

	},
};

// .match(/([0-9])\d+/g);