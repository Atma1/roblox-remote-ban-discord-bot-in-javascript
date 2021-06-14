const CommandClass = require('@class/CommandClass');
const {
	MessageEmbed,
} = require('discord.js');

module.exports = class HelpCommand extends CommandClass {
	constructor(botClient) {
		super(
			botClient,
			'help',
			'give help and info on the specified command',
			'<commandName/noCommandName>', {
				aliases: ['cmdinfo', 'command', 'cmd', 'commandinfo', 'cmds'],
				example: 'help ban or just help',
				cooldown: 5,
			},
		);
	}
	async execute(message, args) {
		const commandInfoEmbed = new MessageEmbed;
		const prefix = message.guild.guildConfig.get('defaultPrefix');
		const {
			commands,
		} = this.botClient;

		if (!args.length) {
			commandInfoEmbed.setTitle('Commands List');
			commandInfoEmbed.addField(
				'Important to Know❗', `If you want info on specific command send ${prefix}help [commandName] and don't send it here!`,
			);
			commandInfoEmbed.setDescription(commands.map(cmd => cmd.name).join(', '));

			try {
				await message.author.send(commandInfoEmbed);
				return message.reply('sent all of my commands to your DM.');
			}
			catch (error) {
				console.error(error);
				return message.reply('can\'t send my commands to your DM! Is your DM closed?');
			}
		}

		const [cmdName] = args;
		cmdName.toLowerCase();
		const command = commands.get(cmdName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

		if (!command) {
			return message.reply('make sure you type the correct command.');
		}

		commandInfoEmbed.setColor('#EFFF00');
		commandInfoEmbed.setTitle('Command Information');
		commandInfoEmbed.addFields({
			name: 'Command Name:',
			value: `${command.name}`,
		}, {
			name: 'Command Desc:',
			value: `${command.desc}`,
		}, {
			name: 'Command Cooldown:',
			value: `${command.cooldown || 3} second(s)`,
		}, {
			name: 'Command Usage:',
			value: `${prefix}${cmdName} ${command.usage}`,
		});

		if (command.example) {
			commandInfoEmbed.addField('Command Example:', `${prefix}${command.example}`);
		}
		if (command.aliases) {
			commandInfoEmbed.addField('Command Aliases:', `${command.aliases.join(', ')}`);
		}
		if (command.args) {
			commandInfoEmbed.addField('Require arguments:', true);
		}
		if (command.guildOwnerOnly) {
			commandInfoEmbed.addField('Owner Only:', true);
		}
		if (command.permission) {
			commandInfoEmbed.addField('Require Permission:', true);
		}
		message.channel.send(commandInfoEmbed);
	}
};