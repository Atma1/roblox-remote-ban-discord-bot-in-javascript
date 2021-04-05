const { getUserID } = require('../../modules/getUserID');
const { newEmbedBanInfo } = require('../../modules/createEmbedMessage');
const dateformat = require('dateformat');

module.exports = {
	name: 'fartadder',
	desc: 'add gurment',
	usage: 'username banreason',
	aliases: ['ban', 'addban', 'banplayer'],
	cooldown: 5,
	args: true,
	guildonly: true,
	permission: true,
	reqarglength: 2,
	async execute(msg, args, DB) {
		try {
			const guildId = msg.guild.id;
			const playerName = args.shift();
			const banReason = args.join(' ');
			const bannedAt = dateformat(new Date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
			const bannedBy = msg.author.tag;
			const playerID = await getUserID(playerName);
			DB.collection(`Server: ${guildId}`).doc(`Player: ${playerID}`)
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
					msg.channel.send(`\`Player: ${playerName} has been banned\``, embed);
				});
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while banning the player!\n${error}`);
		}
	},
};