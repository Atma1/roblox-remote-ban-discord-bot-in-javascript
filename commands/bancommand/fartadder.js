const { getUserID } = require('../../modules/getUserID');
const EmbededBanInfoMessage = require('../../modules/CreateEmbededBanInfoMessage');
const { getUserImg } = require('../../modules/getUserImg');
const dateformat = require('dateformat');

module.exports = {
	name: 'fartadder',
	desc: 'ban player. as of now the ban is permanent',
	usage: 'username banreason',
	aliases: ['ban', 'addban', 'banplayer'],
	example: '!ban joemama joemama is too fat',
	cooldown: 5,
	args: true,
	guildonly: true,
	permission: true,
	reqarglength: 2,
	async execute(msg, args, DB) {
		const guildId = msg.guild.id;
		const playerName = args.shift();
		const banReason = args.join(' ');
		const bannedAt = dateformat(new Date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
		const bannedBy = msg.author.tag;
		try {
			const playerID = await getUserID(playerName);
			const playerImage = await getUserImg(playerID);
			await DB.collection(`Server: ${guildId}`).doc(`Player: ${playerID}`)
				.set({
					'playerID': `${playerID}`,
					'playerName':`${playerName}`,
					'banReason': `${banReason}`,
					'bannedBy': `${bannedBy}`,
					'bannedAt': `${bannedAt}`,
				}, {
					merge: true,
				});
			const embed = new EmbededBanInfoMessage(
				bannedAt, bannedBy, playerName, playerID, banReason, playerImage,
			);
			msg.channel.send(`\`Player: ${playerName} has been banned\``, embed);
		}
		catch (error) {
			console.warn(error);
			return msg.channel.send(`There was an error while banning the player!\n${error}`);
		}
	},
};