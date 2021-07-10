const EventClass = require('@class/EventClass');

module.exports = class GuildCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'guildCreate',
			'on',
		);
	}
	execute(guildData) {
		console.log(`This bot has been added to guild with an ID of ${guildData.id}`);
	}
};