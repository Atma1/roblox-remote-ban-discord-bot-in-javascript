module.exports = {
	name: 'fartradar',
	desc: 'read gurment',
	usage: 'argumentos',
	cooldown: 5,
	args: true,
	guildonly: true,
	async execute(message, arg, DB) {
		const [playerId] = arg;
		// const serverDoc = `Server: ${message.guild.id}`;
		try {
			await DB.collection('Guilds-Server').doc(`Player: ${playerId}`).get().then(snap => {
				if (!snap.exists) {
					return message.channel.send(`No data exists for playerID: ${playerId}.`);
				}
				const data = snap.data();
				const keyData = Object.keys(data);
				keyData.forEach((key) => {
					return message.channel.send(`${key}: ${data[key]}`);
				});
			});
		}
		catch (error) {
			console.warn(error);
			return message.channel.send('There was an error while attempting to retrive deta!', error);
		}
	},
};