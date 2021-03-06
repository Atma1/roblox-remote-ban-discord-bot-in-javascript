const EventClass = require('@class/Event/EventClass');

module.exports = class InteractionCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'interactionCreate',
			'on',
		);
	}
	execute(interaction) {
		if (!interaction.isCommand()) return;

		if (!interaction.inGuild()) return;

		const { slashCommands } = this.botClient;
		const { commandName } = interaction;
		const slashCommand = slashCommands.get(commandName);

		if (!slashCommand) return;

		try {
			const { options } = interaction;
			slashCommand.execute(interaction, options);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: `${error}`, ephemeral: true })
				.catch(err => console.error(err));
		}
	}
};