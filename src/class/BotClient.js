const {
	Client,
	Collection,
	Intents,
} = require('discord.js');
const util = require('@util/util');
const botIntents = new Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_INTEGRATIONS']);

module.exports = class BotClient extends Client {

	constructor(token) {
		super({ intents: botIntents });
		this.token = token;
		this.cooldowns = new Collection();
		this.commands = new Collection();
		this.guildConfig = new Collection();
	}

	startBot() {
		try {
			util.loadCommands(this);
			util.loadEvents(this);
			this.login(this.token);
		}
		catch (error) {
			console.error(error);
		}
	}
};