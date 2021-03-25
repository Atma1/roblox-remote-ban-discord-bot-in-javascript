module.exports = {
	name     : 'fartgument',
	desc     : 'check gurment',
	usage    : 'argumentos',
	cooldown :  5,
	args     : true,
	guildonly: true,
	async execute(message, args, DB) {
		if (args.length === 1) {
			const [ variable ] = args;
			try {
				DB.collection('Guilds-Server').doc(`Server: ${message.guild.id}`).update({
					'var' : variable,
				}).then(() => {
					return message.channel.send(`Var 'difrentiated' to ${variable}.`);
				}).catch(
					err => console.warn(err));
			}
			catch (error) {
				console.warn(error);
				return message.channel.send('There was an error!');
			}
		}
	},
};
