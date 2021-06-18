const { MessageEmbed } = require('discord.js');

module.exports = class EmbededCommandInfoMessage extends MessageEmbed {
	constructor(command, prefix, commnandName) {
		super();
		this.setColor('#EFFF00');
		this.setTitle('Command Information');
		this.addFields({
			name: 'Command Name:',
			value: `${command.name}`,
		}, {
			name: 'Command Desc:',
			value: `${command.desc}`,
		}, {
			name: 'Command Cooldown:',
			value: `${command.cooldown}`,
		}, {
			name: 'Command Usage:',
			value: `${prefix}${commnandName} ${command.usage}`,
		}, {
			name: 'Command Example:',
			value: command.exampe ? `${prefix}${command.example}` : 'No example',
		}, {
			name: 'Command Aliases:',
			value: command.aliases ? command.aliases.join(', ') : 'No aliases',
		}, {
			name: 'Owner Only:',
			value: command.ownerOnly ? true : false,
		}, {
			name: 'Require Permission:',
			value: command.permission ? true : false,
		});
	}
};