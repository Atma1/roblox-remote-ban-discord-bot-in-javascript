require('dotenv').config();
const prefix = process.env.prefix;
const CommandClass = require('../../util/CommandClass');

module.exports = class extends CommandClass {
	constructor() {
		super(
			'help',
			'give help',
			'commandname',
			{	aliases: ['help!11!!1', 'cmdinfo', 'command', 'cmd', 'commandinfo', 'cmds'],
				example: '!cmdinfo ban',
				cooldown: 5,
				guildonly: true },
		);
	}

	execute(message, args) {
		const data = [];
		const {
			commands,
		} = message.client;

		if (!args.length) {
			data.push('Here\'s a list of my commands');
			data.push(commands.map(cmd => cmd.name).join(', '));
			data.push(`\nIf you want info on specific command send \`${prefix}help [command name]\` and don'\t send it here!`);

			return message.author.send(data, {
				split: true,
			})
				.then(() => {
					message.reply('Sent all of my cmds to your DM.');
				})
				.catch(err => {
					console.error(err);
					message.reply('Can\'t send my cmds to your DM! Is your DM closed?.');
				});
		}
		const [ cmdName ] = args;
		cmdName.toLowerCase();
		const command = commands.get(cmdName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

		if (!command) {
			return message.reply('Make sure you type the correct command.');
		}

		data.push(`**Name:** ${command.name}`);
		data.push(`**Cooldown:** ${command.cooldown || 3} second(s).`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}.`);
		if (command.desc) data.push(`**Desc:** ${command.desc}.`);
		if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
		if (command.example) data.push(`**Example:** ${command.example}`);
		if (command.permission) data.push('**Require permission:** True.');

		message.channel.send(data, {
			split: true,
		});
	}
};