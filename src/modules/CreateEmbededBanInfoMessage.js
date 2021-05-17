const {
	MessageEmbed,
} = require('discord.js');

module.exports = class EmbededBanInfoMessage extends MessageEmbed {
	constructor(bannedAt, bannedBy, playerName, playerId, banReason, userImage) {
		super();
		this.setTitle(`Ban Info for Player ${playerName}`);
		this.setThumbnail(userImage);
		this.setURL(`https://www.roblox.com/users/${playerId}`);
		this.setColor('EFFF00');
		this.setTimestamp();
		this.addFields({
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