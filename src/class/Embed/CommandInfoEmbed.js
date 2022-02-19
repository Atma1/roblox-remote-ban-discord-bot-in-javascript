const { MessageEmbed } = require('discord.js');

module.exports = class EmbededCommandInfoMessage extends MessageEmbed {
	constructor(command, commnandName) {
		super();
		this.setColor('#EFFF00');
		this.setTitle('Command Information');
		this.addFields({
			name: 'Command Name:',
			value: command.name,
		}, {
			name: 'Command Desc:',
			value: command.desc,
		}, {
			name: 'Command Usage:',
			value: `/${commnandName} ${command.usage}`,
		}, {
			name: 'Command Example:',
			value: command.example,
		},	{
			name: 'Owner Only:',
			value: command.guildOwnerOnly,
		}, {
			name: 'Require Permission:',
			value: command.defaultPermission,
		});
	}
};