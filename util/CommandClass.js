require('dotenv').config();
module.exports = class Command {
	constructor(name, desc, usage, commandOptions = {}) {
		this.name = name;
		this.desc = desc;
		this.usage = usage;
		this.prefix = process.env.prefix;
		this.aliases = commandOptions.aliases || false;
		this.example = commandOptions.example || 'No example';
		this.cooldown = commandOptions.cooldown || 3;
		this.args = commandOptions.args || false;
		this.guildonly = commandOptions.guildonly || false;
		this.permission = commandOptions.permission || false;
		this.reqarglength = commandOptions.reqarglength || false;
	}
};