const EventClass = require('@class/Event/EventClass');
const { setupGuildConfigAndCommand } = require('@modules/guildConfig');

module.exports = class GuildCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			{
				eventType:'guildCreate',
				eventEmitter:'on',
			},
		);
	}
	execute(guildData) {
		setupGuildConfigAndCommand(guildData, this.botClient);
	}
};