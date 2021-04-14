const { Client } = require('discord.js');
const util = require('../util/util');

module.exports = class DiscordClient extends Client {
	constructor(token) {
		super();
		this.token = token;
	}
	async startBot() {
		util.loadCommands(this);
		util.loadEvents(this);
		super.login(this.token);
	}
};