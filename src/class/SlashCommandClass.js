module.exports = class SlashCommand {
	constructor(botClient, name, desc, usage, commandOptions = {}) {
		this.name = name;
		this.desc = desc;
		this.usage = usage;
		this.botClient = botClient;
		this.aliases = commandOptions.aliases || false;
		this.example = commandOptions.example || false;
		this.cooldown = commandOptions.cooldown || '3s';
		this.permission = commandOptions.permission || false;
		this.reqarglength = commandOptions.reqarglength || false;
		this.guildOwnerOnly = commandOptions.guildOwnerOnly || false;
		this.slashCommandData = {
			name: this.name,
			description: this.desc,
			options: commandOptions.slashCommandOptions || false,
		};
	}
};