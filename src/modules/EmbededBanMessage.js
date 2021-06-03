const {
	MessageEmbed,
} = require('discord.js');

const EmbededPermBanInfoMessage = class EmbededPermBanInfoMessage extends MessageEmbed {
	constructor(bannedAt, bannedBy, playerName, playerId, banReason, userImage) {
		super();
		this.setTitle(`${playerName} Ban Information`);
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
	}
};

const EmbededTempBanInfoMessage = class EmbededTempBanInfoMessage extends EmbededPermBanInfoMessage {
	constructor(bannedAt, bannedBy, playerName, playerId, banReason, userImage, bannedUntil) {
		super(bannedAt, bannedBy, playerName, playerId, banReason, userImage);
		this.addFields({
			name: 'Banned Until',
			value: `${bannedUntil}`,
		});
	}
};

module.exports = {
	EmbededPermBanInfoMessage: EmbededPermBanInfoMessage,
	EmbededTempBanInfoMessage: EmbededTempBanInfoMessage,
};