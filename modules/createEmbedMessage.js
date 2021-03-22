const Discord = require('discord.js');
const embedMessage = new Discord.embedMessage();
module.exports = {
	newEmbedBanInfo: (bannedAt, bannedBy, playerName, playerID, banReason, playerImg) => {
		const playerImg =
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
