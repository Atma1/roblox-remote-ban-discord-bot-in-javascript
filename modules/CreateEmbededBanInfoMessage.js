const {
	MessageEmbed,
} = require('discord.js');

module.exports = class EmbededBanInfoMessage extends MessageEmbed {
	constructor(bannedAt, bannedBy, playerName, playerID, banReason, userImage) {
		super();
		super.setTitle(`Ban Info For Player ${playerName}`);
		super.setThumbnail(userImage);
		super.setURL(`https://www.roblox.com/users/${playerID}`);
		super.setColor('DARK_NAVY');
		super.setTimestamp();
		super.addFields({
			name: 'Player Name',
			value: `${playerName}`,
			inline: true,
		}, {
			name: 'Player Id',
			value: `${playerID}`,
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