const {
	Client,
	Collection,
} = require('discord.js');
const util = require('@util/util');
require('@structures/GuildConfig');

module.exports = class BotClient extends Client {

	constructor(token) {
		super();
		this.token = token;
		this.cooldowns = new Collection();
		this.commands = new Collection();
	}

	startBot() {
		try {
			util.loadCommands(this);
			util.loadEvents(this);
			super.login(this.token);
		}
		catch (error) {
			console.error(error);
		}
	}
};