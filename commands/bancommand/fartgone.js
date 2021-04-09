const { getUserID } = require('../../modules/getUserID');

module.exports = {
	name: 'fartgone',
	desc: 'remove player from the database assuming the player is in the database',
	usage: 'playerusername',
	aliases: ['ub', 'unban'],
	args : true,
	cooldown: 5,
	permission: true,
	guildonly: true,
	async execute(msg, args, DB) {
		const [ userName ] = args;
		try {
			const guildId = msg.guild.id;
			const playerID = await getUserID(userName);
			await DB.collection(`Server: ${guildId}`).doc(`Player: ${playerID}`).delete();
			return msg.channel.send(`Player: ${userName}, removed from Firebase Firestore.`);
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while removing ${userName}!\n${error}`);
		}
	},
};