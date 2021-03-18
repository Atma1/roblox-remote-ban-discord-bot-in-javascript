const Guild_Server = 'Guilds-Server';
const { getUserID } = require('../../modules/getUserID');
module.exports = {
	name: 'fartgone',
	desc: 'remove gurment',
	usage: 'argumentos',
	cooldown: 5,
	guildonly: true,
	async execute(msg, args, DB) {
		const [ userName ] = args;
		console.log(userName);
		try {
			const playerID = await getUserID(userName);
			DB.collection(Guild_Server).doc(`Player: ${playerID}`)
				.delete()
				.then(() => {
					return msg.channel.send(`Player: ${playerID}, removed from Firebase Firestore.`);
				})
				.catch((error) => {
					throw(error);
				});
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while removing ${userName}!\n${error}`);
		}
	},
};