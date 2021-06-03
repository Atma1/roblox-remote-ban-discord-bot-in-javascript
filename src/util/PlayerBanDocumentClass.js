module.exports = class PlayerBanDocument {
	constructor(playerID, playerName, banReason, bannedBy, banType, bannedAt, bannedUntil) {
		this.banDetails = {
			playerID : playerID,
			playerName : playerName,
			banReason : banReason,
			banType : banType,
			bannedBy : bannedBy,
			bannedAt : bannedAt,
			bannedUntil : bannedUntil || 'Ban is permanent',
		};
	}
};