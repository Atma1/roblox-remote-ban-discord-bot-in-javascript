const Discord = require('discord.js');
const { getUserImg } = require('./getUserImg');
module.exports = {
	newEmbedBanInfo: async (bannedAt, bannedBy, playerName, playerID, banReason) => {
		const playerImg = await getUserImg(playerID)
			.catch((error) => {
				throw (error);
			});
		const embedMessage = new Discord.MessageEmbed();
		embedMessage.setColor('DARK_NAVY');
		embedMessage.setURL(`https://www.roblox.com/users/${playerID}`);
		embedMessage.setTitle(`Ban Info For Player ${playerName}`);
		embedMessage.setThumbnail(playerImg);
		embedMessage.addFields(
			{ name: 'Player Name', value: `${playerName}`, inline : true },
			{ name: 'Player Id', value: `${playerID}`, inline : true },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Ban Reason', value: `${banReason}`, inline : true },
			{ name: 'Banned By', value: `${bannedBy}`, inline : true },
			{ name: 'Banned At', value: `${bannedAt}` },
		);
		embedMessage.setFooter('Vehicle is pitching downrange', 'https://www.nasaspaceflight.com/wp-content/uploads/2018/05/DSC_0025.jpg');
		embedMessage.setTimestamp();
		return embedMessage;
	},
};
