const {
	MessageEmbed,
} = require('discord.js');
const { trimString } = require('@util/util');

const EmbededPermBanInfoMessage = class EmbededPermBanInfoMessage extends MessageEmbed {
	constructor(bannedAt, bannedBy, playerName, playerId, banReason, userImage) {
		super();
		this.setTitle(`${playerName} Ban Information`);
		this.setThumbnail(userImage);
		this.setURL(`https://www.roblox.com/users/${playerId}`);
		this.setColor('EFFF00');
		this.setTimestamp();
		this.addFields({
			name: 'Player Id',
			value: playerId,
		}, {
			name: 'Ban Reason',
			value: trimString(banReason, 1024),
		}, {
			name: 'Banned By',
			value: bannedBy,
		}, {
			name: 'Banned At',
			value: bannedAt,
		});
	}
};

const EmbededTempBanInfoMessage = class EmbededTempBanInfoMessage extends EmbededPermBanInfoMessage {
	constructor(bannedAt, bannedBy, playerName, playerId, banReason, userImage, bannedUntil) {
		super(bannedAt, bannedBy, playerName, playerId, banReason, userImage);
		this.addField('Banned Until', bannedUntil);
	}
};

module.exports = {
	EmbededPermBanInfoMessage: EmbededPermBanInfoMessage,
	EmbededTempBanInfoMessage: EmbededTempBanInfoMessage,
};