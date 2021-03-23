const Discord = require('discord.js');
const embedMessage = new Discord.MessageEmbed();
const { getUserImg } = require('./getUserImg');
module.exports = {
	newEmbedBanInfo: async (bannedAt, bannedBy, playerName, playerID, banReason) => {
		const playerImg = await getUserImg(playerID);
		embedMessage.setColor('RED');
		embedMessage.setTitle(`Ban info for player ${playerName}`);
		embedMessage.setThumbnail(playerImg);
		embedMessage.addFields(
			{ name: 'PlayerName', value: `${playerName}` },
			{ name: 'PlayerId', value: `${playerID}` },
			{ name: 'banReason', value: `${banReason}` },
			{ name: 'bannedBy', value: `${bannedBy}` },
			{ name: 'bannedAt', value: `${bannedAt}` },
		);
		return embedMessage;
	},
};
