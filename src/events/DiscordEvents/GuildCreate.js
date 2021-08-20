const EventClass = require('@class/Event/EventClass');
const { setupGuildConfigAndCommand } = require('@modules/GuildConfig');

module.exports = class GuildCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'guildCreate',
			'on',
		);
	}
	execute(guildData) {
		setupGuildConfigAndCommand(guildData, this.botClient);
	}
};