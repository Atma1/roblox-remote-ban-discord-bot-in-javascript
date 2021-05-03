const CommandClass = require('../../util/CommandClass');
const { MessageEmbed } = require('discord.js');

module.exports = class extends CommandClass {
	constructor() {
		super(
			'help',
			'give help and info on the specified command',
			{	aliases: ['help!11!!1', 'cmdinfo', 'command', 'cmd', 'commandinfo', 'cmds'],
				example: '!cmdinfo ban',
				cooldown: 5,
				guildonly: true,
			},
		);
	}
	async execute(message, args) {
		const data = [];
		const embed = new MessageEmbed;
		const {
			commands,
		} = message.client;

		if (!args.length) {
			data.push('Here\'s a list of my commands');
			data.push(commands.map(cmd => cmd.name).join(', '));
			data.push(`\nIf you want info on specific command send \`${this.prefix}help [command name]\` and don'\t send it here!`);
			try {
				await message.author.send(data, { split: true });
				return message.reply('Sent all of my commands to your DM.');
			}
			catch (error) {
				console.error(error);
				return message.reply('Can\'t send my commands to your DM! Is your DM closed?.');
			}
		}

		const [ cmdName ] = args;
		cmdName.toLowerCase();
		const command = commands.get(cmdName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

		if (!command) {
			return message.reply('Make sure you type the correct command.');
		}

		embed.setColor('DARK_NAVY');
		embed.setTitle('Command Information');
		embed.addFields(
			{ name: 'Command Name:', value: `${command.name}` },
			{ name: 'Command Desc:', value: `${command.desc}` },
			{ name: 'Command Cooldown:', value: `${command.cooldown || 3} second(s)` },
		);
		if (command.aliases) {
			embed.addFields({ name: 'Command Aliases:', value: `${command.aliases.join(', ')}` });
		}
		if (command.example) {
			embed.addFields({ name: 'Command Example:', value: `${command.example}` });
		}
		if (command.permission) {
			embed.addFields({ name: 'Require Permission:', value: true });
		}
		message.channel.send(embed);
	}
};