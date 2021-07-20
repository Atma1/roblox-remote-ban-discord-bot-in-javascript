const { MessageButton } = require('discord.js');

module.exports = class PlayerProfileButton extends MessageButton {
	constructor(playerId) {
		super();
		this.setURL(`https://www.roblox.com/users/${playerId}`);
		this.setLabel('Visit the player profile');
		this.setStyle('LINK');
	}
};