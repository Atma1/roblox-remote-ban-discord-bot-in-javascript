const CommandClass = require('@class/CommandClass');

module.exports = class ThePoopCommand extends CommandClass {
	constructor(botClient) {
		super(
			botClient,
			'poop',
			'make poop',
			'',
		);
	}
	execute(message) {
		return message.reply({ content:'pooper', allowedMentions: { repliedUser: true } });
	}
};