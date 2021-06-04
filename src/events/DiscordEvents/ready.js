const EventClass = require('@util/EventClass');

module.exports = class ReadyEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'ready',
			'once',
		);
	}
	execute() {
		console.log(`${this.botClient.user.tag} is ready!`);
	}
};