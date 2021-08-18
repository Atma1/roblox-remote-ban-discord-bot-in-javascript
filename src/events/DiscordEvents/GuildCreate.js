const EventClass = require('@class/Event/EventClass');
const { setupGuildConfig } = require('@modules/GuildConfig');

module.exports = class GuildCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'guildCreate',
			'on',
		);
	}
	execute(guildData) {
		const { id:guildId } = guildData;
		setupGuildConfig(guildId, this.botClient);
	}
};