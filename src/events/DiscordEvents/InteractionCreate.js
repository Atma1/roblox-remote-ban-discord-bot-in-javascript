const EventClass = require('@class/EventClass');

module.exports = class GuildCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'interactionCreate',
			'on',
		);
	}
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		if (!interaction.inGuild()) return;

		const { slashCommandsData } = this.botClient;
		const { commandName } = interaction;
		const slashCommand = slashCommandsData.get(commandName) ||
		slashCommandsData.find(command => command.aliases && command.aliases.includes(commandName));

		if (!slashCommand) return;

		try {
			const { options } = interaction;
			slashCommand.execute(interaction, options);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: `${error}`, ephemeral: true,
				allowedMentions: { repliedUser: true } })
				.catch(err => console.error(err));
		}
	}
};