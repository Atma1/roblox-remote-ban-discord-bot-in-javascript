const Discord = require('discord.js');
const embedMessage = new Discord.MessageEmbed();
const { getUserImg } = require('./getUserImg');
module.exports = {
	newEmbedBanInfo: async (bannedAt, bannedBy, playerName, playerID, banReason) => {
		const playerImg = await getUserImg(playerID);
		embedMessage.setColor('DARK_NAVY');
		embedMessage.setURL(`https://www.roblox.com/users/${playerID}`);
		embedMessage.setTitle(`Ban Info For Player ${playerName}`);
		embedMessage.setThumbnail(playerImg);
		embedMessage.addFields(
			{ name: 'playerName', value: `${playerName}` },
			{ name: 'banReason', value: `${banReason}` },
			{ name: 'playerId', value: `${playerID}` },
			{ name: 'bannedBy', value: `${bannedBy}` },
			{ name: 'bannedAt', value: `${bannedAt}` },
		);
		embedMessage.setFooter('Vehicle is pitching downrange', 'https://www.nasaspaceflight.com/wp-content/uploads/2018/05/DSC_0025.jpg');
		embedMessage.setTimestamp();
		return embedMessage;
	},
};
