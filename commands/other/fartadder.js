const Guild_Server = 'Guilds-Server';
const { getUserID } = require('../../modules/getUserID');
const { newEmbedBanInfo } = require('../../modules/createEmbedMessage');
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
			const playerName = args.shift();
			const banReason = args.join(' ');
			const bannedAt = dateformat(new Date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
			const bannedBy = msg.author.tag;
			const playerID = await getUserID(playerName);
			DB.collection(Guild_Server).doc(`Player: ${playerID}`)
				.set({
					'playerID': `${playerID}`,
					'playerName':`${playerName}`,
					'banReason': `${banReason}`,
					'bannedBy': `${bannedBy}`,
					'bannedAt': `${bannedAt}`,
				}, {
					merge: true,
				})
				.then(async () => {
					const embed = await newEmbedBanInfo(bannedAt, bannedBy, playerName, playerID, banReason);
					msg.channel.send(`Player: ${playerName} has been banned.\n`, embed);
				});
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while banning the player!\n${error}`);
		}
	},
};