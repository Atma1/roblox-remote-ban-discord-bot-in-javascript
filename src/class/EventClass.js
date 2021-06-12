module.exports = class EventClass {
	constructor(botClient, eventType, eventEmmiter) {
		this.botClient = botClient;
		this.eventType = eventType;
		this.eventEmmiter = eventEmmiter;
	}
};