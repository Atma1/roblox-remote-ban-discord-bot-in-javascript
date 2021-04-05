const { getUserID } = require('../../modules/getUserID');
module.exports = {
	name: 'fartgone',
	desc: 'remove gurment',
	usage: 'playerusername',
	aliases: ['ub', 'unban'],
	args : true,
	cooldown: 5,
	permission: true,
	guildonly: true,
	async execute(msg, args, DB) {
		const [ userName ] = args;
		console.log(userName);
		try {
			const guildId = msg.guild.id;
			const playerID = await getUserID(userName);
			DB.collection(`Server: ${guildId}`).doc(`Player: ${playerID}`)
				.delete()
				.then(() => {
					return msg.channel.send(`Player: ${userName}, removed from Firebase Firestore.`);
				})
				.catch((error) => {
					throw new Error(error);
				});
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while removing ${userName}!\n${error}`);
		}
	},
};