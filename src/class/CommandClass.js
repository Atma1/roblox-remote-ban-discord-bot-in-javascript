require('dotenv').config();
module.exports = class Command {
	constructor(botClient, name, desc, usage, commandOptions = {}) {
		this.name = name;
		this.desc = desc;
		this.usage = usage;
		this.botClient = botClient;
		this.aliases = commandOptions.aliases || false;
		this.example = commandOptions.example || false;
		this.cooldown = commandOptions.cooldown || 3;
		this.args = commandOptions.args || false;
		this.permission = commandOptions.permission || false;
		this.reqarglength = commandOptions.reqarglength || false;
		this.guildOwnerOnly = commandOptions.guildOwnerOnly || false;
	}
};