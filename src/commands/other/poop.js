const CommandClass = require('../../util/CommandClass');

module.exports = class extends CommandClass {
	constructor(botClient) {
		super(
			botClient,
			'poop',
			'make poop',
			'poop',
		);
	}
	execute(message) {
		return message.reply('pooper');
	}
};