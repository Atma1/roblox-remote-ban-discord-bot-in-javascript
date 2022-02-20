module.exports = class SlashCommand {
	constructor(botClient, commandOptions) {
		this.commandName = commandOptions.commandName;
		this.desc = commandOptions.description;
		this.usage = commandOptions.usage;
		this.botClient = botClient;
		this.example = commandOptions.example || 'No example';
		this.defaultPermission = commandOptions.defaultPermission || true;
		this.slashCommandData = {
			name: this.commandName,
			description: this.desc,
			defaultPermission: commandOptions.defaultPermission ?? true,
			options: commandOptions.slashCommandOptions ?? false,
		};
	}
};