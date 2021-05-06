const {
	MessageEmbed,
} = require('discord.js');

module.exports = class EmbededBanInfoMessage extends MessageEmbed {
	constructor(bannedAt, bannedBy, playerName, playerId, banReason, userImage) {
		super();
		super.setTitle(`Ban Info for Player ${playerName}`);
		super.setThumbnail(userImage);
		super.setURL(`https://www.roblox.com/users/${playerId}`);
		super.setColor('EFFF00');
		super.setTimestamp();
		super.addFields({
			name: 'Player Name',
			value: `${playerName}`,
			inline: true,
		}, {
			name: 'Player Id',
			value: `${playerId}`,
			inline: true,
		}, {
			name: '\u200B',
			value: '\u200B',
		}, {
			name: 'Ban Reason',
			value: `${banReason}`,
			inline: true,
		}, {
			name: 'Banned By',
			value: `${bannedBy}`,
			inline: true,
		}, {
			name: 'Banned At',
			value: `${bannedAt}`,
		});
		return this;
	}
};