module.exports = class EventClass {
	constructor(botClient, eventOptions) {
		this.botClient = botClient;
		this.eventType = eventOptions.eventType;
		this.eventEmitter = eventOptions.eventEmitter;
	}
};