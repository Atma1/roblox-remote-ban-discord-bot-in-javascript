const EventClass = require('@class/EventClass');
const runAutoUnban = require('@modules/runAutoUnbaan');
const ms = require('ms');


module.exports = class ReadyEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'ready',
			'once',
		);
	}
	async execute() {
		console.log(`${this.botClient.user.tag} is ready!`);

		runAutoUnban(this.botClient);
		setTimeout(() => {
			runAutoUnban(this.botClient);
		}, ms('10m'));
	}
};