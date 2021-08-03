const { MessageEmbed } = require('discord.js');

module.exports = class CommandListEmbed extends MessageEmbed {
	constructor(commands) {
		super();
		this.setTitle('Commands List:');
		this.addField(
			'Important to Know❗', 'If you want info on specific command send /help [commandName] and don\'t send it here!',
		);
		this.setDescription(commands.map(cmd => cmd.name).join(', '));
	}
};