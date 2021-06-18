const CommandClass = require('@class/CommandClass');

module.exports = class ThePoopCommand extends CommandClass {
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