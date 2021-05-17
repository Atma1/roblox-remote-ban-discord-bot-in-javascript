const CommandClass = require('../../util/CommandClass');

module.exports = class extends CommandClass {
	constructor() {
		super(
			'poop',
			'make poop',
			'poop',
		);
	}
	execute(message) {
		return message.reply('pooper');
	}
};