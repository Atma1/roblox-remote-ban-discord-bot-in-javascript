module.exports = class SlashCommand {
	constructor(botClient, name, desc, usage, commandOptions = {}) {
		this.name = name;
		this.desc = desc;
		this.usage = usage;
		this.botClient = botClient;
		this.example = commandOptions.example || false;
		this.reqarglength = commandOptions.reqarglength || false;
		this.guildOwnerOnly = commandOptions.guildOwnerOnly || false;
		this.slashCommandData = {
			name: this.name,
			description: this.desc,
			defaultPermission: commandOptions.defaultPermission ?? true,
			options: commandOptions.slashCommandOptions ?? false,
		};
	}
};