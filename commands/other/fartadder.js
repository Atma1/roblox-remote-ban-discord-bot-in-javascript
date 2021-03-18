const Guild_Server = 'Guilds-Server';
const { getUserID } = require('../../modules/getUserID');
const dateformat = require('dateformat');
module.exports = {
	name: 'fartadder',
	desc: 'add gurment',
	usage: 'argumentos',
	cooldown: 5,
	args: true,
	guildonly: true,
	arglength: 2,
	async execute(msg, args, DB) {
		try {
			if (args.length < this.arglength) {
				throw new Error(`Expected 2 arguments. Got ${args.length} instead.`);
			}
			const userName = args.shift();
			const banReason = args.join(' ');
			const playerID = await getUserID(userName);
			DB.collection(Guild_Server).doc(`Player: ${playerID}`).set({
				'playerID': `${playerID}`,
				'playerName':`${userName}`,
				'banReason': `${banReason}`,
				'bannedBy': `${msg.author.tag}`,
				'bannedAt': dateformat(new Date, 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
			}, {
				merge: true,
			})
				.then(() => {
					msg.channel.send(`Player: ${userName} has been banned.\nReason: ${banReason}.`);
				});
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while banning the player!\n${error}`);
		}
	},
};