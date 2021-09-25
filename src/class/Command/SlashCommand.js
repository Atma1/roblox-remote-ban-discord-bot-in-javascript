module.exports = class SlashCommand {
	constructor(botClient, commandOptions) {
		this.name = commandOptions.name;
		this.desc = commandOptions.description;
		this.usage = commandOptions.usage;
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