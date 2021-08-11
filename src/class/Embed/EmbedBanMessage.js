const { MessageEmbed } = require('discord.js');

const PermBanInfoEmbed = class PermBanInfoEmbed extends MessageEmbed {
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
			value: banReason,
		}, {
			name: 'Banned By',
			value: bannedBy,
		}, {
			name: 'Banned At',
			value: bannedAt,
		});
	}
};

const TempBanInfoEmbed = class TempBanInfoEmbed extends PermBanInfoEmbed {
	constructor(bannedAt, bannedBy, playerName, playerId, banReason, userImage, bannedUntil) {
		super(bannedAt, bannedBy, playerName, playerId, banReason, userImage);
		this.addField('Banned Until', bannedUntil);
	}
};

module.exports = {
	PermBanInfoEmbed: PermBanInfoEmbed,
	TempBanInfoEmbed: TempBanInfoEmbed,
};